import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import Papa from "papaparse";

const USERS_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7-yVomOaDuA9DyIWmpOZm_2X1HQ7PjoQ6yFklXrNlmQDzdyMVsB1FlH-dMF-jfg/pub?gid=1067786151&single=true&output=csv";

export type UserRole = "admin" | "distribuidor";

export interface AuthUser {
  email: string;
  nombre: string;
  rol: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(USERS_CSV);
      const csv = await res.text();
      const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
      const rows = parsed.data as Record<string, string>[];

      const match = rows.find(
        (r) =>
          (r.email || "").trim().toLowerCase() === email.trim().toLowerCase() &&
          (r.password || "").trim() === password.trim()
      );

      if (!match) {
        setError("Correo o contraseña incorrectos.");
        setLoading(false);
        return false;
      }

      const rol = ((match.rol || "").trim().toLowerCase() as UserRole) || "distribuidor";
      setUser({
        email: (match.email || "").trim().toLowerCase(),
        nombre: (match.nombre || "").trim(),
        rol,
      });
      setLoading(false);
      return true;
    } catch {
      setError("No se pudo conectar. Intenta de nuevo.");
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const isAdmin = user?.rol === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
