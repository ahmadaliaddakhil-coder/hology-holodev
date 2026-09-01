# RembukTani — HOL-85A App Shell & Supporting Pages Figma Guide v0.1

**Scope:** Supporting/common web-app surfaces around the core RembukTani decision workflow  
**Platform recommendation:** Mobile-first Responsive Web App / PWA  
**Status:** **DRAFT — DESIGN GUIDE / NOT YET FROZEN**  
**Date:** 2 September 2026

> Dokumen ini membahas **halaman dan fitur pendukung aplikasi**, bukan core reasoning/decision-support flow. Core feature dijelaskan terpisah dalam `HOL-85B`.

---

# 1. Research Basis & Design Lessons

Bagian ini berasal dari web research, lalu disesuaikan dengan scope RembukTani.

## 1.1 Adaptive application navigation

Pattern umum aplikasi responsif:

- compact/mobile → bottom navigation;
- medium/tablet → navigation rail;
- expanded/desktop → rail atau persistent drawer;
- destination yang paling sering digunakan diberi prominence;
- action yang jarang digunakan dipindahkan ke secondary menu/settings.

Implikasi untuk RembukTani:

> Jangan membuat 7–8 top-level menu hanya karena space desktop tersedia.

RembukTani cukup memiliki sedikit top-level destinations.

---

## 1.2 Stateful Home, bukan decorative dashboard

Pattern aplikasi yang baik menggunakan Home sebagai:
- entrance;
- resume point;
- tempat melihat apa yang membutuhkan perhatian;
- shortcut ke primary task;
- recent activity.

Home tidak harus penuh KPI/chart.

Implikasi:

> Home RembukTani harus menjawab “apa yang perlu saya lanjutkan atau lakukan?”, bukan “berapa banyak chart yang bisa kita tampilkan?”

---

## 1.3 Rice Crop Manager / agricultural DSS pattern

IRRI Rice Crop Manager / Crop Manager menunjukkan beberapa pattern yang relevan:

- account/context dapat ada di luar main questionnaire;
- data field dikumpulkan lewat guided input;
- hasil disimpan;
- hasil dapat dibagikan;
- offline input dapat disimpan sebagai pending dan diproses ketika connection kembali.

Yang dapat diadopsi:
- guided task flow;
- records/history;
- save/share;
- explicit pending/sync state.

Yang tidak di-copy:
- recommendation logic;
- farmer database complexity;
- nutrient-management fields;
- claim agronomis.

---

## 1.4 PWA good practice

PWA seharusnya:
- tetap usable sebagai normal web app;
- responsive pada berbagai viewport;
- punya custom offline experience;
- menjelaskan connection/sync status;
- tidak membuat browser default error sebagai experience utama;
- installability menjadi enhancement, bukan blocker.

Implikasi:

> RembukTani tidak perlu memaksa “Install App” saat first visit.

---

## 1.5 Login good practice

Login/registration menambah friction.

Good practice:
- jangan minta login jika user belum membutuhkan persistent/personal features;
- form singkat;
- jelaskan manfaat account;
- jangan mengumpulkan field yang tidak relevan.

Untuk RembukTani:

### Demo HOLOGY

> Demo sebaiknya dapat dibuka **tanpa login**.

### Real/persistent account mode

Login masuk akal jika dibutuhkan untuk:
- menyimpan Decision Record antar perangkat;
- role authorization;
- history;
- trusted-review routing.

Auth provider sendiri **belum dikunci** pada M1.

---

# 2. Proposed Application Architecture — UX Layer

RembukTani dibagi menjadi:

```text
PUBLIC / ENTRY
│
├── Landing / Demo Entry
├── Login
└── First-time Account Setup (conditional)

AUTHENTICATED APP SHELL
│
├── Home
├── Riwayat
└── Profil
      ├── Settings
      ├── Data & Privacy
      ├── Help / About
      └── Sign Out

CORE DECISION WORKSPACE
│
└── lihat HOL-85B
```

---

# 3. Recommended Top-Level Navigation

## Mobile

Recommended bottom navigation:

```text
Beranda
Riwayat
Profil
```

Tiga item sudah cukup.

### Kenapa bukan lima?

Karena saat ini kita belum mempunyai committed top-level product untuk:
- Analytics
- Community
- Marketplace
- Notification Center
- Hamparan Management
- Tasks

Jangan membuat nav placeholder untuk feature yang belum ada.

---

# 4. Primary Decision Action

Primary action aplikasi:

> **Mulai / Tinjau Keputusan**

Action ini lebih baik menjadi:
- prominent CTA pada Home;
- floating/primary action jika visual language Anda mendukung;
- contextual action pada relevant surfaces.

Bukan harus menjadi top-level navigation destination.

---

# 5. Navigation Adaptation

## Mobile / Compact

Bottom nav:

```text
Beranda | Riwayat | Profil
```

Core decision flow:
- bottom nav dapat disembunyikan;
- gunakan focused app bar + Back + progress.

Tujuan:
> mengurangi accidental exit dari critical decision flow.

---

## Tablet / Medium

Gunakan Navigation Rail.

Destinations:
- Beranda
- Riwayat
- Profil

Primary action:
> Mulai Keputusan

dapat berada sebagai prominent rail action atau di content area.

---

## Desktop / Expanded

Gunakan:
- compact/expanded navigation rail; atau
- permanent drawer jika cocok dengan visual style.

Jangan membuat sidebar enterprise yang berisi menu kosong.

---

# 6. Public Landing Page

**ID:** `S01_PublicLanding`

**Status:** Supporting / recommended for competition presentation, bukan core product requirement.

## Tujuan

- memperkenalkan RembukTani;
- membedakan product dari weather/information app;
- memberi jalan ke demo;
- memberi jalan ke login.

---

## Hero

### Brand

> RembukTani

### Headline

Suggested:

> **Dari informasi pertanian menuju keputusan lokal yang lebih dapat dipahami.**

atau versi positioning:

> **From agricultural intelligence to trusted local action.**

### Supporting text

> Hubungkan informasi iklim yang tersedia dengan kondisi aktual hamparan, lihat alasan dan ketidakpastiannya, lalu tetapkan keputusan manusia yang dapat ditelusuri.

### CTA Primary

> **Coba Demo**

### CTA Secondary

> **Masuk**

---

## Product Boundary Note

Small but visible:

> Demo menggunakan data simulasi dan bukan dasar keputusan pertanian nyata.

---

## How It Works

Maximum 4 steps:

```text
1. Lihat kondisi lokal
2. Bandingkan evidence
3. Pahami assessment & alternatif
4. Tetapkan keputusan manusia
```

Tidak perlu menjelaskan seluruh architecture.

---

## Product Preview

Gunakan screenshot / mockup:
- Evidence & Assessment;
- Decision Record.

Jangan hero image berupa generic stock farmer jika tidak membantu memahami produk.

---

## Trust / Product Principles

Bisa berupa tiga short points:

- Evidence dapat ditelusuri
- Ketidakpastian terlihat
- Keputusan akhir tetap manusia

---

## Jangan masukkan

- fake testimonials;
- fake farmer count;
- pricing;
- marketplace;
- yield improvement claim;
- fake partner logos;
- blog/news section hanya agar landing panjang.

---

# 7. Demo Entry Page

**ID:** `S02_DemoEntry`

Boleh menyatu dengan Landing.

## Tujuan

Membuat user/juri masuk ke fixture tanpa auth.

### Content

> Demo RembukTani

Card:

```text
DEMO-WATER-01
Blok Tirto A3
Padi · Flowering
Kondisi air perlu ditinjau
```

Persistent:

> DATA SIMULASI

CTA:
> Buka Skenario Demo

Secondary:
> Tentang data demo

---

# 8. Login Page

**ID:** `S03_Login`

**Status:** Supporting / auth implementation masih TBD.

## Tujuan

Memberikan access ke persistent app mode.

---

## Layout

### Brand

RembukTani logo/name.

### Heading

> **Masuk ke RembukTani**

### Supporting

> Simpan riwayat keputusan dan lanjutkan pekerjaan Anda di perangkat lain.

Jangan hanya:
> “Welcome back!”

Lebih baik menjelaskan manfaat login.

---

## Auth Form — Provider Neutral

Karena auth technology belum dikunci, buat component variants.

### Variant A — Identity provider

Placeholder component:

> `ContinueWithProvider`

Nanti bisa menjadi:
- Google;
- organization identity;
- other provider.

Jangan commit provider dari Figma kalau Full-stack belum memutuskan.

### Variant B — Email/password

Jika akhirnya digunakan:

Fields:
- Email
- Password

Actions:
- Masuk
- Lupa password

### Variant C — Passwordless

Jika dipilih engineering:
- Email
- Kirim link masuk

---

## Demo Escape Hatch

Prominent but secondary:

> **Lanjutkan ke Demo tanpa akun**

Ini penting untuk HOLOGY.

---

## Error States

- credentials invalid;
- network unavailable;
- account not authorized;
- server unavailable.

Copy jangan:
> `401 Unauthorized`

Gunakan:
> Email atau password belum cocok.

---

# 9. Registration / First-Time Setup

**ID:** `S04_AccountSetup`

**Status:** Conditional.

## Good practice

Jangan membuat onboarding panjang.

Gunakan minimum required information.

---

## Potential fields

Only if truly needed:

- Display name
- Organization / kelompok name — optional depending product
- Contact identity from auth provider

### Role

Do **not** let user freely self-assign privileged role in real production.

Better:

> Role berasal dari invitation / organization assignment.

For demo:
- role fixture can be selected for presentation only.

---

## Jangan kumpulkan

- NIK;
- tanggal lahir;
- alamat rumah;
- rekening;
- data finansial;
- full personal profile petani.

Tidak diperlukan core product.

---

# 10. Home Page

**ID:** `S05_Home`

Ini adalah halaman yang user maksud sebagai “home page”.

Tetapi:

> **Home ≠ analytics dashboard.**

---

# 11. Home Goal

Menjawab:

1. Apa yang perlu saya lakukan?
2. Apakah ada keputusan yang perlu dilanjutkan?
3. Apa keputusan terakhir saya?
4. Apakah ada system/sync state penting?

---

# 12. Home Layout

## A. App Header

Mobile:
- RembukTani logo/name;
- connection/sync icon if relevant;
- profile avatar shortcut optional.

Desktop:
- app title;
- primary action.

---

## B. Greeting / Role

Example:

> Selamat datang, Pak Arif

Secondary:

> Decision Facilitator · Demo Farmer Group

If identity isn't known:
> Selamat datang

Role more important than profile biography.

---

## C. Primary Action

Most prominent:

> **Mulai keputusan baru**

or:

> **Tinjau kondisi & buat keputusan**

Do not say:
> “Ask AI”

---

## D. Continue Current Decision

If there is an active draft:

Card:

```text
Keputusan yang belum selesai

Blok Tirto A3
Kondisi air perlu ditinjau

Status:
Assessment tersedia

Terakhir dibuka:
Hari ini, 14:30
```

CTA:

> Lanjutkan keputusan

This is a useful stateful-home pattern.

---

## E. Needs Attention

Optional area only when there is actual state needing attention.

Examples:
- evidence perlu diperbarui;
- review sudah masuk;
- draft decision not finished.

Do not create artificial alerts.

Card examples:

### Evidence stale

> Kondisi air Blok Tirto A3 perlu diperbarui.

### Review returned

> Pertimbangan reviewer tersedia untuk keputusan Blok Tirto A3.

---

## F. Recent Decisions

Maximum 3–5 latest records.

List item:

```text
Blok Tirto A3
Verifikasi kondisi/alokasi air terbaru...
31 Agu 2026 · 14:10
Human Decision
```

CTA:
> Lihat semua riwayat

---

## G. PWA / Connection Status — Contextual

Do not permanently dominate Home.

Possible lightweight status:

> Semua data terbaru sudah tersinkron.

or:

> Perubahan akan disinkronkan saat koneksi kembali.

Only if engineering supports pending sync.

---

## H. Install Prompt

Do not show immediately on first visit.

Possible card after repeat use:

> Akses RembukTani lebih cepat dari layar utama.

CTA:
> Pasang aplikasi

Secondary:
> Nanti

Never block app.

---

# 13. Home Empty State

For a new account:

Heading:

> **Belum ada keputusan**

Supporting:

> Mulai dari satu decision moment untuk menghubungkan evidence dengan kondisi hamparan.

CTA:
> Mulai keputusan

Do not show empty charts.

---

# 14. Home Loading / Error

## Loading

Skeleton only for:
- current decision;
- recent history.

## Error

If recent records fail:

> Riwayat terbaru belum dapat dimuat.

Home primary action should remain usable if possible.

---

# 15. History / Riwayat Page

**ID:** `S06_History`

## Tujuan

Memberi access ke immutable Decision Records.

History is valuable because RembukTani's core value includes traceability.

---

# 16. History Content Structure

## Header

> **Riwayat Keputusan**

Subtitle optional:

> Lihat keputusan yang pernah dicatat dan evidence yang digunakan saat itu.

---

## Search

Don't make huge permanent search bar if there are only 3 records.

Use:
- expandable search;
- show full search when volume grows.

Search candidates:
- hamparan name;
- decision text.

---

## Filters

Only useful filters.

Potential:
- Semua
- Belum selesai / Draft
- Tercatat
- Date range
- Hamparan

Optional:
- Review status

Do not create twenty filter chips.

---

# 17. Decision History Row / Card

Primary information:

### First line

> Blok Tirto A3

### Second

Truncated final decision:

> Verifikasi kondisi/alokasi air terbaru...

### Metadata

- date/time;
- crop/stage if needed;
- Human Decision;
- review status;
- MOCK badge if demo.

Optional:

> Revision 2

if revision exists.

---

## Status distinction

Need distinguish:

### Draft Decision Context

> Belum selesai

### Decision Record

> Tercatat

Do not merge them invisibly.

---

# 18. History Sorting

Default:

> Newest first

This fits recent activity/history scanning.

Optional:
- Oldest
- Hamparan A–Z

No need for advanced table sorting on mobile.

---

# 19. History Empty State

> **Belum ada riwayat keputusan**

Supporting:

> Keputusan yang telah dikonfirmasi akan muncul di sini.

CTA:
> Mulai keputusan

---

# 20. History Detail

When user opens a recorded item:

> Route to **P07 Decision Record** from HOL-85B.

Do not design a separate conflicting decision detail layout.

Read-only historical Decision Record should preserve:
- evidence snapshot;
- assessment snapshot;
- review;
- final decision;
- limitations;
- revision.

---

# 21. Revision History

If a Decision Record was superseded:

Show:

> Versi terbaru tersedia

or:

> Keputusan ini diperbarui pada 2 Sep 2026.

CTA:
> Lihat versi terbaru

And:

> Lihat versi sebelumnya

Never silently overwrite history.

---

# 22. Profile Page

**ID:** `S07_Profile`

## Tujuan

Account identity + supporting preferences.

Profile should not become farmer biodata.

---

# 23. Profile Header

### Avatar

Initials or image if user uploads one.

Profile image is optional.

### Display name

> Pak Arif

### Role

> Decision Facilitator

### Organization

> Demo Farmer Group

if product/team actually uses this field.

---

# 24. Profile Sections

## Account

- Display name
- Login identity/email if auth uses it
- Role — read-only unless admin-controlled
- Organization/group

## Application

- Install PWA / installation status
- Appearance only if theme is implemented
- Language only if multilingual is implemented

Do not design fake settings.

## Data & Privacy

- View stored data summary
- Privacy information
- Sign out

Deletion/export:
> do not expose destructive action until backend policy exists.

## Help

- How RembukTani works
- Understanding evidence
- Understanding confidence
- About demo data
- Contact/help if available

---

# 25. Settings Page

**ID:** `S08_Settings`

Status:
> Supporting, nested under Profile.

Good practice:
- settings are infrequently changed preferences;
- don't put daily actions here.

Potential settings only if implemented:

### Display
- theme / follow system

### Language
- Indonesian / other supported language

### PWA Storage
- offline/cache info if engineering implements

### Accessibility
Only explicit app preferences you actually support.

---

## Do not put in Settings

- Make Decision
- Update Field Pulse
- Decision History
- Review Queue

Those are tasks, not preferences.

---

# 26. Help & About

**ID:** `S09_HelpAbout`

This surface can be useful because RembukTani has unusual concepts.

Sections:

### Apa itu RembukTani?

Short product explanation.

### Apa itu Evidence?

Plain-language explanation.

### Apa arti Keyakinan Penilaian?

Important:
> confidence is not risk severity or probability.

### Siapa yang membuat keputusan?

> manusia.

### Tentang data demo

> simulated.

### Limitation

> baseline is not validated agronomic prescription.

This is product education, not marketing claim.

---

# 27. Offline / Connection Experience

**ID:** `S10_OfflineState`

PWA should not dump user onto browser default offline error.

---

# 28. Global Connection Status

Use subtle component:

### Online

Usually no need to say “Online”.

### Connection lost

> **Koneksi terputus**

Supporting:
> Anda masih dapat melihat data yang sudah tersedia. Beberapa perubahan mungkin menunggu koneksi kembali.

Only claim this if implemented.

### Sync pending

> 2 perubahan menunggu sinkronisasi

### Sync successful

Use brief snackbar/toast:
> Perubahan sudah tersinkron.

---

# 29. Custom Offline Page

If destination isn't locally available:

> **Halaman ini belum tersedia tanpa koneksi**

Options:
- Kembali ke Beranda
- Coba lagi

If recent records are cached:
> Lihat data yang tersedia di perangkat

Do not promise full offline functionality unless built.

---

# 30. Pending Data Pattern — Future-Friendly

Rice Crop Manager uses pending inputs when offline.

This pattern can be useful for RembukTani **only if implemented**.

Possible:

```text
Field Pulse
Saved on device
Pending sync
```

Never:
> show “saved” ambiguously if only saved locally.

Use:
> Tersimpan di perangkat · Belum tersinkron

---

# 31. PWA Install Experience

**ID:** `S11_PWAInstall`

Install is enhancement.

Possible prompt:

> **Tambahkan RembukTani ke layar utama**

Benefits:
- access faster;
- standalone app window.

Do not claim:
- full offline;
- push notification;
- background sync

unless implemented.

CTA:
> Pasang

Secondary:
> Nanti

---

# 32. Global Notifications / Toasts

Use for transient feedback:

- Saved
- Copied
- Sync success
- Share prepared

Do not use notification/toast for:
- critical missing evidence;
- stale assessment;
- human authority warning.

Critical state belongs in page content.

---

# 33. Notification Center?

**Recommendation: DO NOT DESIGN YET.**

Reason:
- notification engine not committed;
- not needed for core demo;
- empty feature invites feature creep.

If later evidence supports:
- review returned;
- stale evidence;
- decision requires update;

then create separate issue.

---

# 34. Search?

Use only where information volume justifies it.

### History
Potentially useful.

### Home
No.

### Profile
No.

### Core decision flow
No global search.

RembukTani is not an information search engine.

---

# 35. Common Empty States

Create reusable component:

`EmptyState`

Properties:
- icon/illustration;
- title;
- description;
- primary CTA;
- optional secondary.

Examples:

### No history
> Belum ada keputusan tercatat.

### No active decision
> Tidak ada keputusan yang sedang berlangsung.

### No review
No empty-state needed; review is optional.

---

# 36. Common Error States

Reusable pattern:

```text
What happened
What is affected
What user can do
```

Examples:

> Riwayat belum dapat dimuat. Keputusan baru tetap dapat dibuat.

> Profil belum dapat dimuat. Coba kembali beberapa saat lagi.

---

# 37. App Shell Components

Create these reusable Figma components:

- AppLogo
- AppTopBar
- MobileBottomNav
- NavigationRail
- NavigationDrawer
- UserAvatar
- PrimaryAction
- ConnectionStatus
- SyncStatus
- InstallPrompt
- EmptyState
- GenericError
- SearchInput
- FilterChip
- DecisionHistoryItem
- ActiveDecisionCard
- SettingRow
- ProfileHeader
- Snackbar

---

# 38. Suggested Bottom Navigation Component

Destinations:

### Home

Icon + label:
> Beranda

### History

> Riwayat

### Profile

> Profil

No icon-only nav.

---

# 39. App Shell Behavior Inside Core Flow

When entering core Decision Workspace:

## Mobile

Hide bottom nav.

Show:
- Back;
- decision title;
- workflow progress;
- contextual actions.

Why:

> Core journey is a focused multi-step task.

## Desktop

Navigation rail may remain visible if it doesn't distract.

But primary content must remain clearly focused.

---

# 40. Deep Linking

PWA/web advantage:

Useful routes may be directly addressable.

Examples:

```text
/app
/app/history
/app/decision/{id}
/app/decision-record/{id}
/app/profile
```

Do not expose secrets in URLs.

Deep link to Decision Record can be useful after share/auth.

---

# 41. Home vs History vs Core Feature

## Home

> What should I do / continue?

## History

> What decisions have already happened?

## Core Decision Workspace

> Help me make this decision now.

This separation prevents Home from becoming a duplicate of every feature.

---

# 42. What Should NOT Be a Supporting Feature Yet

Do not design:

- analytics dashboard;
- weather dashboard;
- map center;
- community/social feed;
- marketplace;
- task kanban;
- chat;
- notification center;
- member management suite;
- leaderboard;
- crop disease scanner;
- general AI assistant;
- document repository.

Unless a new evidence-backed issue introduces it.

---

# 43. Figma Page Structure for Supporting Surfaces

Recommended Figma pages:

## `10 — App Shell`

- mobile bottom nav
- desktop rail/drawer
- app top bars
- connection states

## `11 — Public & Auth`

- Landing
- Demo Entry
- Login
- Account Setup

## `12 — Home`

- New user
- Active decision
- Needs attention
- Offline/sync variation

## `13 — History`

- list
- empty
- search/filter
- loading/error
- revision state

## `14 — Profile & Settings`

- profile
- settings
- help/about

## `15 — PWA States`

- install
- offline
- sync pending
- update available if implemented

---

# 44. Supporting Frame Naming

Examples:

```text
S01_PublicLanding_Default_Desktop1440
S02_DemoEntry_Default_Mobile390
S03_Login_Default_Mobile390
S03_Login_Error_Mobile390

S05_Home_Default_Mobile390
S05_Home_Empty_Mobile390
S05_Home_SyncPending_Mobile390

S06_History_Default_Mobile390
S06_History_Empty_Mobile390
S06_History_Search_Mobile390

S07_Profile_Default_Mobile390
S08_Settings_Default_Mobile390

S10_OfflineState_Default_Mobile390
S11_PWAInstall_Prompt_Mobile390
```

---

# 45. Priority for M1 / HOLOGY

## High priority supporting screens

1. Home
2. History
3. Demo Entry
4. App Shell
5. Offline/error shell

## Medium

6. Login
7. Profile

## Low / only if implementation exists

8. Registration
9. Settings
10. PWA custom install UI
11. Advanced history search

This keeps design effort proportional to product maturity.

---

# 46. Recommended Demo Navigation

Competition flow:

```text
Landing / Demo Entry
↓
Home (optional brief)
↓
Open DEMO-WATER-01
↓
CORE FEATURE (HOL-85B)
↓
Decision Record
↓
History demonstrates persistence/traceability
```

This makes the app feel complete without adding unsupported product mechanics.

---

# 47. Final Recommendation

Yes, RembukTani should feel like a **complete web application**, not merely seven isolated workflow screens.

But completeness should come from:

- coherent app shell;
- useful Home;
- trustworthy History;
- account/profile;
- network/PWA states;
- deep linking;
- consistent navigation;

not from adding unrelated agricultural features.

A good supporting shell should make the core decision workflow **easier to enter, resume, trust, and revisit**.
