ALTER TABLE public.solicitudes_muestras ADD COLUMN IF NOT EXISTS comentarios TEXT;
ALTER TABLE public.solicitudes_muestras ADD COLUMN IF NOT EXISTS responsable TEXT;
