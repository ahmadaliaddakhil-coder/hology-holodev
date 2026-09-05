# RembukTani Full-Stack Readiness

Status: backend and project foundation completed before frontend implementation.

## Completed

- Supabase PostgreSQL schema and follow-up audit migration
- Repository layer and dependency-injection factory
- Land CRUD, active crop context, decision-case history
- BIG boundary candidate and explicit BMKG `adm4` verification
- BMKG live adapter with timeout, retry, normalization, attribution, and cache fallback
- Field Pulse persistence with valid `unknown` values
- Deterministic HOL-87 water v0.2 assessment and alternatives-only options
- Assessment-to-evidence traceability
- Trusted review request and submission
- Explicit, idempotent, immutable human Decision Record
- Decision Record evidence links and audit snapshots
- Deterministic Decision Brief and share text
- OpenAPI contract and API examples
- Demo seed/reset scripts for Supabase Admin API
- Backend and frontend CI workflows
- Secret-safe root `.gitignore`

## Verification

```text
backend: npm run build
backend: npm run typecheck:demo
backend: npm test
frontend: npm run build
frontend: npm run lint
```

## Deliberate boundaries

- Authentication/RBAC policy is not invented in the M2 demo. API service-role access is for the backend runtime; production auth middleware must be finalized before pilot exposure.
- BMKG cache is process-local for the demo. Production needs a persistent cache/retention policy.
- BIG attributes are not silently mapped to BMKG `adm4`; a verified crosswalk is still required.
- The frontend has not been implemented yet and is the next phase.

## Next phase

Implement the frontend workflow against [openapi.yaml](openapi.yaml):

`Lahan -> Crop Context -> Decision Case -> BMKG/Field Pulse -> Assessment -> Review -> Human Decision -> Decision Brief`
