# HOL-87 Transparent Reasoning Baseline v0.2

## Decision boundary

Input: normalized BMKG forecast, active Crop Context snapshot, dan Field Pulse.
Output: assessment transparan + bounded alternatives. Final decision selalu user.

Reference engine menerima projection evaluasi (`available`, `cached`,
`analysis_time`, `target_times`, dan optional `weather_descriptions`) dari
canonical BMKG evidence. Evidence Service tetap menyimpan canonical object dan
raw reference penuh; projection bukan pengganti evidence record.

## Audit v0.1

| Rule/konsep v0.1 | Keputusan v0.2 | Alasan |
|---|---|---|
| canonical envelope/provenance | Keep | Tetap fundamental. |
| deterministic evaluation clock | Keep | Menjamin repeatability. |
| missing/stale/unavailable | Keep + modify | Ikuti policy target-time BMKG dan case-relative Field Pulse. |
| conflict handling | Modify | Hanya aktif untuk konflik observasi lokal yang comparable; BMKG vs air petak bukan conflict. |
| abstention | Keep | Safety boundary utama. |
| alternatives-only | Keep | Tidak ada ranking/rekomendasi utama. |
| `below_normal` signal | Remove dari live path | Tidak didokumentasikan pada public forecast API. |
| `12.5 mm` | Remove dari live path | Fixture mock; `tp` aktual belum dijadikan contract. |
| `8 dry days` | Remove dari live path | Tidak tersedia pada API resmi tersebut. |
| `critical_low`/`dry` input | Replace | Diganti enum observasi Field Pulse. |
| crop stage as risk modifier | Remove | Belum ada curated rule tervalidasi. Crop tetap ditampilkan sebagai context. |

## Deterministic logic

1. Validate contract dan waktu.
2. Evaluate external evidence dan Field Pulse freshness/completeness.
3. Jika engine error: `assessment_unavailable`.
4. Jika BMKG unavailable atau Field Pulse missing: `insufficient_evidence`, low,
   abstained.
5. Jika Field Pulse partial/unknown: `needs_verification`, low, alternatives-only.
6. Jika keduanya current dan Field Pulse lengkap: `context_available`, medium,
   alternatives-only.
7. Factors hanya mengulang observasi: deskripsi forecast, air, dan aliran.
   Tidak ada inferensi agronomis dari suhu, kelembapan, atau weather description.

## Output minimum

```json
{
  "assessment": {
    "status": "available",
    "context_state": "context_available",
    "confidence": "medium",
    "factors": [],
    "missing_evidence": [],
    "limitations": [],
    "action_options": [],
    "recommendation": {"mode": "alternatives_only", "recommended_option_id": null},
    "evaluated_at": "2026-09-03T08:15:00Z",
    "ruleset_version": "water-v0.2"
  }
}
```

`confidence` adalah ordinal strength-of-basis, bukan probabilitas.
