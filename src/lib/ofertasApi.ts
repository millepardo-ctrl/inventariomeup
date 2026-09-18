// Puente entre la UI del Motor de Ofertas y las funciones del servidor.
import { supabase } from "@/integrations/supabase/client";

async function invocar<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(fn, { body });
  if (error) throw new Error(error.message);
  if (data && typeof data === "object" && "error" in (data as Record<string, unknown>)) {
    throw new Error(String((data as Record<string, unknown>).error));
  }
  return data as T;
}

// Compatibilidad: la UI llama las funciones como fn({ data }).
export const useServerFn = <T,>(fn: T): T => fn;

export { invocar };
