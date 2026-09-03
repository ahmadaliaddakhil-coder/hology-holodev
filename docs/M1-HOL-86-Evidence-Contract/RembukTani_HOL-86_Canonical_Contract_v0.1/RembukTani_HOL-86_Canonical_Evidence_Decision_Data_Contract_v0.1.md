# RembukTani — Canonical Evidence & Decision Data Contract v0.1

**Linear Issue:** HOL-86 — `[M1] Define canonical evidence and decision data contract`  
**Milestone:** M1 — Scope & UX Freeze  
**Owner:** AI/Data  
**Version:** 0.1.0  
**Tanggal:** 2 September 2026  
**Status:** **DRAFT — IMPLEMENTABLE / CROSS-TEAM REVIEW REQUIRED**

---

## 1. Tujuan

HOL-86 menetapkan **satu kontrak canonical** yang dapat dipakai bersama oleh:

- AI/Data — input reasoning dan output assessment;
- Full-stack — API, persistence, state transition;
- UI/UX — informasi yang harus dapat ditampilkan;
- PM/Product — menjaga evidence, inference, review, dan keputusan tidak tercampur.

Core contract mengikuti journey M1:

```text
Decision Context
    ↓
Evidence
    ↓
Evidence Validation
    ↓
Assessment / System Inference
    ↓
Action Options
    ↓
Optional Trusted Review
    ↓
Final Human Decision
    ↓
Decision Record
```

**Invariant utama:**

> `Evidence ≠ System Inference ≠ Human Review ≠ Final Decision`

`Decision Record` adalah **core endpoint**. `task/action_handoff/outcome` tetap optional extension.

---

# 2. Source Basis

Contract ini disusun dari:

1. **M0 Evidence Contract v0.1** di `data.zip`
   - `data/evidence/DATA_DICTIONARY.md`
   - `climate_external.json`
   - `field_observation.json`
   - `human_observation.json`
   - `LIMITATIONS.md`

2. **One-Page PRD v0.2**
3. **Five-Minute Demo Storyline v0.1**
4. **End-to-End User Flow & Failure States v0.1**
5. **M1 AI/Data Issue Refinement Pack v0.1**
6. Existing Decision-Support Pattern Audit v0.1 sebagai **working input**, khusus recommendation mode.

---

# 3. Compatibility dengan Evidence Contract M0 v0.1

Field M0 yang **dipertahankan**:

| M0 field | HOL-86 |
|---|---|
| `evidence_id` | dipertahankan |
| `evidence_type` | dipertahankan |
| `source.category` | dipertahankan / enum diperluas secara terbatas |
| `source.name` | dipertahankan |
| `provenance.collection_mode` | dipertahankan |
| `provenance.is_mock` | dipertahankan |
| `location` | dipertahankan |
| `observed_at` | dipertahankan |
| `valid_until` | dipertahankan |
| `quality.level` | dipertahankan |
| `quality.basis` | dipertahankan |
| `payload` | dipertahankan |

Tambahan canonical:

- `evidence_version`
- `DecisionContext`
- `EvidenceEvaluation`
- `Assessment`
- `ActionOption`
- `TrustedReview`
- `DecisionRecord`
- optional `Handoff`
- version/reference semantics

### Migration rule untuk fixture M0

Fixture lama yang tidak memiliki `evidence_version` dinormalisasi sebagai:

```json
"evidence_version": 1
```

Payload asli tidak perlu diubah.

---

# 4. Keputusan Desain Penting

## 4.1 Raw evidence tetap raw

Raw evidence **tidak boleh** menyimpan:

- `risk_level`;
- final `context_state`;
- recommendation;
- final decision.

Risk/context merupakan output reasoning.

---

## 4.2 `quality.level` berbeda dari `confidence`

### `evidence.quality.level`

Menjawab:

> “Bagaimana kualitas evidence ini dinilai pada sumber/fixture?”

Allowed:

```text
high | medium | low | unknown
```

Ini **bukan probabilitas ilmiah**.

### `assessment.confidence`

Menjawab:

> “Seberapa kuat assessment sistem dapat digunakan berdasarkan evidence dan rule yang tersedia?”

Allowed:

```text
high | medium | low | unknown
```

Semantik detail confidence dikunci pada **HOL-87**, bukan HOL-86.

---

## 4.3 Freshness adalah derived state

Raw evidence membawa:

```text
observed_at
valid_until
```

Sedangkan:

```text
current | stale | unknown
```

disimpan pada:

```text
assessment.evidence_evaluations[]
```

Alasan:

- evidence tidak perlu dimutasi hanya karena waktu berjalan;
- freshness selalu mempunyai evaluation time;
- raw source dan system interpretation tetap terpisah.

**Catatan:** `valid_until` pada fixture M0 sendiri masih merupakan prototype rule, bukan batas agronomis tervalidasi.

---

## 4.4 Recommendation tidak mandatory

Core contract:

```text
action_options[]
```

selalu didukung.

Field:

```text
assessment.recommendation.recommended_option_id
```

bersifat nullable.

Recommendation mode:

```text
not_enabled
abstained
alternatives_only
ranked
```

Untuk M1 v0.1:

> default = `alternatives_only` atau `abstained`.

`ranked` hanya digunakan jika keputusan produk dan HOL-87 mendukung evidence-ranked suggestion.

---

## 4.5 Trusted Review optional

`TrustedReview` tidak mandatory.

Reviewer dapat:

```text
approved
modified
rejected
unavailable
cancelled
```

PPL **tidak hard-coded** sebagai satu-satunya reviewer.

---

## 4.6 Final authority harus manusia

`DecisionRecord.authority` memiliki invariant:

```json
"authority": "human"
```

System suggestion tidak boleh otomatis menjadi final decision.

---

# 5. Canonical Bundle

Top-level contract:

```json
{
  "contract_version": "0.1.0",
  "bundle_id": "...",
  "scenario_id": "...",
  "environment": "demo",
  "workflow_state": "...",
  "decision_context": {},
  "evidence": [],
  "assessment": {},
  "action_options": [],
  "trusted_reviews": [],
  "decision_record": {},
  "handoff": null
}
```

Satu bundle merepresentasikan satu decision context pada satu snapshot pertukaran data.

---

# 6. `DecisionContext`

Tujuan:

> Mendefinisikan **apa yang sedang diputuskan**, bukan hasil keputusan.

Minimum:

```json
{
  "decision_context_id": "DC-WATER-001",
  "version": 1,
  "status": "active",
  "decision_question": "...",
  "trigger": {
    "type": "manual_review",
    "description": "..."
  },
  "location": {},
  "crop_context": {},
  "created_at": "...",
  "updated_at": "...",
  "is_mock": true
}
```

## Required fields

| Field | Required | Meaning |
|---|---:|---|
| `decision_context_id` | Yes | Stable identifier |
| `version` | Yes | Context revision |
| `status` | Yes | `draft / active / decision_recorded / archived` |
| `decision_question` | Yes | Pertanyaan keputusan |
| `trigger.type` | Yes | Jenis trigger, bukan mekanisme monitoring |
| `trigger.description` | Yes | Alasan decision moment dibuka |
| `location` | Yes | Scope lokasi |
| `crop_context` | Yes | Crop context minimum |
| `created_at` | Yes | Context creation time |
| `updated_at` | Yes | Last context update |
| `is_mock` | Yes | Fixture/demo marker |

## Boundary

HOL-86 **tidak** mendefinisikan:
- automatic trigger detection;
- notification system;
- anomaly detection.

---

# 7. `Evidence`

Canonical evidence mempertahankan struktur M0.

```json
{
  "evidence_id": "EVD-CLM-001",
  "evidence_version": 1,
  "evidence_type": "climate_external",
  "source": {
    "category": "official_mock",
    "name": "BMKG"
  },
  "provenance": {
    "collection_mode": "fixture",
    "is_mock": true
  },
  "location": {},
  "observed_at": "...",
  "valid_until": "...",
  "quality": {
    "level": "high",
    "basis": "..."
  },
  "payload": {}
}
```

## Evidence types M1

```text
climate_external
field_observation
human_observation
```

Menambah evidence type baru = contract change.

---

# 8. `EvidenceEvaluation`

Bukan raw evidence.

Objek ini adalah hasil evaluasi system pada saat assessment.

```json
{
  "evidence_id": "EVD-FLD-001",
  "evidence_version": 1,
  "schema_status": "valid",
  "freshness_status": "current",
  "relevance_status": "relevant",
  "issues": []
}
```

Allowed:

### `schema_status`

```text
valid | invalid
```

### `freshness_status`

```text
current | stale | unknown
```

### `relevance_status`

```text
relevant | uncertain | not_relevant
```

Exact freshness/relevance rule **belum dikunci** pada HOL-86.

---

# 9. `Assessment`

Assessment adalah **system inference**, bukan keputusan manusia.

```json
{
  "assessment_id": "ASM-WATER-001",
  "version": 1,
  "decision_context_ref": {
    "id": "DC-WATER-001",
    "version": 1
  },
  "status": "complete",
  "evaluated_at": "...",
  "reasoning": {
    "engine_id": "rembuktani-baseline",
    "engine_version": "0.1.0",
    "rule_set_version": "prototype-water-0.1",
    "baseline_status": "prototype_rule"
  },
  "context_state": "elevated_attention",
  "confidence": "medium",
  "factors": [],
  "evidence_evaluations": [],
  "missing_evidence": [],
  "limitations": [],
  "action_option_ids": [],
  "recommendation": {},
  "input_evidence_refs": []
}
```

## `status`

```text
complete
insufficient_evidence
unavailable
```

## `reasoning.baseline_status`

```text
prototype_rule
curated_rule
mixed
```

### M1 rule

Sampai source technical/agronomic dikurasi:

> gunakan `prototype_rule`.

---

# 10. Factor Contract

Factor menjawab:

> “Kenapa assessment muncul?”

```json
{
  "factor_id": "FCT-001",
  "label": "Forecast curah hujan di bawah normal",
  "direction": "supports_attention",
  "linked_evidence_refs": [
    {"id": "EVD-CLM-001", "version": 1}
  ],
  "rule_id": "PR-WATER-001"
}
```

Allowed direction:

```text
supports_attention
reduces_attention
neutral
unknown
```

`direction` **bukan** scientific causal claim; semantik rule ditentukan HOL-87.

---

# 11. Missing Evidence Contract

```json
{
  "code": "LATEST_WATER_ALLOCATION",
  "description": "Konfirmasi kondisi/alokasi air terbaru.",
  "impact": "material",
  "requested_evidence_type": "field_observation"
}
```

Allowed impact:

```text
blocking
material
non_blocking
unknown
```

**HOL-86 tidak memutuskan** evidence mana yang blocking. Itu bagian HOL-87.

---

# 12. `ActionOption`

Action option adalah bounded decision-support output.

```json
{
  "option_id": "OPT-WATER-001",
  "decision_context_ref": {},
  "assessment_ref": {},
  "origin": "system_baseline",
  "option_type": "action",
  "label": "...",
  "description": "...",
  "rationale": "...",
  "supporting_evidence_refs": [],
  "limitations": [],
  "required_evidence": [],
  "eligibility": "conditional",
  "rank": null
}
```

## `option_type`

```text
action
collect_more_evidence
request_review
defer
```

## `eligibility`

```text
eligible
conditional
not_eligible
```

`rank = null` jika recommendation ranking belum aktif.

---

# 13. Recommendation Gate Contract

```json
"recommendation": {
  "mode": "alternatives_only",
  "recommended_option_id": null,
  "why": "...",
  "change_conditions": []
}
```

## Rules

### `not_enabled`

Recommendation feature belum digunakan.

### `abstained`

Evidence tidak cukup untuk primary recommendation.

### `alternatives_only`

Beberapa bounded options tersedia, tanpa best option.

### `ranked`

Boleh memiliki:

```json
"recommended_option_id": "OPT-..."
```

Cross-object invariant:

> `recommended_option_id` hanya boleh non-null jika `mode == "ranked"`.

---

# 14. `TrustedReview`

```json
{
  "review_id": "REV-WATER-001",
  "decision_context_ref": {},
  "assessment_ref": {},
  "reviewer": {
    "role": "trusted_reviewer",
    "display_name": "..."
  },
  "status": "modified",
  "reviewed_at": "...",
  "target_option_id": "OPT-...",
  "note": "...",
  "modification": {
    "description": "...",
    "reason": "..."
  }
}
```

Reviewer identity minimum adalah **role**.

Nama/actor ID optional sesuai data minimization.

---

# 15. `DecisionRecord`

Decision Record adalah **immutable/auditable decision snapshot**.

```json
{
  "decision_record_id": "DEC-WATER-001",
  "revision": 1,
  "decision_context_ref": {},
  "status": "recorded",
  "decided_at": "...",
  "authority": "human",
  "decision_facilitator": {
    "role": "decision_facilitator"
  },
  "final_decision": "...",
  "rationale": "...",
  "selected_option_id": "OPT-...",
  "considered_option_ids": [],
  "system_recommended_option_id": null,
  "decision_relation_to_system": "no_recommendation",
  "evidence_snapshot_refs": [],
  "assessment_snapshot_ref": {},
  "review_snapshot_ref": null,
  "review_status": "not_requested",
  "limitations": [],
  "is_mock": true,
  "supersedes_record_id": null,
  "created_at": "..."
}
```

## Final authority invariant

```text
authority = human
```

## Relation to system

```text
aligned
modified
different
no_recommendation
not_applicable
```

Field ini memungkinkan system recommendation dan final decision berbeda tanpa dianggap error.

---

# 16. Decision Record Revision Rule

Setelah record dibuat:

> **jangan silent overwrite.**

Jika evidence/assessment/decision berubah secara material:

```text
DEC-WATER-001 revision 1
          ↓
new Decision Record / revision 2
          ↓
supersedes_record_id = prior record
```

Exact DB implementation menjadi keputusan Full-stack.

Contract hanya mengunci semantic history.

---

# 17. Optional `Handoff`

Handoff tidak menjadi core dependency.

```json
{
  "handoff_id": "HND-WATER-001",
  "decision_record_id": "DEC-WATER-001",
  "channel": "copy_summary",
  "status": "prepared"
}
```

Optional fields:
- responsible role;
- execution window;
- action status;
- exception;
- outcome note.

Decision Record valid walaupun:

```json
"handoff": null
```

---

# 18. Workflow State

Working exchange-state enum:

```text
draft_context
context_ready
evidence_incomplete
evidence_ready
assessing
assessed
insufficient_evidence
assessment_unavailable
options_ready
review_pending
reviewed
decision_ready
decision_confirmed
decision_recorded
shared_optional
```

Ini adalah cross-team state vocabulary.

Database internal tidak wajib menggunakan satu enum persis ini selama external/API semantics tetap setara.

---

# 19. Cross-Object Invariants

JSON Schema tidak cukup untuk seluruh relational validation.

HOL-86 mengunci invariant berikut:

1. Semua `evidence_ref` harus menunjuk evidence yang ada.
2. Semua action option harus menunjuk assessment + decision context yang sama.
3. `assessment.action_option_ids` harus sesuai dengan action options yang dikirim.
4. `recommended_option_id != null` hanya saat mode `ranked`.
5. Decision Record `selected_option_id` harus menunjuk option valid bila non-null.
6. `authority` wajib `human`.
7. Review snapshot harus menunjuk review yang ada.
8. Decision Record evidence snapshot harus menunjuk version evidence yang benar-benar digunakan.
9. Mock Decision Record wajib mempertahankan mock provenance/limitation.
10. Task/handoff tidak menjadi prerequisite Decision Record.

File:

> `validate_contract_examples.py`

menjalankan JSON Schema validation + invariant checks untuk fixture M1.

---

# 20. Deterministic Fixture 1 — `DEMO-WATER-01`

File:

> `DEMO-WATER-01.canonical.json`

Menggunakan evidence M0:

- `EVD-CLM-001`
- `EVD-FLD-001`
- `EVD-HUM-001`

Expected bundle:

```text
Decision Context
↓
3 evidence
↓
Assessment = complete
context_state = elevated_attention
confidence = medium
recommendation.mode = alternatives_only
↓
3 action options
↓
Optional Trusted Review = modified
↓
Human Decision
↓
Decision Record
↓
Optional handoff
```

### Important fixture-clock rule

Fixture M0 menggunakan `valid_until` yang terbatas.

Agar deterministic dan tidak tergantung tanggal komputer saat test:

> freshness fixture dihitung terhadap `assessment.evaluated_at`, bukan wall-clock saat test dijalankan.

Untuk canonical fixture happy-path, `evaluated_at` ditempatkan di dalam validity window fixture asli.

Ini **tidak** berarti `valid_until` adalah batas agronomis nyata.

---

# 21. Deterministic Fixture 2 — `DEMO-WATER-FALLBACK-01`

File:

> `DEMO-WATER-FALLBACK-01.canonical.json`

State:

```text
external climate evidence tersedia
+
local field observation tidak tersedia
↓
assessment.status = insufficient_evidence
confidence = low
recommendation.mode = abstained
↓
missing fresh local observation
↓
action options berfokus pada evidence recovery / review
↓
Decision Record = null
```

Ini membuktikan bahwa:

> no recommendation / abstain adalah valid output.

---

# 22. Validation Result

Kedua fixtures divalidasi terhadap:

> JSON Schema Draft 2020-12

dan cross-object invariants.

Result:

```text
DEMO-WATER-01.canonical.json
schema errors: 0
invariant errors: 0

DEMO-WATER-FALLBACK-01.canonical.json
schema errors: 0
invariant errors: 0
```

---

# 23. Fields yang Sengaja BELUM Dikunci

HOL-86 tidak mengarang:

## 23.1 Minimum evidence set

Belum diputuskan:
- evidence apa mandatory untuk `complete`;
- evidence apa soft-block;
- evidence apa optional.

→ HOL-87.

## 23.2 Freshness threshold

Belum diputuskan secara scientific.

→ HOL-87 + technical/agronomic source curation.

## 23.3 Conflict detection rule

Contract dapat membawa `issues`/status tetapi algoritmanya belum dikunci.

→ HOL-87.

## 23.4 Confidence semantics detail

Enum sudah ada.

Definisi bagaimana `low/medium/high` diperoleh:

→ HOL-87.

## 23.5 Recommendation ranking

Contract mendukungnya secara optional.

Decision produk + rule:

→ belum Frozen.

## 23.6 Authentication / permissions

Tidak menjadi bagian domain contract HOL-86.

→ HOL-88 + Full-stack.

## 23.7 Data retention / privacy access policy

Belum dikunci.

→ HOL-88.

## 23.8 Validated agronomic prescription

Belum ada.

Contract tidak membenarkan:

> “lakukan irigasi X jam.”

---

# 24. Versioning Policy

Current:

```text
contract_version = 0.1.0
```

## Sebelum v1.0 freeze

Perubahan contract harus dicatat eksplisit.

### Breaking

Contoh:
- menghapus field;
- mengganti type;
- membuat optional field menjadi required;
- mengubah arti semantic field;
- mengganti object identity/version semantics.

→ naikkan minor pre-release, misalnya `0.2.0`, dan lakukan reconciliation lintas team.

### Non-breaking additive

Contoh:
- menambah optional field;
- menambah example;
- menambah documentation.

→ dapat menjadi `0.1.x`, selama consumer tidak diwajibkan menggunakannya.

### Fixture-only correction

Jika schema tidak berubah:

→ fixture revision + changelog.

Setelah v1.0:
- SemVer normal digunakan;
- major = breaking contract.

---

# 25. API / Persistence Guidance — Non-binding

Contract ini **bukan** perintah membuat satu tabel besar.

Kemungkinan technical mapping:

```text
decision_contexts
evidence
assessments
assessment_evidence
action_options
trusted_reviews
decision_records
decision_record_evidence
handoffs (optional)
```

Tetapi:
- table design;
- ORM;
- DB;
- REST/GraphQL;
- event sourcing;

adalah keputusan Full-stack.

Yang wajib hanyalah semantic contract tetap konsisten.

---

# 26. Data Minimization

HOL-86 tidak membutuhkan:

- NIK;
- OTP;
- password;
- rekening;
- data finansial;
- precise personal identity anggota.

Actor minimal:

```json
{
  "role": "decision_facilitator"
}
```

`display_name` / `actor_id` optional.

---

# 27. Definition of Done HOL-86

| Criterion | Status v0.1 |
|---|---|
| Shared contract AI/Data–Full-stack–UX | ✅ |
| Evidence M0 compatibility dipertahankan | ✅ |
| Decision Context defined | ✅ |
| Evidence classes defined | ✅ |
| Assessment defined | ✅ |
| Action Options defined | ✅ |
| Trusted Review optional | ✅ |
| Decision Record core endpoint | ✅ |
| Task/handoff optional | ✅ |
| Source/provenance/freshness semantics | ✅ |
| MOCK/DEMO propagation | ✅ |
| 2 deterministic fixtures | ✅ |
| JSON Schema | ✅ |
| Fixtures pass schema validation | ✅ |
| Cross-object invariant validation | ✅ |
| Breaking/non-breaking policy | ✅ |
| Exact confidence/freshness/rules | ⏳ HOL-87 |
| Cross-team review | ⏳ |

---

# 28. Freeze Gate

HOL-86 dapat menjadi **v1.0 — FROZEN** setelah:

1. AI/Data menyetujui bahwa HOL-87 dapat menghasilkan output contract ini.
2. Full-stack menyetujui contract feasible untuk API/persistence.
3. UI/UX mengonfirmasi low-fi hanya membutuhkan field yang tersedia atau source gap yang eksplisit.
4. `DEMO-WATER-01` dan fallback tetap deterministic.
5. Tidak ada unresolved change yang material terhadap:
   - core journey;
   - object identity;
   - assessment semantics;
   - Decision Record trace.

---

# 29. Next Issue

Setelah v0.1 ini direview:

> **HOL-87 — Define transparent risk/reasoning baseline**

HOL-87 harus mengisi **semantics**, bukan mengubah domain contract tanpa issue/review:

- minimum evidence;
- freshness rules;
- confidence rules;
- factor/rule mapping;
- abstention;
- conflict behavior;
- option generation;
- optional ranking gate.

