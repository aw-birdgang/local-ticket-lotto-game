FROM public.ecr.aws/docker/library/node:18-alpine AS base
# Install dependencies only when needed
COPY --chown=node:node package.json ./
RUN export YARN_VERSION=$(cat package.json | grep packageManager | cut -d '@' -f 2 | sed 's/"//') && \
  echo "Yarn version: $YARN_VERSION" && \
  yarn policies set-version $YARN_VERSION

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY --chown=node:node package.json yarn.lock* .yarnrc.yml package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --immutable; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/.yarn ./.yarn
COPY --from=deps /app/.pnp.cjs ./.pnp.cjs
COPY --from=deps /app/.pnp.loader.mjs ./.pnp.loader.mjs
COPY . .

RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /app/.yarn .yarn
COPY --chown=node:node --from=builder /app/dist dist
COPY --chown=node:node --from=builder /app/.pnp.cjs /app/.pnp.loader.mjs ./
COPY --chown=node:node yarn.lock package.json tsconfig.* .env cicd/codebuild/healthCheck.js ./

USER node

CMD ["yarn", "start"]