import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

const USERS_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0G2hjB-gsAREX7D1oHD6MyeE9nNTTQyDmKkILivohh6HALF1JIAbKrrWcePNmL3tqKqTO9Cfb8gWd/pub?gid=148554752&single=true&output=csv";

export type UserRole = "admin" | "asesor" | "distribuidor" | "bodega";

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

  const login = useCallback(async (rawEmail: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    // permite escribir solo el usuario (ej. "milena") además del correo completo
    const cleaned = rawEmail.trim().toLowerCase();
    const email = cleaned.includes("@") ? cleaned : `${cleaned}@meup.co`;

    // 1) Hoja de usuarios (fuente principal)
    try {
      const res = await fetch(USERS_CSV, { cache: "no-store" });
      const csv = await res.text();
      const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
      const rows = parsed.data as Record<string, string>[];

      const match = rows.find(
        (r) =>
          (r.email || "").trim().toLowerCase() === email.trim().toLowerCase() &&
          (r.password || "").trim() === password.trim()
      );

      if (match) {
        const rol = ((match.rol || "").trim().toLowerCase() as UserRole) || "distribuidor";
        setUser({
          email: (match.email || "").trim().toLowerCase(),
          nombre: (match.nombre || "").trim(),
          rol,
        });
        setLoading(false);
        return true;
      }
    } catch {
      // si la hoja falla, se intenta con la base de datos
    }

    // 2) Base de datos de accesos (respaldo)
    try {
      const { data, error: fnError } = await supabase.functions.invoke("login", {
        body: { email: email.trim(), password },
      });

      const found = (data as { user?: { email: string; nombre: string; rol: string } } | null)?.user;
      if (!fnError && found) {
        setUser({
          email: (found.email || "").trim().toLowerCase(),
          nombre: (found.nombre || "").trim(),
          rol: ((found.rol || "").trim().toLowerCase() as UserRole) || "distribuidor",
        });
        setLoading(false);
        return true;
      }

      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return false;
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

  const isAdmin = user?.rol === "admin" || user?.rol === "asesor";

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
