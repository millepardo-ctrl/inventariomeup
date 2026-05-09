import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/inventory/Dashboard";
import BodegaView from "@/components/bodega/BodegaView";
import { useGoogleSheetProducts } from "@/hooks/useGoogleSheetProducts";
import logoMeup from "@/assets/logo-meup.png";

const Index = () => {
  const { user, logout, isAdmin } = useAuth();
  const { products, loading, refreshing, error, lastUpdated, refresh } = useGoogleSheetProducts();
  const [view, setView] = useState<"inventario" | "bodega">("inventario");

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

  // Map auth user to the AppUser interface used by Dashboard
  const appUser = {
    type: isAdmin ? "vendedor" as const : "distribuidor" as const,
    name: user!.nombre,
    email: user!.email,
  };

  if (view === "bodega" && isAdmin) {
    return <BodegaView onBack={() => setView("inventario")} isAdmin={isAdmin} />;
  }

  return (
    <Dashboard
      user={appUser}
      products={products}
      refreshing={refreshing}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
      onLogout={logout}
      onOpenBodega={isAdmin ? () => setView("bodega") : undefined}
    />
  );
};

export default Index;
