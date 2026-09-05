"""Negative and safety tests for the RembukTani AI/Data contract pack v0.2.

These tests are intentionally additive: they verify the published proposal without
changing its schemas, rules, or runtime behavior.
"""

import copy
import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

from reasoning_engine_v0_2 import assess


ROOT = Path(__file__).parent


def load(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def assert_schema_rejects(validator, document, label):
    errors = list(validator.iter_errors(document))
    assert errors, f"{label}: schema unexpectedly accepted invalid document"
    print(f"{label}: REJECTED as expected")


def canonical_negative_cases(example):
    cases = []

    def changed(label, mutate):
        candidate = copy.deepcopy(example)
        mutate(candidate)
        cases.append((label, candidate))

    changed("N1_NON_BMKG_SOURCE", lambda value: value["source"].update(name="OTHER"))
    changed("N2_ATTRIBUTION_DISABLED", lambda value: value["source"].update(attribution_required=False))
    changed("N3_LATITUDE_OUT_OF_RANGE", lambda value: value["location"]["source_point"].update(lat=91))
    changed("N4_EMPTY_FORECAST_SLOTS", lambda value: value["payload"].update(forecast_slots=[]))
    changed("N5_UNDOCUMENTED_SLOT_FIELD", lambda value: value["payload"]["forecast_slots"][0].update(rainfall_mm=12.5))
    changed("N6_EMPTY_RAW_PAYLOAD_REF", lambda value: value["provenance"].update(raw_payload_ref=""))
    changed("N7_INVALID_FETCH_TIMESTAMP", lambda value: value["provenance"].update(fetched_at="not-a-time"))
    return cases


def reasoning_negative_cases(valid_input):
    cases = []

    def changed(label, mutate):
        candidate = copy.deepcopy(valid_input)
        mutate(candidate)
        cases.append((label, candidate))

    changed("N8_RISK_LABEL_AS_FIELD_INPUT", lambda value: value["field_pulse"].update(water_presence="critical_low"))
    changed("N9_AVAILABLE_BMKG_WITHOUT_ANALYSIS_TIME", lambda value: value["bmkg"].pop("analysis_time"))
    changed("N10_MALFORMED_EVALUATION_TIME", lambda value: value.update(evaluation_time="today"))
    return cases


def main():
    format_checker = FormatChecker()
    canonical = load("bmkg_canonical_example.json")
    canonical_validator = Draft202012Validator(
        load("bmkg_canonical_evidence.schema.json"), format_checker=format_checker
    )
    canonical_validator.validate(canonical)

    for label, candidate in canonical_negative_cases(canonical):
        assert_schema_rejects(canonical_validator, candidate, label)

    scenarios = load("fixtures/deterministic_scenarios.json")
    valid_input = copy.deepcopy(scenarios[0]["input"])
    reasoning_validator = Draft202012Validator(
        load("reasoning_io.schema.json"), format_checker=format_checker
    )
    reasoning_validator.validate(valid_input)

    for label, candidate in reasoning_negative_cases(valid_input):
        assert_schema_rejects(reasoning_validator, candidate, label)

    future_analysis = copy.deepcopy(valid_input)
    future_analysis["bmkg"]["analysis_time"] = "2026-09-04T00:00:00Z"
    result = assess(future_analysis)["assessment"]
    assert result["status"] == "assessment_unavailable"
    assert result["recommendation"] == {"mode": "abstained", "recommended_option_id": None}
    assert "reasoning_execution_failed" in result["limitations"]
    print("N11_FUTURE_BMKG_ANALYSIS: SAFE ABSTENTION")

    analysis_after_fetch = copy.deepcopy(valid_input)
    analysis_after_fetch["bmkg"]["analysis_time"] = "2026-09-03T08:10:00Z"
    analysis_after_fetch["bmkg"]["fetched_at"] = "2026-09-03T08:05:00Z"
    result = assess(analysis_after_fetch)["assessment"]
    assert result["status"] == "assessment_unavailable"
    assert result["action_options"] == []
    print("N12_ANALYSIS_AFTER_FETCH: SAFE ABSTENTION")

    print("12 negative/safety quality gates passed")


if __name__ == "__main__":
    main()
