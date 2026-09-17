import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import CATALOG from "./catalog.json" assert { type: "json" };

const ANTHROPIC = Deno.env.get("ANTHROPIC_API_KEY")!;
const N8N_URL = Deno.env.get("N8N_WEBHOOK_COTIZACION")!;
const N8N_TOKEN = Deno.env.get("N8N_WEBHOOK_TOKEN")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

// ─── Claude ───────────────────────────────────────────────────────────────────

async function claude(prompt: string, pdfBase64?: string): Promise<string> {
  const content: unknown[] = [];
  if (pdfBase64) {
    content.push({
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: pdfBase64 },
    });
  }
  content.push({ type: "text", text: prompt });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

// ─── Session ──────────────────────────────────────────────────────────────────

async function getSession(sid: string) {
  const { data } = await supabase
    .from("bot_sessions")
    .select("*")
    .eq("chat_id", sid)
    .maybeSingle();
  return data;
}

async function setSession(sid: string, patch: Record<string, unknown>) {
  await supabase.from("bot_sessions").upsert({
    chat_id: sid,
    updated_at: new Date().toISOString(),
    ...patch,
  });
}

async function resetSession(sid: string) {
  await setSession(sid, { step: "idle", client_data: null, products: null, asesor: null, valor_tonelada: null });
}

// ─── Client parsing ───────────────────────────────────────────────────────────

interface ClientData {
  nombre: string | null; nit: string | null; cedula: string | null;
  email: string | null; telefono: string | null; ciudad: string | null;
  direccion: string | null; empresa: string | null;
}

async function parseClient(text: string, pdfBase64?: string): Promise<ClientData | null> {
  const prompt = `Eres un asistente de ventas colombiano. Extrae los datos del cliente del siguiente ${pdfBase64 ? "documento RUT/PDF" : "texto"}.
Devuelve SOLO un JSON válido con estos campos (null si no está presente):
{"nombre":string|null,"nit":string|null,"cedula":string|null,"email":string|null,"telefono":string|null,"ciudad":string|null,"direccion":string|null,"empresa":string|null}
${pdfBase64 ? "" : `Texto: "${text}"`}`;

  const raw = await claude(prompt, pdfBase64);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]) as ClientData; } catch { return null; }
}

// ─── Product matching ─────────────────────────────────────────────────────────

interface ProductLine {
  codigo: string; nombre: string; acabado: string; cantidad: number; nota?: string;
}

interface ProductsResult {
  products: ProductLine[];
  valor_tonelada: number | null;
}

async function matchProducts(text: string): Promise<ProductsResult> {
  const prompt = `Eres un asistente de ventas de materiales de construcción colombiano.
Del siguiente pedido extrae los productos solicitados y busca el mejor match en el catálogo.

Catálogo disponible (JSON):
${JSON.stringify(CATALOG)}

Pedido del asesor: "${text}"

Devuelve SOLO un JSON con este formato exacto:
{"products":[{"codigo":string,"nombre":string,"acabado":string,"cantidad":number,"nota":string|null}],"valor_tonelada":number|null}

Reglas:
- Si la cantidad no se especifica, asume 1.
- valor_tonelada: extrae si el asesor escribe "tonelada 300.000" o "valor tonelada $300 mil". "300 mil"=300000. Si no se menciona, null.
- NO incluir valor_tonelada como producto.
- Si un producto no tiene código, usa "SIN_CODIGO".`;

  const raw = await claude(prompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return { products: [], valor_tonelada: null };
  try {
    const parsed = JSON.parse(match[0]);
    return {
      products: Array.isArray(parsed.products) ? parsed.products : [],
      valor_tonelada: typeof parsed.valor_tonelada === "number" ? parsed.valor_tonelada : null,
    };
  } catch { return { products: [], valor_tonelada: null }; }
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatClient(c: ClientData): string {
  const lines: string[] = [`**${c.nombre || "Sin nombre"}**`];
  if (c.empresa) lines.push(`🏢 ${c.empresa}`);
  if (c.nit) lines.push(`🪪 NIT: ${c.nit}`);
  else if (c.cedula) lines.push(`🪪 CC: ${c.cedula}`);
  if (c.telefono) lines.push(`📱 ${c.telefono}`);
  if (c.email) lines.push(`✉️ ${c.email}`);
  if (c.ciudad) lines.push(`📍 ${c.ciudad}`);
  if (c.direccion) lines.push(`🏠 ${c.direccion}`);
  return lines.join("\n");
}

function formatProducts(products: ProductLine[]): string {
  return products.map((p, i) => {
    const cod = p.codigo && p.codigo !== "SIN_CODIGO" && p.codigo !== "NO_ENCONTRADO"
      ? ` \`${p.codigo}\`` : " *(sin código)*";
    const nota = p.nota ? `\n   ⚠️ ${p.nota}` : "";
    return `${i + 1}. **${p.nombre}** — ${p.acabado}${cod}\n   Cantidad: ${p.cantidad}${nota}`;
  }).join("\n\n");
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let body: { session_id: string; message?: string; pdf_base64?: string };
  try { body = await req.json(); }
  catch { return json({ error: "invalid json" }, 400); }

  const { session_id, message = "", pdf_base64 } = body;
  if (!session_id) return json({ error: "session_id required" }, 400);

  const sid = `web_${session_id}`;
  const text = message.trim();
  const session = await getSession(sid);
  const step = (session?.step as string) ?? "idle";

  // ── reset ──────────────────────────────────────────────────────────────────
  if (text === "/cancelar" || text === "/reset") {
    await resetSession(sid);
    return json({ reply: "❌ Cotización cancelada. Envía los datos de un cliente para empezar de nuevo.", step: "idle" });
  }

  // ── confirmar ──────────────────────────────────────────────────────────────
  if (step === "awaiting_confirm" && (text === "si" || text === "sí" || text === "/si" || text === "confirmar")) {
    const clientData = session?.client_data as ClientData;
    const products = session?.products as ProductLine[];
    const valorTonelada = session?.valor_tonelada as number | null;

    if (!clientData || !products) {
      await resetSession(sid);
      return json({ reply: "⚠️ No hay datos para confirmar. Empieza de nuevo.", step: "idle" });
    }

    try {
      const payload: Record<string, unknown> = {
        cliente: {
          nombre: clientData.nombre, nit: clientData.nit, cedula: clientData.cedula,
          email: clientData.email, telefono: clientData.telefono,
          ciudad: clientData.ciudad, direccion: clientData.direccion, empresa: clientData.empresa,
        },
        lineas: products.map((p) => ({
          codigo: p.codigo, referencia: p.nombre, acabado: p.acabado, cantidad: p.cantidad,
        })),
        asesor: session?.asesor ?? "Web",
        origen: "web",
        session_id,
      };
      if (valorTonelada !== null) payload.valor_tonelada = valorTonelada;

      const n8nRes = await fetch(N8N_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Token": `Bearer ${N8N_TOKEN}` },
        body: JSON.stringify(payload),
      });

      const n8nData = await n8nRes.json().catch(() => ({}));
      await resetSession(sid);

      const cotizId = n8nData?.cotizacion_id ?? n8nData?.id ?? n8nData?.numero ?? null;
      let reply = `✅ **¡Cotización creada exitosamente!**\n\n${formatClient(clientData)}\n\n**Productos:**\n${formatProducts(products)}`;
      if (cotizId) reply += `\n\n📋 Cotización: #${cotizId}`;
      reply += "\n\nPuedes iniciar una nueva cotización cuando quieras.";

      return json({ reply, step: "done" });
    } catch (err) {
      console.error("n8n error:", err);
      return json({ reply: "❌ Error al conectar con Symphony. Intenta de nuevo o escribe /cancelar.", step: "awaiting_confirm" });
    }
  }

  // ── idle — nuevo cliente ───────────────────────────────────────────────────
  if (step === "idle") {
    if (pdf_base64) {
      const client = await parseClient("", pdf_base64);
      if (!client?.nombre) {
        return json({ reply: "⚠️ No pude extraer los datos del PDF. ¿Puedes escribirlos manualmente?\n\nEj: _Juan Pérez, NIT 900.123.456, juan@empresa.co, Medellín_", step: "idle" });
      }
      await setSession(sid, { step: "awaiting_products", client_data: client, asesor: session_id });
      return json({
        reply: `${formatClient(client)}\n\n¿Los datos son correctos? Ahora dime los **productos y cantidades** que necesita.\n\nEj: _2 Splitface Gris 7×30, 3 Mármol Crema Arenado_`,
        step: "awaiting_products",
        client_data: client,
      });
    }

    if (!text) {
      return json({ reply: "Envía los datos del cliente o arrastra el RUT en PDF para empezar.\n\nEj: _Juan Pérez, NIT 900.123.456, juan@empresa.co, 3001234567, Medellín_", step: "idle" });
    }

    const client = await parseClient(text);
    if (!client?.nombre) {
      return json({ reply: "⚠️ No pude identificar los datos del cliente. Incluye al menos el nombre y el NIT o teléfono.", step: "idle" });
    }

    await setSession(sid, { step: "awaiting_products", client_data: client, asesor: session_id });
    return json({
      reply: `${formatClient(client)}\n\n¿Los datos son correctos? Ahora dime los **productos y cantidades** que necesita.\n\nEj: _2 Splitface Gris 7×30, 3 Mármol Crema Arenado_`,
      step: "awaiting_products",
      client_data: client,
    });
  }

  // ── awaiting_products ──────────────────────────────────────────────────────
  if (step === "awaiting_products") {
    if (!text) {
      return json({ reply: "Escribe los productos y cantidades. Ej: _2 Splitface Gris 7×30, 3 Mármol Crema Arenado_", step: "awaiting_products" });
    }

    const { products, valor_tonelada } = await matchProducts(text);

    if (!products.length) {
      return json({ reply: "⚠️ No encontré productos en tu mensaje. Intenta de nuevo con el nombre del material y la cantidad.", step: "awaiting_products" });
    }

    const clientData = session?.client_data as ClientData;

    await setSession(sid, { step: "awaiting_confirm", products, valor_tonelada: valor_tonelada ?? null });

    let reply = `📋 **Resumen de cotización**\n\n${formatClient(clientData)}\n\n**Productos:**\n${formatProducts(products)}`;
    if (valor_tonelada) reply += `\n\n💲 Valor tonelada: $${valor_tonelada.toLocaleString("es-CO")}`;
    reply += "\n\n¿Confirmo la cotización en Symphony?";

    return json({ reply, step: "awaiting_confirm", products });
  }

  // ── fallback ───────────────────────────────────────────────────────────────
  return json({ reply: "No entendí ese mensaje. Escribe /cancelar para empezar de nuevo.", step });
});
