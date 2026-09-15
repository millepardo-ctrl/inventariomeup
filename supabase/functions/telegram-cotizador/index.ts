import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import CATALOG from "./catalog.json" assert { type: "json" };

const TG = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const ANTHROPIC = Deno.env.get("ANTHROPIC_API_KEY")!;
const N8N_URL = Deno.env.get("N8N_WEBHOOK_COTIZACION")!;
const N8N_TOKEN = Deno.env.get("N8N_WEBHOOK_TOKEN")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// ─── Telegram helpers ─────────────────────────────────────────────────────────

async function tgSend(chatId: number, text: string, keyboard?: object) {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
  };
  if (keyboard) body.reply_markup = keyboard;
  await fetch(`https://api.telegram.org/bot${TG}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function tgGetFile(fileId: string): Promise<ArrayBuffer> {
  const res = await fetch(
    `https://api.telegram.org/bot${TG}/getFile?file_id=${fileId}`,
  );
  const { result } = await res.json();
  const dl = await fetch(
    `https://api.telegram.org/file/bot${TG}/${result.file_path}`,
  );
  return dl.arrayBuffer();
}

// ─── Claude helpers ───────────────────────────────────────────────────────────

async function claude(prompt: string, pdfBytes?: ArrayBuffer): Promise<string> {
  const content: unknown[] = [];

  if (pdfBytes) {
    const b64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));
    content.push({
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: b64 },
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

  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

// ─── Session helpers ──────────────────────────────────────────────────────────

async function getSession(chatId: string) {
  const { data } = await supabase
    .from("bot_sessions")
    .select("*")
    .eq("chat_id", chatId)
    .maybeSingle();
  return data;
}

async function setSession(chatId: string, patch: Record<string, unknown>) {
  await supabase.from("bot_sessions").upsert({
    chat_id: chatId,
    updated_at: new Date().toISOString(),
    ...patch,
  });
}

async function resetSession(chatId: string) {
  await setSession(chatId, {
    step: "idle",
    client_data: null,
    products: null,
    asesor: null,
  });
}

// ─── Client parsing ───────────────────────────────────────────────────────────

interface ClientData {
  nombre: string | null;
  nit: string | null;
  cedula: string | null;
  email: string | null;
  telefono: string | null;
  ciudad: string | null;
  direccion: string | null;
  empresa: string | null;
}

async function parseClient(
  text: string,
  pdfBytes?: ArrayBuffer,
): Promise<ClientData | null> {
  const prompt = `Eres un asistente de ventas colombiano. Extrae los datos del cliente del siguiente ${pdfBytes ? "documento RUT/PDF" : "texto"}.
Devuelve SOLO un JSON válido con estos campos (null si no está presente):
{"nombre": string|null, "nit": string|null, "cedula": string|null, "email": string|null, "telefono": string|null, "ciudad": string|null, "direccion": string|null, "empresa": string|null}
${pdfBytes ? "" : `Texto: "${text}"`}`;

  const raw = await claude(prompt, pdfBytes);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as ClientData;
  } catch {
    return null;
  }
}

// ─── Product matching ─────────────────────────────────────────────────────────

interface ProductLine {
  codigo: string;
  nombre: string;
  acabado: string;
  cantidad: number;
  nota?: string;
}

async function matchProducts(text: string): Promise<ProductLine[]> {
  const catalogStr = JSON.stringify(CATALOG);
  const prompt = `Eres un asistente de ventas de materiales de construcción colombiano.
Del siguiente pedido extrae los productos solicitados y busca el mejor match en el catálogo.

Catálogo disponible (JSON):
${catalogStr}

Pedido del asesor: "${text}"

Devuelve SOLO un JSON array válido con los productos encontrados:
[{"codigo": string, "nombre": string, "acabado": string, "cantidad": number, "nota": string|null}]

Reglas:
- Si la cantidad no se especifica, asume 1.
- Si hay ambigüedad en el acabado, elige el primero disponible y anótalo en "nota".
- Si un producto no tiene código en el catálogo, usa "SIN_CODIGO" en "codigo".
- Si no encuentras ningún match para un producto, inclúyelo igual con codigo "NO_ENCONTRADO" y una nota.`;

  const raw = await claude(prompt);
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    return JSON.parse(match[0]) as ProductLine[];
  } catch {
    return [];
  }
}

// ─── Format helpers ───────────────────────────────────────────────────────────

function formatClient(c: ClientData): string {
  const lines = [`👤 *${c.nombre || "Sin nombre"}*`];
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
  return products
    .map((p, i) => {
      const cod = p.codigo && p.codigo !== "SIN_CODIGO" && p.codigo !== "NO_ENCONTRADO"
        ? ` \`${p.codigo}\``
        : " _(sin código)_";
      const nota = p.nota ? `\n   ⚠️ _${p.nota}_` : "";
      return `${i + 1}. *${p.nombre}* — ${p.acabado}${cod}\n   Cantidad: ${p.cantidad}${nota}`;
    })
    .join("\n\n");
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "GET") return new Response("Bot activo ✓");

  let update: Record<string, unknown>;
  try {
    update = await req.json();
  } catch {
    return new Response("ok");
  }

  const msg = update.message as Record<string, unknown> | undefined;
  if (!msg) return new Response("ok");

  const chatId = (msg.chat as Record<string, unknown>).id as number;
  const text = ((msg.text as string) ?? "").trim();
  const doc = msg.document as Record<string, unknown> | undefined;
  const from = msg.from as Record<string, unknown> | undefined;
  const senderName = from
    ? [from.first_name, from.last_name].filter(Boolean).join(" ")
    : "Asesor";

  const session = await getSession(String(chatId));
  const step = (session?.step as string) ?? "idle";

  // ── /cancelar ──────────────────────────────────────────────────────────────
  if (text === "/cancelar" || text === "/reset") {
    await resetSession(String(chatId));
    await tgSend(chatId, "❌ Operación cancelada. Envía datos de cliente para empezar de nuevo.");
    return new Response("ok");
  }

  // ── /ayuda ─────────────────────────────────────────────────────────────────
  if (text === "/ayuda" || text === "/start" || text === "/help") {
    await tgSend(
      chatId,
      `🤖 *Bot Cotizador MeUp*\n\n` +
        `Puedes hacer lo siguiente:\n\n` +
        `*Cotización rápida:*\n` +
        `Envía los datos del cliente (nombre, NIT, teléfono, ciudad) o un PDF del RUT. Luego dime los productos y cantidades.\n\n` +
        `*Comandos:*\n` +
        `/oferta — iniciar cotización\n` +
        `/muestra — solicitar muestras\n` +
        `/cancelar — cancelar operación en curso\n` +
        `/ayuda — mostrar este menú\n\n` +
        `Puedes escribir en lenguaje natural, por ejemplo:\n` +
        `_"Cotización para Constructora ABC, NIT 900.123.456, juan@abc.co, Medellín"_`,
    );
    return new Response("ok");
  }

  // ── /si — confirmar cotización ─────────────────────────────────────────────
  if ((text === "/si" || text === "si" || text === "sí" || text === "Sí") && step === "awaiting_confirm") {
    const clientData = session?.client_data as ClientData;
    const products = session?.products as ProductLine[];

    if (!clientData || !products) {
      await tgSend(chatId, "⚠️ No hay datos para confirmar. Envía los datos del cliente primero.");
      await resetSession(String(chatId));
      return new Response("ok");
    }

    await tgSend(chatId, "⏳ Creando cotización en Symphony...");

    try {
      const payload = {
        cliente: {
          nombre: clientData.nombre,
          nit: clientData.nit,
          cedula: clientData.cedula,
          email: clientData.email,
          telefono: clientData.telefono,
          ciudad: clientData.ciudad,
          direccion: clientData.direccion,
          empresa: clientData.empresa,
        },
        lineas: products.map((p) => ({
          codigo: p.codigo,
          referencia: p.nombre,
          acabado: p.acabado,
          cantidad: p.cantidad,
        })),
        asesor: session?.asesor ?? senderName,
        origen: "telegram",
        chat_id: String(chatId),
      };

      const n8nRes = await fetch(N8N_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Token": `Bearer ${N8N_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const n8nData = await n8nRes.json().catch(() => ({}));

      await resetSession(String(chatId));

      const cotizId = n8nData?.cotizacion_id ?? n8nData?.id ?? n8nData?.numero ?? null;
      const cotizUrl = n8nData?.url ?? n8nData?.link ?? null;

      let successMsg = `✅ *Cotización creada exitosamente*\n\n${formatClient(clientData)}\n\n*Productos:*\n${formatProducts(products)}`;
      if (cotizId) successMsg += `\n\n📋 *Cotización:* #${cotizId}`;
      if (cotizUrl) successMsg += `\n🔗 ${cotizUrl}`;

      await tgSend(chatId, successMsg);
    } catch (err) {
      console.error("n8n error:", err);
      await tgSend(
        chatId,
        "❌ Error al crear la cotización en Symphony. Verifica el estado del sistema e intenta de nuevo con /cancelar.",
      );
    }

    return new Response("ok");
  }

  // ── Estado: idle o nuevo cliente ───────────────────────────────────────────
  if (step === "idle" || text.startsWith("/oferta") || text.startsWith("/cotizacion")) {
    const startText = text.startsWith("/oferta") || text.startsWith("/cotizacion")
      ? text.replace(/^\/(oferta|cotizacion)\s*/i, "")
      : text;

    // PDF recibido
    if (doc && doc.mime_type === "application/pdf") {
      await tgSend(chatId, "📄 Procesando el RUT...");
      try {
        const bytes = await tgGetFile(doc.file_id as string);
        const client = await parseClient("", bytes);
        if (!client || !client.nombre) {
          await tgSend(chatId, "⚠️ No pude extraer los datos del PDF. ¿Puedes escribirlos manualmente?\nEj: _Nombre, NIT, teléfono, ciudad_");
          return new Response("ok");
        }
        await setSession(String(chatId), {
          step: "awaiting_products",
          client_data: client,
          asesor: senderName,
        });
        await tgSend(
          chatId,
          `${formatClient(client)}\n\n¿Los datos son correctos? Ahora dime los productos y cantidades que necesita.\n\nEj: _2 Splitface Gris 7x30, 3 Mármol Crema Arenado_`,
        );
      } catch (err) {
        console.error("PDF error:", err);
        await tgSend(chatId, "❌ No pude leer el PDF. Por favor escribe los datos del cliente manualmente.");
      }
      return new Response("ok");
    }

    // Texto con datos del cliente
    if (!startText) {
      await tgSend(chatId, "Envía los datos del cliente o un PDF del RUT para empezar.\n\nEj: _Juan Pérez, NIT 900.123.456, juan@empresa.co, 3001234567, Medellín_");
      return new Response("ok");
    }

    await tgSend(chatId, "🔍 Identificando cliente...");
    const client = await parseClient(startText);

    if (!client || !client.nombre) {
      await tgSend(chatId, "⚠️ No pude identificar los datos del cliente. Por favor incluye al menos el nombre y el teléfono o NIT.");
      return new Response("ok");
    }

    await setSession(String(chatId), {
      step: "awaiting_products",
      client_data: client,
      asesor: senderName,
    });

    await tgSend(
      chatId,
      `${formatClient(client)}\n\n¿Los datos son correctos? Ahora dime los *productos y cantidades* que necesita.\n\nEj: _2 Splitface Gris 7x30, 3 Mármol Crema Arenado, 1 Travertino Clásico_`,
    );
    return new Response("ok");
  }

  // ── Estado: awaiting_products ──────────────────────────────────────────────
  if (step === "awaiting_products") {
    if (!text) {
      await tgSend(chatId, "Escribe los productos y cantidades. Ej: _2 Splitface Gris 7x30, 3 Mármol Crema Arenado_");
      return new Response("ok");
    }

    await tgSend(chatId, "🔍 Buscando productos en el catálogo...");
    const products = await matchProducts(text);

    if (!products.length) {
      await tgSend(chatId, "⚠️ No encontré productos en tu mensaje. Intenta de nuevo con el nombre del producto y la cantidad.\n\nEj: _2 Splitface Gris 7x30_");
      return new Response("ok");
    }

    const clientData = session?.client_data as ClientData;

    await setSession(String(chatId), {
      step: "awaiting_confirm",
      products,
    });

    await tgSend(
      chatId,
      `📋 *Resumen de cotización*\n\n${formatClient(clientData)}\n\n*Productos:*\n${formatProducts(products)}\n\n¿Creo la cotización en Symphony? Responde /si para confirmar o /cancelar para empezar de nuevo.`,
    );
    return new Response("ok");
  }

  // ── Fallback ───────────────────────────────────────────────────────────────
  await tgSend(
    chatId,
    "No entendí ese mensaje. Escribe /ayuda para ver qué puedo hacer, o /cancelar para empezar de nuevo.",
  );

  return new Response("ok");
});
