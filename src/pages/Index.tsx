import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/inventory/Dashboard";
import BodegaView from "@/components/bodega/BodegaView";
import MuestrasPanel from "@/components/muestras/MuestrasPanel";
import OfertasView from "@/components/ofertas/OfertasView";
import WelcomeScreen from "@/components/inventory/WelcomeScreen";
import AsistenteView from "@/components/asistente/AsistenteView";
import { useGoogleSheetProducts } from "@/hooks/useGoogleSheetProducts";
import logoMeup from "@/assets/logo-meup.png";

type View = "welcome" | "inventario" | "bodega" | "muestras" | "ofertas" | "asistente";

const Index = () => {
  const { user, logout, isAdmin } = useAuth();
  const { products, loading, refreshing, error, lastUpdated, refresh } = useGoogleSheetProducts();
  const isBodega = user?.rol === "bodega";

  // distributors go straight to inventory; asesor/bodega see the hub first
  const [view, setView] = useState<View>(
    user?.rol === "distribuidor" ? "inventario" : "welcome"
  );

  const goHome = () => setView("welcome");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <img src={logoMeup} alt="MeUp" className="h-10 mb-2 opacity-80" />
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground font-medium">Cargando inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-3xl">⚠️</div>
        <p className="text-sm text-destructive font-semibold">Error al cargar datos. Intenta recargar.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
        >
          Recargar
        </button>
      </div>
    );
  }

  // Welcome hub (asesor + bodega)
  if (view === "welcome") {
    return <WelcomeScreen onNavigate={(v) => setView(v as View)} />;
  }

  // Bodega view — accessible by admin (from header) and bodega role
  if (view === "bodega" && (isAdmin || isBodega)) {
    return <BodegaView onBack={goHome} isAdmin={isAdmin} />;
  }

  // Muestras — admin and bodega
  if (view === "muestras" && (isAdmin || isBodega)) {
    return <MuestrasPanel onBack={goHome} asesorPreset={user!.nombre} />;
  }

  // Ofertas — admin only
  if (view === "ofertas" && isAdmin) {
    return <OfertasView onBack={goHome} />;
  }

  // Asistente — admin only
  if (view === "asistente" && isAdmin) {
    return <AsistenteView onBack={goHome} asesorNombre={user!.nombre} />;
  }

  const appUser = {
    type: isAdmin ? "vendedor" as const : "distribuidor" as const,
    name: user!.nombre,
    email: user!.email,
  };

  return (
    <Dashboard
      user={appUser}
      products={products}
      refreshing={refreshing}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
      onLogout={logout}
      onGoHome={isAdmin ? goHome : undefined}
      onOpenBodega={isAdmin ? () => setView("bodega") : undefined}
      onOpenMuestras={isAdmin ? () => setView("muestras") : undefined}
      onOpenOfertas={isAdmin ? () => setView("ofertas") : undefined}
    />
  );
};

export default Index;
