import { useState, useEffect, useCallback } from "react";
import { Product } from "@/data/products";
import Papa from "papaparse";

const SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/12SHVhcpfyOrCJjUaafNehAyhlo0hGdXv0458Xs9LSOI/export?format=csv&gid=846528846";

const NAV_CSV =
  "https://docs.google.com/spreadsheets/d/12SHVhcpfyOrCJjUaafNehAyhlo0hGdXv0458Xs9LSOI/export?format=csv&gid=26483109";

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

    fetch(SHEET_CSV)
      .then((r) => r.text())
      .then((csv) => {
        const result = Papa.parse(csv, { skipEmptyLines: true });
        const rows = (result.data as string[][]).slice(4);
        const parsed = rows
          .map((cols) => {
            const code = String(cols[0] || "").trim();
            if (!code.match(/^\d/)) return null;
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
              d1: toNum(cols[13]),
              d2: toNum(cols[14]),
              eta1: null,
              eta2: null,
              est1: null,
              est2: null,
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
