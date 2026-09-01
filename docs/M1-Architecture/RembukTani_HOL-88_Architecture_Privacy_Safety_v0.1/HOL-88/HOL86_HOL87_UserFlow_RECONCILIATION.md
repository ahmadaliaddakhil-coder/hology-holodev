# HOL-88 Reconciliation with HOL-86 / HOL-87 / User Flow

## HOL-86
No schema change required by HOL-88 v0.1.

Architecture consumes:
- DecisionContext
- Evidence
- Assessment
- ActionOption
- TrustedReview
- DecisionRecord
- optional Handoff

HOL-88 adds infrastructure/security semantics only.

## HOL-87
No reasoning change required.

Architecture enforces:
- HOL-87 has no direct DecisionRecord write authority;
- confidence/abstention stays visible;
- reasoning version is persisted with assessment;
- ranked recommendation remains disabled;
- no autonomous execution path.

## User Flow
HOL-88 explicitly supports:
- FE-04 insufficient evidence;
- FE-06 reasoning unavailable;
- FE-08 reviewer unavailable;
- FE-09 human disagreement;
- FE-10 outdated assessment;
- FE-11 save failure;
- FE-12 share failure;
- FE-13 external API unavailable;
- FE-14 MOCK/LIVE ambiguity.

## Important environment refinement

Demo fixture fallback is allowed only in demo/staging.

For real-pilot/production-like use:
- never silently replace missing live evidence with MOCK fixture;
- cached real evidence may be used only with freshness/provenance;
- otherwise use missing/abstain path.
