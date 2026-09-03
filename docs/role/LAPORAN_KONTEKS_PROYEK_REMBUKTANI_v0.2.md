# LAPORAN KONTEKS PROYEK REMBUKTANI v0.2

**Tanggal:** 3 September 2026  
**Status:** LIVING DOCUMENT — diperbarui jika ada keputusan produk baru  
**Tujuan:** menjadi dokumen utama agar seluruh tim memahami produk yang sedang dibuat sebelum mulai implementasi.

---

# 1. RembukTani sekarang sebenarnya apa?

RembukTani adalah **web app / PWA berbasis lahan** yang membantu petani atau pengurus kelompok tani membuat keputusan lapangan dengan lebih sederhana.

Kalimat paling sederhana:

> **RembukTani mengambil informasi eksternal secara otomatis, meminta sedikit kondisi lapangan dari user, lalu membantu user membuat keputusan yang jelas dan dapat dibagikan.**

Prinsip utama:

> **Automatic evidence → Minimal field input → Clear human decision**

RembukTani **bukan**:
- aplikasi cuaca baru;
- chatbot pertanian;
- autonomous agronomist;
- sistem rekomendasi yang mencoba mengalahkan BMKG;
- full farm ERP;
- full Action Tracker;
- sistem yang membuat keputusan akhir secara otomatis.

---

# 2. Masalah yang ingin diselesaikan

Masalahnya bukan kekurangan informasi.

Informasi cuaca dan pertanian sudah tersedia.

Masalah yang kita coba selesaikan:

> Saat keputusan lapangan perlu dibuat, user masih harus mengumpulkan, mencocokkan, dan memahami informasi eksternal dengan kondisi aktual lahannya sendiri.

Target RembukTani:

1. mengurangi input manual;
2. mengurangi sumber/aplikasi yang harus dibuka user;
3. menunjukkan apa yang diketahui dan belum diketahui;
4. membantu user memahami artinya;
5. membuat keputusan manusia lebih mudah ditelusuri dan dibagikan.

---

# 3. Impact yang ingin kita ukur

Kita memakai tiga impact hypothesis.

## A. Effort / Time

Apakah RembukTani:
- mengurangi jumlah input manual;
- mengurangi jumlah sumber yang harus dibuka user;
- mengurangi waktu dari mulai meninjau kondisi sampai keputusan tercatat?

## B. Blind Spot

Apakah user sadar:
- sumber data;
- waktu data;
- freshness;
- kondisi lokal;
- informasi yang masih hilang;
- limitation?

## C. Shared Understanding

Setelah melihat Decision Brief, apakah orang lain mengerti:
- masalahnya apa;
- dasar informasinya apa;
- apa yang belum diketahui;
- keputusan akhirnya apa?

Kita **belum** mengklaim:
- peningkatan hasil panen;
- penghematan air;
- pengurangan gagal panen;
- akurasi lebih baik dari BMKG/PPL.

---

# 4. Objek utama sistem

## 4.1 User

Untuk demo dapat berupa `demo_user`.

Production auth belum menjadi blocker M2.

## 4.2 Lahan

Satu user dapat mempunyai **banyak lahan**.

Contoh:

```text
Lahan Saya
├── Blok Tirto A3
├── Sawah Selatan
└── Petak Dekat Sungai
```

Lahan berisi konteks lokasi yang relatif tetap:
- `land_id`;
- nama lahan;
- latitude;
- longitude;
- desa/kelurahan;
- kecamatan;
- kabupaten/kota;
- kode wilayah yang dibutuhkan integrasi;
- optional geometry untuk future.

## 4.3 Crop Context / Musim Tanam

Lahan **berbeda** dari crop context.

Satu lahan dapat mempunyai crop context yang berubah setiap musim.

Untuk M2 cukup mendukung:
- satu `active_crop_context` per lahan;
- crop = padi;
- varietas;
- tanggal tanam optional;
- fase tanaman;
- waktu update.

Jangan menyimpan varietas/fase sebagai identitas permanen lahan.

## 4.4 Decision Case

Satu Decision Case M2:

```text
1 Lahan
+
1 Active Crop Context
+
1 Bounded Decision Question
```

Decision Case dimulai **manual oleh user** pada M2.

Automatic alert/trigger belum menjadi core.

## 4.5 Evidence

Evidence dibagi minimal menjadi:

### External Evidence
Contoh M2:
- BMKG.

### Local Field Evidence
Contoh:
- air di petak;
- kondisi aliran irigasi.

### Human Observation
Optional.

Evidence harus menyimpan:
- source;
- provenance;
- location/context;
- observed/forecast time;
- valid/freshness basis;
- payload;
- mock/live marker.

## 4.6 Assessment

Assessment adalah hasil reasoning sistem.

Bukan evidence mentah.

Bukan keputusan manusia.

## 4.7 Action Options

Beberapa pilihan yang dapat dipertimbangkan.

Tidak ada `AI Recommended` / ranking pada M2.

## 4.8 Trusted Review

Optional.

Reviewer dapat memberi pertimbangan, tetapi tidak otomatis menjadi pembuat keputusan akhir.

## 4.9 Decision Record

Keputusan akhir manusia.

Harus dapat menautkan:
- decision context;
- evidence;
- assessment;
- review status;
- final decision;
- rationale;
- timestamp;
- limitation.

## 4.10 Decision Brief

Versi pendek Decision Record untuk dibagikan.

Contoh output:

```text
RembukTani — Blok Tirto A3

Keputusan:
Verifikasi kondisi sumber air sebelum menentukan perubahan rencana.

Dasar:
• Informasi cuaca BMKG terbaru
• Air di petak tinggal sedikit
• Aliran irigasi tidak berjalan

Masih perlu dikonfirmasi:
• kondisi/alokasi sumber air terbaru

Sumber:
BMKG + kondisi lapangan

Diputuskan:
3 September 2026
```

Decision Brief dibuat **template-based / deterministic**, bukan LLM bebas.

---

# 5. Alur end-to-end

```text
USER
↓
Tambah / pilih Lahan
↓
Lokasi disimpan
↓
Sistem mendapatkan kode wilayah
↓
BMKG Adapter mengambil prakiraan
↓
Evidence disimpan
↓
User klik "Tinjau Kondisi"
↓
Field Pulse
  - Apakah masih ada air?
  - Bagaimana aliran irigasi?
↓
External Evidence + Crop Context + Field Pulse
↓
Reasoning Engine
↓
Ringkasan Kondisi
  - apa yang diketahui
  - kenapa
  - apa yang belum diketahui
  - limitation
↓
Action Alternatives
↓
Optional Trusted Review
↓
Human Decision
↓
Decision Record
↓
Decision Brief
↓
Copy / Native Share / WhatsApp intent
↓
Riwayat
```

---

# 6. Field Pulse M2

Field Pulse harus menggunakan **observasi sederhana**, bukan istilah teknis.

## Pertanyaan 1

**Apakah masih ada air di petak saat ini?**

Pilihan:
- Ada
- Sedikit
- Tidak Ada
- Tidak Yakin

## Pertanyaan 2

**Bagaimana aliran irigasi saat ini?**

Pilihan:
- Mengalir
- Terbatas
- Tidak Mengalir
- Tidak Tahu

`Tidak Tahu` / `Tidak Yakin` adalah jawaban valid.

Sistem yang menentukan dampaknya terhadap confidence/assessment.

User tidak diminta memilih:
- critical_low;
- high risk;
- severity;
- confidence.

---

# 7. Sumber otomatis utama M2: BMKG

Keputusan saat ini:

> **BMKG menjadi external automatic evidence utama untuk M2.**

SI Katam tidak digunakan dulu.

## Dokumentasi resmi yang harus dipakai

**Data Prakiraan Cuaca Terbuka BMKG**

Dokumentasi:
`https://data.bmkg.go.id/prakiraan-cuaca/`

Endpoint:

```http
GET https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={kode_wilayah_tingkat_iv}
```

Karakteristik yang sudah didokumentasikan BMKG:
- format JSON;
- prakiraan 3 hari;
- 8 data per hari / interval 3 jam;
- update 2 kali sehari;
- query menggunakan kode wilayah administrasi tingkat IV (`adm4`);
- batas akses 60 request/menit/IP;
- BMKG wajib dicantumkan sebagai sumber.

Field yang didokumentasikan antara lain:
- `utc_datetime`;
- `local_datetime`;
- `t` — suhu;
- `hu` — kelembapan;
- `weather_desc`;
- `weather_desc_en`;
- `ws` — kecepatan angin;
- `wd` — arah angin;
- `tcc` — tutupan awan;
- `vs_text` — jarak pandang;
- `analysis_date`.

**Jangan mengasumsikan field lain tersedia sebelum dicek pada dokumentasi/payload aktual.**

---

# 8. Lokasi → adm4

BMKG menggunakan `adm4`, sedangkan user akan memberi:
- GPS;
- pin peta;
- atau nama lokasi.

Karena itu sistem membutuhkan:

```text
Location Input
↓
Location Resolver
↓
Desa/Kelurahan
↓
adm4
↓
BMKG API
```

Full-stack harus melakukan technical spike untuk menentukan cara paling reliable.

Candidate reference geospatial resmi:

**BIG Geoservices — Area Batas Wilayah Administrasi Desa/Kelurahan**

`https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_DESAKEL_AR/MapServer/0`

Service tersebut mendukung query dan JSON/GeoJSON.

Catatan penting:
- jangan mengasumsikan kode yang ada pada service BIG pasti langsung sama dengan parameter `adm4` BMKG;
- mapping kode harus diverifikasi;
- jika lebih mudah, Full-stack boleh menggunakan source kode wilayah lain yang valid/stabil dan mendokumentasikan alasannya.

---

# 9. BMKG vs Reasoning

Kita memilih:

> **Opsi A — reasoning M2 direconcile dengan data BMKG yang benar-benar tersedia.**

HOL-87 lama masih memakai fixture seperti:
- `below_normal`;
- `12.5 mm`;
- `8 dry days`.

Itu tidak boleh dianggap otomatis berasal dari public forecast API BMKG.

AI/Data harus membuat HOL-87 v0.2 / reasoning update yang:
- membaca field BMKG yang benar-benar ada;
- tidak membuat threshold baru tanpa sumber teknis;
- tetap menggunakan Field Pulse untuk kondisi aktual lahan;
- dapat abstain jika evidence tidak cukup.

Existing deterministic fixture boleh dipakai sebagai test fixture selama diberi label fixture/mock.

---

# 10. Arsitektur logis yang dituju

```text
                    ┌───────────────────┐
                    │   PWA / Web UI    │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Backend / API     │
                    │ Orchestrator      │
                    └──────┬─────┬──────┘
                           │     │
           ┌───────────────┘     └───────────────┐
           ▼                                     ▼
┌────────────────────┐                ┌────────────────────┐
│ Location Resolver  │                │ Persistence / DB   │
└─────────┬──────────┘                └─────────┬──────────┘
          │                                     │
          ▼                                     │
┌────────────────────┐                          │
│ BMKG Adapter       │                          │
└─────────┬──────────┘                          │
          ▼                                     │
┌────────────────────┐                          │
│ Evidence Normalizer│──────────────────────────┘
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Reasoning Engine   │
└─────────┬──────────┘
          ▼
 Assessment + Options
          │
          ▼
    Human Decision
          │
          ▼
   Decision Record
```

Engineering topology spesifik tetap keputusan Full-stack.

M2 tidak membutuhkan:
- microservices;
- Kafka;
- Kubernetes;
- vector DB;
- ML platform khusus.

---

# 11. Data model / ERD working direction

Ini **bukan physical schema final**. Full-stack membuat ERD final bersama review AI/Data.

Working entities:

```text
users                     (demo/future-ready)
lands
crop_contexts
decision_cases            / decision_contexts
evidence
assessments
assessment_evidence
action_options
trusted_reviews
decision_records
decision_record_evidence
handoffs                   optional
```

Relasi penting:

```text
User
  1 ── * Land

Land
  1 ── * CropContext
  1 ── * DecisionCase

DecisionCase
  1 ── * Evidence
  1 ── * Assessment
  1 ── * TrustedReview
  1 ── * DecisionRecord

Assessment
  * ── * Evidence
  1 ── * ActionOption

DecisionRecord
  * ── * Evidence
  0..1 ── TrustedReview
```

Decision Record tidak boleh silent overwrite.

Material change menggunakan revision/supersedes semantics.

---

# 12. UI/UX utama

Top-level:

```text
Beranda
Lahan
Riwayat
Profil
```

Core screens:

1. Tambah/Pilih Lahan
2. Detail Lahan
3. Tinjau Kondisi
4. Field Pulse
5. Informasi yang Digunakan
6. Ringkasan Kondisi
7. Pilihan Tindakan
8. Optional Review
9. Human Decision
10. Decision Record
11. Share Decision Brief

Design reference:
- Master Prompt Stitch terbaru.
- `/DESIGN.md`

Prinsip:
- mobile-first;
- satu pertanyaan utama per screen;
- large touch target;
- Bahasa Indonesia sederhana;
- 2–3 tap Field Pulse;
- tidak ada dashboard data berlebihan.

---

# 13. Failure states minimum

Semua role harus memahami kondisi ini:

## BMKG gagal
- gunakan cached evidence jika masih valid;
- jika tidak valid → missing/stale;
- jangan fabricate data.

## User tidak tahu kondisi lapangan
- simpan `unknown`;
- confidence/assessment menyesuaikan;
- user tidak dipaksa memilih.

## Reasoning gagal
- `assessment_unavailable`;
- jangan membuat hasil yang terlihat masuk akal tetapi palsu.

## Reviewer tidak tersedia
- core tetap dapat lanjut.

## Save Decision Record gagal
- jangan tampilkan success;
- draft jangan hilang jika memungkinkan.

## Share gagal
- Decision Record tetap tersimpan.

---

# 14. Scope sekarang

## M2 Core

- multiple lands;
- location point;
- admin/location resolution;
- BMKG integration;
- active crop context;
- manual Decision Case start;
- minimal Field Pulse;
- evidence display;
- reasoning v0.2;
- action alternatives;
- optional review;
- final human decision;
- Decision Record;
- Decision Brief/share.

## Supporting

- Home;
- History;
- Profile/basic account shell.

## Bukan core sekarang

- SI Katam;
- Sentinel;
- SoilGrids;
- automatic alert;
- full Action Tracker;
- multi-land comparison;
- mandatory polygon;
- autonomous recommendation;
- full offline-first;
- public Decision Record link.

---

# 15. Source of Truth Tim

Urutan ketika ada konflik:

1. Keputusan produk terbaru yang sudah disetujui.
2. `LAPORAN_KONTEKS_PROYEK_REMBUKTANI_v0.2.md`
3. Product audit / new concept decision record terbaru.
4. HOL-86 setelah direconcile.
5. HOL-87 v0.2 setelah direconcile BMKG.
6. HOL-88 architecture/safety.
7. Figma + `DESIGN.md`.
8. Task role masing-masing.
9. Backlog/Linear lama.

Jangan memakai requirement lama jika sudah bertentangan dengan konteks ini.

---

# 16. Hal yang masih harus diselesaikan sebelum M1 Freeze

- update HOL-86 untuk Lahan vs Crop Context vs Decision Case;
- buat HOL-87 v0.2 berdasarkan actual BMKG evidence;
- lakukan spike Location → `adm4`;
- update UI/Figma/Stitch terhadap konsep baru;
- usability test flow baru;
- review ERD/architecture;
- reconcile M2 task;
- M1 Gate.

---

# 17. Aturan kerja sederhana

Sebelum mengerjakan task, setiap anggota harus bisa menjawab:

```text
Saya membuat apa?
Referensi saya apa?
Output saya apa?
Output saya dipakai siapa?
Apa yang tidak boleh saya ubah sendiri?
```

Kalau belum jelas:
> diskusikan dulu, jangan langsung implement.
