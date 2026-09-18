import { ArrowLeft, ExternalLink } from "lucide-react";
import meupLogo from "@/assets/logo-meup.png";

const MOTOR_URL = "https://meup-motor-de-ofertas.lovable.app";

interface MotorOfertasEmbedProps {
  onBack: () => void;
}

const MotorOfertasEmbed = ({ onBack }: MotorOfertasEmbedProps) => (
  <div className="min-h-screen flex flex-col bg-background">
    <header className="bg-header sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="max-w-[1400px] mx-auto flex items-center gap-3 px-4 sm:px-5 h-[58px]">
        <div className="bg-card rounded-lg px-2.5 py-1 flex items-center">
          <img src={meupLogo} alt="MeUp" className="h-7" />
        </div>
        <div className="h-7 w-px bg-header-foreground/15" />
        <span className="text-xs text-header-foreground/60 uppercase tracking-wider hidden sm:inline">
          Motor de Oferta
        </span>
        <div className="flex-1" />
        <a
          href={MOTOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] border border-header-foreground/20 text-header-foreground/80 text-xs font-semibold hover:text-header-foreground transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Abrir aparte</span>
        </a>
        <button
          onClick={onBack}
          className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary/50 bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider shadow-[0_2px_12px_-4px_hsl(var(--primary)/0.6)] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Portal
        </button>
      </div>
    </header>

    <iframe
      src={MOTOR_URL}
      title="Motor de Oferta MeUp"
      className="flex-1 w-full border-0"
      allow="clipboard-write; clipboard-read"
    />
  </div>
);

export default MotorOfertasEmbed;
