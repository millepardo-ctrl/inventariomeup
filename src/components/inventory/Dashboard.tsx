import { useState, useMemo } from "react";
import { PRODUCTS, CATEGORIES, CAT_KEY_MAP, AppUser, type Category } from "@/data/products";
import DashboardHeader from "@/components/inventory/DashboardHeader";
import KpiBar from "@/components/inventory/KpiBar";
import ProductCard from "@/components/inventory/ProductCard";
import { Search, X } from "lucide-react";

interface DashboardProps {
  user: AppUser;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<"Todos" | Category>("Todos");
  const [filterStock, setFilterStock] = useState(false);
  const [filterNav, setFilterNav] = useState(false);
  const isVendedor = user.type === "vendedor";

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    if (cat !== "Todos" && p.cat !== cat) return false;
    if (filterStock && (p.baq + p.cuc) <= 0) return false;
    if (filterNav && (p.d1 + p.d2) <= 0) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.n.toLowerCase().includes(q) || p.c.includes(q) || p.cat.toLowerCase().includes(q);
    }
    return true;
  }), [search, cat, filterStock, filterNav]);

  const hasFilters = filterStock || filterNav || cat !== "Todos" || search;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={onLogout} />

      <div className="max-w-[1300px] mx-auto px-5 py-6">
        <KpiBar isVendedor={isVendedor} />

        {/* Filters */}
        <div className="flex gap-2.5 mb-4 flex-wrap items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o código..."
              className="w-full py-2.5 pl-9 pr-3 border border-border rounded-[10px] text-[13px] font-sans outline-none bg-card text-foreground focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>

          {/* Category tabs */}
          {CATEGORIES.map(c => {
            const active = cat === c;
            const catKey = c !== "Todos" ? CAT_KEY_MAP[c as Category] : null;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="px-3 py-2 rounded-[9px] text-[11px] font-bold cursor-pointer border transition-all uppercase tracking-wider"
                style={{
                  borderColor: active && catKey ? `hsl(var(--cat-${catKey}))` : active ? `hsl(var(--primary))` : `hsl(var(--border))`,
                  backgroundColor: active && catKey ? `hsl(var(--cat-${catKey}-bg))` : active ? `hsl(var(--cat-marmol-bg))` : `hsl(var(--card))`,
                  color: active && catKey ? `hsl(var(--cat-${catKey}-label))` : active ? `hsl(var(--primary))` : `hsl(var(--muted-foreground))`,
                }}
              >
                {c}
              </button>
            );
          })}

          {/* Quick filters */}
          <button
            onClick={() => setFilterStock(!filterStock)}
            className={`px-3 py-2 rounded-[9px] text-[11px] font-bold cursor-pointer border transition-all ${
              filterStock ? "border-primary bg-transit-bg text-transit-value" : "border-border bg-card text-muted-foreground"
            }`}
          >
            Con stock
          </button>
          <button
            onClick={() => setFilterNav(!filterNav)}
            className={`px-3 py-2 rounded-[9px] text-[11px] font-bold cursor-pointer border transition-all ${
              filterNav ? "border-primary bg-transit-bg text-transit-value" : "border-border bg-card text-muted-foreground"
            }`}
          >
            🚢 En tránsito
          </button>

          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setCat("Todos"); setFilterStock(false); setFilterNav(false); }}
              className="px-3 py-2 rounded-[9px] text-[11px] font-semibold cursor-pointer border border-destructive/20 bg-destructive/5 text-destructive flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>

        <div className="text-xs text-muted-foreground mb-3">{filtered.length} referencias</div>

        {/* Product list */}
        <div className="flex flex-col gap-2">
          {filtered.map(p => (
            <ProductCard key={p.c + p.cat} product={p} isVendedor={isVendedor} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-3xl mb-3">🔍</div>
              <div className="text-[15px] font-semibold">Sin resultados</div>
              <div className="text-[13px] mt-1">Prueba con otro término o categoría</div>
            </div>
          )}
        </div>

        {/* Distributor footer */}
        {!isVendedor && (
          <div className="mt-7 p-4 bg-card rounded-xl border border-border text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">¿Quieres reservar material?</strong> Contacta a tu asesor MeUp con el código del producto y la cantidad.
            Las fechas ETA son estimadas. Disp. 1 = primer contenedor en llegar · Disp. 2 = siguiente.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
