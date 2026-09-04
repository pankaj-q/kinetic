# Stage 1: Build application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json bun.lock* ./

# Install all dependencies (including devDependencies for TypeScript & Vite build)
RUN npm ci || npm install

# Copy application source
COPY . .

# Build Vite frontend and esbuild server backend
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3005

# Copy production package descriptors and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production || npm install --production

# Copy compiled bundles and migration scripts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/data ./data
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Non-root security user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3005

# On container boot: run migration then start production server
CMD ["node", "dist/server.cjs"]
