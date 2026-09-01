# RembukTani — HOL-88 Architecture, Privacy & Safety Boundary v0.1

**Linear Issue:** HOL-88 — `[M1] Create architecture, privacy, and safety boundary diagram`  
**Milestone:** M1 — Scope & UX Freeze  
**Owner:** AI/Data + Full-stack review  
**Version:** 0.1.0  
**Tanggal:** 2 September 2026  
**Status:** **DRAFT — IMPLEMENTABLE / CROSS-TEAM REVIEW REQUIRED**

> HOL-88 adalah **logical architecture M1**, bukan klaim production-readiness dan bukan long-term platform architecture.

---

# 1. Tujuan

HOL-88 membuat batas teknis RembukTani dapat dilihat bersama oleh PM/UX, AI/Data, Full-stack, dan juri:

- dari mana evidence masuk;
- mana external/live, local/manual, dan MOCK/DEMO;
- di mana HOL-86 contract validation terjadi;
- di mana HOL-87 reasoning terjadi;
- mana system inference dan mana keputusan manusia;
- apa yang disimpan;
- di mana trust boundary berada;
- bagaimana failure/fallback bekerja;
- data apa yang boleh dan tidak perlu dikumpulkan;
- bagian mana yang optional/reversible.

---

# 2. Source-Derived Constraints

Bagian ini langsung mengikuti artefak proyek yang sudah ada.

## Dari HOL-86

Canonical flow:

```text
Decision Context
↓
Evidence
↓
Assessment / System Inference
↓
Action Options
↓
Optional Trusted Review
↓
Final Human Decision
↓
Decision Record
```

Invariant:

> `Evidence ≠ System Inference ≠ Human Review ≠ Final Decision`

`Decision Record` adalah core endpoint. `handoff/task/outcome` optional.

HOL-86 tidak membutuhkan:
- NIK;
- OTP;
- password;
- rekening;
- data finansial;
- precise personal identity anggota.

## Dari HOL-87

Reasoning engine:

- deterministic;
- membaca canonical evidence;
- menghasilkan assessment + confidence + factors + missing evidence + bounded options;
- tidak membuat TrustedReview;
- tidak membuat DecisionRecord;
- tidak menjalankan action;
- tidak menghasilkan `high` confidence pada v0.1;
- ranked recommendation disabled.

## Dari User Flow

Wajib ada path untuk:
- missing/stale evidence;
- insufficient evidence / abstain;
- reasoning unavailable;
- trusted reviewer unavailable;
- human disagreement;
- outdated assessment before decision;
- save failure;
- external API unavailable;
- MOCK/LIVE ambiguity.

---

# 3. Architecture Decision v0.1

## 3.1 Logical architecture

Untuk M1, architecture dibagi menjadi:

1. **User/Client Layer**
2. **Identity / Role Boundary — TBD**
3. **Application/API Orchestrator**
4. **Evidence Ingestion & Normalization**
5. **HOL-86 Contract Validation**
6. **HOL-87 Deterministic Reasoning**
7. **Optional Trusted Review**
8. **Human Decision / Decision Record**
9. **Persistence**
10. **Optional Share/Handoff**
11. **Redacted Observability**
12. **Secrets Boundary**

Tidak ada direct path:

```text
Reasoning Engine → Final Decision
```

atau:

```text
Reasoning Engine → Irrigation Control
```

---

# 4. Architecture Diagram

File reusable:

- `architecture_boundary.dot`
- `architecture_boundary.svg`

Logical flow:

```text
EXTERNAL/LIVE SOURCES ──┐
                        ├─→ Evidence Adapter ─┐
DEMO FIXTURES ──────────┘                     │
                                              ↓
FIELD/USER OBSERVATION → Client → API → HOL-86 Validator/Normalizer
                                              ↓
                                      Canonical Evidence
                                      ↙              ↘
                               Persistence       HOL-87 Reasoner
                                                     ↓
                                        Assessment + Action Options
                                                     ↓
                                                  Client
                                                     ↓
                                         Optional Trusted Review
                                                     ↓
                                            HUMAN DECISION
                                                     ↓
                                             Decision Record
                                                     ↓
                                      Optional Share / Handoff
```

### Critical boundary

> HOL-87 output **must return to the human-facing/application flow**. It cannot directly create the authoritative Decision Record.

---

# 5. Trust Boundaries

## TB-0 — External Evidence Boundary

Between:
- BMKG / agricultural information systems / external APIs
- RembukTani ingestion

Risks:
- source unavailable;
- stale data;
- wrong mapping;
- provenance lost.

Guardrails:
- source + provenance preserved;
- observed/valid time preserved;
- schema validation;
- external failure does not become fabricated evidence.

---

## TB-1 — User Device Boundary

Between:
- decision facilitator;
- field contributor;
- trusted reviewer;
- RembukTani backend.

Risks:
- invalid input;
- wrong role/action;
- sensitive data entered unnecessarily;
- lost connectivity.

Guardrails:
- input validation;
- data minimization;
- role-based logical permissions;
- explicit save/error state;
- no secrets in domain payload.

---

## TB-2 — Application / Reasoning Boundary

Between:
- application orchestration;
- HOL-87 engine.

Risks:
- stale assessment;
- wrong rule version;
- fabricated output;
- reasoning unavailable.

Guardrails:
- assessment version;
- rule/reasoning version;
- evidence snapshot refs;
- abstain path;
- no silent fallback to fake assessment.

---

## TB-3 — Human Authority Boundary

Between:
- system assessment/options;
- final human decision.

This is the most important safety boundary.

System:
- informs;
- explains;
- surfaces options;
- may abstain.

Human:
- accepts;
- modifies;
- rejects;
- chooses another option;
- records final decision.

System disagreement with human is **not an error**.

---

## TB-4 — Persistence Boundary

Between:
- backend services;
- operational datastore.

Risks:
- unauthorized update;
- silent overwrite;
- duplicate record;
- sensitive data leakage.

Guardrails:
- semantic version/revision;
- DecisionRecord no silent overwrite;
- authorization checks;
- idempotent save recommended;
- backups/retention policy still TBD for real deployment.

---

## TB-5 — MOCK/LIVE Environment Boundary

Demo fixture must never be confused with live evidence.

### Demo/staging

Allowed:
- deterministic fixtures;
- fixture fallback;
- persistent `MOCK/DEMO` marker.

### Real pilot / production-like use

Not allowed:
- replacing unavailable live evidence with MOCK data silently.

If real evidence unavailable:
- use valid cached real evidence if policy allows;
- otherwise mark missing/stale;
- abstain if minimum evidence fails.

---

# 6. Logical Components

## 6.1 Client / UI

Surfaces:
- Decision Moment
- Field Pulse
- Evidence & Assessment
- Alternatives
- Optional Trusted Review
- Decision Confirmation / Decision Record
- Share / optional handoff

Must display:
- provenance;
- freshness;
- confidence;
- missing evidence;
- limitations;
- Human Decision boundary;
- MOCK marker when applicable.

---

## 6.2 Authentication / Role Gate — TBD

**Status:** engineering proposal / unresolved implementation.

Logical roles:
- `decision_facilitator`
- `field_contributor`
- `trusted_reviewer`

M1 does **not** lock:
- auth provider;
- OAuth/passwordless/etc.;
- production identity verification.

For deterministic demo, fixture roles may be used.

If multi-user real data is introduced, backend authorization must be resolved before pilot.

---

## 6.3 Application / API Orchestrator

Responsibilities:
- state transition;
- canonical payload orchestration;
- invoke validation/reasoning;
- route optional review;
- enforce human decision boundary;
- create DecisionRecord only after explicit human confirmation.

Non-responsibility:
- hidden agronomic recommendation outside HOL-87.

---

## 6.4 Evidence Ingestion Adapters

### External/live adapter

Consumes:
- external agricultural/climate evidence.

Must preserve:
- source;
- provenance;
- timestamps;
- original semantics.

### Local/manual adapter

Consumes:
- Field Pulse;
- human observation.

### Fixture adapter

For:
- demo;
- deterministic test;
- staging fallback.

Must set:
- `provenance.is_mock = true`
- environment marker.

---

## 6.5 HOL-86 Contract Validator / Normalizer

Responsibilities:
- schema validation;
- canonical evidence normalization;
- preserve evidence identity/version;
- reject invalid canonical payload;
- never add agronomic inference to raw evidence.

---

## 6.6 HOL-87 Deterministic Reasoning Engine

Input:
- canonical DecisionContext + Evidence.

Output:
- EvidenceEvaluation;
- Assessment;
- Confidence;
- Factors;
- Missing Evidence;
- Limitations;
- Action Options.

HOL-87 does not:
- authenticate users;
- persist final decision;
- contact reviewer itself;
- control irrigation;
- create human decision.

---

## 6.7 Optional Trusted Review

Reviewer:
- PPL;
- experienced farmer;
- relevant stakeholder;
- configurable role.

Optional branch:
- approve;
- modify;
- reject;
- unavailable;
- skip.

PPL is not hard-coded mandatory.

---

## 6.8 Decision Record Service

Only created after explicit human confirmation.

Must persist:
- final human decision;
- rationale;
- assessment snapshot/version;
- evidence snapshot refs;
- review status if any;
- limitations;
- MOCK marker;
- authority = `human`.

Material change:
- new revision/new record;
- no silent overwrite.

---

## 6.9 Optional Share / Handoff

Share/export:
- copy summary;
- WhatsApp/system share intent if feasible.

Action handoff:
- optional.

Failure:
- must not roll back Decision Record.

---

## 6.10 Observability

**Engineering proposal M1.**

Log:
- request/operation ID;
- scenario/context ID;
- service/error code;
- rule/engine version;
- state transition;
- latency if useful.

Do not log by default:
- secrets;
- tokens;
- OTP;
- password;
- unnecessary personal fields;
- full sensitive payload.

---

# 7. Data Classification Matrix

A machine-readable copy exists as:

> `data_classification.csv`

| Class | Data | M1 Handling |
|---|---|---|
| D0 Public | External public agricultural/climate evidence | Preserve provenance; cache only as needed |
| D1 Synthetic | MOCK/DEMO fixtures | Versioned; persistent MOCK marker |
| D2 Operational | Field observations, hamparan/crop context | Restricted to relevant project/user scope |
| D3 Decision | Assessments, reviews, Decision Records | Restricted; auditable/versioned |
| D4 Personal-minimal | Role, optional display name/actor ID | Minimize; role is sufficient where possible |
| D5 Secret | API keys, auth tokens, DB secrets | Secret store/env only; never domain DB/log |
| D6 Not-needed / prohibited-for-M1 | NIK, OTP, password, bank/account data, irrelevant financial data | Do not collect |

---

# 8. Logical Access Matrix — Engineering Proposal

Exact auth implementation is unresolved, but logical authority should be:

| Actor | Evidence | Assessment | Review | Final Decision | Decision Record |
|---|---|---|---|---|---|
| Decision Facilitator | Read + scoped submit/update | Read | Request/read | **Confirm** | Read |
| Field Contributor | Scoped submit local evidence | Limited/read if needed | No | No | No by default |
| Trusted Reviewer | Read requested context | Read requested assessment | **Submit review** | No unless separately assigned facilitator role | Read requested record if needed |
| HOL-87 Engine | Read canonical evidence | **Write system inference** | No | **Never** | Never |
| Full-stack service | Orchestrate | Orchestrate | Orchestrate | Persist explicit human command | Persist |

Important:

> Role permissions are logical design. They are **not a claim that production RBAC has already been implemented**.

---

# 9. Retention & Access Policy v0.1

## 9.1 Demo / synthetic data

- deterministic fixtures may be retained/versioned for project lifetime;
- no real personal identity should be inserted;
- Decision Records generated from fixture remain `is_mock=true`.

## 9.2 External public evidence

- retain provenance and the evidence/version used for a decision trace;
- caching/retention must respect source/API terms;
- exact production cache TTL is **not yet defined**.

## 9.3 Operational field evidence

For M1 synthetic prototype:
- version and retain with fixture/test artifacts.

For real pilot:
> **do not begin persistent real field-data collection until exact retention/deletion policy is approved.**

Still unresolved:
- retention duration;
- deletion workflow;
- export/user access;
- backup deletion.

## 9.4 Personal/role data

- role is the minimum;
- `display_name`/actor ID optional;
- avoid real names in demo if not necessary;
- no precise identity of every group member is required by HOL-86.

Before real pilot:
- define purpose;
- access;
- retention;
- deletion.

## 9.5 Logs

Proposal:
- log metadata, not unnecessary payload;
- redact secrets and personal fields;
- exact log retention is TBD.

## 9.6 Secrets

- never in canonical evidence;
- never committed into fixture/repository;
- never logged;
- use environment/secret-management mechanism suitable to deployment.

---

# 10. Lightweight Privacy Threat Model

## Assets

A1. Evidence provenance and integrity  
A2. Assessment/rule-version integrity  
A3. Decision Record integrity/history  
A4. Minimal user/role identity  
A5. Secrets/API credentials  
A6. Logs/diagnostic data  
A7. MOCK/LIVE environment identity

## Threats & required guardrails

| Threat | Risk | Guardrail |
|---|---|---|
| Source/provenance spoofing | Wrong evidence appears trusted | canonical provenance + validation |
| MOCK data mistaken as live | Unsafe/demo misrepresentation | persistent MOCK marker + environment separation |
| Stale evidence silently used | Outdated assessment | freshness evaluation + assessment invalidation |
| Evidence tampering | Wrong assessment | version refs + scoped write + audit trail |
| Reasoning output treated as final command | Automation bias / safety | human authority boundary + limitations |
| Reviewer becomes mandatory accidentally | Workflow dead-end | optional branch + skip/unavailable state |
| Decision Record silent overwrite | Audit/history lost | new revision/supersedes semantics |
| Sensitive data in logs | Privacy leak | redaction + metadata-first logging |
| API key/token leak | System compromise | secrets boundary |
| External API outage | Demo/core flow failure | fixture only in demo; cached-real/abstain in real environment |
| Duplicate decision save | Duplicate authoritative records | idempotent-save recommendation |
| Real personal data collected without policy | Privacy/governance gap | block persistent real-data pilot until policy approved |

Full risk register:

> `privacy_safety_risk_register.csv`

---

# 11. Safety Boundaries

## SB-01 — Human authority

```text
Reasoning → Options → Human Decision
```

Never:

```text
Reasoning → Autonomous Action
```

---

## SB-02 — Abstention

HOL-87 may output:

```text
insufficient_evidence
confidence = low
recommendation = abstained
```

No recommendation is a valid outcome.

---

## SB-03 — Confidence is not probability

M1 confidence:
- categorical;
- conservative;
- `high` disabled.

UI must not represent it as calibrated probability.

---

## SB-04 — No validated prescription

HOL-87 v0.1 does not output:
- irrigation duration;
- irrigation volume;
- pump/gate control;
- yield optimization prescription.

---

## SB-05 — MOCK propagation

MOCK status must propagate:

```text
Evidence → Assessment → Decision Record
```

If marker is lost:
> demo acceptance fails.

---

## SB-06 — Assessment invalidation

If evidence changes/stales after assessment:

- assessment must be marked outdated/recalculated;
- do not create a Decision Record using an invisible stale assessment.

---

## SB-07 — System failure

If reasoner fails:

```text
assessment_unavailable
```

Do not synthesize a plausible-looking result.

---

# 12. Demo vs Real-Pilot Fallback

## Demo

Permitted:
- deterministic fixture if external API unavailable.

Required:
- `MOCK/DEMO` marker.

## Real pilot / production-like use

Mock fixture fallback:

> **NOT PERMITTED as hidden substitute.**

Allowed:
1. cached real evidence if still valid and provenance visible;
2. manual real observation;
3. missing evidence state;
4. abstain.

This distinction is a key safety rule.

---

# 13. Deployment Topology — Not Locked

HOL-88 defines logical components, not infrastructure brand.

The project does **not** require:
- microservices;
- Kafka;
- vector DB;
- dedicated ML platform;
- Kubernetes;
- event sourcing.

**Engineering recommendation, not product requirement:**

> For M1/M2, a modular-monolith backend with a deterministic reasoning module is likely simpler if compatible with the team stack.

Full-stack may choose another topology if:
- semantics remain the same;
- failure boundaries remain visible;
- demo remains reliable.

---

# 14. Environment Separation

Minimum logical environments:

## Demo/Staging

- synthetic fixtures allowed;
- debug visibility higher;
- no real secrets embedded in client;
- no real personal data required.

## Real-pilot/Production-like — FUTURE

Before enabling:
- auth/authorization locked;
- retention/access policy locked;
- real-data privacy notice/consent basis decided if applicable;
- source/API terms reviewed;
- secret management implemented;
- backup/delete behavior decided;
- no MOCK fallback.

---

# 15. Blocking Decisions Before Real User Data

These are **not blocking for deterministic M1 demo**, but are blocking before a real-data pilot:

1. authentication provider/mechanism;
2. authorization enforcement;
3. exact personal data purpose;
4. real field data retention duration;
5. deletion/export procedure;
6. log retention/redaction implementation;
7. backup/deletion behavior;
8. external source/API terms and credential handling;
9. incident/error response ownership;
10. whether trusted reviewer sees personal identity or only context.

---

# 16. Assumptions

A-01. M1 demo uses deterministic synthetic data.  
A-02. Decision facilitator is working primary role, not locally validated final persona.  
A-03. Trusted Review remains optional.  
A-04. HOL-86 contract remains canonical v0.1 for architecture draft.  
A-05. HOL-87 reasoning remains deterministic and non-prescriptive.  
A-06. Ranked recommendation remains disabled.  
A-07. No automatic irrigation/control action exists.  
A-08. Live external API is not required for the demo.  
A-09. Real personal data is not required to prove the M1 flow.  
A-10. Exact deployment stack is a Full-stack decision.

---

# 17. Unresolved Decisions

U-01. Auth provider / login mechanism.  
U-02. Production role/permission enforcement implementation.  
U-03. Real-data retention/deletion period.  
U-04. Log retention duration.  
U-05. External API/cache policy.  
U-06. Backup and recovery policy.  
U-07. Real-pilot consent/privacy notice.  
U-08. Whether offline-first persistence is required.  
U-09. Exact idempotency mechanism for Decision Record save.  
U-10. Whether reviewer assignment is manual or directory-based.  
U-11. Whether evidence-ranked suggestion will be enabled after validation.  
U-12. Production-grade source reliability/freshness semantics.

---

# 18. Cross-Team Contract

## AI/Data owns

- HOL-86 semantic compatibility;
- HOL-87 reasoning boundary;
- factor/rule provenance;
- abstention;
- confidence semantics;
- reasoning failure behavior.

## Full-stack owns

- API/persistence implementation;
- auth implementation;
- permission enforcement;
- idempotency;
- secret management;
- logging implementation;
- deployment/recovery.

## PM/UX owns

- whether information is understandable;
- whether human authority is visible;
- whether MOCK/uncertainty/limitations are communicated;
- review path UX;
- decision confirmation UX.

## Shared

- final architecture freeze;
- real-data privacy policy;
- M1 Gate.

---

# 19. Definition of Done HOL-88 v0.1

| Criterion | Status |
|---|---|
| Architecture consistent with HOL-86 | ✅ |
| Architecture consistent with HOL-87 | ✅ |
| Optional reviewer branch | ✅ |
| Decision Record core endpoint | ✅ |
| Task/outcome removable | ✅ |
| Trust boundaries explicit | ✅ |
| Data classification matrix | ✅ |
| Lightweight privacy threat model | ✅ |
| Retention/access policy draft | ✅ |
| MOCK/LIVE separation | ✅ |
| Reasoning failure/fallback | ✅ |
| Human-in-the-loop boundary | ✅ |
| No AI → autonomous action path | ✅ |
| Architecture diagram reusable | ✅ |
| Auth implementation final | ⏳ Full-stack / before real pilot |
| Real-data retention policy final | ⏳ before real pilot |
| Cross-team review | ⏳ |

---

# 20. Freeze Gate

HOL-88 dapat menjadi **v1.0 — FROZEN** ketika:

1. Full-stack menyetujui logical components feasible.
2. AI/Data menyetujui HOL-86/HOL-87 boundaries tidak berubah.
3. UI/UX mengonfirmasi low-fi states sesuai architecture.
4. Demo path dapat berjalan tanpa live API.
5. PPL/reviewer tetap optional.
6. No direct reasoning → final action path.
7. MOCK/LIVE boundary tidak ambigu.
8. Tidak ada unresolved issue yang mengubah:
   - core data flow;
   - human authority;
   - canonical contract;
   - reasoning invocation;
   - Decision Record semantics.

Real-pilot privacy details boleh tetap menjadi future gate selama M1 menggunakan synthetic/mock data dan tidak mengklaim production readiness.
