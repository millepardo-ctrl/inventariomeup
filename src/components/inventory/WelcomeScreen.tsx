import { useAuth } from "@/contexts/AuthContext";
import meupLogo from "@/assets/logo-meup.png";

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
  const greeting = hour < 12 ? "¡Buenos días" : hour < 18 ? "¡Buenas tardes" : "¡Buenas noches";
  const phrases = isBodega ? BODEGA_PHRASES : ASESOR_PHRASES;
  const phrase = phrases[hour % phrases.length];

  return (
    <div className="min-h-screen bg-[hsl(var(--landing-bg))] flex flex-col">
      {/* Header */}
      <header className="bg-header sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)] h-[58px] flex items-center px-5 gap-4">
        <div className="bg-card rounded-lg px-2.5 py-1">
          <img src={meupLogo} alt="MeUp" className="h-7" />
        </div>
        <div className="h-7 w-px bg-secondary" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider hidden sm:inline">
          {isBodega ? "Portal Bodega" : "Portal Asesores"}
        </span>
        <div className="flex-1" />
        <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
          isBodega
            ? "bg-[hsl(150,55%,14%)] text-[hsl(150,70%,68%)] border-[hsl(150,60%,28%)]"
            : "bg-[hsl(213,50%,20%)] text-primary border-primary/25"
        }`}>
          {isBodega ? "🏭 Bodega" : "👤 Vendedor"}
        </div>
        <button
          onClick={logout}
          className="px-3.5 py-1.5 bg-transparent border border-secondary rounded-[9px] text-muted-foreground text-xs font-semibold hover:text-foreground transition-colors"
        >
          Salir
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <div className="text-center max-w-md mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80 mb-3">
            {greeting}!
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Hola, <span className="text-primary">{user?.nombre || "Asesor"}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{phrase}</p>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground/50 mb-4">
          ¿Qué deseas hacer hoy?
        </p>

        <div className={`grid grid-cols-2 gap-3 w-full ${isBodega ? "max-w-[420px]" : "max-w-[500px]"}`}>
          {/* Inventario */}
          <TileButton
            accent="hsl(224,76%,40%)"
            iconBg="hsl(224,76%,15%)"
            iconBorder="hsl(224,76%,30%)"
            icon="📦"
            label={isBodega ? "Vista Bodega" : "Consultar inventario"}
            description={isBodega ? "Pedidos, despachos y control de stock" : "Disponibilidad en BAQ · CUC · En tránsito"}
            onClick={() => onNavigate(isBodega ? "bodega" : "inventario")}
          />

          {/* Muestras */}
          <TileButton
            accent="hsl(160,70%,28%)"
            iconBg="hsl(160,60%,12%)"
            iconBorder="hsl(160,70%,28%)"
            icon="🎨"
            label="Solicitar muestra"
            description="Pide muestras por referencia al almacén"
            onClick={() => onNavigate("muestras")}
          />

          {/* Motor de Oferta — asesor only */}
          {!isBodega && (
            <TileButton
              accent="hsl(280,60%,32%)"
              iconBg="hsl(280,55%,14%)"
              iconBorder="hsl(280,60%,32%)"
              icon="⚡"
              label="Motor de Oferta"
              description="Calcula precios, márgenes y descuentos"
              onClick={() => onNavigate("ofertas")}
            />
          )}

          {/* Asistente — asesor only */}
          {!isBodega && (
            <TileButton
              accent="hsl(32,85%,35%)"
              iconBg="hsl(32,80%,12%)"
              iconBorder="hsl(32,85%,35%)"
              icon="💬"
              label="Asistente oferta"
              description="Cotiza por chat con IA · Sube el RUT y listo"
              onClick={() => onNavigate("asistente")}
              badge="NUEVO"
            />
          )}
        </div>
      </main>
    </div>
  );
};

interface TileButtonProps {
  accent: string;
  iconBg: string;
  iconBorder: string;
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
  badge?: string;
}

const TileButton = ({ accent, iconBg, iconBorder, icon, label, description, onClick, badge }: TileButtonProps) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden bg-[hsl(var(--landing-card))] border border-[hsl(215,25%,24%)] rounded-2xl p-5 flex flex-col gap-2 min-h-[148px] text-left transition-all duration-150 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] active:translate-y-0"
    style={{ "--tile-accent": accent } as React.CSSProperties}
  >
    <div
      className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-50 group-hover:opacity-100 transition-opacity"
      style={{ background: accent }}
    />
    {badge && (
      <span
        className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-[7px] py-[2px] rounded"
        style={{ color: "hsl(38,90%,68%)", background: iconBg, border: `1px solid ${iconBorder}` }}
      >
        {badge}
      </span>
    )}
    <div
      className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0 transition-colors"
      style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
    >
      {icon}
    </div>
    <span className="text-sm font-bold text-foreground tracking-tight leading-tight text-wrap-balance">
      {label}
    </span>
    <span className="text-[11.5px] text-muted-foreground leading-relaxed mt-auto">
      {description}
    </span>
  </button>
);

export default WelcomeScreen;
