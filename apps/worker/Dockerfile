FROM node:25-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL=postgresql://localhost/dummy

# Copy entire monorepo for workspace resolution
COPY package.json package-lock.json* ./
COPY packages packages/
COPY apps/worker ./apps/worker
COPY turbo.json ./

# Install deps
RUN npm ci --ignore-scripts && npm cache clean --force

# Generate Prisma client
RUN cd packages/db && npx prisma generate

# Build worker
RUN cd apps/worker && npm run build

EXPOSE 3001

WORKDIR /app/apps/worker

CMD ["npm", "start"]
