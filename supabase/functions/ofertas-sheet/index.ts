import {
  corsHeaders,
  getGoogleAccessToken,
  jsonResponse,
  serviceAccountEmail,
} from "../_shared/google.ts";

const SPREADSHEET_ID = "10lBx3kvJOw_vwi8vWM8E59rxMzMgpSCQXUcSn0UtodM";
const SHEET_GID = 1249509917;
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

async function sheetsFetch(path: string, init: RequestInit = {}) {
  const token = await getGoogleAccessToken(SCOPE);
  const res = await fetch(`https://sheets.googleapis.com/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `Google Sheets ${res.status} (comparte la hoja como Editor con ${serviceAccountEmail()}): ${text}`,
    );
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

async function resolveSheetTitle(): Promise<string> {
  const meta = await sheetsFetch(`/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties`);
  const sheet = (meta?.sheets ?? []).find(
    (s: { properties?: { sheetId?: number } }) => s?.properties?.sheetId === SHEET_GID,
  );
  if (!sheet) throw new Error(`No se encontró la hoja con gid ${SHEET_GID}.`);
  return sheet.properties.title as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const data = body?.data ?? body;
    const items: Record<string, unknown>[] = Array.isArray(data?.items) ? data.items : [];
    if (!items.length) return jsonResponse({ error: "La oferta no tiene ítems." }, 400);

    const n = (v: unknown) => Number(v ?? 0) || 0;
    const s = (v: unknown) => String(v ?? "");
    const totalOferta = n(data?.totales?.totalGeneral);

    const rows = items.map((it) => [
      s(data?.id_oferta),
      s(data?.fecha),
      s(data?.cliente),
      s(data?.asesor),
      s(it.tipo_producto),
      s(it.nombre_comercial),
      s(it.espesor_mm),
      s(it.acabado),
      s(it.formato),
      n(it.cantidad_m2),
      n(it.pvp_sin_iva_margen),
      n(it.pvp_con_iva_margen),
      n(it.valor_tonelada),
      n(it.transporte_m2),
      n(it.transporte_m2_iva),
      s(it.transporte_incluido),
      n(it.total_item),
      totalOferta,
    ]);

    const range = `${await resolveSheetTitle()}!A1`;
    await sheetsFetch(
      `/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      { method: "POST", body: JSON.stringify({ values: rows }) },
    );

    return jsonResponse({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("ofertas-sheet error:", msg);
    return jsonResponse({ error: msg }, 500);
  }
});
