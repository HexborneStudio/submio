# Deployment Guide

## Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker + Docker Compose (for containerized deployment)

## Environment Variables

Required:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — JWT signing secret (min 32 chars)
- `ADMIN_SECRET` — Admin access secret (min 8 chars)
- `REDIS_HOST` / `REDIS_PORT` or `REDIS_URL`

Optional:
- `STORAGE_LOCAL_DIR` — defaults to `./storage`
- `WORKER_URL` — defaults to `http://localhost:3001`
- `NEXT_PUBLIC_ANALYTICS_ENABLED` — defaults to `false`

## Docker Deployment

```bash
cd infra/docker
ADMIN_SECRET=your-secret-here docker-compose up -d
```

## Local Development

```bash
# Install dependencies
npm install

# Start infrastructure
docker run -d -p 6379:6379 redis:7-alpine
docker run -d -p 5432:5432 -e POSTGRES_DB=authorship_receipt -e POSTGRES_USER=dev -e POSTGRES_PASSWORD=devpassword postgres:16-alpine

# Apply database
npm run db:push --workspace=packages/db
npm run db:generate --workspace=packages/db

# Start apps
npm run dev --workspace=apps/worker  # terminal 1
npm run dev --workspace=apps/web    # terminal 2
npm run dev --workspace=apps/admin  # terminal 3 (optional)
```

## Production

For production, use the Docker setup with proper secrets management, TLS termination at Nginx, and a managed PostgreSQL instance.
