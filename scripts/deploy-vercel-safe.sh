#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/ubuntu/opsora/opsora-landing"

cd "$APP_DIR"

echo "=== Git status ==="
git status --short

echo
echo "=== Next.js build ==="
npm run build

echo
echo "=== Vercel production build ==="
vercel build --prod

echo
echo "=== Vercel production deploy ==="
deploy_output="$(mktemp)"
trap 'rm -f "$deploy_output"' EXIT

vercel deploy --prebuilt --prod --archive=tgz 2>&1 | tee "$deploy_output"

deploy_url="$(
  grep -Eo 'https://[^[:space:]]+' "$deploy_output" \
    | tr -d '\r' \
    | sed 's/[),.;]*$//' \
    | grep -E 'vercel\.app' \
    | tail -n 1 || true
)"

if [ -z "$deploy_url" ]; then
  deploy_url="$(
    grep -Eo 'https://[^[:space:]]+' "$deploy_output" \
      | tr -d '\r' \
      | sed 's/[),.;]*$//' \
      | grep -E 'vercel\.com' \
      | tail -n 1 || true
  )"
fi

echo
if [ -n "$deploy_url" ]; then
  echo "Final Vercel URL: $deploy_url"
else
  echo "Final Vercel URL: unavailable in deploy output"
fi
