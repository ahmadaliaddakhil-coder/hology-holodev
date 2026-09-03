# Proposal Rekonsiliasi HOL-86 v0.2

**Status:** proposal; review Full-stack wajib sebelum schema final.

## Model relasi

```text
Land 1 ── * CropContext (maksimal satu active pada satu waktu)
Land 1 ── * DecisionCase
DecisionCase * ── 1 snapshot CropContext
DecisionCase 1 ── * Evidence ── * Assessment
```

## Perubahan

| Area | Perubahan | Compatibility |
|---|---|---|
| `land` | Entity baru: ID, nama, point, administrative context | Additive pada persistence; breaking untuk bundle M2 jika wajib. |
| `crop_context` | Keluar dari identitas lahan; memiliki ID, lifecycle, timestamps | Breaking terhadap nesting v0.1. |
| `decision_context` | Dinamai `decision_case`; tetap bounded question | Rename breaking; adapter boleh menerima alias v0.1. |
| evidence | Tambah `land_ref`, `decision_case_ref`, `source_record`, `temporal` | Additive/breaking bila required. |
| revision | Decision Record immutable + `supersedes_id` | Non-breaking additive. |

## Field/semantics v0.1 yang dipertahankan

- Evidence identity, type, source, provenance, location, temporal metadata,
  quality, dan raw payload separation.
- Evidence evaluation sebagai derived state.
- Assessment terpisah dari raw evidence.
- Factors, missing evidence, limitations, action options, dan recommendation gate.
- Trusted Review optional dan advisory.
- Decision Record sebagai immutable human-owned snapshot.
- Evidence/assessment version references dan no-silent-overwrite invariant.

## Field yang tidak dibawa sebagai live semantic

- Fixture-only `rainfall_category`, total `12.5 mm`, dan `consecutive_dry_days`.
- Field observation berupa kesimpulan `critical_low`/`dry`; diganti Field Pulse.
- `trigger` otomatis sebagai syarat pembukaan case; M2 dimulai manual oleh user.

## Field minimum

```json
{
  "land": {
    "land_id": "LAND-TIRTO-A3",
    "name": "Blok Tirto A3",
    "location": {"lat": -8.1283, "lon": 112.5721, "adm4": null}
  },
  "active_crop_context": {
    "crop_context_id": "CROP-TIRTO-2026-02",
    "land_id": "LAND-TIRTO-A3",
    "crop": "rice",
    "variety": "Inpari 32",
    "planting_date": "2026-06-15",
    "growth_stage": "flowering",
    "updated_at": "2026-09-03T07:50:00Z"
  },
  "decision_case": {
    "decision_case_id": "CASE-WATER-001",
    "land_id": "LAND-TIRTO-A3",
    "crop_context_snapshot_id": "CROP-TIRTO-2026-02",
    "question_code": "review_water_plan",
    "started_by": "demo_user",
    "started_at": "2026-09-03T08:00:00Z",
    "status": "active"
  }
}
```

## Migration

1. Preserve bundle v0.1 and fixtures unchanged.
2. Generate `land_id` from explicit migration mapping, never inferred silently
   from free-text `hamparan_name`.
3. Lift nested crop data into a versioned CropContext and snapshot its reference.
4. Map `decision_context_id` to `decision_case_id` while retaining legacy ID in
   `migration.legacy_refs`.
5. Reject ambiguous land/crop mappings for manual review.
