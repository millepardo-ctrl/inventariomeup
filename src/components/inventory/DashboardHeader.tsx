import { AppUser } from "@/data/products";
import MeUpLogo from "@/components/inventory/MeUpLogo";

interface DashboardHeaderProps {
  user: AppUser;
  onLogout: () => void;
}

const DashboardHeader = ({ user, onLogout }: DashboardHeaderProps) => {
  const isVendedor = user.type === "vendedor";

  return (
    <header className="bg-header sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="max-w-[1300px] mx-auto flex items-center gap-4 px-5 h-[58px]">
        <div className="bg-card rounded-lg px-2.5 py-1 flex items-center">
          <MeUpLogo className="h-7" />
        </div>
        <div className="h-7 w-px bg-secondary" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Inventario en Tiempo Real</span>

        <div className="flex-1" />

        {/* Role badge */}
        <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
          isVendedor
            ? "bg-[hsl(213,50%,25%)] text-primary border-primary/25"
            : "bg-[hsl(24,10%,11%)] text-[hsl(30,5%,64%)] border-[hsl(20,6%,26%)]"
        }`}>
          {isVendedor ? "👤 Vendedor" : `🏪 ${user.name}`}
        </div>

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

        {/* Logout for distributors */}
        {!isVendedor && (
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 bg-transparent border border-secondary rounded-[9px] text-muted-foreground text-xs font-semibold cursor-pointer hover:text-header-foreground transition-colors"
          >
            Salir
          </button>
        )}

        <span className="text-[11px] text-muted-foreground hidden sm:inline">26 Feb 2026</span>
      </div>
    </header>
  );
};

export default DashboardHeader;
