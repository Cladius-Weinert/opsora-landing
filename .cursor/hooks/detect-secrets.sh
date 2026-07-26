#!/usr/bin/env bash
# Secret-guard hook for Opsora.
# Scans the incoming hook event JSON (prompt text or shell command) for
# credential-like patterns (NVIDIA NIM keys, Alibaba DashScope / OpenAI sk- keys,
# AWS keys, private key blocks, etc.) and BLOCKS the action if one is found.
#
# Aligns with AGENTS.md hard rule: "Do not expose secrets." It never stores or
# echoes an actual key value; it only reports WHICH pattern matched.
#
# Reads the raw event JSON on stdin. Emits a JSON verdict on stdout.
# Exit 0 = allow, Exit 2 = block.

set -uo pipefail

input="$(cat)"

# Concrete credential formats only, to minimize false positives.
patterns=(
  'nvapi-[A-Za-z0-9_-]{16,}'                 # NVIDIA NIM / build.nvidia.com API key
  'sk-[A-Za-z0-9._-]{16,}'                   # Alibaba DashScope / OpenAI-style key
  'AKIA[0-9A-Z]{16}'                         # AWS access key id
  'ASIA[0-9A-Z]{16}'                         # AWS temporary access key id
  'AIza[0-9A-Za-z_-]{20,}'                   # Google API key
  'xox[baprs]-[A-Za-z0-9-]{10,}'             # Slack token
  'gh[pousr]_[A-Za-z0-9]{20,}'               # GitHub token
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'       # PEM private key block
)

matched=""
for p in "${patterns[@]}"; do
  if printf '%s' "$input" | grep -Eq -e "$p"; then
    matched="$p"
    break
  fi
done

if [ -n "$matched" ]; then
  # Do NOT include the secret value itself in any message.
  cat <<'JSON'
{
  "permission": "deny",
  "user_message": "Blocked: this input appears to contain a live API key or credential (e.g. an NVIDIA NIM or DashScope key). Remove the secret, rotate/revoke the exposed key, and provide credentials via the Secrets panel (injected as environment variables) instead of pasting them in chat or commands.",
  "agent_message": "Secret-guard hook denied this action because the payload matched a credential pattern. Do not store, echo, or commit the value. Read credentials only from environment variables provided via the Secrets panel."
}
JSON
  exit 2
fi

echo '{"permission":"allow"}'
exit 0
