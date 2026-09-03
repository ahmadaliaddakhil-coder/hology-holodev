# RembukTani — HOL-87 Transparent Risk/Reasoning Baseline v0.1

**Linear Issue:** HOL-87 — `[M1] Define transparent risk-engine baseline`  
**Milestone:** M1 — Scope & UX Freeze  
**Owner:** AI/Data  
**Version:** 0.1.0  
**Tanggal:** 2 September 2026  
**Status:** **DRAFT — IMPLEMENTABLE / CROSS-TEAM & DOMAIN REVIEW REQUIRED**

---

## 1. Objective

HOL-87 mendefinisikan deterministic reasoning baseline yang mengubah canonical HOL-86 evidence menjadi:

```text
Evidence Evaluation
↓
Contextual Assessment
↓
Confidence
↓
Explainable Factors
↓
Missing Evidence / Limitations
↓
Bounded Action Options
```

HOL-87 **tidak** membuat:
- predictive ML;
- drought/yield model baru;
- autonomous agronomist;
- validated irrigation prescription;
- final human decision.

`DecisionRecord` tetap berada setelah system reasoning dan bukan output engine HOL-87.

---

# 2. Dependency

Hard dependency:

> `HOL-86 — Canonical Evidence & Decision Data Contract v0.1`

HOL-87 tidak mengubah schema HOL-86.

Output HOL-87 harus tetap valid terhadap contract `0.1.0`.

---

# 3. Reasoning Maturity

Baseline ini terdiri dari tiga jenis logic:

### A. `system_policy`

Menjaga:
- evidence completeness;
- freshness;
- relevance;
- abstention;
- confidence cap;
- recommendation gate.

Bukan agronomic knowledge.

### B. `curated_rule`

Klaim kualitatif yang memiliki basis technical/agronomic source.

v0.1 hanya menggunakan curated rule secara terbatas:

> flowering adalah stage sensitif terhadap water stress **ketika local water-shortage signal sudah ada**.

### C. `prototype_rule`

Logic deterministic yang diperlukan demo tetapi belum agronomically calibrated.

Contoh:
- fixture `rainfall_category=below_normal` menjadi dry-context signal;
- fixture `water_status=critical_low` menjadi local shortage signal;
- kombinasi keduanya → `elevated_attention`.

---

# 4. Conservative Confidence Semantics

HOL-87 v0.1 **tidak mengeluarkan `high` confidence**.

## `medium`

Artinya:

> Minimum external + local evidence tersedia/current/relevan dan engine dapat menghasilkan assessment deterministic, tetapi model/rule set masih prototype/mixed dan belum locally validated.

Ini **bukan** probabilitas 50–80% atau calibration statistic.

## `low`

Digunakan jika:
- blocking evidence missing;
- required local evidence stale;
- material direct conflict ditemukan;
- assessment harus abstain.

## `unknown`

Digunakan bila reasoning unavailable / tidak dapat dievaluasi.

## `high`

Reserved.

Tidak digunakan sampai:
- rule/model mendapat validation/calibration yang cukup;
- evidence quality/freshness semantics matang;
- tidak ada material uncertainty;
- product/domain review menyetujui.

---

# 5. Minimum Evidence Policy — M1

Untuk `assessment.status = complete`, baseline v0.1 membutuhkan:

1. satu `climate_external` yang:
   - schema valid;
   - current;
   - relevant;

2. satu `field_observation` yang:
   - schema valid;
   - current;
   - relevant;
   - memiliki `water_status` atau `irrigation_status`.

`human_observation`:

> optional.

**Important:**

Ini adalah **M1 product/safety policy** supaya product benar-benar mempertemukan external intelligence + local context.

Ini bukan klaim bahwa setiap agricultural decision secara universal membutuhkan dua evidence type tersebut.

Jika minimum evidence gagal:

```text
status = insufficient_evidence
confidence = low
recommendation.mode = abstained
```

---

# 6. Freshness Semantics

HOL-87 tidak menetapkan umur ilmiah universal untuk evidence.

Engine hanya mengonsumsi:

```text
observed_at
valid_until
evaluated_at
```

Rule:

```text
evaluated_at <= valid_until → current
evaluated_at > valid_until  → stale
valid_until absent          → unknown
```

Siapa yang menentukan `valid_until` secara production-quality masih source/domain-specific dan **belum dikunci**.

Untuk deterministic fixture:

> gunakan scenario `assessment.evaluated_at`, bukan wall-clock komputer.

---

# 7. Relevance Semantics — M1 Bounded Demo

Prototype relevance:

- district mismatch → `not_relevant`;
- field observation dengan `hamparan_name` berbeda → `not_relevant`;
- selain itu → `relevant`.

Ini cukup untuk bounded demo, bukan geo-spatial relevance engine.

---

# 8. Domain Rules v0.1

## PR-CLIMATE-001 — Dry climate context

**Status:** `prototype_rule`

Jika:

```text
climate_external.payload.rainfall_category = below_normal
```

maka tambahkan factor:

> External climate evidence membawa dry-context signal.

Tidak menyimpulkan:
- drought;
- soil-water deficit;
- irrigation requirement.

`consecutive_dry_days` tetap data pendukung yang dapat ditampilkan, tetapi **tidak memiliki numeric threshold rule** pada v0.1.

---

## PR-FIELD-001 — Local water-shortage fixture signal

**Status:** `prototype_rule`

Jika fixture/local taxonomy menyatakan:

```text
water_status ∈ {critical_low, very_low, low}
```

atau:

```text
irrigation_status = dry
```

maka tambahkan local-water-shortage factor.

HOL-87 tidak mengklaim taxonomy tersebut sudah scientifically calibrated.

---

## CR-STAGE-001 — Flowering sensitivity modifier

**Status:** `curated_rule`

Aktif hanya jika:

```text
growth_stage = flowering
AND
local water-shortage signal already exists
```

Effect:

> tambah attention modifier bahwa flowering merupakan stage sensitif terhadap water stress.

Basis:
- IRRI water-management/AWD guidance;
- drought literature/meta-analysis.

Tidak menghasilkan:
- irrigation amount;
- irrigation duration;
- yield-loss prediction.

---

## PR-COMBINE-001 — Elevated attention

**Status:** `prototype_rule`

Jika:

```text
dry climate context
AND
local water-shortage signal
```

maka:

```text
context_state = elevated_attention
```

Tidak ada score/probability.

---

# 9. Numeric Fixture Fields yang Sengaja Tidak Dijadikan Threshold

## `irrigation_flow_percentage = 20`

Tetap raw evidence.

HOL-87 **tidak** menggunakan rule:

```text
<= 20% → low/critical
```

karena source yang memvalidasi semantics itu belum ada.

## `consecutive_dry_days = 8`

Tetap raw evidence/context.

HOL-87 **tidak** menggunakan rule:

```text
>= 8 → drought
```

## `soil_crack = shallow`

Tidak menjadi decision threshold.

Ketiga field masih boleh muncul di UI sebagai raw/local evidence.

---

# 10. Conflict Semantics

HOL-87 v0.1 sangat konservatif.

Engine hanya mendeteksi **direct categorical conflict pada water status**, contoh:

```text
field water_status = critical_low
human estimated_water_availability = adequate
```

Output:

```text
context_state = conflicting_evidence
confidence = low
recommendation.mode = alternatives_only
```

System:
- menampilkan conflict;
- meminta observasi tambahan/review;
- tidak memilih source secara diam-diam.

### Yang BUKAN conflict otomatis

```text
regional rainfall = below_normal
local water = adequate
```

Ini dapat menjadi kondisi valid karena regional climate signal dan local field condition memang berbeda.

---

# 11. Context State v0.1

Working values:

```text
elevated_attention
no_elevated_signal
insufficient_evidence
conflicting_evidence
assessment_unavailable
```

`no_elevated_signal` berarti:

> rule v0.1 tidak menemukan configured elevated signal.

Bukan:

> tidak ada agronomic risk.

---

# 12. Action Option Policy

Action options harus:

- bounded;
- auditable;
- tidak menjadi direct prescription;
- menjelaskan rationale;
- membawa required/missing evidence jika relevant.

## Happy path

HOL-87 menghasilkan:

1. `Verifikasi dan siapkan penyesuaian` — conditional
2. `Tambah evidence sebelum mengubah rencana`
3. `Minta trusted review`

Tidak ada:
- jumlah air;
- durasi irigasi;
- perintah membuka gate/pompa.

## Insufficient evidence

Engine menghasilkan options seperti:
- update Field Pulse;
- update climate evidence jika missing;
- request trusted review.

---

# 13. Recommendation Gate v0.1

## Insufficient evidence

```text
mode = abstained
recommended_option_id = null
```

## Complete / conflict

```text
mode = alternatives_only
recommended_option_id = null
```

## Ranked recommendation

**Disabled.**

HOL-86 sudah future-proof dengan nullable `recommended_option_id`, tetapi HOL-87 v0.1 tidak mengaktifkannya.

Reason:

- ranking belum locally validated;
- curated source mendukung pattern DSS, bukan ranking RembukTani;
- UX/product decision masih working.

---

# 14. Human Authority Boundary

Reasoning engine:
- boleh menghasilkan assessment;
- boleh menghasilkan alternatives;
- tidak membuat TrustedReview;
- tidak membuat DecisionRecord;
- tidak mengubah human decision.

Output reasoner berhenti di:

```text
workflow_state = options_ready
```

atau:

```text
workflow_state = insufficient_evidence
```

Final authority tetap manusia.

---

# 15. Deterministic Scenarios

## T1 — `DEMO-WATER-01`

Expected:

```text
status = complete
context_state = elevated_attention
confidence = medium
baseline_status = mixed
recommendation.mode = alternatives_only
3 action options
DecisionRecord = null pada output reasoner
```

Kenapa `mixed`:

- `PR-CLIMATE-001` prototype;
- `PR-FIELD-001` prototype;
- `CR-STAGE-001` curated qualitative modifier;
- `PR-COMBINE-001` prototype.

### Important change dari HOL-86 example fixture

HOL-87 **tidak** menjadikan `20% irrigation flow` sebagai independent low-flow rule.

Nilai `20%` tetap raw evidence.

---

## T2 — `DEMO-WATER-FALLBACK-01`

Hanya climate evidence.

Expected:

```text
status = insufficient_evidence
context_state = insufficient_evidence
confidence = low
recommendation.mode = abstained
missing = fresh local water observation
```

---

## T3 — `DEMO-WATER-CONFLICT-01`

Synthetic test:

```text
field water = critical_low
human water availability = adequate
```

Expected:

```text
context_state = conflicting_evidence
confidence = low
alternatives_only
```

Digunakan untuk test logic, bukan klaim bahwa conflict tersebut telah ditemukan di lapangan.

---

## T4 — `DEMO-WATER-STALE-01`

Synthetic test:

field evidence melewati `valid_until`.

Expected:

```text
freshness = stale
status = insufficient_evidence
confidence = low
abstained
```

---

# 16. Implementation Files

- `ruleset_water_v0.1.json`
- `reasoning_engine.py`
- `test_reasoning_engine.py`
- `validate_hol86_compatibility.py`
- four deterministic `*.reasoned.json` scenarios
- `HOL86_RECONCILIATION.md`
- curated source pack

---

# 17. Definition of Done

HOL-87 v0.1 siap cross-team review jika:

- same input + evaluation time → same output;
- output valid terhadap HOL-86 schema;
- happy path = medium, not high;
- fallback = low + abstain;
- stale local evidence tidak silently digunakan;
- direct material conflict surfaced;
- each factor links to evidence + rule ID;
- curated vs prototype rule terlihat;
- no numeric fixture field dipromosikan menjadi scientific threshold;
- no free-form agronomic LLM command;
- no DecisionRecord dibuat oleh engine;
- ranked recommendation disabled;
- limitations selalu tersedia.

---

# 18. Belum Selesai / Tidak Diklaim

HOL-87 belum menyelesaikan:

- calibrated probability/confidence;
- locally validated threshold;
- prescription irrigation;
- source reliability weighting;
- general conflict engine;
- ranked best suggestion;
- learning from outcomes;
- ML training.

Perubahan bagian tersebut membutuhkan new evidence + evaluation, bukan sekadar refinement copy.
