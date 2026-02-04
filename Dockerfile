# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Required environment variables for build (can be placeholders)
ARG MONGODB_URI
ARG MONGODB_DATABASE
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL

ENV MONGODB_URI=${MONGODB_URI:-mongodb://placeholder:27017/placeholder}
ENV MONGODB_DATABASE=${MONGODB_DATABASE:-placeholder}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-https://alignhealthcare.ai}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-https://api.alignhealthcare.ai}

# Build the application
RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 8080

# Start the application
CMD ["node", "server.js"]
