import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

from reasoning_engine_v0_2 import assess


ROOT = Path(__file__).parent
SCENARIOS = ROOT / "fixtures" / "deterministic_scenarios.json"
EXPECTED = ROOT / "expected_results.json"
SCHEMA = ROOT / "reasoning_io.schema.json"


def main():
    scenarios = json.loads(SCENARIOS.read_text(encoding="utf-8"))
    expected_results = json.loads(EXPECTED.read_text(encoding="utf-8"))
    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    assert len(scenarios) == 6
    for scenario in scenarios:
        validator.validate(scenario["input"])
        first = assess(scenario["input"])
        second = assess(scenario["input"])
        validator.validate(first)
        assert first == second, f"{scenario['id']}: non-deterministic output"
        expected = expected_results[scenario["id"]]
        assert first["status"] == expected["status"], scenario["id"]
        assert first["context_state"] == expected["context_state"], scenario["id"]
        assert first["confidence"] == expected["confidence"], scenario["id"]
        assert first["recommendation"]["mode"] == expected["recommendation_mode"], scenario["id"]
        assert first["recommendation"]["recommended_option_id"] is None
        if "bmkg_delivery" in expected:
            assert first["bmkg_delivery"] == expected["bmkg_delivery"]
        print(f"{scenario['id']}: PASS")
    print("6 scenarios passed; same input + evaluation time = same output")


if __name__ == "__main__":
    main()
