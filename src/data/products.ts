export interface Product {
  c: string;
  n: string;
  u: string;
  cat: Category;
  stock_baq: number;
  stock_cuc: number;
  disp_baq: number;
  disp_cuc: number;
  d1: number;
  d2: number;
  eta1: string | null;
  eta2: string | null;
  est1: string | null;
  est2: string | null;
  res: number;
  pre_res: number;
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

export const PRODUCTS: Product[] = [
  {c:"0136401",n:"Mármol Crema 40cm x LL Arenado 1,2cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:1286.19,res:0,pre_res:903,disp_cuc:0,disp_baq:1286.19,d1:983.9,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0163701",n:"Mármol Crema 40xLL Arenado con vetas",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:233.36,res:0,pre_res:0,disp_cuc:0,disp_baq:233.36,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0136402",n:"Mármol Crema 40cm x LL Cepillado 1,2cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:1.3,res:0,pre_res:0,disp_cuc:0,disp_baq:1.3,d1:0,d2:701.18,eta1:null,eta2:"Finales Mar",est1:null,est2:"EN TRÁNSITO"},
  {c:"0137202",n:"Rompeola Mármol Crema 30.5x100cm Arenado 2cm",u:"ml",cat:"Mármol",stock_cuc:0,stock_baq:245.97,res:0,pre_res:246,disp_cuc:0,disp_baq:245.97,d1:251.97,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0166101",n:"Mármol Crema 30.5x100x2cm Arenado a la veta - Rompeolas",u:"ml",cat:"Mármol",stock_cuc:0,stock_baq:99,res:0,pre_res:0,disp_cuc:0,disp_baq:99,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0154501",n:"Mármol Arenado 40xLL 1,2cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:1300.58,res:0,pre_res:0,disp_cuc:0,disp_baq:1300.58,d1:1354.12,d2:0,eta1:"17 Feb",eta2:"26 Feb",est1:"EN ADUANA",est2:"EN ADUANA"},
  {c:"0156102",n:"Mármol Arenado 30.5xLL 2cm Rompeolas",u:"ml",cat:"Mármol",stock_cuc:0,stock_baq:503.98,res:0,pre_res:0,disp_cuc:0,disp_baq:503.98,d1:134.98,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0158501",n:"Mármol Nuevo Marfil 40xLL 1,2cm Cepillado",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:12.34,res:0,pre_res:0,disp_cuc:0,disp_baq:12.34,d1:195,d2:695.2,eta1:"26 Feb",eta2:"Finales Mar",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0158504",n:"Mármol Nuevo Marfil 40xLL 1,5cm Brillado",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:2019.72,res:0,pre_res:0,disp_cuc:0,disp_baq:2019.72,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0154102",n:"Mármol Café 40xLL 1,2cm Arenado",u:"m²",cat:"Mármol",stock_cuc:2.1,stock_baq:1338.24,res:0,pre_res:0,disp_cuc:2.1,disp_baq:1338.24,d1:863.64,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0154203",n:"Mármol Café 30.5x100x2cm Rompeolas",u:"ml",cat:"Mármol",stock_cuc:0,stock_baq:854.87,res:0,pre_res:0,disp_cuc:0,disp_baq:854.87,d1:183.97,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0156001",n:"Mármol Gris 40xLL 1,2cm Arenado",u:"m²",cat:"Mármol",stock_cuc:1.89,stock_baq:483.96,res:0,pre_res:0,disp_cuc:1.89,disp_baq:483.96,d1:140.32,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0156002",n:"Mármol Gris 60xLL 1,5cm Cepillado",u:"m²",cat:"Mármol",stock_cuc:2.56,stock_baq:234.28,res:0,pre_res:0,disp_cuc:2.56,disp_baq:234.28,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0154303",n:"Mármol Gris 30.5x100x2cm Rompeolas",u:"ml",cat:"Mármol",stock_cuc:0,stock_baq:219.62,res:0,pre_res:0,disp_cuc:0,disp_baq:219.62,d1:209.97,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0161901",n:"Mármol Tundra Grey 40xLL 1,2cm Pulido Mate",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:296.46,res:0,pre_res:0,disp_cuc:0,disp_baq:296.46,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0161902",n:"Mármol Tundra Light 32xLL 2cm Largos",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:200,eta1:null,eta2:"Mar 2026",est1:null,est2:"EN TRÁNSITO"},
  {c:"0159602",n:"Mármol Ibiza Gray 61x122x1cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:327.44,res:0,pre_res:0,disp_cuc:0,disp_baq:327.44,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0161802",n:"Mármol Ibiza Gold 61x122x1cm Brillante",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:327.44,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0161801",n:"Mármol Ibiza Gold Mix Polished 61x122x1cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:327.44,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0162001",n:"Mármol Afyon Grey 40xLL 1,2cm Pulido Mate",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:277.37,res:0,pre_res:0,disp_cuc:0,disp_baq:277.37,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0162003",n:"Mármol Afyon Grey 40xLL 1cm Arenado",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:299.67,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0162004",n:"Mármol Afyon Grey 30xLL 2cm Arenado",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:47.76,eta1:null,eta2:"18 Mar",est1:null,est2:"EN TRÁNSITO"},
  {c:"0161601",n:"Mármol Gold Brillado 40xLL 1,2cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:300,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0163801",n:"Mármol Marrón Emperador 40xLL 2cm Brillado",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:7.36,res:0,pre_res:0,disp_cuc:0,disp_baq:7.36,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0158601",n:"Thin Brick Mármol Marfil 7x25x1,5cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:10.91,res:0,pre_res:0,disp_cuc:0,disp_baq:10.91,d1:0,d2:62.91,eta1:null,eta2:"Finales Mar",est1:null,est2:"EN TRÁNSITO"},
  {c:"0158701",n:"Thin Brick Mármol Café 7x25x1,5cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:48.04,res:0,pre_res:0,disp_cuc:0,disp_baq:48.04,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0158801",n:"Thin Brick Mármol Gris 7x25x1,5cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:37.32,res:0,pre_res:0,disp_cuc:0,disp_baq:37.32,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // TRAVERTINO
  {c:"0128702",n:"Travertino Clásico 30.5x61x1,2cm Pulido",u:"m²",cat:"Travertino",stock_cuc:0.07,stock_baq:0,res:0,pre_res:0,disp_cuc:0.07,disp_baq:0,d1:0,d2:148.32,eta1:null,eta2:"18 Mar",est1:null,est2:"EN TRÁNSITO"},
  {c:"0128701",n:"Travertino Clásico 40xLL 1,2cm Pulido Poro Abierto",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:1589.71,eta1:null,eta2:"18 Mar",est1:null,est2:"EN TRÁNSITO"},
  {c:"0163401",n:"Travertino Clásico 30xLL 2cm Pulido ml",u:"ml",cat:"Travertino",stock_cuc:0,stock_baq:171.67,res:0,pre_res:0,disp_cuc:0,disp_baq:171.67,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0163601",n:"Travertino Turco 30xLL 2cm Pulido",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:900,eta1:null,eta2:"Mar 2026",est1:null,est2:"EN TRÁNSITO"},
  {c:"0157201",n:"Travertino Macadamia 40.6x61x1,2cm Tomboleado",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:1333.39,res:5,pre_res:142,disp_cuc:0,disp_baq:1328.39,d1:0,d2:871.86,eta1:"17 Feb",eta2:"Primera sem Abr",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0157202",n:"Travertino Macadamia 40.6x61x1,2cm (Ref2)",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:0,res:80,pre_res:0,disp_cuc:0,disp_baq:0,d1:73.5,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0163101",n:"Travertino Macadamia 30.5x61x2cm Borde Piscina",u:"ml",cat:"Travertino",stock_cuc:0,stock_baq:181.73,res:0,pre_res:0,disp_cuc:0,disp_baq:181.73,d1:182.95,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0128102",n:"Travertino Ivory Crema 40.6x61x1,2cm Tomboleado",u:"m²",cat:"Travertino",stock_cuc:0.84,stock_baq:323.29,res:0,pre_res:280,disp_cuc:0.84,disp_baq:323.29,d1:274.82,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0128103",n:"Travertino Ivory Crema 40.6x61x1,2cm Pulido Retape",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:14.15,res:0,pre_res:70,disp_cuc:0,disp_baq:14.15,d1:682.97,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0163201",n:"Travertino Ivory 30.5x61x2cm ml",u:"ml",cat:"Travertino",stock_cuc:1.8,stock_baq:138.35,res:0,pre_res:0,disp_cuc:1.8,disp_baq:138.35,d1:183,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0154001",n:"Travertino Arena 40.6x61x1,2cm",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:783.08,res:0,pre_res:0,disp_cuc:0,disp_baq:783.08,d1:752.97,d2:911.49,eta1:"17 Feb",eta2:"Primera sem Abr",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0163301",n:"Travertino Arena 30.5x61x2cm ml",u:"ml",cat:"Travertino",stock_cuc:6.6,stock_baq:304.92,res:0,pre_res:0,disp_cuc:6.6,disp_baq:304.92,d1:304.92,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0128403",n:"Travertino Imperial 30xLL 3cm",u:"m²",cat:"Travertino",stock_cuc:30,stock_baq:0,res:0,pre_res:0,disp_cuc:30,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0128601",n:"Adoquín Travertino Noche 10x20x3cm",u:"m²",cat:"Travertino",stock_cuc:100,stock_baq:0,res:0,pre_res:0,disp_cuc:100,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // BALI/PIEDRA
  {c:"0000602",n:"Piedra Bali Verde 10x10cm Natural 1cm",u:"m²",cat:"Bali/Piedra",stock_cuc:0,stock_baq:9.79,res:0,pre_res:295,disp_cuc:0,disp_baq:9.79,d1:5,d2:200,eta1:"Feb 2026",eta2:"Mayo 2026",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0000601",n:"Piedra Bali Verde 20x20cm Natural 1cm",u:"m²",cat:"Bali/Piedra",stock_cuc:0,stock_baq:896,res:0,pre_res:5,disp_cuc:0,disp_baq:896,d1:695,d2:1050,eta1:"Feb 2026",eta2:"Mayo 2026",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0003201",n:"Bali Negra 10x10",u:"m²",cat:"Bali/Piedra",stock_cuc:16,stock_baq:160,res:0,pre_res:0,disp_cuc:16,disp_baq:160,d1:100,d2:0,eta1:"Feb 2026",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0003202",n:"Piedra Bali Negra 20x20cm Natural 1cm",u:"m²",cat:"Bali/Piedra",stock_cuc:0,stock_baq:62,res:0,pre_res:125,disp_cuc:0,disp_baq:62,d1:25,d2:0,eta1:"Feb 2026",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0160101",n:"Bali Azul 20x20",u:"m²",cat:"Bali/Piedra",stock_cuc:0,stock_baq:199,res:0,pre_res:0,disp_cuc:0,disp_baq:199,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // GRANITO
  {c:"0166501",n:"Adoquín Granito New Halayeb 10x20x3cm Tumbleado",u:"Und",cat:"Granito",stock_cuc:0,stock_baq:3.65,res:0,pre_res:0,disp_cuc:0,disp_baq:3.65,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0166503",n:"Adoquín Granito Gandola 10x20x3cm Tumbleado",u:"Und",cat:"Granito",stock_cuc:0,stock_baq:5,res:0,pre_res:0,disp_cuc:0,disp_baq:5,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // PIEDRA NATURAL
  {c:"0142812",n:"Crema Perlada 30.5x61x1,5cm Retapado Pulido",u:"m²",cat:"Piedra Natural",stock_cuc:59.9,stock_baq:0,res:0,pre_res:0,disp_cuc:59.9,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0148001",n:"Piedra Crema Perlada Patrón Francés",u:"m²",cat:"Piedra Natural",stock_cuc:0,stock_baq:115,res:0,pre_res:0,disp_cuc:0,disp_baq:115,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0136701",n:"Piedra Negro Absoluto 30xLL 1cm Natural",u:"m²",cat:"Piedra Natural",stock_cuc:13.29,stock_baq:0,res:0,pre_res:0,disp_cuc:13.29,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0004904",n:"Piedra Muñeca Crema 30xLL 2cm",u:"m²",cat:"Piedra Natural",stock_cuc:6.86,stock_baq:0,res:0,pre_res:0,disp_cuc:6.86,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0004704",n:"Piedra Muñeca Crema 30.5xLL 1cm",u:"m²",cat:"Piedra Natural",stock_cuc:0,stock_baq:37,res:0,pre_res:0,disp_cuc:0,disp_baq:37,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // SPLITFACE Y MÁS
  {c:"0158901",n:"Splitface Blanco 7x30x1,5cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:3.03,res:0,pre_res:0,disp_cuc:0,disp_baq:3.03,d1:81.48,d2:100,eta1:"26 Feb",eta2:"Finales Abr",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0158902",n:"Splitface Marfil 15x30x2,2cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:0,res:0,pre_res:163.43,disp_cuc:0,disp_baq:0,d1:261.91,d2:100.08,eta1:"26 Feb",eta2:"Finales Mar",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0159001",n:"Splitface Café 7x30x1,5cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:2.2,res:0,pre_res:0,disp_cuc:0,disp_baq:2.2,d1:113.4,d2:100,eta1:"26 Feb",eta2:"Finales Abr",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0159002",n:"Splitface Café 15x30x2cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:231.16,res:150,pre_res:0,disp_cuc:0,disp_baq:81.16,d1:175.14,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0160001",n:"Splitface Gris 7x30x1,5cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:61.12,res:0,pre_res:12,disp_cuc:0,disp_baq:61.12,d1:88.8,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0160002",n:"Splitface Gris 15x30x2,2cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:92.48,res:0,pre_res:0,disp_cuc:0,disp_baq:92.48,d1:100.17,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0162501",n:"Splitface Crema 30x7x1,5cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:63.24,res:0,pre_res:0,disp_cuc:0,disp_baq:63.24,d1:201.6,d2:71.4,eta1:"26 Feb",eta2:"Finales Mar",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0130201",n:"Travertino Splitface 10xJP 2,5cm",u:"m²",cat:"Splitface y Más",stock_cuc:159.5,stock_baq:0,res:0,pre_res:0,disp_cuc:159.5,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0162302",n:"Rockface Piedra Rústica Blanco Irregular",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:388,res:0,pre_res:0,disp_cuc:0,disp_baq:388,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0162301",n:"Rockface Piedra Rústica Crema Irregular",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:435,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0007003",n:"Espacato Crema 7x25cm",u:"m²",cat:"Splitface y Más",stock_cuc:47.7,stock_baq:0,res:0,pre_res:0,disp_cuc:47.7,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0007004",n:"Espacato Crema 10x25cm",u:"m²",cat:"Splitface y Más",stock_cuc:56,stock_baq:0,res:0,pre_res:0,disp_cuc:56,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0007001",n:"Espacato Blanco 7x25cm",u:"m²",cat:"Splitface y Más",stock_cuc:8.62,stock_baq:0,res:0,pre_res:0,disp_cuc:8.62,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0007002",n:"Espacato Blanco 10x25cm",u:"m²",cat:"Splitface y Más",stock_cuc:4.5,stock_baq:0,res:0,pre_res:0,disp_cuc:4.5,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0153701",n:"Thin Brick Hudson White 7x19cm",u:"m²",cat:"Splitface y Más",stock_cuc:16,stock_baq:0,res:0,pre_res:0,disp_cuc:16,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // PIZARRA
  {c:"0000401",n:"Pizarra Negra Óxido 5x15",u:"m²",cat:"Pizarra",stock_cuc:124.7,stock_baq:0,res:0,pre_res:0,disp_cuc:124.7,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000402",n:"Pizarra Negra Óxido 10x20",u:"m²",cat:"Pizarra",stock_cuc:117.6,stock_baq:0,res:0,pre_res:0,disp_cuc:117.6,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000403",n:"Pizarra Negra Óxido 20x20",u:"m²",cat:"Pizarra",stock_cuc:62.15,stock_baq:0,res:0,pre_res:0,disp_cuc:62.15,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000501",n:"Pizarra Verde Bosque 5x15",u:"m²",cat:"Pizarra",stock_cuc:89.9,stock_baq:0,res:0,pre_res:0,disp_cuc:89.9,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000502",n:"Pizarra Verde Bosque 10x20",u:"m²",cat:"Pizarra",stock_cuc:101.72,stock_baq:0,res:0,pre_res:0,disp_cuc:101.72,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001901",n:"Pizarra Verde Lima 5x15",u:"m²",cat:"Pizarra",stock_cuc:108,stock_baq:0,res:0,pre_res:0,disp_cuc:108,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001902",n:"Pizarra Verde Lima 10x20",u:"m²",cat:"Pizarra",stock_cuc:50,stock_baq:0,res:0,pre_res:0,disp_cuc:50,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0002102",n:"Pizarra Roseta Gris 5x15",u:"m²",cat:"Pizarra",stock_cuc:137.45,stock_baq:0,res:0,pre_res:0,disp_cuc:137.45,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0002104",n:"Pizarra Roseta Gris 10x20",u:"m²",cat:"Pizarra",stock_cuc:135.56,stock_baq:0,res:0,pre_res:0,disp_cuc:135.56,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000901",n:"Pizarra Primavera 5x15",u:"m²",cat:"Pizarra",stock_cuc:124.25,stock_baq:0,res:0,pre_res:0,disp_cuc:124.25,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000902",n:"Pizarra Primavera 10x15",u:"m²",cat:"Pizarra",stock_cuc:77,stock_baq:0,res:0,pre_res:0,disp_cuc:77,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001801",n:"Pizarra Blanco Nieve 5x15",u:"m²",cat:"Pizarra",stock_cuc:70,stock_baq:0,res:0,pre_res:0,disp_cuc:70,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000801",n:"Pizarra Oro Narciso 5x15",u:"m²",cat:"Pizarra",stock_cuc:96.2,stock_baq:0,res:0,pre_res:0,disp_cuc:96.2,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000802",n:"Pizarra Oro Narciso 10x20",u:"m²",cat:"Pizarra",stock_cuc:79.99,stock_baq:0,res:0,pre_res:0,disp_cuc:79.99,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0004601",n:"Pizarra Negra Veta 3xJP",u:"m²",cat:"Pizarra",stock_cuc:154.5,stock_baq:0,res:0,pre_res:0,disp_cuc:154.5,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0004602",n:"Pizarra Negra Veta 5xJP",u:"m²",cat:"Pizarra",stock_cuc:169,stock_baq:0,res:0,pre_res:0,disp_cuc:169,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0004603",n:"Pizarra Negra Veta 10xJP",u:"m²",cat:"Pizarra",stock_cuc:132,stock_baq:0,res:0,pre_res:0,disp_cuc:132,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // ACCESORIOS
  {c:"0158101",n:"Rejilla Mármol Crema 20x80x3cm 6 ranuras",u:"Und",cat:"Accesorios",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:100,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0158201",n:"Rejilla Mármol Blanco 20x80x3cm Arenado",u:"Und",cat:"Accesorios",stock_cuc:0,stock_baq:0,res:0,pre_res:22,disp_cuc:0,disp_baq:0,d1:0,d2:78,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0158301",n:"Rejilla Mármol Café 20x80x3cm 6 ranuras",u:"Und",cat:"Accesorios",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:80,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0163501",n:"Rejilla Mármol Gris 20x80x3cm 6 ranuras",u:"Und",cat:"Accesorios",stock_cuc:0,stock_baq:30,res:0,pre_res:0,disp_cuc:0,disp_baq:30,d1:0,d2:50,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0009401",n:"Lavamanos en Piedra Arenisca",u:"Und",cat:"Accesorios",stock_cuc:7,stock_baq:0,res:0,pre_res:0,disp_cuc:7,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0157501",n:"Lavamanos en Piedra Pizarra Negra",u:"Und",cat:"Accesorios",stock_cuc:10,stock_baq:0,res:0,pre_res:0,disp_cuc:10,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0166201",n:"Lavamanos en Mármol",u:"Und",cat:"Accesorios",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:12,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  // COMPLEMENTARIOS
  {c:"0150001",n:"Aquaprotector Hidrofugo PE 1 Litro",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:11,res:0,pre_res:0,disp_cuc:0,disp_baq:11,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0150002",n:"Aquaprotector Hidrofugo PE 4 Litros",u:"Und",cat:"Complementarios",stock_cuc:2,stock_baq:5,res:0,pre_res:0,disp_cuc:2,disp_baq:5,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0150003",n:"Aquaprotector Hidrofugo PE 20 Litros",u:"Und",cat:"Complementarios",stock_cuc:4,stock_baq:18,res:0,pre_res:0,disp_cuc:4,disp_baq:18,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0149916",n:"Boquilla Junta Flex Látex 5Kg Mocca",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:19,res:0,pre_res:0,disp_cuc:0,disp_baq:19,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0149915",n:"Boquilla Junta Flex Látex 5Kg Verde",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:20,res:0,pre_res:0,disp_cuc:0,disp_baq:20,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0149904",n:"Boquilla Junta Flex Látex 2Kg Beige",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:1,res:0,pre_res:0,disp_cuc:0,disp_baq:1,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001702",n:"EcoHidrofugo Sealine 1 Galón",u:"Und",cat:"Complementarios",stock_cuc:10,stock_baq:0,res:0,pre_res:0,disp_cuc:10,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001701",n:"EcoHidrofugo Sealine 1/4 Galón",u:"Und",cat:"Complementarios",stock_cuc:9,stock_baq:0,res:0,pre_res:0,disp_cuc:9,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001102",n:"Hidrofugo Sealine 1 Galón",u:"Und",cat:"Complementarios",stock_cuc:13,stock_baq:13,res:0,pre_res:0,disp_cuc:13,disp_baq:13,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001101",n:"Hidrofugo Sealine 1/4 Galón",u:"Und",cat:"Complementarios",stock_cuc:8,stock_baq:16,res:0,pre_res:0,disp_cuc:8,disp_baq:16,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001103",n:"Hidrofugo Sealine sin Color 5 Galones",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:19,res:0,pre_res:0,disp_cuc:0,disp_baq:19,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001202",n:"Rinse Sealine 1 Galón",u:"Und",cat:"Complementarios",stock_cuc:3,stock_baq:0,res:0,pre_res:0,disp_cuc:3,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001201",n:"Rinse Sealine 1/4 Galón",u:"Und",cat:"Complementarios",stock_cuc:3,stock_baq:0,res:0,pre_res:0,disp_cuc:3,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0019303",n:"Sellador Exteriores Sealine 5 Galones",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:7,res:0,pre_res:0,disp_cuc:0,disp_baq:7,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0019302",n:"Sellador Exteriores Sealine 1 Galón",u:"Und",cat:"Complementarios",stock_cuc:5,stock_baq:7,res:0,pre_res:0,disp_cuc:5,disp_baq:7,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0019301",n:"Sellador Exteriores 1/4 Galón",u:"Und",cat:"Complementarios",stock_cuc:9,stock_baq:0,res:0,pre_res:0,disp_cuc:9,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0159107",n:"Boquilla MorcemColor Gris 5Kg",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:1,res:0,pre_res:0,disp_cuc:0,disp_baq:1,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0159105",n:"Boquilla MorcemColor Beige 5Kg",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:33,res:0,pre_res:0,disp_cuc:0,disp_baq:33,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0159106",n:"Boquilla MorcemColor Blanco 5Kg",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:21,res:0,pre_res:0,disp_cuc:0,disp_baq:21,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
];
