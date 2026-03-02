import { useState, useEffect, useCallback } from "react";
import { Product } from "@/data/products";

const SHEET_CSV =
  "https://corsproxy.io/?https://docs.google.com/spreadsheets/d/12SHVhcpfyOrCJjUaafNehAyhlo0hGdXv0458Xs9LSOI/export?format=csv&gid=846528846";

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
        const rows = csv.split("\n").slice(4);
        const parsed = rows
          .map((row) => {
            const cols = row.split(",");
            const code = cols[0]?.replace(/"/g, "").trim();
            if (!code || !code.match(/^\d/)) return null;
            return {
              c: code,
              n: cols[1]?.replace(/"/g, "").trim() ?? "",
              u: cols[2]?.replace(/"/g, "").trim() ?? "",
              cat: cols[3]?.replace(/"/g, "").trim() ?? "",
              stock_cuc: parseFloat(cols[6]) || 0,
              stock_baq: parseFloat(cols[7]) || 0,
              res: parseFloat(cols[8]) || 0,
              pre_res: parseFloat(cols[9]) || 0,
              disp_cuc: parseFloat(cols[10]) || 0,
              disp_baq: parseFloat(cols[11]) || 0,
              d1: parseFloat(cols[13]) || 0,
              d2: parseFloat(cols[14]) || 0,
              eta1: null,
              eta2: null,
              est1: null,
              est2: null,
            } as Product;
          })
          .filter((p): p is Product => p !== null && !!p.n);
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
