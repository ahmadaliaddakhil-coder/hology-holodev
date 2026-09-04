# TUGAS — FULL-STACK ENGINEER

**Role:** Full-stack Engineer  
**Fokus:** membuat aplikasi, database, API, integrasi BMKG, dan UI benar-benar bekerja end-to-end.

---

# 1. Target role ini

Ketika M2 selesai, Full-stack harus dapat menjalankan:

```text
Pilih Lahan
→ ambil BMKG otomatis
→ simpan Field Pulse
→ kirim canonical evidence ke reasoner
→ tampilkan assessment/options
→ simpan human decision
→ generate Decision Brief
```

tanpa edit database manual.

---

# 2. Bacaan wajib sebelum coding

1. `LAPORAN_KONTEKS_PROYEK_REMBUKTANI_v0.2.md`
2. HOL-86 canonical contract — sebagai semantic reference, **tetapi ingat akan direconcile dengan model Lahan/Crop Context baru**.
3. HOL-88 architecture/privacy/safety.
4. `TUGAS_AI_DATA.md` — pahami contract yang akan diberikan AI/Data.
5. Figma/Stitch + `DESIGN.md`.
6. BMKG Official Public Forecast API:
   - `https://data.bmkg.go.id/prakiraan-cuaca/`

---

# 3. TASK 1 — Tech Stack Decision

### Kerjakan

Pilih:
- frontend framework;
- backend framework;
- database;
- ORM/query layer;
- validation library;
- testing;
- deployment;
- map/location library/provider.

Gunakan stack yang paling cepat dan familiar untuk tim.

### Tidak perlu
- microservices;
- Kubernetes;
- Kafka;
- vector DB.

### Output

`TECH_STACK.md`

Format:

```text
Frontend:
Backend:
Database:
ORM:
Validation:
Testing:
Deployment:
Map:
Reason:
Risks:
```

### Selesai jika
Tech Lead dan engineer sepakat dan repo dapat dijalankan konsisten.

---

# 4. TASK 2 — System Architecture v0.2

### Kerjakan

Buat diagram aktual implementasi:

```text
PWA
↓
Backend/API
├── Location Resolver
├── BMKG Adapter
├── Evidence Service
├── Reasoning Integration
├── Review Service
└── Decision Record Service
↓
Database
```

Definisikan:
- module boundary;
- request flow;
- failure flow;
- cache;
- fixture/demo flow.

### Referensi
- HOL-88;
- laporan konteks;
- contract AI/Data.

### Output
- `ARCHITECTURE.md`
- diagram Mermaid / draw.io / Excalidraw / image.

### Selesai jika
AI/Data dan PM memahami di mana data masuk, reasoning dipanggil, dan decision disimpan.

---

# 5. TASK 3 — ERD v0.1

### Kerjakan

Buat ERD berdasarkan **semantic contract**, bukan berdasarkan screen.

Working entities:

```text
users
lands
crop_contexts
decision_cases
evidence
assessments
assessment_evidence
action_options
trusted_reviews
decision_records
decision_record_evidence
handoffs (optional)
```

### Referensi utama

1. Laporan konteks baru:
   - bagian Objek Utama;
   - Lahan vs Crop Context;
   - Decision Case.
2. HOL-86:
   - Evidence;
   - Assessment;
   - ActionOption;
   - TrustedReview;
   - DecisionRecord;
   - version/reference semantics.
3. HOL-88:
   - no silent overwrite;
   - privacy/data minimization.

### Wajib pikirkan

- `land_id`;
- `crop_context_id`;
- satu active crop context per lahan;
- `decision_case_id`;
- evidence version;
- assessment version;
- many-to-many assessment ↔ evidence;
- Decision Record snapshot/reference;
- revision / supersedes;
- source/provenance;
- `is_mock`;
- created_at/updated_at.

### Output

`ERD_v0.1.md` + diagram.

### Selesai jika
PM + AI/Data review dan tidak ada semantic object penting yang hilang.

---

# 6. TASK 4 — Database Schema & Migration

### Kerjakan

Dari ERD buat physical schema.

Tentukan:
- PK/FK;
- nullable/non-null;
- unique;
- index;
- enum vs lookup table;
- JSON/JSONB vs normalized field;
- timestamp;
- revision;
- cascade/restrict behavior.

### Referensi
- ERD approved;
- HOL-86 JSON schema;
- AI/Data mapping.

### Output
- migration files;
- seed script;
- `DATABASE.md`.

### Catatan

Untuk evidence payload, JSON/JSONB dapat digunakan bila sesuai stack, tetapi:
- field yang sering di-query sebaiknya dipertimbangkan sebagai kolom terstruktur;
- raw source payload jangan menggantikan canonical normalized fields.

### Selesai jika
Fresh database dapat dibuat hanya dari migration + seed.

---

# 7. TASK 5 — Spike Location → adm4

### Masalah

User memberi:
- GPS;
- pin;
- atau nama desa.

BMKG membutuhkan `adm4`.

### Kerjakan

Buat spike:

```text
lat/lon
↓
resolve desa/kelurahan
↓
resolve adm4
↓
verify dengan BMKG API
```

### Referensi

BMKG:
`https://data.bmkg.go.id/prakiraan-cuaca/`

Candidate BIG polygon service:
`https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_DESAKEL_AR/MapServer/0`

### Penting

Jangan mengasumsikan kode BIG otomatis sama dengan `adm4`.

Verifikasi dengan beberapa lokasi test.

### Output

`LOCATION_RESOLUTION_SPIKE.md`

Isi:
- approach;
- provider/source;
- sample input/output;
- accuracy limitation;
- fallback;
- caching plan.

### Selesai jika

Contoh:

```text
lat/lon test
→ Desa X
→ adm4 X
→ BMKG request berhasil
```

untuk beberapa lokasi fixture.

---

# 8. TASK 6 — BMKG API Adapter

### Endpoint resmi

```http
GET https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={adm4}
```

### Kerjakan

Buat adapter yang:
- menerima `adm4`;
- fetch JSON;
- validate response;
- map field BMKG ke internal raw/canonical evidence;
- menyimpan `analysis_date`;
- menyimpan fetch timestamp;
- mempertahankan source = BMKG;
- attribution terlihat;
- menangani timeout/error;
- cache response.

### Field dokumentasi BMKG

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

### Good practice

- backend call, jangan client langsung bila tidak perlu;
- cache;
- retry terbatas;
- timeout;
- structured logs;
- jangan melebihi rate limit;
- jangan fabricate response saat gagal.

### Failure

```text
BMKG unavailable
↓
valid cache?
├── yes → gunakan cache + tampilkan timestamp
└── no → evidence missing/unavailable
```

### Demo fallback

Fixture boleh digunakan pada demo/test, tetapi:
- harus `MOCK`;
- tidak boleh diam-diam menggantikan live data seolah live.

### Output

- BMKG adapter;
- tests;
- sample normalized payload;
- `BMKG_INTEGRATION.md`.

---

# 9. TASK 7 — API Contract

### Kerjakan

Buat endpoint minimal untuk:

- Lahan CRUD;
- active crop context;
- start Decision Case;
- Field Pulse;
- refresh/get external evidence;
- get assessment/options;
- request/submit review;
- submit final human decision;
- get Decision Record;
- get History;
- generate share text.

Exact REST route bebas.

### Referensi
- UI flow;
- ERD;
- HOL-86/AI contract.

### Output
- OpenAPI/Swagger atau API docs;
- request/response examples.

### Selesai jika
Frontend dan AI/Data tidak perlu menebak payload.

---

# 10. TASK 8 — UI Implementation

### Kerjakan

Implement berdasarkan Figma/Stitch.

Prioritas:

1. App shell.
2. Lahan.
3. Tambah Lahan.
4. Detail Lahan.
5. Decision Case.
6. Field Pulse.
7. Evidence.
8. Assessment.
9. Alternatives.
10. Review.
11. Human Decision.
12. Decision Record.
13. Decision Brief.
14. History.

### Referensi
- final Figma;
- `DESIGN.md`;
- `USER_FLOW_v0.2.md`.

### State wajib
- loading;
- empty;
- BMKG unavailable;
- cached/stale;
- Field Pulse unknown;
- assessment unavailable;
- reviewer unavailable;
- save error;
- share error.

---

# 11. TASK 9 — Decision Record & Share

### Kerjakan

Decision Record:
- explicit human confirmation;
- idempotent save;
- no false success;
- revision/supersedes.

Decision Brief:
- generate dari template PM/UX;
- jangan gunakan LLM bebas;
- copy;
- native share / WhatsApp intent.

### Output
- persistence;
- tests;
- share formatter.

---

# 12. TASK 10 — Demo / Staging

### Kerjakan

Siapkan:
- `.env.example`;
- secret handling;
- CI;
- lint/typecheck/test;
- staging;
- seed/reset;
- deterministic fixtures.

### Output
- documented startup command;
- staging URL;
- reset command.

---

# 13. Handoff yang harus diterima dari AI/Data

Full-stack membutuhkan:

- canonical input/output schema;
- BMKG field mapping;
- reasoning v0.2;
- enum Field Pulse;
- action options;
- explanation fields;
- failure semantics;
- fixture expected outputs.

Jika salah satu belum jelas:
> jangan buat logic sendiri di frontend/backend.

---

# 14. Handoff ke AI/Data

Full-stack memberikan:

- raw BMKG sample;
- normalized BMKG payload;
- location/adm4 result;
- API constraints;
- persistence constraints;
- latency/error observations.

---

# 15. Jangan dilakukan

- jangan menulis risk threshold sendiri;
- jangan membuat `AI Recommended`;
- jangan menyimpulkan `Tidak Ada Air = high risk` tanpa reasoning contract;
- jangan mencampur Evidence dan Assessment;
- jangan silently overwrite Decision Record;
- jangan hide mock/live status;
- jangan scrape sumber jika official API tersedia;
- jangan menambah source baru tanpa product gate.
