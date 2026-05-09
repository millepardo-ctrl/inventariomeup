import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";

const PEDIDOS_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZcZ_HAFNOdIAXh8AvNqeiBM3fjfBLHUPYxz5u_WYPnwi_nKZ8N3lzpAnSLYRb6HNp46DHG0Z48mjZ/pub?gid=1049881921&single=true&output=csv";

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

const parsearCantidad = (s: unknown): number => {
  if (s === null || s === undefined) return 0;
  const limpio = s.toString().trim().replace(/,(?=\d{3})/g, "");
  return parseFloat(limpio) || 0;
};

const parseFecha = (s: string): Date => {
  if (!s) return new Date(9999, 0, 1);
  const parts = s.toString().trim().split("/");
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return new Date(y, m - 1, d);
  }
  const dt = new Date(s);
  return isNaN(dt.getTime()) ? new Date(9999, 0, 1) : dt;
};

const formatFecha = (s: string): string => {
  const d = parseFecha(s);
  if (d.getFullYear() === 9999) return s || "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

interface Pedido {
  fecha: string;
  idCompra: string;
  codigo: string;
  nombre: string;
  cantidad: string;
  unidad: string;
  bodega: string;
  estado: string;
  invoiceContenedor: string;
  estadoContenedor: string;
  alerta: string;
  notas: string;
}

const isPreReserva = (e: string) => e.toUpperCase().includes("PRE-RESERVA");
const isSinDespachar = (e: string) => e.toUpperCase().includes("SIN DESPACHAR");

const NAVY = "#1B2B4B";
const ORANGE = "#F59E0B";

const EstadoBadge = ({ estado, small = false }: { estado: string; small?: boolean }) => {
  const pre = isPreReserva(estado);
  const bg = pre ? ORANGE : NAVY;
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider text-white ${
        small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      }`}
      style={{ background: bg }}
    >
      {estado || "—"}
    </span>
  );
};

const PedidosView = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${PEDIDOS_CSV}&_=${Date.now()}`)
      .then((r) => r.text())
      .then((csv) => {
        const all = parseCsv(csv);
        const data = all.slice(4);
        const parsed: Pedido[] = data
          .map((cols) => ({
            fecha: (cols[0] || "").trim(),
            idCompra: (cols[1] || "").trim(),
            codigo: (cols[2] || "").trim(),
            nombre: (cols[3] || "").trim(),
            cantidad: (cols[4] || "").trim(),
            unidad: (cols[5] || "").trim(),
            bodega: (cols[6] || "").trim(),
            estado: (cols[7] || "").trim(),
            invoiceContenedor: (cols[8] || "").trim(),
            estadoContenedor: (cols[9] || "").trim(),
            alerta: (cols[10] || "").trim(),
            notas: (cols[11] || "").trim(),
          }))
          .filter((p) => p.bodega.toUpperCase().includes("BARRANQUILLA") && p.idCompra.length > 0);
        if (!cancelled) {
          setPedidos(parsed);
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
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Pedido[]>();
    for (const p of pedidos) {
      if (!map.has(p.idCompra)) map.set(p.idCompra, []);
      map.get(p.idCompra)!.push(p);
    }
    return Array.from(map.entries()).sort((a, b) => {
      const fa = parseFecha(a[1][0]?.fecha || "");
      const fb = parseFecha(b[1][0]?.fecha || "");
      return fa.getTime() - fb.getTime();
    });
  }, [pedidos]);

  const totalIds = grouped.length;
  const totalSinDesp = pedidos.filter((p) => isSinDespachar(p.estado)).length;
  const totalPre = pedidos.filter((p) => isPreReserva(p.estado)).length;

  const toggle = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  if (loading) {
    return (
      <div className="flex flex-col items-center py-16 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(217,91%,55%)]" />
        <p className="text-[hsl(215,16%,45%)] font-medium">Cargando pedidos…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-[hsl(0,84%,95%)] text-[hsl(0,70%,32%)] rounded-xl p-4 text-center font-semibold">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="px-3 py-1.5 rounded-full bg-[hsl(217,91%,94%)] text-[hsl(217,91%,40%)] text-sm font-bold">
          🧾 {totalIds} ID{totalIds === 1 ? "" : "s"} de compra
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-sm font-bold text-white"
          style={{ background: NAVY }}
        >
          📦 {totalSinDesp} sin despachar
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-sm font-bold text-white"
          style={{ background: ORANGE }}
        >
          🚢 {totalPre} pre-reserva en tránsito
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {grouped.map(([idCompra, items]) => {
          const hasPre = items.some((i) => isPreReserva(i.estado));
          const hasSin = items.some((i) => isSinDespachar(i.estado));
          const isMixto = hasPre && hasSin;
          const isCollapsed = !!collapsed[idCompra];
          const totalCantidad = items.reduce((s, i) => s + parsearCantidad(i.cantidad), 0);
          const unidades = Array.from(new Set(items.map((i) => i.unidad).filter(Boolean)));
          const unidadLabel = unidades.length === 1 ? unidades[0] : "u";
          return (
            <div key={idCompra} className="rounded-xl border-2 border-[hsl(214,32%,88%)] bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(idCompra)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-[hsl(210,20%,97%)] text-left flex-wrap hover:bg-[hsl(210,20%,94%)]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isCollapsed ? (
                    <ChevronRight className="w-5 h-5 text-[hsl(215,16%,40%)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[hsl(215,16%,40%)]" />
                  )}
                  <div className="text-lg font-extrabold font-mono text-[hsl(222,47%,11%)]">
                    #{idCompra}
                  </div>
                  <div className="text-xs font-semibold text-[hsl(215,16%,40%)]">
                    📅 {formatFecha(items[0]?.fecha || "")}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-xs font-bold text-[hsl(215,16%,30%)]">
                    {items.length} ítem{items.length === 1 ? "" : "s"} ·{" "}
                    {totalCantidad.toLocaleString("es-CO", { maximumFractionDigits: 2 })} {unidadLabel}
                  </div>
                  {isMixto ? (
                    <div className="flex gap-1">
                      <EstadoBadge estado="SIN DESPACHAR" small />
                      <EstadoBadge estado="PRE-RESERVA EN TRÁNSITO" small />
                    </div>
                  ) : hasPre ? (
                    <EstadoBadge estado="PRE-RESERVA EN TRÁNSITO" />
                  ) : (
                    <EstadoBadge estado="SIN DESPACHAR" />
                  )}
                </div>
              </button>

              {!isCollapsed && (
                <div className="divide-y divide-[hsl(214,32%,92%)]">
                  {items.map((p, idx) => {
                    const pre = isPreReserva(p.estado);
                    const hasAlerta = p.alerta && p.alerta !== "—";
                    return (
                      <div key={idx} className="px-5 py-3 flex flex-col gap-1.5">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-mono text-[hsl(215,16%,55%)]">{p.codigo}</div>
                            <div className="text-base font-bold text-[hsl(222,47%,11%)] leading-tight">{p.nombre}</div>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="text-base font-mono font-bold text-[hsl(222,47%,15%)]">
                              {parsearCantidad(p.cantidad).toLocaleString("es-CO", { maximumFractionDigits: 2 })}{" "}
                              <span className="text-xs font-semibold text-[hsl(215,16%,45%)]">{p.unidad}</span>
                            </div>
                            <EstadoBadge estado={p.estado} small />
                          </div>
                        </div>
                        {pre && (p.invoiceContenedor || p.estadoContenedor) && (
                          <div className="text-xs font-semibold" style={{ color: ORANGE }}>
                            📦 Invoice: {p.invoiceContenedor || "—"}
                            {p.estadoContenedor ? ` · ${p.estadoContenedor}` : ""}
                          </div>
                        )}
                        {p.notas && (
                          <div className="text-xs italic text-[hsl(215,16%,45%)]">📝 {p.notas}</div>
                        )}
                        {hasAlerta && (
                          <div className="text-xs font-semibold rounded px-2 py-1 inline-block w-fit"
                            style={{ background: "hsl(45,93%,90%)", color: "hsl(38,90%,28%)" }}>
                            ⚠️ {p.alerta}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {grouped.length === 0 && (
          <div className="text-center py-16 text-[hsl(215,16%,45%)]">
            <div className="text-4xl mb-3">📭</div>
            <div className="text-lg font-semibold">Sin pedidos activos</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosView;