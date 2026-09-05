# BMKG Integration

**Task:** Full-stack Task 6 — BMKG API Adapter
**Status:** Implemented adapter foundation; persistence/cache policy remains to be
connected to Task 4 database work.

## Flow

```text
adm4
  -> BmkgClient
  -> documented response validation
  -> flatten data[].cuaca[][]
  -> canonical BMKG evidence
  -> cache raw response
```

The frontend does not call BMKG directly. The backend preserves the request URI,
fetch time, raw payload reference, analysis time, target times, source, and BMKG
attribution metadata.

## Files

- `src/infrastructure/bmkg/bmkg-client.ts` — HTTP request, timeout, limited retry.
- `src/infrastructure/bmkg/bmkg-normalizer.ts` — response validation and canonical mapping.
- `src/infrastructure/bmkg/bmkg-adapter.ts` — live-first and cache fallback orchestration.
- `src/infrastructure/bmkg/bmkg.types.ts` — raw and canonical boundary types.
- `src/infrastructure/cache/bmkg-cache.ts` — cache port implementation for the demo.
- `tests/unit/bmkg-adapter.test.ts` — deterministic adapter tests.

## Request behavior

Endpoint:

```text
GET https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={adm4}
```

The client:

- validates the `adm4` shape before making a request;
- uses a 10-second timeout;
- retries once for network errors and HTTP 5xx responses;
- does not retry client errors such as HTTP 4xx;
- never supplies synthetic defaults for missing BMKG values.

## Normalization rules

The normalizer:

- requires `lokasi.adm4` and checks it equals the requested code;
- requires administrative labels, source point, timezone, and usable forecast slots;
- flattens every nested `data[].cuaca[][]` group;
- maps only documented fields into `forecast_slots`;
- preserves nullable documented fields as `null` when absent or invalid;
- converts BMKG UTC timestamps to ISO UTC values;
- rejects mixed `analysis_date` values rather than silently combining snapshots;
- retains the raw response outside the canonical evidence object.

Unknown BMKG fields remain in the raw payload and are not treated as a v0.2
canonical contract field.

## Delivery and fallback

`BmkgAdapter.getEvidence()` tries live BMKG first.

- Live success returns `delivery: "live"` and caches the raw response.
- Live failure with a cached response returns `delivery: "cached"`.
- Live failure without cache throws an unavailable error. The caller must expose
  missing/unavailable evidence or let reasoning abstain.

Cached evidence keeps its original `provenance.fetched_at` and is never labeled
as a live fetch. Cache freshness is evaluated later using the explicit reasoning
evaluation time; cache presence alone does not mean the evidence is current.

The current `BmkgCache` is process-local and intended for the bounded M2 demo. A
production deployment should replace it with a persistent cache repository that stores the raw payload,
adm4, fetched time, request metadata, and retention policy.

## Canonical example

The output shape follows:

```text
data/evidence/v0.2/bmkg_canonical_evidence.schema.json
data/evidence/v0.2/bmkg_canonical_example.json
```

Important fields include:

- `source.name = "BMKG"`;
- `source.attribution_required = true`;
- `provenance.collection_mode = "external_api"`;
- `provenance.is_mock = false` for live responses;
- `payload.analysis_time`;
- `payload.forecast_slots[]`.

Demo fixtures must use the separate fixture path and keep
`source.category = "official_mock"`, `collection_mode = "fixture"`, and
`is_mock = true`.

## Validation

From `backend/`:

```text
npm test
npm run build
```

The unit tests use fake fetch responses and do not consume the live API.
