# ===========================================
# Authorship Receipt - Production Dockerfile
# ===========================================

# ---- Base Stage ----
FROM node:20-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc-dev

WORKDIR /app

# ---- Dependencies Stage ----
FROM base AS deps

COPY package.json package-lock.json* ./

# Install dependencies for all workspaces
RUN npm ci --workspace-root

# Copy workspace files for dependency resolution
COPY . .

# ---- Build Stage ----
FROM deps AS builder

RUN npm run build --workspaces --if-present

# ---- Runner Stage ----
FROM base AS runner

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder /app/packages ./packages

# Copy package.json for script resolution
COPY package.json package-lock.json* ./

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose ports
EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start command (customize per service)
CMD ["sh", "-c", "echo 'Configure startup command'"]
