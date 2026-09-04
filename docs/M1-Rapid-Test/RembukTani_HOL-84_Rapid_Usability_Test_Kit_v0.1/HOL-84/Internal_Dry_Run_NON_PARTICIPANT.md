# RembukTani — HOL-84 Internal Dry-Run / Cognitive Walkthrough v0.1

**Status:** INTERNAL PRE-TEST ONLY  
**Evidence type:** heuristic/cognitive walkthrough by project copilot  
**Does this count as one of the 3 participant tests?** **NO**

Tujuan dry-run:
- menghilangkan test contamination;
- menemukan hal yang patut diamati;
- bukan menggantikan participant behavior.

---

## 1. Perubahan procedural sebelum participant test

### DR-01 — Tester panel tidak boleh terlihat participant

HOL-83 original memiliki tester panel dengan:
- state selector;
- objective;
- current prototype state.

Jika participant melihatnya, panel tersebut dapat membocorkan:
- apa yang sedang diuji;
- expected states;
- terminology.

**Action:**
dibuat tiga participant builds yang menyembunyikan tester panel.

Status:
> Fixed for test procedure.

---

# 2. Hypotheses to Observe — BUKAN temuan participant

## HUX-01 — Istilah “Evidence” mungkin masih teknis

Prototype sudah memakai copy Bahasa Indonesia sederhana, tetapi istilah:
- Evidence;
- Assessment;
- Confidence;
- Trusted Review;
- Decision Record;

masih muncul.

**Jangan ganti sebelum test hanya berdasarkan asumsi.**

Observe:
> apakah participant dapat menjelaskan istilah dari context tanpa facilitator explanation.

Potential change jika terbukti:
- Evidence → “Informasi yang digunakan” / “Dasar informasi”
- Assessment → “Penilaian sistem”
- Trusted Review → “Minta pertimbangan”
- Decision Record → “Catatan keputusan”

---

## HUX-02 — “Keyakinan Sedang” dapat disalahartikan sebagai tingkat risiko

Ada dua konsep berdekatan:

- state: `Perlu perhatian lebih`
- confidence: `Sedang`

Participant mungkin membaca “Sedang” sebagai severity/risk, bukan confidence terhadap assessment.

Observe:
> minta participant menjelaskan keduanya dengan kata sendiri.

Blocking jika:
- ≥2 participant mencampur keduanya;
- participant membuat keputusan berbeda karena salah memahami meaning.

---

## HUX-03 — Metadata evidence mungkin terlalu padat

Evidence card membawa:
- source;
- current/stale;
- MOCK;
- angka fixture;
- quality semantics.

Observe:
> apakah participant dapat menemukan source + local observation + freshness tanpa membaca semua metadata.

Potential change:
- prioritaskan source/status di baris pertama;
- sisanya progressive disclosure pada high-fi.

---

## HUX-04 — Optional Trusted Review perlu diuji tanpa hint

Review path secara desain optional, tetapi keberadaan option “Minta trusted review” dapat dianggap sebagai langkah yang direkomendasikan/mandatory.

Observe:
> participant yang tidak memilih review tetap merasa boleh lanjut?

Blocking jika:
- participant merasa tidak dapat membuat keputusan tanpa PPL/reviewer.

---

## HUX-05 — Prefilled decision text dapat mengurangi bukti human agency

HOL-83 normal build memberi default decision text berdasarkan selected option ketika Final Human Decision dibuka.

Risk:
- participant hanya menerima copy;
- test tidak membedakan apakah mereka benar-benar merasa boleh mengubah keputusan.

Untuk rapid test v0.1:
- tetap gunakan build saat ini agar flow tidak berubah sebelum evidence;
- moderator probe wajib: “Kalau Anda tidak setuju, apakah menurut Anda bisa mengubah keputusan ini?”

Jika participant consistently hanya menerima prefill:
> pertimbangkan revision menjadi editable blank/structured confirmation pada HOL-83 v0.2.

---

## HUX-06 — Missing-evidence recovery adalah critical test

P2 harus:
- memahami kenapa assessment belum cukup;
- kembali/update Field Pulse;
- melihat assessment kembali normal;
- lanjut hingga Decision Record.

Jika recovery gagal:
> ini S3/S2 karena failure-state recovery adalah Must M1.

---

## HUX-07 — MOCK marker visibility

Badge ada persistent di topbar.

Observe:
> setelah task, apakah participant spontan atau setelah ditanya memahami data simulasi?

Jika participant menganggap BMKG fixture sebagai live:
> S3 safety comprehension issue.

---

# 3. Dry-run conclusion

Prototype cukup stabil untuk participant testing.

Jangan melakukan visual polish/high-fi sebelum:
- 3 sessions selesai;
- comprehension metrics dihitung;
- top 5 issues ditentukan.

Dry-run ini **tidak memenuhi** acceptance criterion “3 peserta/proxy user”.
