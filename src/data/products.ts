export interface Product {
  c: string;
  n: string;
  u: string;
  cat: Category;
  baq: number;
  cuc: number;
  d1: number;
  d2: number;
  eta1: string | null;
  eta2: string | null;
  res: number;
}

export type Category = "Mármol" | "Travertino" | "Bali/Piedra" | "Splitface" | "Pizarra" | "Complementarios";

export const CATEGORIES: ("Todos" | Category)[] = ["Todos", "Mármol", "Travertino", "Bali/Piedra", "Splitface", "Pizarra", "Complementarios"];

export type CatKey = "marmol" | "travertino" | "bali" | "splitface" | "pizarra" | "complementarios";

export const CAT_KEY_MAP: Record<Category, CatKey> = {
  "Mármol": "marmol",
  "Travertino": "travertino",
  "Bali/Piedra": "bali",
  "Splitface": "splitface",
  "Pizarra": "pizarra",
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

export const PRODUCTS: Product[] = [
  {c:"0136401",n:"Mármol Crema 40xLL 1.2cm Arenado",u:"m²",cat:"Mármol",baq:1368.19,cuc:0,d1:856.46,d2:0,eta1:"26 Feb",eta2:null,res:143.5},
  {c:"0163701",n:"Mármol Crema 40xLL 1.2cm Arenado c/vetas",u:"m²",cat:"Mármol",baq:233.36,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0136402",n:"Mármol Crema 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",baq:1.3,cuc:0,d1:0,d2:701.18,eta1:null,eta2:"Mar 2026",res:19.5},
  {c:"0154501",n:"Mármol Arenado 40xLL 1.2cm",u:"m²",cat:"Mármol",baq:1300.58,cuc:0,d1:511.26,d2:1354.12,eta1:"26 Feb",eta2:"Mar 2026",res:126.6},
  {c:"0156102",n:"Mármol Arenado 30.5xLL 2cm Rompeolas",u:"ml",cat:"Mármol",baq:499.98,cuc:0,d1:0,d2:134.98,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0158501",n:"Mármol Nuevo Marfil 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",baq:12.34,cuc:0,d1:195,d2:695.2,eta1:"Feb 2026",eta2:"Mar 2026",res:9.7},
  {c:"0158504",n:"Mármol Nuevo Marfil 40xLL 1.5cm Brillado",u:"m²",cat:"Mármol",baq:2019.72,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:17.2},
  {c:"0154102",n:"Mármol Café 40xLL 1.2cm Arenado",u:"m²",cat:"Mármol",baq:1338.24,cuc:2.1,d1:0,d2:863.64,eta1:null,eta2:"Mar 2026",res:51.2},
  {c:"0154101",n:"Mármol Café 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",baq:421.49,cuc:1.36,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0154203",n:"Mármol Café 30.5x100x2cm Rompeolas",u:"ml",cat:"Mármol",baq:855,cuc:0,d1:0,d2:183.97,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0156001",n:"Mármol Gris 40xLL 1.2cm Arenado",u:"m²",cat:"Mármol",baq:631.64,cuc:1.89,d1:0,d2:140.32,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0156002",n:"Mármol Gris 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",baq:234.28,cuc:2.56,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0162001",n:"Mármol Tundra Grey 40xLL 1.2cm Pulido",u:"m²",cat:"Mármol",baq:296.46,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0161802",n:"Mármol Ibiza Gold 61x122x1cm Brillante",u:"m²",cat:"Mármol",baq:327.44,cuc:0,d1:0,d2:327.44,eta1:null,eta2:"Abr 2026",res:0},
  {c:"0162003",n:"Mármol Afyon Grey 40xLL 1cm Arenado",u:"m²",cat:"Mármol",baq:299.67,cuc:0,d1:0,d2:299.67,eta1:null,eta2:"Abr 2026",res:0},
  {c:"0137202",n:"Mármol Crema 30.5x100x2cm Rompeolas",u:"ml",cat:"Mármol",baq:291.97,cuc:0,d1:0,d2:251.97,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0128702",n:"Travertino Clásico 30.5x61x1.2cm Pulido",u:"m²",cat:"Travertino",baq:148.32,cuc:0.07,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0128701",n:"Travertino Clásico 40xLL 1.2cm Pulido",u:"m²",cat:"Travertino",baq:1589.71,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:13.3},
  {c:"0163601",n:"Travertino Turco 30xLL 2cm Pulido",u:"m²",cat:"Travertino",baq:900,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0157201",n:"Travertino Macadamia 40.6x61x1.2cm",u:"m²",cat:"Travertino",baq:871.86,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:35.6},
  {c:"0128102",n:"Travertino Ivory 40x61x1.2cm",u:"m²",cat:"Travertino",baq:274.58,cuc:0.84,d1:0,d2:0,eta1:null,eta2:null,res:32.9},
  {c:"0128103",n:"Travertino Ivory 40.6x61x1.2cm Retapado",u:"m²",cat:"Travertino",baq:752.97,cuc:14.15,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0154001",n:"Travertino Arena 40.6x61x1.2cm",u:"m²",cat:"Travertino",baq:911.49,cuc:657.47,d1:0,d2:0,eta1:null,eta2:null,res:44.9},
  {c:"0000601",n:"Bali Verde 20x20",u:"m²",cat:"Bali/Piedra",baq:0,cuc:889,d1:0,d2:0,eta1:null,eta2:null,res:29.7},
  {c:"0000602",n:"Bali Verde 10x10",u:"m²",cat:"Bali/Piedra",baq:5.79,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0003201",n:"Bali Negra 10x10",u:"m²",cat:"Bali/Piedra",baq:160,cuc:16,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0003202",n:"Bali Negra 20x20",u:"m²",cat:"Bali/Piedra",baq:0,cuc:63,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0160101",n:"Bali Azul 20x20",u:"m²",cat:"Bali/Piedra",baq:0,cuc:199,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158901",n:"Splitface Blanco 7x30x1.5cm",u:"m²",cat:"Splitface",baq:81.48,cuc:3.03,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158902",n:"Splitface Blanco 15x30x2.2cm",u:"m²",cat:"Splitface",baq:261.91,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0159001",n:"Splitface Café 7x30x1.5cm",u:"m²",cat:"Splitface",baq:113.4,cuc:2.2,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0159002",n:"Splitface Café 15x30x2.2cm",u:"m²",cat:"Splitface",baq:175.14,cuc:231.16,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0160001",n:"Splitface Gris 7x30x1.5cm",u:"m²",cat:"Splitface",baq:88.8,cuc:61.12,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0160002",n:"Splitface Gris 15x30x2.2cm",u:"m²",cat:"Splitface",baq:100.17,cuc:92.48,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0162501",n:"Splitface Crema 30x7x1.5cm",u:"m²",cat:"Splitface",baq:201.6,cuc:63.24,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158601",n:"Thin Brick Mármol Marfil 7x25x1.5cm",u:"m²",cat:"Splitface",baq:62.91,cuc:10.91,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158701",n:"Thin Brick Mármol Café 7x25x1.5cm",u:"m²",cat:"Splitface",baq:0,cuc:48.04,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000401",n:"Pizarra Negra Óxido 5x15",u:"m²",cat:"Pizarra",baq:0,cuc:124.7,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000402",n:"Pizarra Negra Óxido 10x20",u:"m²",cat:"Pizarra",baq:0,cuc:117.6,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000501",n:"Pizarra Verde Bosque 5x15",u:"m²",cat:"Pizarra",baq:0,cuc:89.9,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000502",n:"Pizarra Verde Bosque 10x20",u:"m²",cat:"Pizarra",baq:0,cuc:105.72,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0002102",n:"Pizarra Roseta Gris 5x15",u:"m²",cat:"Pizarra",baq:0,cuc:137.45,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0004601",n:"Pizarra Negra Veta 3xJP",u:"m²",cat:"Pizarra",baq:0,cuc:154.5,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0004602",n:"Pizarra Negra Veta 5xJP",u:"m²",cat:"Pizarra",baq:0,cuc:169,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0150001",n:"Aquaprotector Hidrofugo PE 1 Litro",u:"Und",cat:"Complementarios",baq:11,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0150002",n:"Aquaprotector Hidrofugo PE 4 Litros",u:"Und",cat:"Complementarios",baq:5,cuc:2,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0150003",n:"Aquaprotector Hidrofugo PE 20 Litros",u:"Und",cat:"Complementarios",baq:19,cuc:4,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0149916",n:"Boquilla Junta Flex Látex 5Kg Mocca",u:"Und",cat:"Complementarios",baq:19,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0149904",n:"Boquilla Junta Flex Látex 2Kg Beige",u:"Und",cat:"Complementarios",baq:1,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0001702",n:"EcoHidrofugo Sealine 1 Galón",u:"Und",cat:"Complementarios",baq:0,cuc:10,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0001701",n:"EcoHidrofugo Sealine 1/4 Galón",u:"Und",cat:"Complementarios",baq:0,cuc:9,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0001102",n:"Hidrofugo Sealine 1 Galón",u:"Und",cat:"Complementarios",baq:13,cuc:13,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0001101",n:"Hidrofugo Sealine 1/4 Galón",u:"Und",cat:"Complementarios",baq:16,cuc:8,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0001103",n:"Hidrofugo Sealine sin Color 5 Galones",u:"Und",cat:"Complementarios",baq:19,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0001202",n:"Rinse Sealine 1 Galón",u:"Und",cat:"Complementarios",baq:0,cuc:3,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0001201",n:"Rinse Sealine 1/4 Galón",u:"Und",cat:"Complementarios",baq:0,cuc:3,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0019303",n:"Sellador Exteriores Sealine 5 Galones",u:"Und",cat:"Complementarios",baq:7,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0019302",n:"Sellador Exteriores Sealine 1 Galón",u:"Und",cat:"Complementarios",baq:7,cuc:5,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0019301",n:"Sellador Exteriores 1/4 Galón",u:"Und",cat:"Complementarios",baq:0,cuc:9,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0159105",n:"Boquilla MorcemColor Beige 5Kg",u:"Und",cat:"Complementarios",baq:33,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0159106",n:"Boquilla MorcemColor Blanco 5Kg",u:"Und",cat:"Complementarios",baq:21,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0159107",n:"Boquilla MorcemColor Gris 5Kg",u:"Und",cat:"Complementarios",baq:1,cuc:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
];
