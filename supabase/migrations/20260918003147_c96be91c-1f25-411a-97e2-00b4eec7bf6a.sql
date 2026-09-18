DROP POLICY IF EXISTS "Acceso interno solicitudes" ON public.solicitudes_muestras;
DROP POLICY IF EXISTS "Acceso interno items" ON public.solicitudes_items;

REVOKE ALL ON public.solicitudes_muestras FROM anon, authenticated;
REVOKE ALL ON public.solicitudes_items FROM anon, authenticated;
GRANT ALL ON public.solicitudes_muestras TO service_role;
GRANT ALL ON public.solicitudes_items TO service_role;

ALTER TABLE public.solicitudes_muestras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sin acceso publico a solicitudes" ON public.solicitudes_muestras FOR SELECT TO authenticated USING (false);
CREATE POLICY "Sin acceso publico a items" ON public.solicitudes_items FOR SELECT TO authenticated USING (false);