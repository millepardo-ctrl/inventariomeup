import { useMemo, useState } from "react";
import { lsGet, itemM2, CAT_TOKEN, SolicitudItem } from "@/data/muestras-catalog";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

interface AggRow {
  ref: string; cod: string; cat: string;
  m: number; f: number; p: number; m2: number;
}

export default function ReportesView() {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [ano, setAno] = useState(hoy.getFullYear());

  const { rows, stats } = useMemo(() => {
    const data = lsGet().filter(s => {
      const d = new Date(s.fechaSolicitud);
      return d.getMonth() + 1 === mes && d.getFullYear() === ano && s.estado === "despachado";
    });

    const agg: Record<string, AggRow> = {};
    data.forEach(s =>
      s.items.forEach((it: SolicitudItem) => {
        const k = it.codigo || it.referencia;
        if (!agg[k]) agg[k] = { ref: it.referencia, cod: it.codigo, cat: "", m: 0, f: 0, p: 0, m2: 0 };
        const m2v = itemM2(it);
        if (it.tipo === "muestra") { agg[k].m++; agg[k].m2 += m2v; }
        else if (it.tipo === "ficha") { agg[k].f++; agg[k].m2 += m2v; }
        else { agg[k].p++; agg[k].m2 += m2v; }
      })
    );

    const rows = Object.values(agg);
    const stats = {
      solicitudes: data.length,
      muestras:  rows.reduce((s, r) => s + r.m, 0),
      fichas:    rows.reduce((s, r) => s + r.f, 0),
      piezas:    rows.reduce((s, r) => s + r.p, 0),
      m2total:   +rows.reduce((s, r) => s + r.m2, 0).toFixed(4),
    };
    return { rows, stats };
  }, [mes, ano]);

  function exportCSV() {
    const data = lsGet().filter(s => {
      const d = new Date(s.fechaSolicitud);
      return d.getMonth() + 1 === mes && d.getFullYear() === ano;
    });
    const header = ["Fecha","Asesor","Nombre","Cédula","Celular","Ciudad","Depto","Dirección","Envío","Estado","Código","Referencia","Acabado","Tipo","m²"];
    const csvRows = [header, ...data.flatMap(s =>
      s.items.map(it => [
        new Date(s.fechaSolicitud).toLocaleString("es-CO"),
        s.asesor, s.destinatario.nom, s.destinatario.ced, s.destinatario.cel,
        s.destinatario.city, s.destinatario.depto, s.destinatario.dir,
        s.tipoEnvio, s.estado, it.codigo, it.referencia, it.acabado, it.tipo,
        itemM2(it).toFixed(4),
      ])
    )];
    const csv = csvRows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = `muestras_${mes}_${ano}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const anos = Array.from({ length: hoy.getFullYear() - 2023 }, (_, i) => 2024 + i);

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-base font-bold text-foreground">Reporte de Muestras</h2>
        <select value={mes} onChange={e => setMes(+e.target.value)}
          className="bg-card border border-border rounded-[9px] px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary">
          {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        <select value={ano} onChange={e => setAno(+e.target.value)}
          className="bg-card border border-border rounded-[9px] px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary">
          {anos.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={exportCSV}
          className="ml-auto px-3 py-1.5 rounded-[9px] bg-card border border-border text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-all">
          Exportar CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard label="Solicitudes" value={stats.solicitudes} sub="despachadas" />
        <StatCard label="Muestras" value={stats.muestras} sub="10×15 cm" />
        <StatCard label="Fichas" value={stats.fichas} sub="piezas grandes" />
        <StatCard label="Piezas reales" value={stats.piezas} sub="splitface / pizarra / bali" />
        <StatCard label="m² total" value={stats.m2total} sub="descontar inventario" highlight />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-muted/50">
              {["Referencia","Código","Categoría","Muestras","Fichas","Piezas","m²"].map((h, i) => (
                <th key={h} className={`px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border ${i >= 3 ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Sin despachos en este período</td></tr>
            ) : rows.map((r, i) => {
              const tk = r.cat ? (CAT_TOKEN[r.cat] ?? "") : "";
              return (
                <tr key={i} className="border-b border-border/50 hover:bg-accent/40 transition-colors">
                  <td className="px-3 py-2.5 font-semibold text-foreground">{r.ref}</td>
                  <td className="px-3 py-2.5 font-mono text-[12px] text-muted-foreground">{r.cod || "—"}</td>
                  <td className="px-3 py-2.5">
                    {tk && (
                      <span className="text-[10px] font-bold px-2 py-px rounded-full"
                        style={{ background: `hsl(var(--cat-${tk}-bg))`, color: `hsl(var(--cat-${tk}-label))` }}>
                        {r.cat}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right text-muted-foreground">{r.m || "—"}</td>
                  <td className="px-3 py-2.5 text-right text-muted-foreground">{r.f || "—"}</td>
                  <td className="px-3 py-2.5 text-right text-muted-foreground">{r.p || "—"}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-semibold text-foreground">{r.m2.toFixed(4)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, highlight }: { label: string; value: number; sub: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl px-4 py-3 shadow-sm border transition-all hover:-translate-y-px hover:shadow-[var(--shadow-lift)] ${highlight ? "bg-muestra-bg border-muestra-border" : "bg-card border-border/60"}`}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className={`text-2xl font-black font-mono ${highlight ? "text-primary" : "text-foreground"}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
