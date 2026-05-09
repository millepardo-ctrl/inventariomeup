import { useState, useEffect, useCallback } from "react";
import { Product } from "@/data/products";
import Papa from "papaparse";

const SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZcZ_HAFNOdIAXh8AvNqeiBM3fjfBLHUPYxz5u_WYPnwi_nKZ8N3lzpAnSLYRb6HNp46DHG0Z48mjZ/pub?gid=1640636152&single=true&output=csv";

const NAV_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZcZ_HAFNOdIAXh8AvNqeiBM3fjfBLHUPYxz5u_WYPnwi_nKZ8N3lzpAnSLYRb6HNp46DHG0Z48mjZ/pub?gid=2028185077&single=true&output=csv";

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
        // === DIAGNÓSTICO CSV INVENTARIO ===
        const csv = inventoryCsv;
        console.log("=== DIAGNÓSTICO CSV INVENTARIO ===");
        const lines = csv.split("\n");
        console.log("Total líneas:", lines.length);
        console.log("Línea 0 (fila 1):", lines[0]?.substring(0, 80));
        console.log("Línea 3 (fila 4 = headers):", lines[3]?.substring(0, 200));
        console.log("Línea 4 (fila 5):", lines[4]?.substring(0, 100));
        console.log("Línea 5 (fila 6 = 1er producto):", lines[5]?.substring(0, 200));
        const cols_test = lines[5]?.split(",");
        if (cols_test) {
          console.log("cols[0] código:", cols_test[0]);
          console.log("cols[7] stock BAQ:", cols_test[7]);
          console.log("cols[12] total disp:", cols_test[12]);
          console.log("cols[13] disp1:", cols_test[13]);
          console.log("cols[14] disp2:", cols_test[14]);
          console.log("cols[15] total nav:", cols_test[15]);
          console.log("cols[20] alerta:", cols_test[20]);
        }

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
