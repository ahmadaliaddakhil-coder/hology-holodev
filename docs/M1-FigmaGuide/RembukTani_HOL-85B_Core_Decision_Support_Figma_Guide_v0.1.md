# RembukTani — HOL-85B Core Decision-Support Feature Figma Guide v0.1

**Scope:** Main feature / core system surfaces only  
**Platform:** Mobile-first Responsive Web App / PWA  
**Status:** **DRAFT — FIGMA DESIGN SPEC / HOL-84 PARTICIPANT RESULTS PENDING**  
**Date:** 2 September 2026

> Dokumen ini menjelaskan **main feature RembukTani**. App shell, Home, Login, Profile, History, PWA supporting states dijelaskan dalam `HOL-85A`.

---

# 1. Core Product Definition

Main feature RembukTani bukan dashboard.

Ia adalah:

> **Decision Workspace**

yang membantu decision facilitator bergerak melalui:

```text
Decision Moment
↓
Field Pulse
↓
Evidence & Assessment
↓
Action Alternatives
↓
Optional Trusted Review
↓
Final Human Decision
↓
Decision Record
```

Core journey selesai di:

> **Decision Record**

Share/handoff setelahnya optional.

---

# 2. UX Principle

Setiap core page harus membantu menjawab salah satu pertanyaan:

```text
P01 — Apa yang sedang kita putuskan?
P02 — Apa kondisi lokalnya?
P03 — Evidence apa dan apa artinya?
P04 — Pilihan apa yang bisa dipertimbangkan?
P05 — Perlu pertimbangan manusia lain?
P06 — Apa keputusan manusia?
P07 — Apa yang akhirnya tercatat?
```

---

# 3. Core App Shell Behavior

Ketika user masuk ke Decision Workspace:

## Mobile

Hide global bottom nav.

Use:
- Back;
- compact decision context;
- workflow progress;
- sticky bottom CTA.

Reason:

> keputusan adalah focused task.

## Desktop

Global rail can remain, but:
- content width focused;
- core workflow hierarchy dominates.

---

# 4. Workflow Progress

Internal five-stage model:

```text
1. Konteks
2. Kondisi
3. Penilaian
4. Pilihan
5. Keputusan
```

Do not make Review a mandatory progress step.

Review is a branch from Stage 4.

Decision Record is Stage 5 result.

---

# 5. Persistent Demo Status

For fixture demo:

Visible on all core surfaces:

> **DEMO · DATA SIMULASI**

Recommended locations:
- app bar;
- evidence source metadata;
- Decision Record.

Never only on first page.

---

# 6. P01 — Decision Moment

**Frame ID:** `P01_DecisionMoment_Default`

## Purpose

Define bounded decision context.

## User asks

> Apa yang sedang perlu ditinjau?

---

## Content hierarchy

### A. Page Heading

> **Kondisi air perlu ditinjau**

Supporting:

> Periksa kondisi hamparan dan evidence sebelum menetapkan langkah berikutnya.

---

### B. Decision Context Summary

Card with:

**Hamparan**
> Blok Tirto A3

**Location**
> Kepanjen, Kabupaten Malang

**Crop**
> Padi

**Variety**
> Inpari 32

**Growth stage**
> Flowering

**Planting date**
> 15 Juni 2026

Planting date can be secondary metadata.

---

### C. Decision Question

Section label:

> **Yang sedang dinilai**

Content:

> Apakah rencana terkait kondisi air Blok Tirto A3 perlu ditinjau berdasarkan evidence saat ini?

---

### D. Trigger Context

> Kondisi air hamparan perlu diperiksa kembali bersama informasi iklim terbaru.

Do not imply automatic AI detection.

---

### E. Primary CTA

> **Tinjau kondisi lapangan**

Secondary:
> Kembali

---

# 7. P01 States

## Loading

Skeleton:
- context;
- question.

## Invalid Context

> Informasi keputusan belum lengkap.

Show missing fields.

## Load Error

> Konteks keputusan belum dapat dimuat.

CTA:
> Coba lagi

---

# 8. P02 — Field Pulse / Kondisi Lapangan

**Frame ID:** `P02_FieldPulse_Default`

## Purpose

Capture or confirm local evidence.

## User asks

> Apa kondisi hamparan sekarang?

---

# 9. P02 Header

User-facing title:

> **Kondisi Lapangan**

Supporting:

> Pastikan kondisi lokal masih relevan sebelum penilaian dihitung.

---

# 10. Freshness Block

Prominent status:

```text
Terakhir diamati
31 Agu 2026 · 14:30

Status
Masih berlaku
```

State variants:
- Current
- Stale
- Unknown
- Missing

Use:
- text;
- icon;
- semantic style.

Not color only.

---

# 11. Field Pulse Inputs

## A. Water Status

Label:

> **Kondisi air**

Recommended control:
- radio cards;
- single-select tiles;
- accessible radio group.

Example values:
- Cukup
- Rendah
- Kritis rendah
- Tidak diketahui

Do not introduce new taxonomy outside contract.

---

## B. Irrigation Status

> **Kondisi irigasi**

Examples:
- Mengalir
- Terbatas
- Kering
- Tidak diketahui

---

## C. Observed Flow

Display/raw input:

> **Aliran tercatat**
> 20%

Critical helper:

> Nilai ini merupakan observasi fixture, bukan threshold risiko ilmiah.

Do not:
- make red progress bar at 20%;
- call it “80% deficit”;
- map to risk severity.

---

## D. Soil Observation

> **Permukaan tanah**
> Retak dangkal

---

## E. Notes

> **Catatan tambahan**

Optional textarea.

---

# 12. Field Source

Compact metadata:

```text
Sumber
Observasi lapangan

Pengumpul
Demo Farmer Group

Waktu
31 Agu 2026 · 14:30
```

---

# 13. P02 Primary Actions

Current:

> **Gunakan kondisi ini**

Missing/stale:

> **Perbarui kondisi**

Secondary:
> Lanjut tanpa update

If user continues with missing/stale evidence:
> system may abstain.

Make this consequence visible.

---

# 14. P02 — Empty/Missing State

Hero state:

> **Kondisi air terbaru belum tersedia**

Supporting:

> Informasi lokal dibutuhkan agar evidence iklim dapat dibandingkan dengan kondisi hamparan.

CTA:
> Tambahkan observasi

Secondary:
> Lanjutkan dengan keterbatasan

---

# 15. P02 — Stale State

Banner:

> **Kondisi ini perlu diperbarui**

Supporting:

> Observasi terakhir sudah melewati waktu berlaku untuk penilaian ini.

CTA:
> Perbarui sekarang

---

# 16. P02 — Invalid State

Inline validation.

Example:

> Pilih kondisi air atau tandai “Tidak diketahui”.

Do not rely on generic toast.

---

# 17. P02 — Save Error

> **Perubahan belum tersimpan**

Supporting:
> Input Anda tetap tersedia.

CTA:
> Coba simpan lagi

---

# 18. P03 — Evidence & Assessment

**Frame ID:** `P03_EvidenceAssessment_Default`

This is the signature decision-support surface.

## User asks

> Apa arti informasi ini untuk keputusan saya, dan kenapa?

---

# 19. Recommended P03 Hierarchy

```text
1. Assessment Summary
2. Confidence
3. Why / Factors
4. Missing Evidence
5. Evidence Sources
6. Limitations
```

The user gets interpretation first, then can audit the basis.

---

# 20. Assessment Summary

Section:

> **Penilaian kondisi**

Happy fixture:

> **Perlu perhatian lebih**

Support:

> Evidence iklim dan kondisi air lokal menunjukkan situasi yang perlu diperiksa sebelum perubahan rencana dilakukan.

Avoid:
- “Critical drought”
- “High danger”
- probability language.

---

# 21. Confidence

Label:

> **Keyakinan penilaian**

Value:

> **Sedang**

Helper:

> Evidence minimum tersedia, tetapi masih ada informasi penting yang perlu dikonfirmasi.

Never treat Medium as:
- medium risk;
- 50%;
- calibrated probability.

---

# 22. Factors / Why

Heading:

> **Mengapa penilaian ini muncul?**

Each `FactorItem`:

- title;
- plain-language reason;
- source link;
- optional technical detail.

---

## Factor A

> **Curah hujan berada pada kategori di bawah normal**

Source:
> Informasi iklim · BMKG mock fixture

---

## Factor B

> **Kondisi air lokal menunjukkan kekurangan air**

Source:
> Kondisi Lapangan

---

## Factor C

> **Fase flowering menambah perhatian terhadap kondisi air**

Supporting:

> Faktor ini digunakan karena local water-shortage signal sudah ada.

Do not phrase as standalone causal risk.

---

# 23. Missing Evidence

Heading:

> **Informasi yang masih diperlukan**

Happy fixture:

> Konfirmasi kondisi/sumber/alokasi air terbaru sebelum perubahan operasional.

Status chip:
> Perlu dikonfirmasi

Show impact:

### Material

> Keputusan masih dapat dipertimbangkan, tetapi ada keterbatasan.

### Blocking

> Penilaian belum dapat dilanjutkan.

---

# 24. Evidence Board

User-facing heading:

> **Dasar informasi**

---

# 25. External Evidence Card

Title:

> **Informasi iklim**

Quick view:
- BMKG · DEMO
- Curah hujan: di bawah normal
- Horizon: 10 hari
- Total forecast: 12.5 mm
- Periode kering fixture: 8 hari
- Freshness/current status.

Expandable metadata:
- source;
- provenance;
- observed/forecast timestamp;
- valid_until;
- quality basis.

Copy:
> 8 hari tetap raw evidence, bukan threshold drought.

---

# 26. Local Evidence Card

Title:

> **Kondisi lapangan**

Quick:
- water: Kritis rendah
- irrigation: Kering
- observed flow: 20%
- soil: Retak dangkal
- current/stale.

Metadata:
- source;
- observed_at;
- freshness.

20%:
> raw observation only.

---

# 27. Human Observation Card

Title:

> **Observasi pihak tepercaya**

Example:
> PPL fixture

Quick:
- estimated rainfall: below normal
- water availability: critical low

Badge:
> Evidence tambahan

Human evidence is optional.

Do not visually imply PPL is above all other sources by authority hierarchy unless policy says so.

---

# 28. Evidence Detail Interaction

Default card:
- key signal;
- source;
- freshness.

Expanded:
- raw values;
- quality;
- provenance;
- timestamps.

Why:
> progressive disclosure prevents developer-console feel.

---

# 29. Limitations

Heading:

> **Batas penilaian**

Required on core assessment.

Examples:

- Data demo adalah simulasi.
- Baseline belum menjadi model agronomi tervalidasi.
- Sistem tidak menghitung jumlah/durasi pengairan.
- Keputusan akhir berada pada manusia.

Do not put critical limitation only in tiny tooltip.

---

# 30. P03 Actions

Primary:
> **Lihat pilihan tindakan**

Secondary:
> Perbarui kondisi lapangan

Tertiary:
> Lihat detail evidence

---

# 31. P03 — Loading / Assessing

Assessment region:

> **Menilai evidence...**

Keep loaded evidence visible.

Do not full-screen block unless technically necessary.

---

# 32. P03 — Insufficient Evidence

Assessment:

> **Evidence belum cukup**

Confidence:

> Rendah

Explain:

> Kondisi air lokal yang masih berlaku belum tersedia.

Missing:
> Fresh local water observation.

System behavior message:

> Sistem tidak memberikan opsi utama sampai evidence minimum tersedia.

CTA:
> Perbarui kondisi lapangan

Secondary:
> Lihat langkah yang tersedia

---

# 33. P03 — Stale State

Local Evidence Card:
> Perlu diperbarui

Assessment:
> Evidence belum cukup

Confidence:
> Rendah

Do not display stale evidence as current.

---

# 34. P03 — Conflict State

Heading:

> **Ada informasi yang berbeda**

Comparison component:

```text
Kondisi lapangan
Kritis rendah

Observasi pihak tepercaya
Memadai
```

Explain:

> Sistem tidak memilih salah satu sumber secara otomatis.

Confidence:
> Rendah

Actions:
- Perbarui observasi
- Minta pertimbangan

---

# 35. P03 — Reasoning Unavailable

Evidence cards remain.

Assessment region:

> **Penilaian belum tersedia**

Support:

> Evidence berhasil dimuat, tetapi sistem belum dapat menghasilkan assessment.

CTA:
> Coba lagi

Never show fabricated fallback.

---

# 36. P04 — Action Alternatives

**Frame ID:** `P04_ActionAlternatives_Default`

## User asks

> Pilihan apa yang bisa dipertimbangkan berdasarkan evidence saat ini?

---

# 37. Header

> **Pilihan tindakan**

Supporting:

> Pilihan berikut disusun dari evidence saat ini. Anda tetap menentukan keputusan akhir.

---

# 38. Assessment Mini Summary

Compact:

```text
Perlu perhatian lebih
Keyakinan: Sedang
1 informasi perlu dikonfirmasi
```

Link:
> Lihat penilaian

---

# 39. Action Option Component

Each card contains:

1. title;
2. action sentence;
3. rationale;
4. supporting evidence;
5. required evidence;
6. limitation;
7. eligibility;
8. CTA.

---

# 40. Option A

> **Verifikasi & siapkan penyesuaian**

Description:

> Verifikasi kondisi air terkini dan siapkan perubahan rencana bila kondisi kritis terkonfirmasi.

Eligibility:
> Conditional

Required:

> Konfirmasi kondisi/sumber/alokasi air terbaru.

CTA:
> Pertimbangkan opsi

---

# 41. Option B

> **Tambah evidence sebelum mengubah rencana**

Description:

> Pertahankan rencana sementara sambil meminta observasi kondisi air terbaru.

Limitation:

> Sistem belum menilai consequence agronomis dari menunda tindakan.

CTA:
> Pertimbangkan opsi

---

# 42. Option C

> **Minta pertimbangan pihak tepercaya**

Description:

> Minta reviewer membantu menilai evidence dan trade-off sebelum keputusan akhir.

Badge/helper:
> Opsional

CTA:
> Minta pertimbangan

---

# 43. Alternative Visual Equality

No ranked recommendation in HOL-87 v0.1.

Therefore:

Do NOT:
- show “Recommended”;
- use trophy/star;
- preselect A;
- make A card larger;
- place A alone above B/C;
- label “AI choice”.

Differences may only reflect:
- eligibility;
- missing requirements.

---

# 44. P04 — Insufficient Evidence State

Title:

> **Belum ada opsi utama**

Instead show recovery options:

- Perbarui Field Pulse
- Lengkapi external evidence if missing
- Minta pertimbangan

System:
> abstains.

---

# 45. P04 — Conflict State

Actions focus on:
- collect fresh observation;
- review.

No ranking.

---

# 46. P05 — Trusted Review / Minta Pertimbangan

**Frame ID:** `P05_TrustedReview_Request`

This is an optional branch.

## User-facing label

> **Minta Pertimbangan**

Internal:
> TrustedReview

---

# 47. Request Review Surface

Header:

> **Minta pertimbangan pihak tepercaya**

Support:

> Bagikan evidence dan assessment untuk mendapatkan masukan sebelum keputusan dibuat.

---

## Reviewer

Component:

```text
Bu Sari
PPL · Reviewer tepercaya
```

Component must allow another reviewer role.

PPL is fixture, not hard-coded architecture.

---

## Context Preview

Reviewer request shows:
- hamparan;
- decision question;
- assessment;
- confidence;
- option considered;
- missing evidence.

---

## Actions

Primary:
> Kirim permintaan

Secondary:
> **Lanjut tanpa review**

Helper:
> Review tidak wajib untuk membuat keputusan.

---

# 48. Reviewer View

Separate Figma prototype role if desired.

Reviewer sees:
- Decision Context
- Evidence
- Assessment
- Alternatives
- Missing Evidence
- Limitations

Actions:

```text
Setujui
Ubah
Tolak
Tambah catatan
```

---

# 49. Modify Review

Form:

> Perubahan yang disarankan

Textarea.

> Alasan

Textarea.

Submit:

> Kirim catatan

---

# 50. Review Safety Copy

Persistent:

> Masukan reviewer menjadi pertimbangan bagi decision facilitator dan tidak otomatis menjadi keputusan akhir.

---

# 51. Review States

Create variants:

- Not requested
- Requesting
- Pending
- Approved
- Modified
- Rejected
- Unavailable
- Cancelled

---

# 52. Reviewer Unavailable

> **Reviewer belum tersedia**

Actions:
- Pilih reviewer lain
- Lanjut tanpa review
- Tunda

No dead end.

---

# 53. P06 — Final Human Decision

**Frame ID:** `P06_HumanDecision_Default`

Safety-critical surface.

## User asks

> Setelah memahami semua informasi, apa keputusan saya?

---

# 54. Human Authority Banner

Visible before any decision input.

> **Keputusan akhir dibuat oleh manusia**

Support:

> Penilaian sistem dan reviewer hanya menjadi dasar pertimbangan.

---

# 55. Summary Before Decision

Compact components:

### Assessment
> Perlu perhatian lebih

### Confidence
> Sedang

### Considered option
> Verifikasi & siapkan penyesuaian

### Review
> Modified · Bu Sari

or:

> Tidak diminta

---

# 56. Decision Relationship Control

Recommended first input:

> **Bagaimana keputusan Anda dibanding pilihan sistem?**

Options:

- Gunakan opsi yang dipertimbangkan
- Modifikasi opsi
- Pilih keputusan berbeda
- Tunda untuk evidence tambahan

This supports auditability without forcing system alignment.

---

# 57. Final Decision Text

Label:

> **Keputusan akhir**

Editable textarea.

Do not make it locked system copy.

---

# 58. Rationale

Label:

> **Alasan keputusan**

Helper:

> Alasan ini disimpan bersama evidence yang digunakan.

Recommend required for demo.

---

# 59. Different from System

If user chooses:
> Keputusan berbeda

Show neutral message:

> **Keputusan Anda dapat berbeda dari opsi sistem.**

Support:
> Jelaskan alasan agar keputusan tetap dapat ditelusuri.

Do not use:
- error red;
- AI override warning;
- confirmation shame.

---

# 60. Review Modification

If reviewer modified:

Show:
- original considered option;
- reviewer note;
- user's final choice.

Do not replace system assessment with reviewer content.

---

# 61. Assessment Outdated

Before confirmation, if evidence version changed:

Blocking banner/dialog:

> **Evidence berubah sejak penilaian terakhir**

Support:
> Penilaian perlu diperbarui sebelum keputusan disimpan.

Primary:
> Perbarui penilaian

Secondary:
> Kembali

---

# 62. Confirmation Dialog / Sheet

Title:

> **Simpan keputusan ini?**

Show:

- final decision;
- rationale;
- review status;
- human authority;
- DEMO marker.

Primary:
> **Simpan Catatan Keputusan**

Secondary:
> Edit kembali

---

# 63. Saving State

CTA:
> Menyimpan...

Disable double submit.

---

# 64. Save Error

> **Keputusan belum berhasil disimpan**

Support:
> Draft keputusan Anda tetap tersedia.

CTA:
> Coba lagi

Do not navigate to success record.

---

# 65. P07 — Decision Record

**Frame ID:** `P07_DecisionRecord_Default`

This is core endpoint and one of the most important storytelling surfaces.

---

# 66. Success Header

> **Keputusan tercatat**

Badge/label:

> **Human Decision**

MOCK:

> DEMO · DATA SIMULASI

---

# 67. Decision Hero

Most visually prominent:

> Lakukan verifikasi kondisi/alokasi air terbaru Blok Tirto A3. Setelah verifikasi, pengurus menetapkan apakah rencana terkait air perlu disesuaikan.

---

# 68. Decision Metadata

- decided_at;
- facilitator role;
- optional display name;
- Decision Record ID;
- revision;
- mock status.

ID/revision can be secondary/expandable.

---

# 69. Decision Trace

Heading:

> **Bagaimana keputusan ini terbentuk**

Strong visual:

```text
Evidence
↓
Penilaian Sistem
↓
Pertimbangan Reviewer (opsional)
↓
Keputusan Manusia
```

This distinction should be obvious without reading documentation.

---

# 70. Evidence Snapshot

Show only evidence versions used for decision.

Summary:
- external;
- local;
- human if used;
- freshness at evaluation.

Link:
> Lihat detail evidence

Read-only.

---

# 71. Assessment Snapshot

Show:
- context state;
- confidence;
- factors;
- missing evidence;
- limitations.

Advanced:
- assessment version;
- reasoning version.

Do not overwhelm default view with rule IDs.

---

# 72. Review Snapshot

If review exists:

```text
Bu Sari · Trusted Reviewer
Status: Modified

Catatan:
Pastikan kondisi sumber/alokasi air terbaru dikonfirmasi...
```

If no review:

> Review tidak diminta

This is a normal state, not warning.

---

# 73. Decision Rationale

Separate from assessment.

Heading:

> **Alasan keputusan manusia**

Display rationale verbatim.

---

# 74. Limitations

Heading:

> **Batas keputusan**

Examples:
- Data demo/simulasi
- Baseline prototype
- Latest water allocation still needed
- No agronomic prescription

---

# 75. P07 Actions

Primary:
> **Bagikan ringkasan**

Secondary:
> Salin keputusan

Optional:
> Lanjutkan ke handoff

Navigation:
> Kembali ke Beranda
> Lihat Riwayat

---

# 76. Decision Record Historical Mode

When opened from History:

Add:

> Recorded 31 Aug 2026

If superseded:

> Keputusan ini memiliki versi lebih baru.

CTA:
> Lihat versi terbaru

Record remains read-only.

---

# 77. P08 — Share & Lightweight Handoff

**Frame ID:** `P08_ShareHandoff_Default`

Status:
> Optional continuation.

---

# 78. Share Section

Heading:

> **Bagikan keputusan**

Options:
- Copy summary
- Native/system share
- WhatsApp link if engineering implements

No internal chat.

---

# 79. Share Summary Preview

Show what will be shared:

```text
Hamparan
Decision
Reason
Date
Optional short evidence context
```

Do not include sensitive/irrelevant metadata.

---

# 80. Lightweight Handoff

Clearly label:

> **Opsional**

Potential fields:
- responsible role;
- execution window;
- status;
- exception note;
- outcome note.

Do not turn into Kanban.

---

# 81. Share Failure

> **Ringkasan belum dapat dibagikan**

CTA:
> Salin manual

Decision remains saved.

---

# 82. Core State Matrix

| Surface | Default | Loading | Empty/Missing | Error | Special |
|---|---|---|---|---|---|
| Decision Moment | Context ready | Yes | Invalid context | Load error | — |
| Field Pulse | Current | Saving | Missing | Save error | Stale |
| Evidence & Assessment | Complete | Assessing | Insufficient | Reasoning unavailable | Conflict |
| Alternatives | Alternatives | — | Abstain | No eligible option | Conditional |
| Trusted Review | Request | Sending | Not requested | Reviewer unavailable | Approved/Modified/Rejected |
| Human Decision | Editable | Saving | — | Save error | Different / outdated |
| Decision Record | Recorded | Loading | — | Load error | Superseded |
| Share | Ready | Sending | — | Share error | Optional handoff |

---

# 83. Responsive Core Behavior

## Mobile 360–412

- single column;
- sticky bottom CTA;
- cards stacked;
- bottom sheets for detail;
- global bottom nav hidden during flow.

## Tablet 768

- optional rail;
- evidence detail may use 2-column layout.

## Desktop 1280+

Evidence & Assessment:
- assessment/main reasoning region;
- evidence support pane.

Decision Record:
- final decision main column;
- trace/detail secondary pane.

Avoid excessive 3-column complexity.

---

# 84. Component Inventory — Core

Navigation:
- CoreAppBar
- WorkflowProgress
- StickyActionBar

Evidence:
- EvidenceCard
- EvidenceMeta
- FreshnessStatus
- MissingEvidenceItem
- ConflictComparison

Assessment:
- ContextState
- ConfidenceDisplay
- FactorItem
- LimitationNotice

Options:
- ActionOptionCard
- EligibilityBadge
- RequiredEvidenceBlock

Review:
- ReviewerCard
- ReviewStatus
- ReviewNote
- ReviewActions

Decision:
- HumanAuthorityBanner
- DecisionRelationRadio
- FinalDecisionInput
- RationaleInput
- ConfirmationSheet
- DecisionTrace
- DecisionRecordHero

System:
- DemoBadge
- LoadingBlock
- ErrorBlock

---

# 85. Required Component Variants

## EvidenceCard

```text
type:
external
local
human

freshness:
current
stale
unknown

mock:
true
false

expanded:
true
false
```

---

## Assessment

```text
state:
elevated_attention
no_elevated_signal
insufficient
conflict
unavailable

confidence:
medium
low
unknown
```

No `high` design required for M1 v0.1.

---

## Action Option

```text
eligibility:
eligible
conditional
not_eligible

selected:
true
false
```

No recommended variant.

---

## Review

```text
not_requested
pending
approved
modified
rejected
unavailable
```

---

# 86. Content Semantics

Do not let visuals change technical meaning.

### Attention state

Not:
> emergency severity

### Confidence

Not:
> probability

### Required Evidence

Not:
> user mistake

### Reviewer

Not:
> final approver

### Decision Record

Not:
> system recommendation record

It is:
> human decision trace.

---

# 87. System vs Human Visual Language

Make source layer visible.

Possible labels:

### Sistem
> Penilaian sistem

### External
> Informasi eksternal

### Local human observation
> Kondisi lapangan

### Reviewer
> Pertimbangan reviewer

### Final
> Keputusan manusia

Visual styling may differ but never rely only on color.

---

# 88. Copy Recommendations

Internal → user-facing:

```text
Evidence
→ Dasar informasi / Evidence

Assessment
→ Penilaian sistem

Confidence
→ Keyakinan penilaian

Missing evidence
→ Informasi yang masih diperlukan

Action alternatives
→ Pilihan tindakan

Trusted Review
→ Minta pertimbangan

Decision Record
→ Catatan keputusan
```

Final wording should be reconciled with HOL-84 participant results.

---

# 89. What Main Feature MUST NOT Add

Do not add inside Decision Workspace:

- weather dashboard;
- marketplace;
- chatbot;
- notifications feed;
- group chat;
- voting;
- analytics;
- member list;
- task board;
- IoT controls;
- map just for visual appeal;
- yield prediction;
- price prediction.

Supporting shell features belong HOL-85A; unsupported product features belong nowhere yet.

---

# 90. Main Feature Figma Page Structure

Recommended pages:

## `20 — Core Components`

All core components.

## `21 — Core Happy Flow Mobile`

P01–P07.

## `22 — Failure States`

Missing / stale / conflict / errors.

## `23 — Trusted Reviewer`

Request + reviewer states.

## `24 — Core Responsive`

Tablet / desktop.

## `25 — Core Prototype`

Clean connected frames.

## `26 — Core Dev Handoff`

Field mapping, state mapping, interactions.

---

# 91. Frame Naming

```text
P01_DecisionMoment_Default_Mobile390

P02_FieldPulse_Default_Mobile390
P02_FieldPulse_Missing_Mobile390
P02_FieldPulse_Stale_Mobile390
P02_FieldPulse_SaveError_Mobile390

P03_EvidenceAssessment_Default_Mobile390
P03_EvidenceAssessment_Insufficient_Mobile390
P03_EvidenceAssessment_Conflict_Mobile390
P03_EvidenceAssessment_Unavailable_Mobile390

P04_ActionAlternatives_Default_Mobile390
P04_ActionAlternatives_Abstained_Mobile390

P05_TrustedReview_Request_Mobile390
P05_TrustedReview_Modified_Mobile390
P05_TrustedReview_Unavailable_Mobile390

P06_HumanDecision_Default_Mobile390
P06_HumanDecision_Different_Mobile390
P06_HumanDecision_Outdated_Mobile390
P06_HumanDecision_Confirm_Mobile390
P06_HumanDecision_SaveError_Mobile390

P07_DecisionRecord_Default_Mobile390
P07_DecisionRecord_Superseded_Mobile390

P08_ShareHandoff_Default_Mobile390
P08_ShareHandoff_Error_Mobile390
```

---

# 92. HOL-86 Field Mapping

## P01

`decision_context`

## P02

`field_observation`

## P03

`evidence[]`
`assessment`
`evidence_evaluations`

## P04

`action_options[]`
`assessment.recommendation`

## P05

`trusted_reviews[]`

## P06

decision draft inputs before `DecisionRecord`

## P07

`decision_record`
snapshot refs

## P08

`handoff`

---

# 93. HOL-87 Mapping

P03/P04 must reflect:

```text
confidence high = disabled
ranked recommendation = disabled
missing local evidence → low + abstain
direct conflict → low + alternatives
```

Do not visually invent unsupported semantics.

---

# 94. HOL-88 Mapping

UI must preserve:

- MOCK/LIVE separation;
- human authority;
- no direct reasoner → action;
- optional review;
- assessment unavailable path;
- persistence confirmation;
- share failure non-blocking.

---

# 95. Core Accessibility

Required:

- 44px-ish touch target;
- keyboard focus;
- labels on icon actions;
- non-color-only state;
- readable font size;
- screen-reader-friendly form labels;
- inline error association;
- logical heading order;
- reduced-motion-compatible transitions.

---

# 96. Developer Handoff Note Template

Every final core frame:

```text
Frame:
P03_EvidenceAssessment_Default_Mobile390

Purpose:
Translate evidence into explainable assessment.

Input:
HOL-86 fields...

State:
assessment.status = complete

Primary action:
View Action Alternatives

Alternative states:
insufficient/conflict/unavailable

Safety:
MOCK persistent
confidence not probability
no recommended option
```

---

# 97. Figma Review Sequence

1. Data/content accuracy
2. Information hierarchy
3. Interaction
4. Failure states
5. Visual language
6. Responsive
7. Accessibility
8. Dev handoff

Do not begin with:
> “warna yang mana paling bagus?”

before semantics are correct.

---

# 98. HOL-84 Gate

Participant results still pending.

Therefore:
- build high-fi;
- do not final-freeze copy/hierarchy yet.

If test reveals:
- Evidence term confusing;
- Confidence confused with risk;
- review seems mandatory;
- final authority unclear;

those are blockers and must revise this design before handoff.

---

# 99. Core Definition of Done

Core high-fidelity ready when:

- all P01–P07 surfaces complete;
- P08 optional clearly separated;
- loading/empty/error states exist;
- insufficient/stale/conflict paths exist;
- review optional;
- human authority obvious;
- Decision Record preserves trace;
- mobile-first;
- tablet/desktop behavior defined;
- components/tokenized;
- accessibility notes included;
- HOL-86/87/88 field/state mapping documented;
- HOL-84 blocking findings resolved/accepted.

---

# 100. Main Feature North Star

When looking at the finished high-fi, a new viewer should be able to understand:

> “RembukTani tidak hanya menampilkan informasi. Ia mempertemukan informasi eksternal dan kondisi lokal, menjelaskan assessment serta uncertainty, menawarkan beberapa pilihan, memberi ruang pertimbangan manusia, lalu menyimpan keputusan manusia beserta alasannya.”

If that story is visually clear:

> the main feature design is doing its job.
