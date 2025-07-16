###############################################################################
# 1) Base image – exact Node 20.1.0 + Corepack + pnpm 10.13.1                 #
###############################################################################
FROM node:20.1.0-alpine AS base
LABEL maintainer="root@root.com"

ENV PNPM_HOME=/usr/local/share/pnpm \
    PNPM_CONFIG_COLOR=false \
    NODE_ENV=production

# Enable Corepack & activate specific pnpm version
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

# Create a non‑root user for runtime
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
WORKDIR /app

###############################################################################
# 2) deps – install *all* dependencies once (cached by lockfile hash)         #
###############################################################################
FROM base AS deps
COPY package.json pnpm-lock.yaml ./

# BuildKit cache for pnpm store
RUN --mount=type=cache,target=/root/.local/share/pnpm \
    pnpm install --frozen-lockfile --unsafe-perm

###############################################################################
# 3) build – copy source & compile to dist/                                   #
###############################################################################
FROM deps AS build
COPY . .
RUN pnpm build

###############################################################################
# 4) prod‑deps – keep only production deps                                    #
###############################################################################
FROM base AS prod-deps
# Manifest files are required for prune
COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules ./node_modules

# Remove devDependencies
RUN pnpm prune --prod --ignore-scripts

###############################################################################
# 5) runtime – minimal, non‑root, prod deps + compiled code                   #
###############################################################################
FROM base AS runtime
USER nodejs
WORKDIR /app

# Prod deps & compiled app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/scripts ./scripts

# (Optional) static env file
COPY .env .env

EXPOSE ${PROJECT_PORT:-3000}

# Simple health‑check hitting /health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD \
  node -e "require('http').get('http://localhost:'+(process.env.PROJECT_PORT||3000)+'/health',res=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# ─────────────────────────────────────────────────────────────────────────────
# Start‑up command: run migrations then the API
# ─────────────────────────────────────────────────────────────────────────────
CMD ["sh","-c","pnpm migrate up && node dist/main.js"]
