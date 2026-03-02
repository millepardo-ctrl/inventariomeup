interface InventoryHeaderProps {
  view: "vendedor" | "distribuidor";
  onViewChange: (view: "vendedor" | "distribuidor") => void;
}

const InventoryHeader = ({ view, onViewChange }: InventoryHeaderProps) => {
  return (
    <header className="bg-header sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[60px] px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-primary to-cat-splitface flex items-center justify-center text-base">
            🪨
          </div>
          <div>
            <div className="text-[15px] font-extrabold text-header-foreground tracking-tight">Stone Castle</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Inventario en Tiempo Real</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-header-muted rounded-[10px] p-[3px] gap-[2px]">
            {([
              { key: "vendedor" as const, label: "👤 Vendedor" },
              { key: "distribuidor" as const, label: "🏪 Distribuidor" },
            ]).map(v => (
              <button
                key={v.key}
                onClick={() => onViewChange(v.key)}
                className={`px-4 py-1.5 rounded-lg border-none cursor-pointer text-xs font-semibold transition-all duration-150 ${
                  view === v.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-muted-foreground hover:text-header-foreground"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">Actualizado: 26 Feb 2026</span>
        </div>
      </div>
    </header>
  );
};

export default InventoryHeader;
