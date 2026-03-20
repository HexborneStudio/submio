# Next Step

> Exactly one next recommended task

---

## TASK: Phase 2 - Data Model

**Objective:** Set up the database foundation by running Prisma migrations and verifying the database connection.

**Dependencies:**
- None (Phase 1 complete)

**Expected Files to Change:**
- `packages/db/prisma/migrations/` - New migration files
- `.env` - Actual environment variables
- Potentially: `packages/db/prisma/schema.prisma` - If adjustments needed

**Steps:**
1. Copy `.env.example` to `.env` and configure DATABASE_URL
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run db:generate --workspace=packages/db`
4. Run initial migration: `npm run db:migrate --workspace=packages/db`
5. Verify database connection
6. Test basic query

**Completion Criteria:**
- Prisma client generated successfully
- Migrations run without errors
- Can connect to database and query

---

## Next Five Tasks (Queue)

1. Phase 3: Auth + App Shell - Implement login/signup flow
2. Phase 4: Document Ingestion - Create document, upload, paste flows
3. Phase 5: Analysis Job System - Redis queue setup
4. Phase 6: Document Parsing + Analysis V1 - Implement parsers
5. Phase 7: Receipt Generation - Build receipt UI and logic
