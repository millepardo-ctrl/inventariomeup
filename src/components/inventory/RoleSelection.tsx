import meupLogo from "@/assets/logo-meup.png";

interface RoleSelectionProps {
  onSelectVendedor: () => void;
  onSelectDistribuidor: () => void;
}

const RoleSelection = ({ onSelectVendedor, onSelectDistribuidor }: RoleSelectionProps) => {
  return (
    <div className="min-h-screen bg-landing flex flex-col items-center justify-center p-5">
      <div className="bg-card rounded-2xl px-7 py-3.5 mb-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <MeUpLogo className="h-12" />
      </div>
      <h1 className="text-header-foreground text-[22px] font-extrabold mb-2 tracking-tight text-center">
        Portal de Inventario
      </h1>
      <p className="text-muted-foreground text-sm mb-10 text-center">
        Selecciona cómo quieres acceder
      </p>
      <div className="flex gap-4 flex-wrap justify-center max-w-[480px]">
        <button
          onClick={onSelectVendedor}
          className="flex-1 min-w-[200px] p-6 bg-gradient-to-br from-[hsl(213,50%,25%)] to-[hsl(224,76%,48%)] border border-primary/25 rounded-2xl text-left cursor-pointer shadow-[0_8px_32px_rgba(29,78,216,0.3)] hover:scale-[1.02] transition-transform"
        >
          <div className="text-3xl mb-2">👤</div>
          <div className="text-base font-extrabold text-header-foreground mb-1">Vendedor MeUp</div>
          <div className="text-xs text-primary/70 leading-relaxed">
            Acceso completo · Stock + reservas + navegación + alertas
          </div>
        </button>
        <button
          onClick={onSelectDistribuidor}
          className="flex-1 min-w-[200px] p-6 bg-gradient-to-br from-[hsl(24,10%,11%)] to-[hsl(20,6%,15%)] border border-[hsl(20,6%,26%)] rounded-2xl text-left cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <div className="text-3xl mb-2">🏪</div>
          <div className="text-base font-extrabold text-header-foreground mb-1">Distribuidor</div>
          <div className="text-xs text-[hsl(30,5%,64%)] leading-relaxed">
            Acceso con correo y contraseña · Stock disponible y tránsito
          </div>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
