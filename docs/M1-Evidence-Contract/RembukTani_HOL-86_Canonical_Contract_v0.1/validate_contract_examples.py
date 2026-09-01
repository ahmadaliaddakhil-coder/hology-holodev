#!/usr/bin/env python3
"""Validate RembukTani HOL-86 example bundles against JSON Schema + cross-object invariants."""

from pathlib import Path
import json
import sys
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parent
SCHEMA = json.loads((ROOT / "rembuktani_canonical_contract_v0.1.schema.json").read_text(encoding="utf-8"))

def refs_to_tuples(refs):
    return {(r["id"], r["version"]) for r in refs}

def validate_invariants(bundle):
    errors = []

    evidence_refs = {
        (e["evidence_id"], e.get("evidence_version", 1))
        for e in bundle["evidence"]
    }
    option_ids = {o["option_id"] for o in bundle["action_options"]}
    review_ids = {r["review_id"] for r in bundle["trusted_reviews"]}

    assessment = bundle.get("assessment")
    if assessment:
        input_refs = refs_to_tuples(assessment.get("input_evidence_refs", []))
        if not input_refs.issubset(evidence_refs):
            errors.append("assessment.input_evidence_refs contains unknown evidence refs")

        eval_refs = {
            (e["evidence_id"], e["evidence_version"])
            for e in assessment.get("evidence_evaluations", [])
        }
        if not eval_refs.issubset(evidence_refs):
            errors.append("assessment.evidence_evaluations contains unknown evidence refs")

        listed_options = set(assessment.get("action_option_ids", []))
        if listed_options != option_ids:
            errors.append("assessment.action_option_ids must match bundle action_options exactly")

        rec = assessment["recommendation"]
        rec_id = rec["recommended_option_id"]
        if rec["mode"] == "ranked":
            if rec_id is None:
                errors.append("ranked recommendation requires recommended_option_id")
            elif rec_id not in option_ids:
                errors.append("recommended_option_id does not exist")
        elif rec_id is not None:
            errors.append("recommended_option_id must be null unless recommendation.mode == ranked")

    for option in bundle["action_options"]:
        refs = refs_to_tuples(option["supporting_evidence_refs"])
        if not refs.issubset(evidence_refs):
            errors.append(f'{option["option_id"]}: unknown supporting evidence ref')

    record = bundle.get("decision_record")
    if record:
        if record["authority"] != "human":
            errors.append("Decision Record authority must be human")
        snapshot_refs = refs_to_tuples(record["evidence_snapshot_refs"])
        if not snapshot_refs.issubset(evidence_refs):
            errors.append("Decision Record contains unknown evidence snapshot ref")
        if record.get("selected_option_id") and record["selected_option_id"] not in option_ids:
            errors.append("Decision Record selected_option_id does not exist")
        if record.get("system_recommended_option_id") and record["system_recommended_option_id"] not in option_ids:
            errors.append("Decision Record system_recommended_option_id does not exist")
        review_ref = record.get("review_snapshot_ref")
        if review_ref and review_ref["review_id"] not in review_ids:
            errors.append("Decision Record review_snapshot_ref does not exist")
        if bundle["workflow_state"] not in {"decision_confirmed", "decision_recorded", "shared_optional"}:
            errors.append("Bundle with Decision Record must be at/after decision_confirmed")

        if record["is_mock"]:
            if not all(e["provenance"]["is_mock"] for e in bundle["evidence"]):
                errors.append("Mock Decision Record contains non-mock evidence without explicit mixed-mode policy")

    return errors

def validate_file(path):
    obj = json.loads(path.read_text(encoding="utf-8"))
    schema_errors = sorted(
        Draft202012Validator(SCHEMA, format_checker=FormatChecker()).iter_errors(obj),
        key=lambda e: list(e.absolute_path),
    )
    invariant_errors = validate_invariants(obj)
    return schema_errors, invariant_errors

if __name__ == "__main__":
    files = [ROOT / "DEMO-WATER-01.canonical.json", ROOT / "DEMO-WATER-FALLBACK-01.canonical.json"]
    failed = False
    for path in files:
        schema_errors, invariant_errors = validate_file(path)
        print(f"{path.name}: schema={len(schema_errors)} invariant={len(invariant_errors)}")
        for err in schema_errors:
            print("  SCHEMA:", err.message)
        for err in invariant_errors:
            print("  INVARIANT:", err)
        failed |= bool(schema_errors or invariant_errors)
    sys.exit(1 if failed else 0)
