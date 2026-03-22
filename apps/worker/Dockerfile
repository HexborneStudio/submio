FROM node:25-alpine

WORKDIR /app

# Install dependencies (including tsx for running TypeScript)
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy source
COPY . .

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Run with tsx (fast TypeScript execution, production-safe)
CMD ["npm", "run", "dev"]
