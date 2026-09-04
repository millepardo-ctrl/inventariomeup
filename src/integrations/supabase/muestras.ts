// Cliente para el proyecto de Supabase donde vive el módulo de Muestras.
// La URL y la anon key son valores públicos (protegidos por RLS).
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const MUESTRAS_URL = "https://mqgzsskdvdgvqjswxovm.supabase.co";
const MUESTRAS_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xZ3pzc2tkdmRndnFqc3d4b3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDQ0NzAsImV4cCI6MjEwMjk4MDQ3MH0.0Q5Mg2GI6LYa6HZsQKuTCPL6_BZ4-AZ-y0XRCG0yYEk";

export const supabaseMuestras = createClient<Database>(MUESTRAS_URL, MUESTRAS_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
