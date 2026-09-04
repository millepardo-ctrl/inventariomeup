ALTER TABLE public.solicitudes_muestras RENAME COLUMN created_at TO fecha_solicitud;
ALTER TABLE public.solicitudes_muestras RENAME COLUMN dest_departamento TO dest_depto;
ALTER TABLE public.solicitudes_muestras ADD COLUMN IF NOT EXISTS telegram_chat_id text;