# RembukTani — HOL-83 Low-Fidelity Clickable Prototype Spec v0.1

**Linear issue:** HOL-83 — `[M1] Build low-fidelity clickable prototype`  
**Milestone:** M1 — Scope & UX Freeze  
**Owner:** PM / UI-UX  
**Version:** 0.1  
**Status:** **DRAFT — CLICKABLE / USABILITY-TEST READY**

## 1. Outcome

Core journey dapat diuji sebelum high-fidelity dan coding penuh.

Primary artifact:

> `RembukTani_HOL-83_Low_Fidelity_Clickable_Prototype_v0.1.html`

Prototype bersifat:
- self-contained;
- mobile-first;
- grayscale / low-fidelity;
- clickable;
- menggunakan DEMO-WATER-01;
- memiliki tester-only state selector.

---

## 2. Reconciliation dengan Acceptance Criteria Linear lama

Linear lama meminta:

- Field Pulse;
- Evidence Board;
- Risk & Action;
- PPL Review;
- Action Tracker.

M1 terbaru mengubah semantics tanpa mengubah tujuan issue.

### Mapping v0.1

| Linear lama | Prototype M1 terbaru |
|---|---|
| Field Pulse | **Field Pulse** — core |
| Evidence Board | **Evidence & Assessment** — evidence section, core |
| Risk & Action | **Explainable Assessment + Alternatives** — core |
| PPL Review | **Optional Trusted Review** — PPL hanya fixture candidate |
| Action Tracker | **Optional Lightweight Handoff** setelah Decision Record |

`Action Tracker` tidak menjadi core karena Decision-to-Action gap belum tervalidasi.

---

## 3. Core Screens

1. **Decision Moment**
2. **Field Pulse**
3. **Evidence & Assessment**
4. **Alternatives**
5. **Optional Trusted Review**
6. **Final Human Decision**
7. **Decision Record**
8. **Optional Share / Lightweight Handoff**

Happy path tetap dapat dijelaskan dalam lima core stages:

```text
Decision Moment
↓
Field Pulse
↓
Evidence & Assessment
↓
Alternatives + Optional Review
↓
Decision Record
```

Final Human Decision merupakan human-control transition sebelum record, bukan feature/domain module baru.

---

## 4. Fixture dan Reasoning Semantics

Prototype menggunakan fixture:

> `DEMO-WATER-01`

UI menampilkan:
- padi Inpari 32;
- flowering;
- below-normal rainfall fixture;
- 12.5 mm / 10 hari;
- 8 dry days sebagai **raw/context evidence**, bukan threshold;
- water_status `critical_low`;
- irrigation `dry`;
- flow `20%` sebagai **raw evidence**, bukan independent scientific risk factor.

Expected HOL-87 semantic:

```text
context_state = elevated_attention
confidence = medium
recommendation.mode = alternatives_only
```

Factor UI:
1. external climate evidence membawa below-normal rainfall signal;
2. local field evidence membawa water-shortage signal;
3. flowering menjadi sensitivity modifier karena local shortage signal sudah ada.

Tidak menampilkan:
- 20% flow = scientific low-flow threshold;
- 8 days = drought threshold;
- irrigation amount/duration;
- best/recommended option.

---

## 5. Recommendation UX

HOL-87 v0.1:

```text
recommended_option_id = null
ranked recommendation = disabled
```

Karena itu screen Alternatives:

- tidak menyorot satu option sebagai “terbaik”;
- user memilih langkah yang ingin dipertimbangkan;
- system tidak auto-select final decision.

Options happy path:
- A — Verifikasi & siapkan penyesuaian;
- B — Tambah evidence dulu;
- C — Minta trusted review.

---

## 6. Human Control

Sebelum Decision Record, prototype menampilkan:

> **Human Decision Boundary**

User dapat:
- mengikuti option;
- memodifikasi;
- memilih keputusan lain;
- menggunakan/menolak review.

System assessment tetap disimpan sebagai system inference dan tidak diubah agar terlihat sesuai dengan keputusan manusia.

---

## 7. Failure / Alternate States

Tester panel dapat memilih:

### Normal

`DEMO-WATER-01`

### Missing local evidence

Expected:
- insufficient evidence;
- confidence low;
- system abstains;
- update Field Pulse / request review.

### Stale local evidence

Expected:
- stale evidence warning;
- insufficient evidence;
- confidence low;
- update observation.

### Conflicting evidence

Synthetic test:
- field = critical_low;
- human observation = adequate.

Expected:
- conflict surfaced;
- low confidence;
- no silent source selection;
- collect more evidence / trusted review.

### Reasoning unavailable

Expected:
- evidence remains visible;
- no fabricated assessment;
- retry/manual fallback.

---

## 8. Copy Principles

Bahasa sengaja sederhana.

Examples:

**Use**
> “Evidence lokal belum cukup untuk memberi opsi utama.”

**Avoid**
> “AI confidence failure due to missing local feature vector.”

**Use**
> “Dua evidence menunjukkan kondisi yang berbeda.”

**Avoid**
> “Conflict resolution failed.”

Technical detail dapat dilihat pada evidence metadata, tetapi bukan copy utama.

---

## 9. MOCK / DEMO Safety

Persistent badge:

> `DEMO · DATA SIMULASI`

Prototype tidak boleh dianggap:
- live BMKG application;
- real farmer decision;
- validated agronomic recommendation.

---

## 10. Anti-Decorative Rule

Tidak ada:
- KPI dashboard;
- chart dekoratif;
- marketplace;
- chatbot;
- social feed;
- weather app penuh;
- internal chat;
- complex task board.

Setiap elemen harus membantu user bergerak dari decision context menuju final human decision.

---

## 11. Usability Questions untuk HOL berikutnya

Jangan menjelaskan konsep sebelum participant mencoba.

Observe apakah participant dapat menjawab:

1. Apa yang sedang diputuskan?
2. Evidence external datang dari mana?
3. Apa kondisi lokal yang dipakai?
4. Apa arti “Keyakinan Sedang”?
5. Kenapa assessment “Perlu perhatian lebih” muncul?
6. Apa evidence yang masih kurang?
7. Apakah mereka menganggap sistem memberi perintah atau alternatif?
8. Apakah Trusted Review terasa mandatory?
9. Siapa yang mereka anggap membuat keputusan akhir?
10. Apakah mereka memahami bahwa Decision Record adalah endpoint core?

---

## 12. Definition of Done HOL-83 v0.1

| Criterion | Status |
|---|---|
| Clickable core journey | ✅ |
| Field Pulse | ✅ |
| Evidence Board semantics | ✅ Evidence & Assessment |
| Explainable Risk/Assessment | ✅ |
| Bounded Alternatives | ✅ |
| Optional Trusted Review | ✅ |
| Decision Record | ✅ |
| Optional lightweight handoff | ✅ |
| DEMO-WATER-01 fixture | ✅ |
| Simple Bahasa Indonesia copy | ✅ |
| No decorative dashboard | ✅ |
| Missing evidence state | ✅ |
| Stale state | ✅ |
| Low confidence / abstain | ✅ |
| Conflict state | ✅ |
| Reasoning error state | ✅ |
| Human final control | ✅ |
| Ranked/best recommendation not invented | ✅ |
| Figma link | ⏳ belum dibuat; prototype saat ini HTML |
| Usability testing | ⏳ issue berikutnya |

---

## 13. Freeze Boundary

HOL-83 tidak langsung menjadi high-fidelity.

Setelah rapid usability test:
- blocking comprehension issues boleh memperbaiki flow/copy;
- penambahan core screen baru membutuhkan scope decision;
- visual polish tidak dilakukan sebelum low-fi flow accepted.

Upgrade ke high fidelity hanya setelah:
- core information hierarchy cukup dipahami;
- HOL-86 field requirements stabil;
- HOL-87 semantics dapat ditampilkan tanpa ambiguity;
- top blocking UX issues selesai/accepted.
