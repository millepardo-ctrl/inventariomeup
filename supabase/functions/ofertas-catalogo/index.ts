import { createServerFn } from "@tanstack/react-start";

const SPREADSHEET_ID = "10lBx3kvJOw_vwi8vWM8E59rxMzMgpSCQXUcSn0UtodM";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

async function gatewayFetch(path: string, init: RequestInit = {}) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!lovableKey) throw new Error("LOVABLE_API_KEY no está configurado.");
  if (!sheetsKey) throw new Error("GOOGLE_SHEETS_API_KEY no está configurado. Conecta Google Sheets.");

  const MAX_ATTEMPTS = 4;
  let lastErr = "";
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      // backoff exponencial con jitter: ~400ms, 800ms, 1600ms
      const wait = 400 * 2 ** (attempt - 1) + Math.random() * 200;
      await new Promise((r) => setTimeout(r, wait));
    }
    let res: Response;
    try {
      res = await fetch(`${GATEWAY_URL}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": sheetsKey,
          "Content-Type": "application/json",
          ...(init.headers ?? {}),
        },
      });
    } catch (e) {
      lastErr = `network error: ${String(e)}`;
      continue; // reintentar fallos de red
    }
    const text = await res.text();
    if (res.ok) {
      try { return text ? JSON.parse(text) : {}; } catch { return {}; }
    }
    lastErr = `Google Sheets gateway ${res.status}: ${text}`;
    // Reintentar solo errores transitorios (429 / 5xx). 4xx restantes fallan ya.
    if (res.status !== 429 && res.status < 500) throw new Error(lastErr);
  }
  throw new Error(lastErr);
}


const GIDS = {
  PARAMS: 1249509917,
  COTIZACIONES: 1117457503,
  TRADUCCIONES: 1586440706,
  DEMO_PRECIOS_CO: 1497618329,
  ALERTAS: 1673178192,
  CONTENIDO: 861771996,
} as const;

let _titlesCache: Map<number, string> | null = null;
async function resolveTitleByGid(gid: number): Promise<string> {
  if (!_titlesCache) {
    const meta = await gatewayFetch(`/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties`);
    _titlesCache = new Map();
    for (const s of meta?.sheets ?? []) {
      const p = s?.properties;
      if (p) _titlesCache.set(p.sheetId, p.title);
    }
  }
  const title = _titlesCache.get(gid);
  if (!title) throw new Error(`No se encontró hoja con gid ${gid} en el spreadsheet.`);
  return title;
}

async function readRowsByGid(gid: number): Promise<string[][]> {
  const title = await resolveTitleByGid(gid);
  const safeTitle = /^[A-Za-z0-9_]+$/.test(title) ? title : `'${title.replace(/'/g, "''")}'`;
  const range = `${safeTitle}!A:Z`;
  const data = await gatewayFetch(`/spreadsheets/${SPREADSHEET_ID}/values/${range}`);
  return (data?.values ?? []) as string[][];
}

const num = (v: unknown) => {
  const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
  return isFinite(n) ? n : 0;
};

// ─── TYPES ───────────────────────────────────────────────────────────────────

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
  fecha: string;  // Col L — YYYY-MM-DD como string
};

export type TraduccionRow = {
  nombre_comercial: string; // UniversalName (clave de join)
  nombre_universal: string; // Nombre MeUp comercial (display)
  alias: string;
};

export type DemoPrecioRow = {
  nombre_comercial: string; // Nombre MeUp
  tipo_producto: string;
  espesor_mm: string;
  acabado: string;
  formato: string;
  fob_usd_m2: number;
  costo_cop_m2: number;
  peso_kg_m2: number;
  origen: string;
  nombre_universal: string; // UniversalName
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function findDataStart(rows: string[][], headerHint: RegExp): number {
  for (let i = 0; i < Math.min(rows.length, 25); i++) {
    const joined = (rows[i] ?? []).join("|").toLowerCase();
    if (headerHint.test(joined)) return i + 1;
  }
  return 1;
}

// Coeficientes del motor (de PARAMS — raramente cambian)
const _CESP_GR: Record<string, number> = {
  "1.2cm": 0.78, "1.8cm": 1.00, "2cm": 1.10,
  "3cm": 1.55, "4cm": 2.00, "5cm": 2.50, "6cm": 3.00, "8cm": 4.00,
};
const _CACAB_GR: Record<string, number> = {
  "Brillante": 1.00, "Pulido": 1.00, "Mate": 0.96, "Apomazado": 0.97,
  "Cepillado": 0.97, "Flameado": 1.05, "Cepillado+Flameado": 1.08,
  "Abujardado": 1.10, "Arenado": 1.04, "Tomboleado": 1.10,
};
const _CFMT_GR: Record<string, number> = {
  "30x30 cm": 1.10, "30x60 cm": 1.05, "40x40 cm": 1.05,
  "40x60 cm": 1.00, "40x80 cm": 1.05, "40xLL": 0.95,
  "60x60 cm": 1.00, "60x120 cm": 1.05,
  "80x80 cm": 1.08, "80x80": 1.08, "80x160 cm": 1.15, "80x160": 1.15,
  "10x20 cm": 1.15, "10x20": 1.15,
  "30x100": 1.05, "30x50": 1.08, "40x50": 1.03, "40x100": 1.05,
  "A medida": 1.10,
};

const _REF_GR = { esp: "1.8cm", acab: "Brillante", fmt: "40x60 cm" };

const _CESP_MA: Record<string, number> = {
  "1.0cm": 0.90, "1.2cm": 1.08, "1.5cm": 1.00, "1.8cm": 1.00,
  "2cm": 1.12, "2.2cm": 1.30, "3cm": 1.75, "4cm": 2.00, "5cm": 2.50, "12cm": 6.00,
};
const _CACAB_MA: Record<string, number> = {
  "Cepillado": 1.00, "Pulido Mate": 1.04, "Arenado": 1.08,
  "Acid": 1.12, "Tomboleado": 1.18, "Brillante": 1.05,
  "Flameado": 1.08, "Cepillado+Flameado": 1.10,
};
const _CFMT_MA: Record<string, number> = {
  "30x30 cm": 1.10, "30x60 cm": 1.05, "40x40 cm": 1.05,
  "40x60 cm": 1.00, "40x80 cm": 1.05, "40xLL": 1.00,
  "60x60 cm": 1.00, "60x120 cm": 1.05, "A medida": 1.10,
  "30xLL": 1.00, "40.6xLL": 1.00, "40.6x61": 1.05,
  "30.5x61": 1.05, "61x122": 1.25,
  "30x100": 1.05, "30x50": 1.08, "40x50": 1.03, "40x100": 1.05,
  "80x80 cm": 1.08, "80x80": 1.08, "80x160 cm": 1.15, "80x160": 1.15,
};
const _REF_MA = { esp: "1.5cm", acab: "Cepillado", fmt: "40xLL" };

const _CFMT_TR: Record<string, number> = {
  ..._CFMT_MA,
  "15x30": 1.10, "20x80": 1.10, "7x25": 1.15,
  "5x20": 1.20, "10x10": 1.20, "30.5x100": 1.05,
};
const _REF_TR = { esp: "1.2cm", acab: "Tomboleado", fmt: "40.6x61" };

function _coefs(tipoMat: string) {
  if (/granito/i.test(tipoMat)) {
    return { esp: _CESP_GR, acab: _CACAB_GR, fmt: _CFMT_GR, ref: _REF_GR };
  } else if (/travertino|especial/i.test(tipoMat)) {
    return { esp: _CESP_MA, acab: _CACAB_MA, fmt: _CFMT_TR, ref: _REF_TR };
  } else {
    return { esp: _CESP_MA, acab: _CACAB_MA, fmt: _CFMT_MA, ref: _REF_MA };
  }
}
const _M2C: Record<string, number> = {
  "1.0cm": 700, "1.2cm": 700, "1.5cm": 540, "1.8cm": 540,
  "2cm": 488, "2.2cm": 330, "3cm": 330, "4cm": 250, "5cm": 200, "6cm": 161, "8cm": 121, "12cm": 200,
};
const _DENS: Record<string, number> = {
  "Granito": 2750, "Mármol": 2700, "Travertino": 2400, "Especial": 2700,
};

// ─── SHEET READERS ───────────────────────────────────────────────────────────

async function _params(): Promise<Record<string, string>> {
  const rows = await readRowsByGid(GIDS.PARAMS);
  const out: Record<string, string> = {};
  for (const row of rows) {
    // Sección A+B+C: cols B-C (idx 1-2) — parámetros globales + tipos oferta
    const k = String(row?.[1] ?? "").trim();
    const v = String(row?.[2] ?? "").trim();
    if (k && v && !/parámetro|conversión|fiscalidad|concepto/i.test(k)) out[k] = v;
    // Tipos oferta: guardar min/max (cols D-E, idx 3-4)
    if (/mejor|primera|presupuest|oferta/i.test(k) && num(v) > 0) {
      out[k] = v;  // guarda el margen con la clave exacta del Sheet
      const mn = String(row?.[3] ?? "").trim();
      const mx = String(row?.[4] ?? "").trim();
      if (mn) out[`${k}_min`] = mn;
      if (mx) out[`${k}_max`] = mx;
      // También guardar sin tilde como fallback
      const kNorm = k.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      out[kNorm] = v;
    }

    // Sección F: Fletes (col F=idx5=Origen, G=idx6=Flete, H=idx7=Naviera)
    const orig = String(row?.[5] ?? "").trim();
    const flt  = String(row?.[6] ?? "").trim();
    const nav  = String(row?.[7] ?? "").trim();
    if (orig && flt && num(flt) > 0) {
      out[`flete_${orig}`]   = flt;
      out[`naviera_${orig}`] = nav;
    }
  }
  // Leer tipos de oferta explícitamente (sección C, filas con Margen/Mín/Máx)
  const tiposOfertaNames = ["Mejor oferta", "Primera versión", "Oferta de presupuesto"];
  const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  for (const row of rows) {
    const k = String(row?.[1] ?? "").trim();
    const v = String(row?.[2] ?? "").trim();
    const mn = String(row?.[3] ?? "").trim();
    const mx = String(row?.[4] ?? "").trim();
    if (tiposOfertaNames.some(t => normalize(t) === normalize(k))) {
      out[k] = v;
      if (mn) out[`${k}_min`] = mn;
      if (mx) out[`${k}_max`] = mx;
    }
  }
  return out;
}

async function _cotizaciones(): Promise<CotizacionRow[]> {
  const rows = await readRowsByGid(GIDS.COTIZACIONES);
  // COTIZACIONES tiene col A vacía → datos empiezan en idx 1
  const start = findDataStart(rows, /producto.*tipo|tipo\s*\n?\s*producto/);
  return rows.slice(start).flatMap<CotizacionRow>((r) => {
    const nombre = String(r?.[1] ?? "").trim(); // Col B (idx 1) = UniversalName
    if (!nombre) return [];
    const fob = num(r?.[9]); // Col J (idx 9) = Precio FOB USD/m²
    if (fob <= 0) return [];
    const vigencia = String(r?.[14] ?? "").trim(); // Col O (idx 14) = Vigencia
    const fob_estado: "vigente" | "extrapolado" = /vigente/i.test(vigencia) ? "vigente" : "extrapolado";
    return [{
      nombre_comercial: nombre,
      tipo_producto:    String(r?.[2] ?? "").trim(),
      origen:           String(r?.[4] ?? "").trim(),
      espesor_mm:       String(r?.[6] ?? "").trim(),
      acabado:          String(r?.[7] ?? "").trim(),
      formato:          String(r?.[8] ?? "").trim(),
      fob_usd_m2:       fob,
      fob_estado,
      peso_kg_m2:       0,
      fecha:            String(r?.[11] ?? "").trim(),  // Col L (idx 11) = Fecha Recibido
    }];
  });
}

async function _traducciones(): Promise<TraduccionRow[]> {
  const rows = await readRowsByGid(GIDS.TRADUCCIONES);
  // TRADUCCIONES tiene col A vacía → datos empiezan en idx 1
  // Buscar la sección B (productos), no la A (acabados)
  const start = findDataStart(rows, /nombre.*universal/);
  return rows.slice(start).flatMap<TraduccionRow>((r) => {
    const universalName = String(r?.[1] ?? "").trim(); // Col B (idx 1) = Nombre Universal
    const meupName      = String(r?.[2] ?? "").trim(); // Col C (idx 2) = Nombre MeUp Comercial
    if (!universalName && !meupName) return [];
    return [{
      nombre_comercial: universalName, // clave de join
      nombre_universal: meupName,      // display en UI
      alias:            universalName,
    }];
  });
}

async function _demoPrecios(): Promise<DemoPrecioRow[]> {
  const rows = await readRowsByGid(GIDS.DEMO_PRECIOS_CO);
  // DEMO_PRECIOS_CO NO tiene col A vacía → datos empiezan en idx 0
  const start = findDataStart(rows, /nombre meup|comercial colombia|nombre.*meup/);
  return rows.slice(start).flatMap<DemoPrecioRow>((r) => {
    const nombre = String(r?.[0] ?? "").trim(); // Col A (idx 0) = Nombre MeUp
    if (!nombre || nombre.length > 60) return [];
    return [{
      nombre_comercial: nombre,                              // Nombre MeUp
      nombre_universal: String(r?.[22] ?? r?.[1] ?? "").trim(), // Col W (idx 22) = UniversalName
      tipo_producto:    String(r?.[17] ?? "").trim(),        // Col R (idx 17) = Tipo Material
      espesor_mm:       String(r?.[2]  ?? "").trim(),        // Col C (idx 2)  = Espesor
      acabado:          String(r?.[3]  ?? "").trim(),        // Col D (idx 3)  = Acabado
      formato:          String(r?.[4]  ?? "").trim(),        // Col E (idx 4)  = Formato
      fob_usd_m2:       num(r?.[7]),                         // Col H (idx 7)  = Costo FOB USD
      costo_cop_m2:     num(r?.[8]),                         // Col I (idx 8)  = Costo COP
      peso_kg_m2:       num(r?.[18]),                        // Col S (idx 18) = Peso kg/m²
      origen:           String(r?.[13] ?? "").trim(),        // Col N (idx 13) = Origen
      advertencia:      String(r?.[21] ?? "").trim(),        // Col V (idx 21) = Advertencia
    }];
  });
}

async function _alertas(): Promise<AlertaRow[]> {
  const rows = await readRowsByGid(GIDS.ALERTAS);
  const start = findDataStart(rows, /métrica|cantidad|acción/);
  return rows.slice(start).flatMap<AlertaRow>((r) => {
    const cond = String(r?.[1] ?? "").trim();
    const msg  = String(r?.[3] ?? "").trim();
    if (!cond && !msg) return [];
    return [{ condicion: cond, mensaje: msg }];
  });
}

async function _contenido(): Promise<ContenidoRow[]> {
  const rows = await readRowsByGid(GIDS.CONTENIDO);
  return rows.flatMap<ContenidoRow>((r) => {
    const nombre = String(r?.[0] ?? "").trim();
    if (!nombre || /nombre\s*meup/i.test(nombre)) return [];
    return [{
      nombre_meup:   nombre,
      descripcion_1: String(r?.[1] ?? "").trim(),
      descripcion_2: String(r?.[2] ?? "").trim(),
      descripcion_3: String(r?.[3] ?? "").trim(),
      clasificacion: String(r?.[4] ?? "").trim(),
      compresion:    String(r?.[5] ?? "").trim(),
      flexion:       String(r?.[6] ?? "").trim(),
      absorcion:     String(r?.[7] ?? "").trim(),
      densidad:      String(r?.[8] ?? "").trim(),
      sellado:       String(r?.[9] ?? "").trim(),
      usos:          String(r?.[10] ?? "").trim(),
      adhesivo:      String(r?.[11] ?? "").trim(),
    }];
  });
}



// ─── MOTOR DE PRECIOS (habilidad meup-motor-precios) ─────────────────────────

export const calcularPrecioCOP = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => i as {
    nombreMeUp: string; espesor: string; acabado: string;
    formato: string; tipoOferta: string; anchoM?: number;
  })
  .handler(async ({ data }): Promise<PrecioResult> => {
    const ERR = (msg: string): PrecioResult => ({
      fobUSD: 0, fobEstado: "extrapolado", costoCOP: 0, pvpSinIVA: 0, pvpConIVA: 0,
      margenAplicado: 0, margenEfectivo: 0, origen: "", fleteUSD: 0, navieraUSD: 0,
      pesoKgM2: 0, universalName: "", tipoMaterial: "", precioML: 0, advertencia: msg,
    });

    const { params, cotizaciones: cots, traducciones: trads } = await _getMotorData();

    // 1. Traducir NombreMeUp → UniversalName
    const trad = trads.find(t => t.nombre_universal === data.nombreMeUp);
    if (!trad) return ERR(`⚠ "${data.nombreMeUp}" no encontrado en TRADUCCIONES`);
    const universalName = trad.nombre_comercial;

    // 2. Obtener filas del producto en COTIZACIONES
    const prodRows = cots.filter(c => c.nombre_comercial === universalName);
    if (!prodRows.length) return ERR(`⚠ Sin cotización para "${universalName}"`);


    const cotBase    = prodRows[0];
    const origen     = cotBase.origen;
    const tipoMat    = cotBase.tipo_producto.split(" ")[0] || "Mármol";

    // 3. FOB: combinación exacta o extrapolado con coeficientes
    // Normalizar para tolerar variantes del Sheet ("60x120" vs "60x120 cm", mayúsculas, tildes)
    const norm = (s: string) =>
      String(s ?? "")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s*cm\s*$/, "")
        .replace(/\s+/g, "")
        .trim();
    const exact = prodRows.find(c =>
      norm(c.espesor_mm) === norm(data.espesor) && norm(c.acabado) === norm(data.acabado) &&
      norm(c.formato) === norm(data.formato) && c.fob_usd_m2 > 0
    );
    let fobUSD: number;
    let fobEstado: "vigente" | "extrapolado";
    if (exact) {
      fobUSD    = exact.fob_usd_m2;
      fobEstado = "vigente";   // encontró precio exacto en lista
    } else {
    // Base: fecha más reciente → FOB más bajo (igual que fórmula Sheet)
      const conFob = prodRows.filter(c => c.fob_usd_m2 > 0 && c.fecha !== "");
      if (!conFob.length) return ERR(`⚠ Sin precio FOB para "${universalName}"`);

      // Fecha más reciente (YYYY-MM-DD ordena bien como string)
      const fechaMax = conFob.reduce((max, c) => c.fecha > max ? c.fecha : max, conFob[0].fecha);

      // Entre las de fecha máxima, FOB más bajo
      const recientes = conFob.filter(c => c.fecha === fechaMax);
      const fobMin    = Math.min(...recientes.map(c => c.fob_usd_m2));
      const base      = recientes.find(c => c.fob_usd_m2 === fobMin)!;

      const { esp: CESP, acab: CACAB, fmt: CFMT, ref: REF } = _coefs(tipoMat);
      fobUSD =
        base.fob_usd_m2
        * ((CESP[data.espesor]   ?? 1) / (CESP[base.espesor_mm]  ?? CESP[REF.esp] ?? 1))
        * ((CACAB[data.acabado]  ?? 1) / (CACAB[base.acabado]    ?? CACAB[REF.acab] ?? 1))
        * ((CFMT[data.formato]   ?? 1) / (CFMT[base.formato]     ?? CFMT[REF.fmt] ?? 1));
      fobEstado = "extrapolado";
    }



    // 4. Costos de transporte desde PARAMS
    const fleteUSD   = num(params[`flete_${origen}`]);
    const navieraUSD = num(params[`naviera_${origen}`]);
    const trm        = num(params["TRM"]) || 3800;
    const nac        = num(params["Aduana"]) + num(params["Portuario"]) +
                       num(params["Transporte local"]) + num(params["ITR"]);
    const m2c        = _M2C[data.espesor] ?? 488;

    if (!fleteUSD) return ERR(`⚠ Sin flete para "${origen}" en PARAMS`);

    // 5. Fórmula CostoCOP
    const costoCOP = ((fleteUSD + navieraUSD) / m2c) * trm + nac / m2c + fobUSD * trm;

    // 6. PVP con CEILING: ceil((costo/(1-margen) - 900) / 1000) * 1000 + 900
    const _tipoNorm = data.tipoOferta.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const margenAplicado =
      _tipoNorm.includes("presupuesto") ? 0.55 :
      _tipoNorm.includes("version") || _tipoNorm.includes("versión") ? 0.45 :
      _tipoNorm.includes("mejor") ? 0.35 : 0.40;
    const iva            = (num(params["IVA Colombia"]) || 19) / 100;
    const pvpSinIVA      = Math.ceil((costoCOP / (1 - margenAplicado) - 900) / 1000) * 1000 + 900;
    const pvpConIVA      = Math.round(pvpSinIVA * (1 + iva));
    const margenEfectivo = 1 - costoCOP / pvpSinIVA;

    // 7. Peso kg/m²
    const densidad = _DENS[tipoMat] ?? 2700;
    const espCm    = num(data.espesor);
    const pesoKgM2 = Math.round(densidad * (espCm / 100) * 10) / 10;

    // 8. Precio por ml (bordes / copings)
    const precioML = data.anchoM ? Math.round(pvpSinIVA * data.anchoM) : 0;

    return {
      fobUSD:          Math.round(fobUSD * 100) / 100,
      fobEstado,
      costoCOP:        Math.round(costoCOP),
      pvpSinIVA,
      pvpConIVA,
      margenAplicado,
      margenEfectivo:  Math.round(margenEfectivo * 1000) / 1000,
      origen,
      fleteUSD,
      navieraUSD,
      pesoKgM2,
      universalName,
      tipoMaterial:    tipoMat,
      precioML,
      advertencia:     "",
    };
  });

// ─── EXPORTS ─────────────────────────────────────────────────────────────────

export const leerParams       = createServerFn({ method: "GET" }).handler(_params);
export const leerCotizaciones = createServerFn({ method: "GET" }).handler(_cotizaciones);
export const leerTraducciones = createServerFn({ method: "GET" }).handler(_traducciones);
export const leerDemoPreciosCO = createServerFn({ method: "GET" }).handler(_demoPrecios);
export const leerAlertas      = createServerFn({ method: "GET" }).handler(_alertas);
export const leerContenido    = createServerFn({ method: "GET" }).handler(_contenido);

export type MotorData = {
  params:       Record<string, string>;
  cotizaciones: CotizacionRow[];
  traducciones: TraduccionRow[];
  demo_precios: DemoPrecioRow[];
  alertas:      AlertaRow[];
  contenido:    ContenidoRow[];
};

export type Catalogo = MotorData;

// Caché en memoria del servidor — evita rate limiting de Google Sheets
let _motorCache: MotorData | null = null;
let _motorCacheTime = 0;
let _motorInflight: Promise<MotorData> | null = null;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutos — refleja rápido cambios del Sheet

async function _getMotorData(): Promise<MotorData> {
  const now = Date.now();
  if (_motorCache && now - _motorCacheTime < CACHE_TTL_MS) return _motorCache;
  // De-duplicar peticiones concurrentes: una sola lectura de Sheets a la vez
  if (_motorInflight) return _motorInflight;

  _motorInflight = (async () => {
    // Lecturas secuenciales: 5 llamadas en paralelo disparan la cuota por minuto
    const params = await _params();
    const cotizaciones = await _cotizaciones();
    const traducciones = await _traducciones();
    const demo_precios = await _demoPrecios();
    const alertas = await _alertas();
    const contenido = await _contenido();
    const data: MotorData = { params, cotizaciones, traducciones, demo_precios, alertas, contenido };
    _motorCache = data;
    _motorCacheTime = Date.now();
    return data;
  })();

  try {
    return await _motorInflight;
  } catch (e) {
    // Si falla (p.ej. 429), servir la última copia buena en vez de romper la UI
    if (_motorCache) return _motorCache;
    throw e;
  } finally {
    _motorInflight = null;
  }
}


export const leerMotorData = createServerFn({ method: "GET" }).handler(
  async (): Promise<MotorData> => _getMotorData()
);

// Fuerza relectura de Google Sheets (invalida el caché en memoria)
export const refrescarMotorData = createServerFn({ method: "POST" }).handler(
  async (): Promise<MotorData> => {
    _motorCache = null;
    _motorCacheTime = 0;
    _asesoresCache = null;
    _asesoresCacheTime = 0;
    return _getMotorData();
  }
);

// ─── ASESORES ────────────────────────────────────────────────────────────────

export type AsesorRow = {
  asesor_nombre: string;
  asesor_cargo: string;
  asesor_cel: string;
  asesor_email: string;
};

let _asesoresCache: AsesorRow[] | null = null;
let _asesoresCacheTime = 0;
let _asesoresInflight: Promise<AsesorRow[]> | null = null;

async function _asesores(): Promise<AsesorRow[]> {
  const now = Date.now();
  if (_asesoresCache && now - _asesoresCacheTime < CACHE_TTL_MS) return _asesoresCache;
  if (_asesoresInflight) return _asesoresInflight;

  _asesoresInflight = (async () => {
    const data = await gatewayFetch(`/spreadsheets/${SPREADSHEET_ID}/values/ASESORES!A:E`);
    const rows = (data?.values ?? []) as string[][];
    const out = rows.flatMap<AsesorRow>((r) => {
      const nombre = String(r?.[0] ?? "").trim();
      const activo = String(r?.[4] ?? "").trim().toUpperCase();
      if (!nombre) return [];
      if (/nombre/i.test(nombre)) return []; // encabezado
      if (activo !== "SI" && activo !== "SÍ") return [];
      return [{
        asesor_nombre: nombre,
        asesor_cargo: String(r?.[1] ?? "").trim(),
        asesor_cel:   String(r?.[2] ?? "").trim(),
        asesor_email: String(r?.[3] ?? "").trim(),
      }];
    });
    _asesoresCache = out;
    _asesoresCacheTime = Date.now();
    return out;
  })();

  try {
    return await _asesoresInflight;
  } catch (e) {
    if (_asesoresCache) return _asesoresCache;
    throw e;
  } finally {
    _asesoresInflight = null;
  }
}

export const leerAsesores = createServerFn({ method: "GET" }).handler(_asesores);

