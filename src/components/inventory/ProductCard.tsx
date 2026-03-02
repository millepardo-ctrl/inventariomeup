import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Product, CAT_KEY_MAP, fmt } from "@/data/products";

interface ProductCardProps {
  product: Product;
  isVendedor: boolean;
}

const ProductCard = ({ product: p, isVendedor }: ProductCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const catKey = CAT_KEY_MAP[p.cat];
  const totalBodega = p.baq + p.cuc;
  const hasNav = p.d1 > 0 || p.d2 > 0;
  const hasReservas = p.res > 0;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`bg-card border border-border rounded-xl cursor-pointer transition-all duration-150 overflow-hidden ${
        expanded ? "shadow-lg" : "shadow-sm hover:shadow-md"
      }`}
      style={{ borderLeftWidth: 4, borderLeftColor: `hsl(var(--cat-${catKey}))` }}
    >
      {/* Row */}
      <div className="flex items-center gap-2.5 px-3.5 py-3 flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="text-[10px] font-bold px-1.5 py-px rounded-full uppercase tracking-wider whitespace-nowrap"
              style={{
                backgroundColor: `hsl(var(--cat-${catKey}-bg))`,
                color: `hsl(var(--cat-${catKey}-label))`,
              }}
            >
              {p.cat}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{p.c}</span>
          </div>
          <div className="text-[13px] font-semibold text-foreground leading-tight">{p.n}</div>
        </div>

        {/* Barranquilla - highlighted */}
        <div
          className="rounded-lg px-2.5 py-1.5 text-center min-w-[70px]"
          style={{
            backgroundColor: p.baq > 0 ? `hsl(var(--cat-${catKey}-bg))` : undefined,
            borderWidth: 1,
            borderColor: p.baq > 0 ? `hsl(var(--cat-${catKey}) / 0.25)` : `hsl(var(--border))`,
          }}
        >
          <div className="text-sm font-bold font-mono text-foreground">
            {p.baq > 0 ? p.baq.toLocaleString("es-CO", { maximumFractionDigits: 1 }) : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground">B/quilla</div>
        </div>

        {/* Cúcuta */}
        <div className="text-center min-w-[55px]">
          <div className="text-[13px] font-bold font-mono text-foreground">
            {p.cuc > 0 ? p.cuc.toLocaleString("es-CO", { maximumFractionDigits: 1 }) : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground">Cúcuta</div>
        </div>

        {/* Transit */}
        {hasNav && (
          <div className="bg-transit-bg border border-transit-border rounded-lg px-2.5 py-1 text-center">
            <div className="text-xs font-bold text-transit-value font-mono">
              {(p.d1 + p.d2).toLocaleString("es-CO", { maximumFractionDigits: 1 })}
            </div>
            <div className="text-[10px] text-transit-label">En tránsito</div>
          </div>
        )}

        {/* Reserved */}
        {isVendedor && hasReservas && (
          <div className="bg-reserved-bg border border-reserved-border rounded-lg px-2.5 py-1 text-center">
            <div className="text-xs font-bold text-reserved-value font-mono">
              {p.res.toLocaleString("es-CO", { maximumFractionDigits: 1 })}
            </div>
            <div className="text-[10px] text-reserved-label">Reservado</div>
          </div>
        )}

        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-3.5 pb-3.5 pt-0">
          <div className="pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-slide-in">
            {/* Stock */}
            <div className="rounded-[9px] p-3 shadow-sm bg-card border border-border">
              <div className="text-[10px] font-bold text-foreground mb-1.5 uppercase tracking-widest">📦 Stock en Bodega</div>
              <div className="flex justify-between">
                <div>
                  <div className="text-xl font-black text-foreground font-mono">{fmt(p.baq)}</div>
                  <div className="text-[11px] text-muted-foreground">B/quilla · {p.u}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-foreground font-mono">{fmt(p.cuc)}</div>
                  <div className="text-[11px] text-muted-foreground">Cúcuta · {p.u}</div>
                </div>
              </div>
              {totalBodega > 0 && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <span className="text-[11px] font-semibold" style={{ color: `hsl(var(--cat-${catKey}))` }}>
                    Total: {totalBodega.toLocaleString("es-CO", { maximumFractionDigits: 1 })} {p.u}
                  </span>
                </div>
              )}
            </div>

            {/* Navigation */}
            {hasNav ? (
              <div className="bg-transit-bg rounded-[9px] p-3 shadow-sm">
                <div className="text-[10px] font-bold text-transit-value mb-1.5 uppercase tracking-widest">🚢 Próximas Llegadas</div>
                {p.d1 > 0 && (
                  <div className="mb-2">
                    <span className="text-[11px] text-transit-label font-semibold">Disp. 1 — más próximo</span>
                    <div className="text-xl font-black text-transit-value font-mono">
                      {fmt(p.d1)} <span className="text-[11px] font-normal">{p.u}</span>
                    </div>
                    {p.eta1 && <div className="text-[10px] text-transit-label mt-0.5">📅 ETA: {p.eta1}</div>}
                  </div>
                )}
                {p.d2 > 0 && (
                  <div className={p.d1 > 0 ? "border-t border-transit-border pt-2" : ""}>
                    <span className="text-[11px] text-transit-label font-semibold">Disp. 2 — siguiente</span>
                    <div className="text-xl font-black text-transit-value font-mono">
                      {fmt(p.d2)} <span className="text-[11px] font-normal">{p.u}</span>
                    </div>
                    {p.eta2 && <div className="text-[10px] text-transit-label mt-0.5">📅 ETA: {p.eta2}</div>}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-[9px] p-3 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Sin material en tránsito</span>
              </div>
            )}

            {/* Reservas */}
            {isVendedor && hasReservas && (
              <div className="bg-reserved-bg rounded-[9px] p-3 shadow-sm">
                <div className="text-[10px] font-bold text-reserved-value mb-1.5 uppercase tracking-widest">🔒 Reservas Activas</div>
                <div className="text-xl font-black text-reserved-value font-mono">
                  {fmt(p.res)} <span className="text-[11px] font-normal text-reserved-label">{p.u}</span>
                </div>
                <div className="text-[11px] text-reserved-label mt-1">Material bloqueado</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
