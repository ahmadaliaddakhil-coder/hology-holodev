# HOL-87 Test Report v0.1

## Semantic tests

```text
HOL-87 semantic tests: PASS (4 scenarios)
```

## HOL-86 schema compatibility

```text
DEMO-WATER-01.reasoned.json: schema_errors=0
DEMO-WATER-FALLBACK-01.reasoned.json: schema_errors=0
DEMO-WATER-CONFLICT-01.reasoned.json: schema_errors=0
DEMO-WATER-STALE-01.reasoned.json: schema_errors=0
HOL-86 schema compatibility: PASS
```

## Scenarios

- DEMO-WATER-01 — complete / elevated_attention / medium / alternatives_only
- DEMO-WATER-FALLBACK-01 — insufficient_evidence / low / abstained
- DEMO-WATER-CONFLICT-01 — conflicting_evidence / low / alternatives_only
- DEMO-WATER-STALE-01 — stale local evidence → insufficient_evidence / low / abstained

## Safety assertions

All four scenarios:
- do not emit `high` confidence;
- do not populate `recommended_option_id`;
- reasoning engine does not create `DecisionRecord`.
