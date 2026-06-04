import { useState, useEffect, useCallback } from "react";
import { Product } from "@/data/products";
import Papa from "papaparse";

const SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZcZ_HAFNOdIAXh8AvNqeiBM3fjfBLHUPYxz5u_WYPnwi_nKZ8N3lzpAnSLYRb6HNp46DHG0Z48mjZ/pub?gid=1640636152&single=true&output=csv";

const NAV_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZcZ_HAFNOdIAXh8AvNqeiBM3fjfBLHUPYxz5u_WYPnwi_nKZ8N3lzpAnSLYRb6HNp46DHG0Z48mjZ/pub?gid=2028185077&single=true&output=csv";

const toNum = (val: any): number => {
  if (val === null || val === undefined || val === "") return 0;
  const cleaned = String(val)
    .replace(/['"]/g, "")
    .replace(/\.(?=\d{3})/g, "")
    .replace(/,(?=\d{3})/g, "")
    .replace(",", ".");
  return parseFloat(cleaned) || 0;
};

// Parse DD/MM/YYYY -> Date (for ordering ETAs). Falls back to a far-future date.
const parseEtaDate = (s: string): Date => {
  if (!s) return new Date(9999, 0, 1);
  const parts = s.trim().split(/[\/\-]/);
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return new Date(y, m - 1, d);
  }
  const dt = new Date(s);
  return isNaN(dt.getTime()) ? new Date(9999, 0, 1) : dt;
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

        // Parse navegación data to build ETA/estado map per product code.
        // Disp 1 = arrival with the earliest ETA, Disp 2 = the next one.
        const navResult = Papa.parse(navCsv, { skipEmptyLines: true });
        const navRows = (navResult.data as string[][]).slice(4); // skip 4 header rows

        const navByCode: Record<
          string,
          { eta: string; estado: string; qty: number; date: Date }[]
        > = {};

        for (const cols of navRows) {
          const code = String(cols[1] || "").trim();
          if (!code.match(/^\d/)) continue;
          const eta = String(cols[6] || "").trim();
          const estado = String(cols[8] || "").trim().toUpperCase();
          const qty = toNum(cols[5]);
          if (!estado) continue;
          if (!navByCode[code]) navByCode[code] = [];
          navByCode[code].push({ eta, estado, qty, date: parseEtaDate(eta) });
        }

        const navMap: Record<
          string,
          {
            eta1: string | null; est1: string | null;
            eta2: string | null; est2: string | null;
            arrivals1: Array<{ eta: string; est: string; qty: number }>;
            arrivals2: Array<{ eta: string; est: string; qty: number }>;
          }
        > = {};
        for (const code of Object.keys(navByCode)) {
          const sorted = navByCode[code].sort((a, b) => a.date.getTime() - b.date.getTime());
          const DISP1_ESTADOS = ["EN ADUANA", "EN PUERTO"];
          const arrivals1 = sorted
            .filter((s) => DISP1_ESTADOS.includes(s.estado))
            .map((s) => ({ eta: s.eta, est: s.estado, qty: s.qty }));
          const arrivals2 = sorted
            .filter((s) => !DISP1_ESTADOS.includes(s.estado))
            .map((s) => ({ eta: s.eta, est: s.estado, qty: s.qty }));
          // Fallback: if no state matches Disp 1, treat earliest as Disp 1
          if (arrivals1.length === 0 && arrivals2.length > 0) {
            arrivals1.push(arrivals2.shift()!);
          }
          navMap[code] = {
            eta1: arrivals1[0]?.eta || null,
            est1: arrivals1[0]?.est || null,
            eta2: arrivals2[0]?.eta || null,
            est2: arrivals2[0]?.est || null,
            arrivals1,
            arrivals2,
          };
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
              arrivals1: nav?.arrivals1 ?? [],
              arrivals2: nav?.arrivals2 ?? [],
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
