export interface Product {
  c: string;
  n: string;
  u: string;
  cat: Category;
  cuc: number;
  baq: number;
  d1: number;
  d2: number;
  eta1: string | null;
  eta2: string | null;
  res: number;
}

export type Category = "Mármol" | "Travertino" | "Bali/Piedra" | "Splitface" | "Pizarra";

export const CATEGORIES: ("Todos" | Category)[] = ["Todos", "Mármol", "Travertino", "Bali/Piedra", "Splitface", "Pizarra"];

export const CAT_STYLE: Record<Category, { colorClass: string; bgClass: string }> = {
  "Mármol":      { colorClass: "text-cat-marmol",     bgClass: "bg-cat-marmol-bg" },
  "Travertino":  { colorClass: "text-cat-travertino",  bgClass: "bg-cat-travertino-bg" },
  "Bali/Piedra": { colorClass: "text-cat-bali",        bgClass: "bg-cat-bali-bg" },
  "Splitface":   { colorClass: "text-cat-splitface",    bgClass: "bg-cat-splitface-bg" },
  "Pizarra":     { colorClass: "text-cat-pizarra",      bgClass: "bg-cat-pizarra-bg" },
};

export const fmt = (v: number) =>
  v > 0 ? v.toLocaleString("es-CO", { maximumFractionDigits: 1 }) : "—";

export const PRODUCTS: Product[] = [
  {c:"0136401",n:"Mármol Crema 40xLL 1.2cm Arenado",u:"m²",cat:"Mármol",cuc:0,baq:1368.19,d1:856.46,d2:0,eta1:"26 Feb 2026",eta2:null,res:143.5},
  {c:"0163701",n:"Mármol Crema 40xLL 1.2cm Arenado c/vetas",u:"m²",cat:"Mármol",cuc:0,baq:233.36,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0136402",n:"Mármol Crema 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",cuc:0,baq:1.3,d1:0,d2:701.18,eta1:null,eta2:"Mar 2026",res:19.5},
  {c:"0137202",n:"Mármol Crema 30.5x100x2cm Rompeolas",u:"ml",cat:"Mármol",cuc:0,baq:291.97,d1:0,d2:251.97,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0137203",n:"Mármol Crema 40x100x2cm Rompeolas",u:"ml",cat:"Mármol",cuc:8,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0154501",n:"Mármol Arenado 40xLL 1.2cm",u:"m²",cat:"Mármol",cuc:0,baq:1300.58,d1:511.26,d2:1354.12,eta1:"26 Feb 2026",eta2:"Mar 2026",res:126.6},
  {c:"0156102",n:"Mármol Arenado 30.5xLL 2cm Rompeolas",u:"ml",cat:"Mármol",cuc:0,baq:499.98,d1:0,d2:134.98,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0158501",n:"Mármol Nuevo Marfil 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",cuc:0,baq:12.34,d1:195,d2:695.2,eta1:"Feb 2026",eta2:"Mar 2026",res:9.7},
  {c:"0158504",n:"Mármol Nuevo Marfil 40xLL 1.5cm Brillado",u:"m²",cat:"Mármol",cuc:0,baq:2019.72,d1:0,d2:0,eta1:null,eta2:null,res:17.2},
  {c:"0154102",n:"Mármol Café 40xLL 1.2cm Arenado",u:"m²",cat:"Mármol",cuc:2.1,baq:1338.24,d1:0,d2:863.64,eta1:null,eta2:"Mar 2026",res:51.2},
  {c:"0154101",n:"Mármol Café 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",cuc:1.36,baq:421.49,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0154203",n:"Mármol Café 30.5x100x2cm Rompeolas",u:"ml",cat:"Mármol",cuc:0,baq:855,d1:0,d2:183.97,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0156001",n:"Mármol Gris 40xLL 1.2cm Arenado",u:"m²",cat:"Mármol",cuc:1.89,baq:631.64,d1:0,d2:140.32,eta1:null,eta2:"Mar 2026",res:0},
  {c:"0156002",n:"Mármol Gris 40xLL 1.2cm Cepillado",u:"m²",cat:"Mármol",cuc:2.56,baq:234.28,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0162001",n:"Mármol Tundra Grey 40xLL 1.2cm Pulido Mate",u:"m²",cat:"Mármol",cuc:0,baq:296.46,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0161802",n:"Mármol Ibiza Gold 61x122x1cm Brillante",u:"m²",cat:"Mármol",cuc:0,baq:327.44,d1:0,d2:327.44,eta1:null,eta2:"Abr 2026",res:0},
  {c:"0162003",n:"Mármol Afyon Grey 40xLL 1cm Arenado",u:"m²",cat:"Mármol",cuc:0,baq:299.67,d1:0,d2:299.67,eta1:null,eta2:"Abr 2026",res:0},
  {c:"0128702",n:"Travertino Clásico 30.5x61x1.2cm Pulido",u:"m²",cat:"Travertino",cuc:0.07,baq:148.32,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0128701",n:"Travertino Clásico 40xLL 1.2cm Pulido",u:"m²",cat:"Travertino",cuc:0,baq:1589.71,d1:0,d2:0,eta1:null,eta2:null,res:13.3},
  {c:"0163601",n:"Travertino Turco 30xLL 2cm Pulido",u:"m²",cat:"Travertino",cuc:0,baq:900,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0157201",n:"Travertino Macadamia 40.6x61x1.2cm",u:"m²",cat:"Travertino",cuc:0,baq:871.86,d1:0,d2:0,eta1:null,eta2:null,res:35.6},
  {c:"0128102",n:"Travertino Ivory 40x61x1.2cm",u:"m²",cat:"Travertino",cuc:0.84,baq:274.58,d1:0,d2:0,eta1:null,eta2:null,res:32.9},
  {c:"0128103",n:"Travertino Ivory 40.6x61x1.2cm Retapado",u:"m²",cat:"Travertino",cuc:14.15,baq:752.97,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0154001",n:"Travertino Arena 40.6x61x1.2cm",u:"m²",cat:"Travertino",cuc:657.47,baq:911.49,d1:0,d2:0,eta1:null,eta2:null,res:44.9},
  {c:"0000601",n:"Bali Verde 20x20",u:"m²",cat:"Bali/Piedra",cuc:889,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:29.7},
  {c:"0000602",n:"Bali Verde 10x10",u:"m²",cat:"Bali/Piedra",cuc:0,baq:5.79,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0003201",n:"Bali Negra 10x10",u:"m²",cat:"Bali/Piedra",cuc:16,baq:160,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0003202",n:"Bali Negra 20x20",u:"m²",cat:"Bali/Piedra",cuc:63,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0160101",n:"Bali Azul 20x20",u:"m²",cat:"Bali/Piedra",cuc:199,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158901",n:"Splitface Blanco 7x30x1.5cm",u:"m²",cat:"Splitface",cuc:3.03,baq:81.48,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158902",n:"Splitface Blanco 15x30x2.2cm",u:"m²",cat:"Splitface",cuc:0,baq:261.91,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0159001",n:"Splitface Café 7x30x1.5cm",u:"m²",cat:"Splitface",cuc:2.2,baq:113.4,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0159002",n:"Splitface Café 15x30x2.2cm",u:"m²",cat:"Splitface",cuc:231.16,baq:175.14,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0160001",n:"Splitface Gris 7x30x1.5cm",u:"m²",cat:"Splitface",cuc:61.12,baq:88.8,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0160002",n:"Splitface Gris 15x30x2.2cm",u:"m²",cat:"Splitface",cuc:92.48,baq:100.17,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0162501",n:"Splitface Crema 30x7x1.5cm",u:"m²",cat:"Splitface",cuc:63.24,baq:201.6,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158601",n:"Thin Brick Mármol Marfil 7x25x1.5cm",u:"m²",cat:"Splitface",cuc:10.91,baq:62.91,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0158701",n:"Thin Brick Mármol Café 7x25x1.5cm",u:"m²",cat:"Splitface",cuc:48.04,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000401",n:"Pizarra Negra Óxido 5x15",u:"m²",cat:"Pizarra",cuc:124.7,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000402",n:"Pizarra Negra Óxido 10x20",u:"m²",cat:"Pizarra",cuc:117.6,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000501",n:"Pizarra Verde Bosque 5x15",u:"m²",cat:"Pizarra",cuc:89.9,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0000502",n:"Pizarra Verde Bosque 10x20",u:"m²",cat:"Pizarra",cuc:105.72,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0002102",n:"Pizarra Roseta Gris 5x15",u:"m²",cat:"Pizarra",cuc:137.45,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0004601",n:"Pizarra Negra Veta 3xJP",u:"m²",cat:"Pizarra",cuc:154.5,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
  {c:"0004602",n:"Pizarra Negra Veta 5xJP",u:"m²",cat:"Pizarra",cuc:169,baq:0,d1:0,d2:0,eta1:null,eta2:null,res:0},
];
