# LLM and Farmer Flow E2E Test Report — 2026-09-07

## Environment

- Branch: `dev`
- Farmer account: authenticated test session
- Test land: `Lahan QA Tunggulwulung 2026-09-07`
- ADM4: `35.73.05.1001`
- Model configuration: enabled, `gemini-2.5-flash`

No Supabase schema, RLS, policy, auth setting, or storage configuration was changed.

## Results

| Flow | Result | Evidence |
|---|---|---|
| Dashboard/profile ownership | PASS | Two owned lands loaded for the authenticated profile. |
| Location/BMKG | PASS | Verified Tunggulwulung ADM4; live non-mock BMKG evidence displayed. |
| Field Pulse update | PASS | New `limited` water + `not_flowing` irrigation observation persisted. |
| Latest-evidence selection | PASS after fix | Assessment used the newest Field Pulse instead of an older `unknown` record. |
| Deterministic assessment | PASS | `context_available`, medium basis, BMKG + two local factors. |
| Live Gemini call | BLOCKED BY CONFIG | Google returned `API_KEY_INVALID`; no generated output was accepted. |
| Safe fallback | PASS | Deterministic options remained available; no fabricated AI narrative appeared. |
| Alternative selection | PASS | Selected option propagated to optional review and final decision. |
| Optional review | PASS | Core flow continued with no reviewer response. |
| Human decision | PASS | QA decision saved with human authority and mock marker. |
| Evidence links | PASS | Four evidence records linked to the QA decision. |
| Decision Brief | PASS | Deterministic brief generated and displayed. |
| History | PASS | New record appeared in history and detail route. |

QA decision record: `c390b3b4-59cb-4fa6-9c13-8320b2f8aa18`.

## LLM blocker resolution

Replace `GEMINI_API_KEY` with a Gemini Developer API key created in Google AI Studio, then restart the backend. Do not commit or paste the key. A backend restart changes the reasoning instance identifier, allowing existing deterministic assessments to be enhanced once with the corrected key.

## Resilience added during test

- A new manual Field Pulse always creates a new evidence version.
- Reasoning selects the newest BMKG and Field Pulse evidence by `collected_at`.
- Field notes and observed water trend are preserved in evidence payload.
- Failed LLM requests open a one-minute circuit breaker.
- The frontend attempts one enhancement per backend instance, preventing repeated slow calls across pages.
