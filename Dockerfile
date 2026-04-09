FROM node:22-alpine AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY . .

ENV DATABASE_URL=file:/app/apps/api/prisma/dev.db
RUN pnpm --filter api exec prisma generate
RUN pnpm build

FROM node:22-alpine AS runtime

RUN apk add --no-cache nginx bash

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL=file:/app/apps/api/prisma/dev.db
ENV DEFAULT_USER_NAME="Mahmoud Gomaa"
ENV CORS_ORIGINS="*"

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/src ./apps/api/src
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/package.json ./apps/web/package.json

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/start.sh /start.sh

RUN chmod +x /start.sh

VOLUME ["/app/apps/api/prisma"]

EXPOSE 80

CMD ["/start.sh"]