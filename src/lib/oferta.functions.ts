import { invocar } from "@/lib/ofertasApi";

export const guardarOfertaEnSheet = (arg: { data: Record<string, unknown> }) =>
  invocar<{ ok: boolean }>("ofertas-sheet", { data: arg.data });
