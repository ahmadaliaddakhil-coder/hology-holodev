import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

from reasoning_engine_v0_2 import assess


ROOT = Path(__file__).parent
SCENARIOS = ROOT / "fixtures" / "deterministic_scenarios.json"
SUPPLEMENTAL = ROOT / "fixtures" / "supplemental_scenarios.json"
EXPECTED = ROOT / "expected_results.json"
SCHEMA = ROOT / "reasoning_io.schema.json"


def main():
    scenarios = json.loads(SCENARIOS.read_text(encoding="utf-8"))
    scenarios += json.loads(SUPPLEMENTAL.read_text(encoding="utf-8"))
    expected_results = json.loads(EXPECTED.read_text(encoding="utf-8"))
    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    assert len(scenarios) == 8
    for scenario in scenarios:
        validator.validate(scenario["input"])
        first = assess(scenario["input"])
        second = assess(scenario["input"])
        validator.validate(first)
        assert first == second, f"{scenario['id']}: non-deterministic output"
        expected = expected_results[scenario["id"]]
        assessment = first["assessment"]
        assert assessment["status"] == expected["status"], scenario["id"]
        assert assessment["context_state"] == expected["context_state"], scenario["id"]
        assert assessment["confidence"] == expected["confidence"], scenario["id"]
        assert assessment["recommendation"]["mode"] == expected["recommendation_mode"], scenario["id"]
        assert assessment["recommendation"]["recommended_option_id"] is None
        if "bmkg_delivery" in expected:
            assert assessment["bmkg_delivery"] == expected["bmkg_delivery"]
        if "bmkg_freshness" in expected:
            assert assessment["bmkg_freshness"] == expected["bmkg_freshness"]
        if "field_pulse_freshness" in expected:
            assert assessment["field_pulse_freshness"] == expected["field_pulse_freshness"]
        print(f"{scenario['id']}: PASS")
    print("8 scenarios passed; same input + evaluation time = same output")


if __name__ == "__main__":
    main()
