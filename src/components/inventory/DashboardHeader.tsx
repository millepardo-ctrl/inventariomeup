import { AppUser } from "@/data/products";
import meupLogo from "@/assets/logo-meup.png";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  user: AppUser;
  onLogout: () => void;
  refreshing?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
}

const DashboardHeader = ({ user, onLogout, refreshing, lastUpdated, onRefresh }: DashboardHeaderProps) => {
  const isVendedor = user.type === "vendedor";
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false })
    : null;

  return (
    <header className="bg-header sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="max-w-[1400px] mx-auto flex items-center gap-4 px-5 h-[58px]">
        <div className="bg-card rounded-lg px-2.5 py-1 flex items-center">
          <img src={meupLogo} alt="MeUp" className="h-7" />
        </div>
        <div className="h-7 w-px bg-secondary" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider hidden sm:inline">Inventario en Tiempo Real</span>

        <div className="flex-1" />

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[9px] border border-border bg-card text-xs text-muted-foreground font-medium hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Actualizando..." : timeStr ? `Actualizado ${timeStr}` : "Actualizar"}
          </button>
        )}

        {/* Google Sheet link for vendedor */}
        {isVendedor && (
          <a
            href="https://docs.google.com/spreadsheets"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[hsl(143,64%,24%)] border border-[hsl(142,71%,45%,0.25)] rounded-[9px] text-[hsl(142,69%,58%)] text-xs font-semibold no-underline hover:opacity-90 transition-opacity"
          >
            📊 Abrir Google Sheet
          </a>
        )}

        {/* Greeting + Role badge */}
        {!isVendedor && (
          <span className="text-sm text-foreground font-semibold hidden sm:inline">
            👋 Hola, <span className="capitalize">{extractCompany(user.email)}</span>
          </span>
        )}
        <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
          isVendedor
            ? "bg-[hsl(213,50%,25%)] text-primary border-primary/25"
            : "bg-[hsl(24,10%,11%)] text-[hsl(30,5%,64%)] border-[hsl(20,6%,26%)]"
        }`}>
          {isVendedor ? "👤 Vendedor" : `🏪 ${extractCompany(user.email)}`}
        </div>

        {/* Logout for distributors */}
        {!isVendedor && (
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 bg-transparent border border-secondary rounded-[9px] text-muted-foreground text-xs font-semibold cursor-pointer hover:text-header-foreground transition-colors"
          >
            Salir
          </button>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
