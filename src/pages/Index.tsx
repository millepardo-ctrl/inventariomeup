import { useState } from "react";
import { AppUser } from "@/data/products";
import RoleSelection from "@/components/inventory/RoleSelection";
import LoginScreen from "@/components/inventory/LoginScreen";
import Dashboard from "@/components/inventory/Dashboard";

const Index = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);

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

  return (
    <Dashboard
      user={user!}
      onLogout={() => {
        setUser(null);
        setShowLogin(false);
      }}
    />
  );
};

export default Index;
