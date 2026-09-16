interface OfertasViewProps {
  onBack: () => void;
}

const MOTOR_URL = "https://1e71f96d-8cdd-476f-9c56-0730ee3fbac3.lovable.app";

const OfertasView = ({ onBack }: OfertasViewProps) => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center gap-3 px-4 h-[58px] bg-header shadow-[0_1px_0_rgba(255,255,255,0.06)] shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] border border-border bg-card text-xs text-muted-foreground font-medium hover:text-foreground transition-colors"
        >
          ← Volver
        </button>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Motor de Ofertas</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-5xl">💼</div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Motor de Ofertas</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Genera ofertas comerciales con precios, márgenes y transporte incluidos.
          </p>
        </div>
        <a
          href={MOTOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-[hsl(280,60%,18%)] border border-[hsl(280,60%,35%)] rounded-[9px] text-[hsl(280,80%,78%)] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Abrir Motor de Ofertas ↗
        </a>
      </div>
    </div>
  );
};

export default OfertasView;
