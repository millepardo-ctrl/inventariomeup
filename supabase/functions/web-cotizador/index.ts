import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CATALOG = [
  {"cod":"0136401","nombre":"Mármol Crema","acabado":"Arenado","cat":"Mármol","tipo":"losa"},
  {"cod":"0136402","nombre":"Mármol Crema","acabado":"Cepillado","cat":"Mármol","tipo":"losa"},
  {"cod":"0136413","nombre":"Mármol Crema","acabado":"Pulido Mate","cat":"Mármol","tipo":"losa"},
  {"cod":"0163701","nombre":"Mármol Crema a la Veta","acabado":"Arenado","cat":"Mármol","tipo":"losa"},
  {"cod":"0154501","nombre":"Mármol Arenado","acabado":"Arenado","cat":"Mármol","tipo":"losa"},
  {"cod":"0158501","nombre":"Mármol Nuevo Marfil","acabado":"Cepillado","cat":"Mármol","tipo":"losa"},
  {"cod":"0158504","nombre":"Mármol Nuevo Marfil","acabado":"Brillado","cat":"Mármol","tipo":"losa"},
  {"cod":"0154106","nombre":"Mármol Café","acabado":"Arenado","cat":"Mármol","tipo":"losa"},
  {"cod":"0154101","nombre":"Mármol Café","acabado":"Cepillado","cat":"Mármol","tipo":"losa"},
  {"cod":"0154108","nombre":"Mármol Café","acabado":"Arenado+Anticado","cat":"Mármol","tipo":"losa"},
  {"cod":"0156001","nombre":"Mármol Gris","acabado":"Arenado","cat":"Mármol","tipo":"losa"},
  {"cod":"0156002","nombre":"Mármol Gris","acabado":"Cepillado","cat":"Mármol","tipo":"losa"},
  {"cod":"0161901","nombre":"Mármol Tundra Grey","acabado":"Pulido Mate","cat":"Mármol","tipo":"losa"},
  {"cod":"0161902","nombre":"Mármol Tundra Light","acabado":"Natural 2cm","cat":"Mármol","tipo":"losa"},
  {"cod":"0159602","nombre":"Mármol Ibiza Gray","acabado":"Brillante","cat":"Mármol","tipo":"losa"},
  {"cod":"0161802","nombre":"Mármol Ibiza Gold","acabado":"Brillante","cat":"Mármol","tipo":"losa"},
  {"cod":"0161801","nombre":"Mármol Ibiza Gold","acabado":"Brillante+Dorado","cat":"Mármol","tipo":"losa"},
  {"cod":"0162002","nombre":"Mármol Afyon Grey","acabado":"Pulido Mate","cat":"Mármol","tipo":"losa"},
  {"cod":"0167201","nombre":"Mármol Afyon Grey","acabado":"Arenado","cat":"Mármol","tipo":"losa"},
  {"cod":"0161601","nombre":"Mármol Gold","acabado":"Brillado","cat":"Mármol","tipo":"losa"},
  {"cod":"0157301","nombre":"Mármol Royal Imperial","acabado":"Cepillado 1cm","cat":"Mármol","tipo":"losa"},
  {"cod":"0157306","nombre":"Mármol Royal Imperial","acabado":"Pulido Mate","cat":"Mármol","tipo":"losa"},
  {"cod":"0163801","nombre":"Mármol Marrón Emperador","acabado":"Brillado","cat":"Mármol","tipo":"losa"},
  {"cod":"0137202","nombre":"Rompeolas Mármol Crema","acabado":"30.5×100cm","cat":"Mármol","tipo":"borde"},
  {"cod":"0154203","nombre":"Rompeolas Mármol Café","acabado":"30.5×100cm","cat":"Mármol","tipo":"borde"},
  {"cod":"0154303","nombre":"Rompeolas Mármol Gris","acabado":"Arenado 30.5×LL","cat":"Mármol","tipo":"borde"},
  {"cod":"0154301","nombre":"Rompeolas Mármol Gris","acabado":"Cepillado 30.5×LL","cat":"Mármol","tipo":"borde"},
  {"cod":"0167101","nombre":"Rompeola Afyon Grey","acabado":"30.5×LL Arenado","cat":"Mármol","tipo":"borde"},
  {"cod":"0162103","nombre":"Adoquín Mármol Crema","acabado":"10×10×3cm","cat":"Mármol","tipo":"pieza"},
  {"cod":"0162109","nombre":"Adoquín Mármol Crema","acabado":"10×10×5cm","cat":"Mármol","tipo":"pieza"},
  {"cod":"0166603","nombre":"Adoquín Mármol Crema","acabado":"5×20×3cm","cat":"Mármol","tipo":"pieza"},
  {"cod":"0162102","nombre":"Adoquín Mármol Café","acabado":"10×10×3cm","cat":"Mármol","tipo":"pieza"},
  {"cod":"0166706","nombre":"Adoquín Mármol Café","acabado":"5×20×4cm","cat":"Mármol","tipo":"pieza"},
  {"cod":"0162101","nombre":"Adoquín Mármol Gris","acabado":"10×10×3cm","cat":"Mármol","tipo":"pieza"},
  {"cod":"0167301","nombre":"Thin Brick Crema","acabado":"7×25cm","cat":"Mármol","tipo":"pieza"},
  {"cod":"0158601","nombre":"Thin Brick Marfil","acabado":"7×25cm","cat":"Mármol","tipo":"pieza"},
  {"cod":"0158701","nombre":"Thin Brick Café","acabado":"7×25cm","cat":"Mármol","tipo":"pieza"},
  {"cod":"0158801","nombre":"Thin Brick Gris","acabado":"7×25cm","cat":"Mármol","tipo":"pieza"},
  {"cod":"0128702","nombre":"Travertino Clásico","acabado":"Pulido Poro Abierto","cat":"Travertino","tipo":"losa"},
  {"cod":"0128701","nombre":"Travertino Clásico","acabado":"Pulido PA LL","cat":"Travertino","tipo":"losa"},
  {"cod":"0163601","nombre":"Travertino Turco","acabado":"Semipulido","cat":"Travertino","tipo":"losa"},
  {"cod":"0157202","nombre":"Travertino Macadamia","acabado":"Tomboleado LL","cat":"Travertino","tipo":"losa"},
  {"cod":"0157201","nombre":"Travertino Macadamia","acabado":"Tomboleado 61cm","cat":"Travertino","tipo":"losa"},
  {"cod":"0128102","nombre":"Travertino Ivory Crema","acabado":"Tomboleado","cat":"Travertino","tipo":"losa"},
  {"cod":"0128103","nombre":"Travertino Ivory Crema","acabado":"Pulido+Retape","cat":"Travertino","tipo":"losa"},
  {"cod":"0154001","nombre":"Travertino Arena","acabado":"Tomboleado","cat":"Travertino","tipo":"losa"},
  {"cod":"0128403","nombre":"Travertino Durando Imperial","acabado":"Cepillado 3cm","cat":"Travertino","tipo":"losa"},
  {"cod":"0155001","nombre":"Thin Brick Travertino","acabado":"8×40cm","cat":"Travertino","tipo":"pieza"},
  {"cod":"0163201","nombre":"Rompeolas Travertino Ivory","acabado":"30.5×61cm","cat":"Travertino","tipo":"borde"},
  {"cod":"0128601","nombre":"Adoquín Travertino Noche","acabado":"10×20×3cm","cat":"Travertino","tipo":"pieza"},
  {"cod":"0000601","nombre":"Bali Green","acabado":"20×20cm","cat":"Bali / Piedra","tipo":"pieza"},
  {"cod":"0000602","nombre":"Bali Green","acabado":"10×10cm","cat":"Bali / Piedra","tipo":"pieza"},
  {"cod":"0003202","nombre":"Bali Black","acabado":"20×20cm","cat":"Bali / Piedra","tipo":"pieza"},
  {"cod":"0003201","nombre":"Bali Black","acabado":"10×10cm","cat":"Bali / Piedra","tipo":"pieza"},
  {"cod":"0160101","nombre":"Bali Turquesa Azul","acabado":"20×20cm","cat":"Bali / Piedra","tipo":"pieza"},
  {"cod":"0164703","nombre":"Granito Perla","acabado":"Brillado","cat":"Granito","tipo":"losa"},
  {"cod":"0164706","nombre":"Granito Perla","acabado":"Flameado+Cepillado","cat":"Granito","tipo":"losa"},
  {"cod":"0164106","nombre":"Granito Siena","acabado":"Flameado+Cepillado","cat":"Granito","tipo":"losa"},
  {"cod":"0164303","nombre":"Granito Verdi","acabado":"Brillado","cat":"Granito","tipo":"losa"},
  {"cod":"0164306","nombre":"Granito Verdi","acabado":"Flameado+Cepillado","cat":"Granito","tipo":"losa"},
  {"cod":"0164406","nombre":"Granito Gris","acabado":"Flameado+Cepillado","cat":"Granito","tipo":"losa"},
  {"cod":"0164503","nombre":"Granito Blanco","acabado":"Brillado","cat":"Granito","tipo":"losa"},
  {"cod":"0142812","nombre":"Crema Perlada","acabado":"Retapado+Pulido","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"0148001","nombre":"Crema Perlada Patrón Francés","acabado":"Multiformatos","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"0136701","nombre":"Piedra Negro Absoluto","acabado":"Natural","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"0136717","nombre":"Mármol Negro Absoluto","acabado":"Natural","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"0004704","nombre":"Piedra Muñeca Crema","acabado":"1cm","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"0004904","nombre":"Piedra Muñeca Crema","acabado":"2cm","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"0006069","nombre":"Mármol Royal Veta","acabado":"Cepillado","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"0149601","nombre":"Piedra Verde Jade","acabado":"Natural","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"","nombre":"Sinú Veta","acabado":"Pulido Mate","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"","nombre":"Sinú Dorado","acabado":"Pulido Mate","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"","nombre":"Café Pinta","acabado":"Pulido Mate","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"","nombre":"Mármol Terra","acabado":"Pulido Mate","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"","nombre":"Royal Verde","acabado":"Pulido Mate","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"","nombre":"Royal Bronce","acabado":"Pulido Mate","cat":"Piedra Natural","tipo":"losa"},
  {"cod":"","nombre":"Peralto de Cáscara","acabado":"Natural","cat":"Piedra Natural","tipo":"pieza"},
  {"cod":"","nombre":"Laja San Andres","acabado":"Natural","cat":"Piedra Natural","tipo":"pieza"},
  {"cod":"0158901","nombre":"Splitface Marfil","acabado":"7×30cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0158902","nombre":"Splitface Marfil","acabado":"15×30cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0159001","nombre":"Splitface Café","acabado":"7×30cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0159002","nombre":"Splitface Café","acabado":"15×30cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0160001","nombre":"Splitface Gris","acabado":"7×30cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0160002","nombre":"Splitface Gris","acabado":"15×30cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0162501","nombre":"Splitface Crema","acabado":"7×30cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0162502","nombre":"Splitface Crema","acabado":"15×30cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0162503","nombre":"Splitface Crema","acabado":"30×60cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0130201","nombre":"Travertino Splitface","acabado":"10×LL 2.5cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0162301","nombre":"Rockface Crema","acabado":"Irregular","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0162302","nombre":"Rockface Blanco","acabado":"Irregular","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0007003","nombre":"Espacato Crema","acabado":"7×25cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0007004","nombre":"Espacato Crema","acabado":"10×25cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0007001","nombre":"Espacato Blanco","acabado":"7×25cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0007002","nombre":"Espacato Blanco","acabado":"10×25cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0153701","nombre":"Thin Brick Hudson White","acabado":"7×19cm","cat":"Splitface y Más","tipo":"pieza"},
  {"cod":"0000401","nombre":"Pizarra Negra Óxido","acabado":"5×15cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0000402","nombre":"Pizarra Negra Óxido","acabado":"10×20cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0000403","nombre":"Pizarra Negra Óxido","acabado":"20×20cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0000501","nombre":"Pizarra Verde Bosque","acabado":"5×15cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0000502","nombre":"Pizarra Verde Bosque","acabado":"10×20cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0001901","nombre":"Pizarra Verde Lima","acabado":"5×15cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0001902","nombre":"Pizarra Verde Lima","acabado":"10×20cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0002102","nombre":"Pizarra Roseta Gris","acabado":"5×15cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0002104","nombre":"Pizarra Roseta Gris","acabado":"10×20cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0002103","nombre":"Pizarra Roseta Gris","acabado":"20×20cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0000901","nombre":"Pizarra Primavera","acabado":"5×15cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0000902","nombre":"Pizarra Primavera","acabado":"10×15cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0001801","nombre":"Pizarra Blanco Nieve","acabado":"5×15cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0000801","nombre":"Pizarra Oro Narciso","acabado":"5×15cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0000802","nombre":"Pizarra Oro Narciso","acabado":"10×20cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0004601","nombre":"Pizarra Negra Veta","acabado":"3×JP 50cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0004602","nombre":"Pizarra Negra Veta","acabado":"5×JP 50cm","cat":"Pizarra","tipo":"pieza"},
  {"cod":"0004603","nombre":"Pizarra Negra Veta","acabado":"10×JP 50cm","cat":"Pizarra","tipo":"pieza"},
];

const SHEET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZcZ_HAFNOdIAXh8AvNqeiBM3fjfBLHUPYxz5u_WYPnwi_nKZ8N3lzpAnSLYRb6HNp46DHG0Z48mjZ/pub?gid=1640636152&single=true&output=csv";

const ANTHROPIC = Deno.env.get("ANTHROPIC_API_KEY")!;
const N8N_URL = "https://meup.co/webhook/cotizacion-telegram";
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

// ─── Inventory ────────────────────────────────────────────────────────────────

interface StockInfo { disp_baq: number; disp_cuc: number; }

function colNum(val: string): number {
  const s = (val || "").replace(/"/g, "").trim()
    .replace(/\.(?=\d{3}(?:[^0-9]|$))/g, "")
    .replace(",", ".");
  return parseFloat(s) || 0;
}

async function fetchInventory(): Promise<Record<string, StockInfo>> {
  try {
    const res = await fetch(SHEET_CSV, { signal: AbortSignal.timeout(7000) });
    if (!res.ok) return {};
    const text = await res.text();
    const lines = text.split("\n").slice(4);
    const map: Record<string, StockInfo> = {};
    for (const line of lines) {
      if (!line.trim()) continue;
      const cols = line.split(",");
      const code = (cols[0] || "").replace(/"/g, "").trim();
      if (!code.match(/^\d/)) continue;
      map[code] = {
        disp_cuc: colNum(cols[10] || ""),
        disp_baq: colNum(cols[11] || ""),
      };
    }
    return map;
  } catch {
    return {};
  }
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
- Si hay varias opciones de tamaño o acabado para el mismo producto, elige UNA SOLA (la primera del catálogo) y NO incluyas las demás variantes.
- Si hay ambigüedad real entre productos distintos (no entre tamaños del mismo), elige el más probable y anótalo en "nota".
- "nota" SOLO para problemas reales: producto no encontrado, código no disponible. NO usar para unidades, cantidades ni conversiones.
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

function formatProducts(
  products: ProductLine[],
  inventory?: Record<string, StockInfo>,
): string {
  return products.map((p, i) => {
    const cod = p.codigo && p.codigo !== "SIN_CODIGO" && p.codigo !== "NO_ENCONTRADO"
      ? ` \`${p.codigo}\`` : " *(sin código)*";
    const nota = p.nota ? `\n   ⚠️ ${p.nota}` : "";

    let stock = "";
    if (inventory && p.codigo && p.codigo !== "SIN_CODIGO" && p.codigo !== "NO_ENCONTRADO") {
      const inv = inventory[p.codigo];
      if (inv) {
        const parts: string[] = [];
        if (inv.disp_baq > 0) parts.push(`BAQ: ${Math.floor(inv.disp_baq)}`);
        if (inv.disp_cuc > 0) parts.push(`CUC: ${Math.floor(inv.disp_cuc)}`);
        stock = parts.length > 0
          ? `\n   📦 ${parts.join(" | ")}`
          : "\n   ⚠️ Sin disponible en bodega";
      }
    }

    return `${i + 1}. **${p.nombre}** — ${p.acabado}${cod}\n   Cantidad: ${p.cantidad}${stock}${nota}`;
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

      if (!n8nRes.ok) {
        const errBody = await n8nRes.text().catch(() => "");
        console.error("n8n error status:", n8nRes.status, errBody);
        return json({
          reply: `❌ Symphony respondió con error ${n8nRes.status}. Verifica el workflow de n8n. Escribe /cancelar para reiniciar.`,
          step: "awaiting_confirm",
        });
      }

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

    const [{ products, valor_tonelada }, inventory] = await Promise.all([
      matchProducts(text),
      fetchInventory(),
    ]);

    if (!products.length) {
      return json({ reply: "⚠️ No encontré productos en tu mensaje. Intenta de nuevo con el nombre del material y la cantidad.", step: "awaiting_products" });
    }

    const clientData = session?.client_data as ClientData;
    await setSession(sid, { step: "awaiting_confirm", products, valor_tonelada: valor_tonelada ?? null });

    let reply = `📋 **Resumen de cotización**\n\n${formatClient(clientData)}\n\n**Productos:**\n${formatProducts(products, inventory)}`;
    if (valor_tonelada) reply += `\n\n💲 Valor tonelada: $${valor_tonelada.toLocaleString("es-CO")}`;
    reply += "\n\n¿Confirmo la cotización en Symphony?";

    return json({ reply, step: "awaiting_confirm", products });
  }

  // ── fallback ───────────────────────────────────────────────────────────────
  return json({ reply: "No entendí ese mensaje. Escribe /cancelar para empezar de nuevo.", step });
});
