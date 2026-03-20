# Security Hardening

## Verification — 2026-03-20

This section documents the verification performed during the post-MVP validation sprint.

### Rate Limiting ✅ VERIFIED
- Rate limiting is implemented in `apps/web/src/lib/rateLimitRoute.ts`
- Rate limit config in `packages/shared/src/config/rate-limit.ts`
- Admin routes protected by `apps/web/src/middleware/rateLimit.ts`
- No bypass vectors found in code paths

### File Upload Security ✅ VERIFIED
- `ALLOWED_MIME_TYPES` defined in `packages/shared/src/config/uploads.ts`: `['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']`
- `MAX_FILE_SIZE` = 10MB
- File validation in `apps/web/app/api/documents/[documentId]/versions/route.ts` checks MIME type before processing
- `saveFile` in `apps/web/src/lib/storage/local.ts` uses `crypto.randomUUID()` for safe filename generation
- Path traversal prevention: filenames are not user-controlled, UUIDs used instead

### Magic Link Security ✅ VERIFIED
- Tokens generated with `crypto.randomBytes(32)` (256-bit entropy)
- Tokens are hashed before storage? ❓ **NOTE:** Tokens stored in plain in `MagicLinkToken.token` field
- **RECOMMENDATION:** Hash tokens before storage for extra security
- Token expiry enforced via `expiresAt` field
- Tokens marked as used after consumption (one-time use)

### Session Security ✅ VERIFIED
- JWT sessions signed with HS256 using `jose` library
- Secret from `AUTH_SECRET` environment variable
- Session cookie settings: `httpOnly: true`, `secure: true` in production, `sameSite: 'lax'`
- Session expiry: 30 days (configurable)
- Session stored server-side via JWT (stateless)

### Admin Security ✅ VERIFIED
- Admin middleware in `apps/admin/src/middleware.ts`
- Public paths: `/login`, `/api/admin/login`, `/api/admin/logout`
- All other `/admin/*` routes protected
- Admin session stored in cookie with `httpOnly: true`
- **NOTE:** MVP uses simple secret comparison, not proper RBAC

### Share Link Security ✅ VERIFIED
- Tokens generated with `crypto.randomBytes(32)` (256-bit entropy)
- Token validation in `validateShareToken` checks:
  - Token existence
  - Status (not REVOKED)
  - Expiry (not EXPIRED)
- Revocation available via `revokeShareLink`
- Receipt ownership verified before PDF export

### Environment Validation ✅ VERIFIED
- `validateEnv()` function in `packages/config/src/env.ts`
- Required variables checked at startup
- Default fallback values for development only (marked as insecure)

### Database Security ⚠️ PARTIAL
- Prisma used with parameterized queries (SQL injection protected)
- No obvious SQL injection vectors found
- **NOTE:** No row-level security implemented (all users can access their own data via userId checks)

### API Security ⚠️ PARTIAL
- Auth required for document operations
- Ownership verified for receipt access
- Admin routes protected separately
- **NOTE:** No API key authentication for external API consumers

### Monitoring ✅ VERIFIED
- Logger implemented in `apps/worker/src/utils/logger.ts`
- Auth failures logged
- Job failures logged
- Export failures logged

---

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
