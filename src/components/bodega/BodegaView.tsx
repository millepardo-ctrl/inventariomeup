import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { writeCell } from "@/lib/googleSheets";
import { toast } from "sonner";
import PedidosView from "./PedidosView";

const NAV_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZcZ_HAFNOdIAXh8AvNqeiBM3fjfBLHUPYxz5u_WYPnwi_nKZ8N3lzpAnSLYRb6HNp46DHG0Z48mjZ/pub?gid=2028185077&single=true&output=csv";
const NAV_SHEET_ID = 2028185077;

interface Row {
  rowNumber: number; // 1-based sheet row
  invoice: string;
  code: string;
  name: string;
  proveedor: string;
  qty: string;
  eta: string;
  bodega: string;
  estado: string;
  conteo: string;
  diferencia: string;
  verificacion: string;
  etaNum: number;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else { field += ch; }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { cur.push(field); field = ""; }
      else if (ch === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; }
      else if (ch === "\r") { /* skip */ }
      else field += ch;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  return rows;
}

const invoiceColors: Record<string, { bg: string; border: string; text: string }> = {
  'INV-1035':  { bg: '#EFF6FF', border: '#3B82F6', text: '#1D4ED8' },
  'INV-1043':  { bg: '#F0FDF4', border: '#10B981', text: '#065F46' },
  'INV-012':   { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E' },
  'INV-013':   { bg: '#FFF7ED', border: '#FB923C', text: '#9A3412' },
  'INV-046':   { bg: '#FDF4FF', border: '#A855F7', text: '#6B21A8' },
  'INV-047':   { bg: '#F0FDFA', border: '#14B8A6', text: '#134E4A' },
  'INV-1048':  { bg: '#EEF2FF', border: '#6366F1', text: '#3730A3' },
  'INV-1054':  { bg: '#FFF1F2', border: '#F43F5E', text: '#881337' },
  'PRSI0022026':{ bg: '#ECFEFF', border: '#06B6D4', text: '#164E63' },
  'Dursun-May':{ bg: '#F7FEE7', border: '#65A30D', text: '#365314' },
};
const defaultInvColor = { bg: '#F8FAFC', border: '#94A3B8', text: '#334155' };
const getInvColor = (inv: string) => invoiceColors[inv] || defaultInvColor;

const estadoPrioridad = (e: string) => {
  const s = (e || "").toUpperCase();
  if (!s) return 4;
  if (s.includes("ADUANA") || s.includes("PUERTO")) return 1;
  if (s.includes("TRÁNSITO") || s.includes("TRANSITO")) return 2;
  if (s.includes("PRODUCCIÓN") || s.includes("PRODUCCION")) return 3;
  return 4;
};

// Parsea fecha DD/MM/YYYY o D/M/YYYY a número comparable YYYYMMDD.
// Si llega como número (serial Excel) lo usa directo. Vacío => al final.
const parseFechaETA = (s: string): number => {
  if (!s || !s.trim()) return 99999999;
  const t = s.trim();
  const parts = t.split("/");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const dn = parseInt(d, 10);
    const mn = parseInt(m, 10);
    const yn = parseInt(y, 10);
    if (!isNaN(dn) && !isNaN(mn) && !isNaN(yn)) {
      return yn * 10000 + mn * 100 + dn;
    }
  }
  const n = parseFloat(t.replace(",", "."));
  return isNaN(n) ? 99999999 : n;
};

// Parsea cantidades del CSV en formato americano: "1,050.0" -> 1050, "836.26" -> 836.26
const parsearCantidad = (s: unknown): number => {
  if (s === null || s === undefined) return 0;
  const limpio = s.toString().trim().replace(/,(?=\d{3})/g, "");
  return parseFloat(limpio) || 0;
};

function estadoBadgeStyle(estado: string): { bg: string; fg: string; border: string } {
  const s = estado.toUpperCase();
  if (s.includes("TRÁNSITO") || s.includes("TRANSITO"))
    return { bg: "hsl(213,90%,92%)", fg: "hsl(213,80%,32%)", border: "hsl(213,80%,75%)" };
  if (s.includes("PRODUCCIÓN") || s.includes("PRODUCCION"))
    return { bg: "hsl(220,10%,90%)", fg: "hsl(220,10%,30%)", border: "hsl(220,10%,75%)" };
  if (s.includes("ADUANA"))
    return { bg: "hsl(28,95%,90%)", fg: "hsl(28,80%,32%)", border: "hsl(28,80%,70%)" };
  if (s.includes("PUERTO"))
    return { bg: "hsl(143,60%,90%)", fg: "hsl(143,55%,28%)", border: "hsl(143,55%,65%)" };
  return { bg: "hsl(0,0%,93%)", fg: "hsl(0,0%,30%)", border: "hsl(0,0%,80%)" };
}

function verifBadge(v: string) {
  const s = (v || "").trim();
  if (s.includes("✅")) return { label: "✅ Auto-aprobado", bg: "hsl(143,60%,90%)", fg: "hsl(143,55%,25%)" };
  if (s.includes("⏳")) return { label: "⏳ Pend. aprobación", bg: "hsl(45,93%,88%)", fg: "hsl(38,90%,30%)" };
  if (s) return { label: s, bg: "hsl(0,0%,93%)", fg: "hsl(0,0%,30%)" };
  return { label: "⬜ Sin contar", bg: "hsl(0,0%,95%)", fg: "hsl(0,0%,45%)" };
}

const inputCls =
  "w-full px-4 py-3 text-2xl font-mono font-bold border-2 border-[hsl(214,32%,80%)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] focus:border-[hsl(217,91%,60%)]";

const ContainerCard = ({
  row,
  onLocalUpdate,
}: {
  row: Row;
  onLocalUpdate: (rowNumber: number, conteo: string, verificacion: string) => void;
}) => {
  const [val, setVal] = useState(row.conteo || "");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "ok" | "warn" | "err"; msg: string } | null>(null);
  const e = estadoBadgeStyle(row.estado);
  const vb = verifBadge(row.verificacion);
  const invoiceQty = parsearCantidad(row.qty);
  const hasSaved = (row.conteo || "").trim() !== "";

  const handleSave = async () => {
    const num = Number(String(val).replace(",", "."));
    if (val === "" || isNaN(num)) {
      toast.error("Ingresa un número válido");
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      await writeCell({ sheetId: NAV_SHEET_ID, cell: `P${row.rowNumber}` }, num);
      const diferencia = num - invoiceQty;
      const diferenciaPct = invoiceQty > 0 ? Math.abs(diferencia / invoiceQty) * 100 : 0;
      const requiereAprobacion = diferenciaPct > 10;
      const m2Str = `${diferencia > 0 ? "+" : ""}${diferencia.toFixed(1)}`;
      const pct = diferenciaPct.toFixed(1);
      const newVerif = requiereAprobacion ? "⏳ Pend. aprobación" : "✅ Auto-aprobado";
      setFeedback(
        requiereAprobacion
          ? { tone: "warn", msg: `⏳ Requiere aprobación — Diferencia: ${m2Str} m² (${pct}%)` }
          : { tone: "ok", msg: `✅ Auto-aprobado — Diferencia: ${m2Str} m² (${pct}%)` }
      );
      toast.success(`Conteo guardado para ${row.invoice}`);
      onLocalUpdate(row.rowNumber, String(num), newVerif);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al guardar";
      setFeedback({ tone: "err", msg: `❌ ${msg}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[hsl(214,32%,88%)] shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold text-[hsl(222,47%,11%)] font-mono">#{row.invoice || "—"}</div>
          <div
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
            style={{ background: e.bg, color: e.fg, borderColor: e.border }}
          >
            {row.estado || "—"}
          </div>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: vb.bg, color: vb.fg }}
        >
          {vb.label}
        </div>
      </div>

      <div>
        <div className="text-xl font-bold text-[hsl(222,47%,11%)] leading-tight">{row.name}</div>
        <div className="text-sm font-mono text-[hsl(215,16%,47%)] mt-0.5">{row.code}</div>
      </div>

      <div className="flex items-center gap-4 text-sm text-[hsl(215,16%,40%)] flex-wrap">
        <span>🏭 {row.proveedor || "—"}</span>
        <span>📅 ETA: <span className="font-semibold text-[hsl(222,47%,20%)]">{row.eta || "—"}</span></span>
      </div>

      <div className="bg-[hsl(214,95%,95%)] border border-[hsl(214,80%,85%)] rounded-xl px-4 py-3">
        <div className="text-xs uppercase tracking-widest text-[hsl(224,73%,33%)] font-bold">📦 Según invoice</div>
        <div className="text-3xl font-black font-mono text-[hsl(224,76%,38%)] mt-1">{row.qty ? parsearCantidad(row.qty).toLocaleString("es-CO", { maximumFractionDigits: 2 }) : "—"} <span className="text-base font-bold">m²</span></div>
      </div>

      <div>
        <label className="block text-base font-bold text-[hsl(222,47%,15%)] mb-2">
          Ingresa conteo físico (m²)
        </label>
        <input
          type="number"
          inputMode="decimal"
          value={val}
          onChange={(ev) => setVal(ev.target.value)}
          placeholder="0.00"
          className={inputCls}
          style={{ minHeight: 56 }}
        />
      </div>

      {feedback && (
        <div
          className="rounded-lg px-4 py-3 text-sm font-semibold"
          style={
            feedback.tone === "ok"
              ? { background: "hsl(143,60%,92%)", color: "hsl(143,55%,22%)" }
              : feedback.tone === "warn"
              ? { background: "hsl(45,93%,90%)", color: "hsl(38,90%,28%)" }
              : { background: "hsl(0,84%,93%)", color: "hsl(0,70%,35%)" }
          }
        >
          {feedback.msg}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-[hsl(217,91%,55%)] hover:bg-[hsl(217,91%,48%)] disabled:opacity-60 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
        style={{ minHeight: 56 }}
      >
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : hasSaved ? "✏️" : "💾"}
        {saving ? "Guardando…" : hasSaved ? "Actualizar conteo" : "Guardar conteo"}
      </button>
    </div>
  );
};

const ApprovalCard = ({ row, onAction }: { row: Row; onAction: () => void }) => {
  const [busy, setBusy] = useState<null | "ok" | "no">(null);
  const invoiceQty = parsearCantidad(row.qty);
  const conteoNum = parsearCantidad(row.conteo);
  const diff = invoiceQty > 0
    ? Math.abs((conteoNum - invoiceQty) / invoiceQty * 100).toFixed(1)
    : "—";

  const approve = async () => {
    setBusy("ok");
    try {
      await writeCell({ sheetId: NAV_SHEET_ID, cell: `O${row.rowNumber}` }, "✅ Aprobado");
      toast.success(`Aprobado #${row.invoice}`);
      onAction();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(null);
    }
  };
  const reject = async () => {
    setBusy("no");
    try {
      await writeCell({ sheetId: NAV_SHEET_ID, cell: `P${row.rowNumber}` }, "");
      toast.success(`Rechazado #${row.invoice}`);
      onAction();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[hsl(45,90%,80%)] shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-lg font-bold font-mono">#{row.invoice}</div>
        <div className="px-3 py-1 rounded-full text-xs font-bold bg-[hsl(45,93%,88%)] text-[hsl(38,90%,30%)]">
          ⏳ Pend. aprobación · diff {diff}%
        </div>
      </div>
      <div>
        <div className="text-base font-bold">{row.name}</div>
        <div className="text-xs font-mono text-[hsl(215,16%,47%)]">{row.code}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-[hsl(214,95%,95%)] rounded-lg px-3 py-2">
          <div className="text-[10px] uppercase font-bold text-[hsl(224,73%,33%)]">Invoice</div>
          <div className="text-lg font-mono font-bold">{parsearCantidad(row.qty).toLocaleString("es-CO", { maximumFractionDigits: 2 })} m²</div>
        </div>
        <div className="bg-[hsl(45,93%,92%)] rounded-lg px-3 py-2">
          <div className="text-[10px] uppercase font-bold text-[hsl(38,90%,30%)]">Conteo</div>
          <div className="text-lg font-mono font-bold">{parsearCantidad(row.conteo).toLocaleString("es-CO", { maximumFractionDigits: 2 })} m²</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={approve}
          disabled={busy !== null}
          className="flex-1 bg-[hsl(143,55%,38%)] hover:bg-[hsl(143,55%,32%)] text-white font-bold rounded-lg disabled:opacity-60"
          style={{ minHeight: 48 }}
        >
          {busy === "ok" ? "…" : "✅ Aprobar"}
        </button>
        <button
          onClick={reject}
          disabled={busy !== null}
          className="flex-1 bg-[hsl(0,75%,50%)] hover:bg-[hsl(0,75%,42%)] text-white font-bold rounded-lg disabled:opacity-60"
          style={{ minHeight: 48 }}
        >
          {busy === "no" ? "…" : "✖ Rechazar"}
        </button>
      </div>
    </div>
  );
};

const BodegaView = ({ onBack, isAdmin }: { onBack: () => void; isAdmin: boolean }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"pendientes" | "aprobaciones" | "pedidos">("pendientes");
  const [reloadKey, setReloadKey] = useState(0);
  const [filterInvoice, setFilterInvoice] = useState<string>("__all__");
  const [filterFabricante, setFilterFabricante] = useState<string>("__all__");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (inv: string) =>
    setCollapsed((c) => ({ ...c, [inv]: !c[inv] }));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${NAV_CSV}&_=${Date.now()}`)
      .then((r) => r.text())
      .then((csv) => {
        const all = parseCsv(csv);
        const data = all.slice(4);
        const parsed: Row[] = data
          .map((cols, i) => ({
            rowNumber: i + 5,
            invoice: (cols[0] || "").trim(),
            code: (cols[1] || "").trim(),
            name: (cols[2] || "").trim(),
            proveedor: (cols[3] || "").trim(),
            qty: (cols[5] || "").trim(),
            eta: (cols[6] || "").trim(),
            bodega: (cols[7] || "").trim(),
            estado: (cols[8] || "").trim(),
            conteo: (cols[15] || "").trim(),
            diferencia: (cols[13] || "").trim(),
            verificacion: (cols[14] || "").trim(),
            etaNum: parseFloat((cols[11] || "").replace(",", ".")) || 999999,
          }))
          .filter(
            (r) =>
              r.bodega.toUpperCase().includes("BARRANQUILLA") &&
              r.code.length > 0
          )
          .sort((a, b) => {
            const ep = estadoPrioridad(a.estado) - estadoPrioridad(b.estado);
            if (ep !== 0) return ep;
            return parseFechaETA(a.eta) - parseFechaETA(b.eta);
          });
        if (!cancelled) {
          setRows(parsed);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Error");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const invoiceOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.invoice).filter(Boolean))),
    [rows]
  );
  const fabricanteOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.proveedor).filter(Boolean))),
    [rows]
  );

  const pendientes = useMemo(
    () =>
      rows.filter(
        (r) =>
          (filterInvoice === "__all__" || r.invoice === filterInvoice) &&
          (filterFabricante === "__all__" || r.proveedor === filterFabricante)
      ),
    [rows, filterInvoice, filterFabricante]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const r of pendientes) {
      const key = r.invoice || "—";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries());
  }, [pendientes]);

  const aprobaciones = useMemo(
    () => rows.filter((r) => r.verificacion.includes("⏳")),
    [rows]
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white border-b-2 border-[hsl(214,32%,90%)]">
        <div className="max-w-[1100px] mx-auto px-5 py-4 flex items-center gap-4 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[hsl(214,32%,85%)] text-[hsl(222,47%,15%)] font-semibold hover:bg-[hsl(210,20%,96%)]"
            style={{ minHeight: 44 }}
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[hsl(222,47%,11%)] flex-1 min-w-[240px]">
            🏭 Bodega Barranquilla — Conteo de Contenedores
          </h1>
          <div className="px-3 py-1.5 rounded-full bg-[hsl(217,91%,94%)] text-[hsl(217,91%,40%)] text-sm font-bold">
            {pendientes.length} pendientes
          </div>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="p-2 rounded-lg border-2 border-[hsl(214,32%,85%)] text-[hsl(215,16%,40%)] hover:bg-[hsl(210,20%,96%)]"
            aria-label="Recargar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {isAdmin && (
          <div className="max-w-[1100px] mx-auto px-5 pb-3 flex gap-2">
            <button
              onClick={() => setTab("pendientes")}
              className={`px-4 py-2 rounded-lg text-sm font-bold ${
                tab === "pendientes"
                  ? "bg-[hsl(217,91%,55%)] text-white"
                  : "bg-[hsl(210,20%,95%)] text-[hsl(215,16%,40%)]"
              }`}
            >
              📦 Conteo ({pendientes.length})
            </button>
            <button
              onClick={() => setTab("aprobaciones")}
              className={`px-4 py-2 rounded-lg text-sm font-bold ${
                tab === "aprobaciones"
                  ? "bg-[hsl(38,90%,45%)] text-white"
                  : "bg-[hsl(210,20%,95%)] text-[hsl(215,16%,40%)]"
              }`}
            >
              ⏳ Aprobaciones ({aprobaciones.length})
            </button>
            <button
              onClick={() => setTab("pedidos")}
              className={`px-4 py-2 rounded-lg text-sm font-bold ${
                tab === "pedidos"
                  ? "bg-[hsl(222,47%,18%)] text-white"
                  : "bg-[hsl(210,20%,95%)] text-[hsl(215,16%,40%)]"
              }`}
            >
              📋 Pedidos
            </button>
          </div>
        )}
      </header>

      <div className="max-w-[1100px] mx-auto px-5 py-6">
        {loading && (
          <div className="flex flex-col items-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[hsl(217,91%,55%)]" />
            <p className="text-[hsl(215,16%,45%)] font-medium">Cargando contenedores…</p>
          </div>
        )}
        {error && (
          <div className="bg-[hsl(0,84%,95%)] text-[hsl(0,70%,32%)] rounded-xl p-4 text-center font-semibold">
            ⚠️ {error}
          </div>
        )}
        {!loading && !error && tab === "pendientes" && (
          <>
            <div className="flex flex-wrap gap-3 mb-5 items-end">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-[hsl(215,16%,40%)] mb-1">
                  Invoice
                </label>
                <select
                  value={filterInvoice}
                  onChange={(e) => setFilterInvoice(e.target.value)}
                  className="px-3 py-2 rounded-lg border-2 border-[hsl(214,32%,85%)] text-base font-semibold bg-white"
                  style={{ minHeight: 44 }}
                >
                  <option value="__all__">Todos</option>
                  {invoiceOptions.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-[hsl(215,16%,40%)] mb-1">
                  Fabricante
                </label>
                <select
                  value={filterFabricante}
                  onChange={(e) => setFilterFabricante(e.target.value)}
                  className="px-3 py-2 rounded-lg border-2 border-[hsl(214,32%,85%)] text-base font-semibold bg-white"
                  style={{ minHeight: 44 }}
                >
                  <option value="__all__">Todos</option>
                  {fabricanteOptions.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="ml-auto text-sm font-semibold text-[hsl(215,16%,40%)]">
                {pendientes.length} contenedor{pendientes.length === 1 ? "" : "es"} visible{pendientes.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {grouped.map(([invoice, items]) => {
                const color = getInvColor(invoice);
                const first = items[0];
                const totalM2 = items.reduce((sum, r) => sum + parsearCantidad(r.qty), 0);
                const isCollapsed = !!collapsed[invoice];
                const eb = estadoBadgeStyle(first.estado);
                return (
                  <div key={invoice} className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => toggleGroup(invoice)}
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl text-left flex-wrap"
                      style={{
                        background: color.bg,
                        borderLeft: `4px solid ${color.border}`,
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isCollapsed ? (
                          <ChevronRight className="w-5 h-5" style={{ color: color.text }} />
                        ) : (
                          <ChevronDown className="w-5 h-5" style={{ color: color.text }} />
                        )}
                        <div className="text-lg font-extrabold font-mono" style={{ color: color.text }}>
                          #{invoice}
                        </div>
                        <div className="px-2 py-0.5 rounded-full text-xs font-bold bg-[hsl(210,20%,92%)] text-[hsl(215,16%,30%)]">
                          🏭 {first.proveedor || "—"}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div
                          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                          style={{ background: eb.bg, color: eb.fg, borderColor: eb.border }}
                        >
                          {first.estado || "—"}
                        </div>
                        <div className="text-xs font-semibold text-[hsl(215,16%,35%)]">
                          📅 {first.eta || "—"}
                        </div>
                        <div className="text-xs font-bold" style={{ color: color.text }}>
                          {items.length} producto{items.length === 1 ? "" : "s"} · {totalM2.toLocaleString("es-CO", { maximumFractionDigits: 1 })} m² total
                        </div>
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3" style={{ borderLeft: `4px solid ${color.border}` }}>
                        {items.map((r) => (
                          <ContainerCard
                            key={`${r.rowNumber}-${r.invoice}`}
                            row={r}
                            onLocalUpdate={(rowNumber, conteo, verificacion) =>
                              setRows((prev) =>
                                prev.map((x) =>
                                  x.rowNumber === rowNumber ? { ...x, conteo, verificacion } : x
                                )
                              )
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {pendientes.length === 0 && (
                <div className="text-center py-16 text-[hsl(215,16%,45%)]">
                  <div className="text-4xl mb-3">📭</div>
                  <div className="text-lg font-semibold">Sin contenedores pendientes</div>
                </div>
              )}
            </div>
          </>
        )}
        {!loading && !error && tab === "aprobaciones" && isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aprobaciones.map((r) => (
              <ApprovalCard key={`${r.rowNumber}-${r.invoice}`} row={r} onAction={() => setReloadKey((k) => k + 1)} />
            ))}
            {aprobaciones.length === 0 && (
              <div className="col-span-full text-center py-16 text-[hsl(215,16%,45%)]">
                <div className="text-4xl mb-3">✨</div>
                <div className="text-lg font-semibold">Nada pendiente de aprobación</div>
              </div>
            )}
          </div>
        )}
        {!loading && !error && tab === "pedidos" && isAdmin && <PedidosView />}
      </div>
    </div>
  );
};

export default BodegaView;