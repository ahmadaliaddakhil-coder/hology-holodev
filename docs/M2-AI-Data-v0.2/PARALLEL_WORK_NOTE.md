# Parallel Work Note — AI/Data Quality Gates

This change is intentionally stacked on top of the HOL-87 backend-handoff
hardening proposal (PR #5).

## Safe to do in parallel

- negative schema tests;
- safe-abstention tests;
- requirement-to-artifact traceability;
- explicit ownership and merge-gate documentation.

## Not changed

- BMKG canonical schema;
- reasoning I/O schema;
- reasoning rules or action options;
- backend runtime/API/persistence;
- PM/UI copy or Decision Brief template;
- product scope and final human-decision boundary.

## Integration order

1. Review and merge PR #5, including joint contract decisions.
2. Rebase this quality-gate branch if PR #5 changes.
3. Run all three AI/Data checks.
4. Merge this additive test/documentation change.

If PR #5 changes enums, timestamps, or canonical fields, update negative tests
to verify the reviewed contract; do not use these tests to force an unreviewed
semantic decision.
