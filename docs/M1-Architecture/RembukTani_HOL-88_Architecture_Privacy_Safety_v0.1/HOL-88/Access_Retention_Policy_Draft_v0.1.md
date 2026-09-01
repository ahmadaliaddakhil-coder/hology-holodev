# RembukTani — HOL-88 Access & Retention Policy Draft v0.1

**Status:** Engineering proposal M1 — not production/privacy compliance claim.

## 1. Logical access

### Decision Facilitator
- read scoped decision context/evidence;
- submit/update relevant local evidence;
- read assessment/options;
- request optional review;
- explicitly confirm final human decision;
- read/share Decision Record.

### Field Contributor
- submit scoped local observation;
- update evidence they are allowed to submit;
- no final decision authority by default.

### Trusted Reviewer
- read requested context/evidence/assessment;
- submit approve/modify/reject review;
- no final decision authority unless separately assigned another role.

### HOL-87 Engine
- read canonical evidence/context;
- write assessment/action options;
- cannot create Review;
- cannot create authoritative Decision Record.

## 2. Retention

### Demo fixtures
Retain/version for project lifetime; synthetic only.

### Real field evidence
Exact duration is not yet decided.

**Policy gate:**
> Do not begin persistent real-user/real-field pilot collection before retention/deletion/export rules are approved.

### Decision Records
For demo: retain with fixture artifact.
For real use: duration and deletion rules TBD; history must preserve revision semantics while retained.

### Personal identity
Role is preferred minimum.
Real display name/actor ID only when necessary and purposeful.

### Logs
Metadata-first; no secret/personal payload by default.
Exact duration TBD.

### Secrets
No retention in logs/domain DB/repo.
Use deployment-appropriate secret mechanism.

## 3. Before real pilot

Must decide:
- auth;
- authorization;
- privacy notice/consent basis if applicable;
- retention duration;
- deletion/export;
- logs;
- backups;
- external API/source terms;
- incident ownership.
