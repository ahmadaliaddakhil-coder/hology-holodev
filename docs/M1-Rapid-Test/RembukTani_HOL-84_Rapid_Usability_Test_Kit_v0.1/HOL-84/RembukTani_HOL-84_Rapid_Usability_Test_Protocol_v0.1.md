# RembukTani — HOL-84 Rapid Usability Test Protocol v0.1

**Linear issue:** HOL-84 — `[M1] Run rapid usability test on low-fidelity flow`  
**Milestone:** M1 — Scope & UX Freeze  
**Owner:** PM / UI-UX  
**Tanggal:** 2 September 2026  
**Status:** **READY TO RUN — PARTICIPANT RESULTS PENDING**

> Dokumen ini adalah execution protocol. HOL-84 belum dapat dinyatakan Done sampai minimal 3 participant/proxy benar-benar menjalankan test dan hasilnya dicatat.

---

# 1. Outcome

Menemukan masalah pemahaman/flow utama sebelum high-fidelity dan scope freeze.

Acceptance criteria Linear:

1. minimal 3 peserta/proxy user menyelesaikan core task;
2. titik bingung dan istilah yang tidak dipahami dicatat;
3. top 5 UX issue diprioritaskan;
4. perubahan flow diterapkan sebelum scope freeze.

M1 success metrics yang ikut diuji:

- ≥3 participant mencapai Decision Record tanpa facilitator takeover;
- ≥2/3 memahami source, local observation, freshness/status, dan missing evidence;
- ≥2/3 dapat menjelaskan mengapa assessment muncul dan bahwa output bukan autonomous command;
- seluruh tested path mempertahankan final human control;
- top blocking UX issues harus diselesaikan/accepted sebelum freeze.

---

# 2. Apa yang TIDAK sedang diuji

HOL-84 tidak menguji:

- apakah recommendation agronomis benar;
- apakah yield meningkat;
- apakah participant menyukai warna/style;
- performance production;
- apakah problem sudah locally validated;
- apakah participant mau membeli/menggunakan produk.

Fokus:

> **comprehension + navigation + human-control integrity.**

---

# 3. Participant Strategy

Ideal:
- target user / target-informed participant bila tersedia.

Jika akses belum tersedia, boleh memakai **proxy participant**, tetapi labeli sebagai proxy.

Minimal tiga sesi:

### P1 — Proxy Decision Facilitator

Kriteria:
- belum terlalu familiar dengan detail RembukTani;
- dapat membayangkan dirinya membantu mengambil keputusan kelompok.

Scenario:
- normal `DEMO-WATER-01`.

### P2 — Proxy / Target-informed

Kriteria:
- sebisa mungkin familiar dengan pertanian/padi/decision context, tetapi tidak terlibat membuat prototype.

Scenario:
- missing local evidence → recovery path.

### P3 — Proxy Independent

Kriteria:
- bukan orang yang mendesain flow;
- digunakan untuk mengecek optional review + human-control semantics.

Scenario:
- normal; moderator tidak mengarahkan apakah harus meminta review.

**Hindari** memakai PM/designer prototype sebagai participant karena mereka sudah tahu jawaban yang diharapkan.

---

# 4. Session Duration

Target per participant:

```text
Introduction        2 menit
Primary task       8–10 menit
Comprehension      5–7 menit
Failure probe       3–5 menit
Debrief             2 menit
────────────────────────
Total              ±20 menit
```

Tiga participant dapat selesai sekitar 60–75 menit.

---

# 5. Moderator Rules

Moderator:

- jangan menjelaskan product thesis sebelum participant mencoba;
- jangan menjelaskan arti confidence/evidence;
- jangan mengatakan tombol mana yang harus dipilih;
- jangan mengoreksi keputusan participant;
- minta participant **think aloud**;
- gunakan neutral prompt jika participant diam;
- catat kata participant secara verbatim bila confusion penting.

## Neutral prompts

Boleh:

> “Apa yang sedang Anda pikirkan?”

> “Apa yang Anda harapkan terjadi jika menekan itu?”

> “Bagian ini menurut Anda artinya apa?”

> “Silakan lakukan yang menurut Anda paling masuk akal.”

Tidak boleh:

> “Coba klik Evidence dulu.”

> “Review itu sebenarnya optional.”

> “Confidence sedang artinya ...”

---

# 6. Primary Task Brief

Bacakan tanpa tambahan penjelasan:

> “Bayangkan Anda membantu pengurus kelompok tani meninjau kondisi air di Blok Tirto A3. Gunakan prototype ini untuk memahami informasi yang tersedia dan kondisi lapangan, lalu catat keputusan yang menurut Anda paling masuk akal untuk dilakukan berikutnya. Tidak ada jawaban yang harus sama dengan sistem. Silakan pikirkan keras-keras selama menggunakan prototype.”

Success:

> participant mencapai **Decision Record** tanpa facilitator takeover.

Bukan success criterion:
- memilih option A/B/C tertentu;
- meminta PPL review;
- mengikuti assessment sistem.

---

# 7. Assigned Test Builds

## P1

`HOL-84_P1_Participant_Build.html`

Scenario:
- normal happy path.

Probe:
- apakah participant merasa perlu review atau tidak.

## P2

`HOL-84_P2_Participant_Build.html`

Scenario:
- local field evidence missing.

Expected discovery:
- participant memahami evidence lokal belum cukup;
- menemukan recovery melalui Field Pulse;
- setelah update dapat kembali ke assessment dan melanjutkan.

## P3

`HOL-84_P3_Participant_Build.html`

Scenario:
- normal happy path.

Probe:
- human authority;
- apakah “Trusted Review” dipahami optional.

---

# 8. Task Observation Rubric

## T1 — Understand Decision Moment

Pass jika participant dapat menjelaskan secara sederhana:

> sedang menilai apakah rencana terkait kondisi air hamparan perlu ditinjau.

## T2 — Understand Field Pulse

Pass jika participant memahami Field Pulse mewakili kondisi aktual/lokal hamparan.

## T3 — Understand Evidence

Pass jika participant dapat mengenali:
- external climate source;
- local observation;
- status current/stale/missing.

## T4 — Understand Assessment

Pass jika participant dapat menjelaskan bahwa assessment:
- merupakan interpretasi sistem;
- berasal dari evidence;
- mempunyai confidence/limitation.

## T5 — Understand Alternatives

Pass jika participant memahami:
- ada beberapa pilihan;
- bukan satu perintah otomatis.

## T6 — Understand Review

Pass jika participant memahami:
- review optional;
- PPL bukan mandatory final authority.

## T7 — Human Decision

Pass jika participant memahami dirinya/manusia masih bisa:
- memilih;
- mengubah;
- berbeda dari system option.

## T8 — Decision Record

Pass jika participant memahami record menyimpan:
- keputusan manusia;
- evidence/assessment/review trace.

---

# 9. Post-task Comprehension Questions

Tanyakan **setelah** participant mencapai record atau menyerah.

1. Menurut Anda tadi keputusan apa yang sedang dibuat?
2. Informasi dari luar sistem/lapangan apa saja yang Anda lihat?
3. Mana yang merupakan kondisi lokal hamparan?
4. Menurut Anda status evidence itu masih baru, stale, atau ada yang kurang?
5. Apa arti “Keyakinan Sedang” menurut Anda?
6. Mengapa sistem menampilkan “Perlu perhatian lebih”?
7. Apa yang menurut Anda masih belum diketahui sebelum keputusan operasional?
8. Apakah sistem tadi memberi satu perintah, atau beberapa pilihan? Jelaskan.
9. Apakah review PPL/reviewer wajib? Kenapa?
10. Siapa yang membuat keputusan akhir?
11. Apakah menurut Anda data tadi real/live atau simulasi?
12. Apa satu bagian yang paling membingungkan?

---

# 10. Scoring Rubric

## Core Task Completion

`2` = mencapai Decision Record tanpa facilitator takeover  
`1` = selesai setelah satu/lebih facilitator rescue yang memberi arah  
`0` = tidak dapat menyelesaikan / facilitator takeover

**Hanya score 2 yang menghitung M1 core-task target.**

## Evidence Comprehension — 0–2

`2`:
- mengenali external source;
- local observation;
- freshness/missing evidence.

`1`:
- mengenali sebagian tetapi mencampur source/status.

`0`:
- tidak dapat membedakan.

Target M1:
> ≥2/3 participant score `2`.

## Explanation Comprehension — 0–2

`2`:
- dapat menjelaskan minimal dua faktor assessment;
- memahami confidence ≠ kepastian;
- memahami output bukan autonomous command.

`1`:
- mengerti sebagian tetapi menyebut assessment seperti perintah/ramalan pasti.

`0`:
- tidak memahami asal assessment.

Target M1:
> ≥2/3 score `2`.

## Human-control Integrity — 0–2

`2`:
- jelas mengatakan keputusan akhir manusia;
- mampu memilih/modify/different.

`1`:
- ragu siapa authority tetapi tetap membuat keputusan.

`0`:
- menganggap sistem/PPL otomatis menetapkan keputusan.

Target:
> semua tested paths harus menjaga final human control; score 0 adalah blocking issue.

## MOCK Recognition — 0–1

`1` = memahami data simulasi / bukan live.  
`0` = menganggap data live/real.

Score 0 adalah safety comprehension issue.

---

# 11. Rescue Rule

Facilitator rescue hanya setelah:

- participant diam/tersesat >30 detik;
- participant menyatakan tidak tahu melanjutkan.

Urutan rescue:

### R1 — General

> “Apa yang ingin Anda lakukan berikutnya?”

### R2 — Goal reminder

> “Tujuannya adalah memahami evidence lalu mencatat keputusan yang menurut Anda masuk akal.”

### R3 — Directional rescue

Moderator boleh menunjukkan bagian UI.

Jika R3 dibutuhkan:
> core task completion tidak boleh dihitung sebagai unassisted success.

---

# 12. Issue Severity

Gunakan severity:

### S3 — Blocking

- participant gagal core task;
- salah memahami final authority;
- MOCK dianggap live;
- low-confidence/abstain dianggap rekomendasi pasti.

### S2 — Major

- participant dapat selesai tetapi salah memahami evidence/assessment;
- review dianggap mandatory;
- recovery path sulit ditemukan.

### S1 — Minor

- istilah/copy membingungkan tetapi tidak mengubah keputusan/flow.

### S0 — Observation

- preference visual/personal tanpa impact terbukti.

---

# 13. Priority Score

Untuk setiap issue setelah 3 sessions:

```text
frequency = jumlah participant terdampak (1–3)
severity weight:
S3 = 4
S2 = 3
S1 = 1
S0 = 0

core/safety bonus:
+2 bila issue menyentuh:
- human authority;
- mock/live;
- evidence comprehension;
- assessment comprehension;
- task completion.

priority_score = severity_weight × frequency + core/safety_bonus
```

Urutkan descending.

Ambil:
> **Top 5 issues**.

---

# 14. Change Rule setelah Test

## Langsung perbaiki

- blocking comprehension;
- misleading copy;
- recovery path yang tidak ditemukan;
- reviewer terlihat mandatory;
- MOCK marker gagal dipahami;
- final human authority ambigu.

## Jangan otomatis perbaiki

- satu participant meminta feature baru;
- preference warna/layout;
- “akan keren kalau ada X”;
- Action Tracker/chat/map/dashboard request.

Feature baru tetap harus melewati Anti-Feature Gate.

---

# 15. Completion Gate HOL-84

Issue dapat `Done` hanya bila:

- [ ] 3 participant/proxy benar-benar tested;
- [ ] 3 session notes tersimpan;
- [ ] ≥3 unassisted Decision Record completions, atau gap dicatat sebagai failed criterion;
- [ ] evidence comprehension dihitung;
- [ ] explanation comprehension dihitung;
- [ ] human-control integrity dihitung;
- [ ] confusion/terminology dicatat;
- [ ] top 5 issues diprioritaskan;
- [ ] setiap top issue berstatus `fix / accept / defer`;
- [ ] blocking flow fixes diterapkan ke HOL-83 revision sebelum M1 freeze.

Jika 3 participant belum tested:

> status tetap **READY TO RUN / RESULTS PENDING**, bukan Done.

