FROM node:25-alpine

WORKDIR /app

# Copy entire monorepo for workspace resolution
COPY package.json package-lock.json* ./
COPY packages packages/
COPY apps/worker ./apps/worker
COPY turbo.json ./

# Install all deps
RUN npm ci --ignore-scripts && npm cache clean --force

# Build worker app
RUN cd apps/worker && npm run build

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

WORKDIR /app/apps/worker

CMD ["npm", "start"]
