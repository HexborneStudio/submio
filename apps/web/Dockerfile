FROM node:25-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=postgresql://localhost/dummy

# Copy entire monorepo
COPY package.json package-lock.json* ./
COPY packages packages/
COPY apps/web ./apps/web
COPY turbo.json ./

# Remove packageManager field that causes corepack/yarn conflicts in Docker
RUN sed -i '/"packageManager"/d' package.json 2>/dev/null || true

# Install deps
RUN npm ci --ignore-scripts

# Generate Prisma client
RUN cd packages/db && npx prisma generate

# Build web app
RUN cd apps/web && /app/node_modules/.bin/next build

EXPOSE 3000

WORKDIR /app/apps/web

CMD ["/app/node_modules/.bin/next", "start"]
