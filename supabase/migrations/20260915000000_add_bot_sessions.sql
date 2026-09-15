CREATE TABLE IF NOT EXISTS public.bot_sessions (
  chat_id TEXT PRIMARY KEY,
  step TEXT NOT NULL DEFAULT 'idle',
  client_data JSONB,
  products JSONB,
  asesor TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bot_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.bot_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
GRANT ALL ON public.bot_sessions TO service_role;
