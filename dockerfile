# syntax=docker/dockerfile:1.7

# ─── deps ────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# libc6-compat keeps native deps happy on Alpine.
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ─── builder ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ─── runner ──────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Cloud Run / Cloud Build expect the container to listen on $PORT (8080
# by default). Streamlit version of this app exposed the same port.
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Run as a non-root user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nachodex

# Standalone server output keeps the runtime image tiny.
COPY --from=builder --chown=nachodex:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nachodex:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nachodex:nodejs /app/public ./public

# Writable directory for the JSON-fallback "database" when Firestore isn't
# configured (production should always use Firestore via the attached
# Cloud Run service account, but we keep the directory here for local runs).
RUN mkdir -p /app/data && chown -R nachodex:nodejs /app/data

USER nachodex
EXPOSE 8080

CMD ["node", "server.js"]
