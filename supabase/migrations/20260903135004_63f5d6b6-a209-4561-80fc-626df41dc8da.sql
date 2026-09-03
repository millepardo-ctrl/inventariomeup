CREATE TABLE public.solicitudes_muestras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asesor_nombre TEXT,
  dest_nombre TEXT,
  dest_cedula TEXT,
  dest_celular TEXT,
  dest_empresa TEXT,
  dest_direccion TEXT,
  dest_ciudad TEXT,
  dest_departamento TEXT,
  tipo_envio TEXT NOT NULL DEFAULT 'estandar',
  estado TEXT NOT NULL DEFAULT 'pendiente',
  origen TEXT NOT NULL DEFAULT 'panel',
  fecha_despacho TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.solicitudes_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitud_id UUID NOT NULL REFERENCES public.solicitudes_muestras(id) ON DELETE CASCADE,
  codigo TEXT,
  referencia TEXT,
  acabado TEXT,
  tipo_pieza TEXT,
  m2_unitario NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_solicitudes_items_solicitud ON public.solicitudes_items(solicitud_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.solicitudes_muestras TO anon, authenticated;
GRANT ALL ON public.solicitudes_muestras TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.solicitudes_items TO anon, authenticated;
GRANT ALL ON public.solicitudes_items TO service_role;

ALTER TABLE public.solicitudes_muestras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso interno solicitudes" ON public.solicitudes_muestras FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acceso interno items" ON public.solicitudes_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);