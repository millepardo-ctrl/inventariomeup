import { supabase } from "@/integrations/supabase/client";

type WriteCellTarget =
  | string
  | {
      sheetId: number;
      cell: string;
    };

/**
 * Writes a value to a single cell in the Google Sheet via the write-cell edge function.
 * @param target A1 notation or a sheetId+cell pair
 * @param value Value to write (string | number)
 */
export async function writeCell(target: WriteCellTarget, value: string | number): Promise<void> {
  const { data, error } = await supabase.functions.invoke("write-cell", {
    body: typeof target === "string" ? { range: target, value } : { ...target, value },
  });
  if (error) throw error;
  if ((data as any)?.error) throw new Error((data as any).error);
}