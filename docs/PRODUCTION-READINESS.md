# Opsora Production Readiness

## Gate

Production is GREEN only when the following are verified against the same deployed commit:

1. Landing and `/docs` return 2xx.
2. `/api/health` reports the API dependency as healthy, not merely the landing process.
3. `api.useopsora.com/health` reaches the canonical gateway and returns 200.
4. Authentication register → login → session/me works against production Supabase.
5. AI request → streaming response → usage accounting works through the canonical gateway.
6. Stripe Checkout creates the intended subscription and webhook processing is idempotent.
7. Entitlement state in Supabase matches Stripe after checkout, renewal, cancellation and payment failure.
8. No unresolved P0/P1 regressions and no unexpected production 5xx spike.
9. The Vercel production deployment is traceable to this repository and an explicit release commit.

## Current blockers (2026-09-04)

- Gateway health/routing: production `/api/health` reports upstream gateway `http_503`.
- Source/deployment provenance: the Vercel project is not currently linked to the canonical GitHub repository; reconcile before treating production as reproducible.
- Billing catalog: live website pricing and existing Stripe acceptance criteria disagree; select one authoritative catalog before changing prices.
- Supabase Auth: leaked-password protection warning remains open.

## Recovery order

Gateway/Ingress → source/deployment provenance → Auth → Stripe catalog/Checkout → entitlement/usage → E2E → performance/security hardening.
