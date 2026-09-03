# BMKG to Canonical Evidence Mapping v0.2

| BMKG / adapter | Canonical path |
|---|---|
| `lokasi.adm4` | `location.administrative.adm4` |
| lokasi labels | `location.administrative.*` |
| `lokasi.lat/lon` | `location.source_point.lat/lon` |
| adapter `fetched_at` | `provenance.fetched_at` |
| request URL (without secrets) | `provenance.request.uri` |
| `analysis_date` | `payload.analysis_time` |
| flattened slots | `payload.forecast_slots[]` |
| `utc_datetime` | `forecast_slots[].target_time_utc` |
| `local_datetime` | `forecast_slots[].target_time_local` |
| documented weather fields | equivalent named slot fields |
| raw storage checksum/key | `provenance.raw_payload_ref` |

## Invariants

- `source.name=BMKG`; live response uses `source.category=official`.
- `collection_mode=external_api`; `is_mock=false` for live response only.
- All normalized slots in one evidence object must share the same `analysis_date`.
  If not, split by analysis time.
- Evidence location is BMKG administrative coverage; land point remains a
  separate entity and must be linked through the verified resolver result.
- Unknown additional BMKG fields remain only in raw payload.

Sample implementable JSON tersedia di
`data/evidence/v0.2/fixtures/T1_normal.input.json`.

