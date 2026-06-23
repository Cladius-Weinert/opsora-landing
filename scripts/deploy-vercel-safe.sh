#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/ubuntu/opsora/opsora-landing"

cd "$APP_DIR"

section() {
  printf '\n=== %s ===\n' "$1"
}

section "Opsora Vercel safe deploy"
printf 'App: %s\n' "$APP_DIR"
printf 'Mode: build once, then deploy prebuilt artifact\n'

if ! command -v vercel >/dev/null 2>&1; then
  printf 'ERROR: vercel CLI is not installed or not on PATH.\n' >&2
  exit 1
fi

section "Git status"
git status --short

section "Secret check"
bash scripts/check-secrets-before-commit.sh

section "Next.js build"
npm run build

section "Vercel production build"
vercel build --prod

section "Vercel production deploy"
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

printf '\n'
if [ -n "$deploy_url" ]; then
  printf 'Final Vercel URL: %s\n' "$deploy_url"
else
  printf 'Final Vercel URL: unavailable in deploy output\n'
fi
