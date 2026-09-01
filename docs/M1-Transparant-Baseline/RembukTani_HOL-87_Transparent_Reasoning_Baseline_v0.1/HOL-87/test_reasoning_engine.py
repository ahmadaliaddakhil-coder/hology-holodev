#!/usr/bin/env python3
from pathlib import Path
import json
import importlib.util

BASE = Path(__file__).resolve().parent

spec = importlib.util.spec_from_file_location("engine", BASE / "reasoning_engine.py")
engine = importlib.util.module_from_spec(spec)
spec.loader.exec_module(engine)

def load(name):
    return json.loads((BASE / name).read_text(encoding="utf-8"))

def assert_eq(actual, expected, msg):
    if actual != expected:
        raise AssertionError(f"{msg}: expected={expected!r}, actual={actual!r}")

def main():
    # Validate saved expected semantics.
    happy = load("DEMO-WATER-01.reasoned.json")
    fb = load("DEMO-WATER-FALLBACK-01.reasoned.json")
    conflict = load("DEMO-WATER-CONFLICT-01.reasoned.json")
    stale = load("DEMO-WATER-STALE-01.reasoned.json")

    assert_eq(happy["assessment"]["status"], "complete", "happy status")
    assert_eq(happy["assessment"]["context_state"], "elevated_attention", "happy context")
    assert_eq(happy["assessment"]["confidence"], "medium", "happy confidence")
    assert_eq(happy["assessment"]["recommendation"]["mode"], "alternatives_only", "happy recommendation")
    assert_eq(happy["assessment"]["reasoning"]["baseline_status"], "mixed", "happy baseline")
    assert len(happy["action_options"]) == 3

    assert_eq(fb["assessment"]["status"], "insufficient_evidence", "fallback status")
    assert_eq(fb["assessment"]["confidence"], "low", "fallback confidence")
    assert_eq(fb["assessment"]["recommendation"]["mode"], "abstained", "fallback recommendation")
    assert fb["decision_record"] is None

    assert_eq(conflict["assessment"]["context_state"], "conflicting_evidence", "conflict state")
    assert_eq(conflict["assessment"]["confidence"], "low", "conflict confidence")
    assert_eq(conflict["assessment"]["recommendation"]["mode"], "alternatives_only", "conflict mode")

    assert_eq(stale["assessment"]["status"], "insufficient_evidence", "stale status")
    assert_eq(stale["assessment"]["confidence"], "low", "stale confidence")
    field_eval = [
        x for x in stale["assessment"]["evidence_evaluations"]
        if x["evidence_id"] == "EVD-FLD-STALE-001"
    ][0]
    assert_eq(field_eval["freshness_status"], "stale", "stale freshness")

    # Safety invariants.
    for bundle in [happy, fb, conflict, stale]:
        assert bundle["assessment"]["confidence"] != "high", "M1 v0.1 must not emit high confidence"
        assert bundle["assessment"]["recommendation"]["recommended_option_id"] is None
        assert bundle["decision_record"] is None, "Reasoning engine must not create final human decision"

    print("HOL-87 semantic tests: PASS (4 scenarios)")

if __name__ == "__main__":
    main()
