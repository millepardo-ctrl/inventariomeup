import { useState, useEffect, useCallback } from "react";
import { Product } from "@/data/products";
import Papa from "papaparse";

const SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0G2hjB-gsAREX7D1oHD6MyeE9nNTTQyDmKkILivohh6HALF1JIAbKrrWcePNmL3tqKqTO9Cfb8gWd/pub?gid=1006196470&single=true&output=csv";

const NAV_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7-yVomOaDuA9DyIWmpOZm_2X1HQ7PjoQ6yFklXrNlmQDzdyMVsB1FlH-dMF-jfg/pub?gid=1955739514&single=true&output=csv";

// Estados that map to Disp 1 (próximo a llegar)
const DISP1_ESTADOS = new Set(["EN ADUANA", "EN PUERTO"]);

const toNum = (val: any): number => {
  if (val === null || val === undefined || val === "") return 0;
  const cleaned = String(val)
    .replace(/['"]/g, "")
    .replace(/\.(?=\d{3})/g, "")
    .replace(/,(?=\d{3})/g, "")
    .replace(",", ".");
  return parseFloat(cleaned) || 0;
};

export function useGoogleSheetProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback((isManual = false) => {
    if (isManual) setRefreshing(true);

    Promise.all([fetch(SHEET_CSV).then((r) => r.text()), fetch(NAV_CSV).then((r) => r.text())])
      .then(([inventoryCsv, navCsv]) => {
        // Parse navegación data to build ETA/estado map per product code
        const navResult = Papa.parse(navCsv, { skipEmptyLines: true });
        const navRows = (navResult.data as string[][]).slice(2); // skip header rows

        // Group nav entries by code: { code -> { d1: {eta, estado}, d2: {eta, estado} } }
        const navMap: Record<
          string,
          { eta1: string | null; est1: string | null; eta2: string | null; est2: string | null }
        > = {};

        for (const cols of navRows) {
          const code = String(cols[1] || "").trim();
          if (!code.match(/^\d/)) continue;
          const eta = String(cols[6] || "").trim() || null;
          const estado =
            String(cols[8] || "")
              .trim()
              .toUpperCase() || null;
          if (!estado) continue;

          if (!navMap[code]) {
            navMap[code] = { eta1: null, est1: null, eta2: null, est2: null };
          }

          const isDisp1 = DISP1_ESTADOS.has(estado);
          if (isDisp1) {
            navMap[code].eta1 = eta;
            navMap[code].est1 = estado;
          } else {
            navMap[code].eta2 = eta;
            navMap[code].est2 = estado;
          }
        }

        // Parse inventory
        const result = Papa.parse(inventoryCsv, { skipEmptyLines: true });
        const rows = (result.data as string[][]).slice(4);
        const parsed = rows
          .map((cols) => {
            const code = String(cols[0] || "").trim();
            if (!code.match(/^\d/)) return null;
            const nav = navMap[code];
            return {
              c: code,
              n: String(cols[1] || "").trim(),
              u: String(cols[2] || "").trim(),
              cat: String(cols[3] || "").trim(),
              stock_cuc: toNum(cols[6]),
              stock_baq: toNum(cols[7]),
              res: toNum(cols[8]),
              pre_res: toNum(cols[9]),
              disp_cuc: toNum(cols[10]),
              disp_baq: toNum(cols[11]),
              total_disp: toNum(cols[12]),
              d1: toNum(cols[13]),
              d2: toNum(cols[14]),
              consumo: toNum(cols[16]),
              stk_min: toNum(cols[17]),
              alerta: String(cols[20] || "").trim() || null,
              eta1: nav?.eta1 ?? null,
              eta2: nav?.eta2 ?? null,
              est1: nav?.est1 ?? null,
              est2: nav?.est2 ?? null,
            } as Product;
          })
          .filter((p): p is Product => p !== null && !!p.n && !!p.cat);
        setProducts(parsed);
        setLastUpdated(new Date());
        setLoading(false);
        setRefreshing(false);
        setError(null);
      })
      .catch(() => {
        setError("No se pudo cargar el inventario");
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 600_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const refresh = useCallback(() => fetchData(true), [fetchData]);

  return { products, loading, refreshing, error, lastUpdated, refresh };
}
