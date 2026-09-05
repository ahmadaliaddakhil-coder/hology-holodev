# AI/Data v0.2 — Completion and Traceability Matrix

**Role:** AI/Data Engineer  
**Scope:** additive verification for HOL-87 v0.2  
**Dependency:** contract proposal in PR #5  
**Rule:** this work does not change backend API, persistence, PM copy, or the
semantic contract under review.

## Requirement traceability

| Role requirement | Primary artifact | Executable evidence | AI/Data state | External gate |
|---|---|---|---|---|
| Audit actual BMKG payload | `BMKG_DATA_DICTIONARY.md` | canonical schema validation | Complete as proposal | Adapter sample review |
| Reconcile HOL-86 | `HOL86_RECONCILIATION_v0.2.md` | reference IDs in canonical example | Complete as proposal | Full-stack ERD review |
| Field Pulse contract | `FIELD_PULSE_CONTRACT_v0.2.md` | schema enum + negative N8 | Complete as proposal | PM label validation |
| HOL-87 reasoning v0.2 | `HOL87_REASONING_BASELINE_v0.2.md` | T1–T8 + N11–N12 | Complete as reference | Backend implementation |
| Rules + sources | `CURATED_SOURCE_PACK_v0.2.md` | ruleset safety invariants | Complete as proposal | PM/Tech Lead review |
| BMKG canonical mapping | `BMKG_TO_CANONICAL_MAPPING.md` | canonical example + N1–N7 | Complete as proposal | Adapter projection review |
| Freshness policy | `EVIDENCE_FRESHNESS_POLICY_v0.2.md` | T4, T7, T8 | Complete as proposal | Cache behavior review |
| Deterministic scenarios | fixtures + `expected_results.json` | T1–T8 | Complete | Backend test port |
| Action options | `ACTION_OPTIONS_v0.2.md` + JSON | unique IDs, null ranking | Complete as stable draft | PM copy review |
| Explanation contract | `EXPLANATION_CONTRACT_v0.2.md` | output schema assertions | Complete as proposal | UI template mapping |

## Quality gates

Run from repository root:

```text
python data/evidence/v0.2/validate_contract_pack_v0_2.py
python data/evidence/v0.2/test_reasoning_v0_2.py
python data/evidence/v0.2/test_contract_quality_gates_v0_2.py
```

The third command proves rejection or safe abstention for:

- non-BMKG source and missing attribution;
- invalid coordinates, timestamps, empty forecast slots, and undocumented
  forecast fields;
- missing raw-payload reference;
- risk labels incorrectly submitted as Field Pulse observations;
- incomplete available-BMKG projection;
- future analysis time and analysis time later than fetch time.

## Definition of done for the AI/Data role

AI/Data is complete for v0.2 when all three commands pass and review outcomes
are recorded. Items in the **External gate** column are not unfinished AI/Data
implementation: they are explicit joint-lock decisions owned with Full-stack or
PM/Tech Lead/UI-UX.

No result in this matrix claims agronomic accuracy, yield improvement, water
savings, or superiority over BMKG/PPL. Those claims require separate field
validation and are outside M2.
