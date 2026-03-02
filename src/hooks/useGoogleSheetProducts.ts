import { useState, useEffect, useCallback, useRef } from "react";
import Papa from "papaparse";
import { Product } from "@/data/products";

const SHEET_CSV =
  "https://corsproxy.io/?https://docs.google.com/spreadsheets/d/12SHVhcpfyOrCJjUaafNehAyhlo0hGdXv0458Xs9LSOI/export?format=csv&gid=846528846";

function parseCsv(csv: string): Product[] {
  const rows = csv.split("\n");
  const dataRows = rows.slice(4);
  return dataRows
    .map((row) => {
      const cols = Papa.parse(row).data[0] as string[] | undefined;
      if (!cols) return null;
      const code = cols[0]?.trim();
      if (!code || !code.match(/^\d/)) return null;
      return {
        c: code,
        n: cols[1]?.trim() ?? "",
        u: cols[2]?.trim() ?? "",
        cat: cols[3]?.trim() ?? "",
        stock_cuc: parseFloat(cols[6]) || 0,
        stock_baq: parseFloat(cols[7]) || 0,
        res: parseFloat(cols[8]) || 0,
        pre_res: parseFloat(cols[9]) || 0,
        disp_cuc: parseFloat(cols[10]) || 0,
        disp_baq: parseFloat(cols[11]) || 0,
        d1: parseFloat(cols[13]) || 0,
        d2: parseFloat(cols[14]) || 0,
        eta1: cols[15]?.trim() || null,
        eta2: cols[16]?.trim() || null,
        est1: cols[17]?.trim() || null,
        est2: cols[18]?.trim() || null,
      } as Product;
    })
    .filter((p): p is Product => p !== null && !!p.n);
}

export function useGoogleSheetProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const initialLoad = useRef(true);

  const fetchProducts = useCallback(async (isManual = false) => {
    if (isManual || !initialLoad.current) {
      setRefreshing(true);
    }
    try {
      const r = await fetch(SHEET_CSV);
      const csv = await r.text();
      const parsed = parseCsv(csv);
      setProducts(parsed);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      if (initialLoad.current) {
        setError("No se pudo cargar el inventario");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      initialLoad.current = false;
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => fetchProducts(), 600_000); // 10 min
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const refresh = useCallback(() => fetchProducts(true), [fetchProducts]);

  return { products, loading, refreshing, error, lastUpdated, refresh };
}
