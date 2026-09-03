# RembukTani — AI/Data Contract Pack v0.2

**Tanggal:** 3 September 2026  
**Status:** proposal implementable; semantic/schema final menunggu review Full-stack  
**Source of truth:** `docs/role/LAPORAN_KONTEKS_PROYEK_REMBUKTANI_v0.2.md`

Paket ini merekonsiliasi baseline HOL-86/HOL-87 v0.1 dengan produk berbasis
lahan dan BMKG Public Forecast API aktual.

## Isi

- `BMKG_DATA_DICTIONARY.md`
- `FIELD_PULSE_CONTRACT_v0.2.md`
- `HOL86_RECONCILIATION_v0.2.md`
- `BMKG_TO_CANONICAL_MAPPING.md`
- `EVIDENCE_FRESHNESS_POLICY_v0.2.md`
- `HOL87_REASONING_BASELINE_v0.2.md`
- `CURATED_SOURCE_PACK_v0.2.md`
- `EXPLANATION_CONTRACT_v0.2.md`

Artefak executable berada di `data/evidence/v0.2/`.

## Boundary

- BMKG forecast adalah external evidence, bukan kondisi air aktual lahan.
- Field Pulse adalah observasi user, bukan label risiko.
- Engine deterministic dapat abstain dan tidak memilih keputusan akhir.
- Tidak ada threshold agronomis, risk score 0–100, atau ranking opsi.

