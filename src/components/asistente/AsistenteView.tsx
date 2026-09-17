import meupLogo from "@/assets/logo-meup.png";
import { ArrowLeft } from "lucide-react";

interface AsistenteViewProps {
  onBack: () => void;
  asesorNombre?: string;
}

const AsistenteView = ({ onBack, asesorNombre }: AsistenteViewProps) => {
  return (
    <div className="min-h-screen bg-[hsl(var(--landing-bg))] flex flex-col">
      {/* Header */}
      <header className="bg-header sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)] h-[58px] flex items-center px-5 gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[9px] border border-secondary bg-transparent text-muted-foreground text-xs font-semibold hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Portal
        </button>
        <div className="bg-card rounded-lg px-2.5 py-1">
          <img src={meupLogo} alt="MeUp" className="h-7" />
        </div>
        <div className="h-7 w-px bg-secondary" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider hidden sm:inline">
          Asistente de Cotización
        </span>
        <div className="flex-1" />
        <div className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border bg-[hsl(32,60%,14%)] text-[hsl(38,90%,68%)] border-[hsl(32,80%,28%)]">
          💬 Asistente IA
        </div>
      </header>

      {/* Placeholder content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[hsl(32,80%,12%)] border border-[hsl(32,85%,35%)] flex items-center justify-center text-4xl mb-6">
          💬
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-3">
          Asistente de Cotización
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-2">
          El mismo flujo del bot de Telegram, ahora en el portal web.
        </p>
        <p className="text-xs text-muted-foreground/60 max-w-xs leading-relaxed">
          Sube el RUT del cliente, escribe los materiales y el asistente genera la cotización en Symphony.
        </p>
        <div className="mt-10 px-4 py-2 rounded-lg bg-[hsl(var(--landing-card))] border border-[hsl(215,25%,24%)] text-xs text-muted-foreground/70">
          🚧 En construcción — próximamente disponible
        </div>
      </main>
    </div>
  );
};

export default AsistenteView;
