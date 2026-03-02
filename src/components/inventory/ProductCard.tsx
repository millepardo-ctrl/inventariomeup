import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Product, CAT_STYLE, fmt } from "@/data/products";

interface ProductCardProps {
  product: Product;
  isVendedor: boolean;
}

const ProductCard = ({ product: p, isVendedor }: ProductCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const style = CAT_STYLE[p.cat];
  const totalBodega = p.cuc + p.baq;
  const hasNav = p.d1 > 0 || p.d2 > 0;
  const hasReservas = p.res > 0;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`bg-card border border-border border-l-4 rounded-xl px-4 py-4 cursor-pointer transition-all duration-150 ${
        expanded ? "shadow-lg" : "shadow-sm hover:shadow-md"
      }`}
      style={{ borderLeftColor: `hsl(var(--cat-${p.cat === "Bali/Piedra" ? "bali" : p.cat.toLowerCase()}))` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-semibold ${style.colorClass} ${style.bgClass} px-2 py-0.5 rounded-full uppercase tracking-wider`}>
              {p.cat}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{p.c}</span>
          </div>
          <div className="text-sm font-semibold text-foreground leading-tight">{p.n}</div>
        </div>

        <div className="flex gap-4 flex-shrink-0 items-center">
          <StockPill value={p.cuc} label="Cúcuta" />
          <StockPill value={p.baq} label="B/quilla" />
          {hasNav && (
            <div className="bg-transit-bg border border-transit-border rounded-lg px-2.5 py-1 text-center">
              <div className="text-xs font-bold text-transit-value font-mono">
                {(p.d1 + p.d2).toLocaleString("es-CO", { maximumFractionDigits: 1 })}
              </div>
              <div className="text-[10px] text-transit-label">En tránsito</div>
            </div>
          )}
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
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-slide-in">
          {/* Stock */}
          <div className={`${style.bgClass} rounded-[10px] p-3`}>
            <div className={`text-[10px] font-bold ${style.colorClass} mb-2 uppercase tracking-widest`}>📦 Stock en Bodega</div>
            <div className="flex justify-between">
              <div>
                <div className="text-lg font-extrabold text-foreground font-mono">{fmt(p.cuc)}</div>
                <div className="text-[11px] text-muted-foreground">Cúcuta · {p.u}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground font-mono">{fmt(p.baq)}</div>
                <div className="text-[11px] text-muted-foreground">B/quilla · {p.u}</div>
              </div>
            </div>
            {totalBodega > 0 && (
              <div className={`mt-2 pt-2 border-t border-border/30`}>
                <span className={`text-[11px] ${style.colorClass} font-semibold`}>
                  Total: {totalBodega.toLocaleString("es-CO", { maximumFractionDigits: 1 })} {p.u}
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          {hasNav ? (
            <div className="bg-transit-bg rounded-[10px] p-3">
              <div className="text-[10px] font-bold text-transit-value mb-2 uppercase tracking-widest">🚢 Próximas Llegadas</div>
              {p.d1 > 0 && (
                <div className="mb-2">
                  <span className="text-[11px] text-transit-label font-semibold">Disp. 1 — más próximo</span>
                  <div className="text-lg font-extrabold text-transit-value font-mono">
                    {fmt(p.d1)} <span className="text-xs font-normal">{p.u}</span>
                  </div>
                  {p.eta1 && <div className="text-[11px] text-transit-label mt-0.5">📅 ETA: {p.eta1}</div>}
                </div>
              )}
              {p.d2 > 0 && (
                <div className={p.d1 > 0 ? "border-t border-transit-border pt-2" : ""}>
                  <span className="text-[11px] text-transit-label font-semibold">Disp. 2 — siguiente</span>
                  <div className="text-lg font-extrabold text-transit-value font-mono">
                    {fmt(p.d2)} <span className="text-xs font-normal">{p.u}</span>
                  </div>
                  {p.eta2 && <div className="text-[11px] text-transit-label mt-0.5">📅 ETA: {p.eta2}</div>}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-accent rounded-[10px] p-3 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Sin material en tránsito</span>
            </div>
          )}

          {/* Reservas */}
          {isVendedor && hasReservas && (
            <div className="bg-reserved-bg rounded-[10px] p-3">
              <div className="text-[10px] font-bold text-reserved-value mb-2 uppercase tracking-widest">🔒 Reservas Activas</div>
              <div className="text-lg font-extrabold text-reserved-value font-mono">
                {fmt(p.res)} <span className="text-xs font-normal text-reserved-label">{p.u}</span>
              </div>
              <div className="text-[11px] text-reserved-label mt-1">Material bloqueado para clientes</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function StockPill({ value, label }: { value: number; label: string }) {
  if (!value || value <= 0) {
    return (
      <div className="text-center">
        <div className="text-[11px] text-muted-foreground font-mono">—</div>
        <div className="text-[10px] text-muted mt-0.5">{label}</div>
      </div>
    );
  }
  return (
    <div className="text-center">
      <div className="text-sm font-bold text-foreground font-mono">
        {value.toLocaleString("es-CO", { maximumFractionDigits: 1 })}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

export default ProductCard;
