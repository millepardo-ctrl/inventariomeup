import { corsHeaders, jsonResponse } from "../_shared/google.ts";

const URLS: Record<string, string> = {
  larga: "https://n8n.meup.co/webhook/generar-oferta-larga",
  guardar: "https://n8n.meup.co/webhook/guardar-oferta",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const url = URLS[String(body?.action ?? "larga")];
    if (!url) return jsonResponse({ error: "Acción desconocida" }, 400);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body?.data ?? {}),
    });
    const text = await res.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }
    return jsonResponse({ ok: res.ok, status: res.status, body: parsed, raw: text.slice(0, 2000) });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("ofertas-n8n error:", msg);
    return jsonResponse({ ok: false, status: 0, body: null, raw: msg }, 200);
  }
});
