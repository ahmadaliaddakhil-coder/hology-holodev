#!/usr/bin/env python3
from pathlib import Path
import json
from jsonschema import Draft202012Validator

BASE = Path(__file__).resolve().parent
schema = json.loads((BASE / "dependencies" / "hol86_canonical_contract_v0.1.schema.json").read_text(encoding="utf-8"))
validator = Draft202012Validator(schema)

names = [
    "DEMO-WATER-01.reasoned.json",
    "DEMO-WATER-FALLBACK-01.reasoned.json",
    "DEMO-WATER-CONFLICT-01.reasoned.json",
    "DEMO-WATER-STALE-01.reasoned.json",
]

failed = False
for name in names:
    obj = json.loads((BASE / name).read_text(encoding="utf-8"))
    errors = sorted(validator.iter_errors(obj), key=lambda e: list(e.path))
    print(f"{name}: schema_errors={len(errors)}")
    for e in errors[:10]:
        print("  ", list(e.path), e.message)
    failed = failed or bool(errors)

if failed:
    raise SystemExit(1)
print("HOL-86 schema compatibility: PASS")
