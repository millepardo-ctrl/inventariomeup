import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Product, CAT_KEY_MAP, fmt } from "@/data/products";
import EstadoBadge from "@/components/inventory/EstadoBadge";

interface ProductCardProps {
  product: Product;
  isVendedor: boolean;
  isDistribuidor?: boolean;
}

const ProductCard = ({ product: p, isVendedor, isDistribuidor }: ProductCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const catKey = CAT_KEY_MAP[p.cat];
  const hasNav = p.d1 > 0 || p.d2 > 0;
  const hasReservas = isVendedor && p.res > 0;
  const hasPreRes = isVendedor && p.pre_res > 0;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`bg-card border border-border rounded-xl cursor-pointer transition-all duration-150 overflow-hidden ${
        expanded ? "shadow-lg" : "shadow-sm hover:shadow-md"
      }`}
      style={{ borderLeftWidth: 4, borderLeftColor: `hsl(var(--cat-${catKey}))` }}
    >
      {/* Collapsed Row */}
      <div className="flex items-center gap-2.5 px-3.5 py-3 flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span
              className="text-[10px] font-bold px-1.5 py-px rounded-full uppercase tracking-wider whitespace-nowrap"
              style={{
                backgroundColor: `hsl(var(--cat-${catKey}-bg))`,
                color: `hsl(var(--cat-${catKey}-label))`,
              }}
            >
              {p.cat}
            </span>
            {!isDistribuidor && <span className="text-[10px] text-muted-foreground font-mono">{p.c}</span>}
          </div>
          <div className="text-[13px] font-semibold text-foreground leading-tight">{p.n}</div>
        </div>

        {/* Disp B/quilla */}
        <div
          className="rounded-lg px-2.5 py-1.5 text-center min-w-[70px]"
          style={{
            backgroundColor: p.disp_baq > 0 ? `hsl(var(--disp-baq-bg))` : undefined,
            borderWidth: 1,
            borderColor: p.disp_baq > 0 ? `hsl(var(--disp-baq-border))` : `hsl(var(--border))`,
          }}
        >
          <div className="text-[15px] font-extrabold font-mono text-[hsl(var(--disp-baq-value))]">
            {fmt(p.disp_baq)}
          </div>
          <div className="text-[10px] text-[hsl(var(--disp-baq-label))]">🟡 B/quilla</div>
        </div>

        {/* Disp Cúcuta */}
        <div className="text-center min-w-[58px]">
          <div className="text-sm font-bold font-mono text-foreground">
            {fmt(p.disp_cuc)}
          </div>
          <div className="text-[10px] text-muted-foreground">⚪ Cúcuta</div>
        </div>

        {/* Disp 1 pill - Teal */}
        {p.d1 > 0 && (
          <div className="bg-[hsl(var(--disp1-bg))] border border-[hsl(var(--disp1-border))] rounded-lg px-2.5 py-1 text-center min-w-[68px]">
            <div className="text-[13px] font-bold text-[hsl(var(--disp1-value))] font-mono">
              {fmt(p.d1)}
            </div>
            <div className="text-[9px] text-[hsl(var(--disp1-label))]">
              🟢 Disp.1{p.eta1 ? ` · ${p.eta1}` : ""}
            </div>
          </div>
        )}

        {/* Disp 2 pill */}
        {p.d2 > 0 && (
          <div className="bg-transit-bg border border-transit-border rounded-lg px-2.5 py-1 text-center min-w-[68px]">
            <div className="text-[13px] font-bold text-transit-value font-mono">
              {fmt(p.d2)}
            </div>
            <div className="text-[9px] text-transit-label">
              🔵 Disp.2{p.eta2 ? ` · ${p.eta2}` : ""}
            </div>
          </div>
        )}

        {/* Reservas */}
        {hasReservas && (
          <div className="bg-reserved-bg border border-reserved-border rounded-lg px-2.5 py-1 text-center min-w-[62px]">
            <div className="text-[13px] font-bold text-reserved-value font-mono">{fmt(p.res)}</div>
            <div className="text-[9px] text-reserved-label">🔒 Reservas</div>
          </div>
        )}

        {/* Pre-reserva */}
        {hasPreRes && (
          <div className="bg-[hsl(var(--prereserved-bg))] border border-[hsl(var(--prereserved-border))] rounded-lg px-2.5 py-1 text-center min-w-[62px]">
            <div className="text-[13px] font-bold text-[hsl(var(--prereserved-value))] font-mono">{fmt(p.pre_res)}</div>
            <div className="text-[9px] text-[hsl(var(--prereserved-label))]">🔮 Pre-res.</div>
          </div>
        )}

        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-3.5 pb-3.5 pt-0">
          <div
            className="p-3.5 rounded-[10px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 animate-fade-slide-in"
            style={{ backgroundColor: `hsl(var(--cat-${catKey}-bg))` }}
          >
            {/* Disp B/quilla */}
            <div className="bg-card rounded-[9px] p-3 shadow-sm">
              <div className="text-[10px] font-bold text-[hsl(var(--disp-baq-value))] uppercase tracking-widest mb-1.5">
                🟡 Disponible B/quilla
              </div>
              <div className="text-2xl font-black font-mono" style={{ color: p.disp_baq > 0 ? `hsl(var(--disp-baq-value))` : `hsl(var(--muted-foreground))` }}>
                {fmt(p.disp_baq)}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{p.u} disponibles</div>
              {p.stock_baq !== p.disp_baq && (
                <div className="text-[10px] text-muted-foreground mt-1">Stock físico: {fmt(p.stock_baq)} {p.u}</div>
              )}
            </div>

            {/* Disp Cúcuta */}
            <div className="bg-card rounded-[9px] p-3 shadow-sm">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">⚪ Disponible Cúcuta</div>
              <div className={`text-2xl font-black font-mono ${p.disp_cuc > 0 ? "text-muted-foreground" : "text-muted"}`}>
                {fmt(p.disp_cuc)}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{p.u} disponibles</div>
              {p.stock_cuc !== p.disp_cuc && (
                <div className="text-[10px] text-muted-foreground mt-1">Stock físico: {fmt(p.stock_cuc)} {p.u}</div>
              )}
            </div>

            {/* Disp 1 - Teal */}
            {p.d1 > 0 && (
              <div className="bg-card rounded-[9px] p-3 shadow-sm">
                <div className="text-[10px] font-bold text-[hsl(var(--disp1-value))] uppercase tracking-widest mb-1.5">🟢 Próximo Cont.</div>
                <div className="text-2xl font-black text-[hsl(var(--disp1-value))] font-mono">{fmt(p.d1)}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{p.u}</div>
                {p.eta1 && <div className="text-[10px] text-[hsl(var(--disp1-label))] mt-1">📅 ETA: {p.eta1}</div>}
                {p.est1 && <div className="mt-1.5"><EstadoBadge estado={p.est1} /></div>}
                {p.arrivals1 && p.arrivals1.length > 1 && (
                  <div className="mt-2 pt-2 border-t border-border/60 space-y-1">
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Más contenedores</div>
                    {p.arrivals1.slice(1).map((a, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="text-[hsl(var(--disp1-label))]">📅 {a.eta || "—"}</span>
                        <span className="font-mono font-bold text-[hsl(var(--disp1-value))]">{fmt(a.qty)} {p.u}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Disp 2 */}
            {p.d2 > 0 && (
              <div className="bg-card rounded-[9px] p-3 shadow-sm">
                <div className="text-[10px] font-bold text-transit-value uppercase tracking-widest mb-1.5">🔵 Siguiente Cont 2</div>
                <div className="text-2xl font-black text-transit-value font-mono">{fmt(p.d2)}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{p.u}</div>
                {p.eta2 && <div className="text-[10px] text-transit-label mt-1">📅 ETA: {p.eta2}</div>}
                {p.est2 && <div className="mt-1.5"><EstadoBadge estado={p.est2} /></div>}
                {p.arrivals2 && p.arrivals2.length > 1 && (
                  <div className="mt-2 pt-2 border-t border-border/60 space-y-1">
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Más contenedores</div>
                    {p.arrivals2.slice(1).map((a, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="text-transit-label">📅 {a.eta || "—"}</span>
                        <span className="font-mono font-bold text-transit-value">{fmt(a.qty)} {p.u}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!hasNav && (
              <div className="bg-card rounded-[9px] p-3 flex items-center justify-center opacity-60">
                <span className="text-xs text-muted-foreground">Sin material en tránsito</span>
              </div>
            )}

            {/* Reservas */}
            {hasReservas && (
              <div className="bg-card rounded-[9px] p-3 shadow-sm">
                <div className="text-[10px] font-bold text-reserved-value uppercase tracking-widest mb-1.5">🔒 Reservas Activas</div>
                <div className="text-2xl font-black text-reserved-value font-mono">{fmt(p.res)}</div>
                <div className="text-[11px] text-reserved-label mt-0.5">Material bloqueado para clientes</div>
              </div>
            )}

            {/* Pre-reserva */}
            {hasPreRes && (
              <div className="bg-card rounded-[9px] p-3 shadow-sm">
                <div className="text-[10px] font-bold text-[hsl(var(--prereserved-value))] uppercase tracking-widest mb-1.5">🔮 Pre-Reserva en Tránsito</div>
                <div className="text-2xl font-black text-[hsl(var(--prereserved-value))] font-mono">{fmt(p.pre_res)}</div>
                <div className="text-[11px] text-[hsl(var(--prereserved-label))] mt-0.5">Comprometido sobre contenedor</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
