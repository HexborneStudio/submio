FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build --workspace=apps/worker

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/apps/worker/dist ./dist

EXPOSE 3001
CMD ["node", "dist/index.js"]
