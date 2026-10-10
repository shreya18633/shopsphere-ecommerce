# Backend Production Dockerfile (Expt 2 & Expt 3)
FROM node:20-alpine AS runner

WORKDIR /app

# Install curl for healthcheck validation
RUN apk add --no-cache curl

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose backend REST API & Prometheus metrics port
EXPOSE 5000

# Healthcheck for container status monitoring (Expt 2, 4, 7)
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application server
CMD ["node", "src/server.js"]
