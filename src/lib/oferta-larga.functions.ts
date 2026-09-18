import { invocar } from "@/lib/ofertasApi";

type WebhookResult = { ok: boolean; status: number; body: any; raw: string };

export const enviarOfertaLarga = (arg: { data: Record<string, unknown> }) =>
  invocar<WebhookResult>("ofertas-n8n", { action: "larga", data: arg.data });

export const guardarOfertaRegistro = (arg: { data: Record<string, unknown> }) =>
  invocar<WebhookResult>("ofertas-n8n", { action: "guardar", data: arg.data });
