# Explanation Contract v0.2

UI/Decision Brief membentuk copy dari field berikut; engine tidak menghasilkan
narasi bebas.

```json
{
  "summary_code": "context_available",
  "factor_items": [
    {"code": "field_water_limited", "evidence_id": "EVD-FIELD-001", "params": {}},
    {"code": "irrigation_not_flowing", "evidence_id": "EVD-FIELD-001", "params": {}}
  ],
  "unknown_items": [
    {"code": "water_source_allocation_unknown", "required": false}
  ],
  "strength": {"level": "medium", "basis_codes": ["bmkg_current", "field_complete"]},
  "limitation_codes": ["weather_not_local_water_state", "no_agronomic_thresholds"],
  "source_refs": [{"evidence_id": "EVD-BMKG-001", "display_name": "BMKG"}]
}
```

## Invariants

- Factor harus menunjuk evidence ID.
- `params` hanya membawa nilai raw/safe-display yang sudah tervalidasi.
- Unknown tidak boleh dihilangkan dari Decision Brief bila material.
- Strength tidak boleh ditampilkan sebagai probabilitas.
- Template wajib menyatakan keputusan akhir dibuat manusia.
- Unsupported code adalah rendering error; jangan fallback ke teks generatif.

