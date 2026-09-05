# Supabase Auth, RBAC, and BMKG Cache

## Auth flow

1. Frontend authenticates with Supabase Auth using the anon key.
2. Frontend sends the returned access token as `Authorization: Bearer <token>`.
3. Backend calls `supabase.auth.getUser(token)`.
4. Backend resolves `profiles.user_id` and attaches the profile to the request.
5. Route guards compare the authenticated profile with the land owner/case owner.

The service-role key is never sent to the browser. It is used only by the backend repository and persistent cache clients.

## Roles

| Role | Default access |
|---|---|
| `farmer` | Own lands, crop contexts, cases, evidence, reviews, decisions, and briefs |
| `farmer_group_leader` | Own resources; can participate in trusted review when assigned |
| `ppl` | Own profile resources; review capability is available through the review endpoint |
| `admin` | Cross-profile operational access |

The current M2 authorization boundary is ownership plus the `admin` override. More granular organization membership can be added later without changing the API contract.

## BMKG cache

The production adapter uses `SupabaseBmkgCache` backed by `external_source_cache`. The in-memory `BmkgCache` remains available for isolated unit tests. Cache lookup requires `source_name=BMKG`, matching `request_key`/`adm4`, `status=success`, and `expires_at` in the future.

Apply migration `002_decision_record_audit_and_assessment_evidence.sql` after migration `001` before starting the API.