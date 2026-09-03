# TUGAS — PM / TECH LEAD / UI-UX

**Role:** PM / Tech Lead / UI-UX  
**Fokus:** menjaga arah produk, membuat flow mudah dipahami, dan memastikan Full-stack serta AI/Data tidak menebak requirement.

---

# 1. Target role ini

Ketika tugas PM/UX selesai, anggota lain harus bisa berkata:

> “Saya tahu produk yang dibuat, screen yang dibutuhkan, data yang harus tampil, state yang harus ditangani, dan kapan task saya selesai.”

---

# 2. Tugas sekarang — urutan kerja

## TASK 1 — Kunci Product Context v0.2

### Kerjakan
Review bersama tim:
- problem;
- user;
- multiple Lahan;
- Lahan vs Crop Context;
- Decision Case;
- BMKG automatic evidence;
- minimal Field Pulse;
- Decision Brief;
- tiga impact lever.

### Referensi
- `LAPORAN_KONTEKS_PROYEK_REMBUKTANI_v0.2.md`
- `RembukTani_New_Concept_Audit_Product_Decisions_v0.1.md`
- M0 Gate / Evidence Hypothesis untuk claim boundary.

### Output
`PRODUCT_DECISIONS_v0.2.md`

Isi minimal:
- keputusan;
- alasan;
- status `Accepted / Pending`;
- owner;
- impact terhadap Full-stack/AI/UI.

### Selesai jika
Tidak ada anggota yang masih mempunyai definisi produk berbeda.

---

## TASK 2 — Update End-to-End User Flow

### Kerjakan

Buat flow final sementara:

```text
Beranda
→ Lahan
→ Tambah/Pilih Lahan
→ Detail Lahan
→ Tinjau Kondisi
→ BMKG otomatis
→ Field Pulse
→ Ringkasan Kondisi
→ Alternatives
→ Optional Review
→ Human Decision
→ Decision Record
→ Decision Brief
→ Riwayat
```

Definisikan juga failure path:
- BMKG unavailable;
- cached/stale evidence;
- Field Pulse `Tidak Tahu`;
- insufficient evidence;
- reasoning unavailable;
- reviewer unavailable;
- save error;
- share error.

### Referensi
- laporan konteks baru;
- User Flow M1 lama sebagai referensi failure semantics;
- HOL-88 safety boundary.

### Output
`USER_FLOW_v0.2.md`

### Selesai jika
Full-stack dapat membangun routing/state tanpa menebak.

---

## TASK 3 — Finalisasi Field Pulse UX

### Kerjakan

Validasi copy dan pilihan:

### Air di petak
- Ada
- Sedikit
- Tidak Ada
- Tidak Yakin

### Aliran irigasi
- Mengalir
- Terbatas
- Tidak Mengalir
- Tidak Tahu

Buat helper text sederhana.

Pastikan:
- bukan istilah teknis;
- bukan meminta user melakukan risk assessment;
- `Tidak Tahu` valid.

### Referensi
- Product context baru;
- reasoning requirement dari AI/Data;
- Figma/Stitch prototype.

### Output
- Figma screen Field Pulse;
- copy final;
- mapping label user → enum backend yang disepakati bersama AI/Data/Full-stack.

Contoh artifact:
`FIELD_PULSE_COPY_AND_MAPPING.md`

### Selesai jika
AI/Data bisa memakai input tersebut dan user tidak perlu memahami istilah teknis.

---

## TASK 4 — UI/UX di Stitch/Figma

### Kerjakan

Buat high-fidelity berdasarkan:
- master Stitch prompt;
- `DESIGN.md`.

Prioritas screen:

### Batch A
1. Home
2. Lahan List
3. Tambah Lahan
4. Detail Lahan

### Batch B
5. Tinjau Kondisi
6. Field Pulse
7. Informasi yang Digunakan
8. Ringkasan Kondisi
9. Action Alternatives

### Batch C
10. Optional Review
11. Human Decision
12. Decision Record
13. Decision Brief
14. History

### Referensi
- `DESIGN.md`
- laporan konteks;
- actual data field dari BMKG setelah Full-stack spike;
- canonical output AI/Data.

### Output
- final Figma;
- component states;
- mobile 390px primary;
- responsive note;
- error/loading/empty states;
- prototype connection.

### Jangan
Jangan desain field yang backend/AI tidak punya.
Jangan mengarang risk output untuk mempercantik UI.

---

## TASK 5 — Decision Brief Template

### Kerjakan

Definisikan template share:

```text
Nama Lahan
Keputusan
Dasar
Yang belum diketahui
Sumber
Waktu
```

Buat:
- short version WhatsApp;
- full Decision Record view.

### Referensi
- Decision Record contract;
- AI explanation fields;
- privacy boundary.

### Output
`DECISION_BRIEF_TEMPLATE_v0.1.md`

### Selesai jika
Full-stack dapat generate teks tanpa LLM bebas.

---

## TASK 6 — Usability Test

### Kerjakan

Test flow baru.

Minimum pertanyaan:
- Apakah user mengerti cara tambah/pilih lahan?
- Apakah user mengerti BMKG diambil otomatis?
- Apakah Field Pulse mudah?
- Apakah “Tidak Tahu” dipahami?
- Apakah user mengerti Ringkasan Kondisi?
- Apakah user tahu sistem tidak memutuskan?
- Apakah Decision Brief mudah dipahami/dibagikan?

### Output
- participant notes;
- top 5 issue;
- fix / accept / defer.

### Selesai jika
Blocking issue ditangani sebelum M1 Freeze.

---

# 3. Handoff ke Full-stack

PM/UX wajib memberi:

- screen/flow;
- exact state;
- final copy;
- source field yang tampil;
- data yang editable;
- primary/secondary action;
- error/empty/loading behavior.

Jangan hanya memberi screenshot tanpa behavior.

---

# 4. Handoff ke AI/Data

PM/UX wajib memberi:

- keputusan apa yang dibantu;
- input user;
- output user-facing yang dibutuhkan;
- istilah yang harus sederhana;
- limitation yang wajib terlihat.

AI/Data kemudian menentukan semantic/rule yang defensible.

---

# 5. Output utama role

- `PRODUCT_DECISIONS_v0.2.md`
- `USER_FLOW_v0.2.md`
- `FIELD_PULSE_COPY_AND_MAPPING.md`
- Figma/Stitch high-fi
- `DESIGN.md`
- `DECISION_BRIEF_TEMPLATE_v0.1.md`
- usability results
- M1 Gate Decision Record
