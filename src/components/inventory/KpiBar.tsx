import { PRODUCTS } from "@/data/products";

interface KpiBarProps {
  isVendedor: boolean;
}

const KpiBar = ({ isVendedor }: KpiBarProps) => {
  const totalCuc = PRODUCTS.reduce((s, p) => s + p.cuc, 0);
  const totalBaq = PRODUCTS.reduce((s, p) => s + p.baq, 0);
  const totalNav = PRODUCTS.reduce((s, p) => s + p.d1 + p.d2, 0);
  const totalRes = PRODUCTS.reduce((s, p) => s + p.res, 0);
  const withNav = PRODUCTS.filter(p => p.d1 + p.d2 > 0).length;

  const kpis = [
    { label: "Stock Cúcuta", value: totalCuc.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "m² / ml en bodega", icon: "🏭", accent: false },
    { label: "Stock B/quilla", value: totalBaq.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "m² / ml en bodega", icon: "🏭", accent: false },
    { label: "En Tránsito", value: totalNav.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: `${withNav} referencias · DISP 1 + DISP 2`, icon: "🚢", accent: "transit" as const },
    ...(isVendedor ? [{ label: "Reservas Activas", value: totalRes.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "bloqueado para clientes", icon: "🔒", accent: "reserved" as const }] : []),
  ];

  return (
    <div className={`grid gap-3.5 mb-6 ${isVendedor ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-3"}`}>
      {kpis.map((k, i) => (
        <div key={i} className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{k.label}</span>
            <span className="text-lg">{k.icon}</span>
          </div>
          <div className={`text-2xl font-extrabold font-mono tracking-tight ${
            k.accent === "transit" ? "text-transit-value" : k.accent === "reserved" ? "text-reserved-value" : "text-foreground"
          }`}>
            {k.value}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">{k.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default KpiBar;
