FROM node:25-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=postgresql://localhost/dummy

# Copy entire monorepo for workspace resolution
COPY package.json package-lock.json* ./
COPY packages packages/
COPY apps/web ./apps/web
COPY turbo.json ./

# Install deps
RUN npm ci --ignore-scripts && npm cache clean --force

# Generate Prisma client
RUN cd packages/db && npx prisma generate

# Build
RUN npm run build

EXPOSE 3000

WORKDIR /app/apps/web

CMD ["npm", "start"]
