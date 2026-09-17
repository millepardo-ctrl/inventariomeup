REVOKE EXECUTE ON FUNCTION public.validar_login(text, text) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.validar_login(text, text) TO service_role;

CREATE POLICY "Sin acceso directo a app_usuarios"
ON public.app_usuarios
FOR SELECT
TO authenticated
USING (false);