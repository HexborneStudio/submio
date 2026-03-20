# Security Hardening

## Rate Limiting

The following routes are rate-limited:

| Route | Limit |
|-------|-------|
| Auth routes | 10/min per IP |
| Admin login | 5/min per IP |
| Document creation | 20/min per IP |
| Share link creation | 10/min per IP |
| PDF export | 5/min per IP |
| Educator review | 10/min per IP |

## File Upload Security

- Max file size: 10MB
- Allowed types: PDF, DOCX, DOC, TXT
- MIME type validation against extension
- Path traversal prevention
- Safe filename generation

## Environment Validation

The application fails to start if required environment variables are missing or invalid. Run `validateEnv()` from `@authorship-receipt/config/env`.

## Admin Access

Admin tools require `ADMIN_SECRET` to be set (min 8 characters). The default fallback is only for local development.

## Monitoring

Key events logged:
- Auth failures
- Job failures
- Export failures
- Rate limit hits

For production observability, integrate with a provider (e.g., Datadog, Sentry) by replacing the console-based logging in `apps/worker/src/utils/logger.ts`.
