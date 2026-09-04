# TUGAS — AI / DATA ENGINEER

**Role:** AI / Data Engineer  
**Fokus:** membuat evidence representation dan reasoning yang transparan, repeatable, dan sesuai data yang benar-benar tersedia.

---

# 0. Snapshot progres saat ini — 3 September 2026

Snapshot ini menyesuaikan progres repository dengan
`LAPORAN_KONTEKS_PROYEK_REMBUKTANI_v0.2.md`. Jika ada konflik, laporan konteks
v0.2 tetap menjadi source of truth yang lebih tinggi.

## Sudah selesai dan dapat digunakan ulang

| Artefak | Status | Catatan |
|---|---|---|
| M0 canonical evidence envelope | **Selesai / frozen sebagai v0.1** | Evidence eksternal, observasi lapangan, dan observasi manusia memakai envelope bersama. |
| Tiga fixture deterministic | **Selesai sebagai mock fixture** | `climate_external`, `field_observation`, dan `human_observation` sudah memiliki provenance dan label mock. |
| Data dictionary dan limitations M0 | **Selesai untuk scope M0** | Belum menggantikan BMKG data dictionary v0.2. |
| HOL-86 canonical contract v0.1 | **Selesai sebagai baseline** | Dua canonical example lolos schema dan invariant validation. |
| HOL-87 transparent reasoning v0.1 | **Selesai sebagai baseline** | Empat skenario semantic test lulus dan output kompatibel dengan HOL-86 v0.1. |

Referensi commit progres AI/Data:

- `e5e99ec` — migrasi fixture ke canonical evidence contract v0.1;
- `266a07a` — finalisasi evidence contract data dan schema M0.

## Perlu direconcile; belum boleh dianggap output v0.2

- Fixture climate M0 berisi `below_normal`, `12.5 mm`, dan `8 dry days`.
  Nilai tersebut tetap sah hanya sebagai **mock/test fixture**, bukan field yang
  diasumsikan berasal dari BMKG Public Forecast API.
- Input lapangan lama memakai kesimpulan seperti `critical_low` dan `dry`.
  Field Pulse v0.2 harus memakai observasi sederhana: `present`, `limited`,
  `none`, atau `unknown`; serta `flowing`, `limited`, `not_flowing`, atau
  `unknown`.
- HOL-86 v0.1 mempunyai `decision_context.crop_context`, tetapi belum memisahkan
  `Land`, `Active Crop Context`, dan `Decision Case` sesuai konsep produk terbaru.
- HOL-87 v0.1 tetap berguna untuk pola deterministic evaluation, abstention,
  missing/stale/conflict handling, dan alternatives-only; rule input-nya harus
  diaudit ulang terhadap payload BMKG aktual.

## Status task v0.2

| Task | Status saat ini | Next output / gate |
|---|---|---|
| 1. Audit Actual BMKG Payload | **Draft v0.2 selesai** | Dictionary + live sample excerpt tersedia; review adapter Full-stack masih diperlukan. |
| 2. Reconcile HOL-86 | **Proposal selesai** | Menunggu review Full-stack sebelum schema final diubah. |
| 3. Field Pulse Contract | **Draft v0.2 selesai** | Enum dan unknown/completeness semantics sudah ditetapkan. |
| 4. HOL-87 Reasoning v0.2 | **Draft + reference engine selesai** | Audit keep/modify/remove/replace dan ruleset v0.2 tersedia. |
| 5. Curated Source Pack v0.2 | **Draft selesai** | Setiap rule diberi source/status/limitation. |
| 6. BMKG → Canonical Mapping | **Draft selesai** | Perlu dicocokkan dengan bentuk output adapter Full-stack. |
| 7. Freshness Policy v0.2 | **Draft selesai** | Review cache behavior dengan Full-stack masih menjadi gate. |
| 8. Deterministic Test Scenarios | **Selesai untuk reference engine** | T1–T6 lulus; integrasi unit test backend belum dikerjakan Full-stack. |
| 9. Action Options v0.2 | **Draft selesai** | Empat ID bounded/non-prescriptive tanpa ranking tersedia. |
| 10. Explanation Contract v0.2 | **Draft selesai** | Structured explanation contract tersedia untuk PM/UX dan Full-stack. |

## Urutan kerja yang disarankan

```text
Task 1 — Audit payload BMKG aktual
  ↓
Task 3 — Kunci semantic Field Pulse
  ↓
Task 2 — Proposal rekonsiliasi HOL-86 + review Full-stack
  ↓
Task 6 dan 7 — Normalization mapping + freshness policy
  ↓
Task 4, 5, dan 9 — Reasoning, source pack, action options v0.2
  ↓
Task 8 dan 10 — Test scenarios + explanation contract
```

## Jawaban lima pertanyaan kerja role AI/Data

```text
Saya membuat apa?
Contract evidence dan reasoning deterministic v0.2 berbasis BMKG + Crop Context + Field Pulse.

Referensi saya apa?
Laporan konteks v0.2, payload/dokumentasi resmi BMKG, HOL-86 v0.1,
HOL-87 v0.1, HOL-88, dan output teknis Full-stack.

Output saya apa?
Data dictionary, reconciliation proposal, enum Field Pulse, canonical mapping,
freshness policy, ruleset, fixtures/tests, action options, dan explanation contract.

Output saya dipakai siapa?
Full-stack untuk schema/API/engine, serta PM/UX untuk evidence display dan copy/template.

Apa yang tidak boleh saya ubah sendiri?
Semantic contract final sebelum review Full-stack, keputusan produk, final human decision,
dan threshold/rekomendasi agronomis yang belum mempunyai sumber tervalidasi.
```

---

# 1. Target role ini

AI/Data harus membuat sistem mampu melakukan:

```text
BMKG Evidence
+
Crop Context
+
Field Pulse
↓
Explainable Assessment
↓
Missing Evidence / Limitation
↓
Bounded Action Options
```

AI/Data **tidak** membuat final human decision.

---

# 2. Bacaan wajib

1. `LAPORAN_KONTEKS_PROYEK_REMBUKTANI_v0.2.md`
2. HOL-86 canonical contract.
3. HOL-87 v0.1 — sebagai baseline yang harus direconcile.
4. HOL-88 safety boundary.
5. BMKG Official Public Forecast API:
   `https://data.bmkg.go.id/prakiraan-cuaca/`
6. Output Full-stack:
   - raw BMKG sample;
   - location/adm4 spike;
   - API/schema draft.

---

# 3. TASK 1 — Audit Actual BMKG Payload

### Kerjakan

Ambil beberapa sample dari BMKG official API menggunakan `adm4`.

Dokumentasikan:
- top-level response;
- field prakiraan;
- timestamp;
- missing/null possibility;
- granularity;
- source metadata;
- update pattern.

### Field dokumentasi official

- `utc_datetime`
- `local_datetime`
- `t`
- `hu`
- `weather_desc`
- `weather_desc_en`
- `ws`
- `wd`
- `tcc`
- `vs_text`
- `analysis_date`

### Output

`BMKG_DATA_DICTIONARY.md`

Isi:

| Field BMKG | Arti | Tipe | Digunakan M2? | Alasan |
|---|---|---|---|---|

### Selesai jika

Full-stack dan PM tahu field mana yang:
- ditampilkan;
- disimpan;
- dipakai reasoning;
- hanya raw metadata.

---

# 4. TASK 2 — Reconcile HOL-86

### Masalah

Konsep baru menambah/separates:
- `Land`;
- `CropContext`;
- `DecisionCase`.

### Kerjakan

Buat proposal reconciliation.

Jangan langsung mengubah semantic contract tanpa review.

Tentukkan:

```text
Land
↓
Active Crop Context
↓
Decision Case / DecisionContext
↓
Evidence
↓
Assessment
```

### Output

`HOL86_RECONCILIATION_v0.2.md`

Isi:
- field/entity yang perlu ditambah;
- field yang tetap;
- breaking/non-breaking;
- migration impact;
- JSON example.

### Handoff
Review dengan Full-stack sebelum schema final.

---

# 5. TASK 3 — Field Pulse Semantic Contract

### User-facing

Air:
- Ada
- Sedikit
- Tidak Ada
- Tidak Yakin

Irigasi:
- Mengalir
- Terbatas
- Tidak Mengalir
- Tidak Tahu

### Kerjakan

Definisikan enum backend sederhana.

Contoh working form:

```text
water_presence:
present | limited | none | unknown

irrigation_flow:
flowing | limited | not_flowing | unknown
```

Nama enum final boleh berubah saat review.

### Penting

Enum harus merepresentasikan **observasi**, bukan risk conclusion.

Jangan:

```text
critical_low
high_risk
danger
```

sebagai input user.

### Output

`FIELD_PULSE_CONTRACT_v0.2.md`

Isi:
- user label;
- enum;
- meaning;
- missing/unknown semantics;
- effect on evidence completeness.

---

# 6. TASK 4 — HOL-87 v0.2 Reasoning Design

### Keputusan

Kita memilih:

> Reasoning menggunakan data BMKG yang benar-benar tersedia.

### Kerjakan

Audit rule v0.1 satu per satu:

```text
Keep
Modify
Remove
Replace
```

Khusus:
- `below_normal`;
- `12.5mm`;
- `8 dry days`;

tidak boleh dianggap berasal dari public BMKG forecast tanpa mapping/source yang valid.

### Rancang input v0.2

Minimal:

```text
BMKG forecast evidence
Crop Context
Field Pulse
```

### Rancang output

Tetap sederhana:

```text
assessment.status
context_state
confidence
factors[]
missing_evidence[]
limitations[]
action_options[]
recommendation.mode
```

### Penting

Tidak perlu menggunakan semua field BMKG.

Gunakan field hanya jika:
1. relevan terhadap keputusan;
2. semantic rule dapat dijelaskan;
3. punya sumber teknis;
4. tidak membuat threshold palsu.

### Jangan

- jangan buat formula risk score 0–100;
- jangan mengubah suhu/kelembapan menjadi risiko agronomi tanpa source;
- jangan menganggap weather_desc tertentu otomatis berarti sawah kekurangan air;
- jangan pakai LLM untuk memutuskan.

### Output

`HOL87_REASONING_BASELINE_v0.2.md`
`ruleset_water_v0.2.json`

---

# 7. TASK 5 — Curated Source Pack

### Kerjakan

Untuk setiap rule v0.2, dokumentasikan:

```text
rule_id
purpose
input
logic
source
status
limitation
```

Status:

- `system_policy`
- `curated_rule`
- `prototype_rule`

### Fokus

Kita tidak perlu memaksakan agronomic rule kompleks.

Kalau evidence belum cukup:
> system boleh abstain.

### Output

`CURATED_SOURCE_PACK_v0.2.md`

---

# 8. TASK 6 — Evidence Normalization Mapping

### Kerjakan

Tentukan mapping:

```text
BMKG raw JSON
↓
External Evidence canonical object
```

Jaga:
- source = BMKG;
- provenance;
- forecast time;
- analysis_date;
- location/adm4;
- fetch time;
- freshness basis;
- raw payload reference;
- mock/live.

### Output

`BMKG_TO_CANONICAL_MAPPING.md`

Berikan sample JSON yang bisa langsung dipakai Full-stack.

---

# 9. TASK 7 — Freshness Policy

### Kerjakan

Definisikan freshness berdasarkan data BMKG tanpa mengarang agronomic expiry.

Bedakan:

```text
source data freshness
≠
agronomic validity
```

Contoh:
- data forecast punya `analysis_date`;
- forecast punya waktu target;
- cache punya `fetched_at`.

Tentukan kapan UI harus:
- current;
- stale;
- unavailable.

### Output

`EVIDENCE_FRESHNESS_POLICY_v0.2.md`

Review dengan Full-stack.

---

# 10. TASK 8 — Deterministic Test Scenarios

Minimal:

## T1 — Normal
BMKG tersedia + Field Pulse jelas.

## T2 — Field Pulse Unknown
BMKG tersedia, local condition unknown.

## T3 — BMKG unavailable
No valid cache.

## T4 — Cached BMKG
Live fail, valid cache available.

## T5 — Conflicting Human/Field observation
Jika conflict semantics tetap dipakai.

## T6 — Reasoning failure
Assessment unavailable.

### Output

- fixture JSON;
- expected result JSON;
- unit tests.

### Selesai jika
Same input + same evaluation time = same output.

---

# 11. TASK 9 — Action Options v0.2

### Kerjakan

Action options harus:
- bounded;
- understandable;
- evidence-aware;
- non-prescriptive.

Contoh tipe:
- verify local condition;
- collect missing information;
- request trusted review;
- defer.

Jangan memberi:
- berapa jam irigasi;
- volume air;
- instruksi pompa/gate;
- best option ranking.

### Output

`ACTION_OPTIONS_v0.2.json`
+ documentation.

---

# 12. TASK 10 — Explanation / Decision Brief Data

### Kerjakan

Berikan structured fields agar UI bisa menulis:

```text
Kenapa?
Apa yang belum diketahui?
Seberapa kuat dasarnya?
Apa limitation-nya?
```

Decision Brief tidak menggunakan LLM bebas.

AI/Data memberikan data terstruktur, PM/UX menentukan copy/template, Full-stack melakukan formatting.

### Output

`EXPLANATION_CONTRACT_v0.2.md`

---

# 13. Handoff ke Full-stack

AI/Data wajib memberikan:

- BMKG data dictionary;
- normalized evidence example;
- canonical schema reconciliation;
- Field Pulse enum;
- reasoning rules;
- action option IDs;
- expected scenarios;
- error/unavailable semantics.

Full-stack **tidak boleh harus membaca Python code untuk mengetahui contract**.

---

# 14. Handoff dari Full-stack

AI/Data membutuhkan:

- actual BMKG sample;
- adapter output;
- cache behavior;
- location/adm4 mapping;
- persistence model;
- API constraints.

---

# 15. Jangan dilakukan

- jangan training ML hanya agar terlihat AI;
- jangan membuat model prediksi cuaca baru;
- jangan membuat angka probabilitas tanpa calibration;
- jangan membuat recommendation ranking;
- jangan membuat final Decision Record;
- jangan menambah source API hanya karena tersedia;
- jangan menganggap external weather = local water condition.
