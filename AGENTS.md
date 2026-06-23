# AGENTS.md — Opsora Landing Repo Instructions

Read this before making changes.

Main project context:
- Full brain file: /home/ubuntu/opsora/CODEX_OPSORA_BRAIN.md
- Opsora root: /home/ubuntu/opsora
- This repo: /home/ubuntu/opsora/opsora-landing
- Production URL: https://opsora-landing-zeta.vercel.app

Product:
Opsora is an AI receptionist + lead capture + CRM follow-up automation MVP for local SMBs, starting in Denpasar/Bali.

Current flow:
Vercel landing page -> Next.js /api/lead -> secure webhook -> public gateway -> n8n -> Ollama -> CRM logger.

Hard rules:
- Do not expose secrets.
- Do not print .env.local contents.
- Do not commit .env, .env.local, .next, node_modules, logs, secrets, *.pem, *.key.
- Keep OPSORA_LEAD_API_TOKEN server-side only.
- Do not break /api/lead.
- Do not spam or auto-send outbound messages.
- Human review required for outreach.

Preferred work:
- Improve deployment reliability.
- Improve landing page.
- Harden /api/lead validation.
- Add scripts under scripts/.
- Add docs/runbooks under /home/ubuntu/opsora/docs/.
- Add safe utilities under /home/ubuntu/opsora/scripts/.

Validation:
- npm run build
- git diff --check
- bash -n scripts/*.sh when shell scripts exist
- run /home/ubuntu/opsora/scripts/opsora-status.sh when available
- run secret check script before commit when available

Commit style:
Use clear commits. Stage only intended files.
