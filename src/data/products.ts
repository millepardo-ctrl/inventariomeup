export interface Product {
  c: string;
  n: string;
  u: string;
  cat: Category;
  stock_baq: number;
  stock_cuc: number;
  disp_baq: number;
  disp_cuc: number;
  total_disp: number;
  d1: number;
  d2: number;
  eta1: string | null;
  eta2: string | null;
  est1: string | null;
  est2: string | null;
  res: number;
  pre_res: number;
  consumo: number;
  stk_min: number;
  alerta: string | null;
}

export type Category = "Mármol" | "Travertino" | "Bali/Piedra" | "Granito" | "Piedra Natural" | "Splitface y Más" | "Pizarra" | "Accesorios" | "Complementarios";

export const CATEGORIES: ("Todos" | Category)[] = ["Todos", "Mármol", "Travertino", "Bali/Piedra", "Granito", "Piedra Natural", "Splitface y Más", "Pizarra", "Accesorios", "Complementarios"];

export type CatKey = "marmol" | "travertino" | "bali" | "granito" | "piedra" | "splitface" | "pizarra" | "accesorios" | "complementarios";

export const CAT_KEY_MAP: Record<Category, CatKey> = {
  "Mármol": "marmol",
  "Travertino": "travertino",
  "Bali/Piedra": "bali",
  "Granito": "granito",
  "Piedra Natural": "piedra",
  "Splitface y Más": "splitface",
  "Pizarra": "pizarra",
  "Accesorios": "accesorios",
  "Complementarios": "complementarios",
};

export const fmt = (v: number) =>
  v > 0 ? v.toLocaleString("es-CO", { maximumFractionDigits: 1 }) : "—";

export interface AppUser {
  type: "vendedor" | "distribuidor";
  name: string;
  email?: string;
  region?: string;
}

export const DIST_USERS: Record<string, { pass: string; name: string; region: string }> = {
  "dist1@empresa.com": { pass: "dist2026", name: "Distribuidora Norte", region: "Cúcuta" },
  "ventas@marmoles.com": { pass: "marmoles1", name: "Mármoles del Caribe", region: "Barranquilla" },
  "compras@constru.com": { pass: "constru2026", name: "Construeléctrica S.A.S.", region: "Bogotá" },
};

export const ESTADO_COLORS: Record<string, { bg: string; color: string; icon: string }> = {
  "EN ADUANA": { bg: "hsl(48, 96%, 89%)", color: "hsl(28, 80%, 26%)", icon: "🟡" },
  "EN TRÁNSITO": { bg: "hsl(214, 95%, 93%)", color: "hsl(224, 76%, 48%)", icon: "🔵" },
  "EN PRODUCCIÓN": { bg: "hsl(270, 100%, 95%)", color: "hsl(273, 72%, 32%)", icon: "🟣" },
  "EN PUERTO": { bg: "hsl(138, 76%, 94%)", color: "hsl(143, 64%, 24%)", icon: "🟢" },
};


