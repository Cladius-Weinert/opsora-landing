#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

fail() {
  printf 'ERROR: %s\n' "$1" >&2
  exit 1
}

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  fail "not inside a git worktree"
fi

forbidden_path_re='(^|/)(\.env$|\.env\.local$|\.env\.[^/]*\.local$|\.next($|/)|node_modules($|/)|logs?($|/)|secrets($|/))|(\.pem$|\.key$|\.log$)'

if git ls-files -z | grep -zEq "$forbidden_path_re"; then
  fail "a forbidden generated, secret, or log path is already tracked"
fi

staged_paths="$(mktemp)"
trap 'rm -f "$staged_paths"' EXIT
git diff --cached --name-only -z > "$staged_paths"

if [ -s "$staged_paths" ] && grep -zEq "$forbidden_path_re" "$staged_paths"; then
  fail "staged files include a forbidden generated, secret, or log path"
fi

if [ ! -s "$staged_paths" ]; then
  printf 'Secret check: no staged files. Path guard passed.\n'
  exit 0
fi

secret_re='(OPSORA_LEAD_API_TOKEN[[:space:]]*[:=][[:space:]]*["'\'']?[^"'\''[:space:]]{8,}|OPSORA_WEBHOOK_URL[[:space:]]*[:=][[:space:]]*["'\'']?https?://|-----BEGIN ([A-Z0-9]+ )?PRIVATE KEY-----|([Aa]uthorization|[Bb]earer|[Pp]assword|[Ss]ecret|[Tt]oken|[Aa]pi[_-]?[Kk]ey)[[:space:]]*[:=][[:space:]]*["'\''][^"'\'']{12,}["'\''])'

if git diff --cached --unified=0 --no-ext-diff -- . ':!package-lock.json' | grep -Eiq "$secret_re"; then
  fail "staged diff contains token-like, key-like, or secret-like content"
fi

printf 'Secret check: staged paths and diff look safe.\n'
