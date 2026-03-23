FROM node:25-alpine

WORKDIR /app

# Copy entire monorepo for workspace resolution
COPY package.json package-lock.json* ./
COPY packages packages/
COPY apps/web ./apps/web
COPY turbo.json ./

# Install all deps
RUN npm ci --ignore-scripts && npm cache clean --force

# Build web app
RUN cd apps/web && npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

WORKDIR /app/apps/web

CMD ["npm", "start"]
