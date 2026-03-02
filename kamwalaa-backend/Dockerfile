# ============================================================
# Kamwalaa Backend — Production Dockerfile
# ============================================================

# === Stage 1: Dependencies ===
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production deps only
RUN npm ci --omit=dev

# === Stage 2: Build (if needed — e.g., TypeScript) ===
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# (Compile TypeScript or run build steps here if applicable)
# RUN npm run build

# === Stage 3: Production Runtime ===
FROM node:20-alpine AS production
WORKDIR /app

# Security: create non-root user
RUN addgroup -S kamwalaa && adduser -S kamwalaa -G kamwalaa

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY --chown=kamwalaa:kamwalaa . .

# Create uploads directory
RUN mkdir -p /app/uploads && chown kamwalaa:kamwalaa /app/uploads

# Switch to non-root user
USER kamwalaa

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

# Start server
CMD ["node", "server.js"]
