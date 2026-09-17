import { useAuth } from "@/contexts/AuthContext";
import meupLogo from "@/assets/logo-meup.png";
import { LogOut, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onNavigate: (view: string) => void;
}

const ASESOR_PHRASES = [
  "Barranquilla y Cúcuta listos para despachar. ¡A cerrar!",
  "La cima se alcanza construyendo, incluso cuando empezamos colocando la primera piedra.",
  "Hoy es un buen día para cerrar una gran cotización.",
  "Una buena oferta empieza con la referencia exacta.",
  "Tu asesoría convierte materiales en espacios únicos.",
];
const BODEGA_PHRASES = [
  "El almacén habla cuando el inventario está al día.",
  "Cada muestra despachada a tiempo, un cliente satisfecho.",
  "Hoy es un buen día para tener todo en orden.",
  "Barranquilla lista para operar. Que fluya el stock.",
];

const WelcomeScreen = ({ onNavigate }: WelcomeScreenProps) => {
  const { user, logout } = useAuth();
  const isBodega = user?.rol === "bodega";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";
  const phrases = isBodega ? BODEGA_PHRASES : ASESOR_PHRASES;
  const phrase = phrases[hour % phrases.length];

  return (
    <div className="min-h-screen bg-[hsl(var(--landing-bg))] flex flex-col relative overflow-hidden">
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-180px] right-[-120px] w-[520px] h-[520px] rounded-full bg-[hsl(160,70%,40%)]/10 blur-[120px]" />

      {/* Header */}
      <header className="relative z-10 bg-header/90 backdrop-blur sticky top-0 shadow-[0_1px_0_rgba(255,255,255,0.07)] h-[58px] flex items-center px-4 sm:px-5 gap-3 sm:gap-4">
        <div className="bg-card rounded-lg px-2.5 py-1">
          <img src={meupLogo} alt="MeUp" className="h-7" />
        </div>
        <div className="h-7 w-px bg-header-foreground/15" />
        <span className="text-xs text-header-foreground/60 uppercase tracking-wider hidden sm:inline">
          {isBodega ? "Portal Bodega" : "Portal Asesores"}
        </span>
        <div className="flex-1" />
        <div
          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
            isBodega
              ? "bg-[hsl(150,55%,16%)] text-[hsl(150,70%,72%)] border-[hsl(150,60%,32%)]"
              : "bg-[hsl(213,50%,22%)] text-[hsl(213,90%,78%)] border-primary/40"
          }`}
        >
          {isBodega ? "Bodega" : "Vendedor"}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-header-foreground/20 rounded-[9px] text-header-foreground/70 text-xs font-semibold hover:text-header-foreground hover:border-header-foreground/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-5 py-12 sm:py-16">
        <div className="text-center max-w-xl mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[hsl(213,90%,80%)] mb-4">
            <Sparkles className="w-3 h-3" />
            {greeting}
          </span>
          <h1 className="text-[28px] sm:text-[44px] font-extrabold tracking-tight text-header-foreground leading-[1.1] mb-4">
            Hola,{" "}
            <span className="bg-gradient-to-r from-[hsl(213,95%,72%)] to-[hsl(160,70%,58%)] bg-clip-text text-transparent">
              {user?.nombre || "Asesor"}
            </span>
          </h1>
          <p className="text-[13.5px] sm:text-[15px] text-header-foreground/70 leading-relaxed italic px-2">
            “{phrase}”
          </p>
        </div>

        <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-header-foreground mb-5">
          ¿Qué deseas hacer hoy?
        </p>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full ${isBodega ? "max-w-[440px]" : "max-w-[560px]"}`}>
          <TileButton
            accent="213 95% 62%"
            emoji={isBodega ? "🏭" : "🔍"}
            label={isBodega ? "Vista Bodega" : "Consultar inventario"}
            description={isBodega ? "Pedidos, despachos y control de stock" : "Disponibilidad en BAQ · CUC · En tránsito"}
            onClick={() => onNavigate(isBodega ? "bodega" : "inventario")}
          />

          <TileButton
            accent="160 70% 52%"
            emoji="📦"
            label="Solicitar muestra"
            description="Pide muestras por referencia al almacén"
            onClick={() => onNavigate("muestras")}
          />

          {!isBodega && (
            <TileButton
              accent="280 75% 68%"
              emoji="⚡"
              label="Motor de Oferta"
              description="Calcula precios, márgenes y descuentos"
              onClick={() => onNavigate("ofertas")}
            />
          )}

          {!isBodega && (
            <TileButton
              accent="32 92% 62%"
              emoji="💬"
              label="Asistente oferta"
              description="Cotiza por chat con IA · Sube el RUT y listo"
              onClick={() => onNavigate("asistente")}
              badge="Nuevo"
            />
          )}
        </div>
      </main>
    </div>
  );
};

interface TileButtonProps {
  accent: string;
  emoji: string;
  label: string;
  description: string;
  onClick: () => void;
  badge?: string;
}

const TileButton = ({ accent, emoji, label, description, onClick, badge }: TileButtonProps) => (
  <button
    onClick={onClick}
    style={{ ["--tile" as string]: accent }}
    className="group relative overflow-hidden text-left rounded-2xl p-5 min-h-[132px] sm:min-h-[156px] flex flex-col gap-2.5
      bg-[hsl(var(--landing-card))] border border-[hsl(var(--tile)/0.22)]
      transition-all duration-200 hover:-translate-y-1 hover:border-[hsl(var(--tile)/0.55)]
      hover:shadow-[0_16px_40px_-12px_hsl(var(--tile)/0.45)]
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--tile)/0.7)]"
  >
    <div className="absolute inset-x-0 top-0 h-[3px] bg-[hsl(var(--tile))] opacity-60 group-hover:opacity-100 transition-opacity" />
    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[hsl(var(--tile)/0.12)] opacity-0 group-hover:opacity-100 transition-opacity" />

    {badge && (
      <span className="absolute top-3.5 right-3.5 text-[9.5px] font-bold uppercase tracking-wider px-2 py-[3px] rounded-full bg-[hsl(var(--tile)/0.18)] text-[hsl(var(--tile))] border border-[hsl(var(--tile)/0.4)]">
        {badge}
      </span>
    )}

    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(var(--tile)/0.14)] border border-[hsl(var(--tile)/0.35)] text-[22px] leading-none group-hover:scale-110 transition-transform">
      <span aria-hidden>{emoji}</span>
    </div>

    <span className="text-[15px] font-bold text-header-foreground tracking-tight leading-tight">{label}</span>
    <span className="text-[12px] text-header-foreground/60 leading-relaxed mt-auto">{description}</span>
  </button>
);

export default WelcomeScreen;
