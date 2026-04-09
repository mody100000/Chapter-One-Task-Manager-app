#!/usr/bin/env bash
set -euo pipefail

# Apply DB migrations before starting services
export DATABASE_URL="${DATABASE_URL:-file:/app/apps/api/prisma/dev.db}"
export DOTENV_CONFIG_PATH="${DOTENV_CONFIG_PATH:-/app/apps/api/.env}"

echo "Running Prisma migrations..."
cd /app/apps/api
./node_modules/.bin/prisma migrate deploy --config prisma.config.ts --schema prisma/schema.prisma
cd /app

echo "Seeding database..."
node apps/api/node_modules/tsx/dist/cli.mjs apps/api/prisma/seed.ts

node apps/api/dist/index.js &
api_pid=$!

node apps/web/node_modules/next/dist/bin/next start apps/web -p 3000 &
web_pid=$!

nginx -g "daemon off;" &
nginx_pid=$!

cleanup() {
  kill "$api_pid" "$web_pid" "$nginx_pid" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

wait -n "$api_pid" "$web_pid" "$nginx_pid"