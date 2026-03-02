import { PRODUCTS } from "@/data/products";

interface KpiBarProps {
  isVendedor: boolean;
}

const KpiBar = ({ isVendedor }: KpiBarProps) => {
  const totBaq = PRODUCTS.reduce((s, p) => s + p.disp_baq, 0);
  const totCuc = PRODUCTS.reduce((s, p) => s + p.disp_cuc, 0);
  const totD1 = PRODUCTS.reduce((s, p) => s + p.d1, 0);
  const totD2 = PRODUCTS.reduce((s, p) => s + p.d2, 0);
  const totRes = PRODUCTS.reduce((s, p) => s + p.res, 0);
  const totPre = PRODUCTS.reduce((s, p) => s + p.pre_res, 0);
  const withD1 = PRODUCTS.filter(p => p.d1 > 0).length;
  const withD2 = PRODUCTS.filter(p => p.d2 > 0).length;

  const kpis = [
    { label: "Disp. Barranquilla", value: totBaq.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "m² / Und disponibles", icon: "🔵", color: "text-foreground" },
    { label: "Disp. Cúcuta", value: totCuc.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "m² / Und disponibles", icon: "⚪", color: "text-muted-foreground" },
    { label: "Disp. 1 — Próximo", value: totD1.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: `${withD1} refs · próximo a llegar`, icon: "🟢", color: "text-[hsl(var(--disp1-value))]" },
    { label: "Disp. 2 — Tránsito", value: totD2.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: `${withD2} refs · navegando`, icon: "🔵", color: "text-transit-value" },
    ...(isVendedor ? [
      { label: "Reservas Activas", value: totRes.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "material bloqueado", icon: "🔒", color: "text-reserved-value" },
      { label: "Pre-Reservas Tránsito", value: totPre.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "comprometido sobre contenedor", icon: "🔮", color: "text-[hsl(var(--prereserved-value))]" },
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
          <div className={`text-2xl font-black font-mono tracking-tight ${k.color}`}>
            {k.value}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">{k.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default KpiBar;
