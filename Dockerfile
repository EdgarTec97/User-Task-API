# ──────────────────────────────────────────────────────────────────────────────
# 1) Base image – exact Node version (20.1.0) with Corepack enabled
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20.1.0-alpine AS base
LABEL maintainer="root@root.com"
ENV PNPM_HOME=/usr/local/share/pnpm \
    NODE_ENV=production \
    # PNPM colours off for CI logs
    PNPM_CONFIG_COLOR=false
# Enable corepack & install exact pnpm version
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

# Create app user & group (non‑root runtime)
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

WORKDIR /app

# ──────────────────────────────────────────────────────────────────────────────
# 2) Dependencies layer – install *once*, reuse on rebuilds
#    Uses BuildKit cache for pnpm store
# ──────────────────────────────────────────────────────────────────────────────
FROM base AS deps
# Copy only the manifest files to calculate cache key
COPY package.json pnpm-lock.yaml ./

# Install prod+dev deps (you’ll prune later) with cache mount
RUN --mount=type=cache,target=/root/.local/share/pnpm \
    pnpm install --frozen-lockfile --unsafe-perm

# ──────────────────────────────────────────────────────────────────────────────
# 3) Build layer – copies source & compiles to dist/
# ──────────────────────────────────────────────────────────────────────────────
FROM deps AS build
COPY . .
RUN pnpm build

# ──────────────────────────────────────────────────────────────────────────────
# 4) Prune layer – keep *only* production deps
# ──────────────────────────────────────────────────────────────────────────────
FROM base AS prod-deps
COPY --from=deps /app/node_modules ./node_modules
# Remove dev dependencies in‑place
RUN pnpm prune --prod

# ──────────────────────────────────────────────────────────────────────────────
# 5) Runtime layer – minimal, non‑root, only prod deps + compiled code
# ──────────────────────────────────────────────────────────────────────────────
FROM base AS runtime
USER nodejs
WORKDIR /app

# Copy production node_modules and compiled sources
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/scripts ./scripts

# If you keep env vars in the image (usually CI injects them instead)
# COPY .env .env

EXPOSE ${PROJECT_PORT:-3000}

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD \
  node -e "require('http').get('http://localhost:${process.env.PROJECT_PORT||3000}/health', res=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

RUN pnpm migrate generate GeneralMigration
RUN pnpm migrate up
CMD ["node","dist/main.js"]
