import { useState } from "react";
import { AppUser } from "@/data/products";
import RoleSelection from "@/components/inventory/RoleSelection";
import LoginScreen from "@/components/inventory/LoginScreen";
import Dashboard from "@/components/inventory/Dashboard";
import { useGoogleSheetProducts } from "@/hooks/useGoogleSheetProducts";
import logoMeup from "@/assets/logo-meup.png";

const Index = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const { products, loading, error } = useGoogleSheetProducts();

  if (!user && !showLogin) {
    return (
      <RoleSelection
        onSelectVendedor={() => setUser({ type: "vendedor", name: "Equipo MeUp" })}
        onSelectDistribuidor={() => setShowLogin(true)}
      />
    );
  }

  if (showLogin && !user) {
    return (
      <LoginScreen
        onLogin={(u) => {
          setUser(u);
          setShowLogin(false);
        }}
      />
    );
  }

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

  return (
    <Dashboard
      user={user!}
      products={products}
      onLogout={() => {
        setUser(null);
        setShowLogin(false);
      }}
    />
  );
};

export default Index;
