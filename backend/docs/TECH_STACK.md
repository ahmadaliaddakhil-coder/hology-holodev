# RembukTani — Tech Stack Decision

**Scope:** M2 vertical slice
**Status:** implemented M2 baseline
**Date:** 5 September 2026

## Decisions

| Area | Choice | Status / reason |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | Already present; fast mobile-first PWA development and simple build. |
| Backend | Express 5 + TypeScript | Already present; fits the modular-monolith architecture and small M2 API. |
| Database | Supabase PostgreSQL | Migration 001 and follow-up migration 002 are deployed/available; RLS and repository access are in place. |
| ORM/query layer | Supabase JS v2 through Repository Pattern | Keeps persistence behind typed repositories without adding an ORM to the M2 vertical slice. |
| Validation | Contract-aligned TypeScript route validation + JSON Schema artifacts | HTTP validation is intentionally local and strict for the bounded API; canonical evidence rules remain in adapter/reasoning boundaries. |
| Testing | Node test runner + `tsx` for TypeScript tests | Already working in backend; no live API dependency for adapter tests. |
| Deployment | Docker-compatible Node process for staging; provider TBD | Keeps local and staging runtime close without locking a cloud vendor before the demo path is stable. |
| Map/location | BIG boundary service for point lookup, followed by explicit BMKG `adm4` verification | Matches Task 5 spike. BIG code must not be assumed to equal BMKG `adm4`. |
| External weather | Backend BMKG Public Forecast API adapter | Keeps credentials, timeout, cache, attribution, and failure handling out of the client. |

## Why this stack fits M2

- It preserves the existing working toolchain instead of introducing a framework
  migration.
- A modular monolith is sufficient for the bounded DEMO-WATER flow.
- TypeScript types can follow the HOL-86/HOL-87 boundaries across frontend,
  backend, and adapters.
- Supabase PostgreSQL provides the deployed relational schema, RLS, JSONB evidence,
  and the same repository boundary used by the demo and pilot path.
- BMKG and BIG remain behind infrastructure adapters, so external failures do not
  become domain logic or fabricated evidence.

## Risks and open decisions

- Supabase backup, retention, auth/RBAC, and production tenancy policies still
  require an operational decision before a real pilot.
- HTTP validation is currently hand-written; introducing Zod remains optional if
  the API surface expands beyond the bounded M2 flow.
- Authentication/RBAC is unresolved and must not block the synthetic M2 demo.
- BIG-to-BMKG crosswalk is not globally proven by the location spike; each
  resolver result must retain its verification evidence.
- BMKG cache is currently process-local; persistent external-source cache remains
  a production hardening item.
- Final deployment provider, domain, monitoring, and real-pilot data policy are
  outside this M2 stack decision.

## Tooling commands

From `backend/`:

```text
npm run build
npm test
npm run spike:location
```

From `frontend/`:

```text
npm run build
npm run lint
```
