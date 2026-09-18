import { corsHeaders, getGoogleAccessToken, jsonResponse } from "../_shared/google.ts";

const ROOT_FOLDER_ID = "1FAo4N0ixRrG9-EETHsD27A_YrGjCWd3B";
const SCOPE = "https://www.googleapis.com/auth/drive.readonly";

async function driveFetch(path: string): Promise<Record<string, any> | null> {
  try {
    const token = await getGoogleAccessToken(SCOPE);
    const res = await fetch(`https://www.googleapis.com/drive/v3${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error(`Drive ${res.status}: ${(await res.text()).slice(0, 400)}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("Drive error:", String(e));
    return null;
  }
}

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

async function fotosDeProducto(nombre: string): Promise<string[]> {
  const clean = nombre.trim();
  if (!clean) return [];
  const q =
    `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'` +
    ` and name='${esc(clean)}' and trashed=false`;
  const folders = await driveFetch(
    `/files?q=${encodeURIComponent(q)}&fields=files(id,name)&pageSize=5`,
  );
  const folderId = folders?.files?.[0]?.id;
  if (!folderId) return [];

  const q2 = `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`;
  const files = await driveFetch(
    `/files?q=${encodeURIComponent(q2)}&fields=files(id,name,mimeType,fileExtension)&orderBy=name&pageSize=50`,
  );
  const list: Array<{ id: string; name: string; mimeType?: string; fileExtension?: string }> =
    files?.files ?? [];
  return list
    .filter(
      (f) =>
        !!f.id &&
        ((f.mimeType ?? "").startsWith("image/") ||
          ["jpg", "jpeg", "png"].includes((f.fileExtension ?? "").toLowerCase())),
    )
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", undefined, { numeric: true }))
    .slice(0, 3)
    .map((f) => `https://drive.google.com/uc?id=${f.id}`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const nombres: string[] = Array.isArray(body?.data) ? body.data : [];
    const out: Record<string, string[]> = {};
    const unicos = Array.from(
      new Set(nombres.map((n) => String(n ?? "").trim()).filter(Boolean)),
    );
    for (const nombre of unicos) out[nombre] = await fotosDeProducto(nombre);
    return jsonResponse(out);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("ofertas-fotos error:", msg);
    return jsonResponse({}, 200);
  }
});
