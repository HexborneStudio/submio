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

# Install ALL deps including devDependencies, no scripts skipped
RUN npm install

# Generate Prisma client
RUN cd packages/db && npx prisma generate

# Build web app - next is in /app/node_modules/.bin
RUN cd apps/web && /app/node_modules/.bin/next build

EXPOSE 3000

WORKDIR /app/apps/web

CMD ["/app/node_modules/.bin/next", "start"]
