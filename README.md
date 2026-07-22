# Opsora Landing

Local MVP landing page for Opsora.

Flow:
Landing form -> Next.js API route -> Opsora secure webhook -> n8n -> Ollama -> CRM.

Security:
- Browser never receives the Opsora token.
- Token is used only server-side in /api/lead.
- .env.local must never be committed.

Required environment variables:
- OPSORA_WEBHOOK_URL
- OPSORA_LEAD_API_TOKEN
# Opsora Landing
