import { invocar } from "@/lib/ofertasApi";

export type CotizacionRow = {
  tipo_producto: string;
  nombre_comercial: string;
  espesor_mm: string;
  acabado: string;
  formato: string;
  fob_usd_m2: number;
  fob_estado: "vigente" | "extrapolado";
  peso_kg_m2: number;
  origen: string;
  fecha: string;
};

export type TraduccionRow = {
  nombre_comercial: string;
  nombre_universal: string;
  alias: string;
};

export type DemoPrecioRow = {
  nombre_comercial: string;
  tipo_producto: string;
  espesor_mm: string;
  acabado: string;
  formato: string;
  fob_usd_m2: number;
  costo_cop_m2: number;
  peso_kg_m2: number;
  origen: string;
  nombre_universal: string;
  advertencia: string;
};

export type AlertaRow = { condicion: string; mensaje: string };

export type ContenidoRow = {
  nombre_meup: string;
  descripcion_1: string;
  descripcion_2: string;
  descripcion_3: string;
  clasificacion: string;
  compresion: string;
  flexion: string;
  absorcion: string;
  densidad: string;
  sellado: string;
  usos: string;
  adhesivo: string;
};

export type PrecioResult = {
  fobUSD: number;
  fobEstado: "vigente" | "extrapolado";
  costoCOP: number;
  pvpSinIVA: number;
  pvpConIVA: number;
  margenAplicado: number;
  margenEfectivo: number;
  origen: string;
  fleteUSD: number;
  navieraUSD: number;
  pesoKgM2: number;
  universalName: string;
  tipoMaterial: string;
  precioML: number;
  advertencia: string;
};

export type MotorData = {
  params: Record<string, string>;
  cotizaciones: CotizacionRow[];
  traducciones: TraduccionRow[];
  demo_precios: DemoPrecioRow[];
  alertas: AlertaRow[];
  contenido: ContenidoRow[];
};

export type Catalogo = MotorData;

export type AsesorRow = {
  asesor_nombre: string;
  asesor_cargo: string;
  asesor_cel: string;
  asesor_email: string;
};

export const leerMotorData = () =>
  invocar<MotorData>("ofertas-catalogo", { action: "motorData" });

export const refrescarMotorData = () =>
  invocar<MotorData>("ofertas-catalogo", { action: "refrescar" });

export const leerAsesores = () =>
  invocar<AsesorRow[]>("ofertas-catalogo", { action: "asesores" });

export const leerContenido = () =>
  invocar<ContenidoRow[]>("ofertas-catalogo", { action: "contenido" });

export const calcularPrecioCOP = (arg: {
  data: {
    nombreMeUp: string;
    espesor: string;
    acabado: string;
    formato: string;
    tipoOferta: string;
    anchoM?: number;
  };
}) => invocar<PrecioResult>("ofertas-catalogo", { action: "precio", data: arg.data });
