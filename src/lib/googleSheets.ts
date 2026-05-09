import { supabase } from "@/integrations/supabase/client";

/**
 * Writes a value to a single cell in the Google Sheet via the write-cell edge function.
 * @param range A1 notation including sheet name, e.g. "'🚢 NAVEGACIÓN'!M5"
 * @param value Value to write (string | number)
 */
export async function writeCell(range: string, value: string | number): Promise<void> {
  const { data, error } = await supabase.functions.invoke("write-cell", {
    body: { range, value },
  });
  if (error) throw error;
  if ((data as any)?.error) throw new Error((data as any).error);
}