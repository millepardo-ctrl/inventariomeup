import { corsHeaders, jsonResponse } from "../_shared/google.ts";

const SYSTEM_PROMPT = `Eres "meup-motor-precios", la habilidad oficial de MeUp para calcular precios y datos técnicos de revestimientos (porcelánico, mármol, granito, cuarzo, travertino, borde/coping).

Recibes los atributos de un ítem (tipo de producto, nombre comercial MeUp, espesor mm, acabado, formato, cantidad m²) y devuelves SIEMPRE un JSON estructurado vía tool_call con:

- nombre_universal: nombre técnico universal del producto (string corto).
- fob_usd_m2: precio FOB USD por m² (número, normalmente 8–35).
- costo_cop_m2: costo en COP por m² usando TRM≈4000 (entero).
- peso_kg_m2: peso por m² calculado con densidad ≈2400 kg/m³ y el espesor (número, ej. espesor 12mm ≈ 28.8 kg/m²).
- origen: "Fábrica" si la combinación (producto+nombre+espesor+acabado+formato) está en catálogo estándar; "Extrapolado" si se infiere por similitud.
- margen_sugerido_rango: { min, max } en %, rango entre 15 y 60 según tipo de producto (mármol/cuarzo más alto, porcelánico estándar más bajo).

Sé consistente: la misma combinación de entradas debe devolver los mismos números. No incluyas texto fuera del tool_call.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY no está configurada");
    const body = await req.json().catch(() => ({}));
    const data = body?.data ?? body;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(data) },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "responder_motor",
              description: "Devuelve los datos del motor MeUp para el ítem dado.",
              parameters: {
                type: "object",
                properties: {
                  nombre_universal: { type: "string" },
                  fob_usd_m2: { type: "number" },
                  costo_cop_m2: { type: "number" },
                  peso_kg_m2: { type: "number" },
                  origen: { type: "string", enum: ["Fábrica", "Extrapolado"] },
                  margen_sugerido_rango: {
                    type: "object",
                    properties: { min: { type: "number" }, max: { type: "number" } },
                    required: ["min", "max"],
                    additionalProperties: false,
                  },
                },
                required: [
                  "nombre_universal",
                  "fob_usd_m2",
                  "costo_cop_m2",
                  "peso_kg_m2",
                  "origen",
                  "margen_sugerido_rango",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "responder_motor" } },
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Límite de uso del motor AI alcanzado. Intenta nuevamente en un momento.");
      if (res.status === 402) throw new Error("Sin créditos de IA. Recarga en Workspace → Usage.");
      throw new Error(`Error del motor (${res.status}): ${txt}`);
    }

    const json = await res.json();
    const call = json?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) throw new Error("El motor no devolvió una respuesta válida.");
    return jsonResponse(JSON.parse(call.function.arguments));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("ofertas-motor error:", msg);
    return jsonResponse({ error: msg }, 500);
  }
});
