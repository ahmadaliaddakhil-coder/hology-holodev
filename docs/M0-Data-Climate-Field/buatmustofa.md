# RembukTani — M0 Technical Evidence Contract v0.1

**Owner:** Data / ML / AI Engineer
**Phase:** M0 — Problem Evidence Locked
**Task:** Technical Spike — Climate & Field Evidence Fixtures
**Status awal:** In Progress
**Output akhir:** Evidence Contract v0.1
**Setelah acceptance criteria terpenuhi:** FROZEN

---

# 1. Konteks Project

Kita sedang membangun **RembukTani**.

RembukTani **bukan aplikasi prediksi cuaca**, bukan sistem rekomendasi pertanian otomatis, dan bukan AI yang menggantikan penyuluh.

Problem hypothesis kita saat ini:

> Agricultural intelligence seperti data iklim dan rekomendasi pertanian sudah tersedia, tetapi masih terdapat potensi gap ketika informasi tersebut harus dipertemukan dengan kondisi aktual hamparan dan penilaian manusia untuk menghasilkan keputusan yang kontekstual dan dapat dipercaya.

Secara sederhana:

**External Agricultural Intelligence**

- **Local Field Context**
- **Human Observation**
  ↓
  **Contextual Reasoning**
  ↓
  **Decision Support**

Pada M0 kita **belum membangun Contextual Reasoning atau Risk Engine final**.

Tugas technical M0 adalah memastikan bahwa berbagai evidence yang nantinya digunakan sistem dapat:

1. direpresentasikan secara konsisten;
2. diketahui sumbernya;
3. diketahui waktunya;
4. diketahui lokasinya;
5. diketahui kualitasnya;
6. dibedakan antara external, field, dan human evidence;
7. tetap tersedia ketika external API tidak dapat digunakan;
8. digunakan ulang secara repeatable pada M1.

---

# 2. Tujuan Task

Technical spike ini harus menjawab satu pertanyaan:

> **“Apakah kita dapat membangun satu kontrak data evidence yang cukup konsisten untuk merepresentasikan climate intelligence, kondisi hamparan, dan observasi manusia tanpa bergantung pada API live?”**

Jika jawabannya iya, M1 dapat menggunakan evidence contract tersebut untuk membangun:

- Evidence Board;
- contextual/risk reasoning;
- explanation layer;
- human review;
- dan decision workflow.

---

# 3. Yang Sudah Tersedia

Saat ini sudah ada tiga fixture awal:

## A. Climate Signal

Contoh data eksternal terkait:

- lokasi;
- rainfall category;
- precipitation;
- consecutive dry days;
- forecast horizon;
- timestamp.

## B. Field Condition

Contoh data lokal terkait:

- hamparan;
- crop;
- growth stage;
- planting date;
- water condition;
- irrigation condition;
- field observation;
- reporter.

## C. Manual Fallback

Contoh input manual ketika:

- external source tidak tersedia;
- data berada di luar coverage;
- atau user membutuhkan local observation.

Fixture yang sudah ada **jangan dibuang**.

Gunakan sebagai starting material untuk dimigrasikan ke schema baru.

---

# 4. Prinsip Utama Evidence Contract

Semua jenis evidence harus menggunakan satu **canonical envelope**.

Jangan membuat:

```text
climate schema A

field schema B

PPL schema C
```

yang sama sekali berbeda.

Kita ingin:

```text
Evidence Envelope
│
├── identity
├── type
├── source
├── provenance
├── location
├── temporal information
├── quality
└── payload
```

Payload dapat berbeda sesuai tipe evidence, tetapi metadata utamanya konsisten.

---

# 5. Evidence Type M0

Untuk M0 hanya gunakan **tiga evidence type**.

## 1. `climate_external`

Untuk data climate/weather/agricultural intelligence yang berasal dari external source.

Contoh:

- BMKG fixture;
- climate forecast snapshot;
- rainfall signal.

---

## 2. `field_observation`

Untuk observasi kondisi aktual hamparan.

Contoh:

- kondisi air;
- kondisi irigasi;
- fase tanaman;
- debit air;
- observasi visual.

---

## 3. `human_observation`

Untuk input manusia yang menjadi evidence tambahan.

Contoh:

- observasi PPL;
- observasi ketua kelompok;
- manual fallback ketika external source unavailable.

**Human observation bukan human override.**

Human observation adalah:

> manusia memberikan evidence.

Human override adalah:

> manusia mengubah keputusan/rekomendasi sistem.

Human override baru akan dibahas di M1/M2.

---

# 6. Canonical Evidence Schema

Buat schema dasar seperti berikut.

```json
{
  "evidence_id": "EVD-CLM-001",

  "evidence_type": "climate_external",

  "source": {
    "category": "official_mock",
    "name": "BMKG"
  },

  "provenance": {
    "collection_mode": "fixture",
    "is_mock": true
  },

  "location": {
    "province": "Jawa Timur",
    "regency": "Kabupaten Malang",
    "district": "Kepanjen",
    "coordinates": {
      "lat": -8.1283,
      "lng": 112.5721
    }
  },

  "observed_at": "2026-08-30T00:00:00Z",
  "valid_until": "2026-09-06T00:00:00Z",

  "quality": {
    "level": "high",
    "basis": "official_source_mock_fixture"
  },

  "payload": {}
}
```

Schema final tidak harus 100% sama persis dengan contoh, tetapi secara konsep harus memiliki field-field tersebut.

---

# 7. Field Wajib Evidence Envelope

## `evidence_id`

### Fungsi

Unique identifier.

Contoh:

```text
EVD-CLM-001
EVD-FLD-001
EVD-HUM-001
```

### Required

Yes.

---

## `evidence_type`

### Possible values M0

```text
climate_external
field_observation
human_observation
```

### Required

Yes.

---

## `source`

Minimal:

```json
{
  "category": "...",
  "name": "..."
}
```

Possible category:

```text
official
official_mock
farmer_observation
group_observation
extension_worker
synthetic
```

Jangan terlalu banyak enum pada M0.

---

# 8. Provenance

Setiap evidence harus dapat menjawab:

> Data ini diperoleh bagaimana?

Minimal:

```json
{
  "collection_mode": "fixture",
  "is_mock": true
}
```

Possible collection mode:

```text
fixture
manual
external_api
import
```

Untuk M0 kemungkinan besar:

```text
fixture
manual
```

cukup.

---

# 9. Location

Untuk prototype, minimal:

```json
{
  "province": "...",
  "regency": "...",
  "district": "..."
}
```

Coordinates boleh tersedia tetapi tidak wajib untuk semua evidence.

Jangan menyimpan koordinat presisi individu apabila tidak dibutuhkan.

M0 hanya membutuhkan geographical context yang cukup untuk mengaitkan evidence.

---

# 10. Temporal Information

Gunakan:

```text
observed_at
valid_until
```

## `observed_at`

Artinya:

> kapan evidence tersebut dihasilkan atau diamati?

## `valid_until`

Artinya:

> sampai kapan evidence tersebut masih dianggap relevan untuk prototype?

Jangan gunakan:

```text
freshness = "valid_until_7d"
```

sebagai string opaque.

Dengan timestamp eksplisit, nanti sistem dapat menghitung:

```text
fresh
stale
expired
```

di M1.

---

# 11. Quality

Untuk M0 **jangan gunakan numeric confidence** seperti:

```text
0.85
0.90
0.65
```

kecuali ada formula/rubric yang benar-benar terdefinisi.

Gunakan:

```json
{
  "level": "high",
  "basis": "direct_field_observation"
}
```

Possible level:

```text
high
medium
low
unknown
```

Contoh basis:

```text
official_source_mock_fixture
direct_field_observation
manual_extension_worker_observation
estimated_observation
```

Tujuan field ini bukan membuat scientific probability.

Tujuannya membuat kualitas evidence dapat dijelaskan.

---

# 12. Climate External Fixture

Migrasikan climate fixture existing ke canonical evidence schema.

Target contoh:

```json
{
  "evidence_id": "EVD-CLM-001",

  "evidence_type": "climate_external",

  "source": {
    "category": "official_mock",
    "name": "BMKG"
  },

  "provenance": {
    "collection_mode": "fixture",
    "is_mock": true
  },

  "location": {
    "province": "Jawa Timur",
    "regency": "Kabupaten Malang",
    "district": "Kepanjen"
  },

  "observed_at": "2026-08-30T00:00:00Z",
  "valid_until": "2026-09-06T00:00:00Z",

  "quality": {
    "level": "high",
    "basis": "official_source_mock_fixture"
  },

  "payload": {
    "forecast_horizon_days": 10,
    "rainfall_category": "below_normal",
    "forecast_precipitation_total_mm": 12.5,
    "consecutive_dry_days": 8
  }
}
```

---

# 13. Climate Fixture — Hal yang Tidak Boleh Ada

Raw climate fixture **tidak boleh langsung menyimpan internal RembukTani risk result**.

Contoh yang harus dihapus:

```json
"drought_risk": "moderate_high"
```

jika nilai tersebut sebenarnya merupakan kesimpulan sistem kita.

Raw evidence:

```text
Below-normal rainfall
8 dry days
12.5 mm forecast
```

Risk engine nanti:

```text
Water stress risk = elevated
```

Harus terpisah.

Prinsip:

> **Evidence is not inference.**

---

# 14. Field Observation Fixture

Migrasikan field fixture ke canonical evidence schema.

Contoh:

```json
{
  "evidence_id": "EVD-FLD-001",

  "evidence_type": "field_observation",

  "source": {
    "category": "group_observation",
    "name": "Demo Farmer Group"
  },

  "provenance": {
    "collection_mode": "fixture",
    "is_mock": true
  },

  "location": {
    "hamparan_name": "Blok Tirto A3",
    "district": "Kepanjen"
  },

  "observed_at": "2026-08-30T07:30:00Z",
  "valid_until": "2026-08-31T07:30:00Z",

  "quality": {
    "level": "high",
    "basis": "direct_field_observation_fixture"
  },

  "payload": {
    "crop": "rice",
    "variety": "Inpari 32",
    "growth_stage": "flowering",
    "planting_date": "2026-06-15",

    "water_status": "critical_low",
    "irrigation_status": "dry",

    "field_observation": {
      "soil_crack": "shallow",
      "irrigation_flow_percentage": 20
    },

    "notes": "Demo observation"
  }
}
```

---

# 15. Pisahkan Crop dan Variety

Jangan:

```text
commodity = Padi Inpari 32
```

Gunakan:

```text
crop = rice
variety = Inpari 32
```

Alasannya:

- query lebih mudah;
- reasoning lebih jelas;
- schema konsisten;
- nanti dapat mendukung varietas lain.

---

# 16. Growth Stage

Gunakan controlled vocabulary.

Untuk M0 cukup tetapkan beberapa nilai awal:

```text
vegetative
panicle_initiation
flowering
grain_filling
maturity
unknown
```

Jangan membiarkan setiap fixture membuat istilah sendiri seperti:

```text
generative
generative_flowering
flowering_stage
flowering
```

Pilih satu vocabulary.

Dokumentasikan.

---

# 17. Structured Observation

Informasi yang mungkin digunakan reasoning jangan hanya disimpan pada `notes`.

Contoh buruk:

```text
notes:
"debit air tinggal 20%"
```

Contoh lebih baik:

```json
"field_observation": {
  "irrigation_flow_percentage": 20
}
```

`notes` tetap boleh ada untuk informasi tambahan.

Prinsip:

> jika data memengaruhi reasoning, buat structured field.

---

# 18. Human Observation / Manual Fallback

Manual fallback existing perlu dipindahkan menjadi evidence type:

```text
human_observation
```

Contoh:

```json
{
  "evidence_id": "EVD-HUM-001",

  "evidence_type": "human_observation",

  "source": {
    "category": "extension_worker",
    "name": "PPL"
  },

  "provenance": {
    "collection_mode": "manual",
    "is_mock": true,
    "fallback_reason": "external_source_unavailable"
  },

  "location": {
    "district": "Kepanjen"
  },

  "observed_at": "2026-08-30T10:00:00Z",
  "valid_until": "2026-08-31T10:00:00Z",

  "quality": {
    "level": "medium",
    "basis": "manual_extension_worker_observation_fixture"
  },

  "payload": {
    "estimated_rainfall_category": "below_normal",
    "estimated_water_availability": "critical_low",

    "observation_basis": "secondary_irrigation_gate_observation"
  }
}
```

---

# 19. Manual Fallback ≠ Override

Jangan menggunakan nama:

```text
manual_override_data
```

karena orang yang memasukkan evidence belum tentu mengubah keputusan sistem.

Gunakan konsep:

```text
manual observation
```

Human override nanti baru berbentuk:

```json
{
  "decision": "modified",
  "reason": "..."
}
```

dan itu bukan scope M0.

---

# 20. Privacy Rule

Fixture M0 tidak boleh mengandung:

- NIK;
- phone number;
- account identifier nyata;
- alamat rumah personal;
- password;
- credential;
- identifier narasumber nyata.

Gunakan:

```text
DEMO-PPL-001
DEMO-GROUP-001
```

jika identifier diperlukan.

Tetapi lebih baik hanya role apabila ID tidak memengaruhi reasoning.

---

# 21. Mock Data Labelling

Semua fixture demo harus secara eksplisit mengatakan apakah:

```text
mock
synthetic
simulated
real
official
```

Untuk fixture M0 kita:

> mostly mock/synthetic.

Contoh:

```json
"provenance": {
  "collection_mode": "fixture",
  "is_mock": true
}
```

Jangan menggunakan:

```text
Source: BMKG
```

tanpa menjelaskan bahwa nilainya mock apabila memang bukan hasil API BMKG nyata.

Lebih baik:

```text
source.category = official_mock
source.name = BMKG
provenance.is_mock = true
```

---

# 22. Data Dictionary

Buat file:

```text
DATA_DICTIONARY.md
```

Minimal berisi:

| Field                      | Type          | Required | Description          | Allowed Values / Example |
| -------------------------- | ------------- | -------: | -------------------- | ------------------------ |
| evidence_id                | string        |      yes | Unique evidence ID   | EVD-CLM-001              |
| evidence_type              | enum          |      yes | Jenis evidence       | climate_external         |
| source.category            | enum          |      yes | Jenis source         | official_mock            |
| source.name                | string        |      yes | Nama source          | BMKG                     |
| provenance.collection_mode | enum          |      yes | Cara data diperoleh  | fixture                  |
| provenance.is_mock         | boolean       |      yes | Data mock atau bukan | true                     |
| observed_at                | datetime      |      yes | Waktu evidence       | ISO 8601                 |
| valid_until                | datetime/null |      yes | Batas relevansi      | ISO 8601                 |
| quality.level              | enum          |      yes | Kualitas evidence    | high                     |
| quality.basis              | string        |      yes | Dasar penilaian      | direct observation       |
| payload                    | object        |      yes | Data evidence        | depends on type          |

Tambahkan field khusus payload climate dan field.

---

# 23. File Structure yang Diharapkan

Direkomendasikan:

```text
data/
└── evidence/
    ├── schema/
    │   └── evidence.schema.json
    │
    ├── fixtures/
    │   ├── climate_external.json
    │   ├── field_observation.json
    │   └── human_observation.json
    │
    ├── DATA_DICTIONARY.md
    └── LIMITATIONS.md
```

Boleh disesuaikan dengan struktur repository.

---

# 24. JSON Schema

Jika memungkinkan dalam waktu M0, buat:

```text
evidence.schema.json
```

Tujuannya supaya tiga fixture dapat divalidasi secara otomatis.

Minimum validation:

- required fields;
- evidence_type enum;
- quality enum;
- datetime format;
- payload object.

Tidak perlu membuat ontology atau validation framework yang kompleks.

---

# 25. Parser Test

Buat script/test sederhana yang:

1. membaca ketiga fixture;
2. memvalidasi JSON;
3. memastikan mandatory metadata tersedia;
4. mengeluarkan normalized evidence list.

Contoh conceptual output:

```json
[
  {
    "id": "EVD-CLM-001",
    "type": "climate_external"
  },
  {
    "id": "EVD-FLD-001",
    "type": "field_observation"
  },
  {
    "id": "EVD-HUM-001",
    "type": "human_observation"
  }
]
```

Tidak perlu risk calculation.

---

# 26. Reproducibility Requirement

Fixture harus:

- dapat dibaca tanpa internet;
- tidak berubah ketika dijalankan ulang;
- tidak membutuhkan API token;
- tidak membutuhkan credentials;
- dapat dimuat di local environment;
- dapat digunakan pada staging/demo.

Tujuan:

> demo tidak gagal hanya karena external service unavailable.

---

# 27. LIMITATIONS.md

Buat file:

```text
LIMITATIONS.md
```

Minimal tuliskan:

## Current Data Status

- climate evidence masih mock fixture;
- field observation masih simulated fixture;
- human/PPL observation masih simulated;
- belum berasal dari target farmer-group primary research.

## Current Limitations

- belum merepresentasikan distribusi kondisi pertanian Indonesia;
- belum tervalidasi sebagai agronomic ground truth;
- belum digunakan untuk training predictive model;
- quality level bukan probabilitas ilmiah;
- valid_until merupakan prototype data-validity rule;
- schema dapat berubah setelah primary validation.

## Intended Use

> technical prototyping and deterministic HOLOGY demo.

## Not Intended For

> real agricultural decision making without domain validation.

---

# 28. README Singkat

Tambahkan penjelasan:

> Apa fungsi fixture?

Contoh:

```text
These fixtures are deterministic mock evidence used to test
RembukTani's evidence-ingestion and contextual-reasoning architecture.

They are not real farmer records and must not be interpreted
as validated agricultural recommendations.
```

---

# 29. Apa yang Tidak Perlu Dikerjakan di M0

**STOP apabila mulai masuk ke area ini:**

- ML model training;
- drought prediction;
- yield prediction;
- crop disease prediction;
- recommendation ranking;
- LLM agronomic advice;
- action optimization;
- evidence weighting algorithm;
- conflict-resolution algorithm;
- complex confidence score;
- live BMKG integration;
- live SI Katam integration;
- vector database/RAG;
- knowledge graph.

Semua itu **bukan task ini**.

---

# 30. Yang Diteruskan ke M1

Setelah Evidence Contract freeze, M1 dapat menggunakan schema ini untuk membangun:

## Evidence reasoning

```text
Climate Evidence
+
Field Evidence
+
Human Evidence
↓
Context
```

## Missing evidence handling

```text
Evidence incomplete
↓
Confidence reduced
```

## Stale evidence handling

```text
old evidence
↓
verification requested
```

## Conflicting evidence

```text
regional signal
!=
field observation
↓
requires verification
```

## Risk reasoning

```text
Context
↓
Risk State
```

Tetapi semua itu baru dikerjakan setelah task M0 ini ditutup.

---

# 31. Checkpoint P0 — Evidence Contract

Sebelum task boleh dianggap selesai, lakukan checkpoint berikut.

### Checkpoint A — Canonical Schema

- [ ] Ada satu Evidence Envelope.
- [ ] Semua evidence mengikuti envelope yang sama.

### Checkpoint B — Evidence Types

- [ ] `climate_external`
- [ ] `field_observation`
- [ ] `human_observation`

### Checkpoint C — Provenance

- [ ] Source jelas.
- [ ] Collection mode jelas.
- [ ] Mock status jelas.

### Checkpoint D — Temporal

- [ ] `observed_at` tersedia.
- [ ] `valid_until` tersedia atau nullable dengan alasan.

### Checkpoint E — Quality

- [ ] `high / medium / low / unknown`.
- [ ] Setiap quality mempunyai basis.
- [ ] Tidak ada arbitrary scientific confidence score.

---

# 32. Checkpoint P0 — Fixture Quality

## Climate

- [ ] Tidak mencampur raw evidence dengan internal risk.
- [ ] Forecast horizon memiliki arti jelas.
- [ ] Precipitation field memiliki unit dan semantic meaning.

## Field

- [ ] `crop` dan `variety` terpisah.
- [ ] `growth_stage` menggunakan controlled vocabulary.
- [ ] water dan irrigation status dibedakan.
- [ ] data penting tidak hanya berada di notes.

## Human

- [ ] Menggunakan `human_observation`.
- [ ] Manual input tidak disebut override.
- [ ] Tidak ada identifier personal nyata.

---

# 33. Checkpoint P1 — Documentation

- [ ] Data dictionary tersedia.
- [ ] LIMITATIONS.md tersedia.
- [ ] Fixture purpose terdokumentasi.
- [ ] Mock vs real dibedakan.
- [ ] Intended use jelas.
- [ ] Non-intended use jelas.

---

# 34. Checkpoint P1 — Technical Verification

- [ ] Ketiga JSON valid.
- [ ] Ketiganya dapat dibaca parser yang sama.
- [ ] Mandatory fields terdeteksi.
- [ ] Fixture dapat dijalankan offline.
- [ ] Output selalu repeatable.
- [ ] Tidak membutuhkan credentials/API live.

---

# 35. Output Akhir yang Harus Diserahkan

AI/Data Engineer menyerahkan:

```text
1. evidence.schema.json
2. climate_external.json
3. field_observation.json
4. human_observation.json
5. DATA_DICTIONARY.md
6. LIMITATIONS.md
7. optional parser/validation script
```

Tambahkan satu screenshot atau output command yang menunjukkan:

```text
3 fixtures loaded
3 fixtures valid
0 validation errors
```

jika parser/schema validation dibuat.

---

# 36. Handoff Note ke Tim

Setelah selesai, tuliskan ringkasan maksimal satu halaman:

## Evidence types

Apa saja?

## What is mock?

Apa yang simulated?

## What is reusable in M1?

Schema mana yang frozen?

## What remains unknown?

Apa yang masih menunggu primary validation?

## What moves to M1?

- stale handling;
- conflict handling;
- risk reasoning;
- action reasoning.

---

# 37. Definition of Done

Task:

**`[M0] Technical spike climate and field evidence fixtures`**

berstatus **DONE** hanya jika:

- [ ] canonical evidence contract tersedia;
- [ ] tiga evidence type tersedia;
- [ ] climate fixture migrated;
- [ ] field fixture migrated;
- [ ] human fallback migrated;
- [ ] provenance lengkap;
- [ ] temporal semantics lengkap;
- [ ] quality semantics jelas;
- [ ] evidence dan inference terpisah;
- [ ] fixture mock ditandai jelas;
- [ ] privacy requirement terpenuhi;
- [ ] data dictionary selesai;
- [ ] limitation note selesai;
- [ ] fixture valid dan repeatable.

---

# 38. Freeze Rule

Setelah checklist di atas terpenuhi:

> **M0 Technical Evidence Contract v0.1 → FROZEN**

Jangan melakukan improvement tambahan hanya karena ada pendekatan teknis yang lebih advanced.

Artefak hanya dibuka kembali jika:

1. primary evidence baru bertentangan dengan schema;
2. M1 menemukan technical blocker;
3. ada safety/privacy issue;
4. requirement kompetisi berubah;
5. schema ternyata tidak mampu membawa data yang dibutuhkan core journey.

Selain itu:

> improvement masuk Icebox / post-M0.

---

# 39. Definition of Success

Technical M0 dianggap berhasil apabila tim dapat menjawab:

> **“Bisakah RembukTani menerima climate intelligence, local field observation, dan human observation menggunakan kontrak data yang sama, lengkap dengan provenance dan temporal validity, tanpa membutuhkan API live?”**

Jika jawabannya:

> **Ya, dan dapat dibuktikan melalui tiga fixture yang valid dan repeatable**

maka technical spike selesai.

---

# 40. Final Instruction

Fokus tugas ini adalah:

> **Represent the evidence correctly.**

Bukan:

> predict the future.

Bukan:

> recommend farming actions.

Bukan:

> train AI.

Jika evidence contract bersih, M1 dapat membangun reasoning layer dengan fondasi yang benar.

Jika evidence contract buruk, seluruh Evidence Board, Risk Engine, explainability, dan human review di M1 akan menjadi sulit dipertanggungjawabkan.

Karena itu, target M0:

> **small, explicit, deterministic, traceable, and reusable evidence contract.**
