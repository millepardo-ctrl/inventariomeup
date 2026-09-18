import { invocar } from "@/lib/ofertasApi";

export type MotorResponse = {
  nombre_universal: string;
  fob_usd_m2: number;
  costo_cop_m2: number;
  peso_kg_m2: number;
  origen: "Fábrica" | "Extrapolado";
  margen_sugerido_rango: { min: number; max: number };
};

export const calcularConMotor = (arg: { data: Record<string, unknown> }) =>
  invocar<MotorResponse>("ofertas-motor", { data: arg.data });
