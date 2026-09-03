"""Deterministic, non-agronomic reasoning reference for RembukTani v0.2."""

from datetime import datetime, timezone

WATER = {"present", "limited", "none", "unknown"}
FLOW = {"flowing", "limited", "not_flowing", "unknown"}


def instant(value):
    if not isinstance(value, str):
        raise ValueError("timestamp must be a string")
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)


def option_ids(state):
    common = ["OPT-VERIFY-FIELD", "OPT-COLLECT-WATER-SOURCE", "OPT-DEFER"]
    if state not in {"insufficient_evidence", "unavailable"}:
        common.insert(2, "OPT-REQUEST-REVIEW")
    return common


def assess(payload):
    evaluated_at = payload.get("evaluation_time")
    base = {
        "evaluated_at": evaluated_at,
        "ruleset_version": "water-v0.2",
        "factors": [],
        "missing_evidence": [],
        "limitations": ["weather_not_local_water_state", "no_agronomic_thresholds"],
        "action_options": [],
    }

    try:
        now = instant(evaluated_at)
        if payload.get("simulate_reasoning_failure"):
            raise RuntimeError("simulated deterministic failure")

        crop = payload.get("crop_context")
        if not isinstance(crop, dict) or not crop.get("crop"):
            base["missing_evidence"].append("active_crop_context")

        bmkg = payload.get("bmkg") or {}
        target_times = bmkg.get("target_times") or []
        usable_targets = [instant(t) for t in target_times if instant(t) >= now]
        bmkg_current = bool(bmkg.get("available") and usable_targets)
        base["bmkg_delivery"] = "cached" if bmkg.get("cached") else "live"
        if not bmkg_current:
            base["missing_evidence"].append("current_bmkg_forecast")
        else:
            descriptions = bmkg.get("weather_descriptions") or []
            if descriptions:
                base["factors"].append({"code": "bmkg_forecast_available", "value": descriptions[0]})

        field = payload.get("field_pulse")
        field_valid = isinstance(field, dict)
        if field_valid:
            water, flow = field.get("water_presence"), field.get("irrigation_flow")
            field_valid = water in WATER and flow in FLOW and field.get("observed_at") is not None
        if not field_valid:
            base["missing_evidence"].append("field_pulse")
            water = flow = None
        else:
            started = instant(payload["decision_case_started_at"])
            if instant(field["observed_at"]) < started:
                base["missing_evidence"].append("field_pulse_confirmation")
            base["factors"].extend([
                {"code": "field_water_observed", "value": water},
                {"code": "irrigation_flow_observed", "value": flow},
            ])
            if water == "unknown":
                base["missing_evidence"].append("water_presence_known")
            if flow == "unknown":
                base["missing_evidence"].append("irrigation_flow_known")

        if not bmkg_current or not field_valid or "active_crop_context" in base["missing_evidence"]:
            state, status, confidence, mode = "insufficient_evidence", "insufficient_evidence", "low", "abstained"
        elif water == "unknown" or flow == "unknown" or "field_pulse_confirmation" in base["missing_evidence"]:
            state, status, confidence, mode = "needs_verification", "available", "low", "alternatives_only"
        else:
            state, status, confidence, mode = "context_available", "available", "medium", "alternatives_only"

        other = payload.get("comparable_local_observation")
        if isinstance(other, dict) and other.get("water_presence") in WATER and other.get("water_presence") != water:
            state, status, confidence, mode = "conflicting_local_evidence", "available", "low", "alternatives_only"
            base["limitations"].append("comparable_local_observations_conflict")

        base.update({
            "status": status,
            "context_state": state,
            "confidence": confidence,
            "action_options": option_ids(state),
            "recommendation": {"mode": mode, "recommended_option_id": None},
        })
        return base
    except Exception:
        base.update({
            "status": "assessment_unavailable",
            "context_state": "unavailable",
            "confidence": "unknown",
            "action_options": [],
            "recommendation": {"mode": "abstained", "recommended_option_id": None},
            "limitations": base["limitations"] + ["reasoning_execution_failed"],
        })
        return base

