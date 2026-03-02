import { Product } from "@/data/products";

interface KpiBarProps {
  products: Product[];
  isVendedor: boolean;
}

const UNITS = ["m²", "ml", "Und"] as const;

const KpiBar = ({ products, isVendedor }: KpiBarProps) => {
  const sumByUnit = (field: keyof Product, unit: string) =>
    products
      .filter(p => p.u === unit)
      .reduce((s, p) => s + (Number(p[field]) || 0), 0);

  const fmt = (v: number) => v.toLocaleString("es-CO", { maximumFractionDigits: 0 });

  const buildUnitBreakdown = (field: keyof Product) =>
    UNITS.map(u => ({ unit: u, value: sumByUnit(field, u) })).filter(b => b.value > 0);

  const totRes = products.reduce((s, p) => s + p.res, 0);
  const totPre = products.reduce((s, p) => s + p.pre_res, 0);
  const withD1 = products.filter(p => p.d1 > 0).length;
  const withD2 = products.filter(p => p.d2 > 0).length;

  const kpis: { label: string; breakdown: { unit: string; value: number }[]; sub: string; icon: string; color: string; simpleValue?: string }[] = [
    { label: "Disp. Barranquilla", breakdown: buildUnitBreakdown("disp_baq"), sub: "disponibles en bodega", icon: "🔵", color: "text-foreground" },
    { label: "Disp. Cúcuta", breakdown: buildUnitBreakdown("disp_cuc"), sub: "disponibles en bodega", icon: "⚪", color: "text-muted-foreground" },
    { label: "Disp. 1 — Próximo", breakdown: buildUnitBreakdown("d1"), sub: `${withD1} refs · próximo a llegar`, icon: "🟢", color: "text-[hsl(var(--disp1-value))]" },
    { label: "Disp. 2 — Tránsito", breakdown: buildUnitBreakdown("d2"), sub: `${withD2} refs · navegando`, icon: "🔵", color: "text-transit-value" },
    ...(isVendedor ? [
      { label: "Reservas Activas", breakdown: [], simpleValue: fmt(totRes), sub: "material bloqueado", icon: "🔒", color: "text-reserved-value" },
      { label: "Pre-Reservas Tránsito", breakdown: [], simpleValue: fmt(totPre), sub: "comprometido sobre contenedor", icon: "🔮", color: "text-[hsl(var(--prereserved-value))]" },
    ] : []),
  ];

  const cols = isVendedor ? "lg:grid-cols-6" : "lg:grid-cols-4";

  return (
    <div className={`grid gap-3 mb-5 grid-cols-2 ${cols}`}>
      {kpis.map((k, i) => (
        <div key={i} className="bg-card rounded-xl p-3.5 lg:p-4 border border-border shadow-sm">
          <div className="flex justify-between items-start mb-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">{k.label}</span>
            <span className="text-base">{k.icon}</span>
          </div>
          {k.simpleValue !== undefined ? (
            <div className={`text-2xl font-black font-mono tracking-tight ${k.color}`}>
              {k.simpleValue}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {k.breakdown.map((b, j) => (
                <div key={b.unit} className={`font-mono tracking-tight ${k.color} ${j === 0 ? "text-2xl font-black" : "text-sm font-bold opacity-70"}`}>
                  {fmt(b.value)} <span className="text-[10px] font-semibold opacity-60">{b.unit}</span>
                </div>
              ))}
              {k.breakdown.length === 0 && (
                <div className={`text-2xl font-black font-mono tracking-tight text-muted-foreground/40`}>0</div>
              )}
            </div>
          )}
          <div className="text-[10px] text-muted-foreground mt-1">{k.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default KpiBar;
