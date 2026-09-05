/**
 * RembukTani M2 Database Visual Flow
 * 
 * This document maps the complete data flow from user input through
 * decision-making and output generation.
 */

// ===================================
// 1. USER JOURNEY - HAPPY PATH
// ===================================

/*
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: AUTHENTICATE & CREATE PROFILE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User signs up with Supabase Auth                               │
│                    ↓                                             │
│  Trigger: On Auth Signup                                        │
│  Action: Create profile record in `profiles` table              │
│                    ↓                                             │
│  profile = {                                                     │
│    user_id: auth.user.id,                                       │
│    display_name: 'Budi Farmer',                                 │
│    role: 'farmer'                                               │
│  }                                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
*/

// ===================================
// 2. LAND SETUP - ONE TIME
// ===================================

/*
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: CREATE & RESOLVE LAND LOCATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User enters land details (manual or map):                      │
│                                                                   │
│  land = {                                                        │
│    owner_id: profile.id,                                        │
│    name: 'Blok Tirto A3',                                       │
│    latitude: -6.9271,                                           │
│    longitude: 110.4305,                                         │
│    location_source: 'manual'  ← Not yet resolved to adm4        │
│  }                                                               │
│                    ↓                                             │
│  Location Resolver Service:                                     │
│  • Match coordinates → administrative division                  │
│  • Fetch from geocoding/BMKG                                    │
│  • Update land record                                           │
│                    ↓                                             │
│  land (UPDATED) = {                                             │
│    ...above...,                                                  │
│    adm4_code: '3401060030',        ← Now resolved               │
│    province: 'Jawa Tengah',                                     │
│    regency: 'Sleman',                                           │
│    district: 'Kalasan',                                         │
│    village: 'Purwomartani',                                     │
│    location_resolved_at: '2026-09-04T10:30:00Z',                │
│    location_source: 'bmkg' or 'geocoding'                       │
│  }                                                               │
│                                                                   │
│  * Location resolved once — can have multiple lands             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
*/

// ===================================
// 3. CROP SETUP - SEASONAL
// ===================================

/*
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: SET ACTIVE CROP FOR SEASON                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User enters crop info (starts new season):                     │
│                                                                   │
│  crop_context = {                                               │
│    land_id: land.id,                                            │
│    crop_name: 'Padi Inpari 32',                                 │
│    variety_name: 'Inpari 32',                                   │
│    growth_stage: 'vegetative',                                  │
│    planting_date: '2026-08-15',                                 │
│    is_active: true  ← Only 1 per land!                          │
│  }                                                               │
│                    ↓                                             │
│  Database Constraint:                                           │
│  UNIQUE (land_id) WHERE is_active = TRUE                       │
│  (Automatically deactivates previous crop)                      │
│                                                                   │
│  * Never overwrites — historical record kept                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
*/

// ===================================
// 4. DECISION SESSION - CORE WORKFLOW
// ===================================

/*
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4A: CREATE DECISION CASE                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User initiates a decision:                                     │
│  "Should I irrigate? Is water condition OK?"                    │
│                                                                   │
│  decision_case = {                                              │
│    land_id: land.id,                                            │
│    crop_context_id: crop_context.id,                            │
│    created_by: profile.id,                                      │
│    decision_type: 'water_condition',  ← Topic of decision       │
│    status: 'draft'                                              │
│  }                                                               │
│                                                                   │
│  Status flow:                                                    │
│  draft                                                           │
│    ↓                                                             │
│  collecting_evidence                                            │
│    ↓                                                             │
│  assessed                                                        │
│    ↓                                                             │
│  review_pending (optional)                                      │
│    ↓                                                             │
│  ready_for_decision                                             │
│    ↓                                                             │
│  decided                                                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
*/

/*
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4B: COLLECT EVIDENCE FROM MULTIPLE SOURCES                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  System fetches + user enters data:                             │
│                                                                   │
│  ┌─ SOURCE 1: BMKG FORECAST ──────────┐                        │
│  │                                     │                        │
│  │  BMKG API request:                  │                        │
│  │  → external_source_cache (raw)      │                        │
│  │  → Normalize payload                │                        │
│  │  → decision_case_evidence (typed)   │                        │
│  │                                     │                        │
│  │  evidence = {                       │                        │
│  │    decision_case_id: ...,           │                        │
│  │    type: 'bmkg_forecast',           │                        │
│  │    source: 'BMKG',                  │                        │
│  │    payload: {                       │                        │
│  │      temperature: 24,               │                        │
│  │      humidity: 85,                  │                        │
│  │      condition: 'cloudy',           │                        │
│  │      rainfall_mm: 2.5               │                        │
│  │    },                               │                        │
│  │    observed_at: '2026-09-04T08:00Z',│                        │
│  │    freshness_status: 'fresh',       │                        │
│  │    is_mock: false                   │                        │
│  │  }                                  │                        │
│  │                                     │                        │
│  └─────────────────────────────────────┘                        │
│                                                                   │
│  ┌─ SOURCE 2: FIELD PULSE ────────────┐                        │
│  │                                     │                        │
│  │  User enters field observation:     │                        │
│  │  → decision_case_evidence (typed)   │                        │
│  │                                     │                        │
│  │  evidence = {                       │                        │
│  │    decision_case_id: ...,           │                        │
│  │    type: 'field_pulse',             │                        │
│  │    source: 'Manual',                │                        │
│  │    payload: {                       │                        │
│  │      water_presence: 'limited',     │                        │
│  │      irrigation: 'not_flowing',     │                        │
│  │      soil_moisture: 'dry'           │                        │
│  │    },                               │                        │
│  │    is_mock: false                   │                        │
│  │  }                                  │                        │
│  │                                     │                        │
│  └─────────────────────────────────────┘                        │
│                                                                   │
│  ┌─ SOURCE 3: CROP CONTEXT ────────────┐                       │
│  │                                     │                        │
│  │  Crop growth stage metadata:        │                        │
│  │  → decision_case_evidence (typed)   │                        │
│  │                                     │                        │
│  │  evidence = {                       │                        │
│  │    decision_case_id: ...,           │                        │
│  │    type: 'crop_context',            │                        │
│  │    source: 'System',                │                        │
│  │    payload: {                       │                        │
│  │      crop_name: 'Padi Inpari 32',   │                        │
│  │      growth_stage: 'vegetative',    │                        │
│  │      days_since_planting: 20        │                        │
│  │    },                               │                        │
│  │    is_mock: false                   │                        │
│  │  }                                  │                        │
│  │                                     │                        │
│  └─────────────────────────────────────┘                        │
│                                                                   │
│  Update decision_case status → 'collecting_evidence'            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
*/

/*
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4C: SEND TO REASONING SERVICE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Reasoning Service (HOL-87):                                    │
│  • Receives: Normalized evidence array                          │
│  • Processes: Reasoning rules (water decision logic)            │
│  • Returns: Assessment + action options                         │
│                                                                   │
│  assessment = {                                                  │
│    decision_case_id: ...,                                       │
│    version: 1,                                                  │
│    status: 'active',                                            │
│    summary: 'Kondisi air perlu ditinjau lebih lanjut',          │
│    basis_strength: 'medium',                                    │
│    factors: [                                                   │
│      'Air terbatas (field pulse)',                              │
│      'Curah hujan rendah (BMKG)',                               │
│      'Tanaman fase vegetatif (crop context)'                    │
│    ],                                                            │
│    missing_evidence: [                                          │
│      'Kondisi sumber air',                                      │
│      'Riwayat irigasi terakhir'                                 │
│    ],                                                            │
│    limitations: [                                               │
│      'Data BMKG +8 jam lalu',                                   │
│      'Field pulse hanya observasi spot'                         │
│    ],                                                            │
│    rule_version: 'water-decision-v1.0'                          │
│  }                                                               │
│                    ↓                                             │
│  action_options = [                                             │
│    {                                                             │
│      assessment_id: ...,                                        │
│      title: 'Verifikasi kondisi air',                           │
│      description: 'Periksa sumber air dan saluran irigasi',     │
│      rationale: 'Informasi lapangan lebih akurat',              │
│      display_order: 1                                           │
│    },                                                            │
│    {                                                             │
│      assessment_id: ...,                                        │
│      title: 'Tambah informasi dahulu',                          │
│      description: 'Tunggu update BMKG atau monitoring lebih',   │
│      rationale: 'Kurang evidence untuk keputusan akhir',        │
│      display_order: 2                                           │
│    },                                                            │
│    {                                                             │
│      assessment_id: ...,                                        │
│      title: 'Minta pertimbangan PPL',                           │
│      description: 'Hubungi Penyuluh Pertanian Lapangan',        │
│      rationale: 'Keputusan kompleks perlu ahli',               │
│      display_order: 3                                           │
│    }                                                             │
│  ]                                                               │
│                                                                   │
│  Update decision_case status → 'assessed'                       │
│                                                                   │
│  IMPORTANT: No ranking, no confidence score!                    │
│  All options are valid — human chooses.                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
*/

/*
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4D: OPTIONAL - TRUSTED REVIEW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  If user wants expert validation:                               │
│                                                                   │
│  trusted_review = {                                             │
│    decision_case_id: ...,                                       │
│    assessment_id: ...,                                          │
│    reviewer_id: trusted_reviewer.id,  ← PPL or expert           │
│    status: 'approve' | 'modify' | 'reject',                     │
│    comment: 'Setuju, tapi cek sumber air dulu',                 │
│    responded_at: '2026-09-04T14:00:00Z'                         │
│  }                                                               │
│                                                                   │
│  IMPORTANT: Reviewer ≠ Decision Maker                           │
│  Reviewer provides input, user makes final call.                │
│                                                                   │
│  Update decision_case status → 'review_pending' or              │
│                                 'ready_for_decision'            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
*/

// ===================================
// 5. HUMAN DECISION - AUTHORITY
// ===================================

/*
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: RECORD FINAL HUMAN DECISION (IMMUTABLE)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User makes final decision:                                     │
│                                                                   │
│  Option A: Select from system options                           │
│  ───────────────────────────────────                            │
│  User clicks: "Verifikasi kondisi air"                          │
│                                                                   │
│  decision_record = {                                            │
│    decision_case_id: ...,                                       │
│    decided_by: profile.id,                                      │
│    assessment_id: ...,                                          │
│    selected_action_option_id: action_option.id,                 │
│    decision_type: 'selected_option',  ← Chose from options      │
│    decision_text: 'Saya setuju verifikasi kondisi air',         │
│    reason: 'Field pulse menunjukkan kondisi kritis'             │
│  }                                                               │
│                                                                   │
│  Option B: Custom decision                                      │
│  ────────────────────────                                       │
│  User writes custom decision:                                   │
│                                                                   │
│  decision_record = {                                            │
│    decision_case_id: ...,                                       │
│    decided_by: profile.id,                                      │
│    assessment_id: ...,                                          │
│    selected_action_option_id: null,  ← No option selected       │
│    decision_type: 'custom',          ← User wrote it            │
│    decision_text: 'Saya akan mengecek sumber air besok pagi',   │
│    reason: 'Perlu koordinasi dengan pengguna lahan lain'        │
│  }                                                               │
│                                                                   │
│  Option C: Defer decision                                       │
│  ───────────────────────────                                    │
│  User postpones:                                                │
│                                                                   │
│  decision_record = {                                            │
│    decision_case_id: ...,                                       │
│    decided_by: profile.id,                                      │
│    assessment_id: ...,                                          │
│    selected_action_option_id: null,                             │
│    decision_type: 'deferred',        ← Postponed                │
│    decision_text: 'Tunda sampai info BMKG update',              │
│    reason: 'Menunggu prakiraan cuaca terbaru'                   │
│  }                                                               │
│                                                                   │
│  ⚠️ IMMUTABLE: Cannot be changed after creation                │
│  ⚠️ AUDIT TRAIL: All linked evidence recorded                  │
│                                                                   │
│  Update decision_case status → 'decided'                        │
│  Update decision_case closed_at → now()                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
*/

// ===================================
// 6. AUDIT TRAIL & SHAREABLE OUTPUT
// ===================================

/*
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6A: LINK EVIDENCE TO DECISION (AUDIT TRAIL)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  decision_record_evidence (junction table):                     │
│  ─────────────────────────────────────────                      │
│                                                                   │
│  Links which evidence was used in this decision:                │
│                                                                   │
│  Record 1: (decision_record.id → evidence.id)                   │
│  Record 2: (decision_record.id → evidence.id)                   │
│  Record 3: (decision_record.id → evidence.id)                   │
│                                                                   │
│  Allows future audit:                                           │
│  "Keputusan ini dibuat berdasarkan data apa?"                   │
│  → Trace back to exact evidence + timestamps                    │
│                                                                   │
│  Security: Immutable — cannot change which evidence was used    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
*/

/*
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6B: GENERATE SHAREABLE DECISION BRIEF                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  System generates human-readable summary:                       │
│                                                                   │
│  decision_brief = {                                             │
│    decision_record_id: ...,                                     │
│    template_version: '1.0',                                     │
│    content: """                                                  │
│      RembukTani                                                  │
│      ──────────────────────────────────                          │
│                                                                   │
│      Lahan: Blok Tirto A3                                        │
│      Tanaman: Padi Inpari 32 (Fase Vegetatif)                   │
│      Tanggal: 4 September 2026                                   │
│                                                                   │
│      KEPUTUSAN:                                                  │
│      Verifikasi kondisi sumber air                              │
│                                                                   │
│      DASAR KEPUTUSAN:                                            │
│      1. BMKG: Curah hujan rendah (2.5 mm)                        │
│      2. Lapangan: Air terbatas, irigasi tidak mengalir          │
│      3. Tanaman: Fase vegetatif butuh air teratur               │
│                                                                   │
│      ALASAN:                                                     │
│      Field pulse menunjukkan kondisi kritis                     │
│                                                                   │
│      PEMBUAT KEPUTUSAN:                                          │
│      Budi Farmer                                                 │
│                                                                   │
│      ──────────────────────────────────                          │
│      Powered by RembukTani                                       │
│    """                                                           │
│  }                                                               │
│                                                                   │
│  Use cases:                                                      │
│  • Print & share with neighbor                                  │
│  • Email to extension agent (PPL)                               │
│  • Archive for record-keeping                                   │
│  • Accountability & transparency                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
*/

// ===================================
// 7. COMPLETE FLOW SUMMARY
// ===================================

/*
USER EXPERIENCE:

1. Sign Up
   └─→ profile created

2. Add Land (one-time setup)
   └─→ land record + location resolution

3. Plant Crop (seasonal)
   └─→ crop_context created (only 1 active per land)

4. Start Decision
   └─→ decision_case created, status = 'draft'

5. Collect Evidence (automated + manual)
   ├─→ BMKG forecast (auto) → external_source_cache → evidence
   ├─→ Field pulse (user) → evidence
   ├─→ Crop context (system) → evidence
   └─→ status = 'collecting_evidence'

6. AI Assessment
   ├─→ Send evidence to reasoning service
   ├─→ Receive assessment + action options
   ├─→ Store in assessments + action_options
   └─→ status = 'assessed'

7. Optional Review
   ├─→ User sends to trusted reviewer (PPL)
   ├─→ Reviewer provides feedback
   └─→ status = 'review_pending' or 'ready_for_decision'

8. Make Decision (AUTHORITY HERE)
   ├─→ Option A: Select from options
   ├─→ Option B: Write custom decision
   ├─→ Option C: Defer decision
   ├─→ Create immutable decision_record
   ├─→ Link evidence for audit trail
   └─→ status = 'decided'

9. Generate Brief
   ├─→ Create shareable decision_brief
   └─→ Share/print/archive
*/

// ===================================
// 8. DEMO SCENARIO: WATER CONDITION
// ===================================

/*
SCENARIO: DEMO-WATER-01 (Happy Path)

Setup:
  Land: Blok Tirto A3 (Sleman, Kalasan)
  Crop: Padi Inpari 32 (Vegetative, 20 days)
  Decision: "Apakah perlu tindakan terkait kondisi air?"

Evidence Collected:
  1. BMKG: Temperature 24°C, Humidity 85%, Rainfall 2.5mm
  2. Field Pulse: Water limited, irrigation not flowing, soil dry
  3. Crop Context: Vegetative phase, needs regular irrigation

Reasoning Output:
  Summary: "Kondisi air perlu ditinjau lebih lanjut"
  Basis: Medium (consistent evidence, some gaps)
  Missing: Source water condition, irrigation history

Action Options:
  1. Verify water source condition
  2. Gather more information first
  3. Consult with extension agent

Human Decision:
  "I will check the water source tomorrow morning"
  Type: Custom (not from options)
  Reason: Need to coordinate with neighbor

Decision Brief:
  [Human-readable summary with basis]

Demo Markers:
  ✓ All evidence marked is_mock=true
  ✓ BMKG source marked as demo
  ✓ Field pulse marked as manual entry
  ✓ No live BMKG API calls
  ✓ Deterministic output (same every time)
*/

export {};
