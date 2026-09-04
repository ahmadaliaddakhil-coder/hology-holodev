# HOL-87 ↔ HOL-86 Reconciliation v0.1

## Schema impact

**No HOL-86 schema change required.**

HOL-87 menggunakan field yang sudah tersedia:
- `reasoning.baseline_status`
- `context_state`
- `confidence`
- `factors`
- `evidence_evaluations`
- `missing_evidence`
- `limitations`
- `action_option_ids`
- `recommendation`
- `ActionOption`

## Semantic changes to HOL-86 example fixture

HOL-86 contract tetap valid, tetapi example happy-path sebaiknya nanti diregenerate dari HOL-87.

### 1. Rule set version

From:

`prototype-water-0.1`

To:

`water-baseline-0.1`

### 2. Baseline status

Happy path:

`prototype_rule` → `mixed`

karena ada curated qualitative flowering modifier + prototype combination rules.

### 3. `irrigation_flow_percentage = 20`

HOL-86 example sebelumnya menampilkan factor:

> “Aliran irigasi fixture rendah.”

HOL-87 tidak mempertahankan 20% sebagai independent risk factor.

Reason:
- tidak ada validated mapping dari `20% flow` ke agronomic class;
- field tetap dipertahankan sebagai raw evidence.

### 4. Flowering

Flowering tidak menjadi risk factor sendirian.

Rule:

> Flowering menjadi sensitivity modifier hanya jika local water-shortage signal sudah ada.

### 5. Recommendation

Tetap:

`alternatives_only`

No ranked best suggestion.

### 6. Reasoning boundary

HOL-87 output reasoner sengaja mengosongkan:
- `trusted_reviews`
- `decision_record`
- `handoff`

karena semuanya berada downstream dari system reasoning.

HOL-86 full demo bundle tetap dapat menambahkan artefak tersebut setelah human flow.

## Next HOL-86 action

Setelah AI/Data + Full-stack + UX review:
- update canonical example outputs bila tim menerima HOL-87 semantics;
- schema version tidak perlu naik hanya karena semantic example berubah;
- rule semantics/version disimpan di assessment.
