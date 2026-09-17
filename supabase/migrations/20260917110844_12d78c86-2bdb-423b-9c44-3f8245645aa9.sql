CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.app_usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  nombre text NOT NULL,
  rol text NOT NULL DEFAULT 'distribuidor',
  vendedor text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.app_usuarios TO service_role;
ALTER TABLE public.app_usuarios ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER app_usuarios_updated_at BEFORE UPDATE ON public.app_usuarios
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.app_usuarios (email, password_hash, nombre, rol, vendedor) VALUES
  ('info@meup.co', crypt('MeUp2026', gen_salt('bf')), 'Admin', 'admin', NULL),
  ('contabilidad@hidrospa.com.co', crypt('Hidrospa1!', gen_salt('bf')), 'Distribuidor', 'distribuidor', 'Miguel'),
  ('contabilidad@catemar.com.co', crypt('Catemar1!', gen_salt('bf')), 'Distribuidor', 'distribuidor', 'Juan'),
  ('lid.servicios@ceramicaitalia.com', crypt('Ceramicaitalia1!', gen_salt('bf')), 'Distribuidor', 'distribuidor', 'Johan'),
  ('diegeneral@arespool.com.co', crypt('arespool1', gen_salt('bf')), 'Distribuidor', 'distribuidor', 'Andrea'),
  ('contabilidad@ambientesydisenos.com', crypt('ambientesydiseños1!', gen_salt('bf')), 'Distribuidor', 'distribuidor', 'Andrea'),
  ('jmrios2605@gmail.com', crypt('Marcela1!', gen_salt('bf')), 'Distribuidor', 'distribuidor', 'Sami'),
  ('envios@meup.co', crypt('Bodega2026', gen_salt('bf')), 'Equipo de bodega', 'bodega', 'Francisco'),
  ('andrea@meup.co', crypt('AndreaMeUp2026!*', gen_salt('bf')), 'Andre', 'asesor', 'Andrea'),
  ('juan@meup.co', crypt('JuanCMeUp2026!*', gen_salt('bf')), 'Juan Carlos', 'asesor', 'Juan Carlos'),
  ('paola@meup.co', crypt('PaolaOMeUp2026!*', gen_salt('bf')), 'Pao', 'asesor', 'Paola'),
  ('johan@meup.co', crypt('JohanAveMeUp2026!*', gen_salt('bf')), 'Nicolas', 'asesor', 'Johan Nicolas'),
  ('miguel@meup.co', crypt('MeUp2026!*MigueP', gen_salt('bf')), 'Migue', 'asesor', 'Miguel'),
  ('john@meup.co', crypt('MeUp2026!*John', gen_salt('bf')), 'John', 'asesor', 'John'),
  ('jose@meup.co', crypt('MeUp2026!*JoseEdu', gen_salt('bf')), 'Jose', 'asesor', 'Jose');

CREATE OR REPLACE FUNCTION public.validar_login(_email text, _password text)
RETURNS TABLE (email text, nombre text, rol text, vendedor text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT u.email, u.nombre, u.rol, u.vendedor
  FROM public.app_usuarios u
  WHERE lower(u.email) = lower(trim(_email))
    AND u.password_hash = crypt(_password, u.password_hash)
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.validar_login(text, text) TO anon, authenticated;