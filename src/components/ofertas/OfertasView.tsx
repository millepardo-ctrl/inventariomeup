interface OfertasViewProps {
  onBack: () => void;
}

const MOTOR_URL = "https://1e71f96d-8cdd-476f-9c56-0730ee3fbac3.lovable.app";

const OfertasView = ({ onBack }: OfertasViewProps) => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center gap-3 px-4 h-[46px] bg-header shadow-[0_1px_0_rgba(255,255,255,0.06)] shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] border border-border bg-card text-xs text-muted-foreground font-medium hover:text-foreground transition-colors"
        >
          ← Volver
        </button>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Motor de Ofertas</span>
      </div>
      <iframe
        src={MOTOR_URL}
        className="flex-1 w-full border-none"
        title="Motor de Ofertas MeUp"
        allow="clipboard-write"
      />
    </div>
  );
};

export default OfertasView;
