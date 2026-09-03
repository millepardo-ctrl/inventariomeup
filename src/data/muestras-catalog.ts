export type TipoProducto = "losa" | "pieza" | "borde";
export type TipoMuestra = "muestra" | "ficha" | "pieza";
export type TipoEnvio = "estandar" | "urgente";
export type EstadoSolicitud = "pendiente" | "despachado";

export interface MuestrasRef {
  cod: string;
  l: string;
  m2?: number;
}

export interface MuestrasFamilia {
  id: string;
  cat: string;
  fam: string;
  tp: TipoProducto;
  refs: MuestrasRef[];
}

export interface CarritoItem {
  familiaId: string;
  refIdx: number;
  tipo: TipoMuestra;
}

export interface SolicitudItem {
  codigo: string;
  referencia: string;
  acabado: string;
  tipo: TipoMuestra;
  m2ref: number | null;
}

export interface Destinatario {
  nom: string;
  ced: string;
  cel: string;
  emp: string;
  dir: string;
  city: string;
  depto: string;
}

export interface Solicitud {
  id: string;
  asesor: string;
  tipoEnvio: TipoEnvio;
  destinatario: Destinatario;
  items: SolicitudItem[];
  estado: EstadoSolicitud;
  fechaSolicitud: string;
  fechaDespacho: string | null;
  origen: "panel" | "telegram";
}

export function itemM2(it: SolicitudItem): number {
  if (it.tipo === "muestra") return 0.015;
  if (it.tipo === "ficha") return it.m2ref || 0.09;
  return it.m2ref ?? 0.04;
}

export const CATS_MUESTRAS = ["Mármol","Travertino","Bali / Piedra","Granito","Piedra Natural","Splitface y Más","Pizarra"] as const;
export type CatMuestras = typeof CATS_MUESTRAS[number];

export const CAT_TOKEN: Record<string, string> = {
  "Mármol": "marmol", "Travertino": "travertino", "Bali / Piedra": "bali",
  "Granito": "granito", "Piedra Natural": "piedra", "Splitface y Más": "splitface", "Pizarra": "pizarra",
};

export const ASESORES_MUESTRAS = [
  "Andrea Arboleda","Johan Nicolas Avellaneda","John Vargas",
  "Jose Vital","Juan Carlos Mejía","Miguel Pardo",
  "Milena Pardo","Paola Ospina","Sami Pardo",
];

export const CIUDADES = [
  {c:"Medellín",d:"Antioquia"},{c:"Bello",d:"Antioquia"},{c:"Itagüí",d:"Antioquia"},
  {c:"Envigado",d:"Antioquia"},{c:"Sabaneta",d:"Antioquia"},{c:"La Estrella",d:"Antioquia"},
  {c:"Caldas",d:"Antioquia"},{c:"Copacabana",d:"Antioquia"},{c:"Girardota",d:"Antioquia"},
  {c:"Barbosa",d:"Antioquia"},{c:"Rionegro",d:"Antioquia"},{c:"Marinilla",d:"Antioquia"},
  {c:"La Ceja",d:"Antioquia"},{c:"El Retiro",d:"Antioquia"},{c:"Guarne",d:"Antioquia"},
  {c:"Santa Rosa de Osos",d:"Antioquia"},{c:"Yarumal",d:"Antioquia"},{c:"Apartadó",d:"Antioquia"},
  {c:"Turbo",d:"Antioquia"},{c:"Caucasia",d:"Antioquia"},{c:"Andes",d:"Antioquia"},
  {c:"Jericó",d:"Antioquia"},{c:"Jardín",d:"Antioquia"},{c:"Ciudad Bolívar",d:"Antioquia"},
  {c:"Bogotá",d:"Bogotá D.C."},{c:"Soacha",d:"Cundinamarca"},{c:"Chía",d:"Cundinamarca"},
  {c:"Cajicá",d:"Cundinamarca"},{c:"Zipaquirá",d:"Cundinamarca"},{c:"Facatativá",d:"Cundinamarca"},
  {c:"Fusagasugá",d:"Cundinamarca"},{c:"Mosquera",d:"Cundinamarca"},{c:"Madrid",d:"Cundinamarca"},
  {c:"Funza",d:"Cundinamarca"},{c:"Tocancipá",d:"Cundinamarca"},{c:"Sopó",d:"Cundinamarca"},
  {c:"Girardot",d:"Cundinamarca"},{c:"Villeta",d:"Cundinamarca"},
  {c:"Cali",d:"Valle del Cauca"},{c:"Palmira",d:"Valle del Cauca"},{c:"Buenaventura",d:"Valle del Cauca"},
  {c:"Tulúa",d:"Valle del Cauca"},{c:"Buga",d:"Valle del Cauca"},{c:"Cartago",d:"Valle del Cauca"},
  {c:"Yumbo",d:"Valle del Cauca"},{c:"Jamundí",d:"Valle del Cauca"},{c:"Candelaria",d:"Valle del Cauca"},
  {c:"Barranquilla",d:"Atlántico"},{c:"Soledad",d:"Atlántico"},{c:"Malambo",d:"Atlántico"},
  {c:"Cartagena",d:"Bolívar"},{c:"Magangué",d:"Bolívar"},{c:"Mompox",d:"Bolívar"},
  {c:"Bucaramanga",d:"Santander"},{c:"Floridablanca",d:"Santander"},{c:"Girón",d:"Santander"},
  {c:"Piedecuesta",d:"Santander"},{c:"Barrancabermeja",d:"Santander"},{c:"San Gil",d:"Santander"},
  {c:"Cúcuta",d:"Norte de Santander"},{c:"Villa del Rosario",d:"Norte de Santander"},
  {c:"Los Patios",d:"Norte de Santander"},{c:"Ocaña",d:"Norte de Santander"},
  {c:"Santa Marta",d:"Magdalena"},{c:"Ciénaga",d:"Magdalena"},
  {c:"Pereira",d:"Risaralda"},{c:"Dosquebradas",d:"Risaralda"},{c:"Santa Rosa de Cabal",d:"Risaralda"},
  {c:"Manizales",d:"Caldas"},{c:"Villamaría",d:"Caldas"},{c:"Chinchiná",d:"Caldas"},
  {c:"Armenia",d:"Quindío"},{c:"Calarcá",d:"Quindío"},{c:"Montenegro",d:"Quindío"},
  {c:"Ibagué",d:"Tolima"},{c:"Espinal",d:"Tolima"},{c:"Honda",d:"Tolima"},
  {c:"Neiva",d:"Huila"},{c:"Garzón",d:"Huila"},{c:"Pitalito",d:"Huila"},
  {c:"Pasto",d:"Nariño"},{c:"Ipiales",d:"Nariño"},{c:"Tumaco",d:"Nariño"},
  {c:"Montería",d:"Córdoba"},{c:"Lorica",d:"Córdoba"},{c:"Cereté",d:"Córdoba"},
  {c:"Sincelejo",d:"Sucre"},{c:"Valledupar",d:"Cesar"},{c:"Riohacha",d:"La Guajira"},
  {c:"Tunja",d:"Boyacá"},{c:"Duitama",d:"Boyacá"},{c:"Sogamoso",d:"Boyacá"},
  {c:"Villavicencio",d:"Meta"},{c:"Acacías",d:"Meta"},{c:"Yopal",d:"Casanare"},
  {c:"Popayán",d:"Cauca"},{c:"Quibdó",d:"Chocó"},{c:"Florencia",d:"Caquetá"},
  {c:"San Andrés",d:"San Andrés y Providencia"},{c:"Leticia",d:"Amazonas"},
];

// tp:"losa" → toggle muestra 10×15 / ficha grande
// tp:"pieza" → seleccionar formato real (no se corta)
// tp:"borde" → rompeolas: toggle muestra 10×15 / pieza completa (usa ref.m2)
export const CAT: MuestrasFamilia[] = [
  // ── Mármol losas ───────────────────────────────────────────────────────────
  {id:"marcrema",   cat:"Mármol",fam:"Mármol Crema",tp:"losa",
   refs:[{cod:"0136401",l:"Arenado"},{cod:"0136402",l:"Cepillado"},{cod:"0136413",l:"Pulido Mate"}]},
  {id:"marcveta",   cat:"Mármol",fam:"Mármol Crema a la Veta",tp:"losa",
   refs:[{cod:"0163701",l:"Arenado"}]},
  {id:"mararenado", cat:"Mármol",fam:"Mármol Arenado",tp:"losa",
   refs:[{cod:"0154501",l:"Arenado"}]},
  {id:"marmarfil",  cat:"Mármol",fam:"Mármol Nuevo Marfil",tp:"losa",
   refs:[{cod:"0158501",l:"Cepillado"},{cod:"0158504",l:"Brillado"}]},
  {id:"marcafe",    cat:"Mármol",fam:"Mármol Café",tp:"losa",
   refs:[{cod:"0154106",l:"Arenado"},{cod:"0154101",l:"Cepillado"},{cod:"0154108",l:"Arenado+Anticado"}]},
  {id:"margris",    cat:"Mármol",fam:"Mármol Gris",tp:"losa",
   refs:[{cod:"0156001",l:"Arenado"},{cod:"0156002",l:"Cepillado"}]},
  {id:"martundgr",  cat:"Mármol",fam:"Mármol Tundra Grey",tp:"losa",
   refs:[{cod:"0161901",l:"Pulido Mate"}]},
  {id:"martundlt",  cat:"Mármol",fam:"Mármol Tundra Light",tp:"losa",
   refs:[{cod:"0161902",l:"Natural 2cm"}]},
  {id:"maribizagr", cat:"Mármol",fam:"Mármol Ibiza Gray",tp:"losa",
   refs:[{cod:"0159602",l:"Brillante"}]},
  {id:"maribizago", cat:"Mármol",fam:"Mármol Ibiza Gold",tp:"losa",
   refs:[{cod:"0161802",l:"Brillante"},{cod:"0161801",l:"Brillante+Dorado"}]},
  {id:"marafyon",   cat:"Mármol",fam:"Mármol Afyon Grey",tp:"losa",
   refs:[{cod:"0162002",l:"Pulido Mate"},{cod:"0167201",l:"Arenado"}]},
  {id:"margold",    cat:"Mármol",fam:"Mármol Gold",tp:"losa",
   refs:[{cod:"0161601",l:"Brillado"}]},
  {id:"marrimp",    cat:"Mármol",fam:"Mármol Royal Imperial",tp:"losa",
   refs:[{cod:"0157301",l:"Cepillado 1cm"},{cod:"0157306",l:"Pulido Mate"}]},
  {id:"marempera",  cat:"Mármol",fam:"Mármol Marrón Emperador",tp:"losa",
   refs:[{cod:"0163801",l:"Brillado"}]},
  // ── Mármol piezas ──────────────────────────────────────────────────────────
  {id:"romcrema",   cat:"Mármol",fam:"Rompeolas Crema",tp:"borde",
   refs:[{cod:"0137202",l:"30.5×100cm",m2:0.305}]},
  {id:"romcafe",    cat:"Mármol",fam:"Rompeolas Café",tp:"borde",
   refs:[{cod:"0154203",l:"30.5×100cm",m2:0.305}]},
  {id:"romgris",    cat:"Mármol",fam:"Rompeolas Gris",tp:"borde",
   refs:[{cod:"0154303",l:"Arenado (30.5×LL)",m2:0.1525},{cod:"0154301",l:"Cepillado (30.5×LL)",m2:0.1525}]},
  {id:"romafyon",   cat:"Mármol",fam:"Rompeola Afyon Grey",tp:"borde",
   refs:[{cod:"0167101",l:"30.5×LL Arenado",m2:0.1525}]},
  {id:"adocrema",   cat:"Mármol",fam:"Adoquín Crema",tp:"pieza",
   refs:[{cod:"0162103",l:"10×10×3cm",m2:0.01},{cod:"0162109",l:"10×10×5cm",m2:0.01},{cod:"0166603",l:"5×20×3cm",m2:0.01}]},
  {id:"adocafe",    cat:"Mármol",fam:"Adoquín Café",tp:"pieza",
   refs:[{cod:"0162102",l:"10×10×3cm",m2:0.01},{cod:"0166706",l:"5×20×4cm",m2:0.01}]},
  {id:"adogris",    cat:"Mármol",fam:"Adoquín Gris",tp:"pieza",
   refs:[{cod:"0162101",l:"10×10×3cm",m2:0.01}]},
  {id:"thincrema",  cat:"Mármol",fam:"Thin Brick Crema",tp:"pieza",
   refs:[{cod:"0167301",l:"7×25cm",m2:0.0175}]},
  {id:"thinmarfil", cat:"Mármol",fam:"Thin Brick Marfil",tp:"pieza",
   refs:[{cod:"0158601",l:"7×25cm",m2:0.0175}]},
  {id:"thincafe",   cat:"Mármol",fam:"Thin Brick Café",tp:"pieza",
   refs:[{cod:"0158701",l:"7×25cm",m2:0.0175}]},
  {id:"thingris",   cat:"Mármol",fam:"Thin Brick Gris",tp:"pieza",
   refs:[{cod:"0158801",l:"7×25cm",m2:0.0175}]},
  // ── Travertino losas ───────────────────────────────────────────────────────
  {id:"travclasico",cat:"Travertino",fam:"Travertino Clásico",tp:"losa",
   refs:[{cod:"0128702",l:"Pulido Poro Abierto"},{cod:"0128701",l:"Pulido PA (LL)"}]},
  {id:"travturco",  cat:"Travertino",fam:"Travertino Turco",tp:"losa",
   refs:[{cod:"0163601",l:"Semipulido"}]},
  {id:"travmacad",  cat:"Travertino",fam:"Travertino Macadamia",tp:"losa",
   refs:[{cod:"0157202",l:"Tomboleado LL"},{cod:"0157201",l:"Tomboleado 61cm"}]},
  {id:"travivory",  cat:"Travertino",fam:"Travertino Ivory Crema",tp:"losa",
   refs:[{cod:"0128102",l:"Tomboleado"},{cod:"0128103",l:"Pulido+Retape"}]},
  {id:"travarena",  cat:"Travertino",fam:"Travertino Arena",tp:"losa",
   refs:[{cod:"0154001",l:"Tomboleado"}]},
  {id:"travdurand", cat:"Travertino",fam:"Travertino Durando Imperial",tp:"losa",
   refs:[{cod:"0128403",l:"Cepillado 3cm"}]},
  // ── Travertino piezas ──────────────────────────────────────────────────────
  {id:"travthin",   cat:"Travertino",fam:"Thin Brick Travertino",tp:"pieza",
   refs:[{cod:"0155001",l:"8×40cm",m2:0.032}]},
  {id:"romtraviv",  cat:"Travertino",fam:"Rompeolas Ivory",tp:"borde",
   refs:[{cod:"0163201",l:"30.5×61cm",m2:0.186}]},
  {id:"adotravno",  cat:"Travertino",fam:"Adoquín Travertino Noche",tp:"pieza",
   refs:[{cod:"0128601",l:"10×20×3cm",m2:0.02}]},
  // ── Bali / Piedra ──────────────────────────────────────────────────────────
  {id:"baligreen",  cat:"Bali / Piedra",fam:"Bali Green",tp:"pieza",
   refs:[{cod:"0000601",l:"20×20cm",m2:0.04},{cod:"0000602",l:"10×10cm",m2:0.01}]},
  {id:"baliblack",  cat:"Bali / Piedra",fam:"Bali Black",tp:"pieza",
   refs:[{cod:"0003202",l:"20×20cm",m2:0.04},{cod:"0003201",l:"10×10cm",m2:0.01}]},
  {id:"baliturq",   cat:"Bali / Piedra",fam:"Bali Turquesa Azul",tp:"pieza",
   refs:[{cod:"0160101",l:"20×20cm",m2:0.04}]},
  // ── Granito ────────────────────────────────────────────────────────────────
  {id:"granperla",  cat:"Granito",fam:"Granito Perla",tp:"losa",
   refs:[{cod:"0164703",l:"Brillado"},{cod:"0164706",l:"Flameado+Cepillado"}]},
  {id:"gransiena",  cat:"Granito",fam:"Granito Siena",tp:"losa",
   refs:[{cod:"0164106",l:"Flameado+Cepillado"}]},
  {id:"granverdi",  cat:"Granito",fam:"Granito Verdi",tp:"losa",
   refs:[{cod:"0164303",l:"Brillado"},{cod:"0164306",l:"Flameado+Cepillado"}]},
  {id:"granbgris",  cat:"Granito",fam:"Granito Gris",tp:"losa",
   refs:[{cod:"0164406",l:"Flameado+Cepillado"}]},
  {id:"granblanco", cat:"Granito",fam:"Granito Blanco",tp:"losa",
   refs:[{cod:"0164503",l:"Brillado"}]},
  // ── Piedra Natural ─────────────────────────────────────────────────────────
  {id:"pncrema",    cat:"Piedra Natural",fam:"Crema Perlada",tp:"losa",
   refs:[{cod:"0142812",l:"Retapado+Pulido"}]},
  {id:"pnfrances",  cat:"Piedra Natural",fam:"Crema Perlada Patrón Francés",tp:"losa",
   refs:[{cod:"0148001",l:"Multiformatos"}]},
  {id:"pnnegro",    cat:"Piedra Natural",fam:"Piedra Negro Absoluto",tp:"losa",
   refs:[{cod:"0136701",l:"Natural"}]},
  {id:"pnmarnego",  cat:"Piedra Natural",fam:"Mármol Negro Absoluto",tp:"losa",
   refs:[{cod:"0136717",l:"Natural"}]},
  {id:"pnmuñeca",   cat:"Piedra Natural",fam:"Piedra Muñeca Crema",tp:"losa",
   refs:[{cod:"0004704",l:"1cm"},{cod:"0004904",l:"2cm"}]},
  {id:"pnroyalv",   cat:"Piedra Natural",fam:"Mármol Royal Veta",tp:"losa",
   refs:[{cod:"0006069",l:"Cepillado"}]},
  {id:"pnvjjade",   cat:"Piedra Natural",fam:"Piedra Verde Jade",tp:"losa",
   refs:[{cod:"0149601",l:"Natural"}]},
  // ── Splitface y Más ────────────────────────────────────────────────────────
  {id:"splmarfil",  cat:"Splitface y Más",fam:"Splitface Marfil",tp:"pieza",
   refs:[{cod:"0158901",l:"7×30cm",m2:0.021},{cod:"0158902",l:"15×30cm",m2:0.045}]},
  {id:"splcafe",    cat:"Splitface y Más",fam:"Splitface Café",tp:"pieza",
   refs:[{cod:"0159001",l:"7×30cm",m2:0.021},{cod:"0159002",l:"15×30cm",m2:0.045}]},
  {id:"splgris",    cat:"Splitface y Más",fam:"Splitface Gris",tp:"pieza",
   refs:[{cod:"0160001",l:"7×30cm",m2:0.021},{cod:"0160002",l:"15×30cm",m2:0.045}]},
  {id:"splcrema",   cat:"Splitface y Más",fam:"Splitface Crema",tp:"pieza",
   refs:[{cod:"0162501",l:"7×30cm",m2:0.021},{cod:"0162502",l:"15×30cm",m2:0.045},{cod:"0162503",l:"30×60cm",m2:0.18}]},
  {id:"spltrav",    cat:"Splitface y Más",fam:"Travertino Splitface",tp:"pieza",
   refs:[{cod:"0130201",l:"10×LL 2.5cm",m2:0.05}]},
  {id:"rockcrema",  cat:"Splitface y Más",fam:"Rockface Crema",tp:"pieza",
   refs:[{cod:"0162301",l:"Irregular",m2:0.04}]},
  {id:"rockblanco", cat:"Splitface y Más",fam:"Rockface Blanco",tp:"pieza",
   refs:[{cod:"0162302",l:"Irregular",m2:0.04}]},
  {id:"espcrema",   cat:"Splitface y Más",fam:"Espacato Crema",tp:"pieza",
   refs:[{cod:"0007003",l:"7×25cm",m2:0.0175},{cod:"0007004",l:"10×25cm",m2:0.025}]},
  {id:"espblanco",  cat:"Splitface y Más",fam:"Espacato Blanco",tp:"pieza",
   refs:[{cod:"0007001",l:"7×25cm",m2:0.0175},{cod:"0007002",l:"10×25cm",m2:0.025}]},
  {id:"thinhuds",   cat:"Splitface y Más",fam:"Thin Brick Hudson White",tp:"pieza",
   refs:[{cod:"0153701",l:"7×19cm",m2:0.0133}]},
  // ── Pizarra ────────────────────────────────────────────────────────────────
  {id:"piznegra",   cat:"Pizarra",fam:"Pizarra Negra Óxido",tp:"pieza",
   refs:[{cod:"0000401",l:"5×15cm",m2:0.0075},{cod:"0000402",l:"10×20cm",m2:0.02},{cod:"0000403",l:"20×20cm",m2:0.04}]},
  {id:"pizverdbos", cat:"Pizarra",fam:"Pizarra Verde Bosque",tp:"pieza",
   refs:[{cod:"0000501",l:"5×15cm",m2:0.0075},{cod:"0000502",l:"10×20cm",m2:0.02}]},
  {id:"pizverdlima",cat:"Pizarra",fam:"Pizarra Verde Lima",tp:"pieza",
   refs:[{cod:"0001901",l:"5×15cm",m2:0.0075},{cod:"0001902",l:"10×20cm",m2:0.02}]},
  {id:"pizroseta",  cat:"Pizarra",fam:"Pizarra Roseta Gris",tp:"pieza",
   refs:[{cod:"0002102",l:"5×15cm",m2:0.0075},{cod:"0002104",l:"10×20cm",m2:0.02},{cod:"0002103",l:"20×20cm",m2:0.04}]},
  {id:"pizprimav",  cat:"Pizarra",fam:"Pizarra Primavera",tp:"pieza",
   refs:[{cod:"0000901",l:"5×15cm",m2:0.0075},{cod:"0000902",l:"10×15cm",m2:0.015}]},
  {id:"pizblanca",  cat:"Pizarra",fam:"Pizarra Blanco Nieve",tp:"pieza",
   refs:[{cod:"0001801",l:"5×15cm",m2:0.0075}]},
  {id:"pizoro",     cat:"Pizarra",fam:"Pizarra Oro Narciso",tp:"pieza",
   refs:[{cod:"0000801",l:"5×15cm",m2:0.0075},{cod:"0000802",l:"10×20cm",m2:0.02}]},
  {id:"piznveta",   cat:"Pizarra",fam:"Pizarra Negra Veta",tp:"pieza",
   refs:[{cod:"0004601",l:"3×JP (50cm)",m2:0.015},{cod:"0004602",l:"5×JP (50cm)",m2:0.025},{cod:"0004603",l:"10×JP (50cm)",m2:0.05}]},
];

const ki = (id: string, ri: number, tipo: TipoMuestra): CarritoItem => ({ familiaId: id, refIdx: ri, tipo });
const MAR10 = ["marcrema","marcveta","mararenado","marmarfil","marcafe","margris","martundgr","maribizagr","marrimp","marempera"];
const TRAV_L = ["travclasico","travturco","travmacad","travivory","travarena","travdurand"];

export const KITS: Record<string, CarritoItem[]> = {
  marmol:    MAR10.map(id => ki(id, 0, "muestra")),
  travertino:TRAV_L.map(id => ki(id, 0, "muestra")),
  arquitecto:[...TRAV_L.map(id => ki(id, 0, "muestra")), ...MAR10.map(id => ki(id, 0, "muestra"))],
  piscinas: [
    ki("marcrema",0,"muestra"),ki("marcveta",0,"muestra"),ki("mararenado",0,"muestra"),
    ki("marcafe",0,"muestra"),ki("margris",0,"muestra"),ki("marafyon",1,"muestra"),
    ki("romcrema",0,"muestra"),ki("romcafe",0,"muestra"),ki("romgris",0,"muestra"),ki("romafyon",0,"muestra"),
  ],
  fachada: CAT
    .filter(f => ["Splitface y Más","Pizarra","Bali / Piedra"].includes(f.cat) ||
      (["pieza","borde"].includes(f.tp) && ["Mármol","Travertino"].includes(f.cat)))
    .map(f => ki(f.id, 0, f.tp === "pieza" ? "pieza" : "muestra")),
  mayorista: CAT
    .filter(f => (f.cat === "Mármol" || f.cat === "Travertino") && f.tp === "losa" && !f.fam.startsWith("Rompeola"))
    .map(f => ki(f.id, 0, "ficha")),
};

export const LS_KEY = "meup_muestras_v1";

export function lsGet(): Solicitud[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
export function lsSet(data: Solicitud[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}
