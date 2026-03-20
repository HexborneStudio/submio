# Next Step

> Exactly one next recommended task

---

## TASK: Phase 12 - Hardening

**Objective:** Add rate limiting, enhance file security, build storage cleanup, add monitoring hooks, environment validation, test coverage, and finalize production Docker/Nginx config.

**Dependencies:**
- Phase 11 Product Polish (current phase)

**Expected Files to Change:**
- `apps/web/src/middleware.ts` — rate limiting
- `apps/web/src/lib/storage/` — file validation enhancements
- `apps/worker/src/` — monitoring hooks
- `.env.example` — environment validation
- `infra/docker/docker-compose.yml` — production configuration
- `infra/nginx/` — production Nginx config
- `packages/db/prisma/schema.prisma` — potential cleanup job model

**Steps:**
1. Add rate limiting middleware (IP-based, endpoint-specific)
2. Enhance file upload security (magic byte validation, size hardening)
3. Build storage cleanup job (delete orphaned files)
4. Add monitoring hooks (structured logging, health check endpoints)
5. Add environment variable validation at startup
6. Add basic test coverage for critical paths
7. Finalize production Docker/Nginx configuration

**Completion Criteria:**
- API endpoints have rate limiting
- File uploads validated by magic bytes (not just MIME type)
- Orphaned files cleaned up automatically
- Worker and web app expose health check endpoints
- All required env vars validated at startup with clear errors
- Basic unit tests pass for critical services
- Production docker-compose runs full stack

---

## Next Five Tasks (Queue)

1. ~~Phase 2: Data Model~~ ✅ DONE
2. ~~Phase 3: Auth + App Shell~~ ✅ DONE
3. ~~Phase 4: Document Ingestion~~ ✅ DONE
4. ~~Phase 5: Analysis Job System~~ ✅ DONE
5. ~~Phase 6: Document Parsing + Analysis V1~~ ✅ DONE
6. ~~Phase 7: Receipt Generation~~ ✅ DONE
7. ~~Phase 8: Share + Educator Review~~ ✅ DONE
8. ~~Phase 9: PDF Export~~ ✅ DONE
9. ~~Phase 10: Admin Tools~~ ✅ DONE
10. ~~Phase 11: Product Polish~~ ✅ DONE
11. Phase 12: Hardening (current)
12. Phase 13: Post-MVP

---

## To Run the Worker

```bash
# 1. Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# 2. Apply schema (Phases 2-5)
npm run db:push --workspace=packages/db
npm run db:generate --workspace=packages/db

# 3. Install all deps
npm install

# 4. Start worker (terminal 1)
npm run dev --workspace=apps/worker

# 5. Start web (terminal 2)
npm run dev --workspace=apps/web
```
