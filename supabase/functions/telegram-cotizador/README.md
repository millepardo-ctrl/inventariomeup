# Bot Cotizador MeUp — Setup

## 1. Secrets en Supabase (una sola vez)

Dashboard de Supabase → Settings → Edge Functions → Secrets:

| Secret | Valor |
|--------|-------|
| TELEGRAM_BOT_TOKEN | el token de @BotFather |
| ANTHROPIC_API_KEY | tu API key de Anthropic |
| N8N_WEBHOOK_COTIZACION | https://meup.co/webhook/cotizacion-n8n |
| N8N_WEBHOOK_TOKEN | el token del webhook de n8n |

## 2. Deploy

```bash
supabase functions deploy telegram-cotizador --project-ref mqgzsskdvdgvqjswxovm
```

## 3. Registrar el webhook en Telegram (una sola vez)

```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://mqgzsskdvdgvqjswxovm.supabase.co/functions/v1/telegram-cotizador
```

## 4. Payload enviado a n8n

```json
{
  "cliente": { "nombre": "...", "nit": "...", "email": "...", "telefono": "...", "ciudad": "...", "empresa": "..." },
  "lineas": [{ "codigo": "0160001", "referencia": "Splitface Gris", "acabado": "7x30cm", "cantidad": 2 }],
  "asesor": "Nombre del asesor",
  "origen": "telegram"
}
```

La respuesta de n8n puede incluir `cotizacion_id`, `id`, `numero`, `url` o `link` y el bot lo mostrará.
