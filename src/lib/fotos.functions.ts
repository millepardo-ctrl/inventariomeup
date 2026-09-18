import { invocar } from "@/lib/ofertasApi";

export const buscarFotosProductos = (arg: { data: string[] }) =>
  invocar<Record<string, string[]>>("ofertas-fotos", { data: arg.data });
