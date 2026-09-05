import json
from datetime import datetime
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker


ROOT = Path(__file__).parent


def load(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def utc(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def main():
    canonical = load("bmkg_canonical_example.json")
    schema = load("bmkg_canonical_evidence.schema.json")
    Draft202012Validator(schema, format_checker=FormatChecker()).validate(canonical)

    assert canonical["source"]["name"] == "BMKG"
    assert canonical["source"]["attribution_required"] is True
    assert canonical["provenance"]["is_mock"] is False
    assert canonical["location"]["administrative"]["adm4"]
    assert canonical["temporal"]["analysis_time"] == canonical["payload"]["analysis_time"]
    assert utc(canonical["temporal"]["analysis_time"]) <= utc(canonical["provenance"]["fetched_at"])
    assert utc(canonical["temporal"]["first_target_time"]) <= utc(canonical["temporal"]["last_target_time"])

    options = load("ACTION_OPTIONS_v0.2.json")["options"]
    option_ids = [option["option_id"] for option in options]
    assert len(option_ids) == len(set(option_ids))
    assert load("ACTION_OPTIONS_v0.2.json")["ranking"] is None

    expected = load("expected_results.json")
    primary = load("fixtures/deterministic_scenarios.json")
    supplemental = load("fixtures/supplemental_scenarios.json")
    scenario_ids = [item["id"] for item in primary + supplemental]
    assert set(scenario_ids) == set(expected)

    ruleset = load("ruleset_water_v0.2.json")
    assert ruleset["deterministic"] is True
    assert ruleset["ranked_recommendation_enabled"] is False
    assert ruleset["confidence_policy"]["high_enabled"] is False

    print("BMKG canonical schema: PASS")
    print("Canonical temporal/provenance invariants: PASS")
    print("Action option registry invariants: PASS")
    print("Scenario/expected-result coverage: PASS (8/8)")
    print("Ruleset safety invariants: PASS")


if __name__ == "__main__":
    main()

