import { PRODUCTS } from "@/data/products";

interface KpiBarProps {
  isVendedor: boolean;
}

const KpiBar = ({ isVendedor }: KpiBarProps) => {
  const totalBaq = PRODUCTS.reduce((s, p) => s + p.baq, 0);
  const totalCuc = PRODUCTS.reduce((s, p) => s + p.cuc, 0);
  const totalNav = PRODUCTS.reduce((s, p) => s + p.d1 + p.d2, 0);
  const totalRes = PRODUCTS.reduce((s, p) => s + p.res, 0);
  const withNav = PRODUCTS.filter(p => p.d1 + p.d2 > 0).length;

  const kpis = [
    { label: "Stock Barranquilla", value: totalBaq.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "m² / Und en bodega", icon: "🔵", accent: false as const },
    { label: "Stock Cúcuta", value: totalCuc.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "m² / Und en bodega", icon: "⚪", accent: "muted" as const },
    { label: "En Tránsito", value: totalNav.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: `${withNav} referencias · Disp.1 + Disp.2`, icon: "🚢", accent: "transit" as const },
    ...(isVendedor ? [{ label: "Reservas Activas", value: totalRes.toLocaleString("es-CO", { maximumFractionDigits: 0 }), sub: "bloqueado para clientes", icon: "🔒", accent: "reserved" as const }] : []),
  ];

  return (
    <div className={`grid gap-3.5 mb-6 grid-cols-2 ${isVendedor ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {kpis.map((k, i) => (
        <div key={i} className="bg-card rounded-xl p-4 lg:p-5 border border-border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{k.label}</span>
            <span className="text-lg">{k.icon}</span>
          </div>
          <div className={`text-2xl font-black font-mono tracking-tight ${
            k.accent === "transit" ? "text-transit-value" : k.accent === "reserved" ? "text-reserved-value" : k.accent === "muted" ? "text-muted-foreground" : "text-foreground"
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
