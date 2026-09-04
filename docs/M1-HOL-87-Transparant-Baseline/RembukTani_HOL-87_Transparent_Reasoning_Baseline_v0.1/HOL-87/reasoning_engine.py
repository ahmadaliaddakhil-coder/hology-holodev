#!/usr/bin/env python3
"""
RembukTani HOL-87 Transparent Reasoning Baseline v0.1

Scope:
- deterministic M1 demo reasoning
- no predictive ML
- no free-form agronomic LLM recommendation
- no validated irrigation prescription
"""

from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

ENGINE_ID = "rembuktani-baseline"
ENGINE_VERSION = "0.1.0"
RULESET_VERSION = "water-baseline-0.1"

LOW_WATER_LABELS = {"critical_low", "very_low", "low", "dry"}
ADEQUATE_WATER_LABELS = {"adequate", "normal", "sufficient", "good", "high"}


def parse_dt(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    value = value.replace("Z", "+00:00")
    dt = datetime.fromisoformat(value)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def freshness_status(evidence: Dict[str, Any], evaluated_at: str) -> str:
    valid_until = parse_dt(evidence.get("valid_until"))
    eval_dt = parse_dt(evaluated_at)
    if valid_until is None or eval_dt is None:
        return "unknown"
    return "current" if eval_dt <= valid_until else "stale"


def relevance_status(evidence: Dict[str, Any], decision_context: Dict[str, Any]) -> str:
    ev_loc = evidence.get("location") or {}
    dc_loc = decision_context.get("location") or {}

    ev_district = ev_loc.get("district")
    dc_district = dc_loc.get("district")
    if ev_district and dc_district and ev_district != dc_district:
        return "not_relevant"

    if evidence.get("evidence_type") == "field_observation":
        ev_h = ev_loc.get("hamparan_name")
        dc_h = dc_loc.get("hamparan_name")
        if ev_h and dc_h and ev_h != dc_h:
            return "not_relevant"

    return "relevant"


def evaluate_evidence(
    evidence_list: List[Dict[str, Any]],
    decision_context: Dict[str, Any],
    evaluated_at: str
) -> List[Dict[str, Any]]:
    out = []
    for ev in evidence_list:
        out.append({
            "evidence_id": ev["evidence_id"],
            "evidence_version": ev.get("evidence_version", 1),
            "schema_status": "valid",
            "freshness_status": freshness_status(ev, evaluated_at),
            "relevance_status": relevance_status(ev, decision_context),
            "issues": []
        })
    return out


def find_usable(
    evidence_list: List[Dict[str, Any]],
    evaluations: List[Dict[str, Any]],
    evidence_type: str
) -> List[Dict[str, Any]]:
    eval_map = {(x["evidence_id"], x["evidence_version"]): x for x in evaluations}
    usable = []
    for ev in evidence_list:
        if ev.get("evidence_type") != evidence_type:
            continue
        key = (ev["evidence_id"], ev.get("evidence_version", 1))
        ee = eval_map[key]
        if (
            ee["schema_status"] == "valid"
            and ee["freshness_status"] == "current"
            and ee["relevance_status"] == "relevant"
        ):
            usable.append(ev)
    return usable


def ref(ev: Dict[str, Any]) -> Dict[str, Any]:
    return {"id": ev["evidence_id"], "version": ev.get("evidence_version", 1)}


def water_label_from_field(ev: Dict[str, Any]) -> Optional[str]:
    p = ev.get("payload") or {}
    water = p.get("water_status")
    irr = p.get("irrigation_status")
    if isinstance(water, str):
        return water.lower()
    if isinstance(irr, str):
        return irr.lower()
    return None


def water_label_from_human(ev: Dict[str, Any]) -> Optional[str]:
    p = ev.get("payload") or {}
    value = p.get("estimated_water_availability")
    return value.lower() if isinstance(value, str) else None


def direct_water_conflict(
    field_evidence: List[Dict[str, Any]],
    human_evidence: List[Dict[str, Any]]
) -> bool:
    field_labels = {water_label_from_field(x) for x in field_evidence}
    human_labels = {water_label_from_human(x) for x in human_evidence}
    field_labels.discard(None)
    human_labels.discard(None)

    field_low = bool(field_labels & LOW_WATER_LABELS)
    field_ok = bool(field_labels & ADEQUATE_WATER_LABELS)
    human_low = bool(human_labels & LOW_WATER_LABELS)
    human_ok = bool(human_labels & ADEQUATE_WATER_LABELS)
    return (field_low and human_ok) or (field_ok and human_low)


def local_shortage_signal(field_evidence: List[Dict[str, Any]]) -> Tuple[bool, List[Dict[str, Any]]]:
    supporting = []
    signal = False
    for ev in field_evidence:
        p = ev.get("payload") or {}
        water_status = str(p.get("water_status", "")).lower()
        irrigation_status = str(p.get("irrigation_status", "")).lower()
        if water_status in LOW_WATER_LABELS or irrigation_status == "dry":
            signal = True
            supporting.append(ev)
    return signal, supporting


def climate_dry_signal(climate_evidence: List[Dict[str, Any]]) -> Tuple[bool, List[Dict[str, Any]]]:
    supporting = []
    signal = False
    for ev in climate_evidence:
        p = ev.get("payload") or {}
        if str(p.get("rainfall_category", "")).lower() == "below_normal":
            signal = True
            supporting.append(ev)
    return signal, supporting


def factor(fid, label, direction, evs, rule_id):
    return {
        "factor_id": fid,
        "label": label,
        "direction": direction,
        "linked_evidence_refs": [ref(x) for x in evs],
        "rule_id": rule_id
    }


def missing(code, description, impact, requested_type):
    return {
        "code": code,
        "description": description,
        "impact": impact,
        "requested_evidence_type": requested_type
    }


def base_assessment(bundle: Dict[str, Any], evaluated_at: str) -> Dict[str, Any]:
    dc = bundle["decision_context"]
    return {
        "assessment_id": f"ASM-{bundle['scenario_id']}",
        "version": 1,
        "decision_context_ref": {
            "id": dc["decision_context_id"],
            "version": dc["version"]
        },
        "status": "complete",
        "evaluated_at": evaluated_at,
        "reasoning": {
            "engine_id": ENGINE_ID,
            "engine_version": ENGINE_VERSION,
            "rule_set_version": RULESET_VERSION,
            "baseline_status": "prototype_rule"
        },
        "context_state": "no_elevated_signal",
        "confidence": "medium",
        "factors": [],
        "evidence_evaluations": [],
        "missing_evidence": [],
        "limitations": [
            "M1 reasoning baseline; bukan validated agronomic model.",
            "Confidence bersifat categorical product semantics, bukan probability."
        ],
        "action_option_ids": [],
        "recommendation": {
            "mode": "alternatives_only",
            "recommended_option_id": None,
            "why": "Ranked recommendation tidak diaktifkan pada HOL-87 v0.1.",
            "change_conditions": [
                "Product decision untuk evidence-ranked suggestion disetujui.",
                "Rule ranking memperoleh basis dan validation yang cukup."
            ]
        },
        "input_evidence_refs": [ref(x) for x in bundle.get("evidence", [])]
    }


def make_option(bundle, assessment, option_id, option_type, label, description, rationale,
                support_evidence, limitations=None, required=None, eligibility="eligible"):
    return {
        "option_id": option_id,
        "decision_context_ref": assessment["decision_context_ref"],
        "assessment_ref": {
            "id": assessment["assessment_id"],
            "version": assessment["version"]
        },
        "origin": "system_baseline",
        "option_type": option_type,
        "label": label,
        "description": description,
        "rationale": rationale,
        "supporting_evidence_refs": [ref(x) for x in support_evidence],
        "limitations": limitations or [],
        "required_evidence": required or [],
        "eligibility": eligibility,
        "rank": None
    }


def reason(bundle: Dict[str, Any], evaluated_at: Optional[str] = None) -> Dict[str, Any]:
    result = deepcopy(bundle)

    # Reasoning boundary: remove downstream human artifacts.
    result["trusted_reviews"] = []
    result["decision_record"] = None
    result["handoff"] = None

    if evaluated_at is None:
        existing = bundle.get("assessment") or {}
        evaluated_at = existing.get("evaluated_at") or bundle["decision_context"]["updated_at"]

    evidence = result.get("evidence", [])
    dc = result["decision_context"]
    evaluations = evaluate_evidence(evidence, dc, evaluated_at)

    climate = find_usable(evidence, evaluations, "climate_external")
    field = find_usable(evidence, evaluations, "field_observation")
    human = find_usable(evidence, evaluations, "human_observation")

    assessment = base_assessment(result, evaluated_at)
    assessment["evidence_evaluations"] = evaluations

    # Minimum evidence product/safety policy.
    missing_items = []
    if not climate:
        missing_items.append(missing(
            "CURRENT_CLIMATE_EVIDENCE",
            "Current and relevant external climate evidence.",
            "blocking",
            "climate_external"
        ))
    field_with_water = [
        x for x in field
        if (x.get("payload") or {}).get("water_status") is not None
        or (x.get("payload") or {}).get("irrigation_status") is not None
    ]
    if not field_with_water:
        missing_items.append(missing(
            "FRESH_LOCAL_WATER_OBSERVATION",
            "Fresh local water observation.",
            "blocking",
            "field_observation"
        ))

    if missing_items:
        assessment["status"] = "insufficient_evidence"
        assessment["context_state"] = "insufficient_evidence"
        assessment["confidence"] = "low"
        assessment["missing_evidence"] = missing_items
        assessment["factors"] = [
            factor(
                "FCT-GATE-001",
                "Evidence minimum untuk assessment kontekstual belum lengkap.",
                "unknown",
                climate or field or evidence[:1],
                "POL-MIN-001"
            )
        ]
        assessment["recommendation"] = {
            "mode": "abstained",
            "recommended_option_id": None,
            "why": "Blocking evidence belum tersedia/current.",
            "change_conditions": [x["description"] for x in missing_items]
        }
        assessment["reasoning"]["baseline_status"] = "prototype_rule"

        options = []
        if any(x["requested_evidence_type"] == "field_observation" for x in missing_items):
            options.append(make_option(
                result, assessment,
                f"OPT-{result['scenario_id']}-COLLECT",
                "collect_more_evidence",
                "Perbarui Field Pulse",
                "Tambahkan observasi kondisi air lokal yang masih current.",
                "Local field evidence diperlukan untuk contextual assessment M1.",
                climate or evidence[:1],
                required=[x for x in missing_items if x["requested_evidence_type"] == "field_observation"]
            ))
        if any(x["requested_evidence_type"] == "climate_external" for x in missing_items):
            options.append(make_option(
                result, assessment,
                f"OPT-{result['scenario_id']}-CLIMATE",
                "collect_more_evidence",
                "Perbarui evidence iklim",
                "Tambahkan external climate evidence yang current dan relevan.",
                "M1 decision context menggabungkan external intelligence dengan local context.",
                field or evidence[:1],
                required=[x for x in missing_items if x["requested_evidence_type"] == "climate_external"]
            ))
        options.append(make_option(
            result, assessment,
            f"OPT-{result['scenario_id']}-REVIEW",
            "request_review",
            "Minta observasi/review pihak tepercaya",
            "Gunakan trusted reviewer sebagai jalur tambahan bila keputusan tidak dapat ditunda.",
            "Sistem abstain karena evidence minimum belum lengkap.",
            climate + field + human,
            limitations=["Trusted review tidak otomatis menggantikan blocking evidence."]
        ))

        assessment["action_option_ids"] = [x["option_id"] for x in options]
        result["assessment"] = assessment
        result["action_options"] = options
        result["workflow_state"] = "insufficient_evidence"
        return result

    # Direct water-status conflict only; regional-vs-local difference is NOT conflict.
    if direct_water_conflict(field_with_water, human):
        assessment["status"] = "complete"
        assessment["context_state"] = "conflicting_evidence"
        assessment["confidence"] = "low"
        assessment["factors"] = [
            factor(
                "FCT-CONFLICT-001",
                "Local field water status dan human water-availability observation menunjukkan arah yang berbeda.",
                "unknown",
                field_with_water + human,
                "POL-CONFLICT-001"
            )
        ]
        assessment["limitations"].append(
            "Conflict detector v0.1 hanya menangani direct categorical water-status conflict."
        )
        assessment["recommendation"] = {
            "mode": "alternatives_only",
            "recommended_option_id": None,
            "why": "Evidence material saling berbeda; jangan membuat ranking palsu.",
            "change_conditions": [
                "Observasi air terbaru tersedia.",
                "Conflict diklarifikasi oleh evidence tambahan atau trusted review."
            ]
        }
        conflict_required = [
            missing(
                "CLARIFY_WATER_STATUS_CONFLICT",
                "Klarifikasi perbedaan water-status evidence.",
                "material",
                "field_observation"
            )
        ]
        assessment["missing_evidence"] = conflict_required
        options = [
            make_option(
                result, assessment,
                f"OPT-{result['scenario_id']}-COLLECT",
                "collect_more_evidence",
                "Perbarui observasi air",
                "Ambil observasi air terbaru untuk mengklarifikasi conflict.",
                "Direct water-status evidence menunjukkan arah berbeda.",
                field_with_water + human,
                required=conflict_required
            ),
            make_option(
                result, assessment,
                f"OPT-{result['scenario_id']}-REVIEW",
                "request_review",
                "Minta trusted review",
                "Minta reviewer menilai evidence yang berbeda dan konteks lapangan.",
                "Human judgement dapat membantu saat conflict material belum resolved.",
                field_with_water + human
            )
        ]
        assessment["action_option_ids"] = [x["option_id"] for x in options]
        result["assessment"] = assessment
        result["action_options"] = options
        result["workflow_state"] = "options_ready"
        return result

    # Domain/context factors.
    climate_dry, climate_support = climate_dry_signal(climate)
    water_short, water_support = local_shortage_signal(field_with_water)

    factors = []
    used_curated = False
    used_prototype = False

    if climate_dry:
        factors.append(factor(
            "FCT-CLIMATE-001",
            "External climate evidence membawa signal curah hujan di bawah normal.",
            "supports_attention",
            climate_support,
            "PR-CLIMATE-001"
        ))
        used_prototype = True

    if water_short:
        factors.append(factor(
            "FCT-FIELD-001",
            "Local field evidence membawa water-shortage signal pada taxonomy fixture.",
            "supports_attention",
            water_support,
            "PR-FIELD-001"
        ))
        used_prototype = True

    crop_stage = str((dc.get("crop_context") or {}).get("growth_stage", "")).lower()
    if crop_stage == "flowering" and water_short:
        factors.append(factor(
            "FCT-STAGE-001",
            "Flowering adalah tahap yang sensitif terhadap water stress; factor ini hanya aktif karena local shortage signal sudah ada.",
            "supports_attention",
            water_support,
            "CR-STAGE-001"
        ))
        used_curated = True

    # Human observation may corroborate but is not required.
    human_low = [
        x for x in human if water_label_from_human(x) in LOW_WATER_LABELS
    ]
    if human_low:
        factors.append(factor(
            "FCT-HUMAN-001",
            "Human observation juga mencatat water-availability signal yang rendah.",
            "supports_attention",
            human_low,
            "PR-HUMAN-001"
        ))
        used_prototype = True

    if climate_dry and water_short:
        context_state = "elevated_attention"
    else:
        context_state = "no_elevated_signal"

    assessment["context_state"] = context_state
    assessment["factors"] = factors
    assessment["confidence"] = "medium"  # high intentionally disabled in M1 v0.1

    if used_curated and used_prototype:
        assessment["reasoning"]["baseline_status"] = "mixed"
    elif used_curated:
        assessment["reasoning"]["baseline_status"] = "curated_rule"
    else:
        assessment["reasoning"]["baseline_status"] = "prototype_rule"

    options = []

    if context_state == "elevated_attention":
        material = missing(
            "LATEST_WATER_ALLOCATION",
            "Konfirmasi kondisi/sumber/alokasi air terbaru sebelum perubahan operasional.",
            "material",
            "field_observation"
        )
        assessment["missing_evidence"] = [material]
        assessment["limitations"].extend([
            "Mapping rainfall_category/water_status fixture ke elevated_attention adalah prototype combination rule.",
            "Tidak ada numeric irrigation prescription pada HOL-87 v0.1."
        ])
        options = [
            make_option(
                result, assessment,
                "OPT-WATER-001",
                "action",
                "Verifikasi dan siapkan penyesuaian",
                "Verifikasi kondisi air terkini dan siapkan penyesuaian rencana bila kondisi kritis terkonfirmasi.",
                "External dry-context signal dan local water-shortage signal sama-sama tersedia, tetapi kondisi/sumber air terbaru masih perlu dikonfirmasi.",
                climate_support + water_support,
                limitations=["Demo-only bounded option; bukan prescription agronomis tervalidasi."],
                required=[material],
                eligibility="conditional"
            ),
            make_option(
                result, assessment,
                "OPT-WATER-002",
                "collect_more_evidence",
                "Tambah evidence sebelum mengubah rencana",
                "Pertahankan rencana sementara sambil meminta observasi/kondisi air terbaru sebelum menetapkan perubahan.",
                "Masih terdapat evidence material yang perlu dikonfirmasi.",
                climate + field_with_water + human,
                limitations=["Tidak menilai consequence agronomis dari menunda tindakan."],
                required=[material]
            ),
            make_option(
                result, assessment,
                "OPT-WATER-003",
                "request_review",
                "Minta trusted review",
                "Minta pertimbangan reviewer tepercaya untuk menilai kondisi dan trade-off sebelum final decision.",
                "Human judgement dapat digunakan ketika uncertainty material masih ada.",
                climate + field_with_water + human,
                limitations=["Reviewer tidak otomatis menjadi final decision owner."]
            )
        ]
    else:
        assessment["limitations"].append(
            "No-elevated-signal tidak berarti kondisi agronomis aman; hanya berarti prototype rule tidak menemukan signal yang dikonfigurasi."
        )
        options = [
            make_option(
                result, assessment,
                f"OPT-{result['scenario_id']}-MONITOR",
                "defer",
                "Pertahankan pemantauan",
                "Tidak ada elevated signal dari rule v0.1; perbarui evidence jika kondisi berubah.",
                "Prototype baseline tidak menemukan kombinasi signal yang dikonfigurasi.",
                climate + field_with_water + human,
                limitations=["Bukan pernyataan bahwa tidak ada risiko agronomis."]
            ),
            make_option(
                result, assessment,
                f"OPT-{result['scenario_id']}-REVIEW",
                "request_review",
                "Minta trusted review bila tetap ada kekhawatiran",
                "Gunakan human judgement jika terdapat konteks yang tidak tertangkap data.",
                "System baseline memiliki scope terbatas.",
                climate + field_with_water + human
            )
        ]

    assessment["action_option_ids"] = [x["option_id"] for x in options]
    assessment["recommendation"] = {
        "mode": "alternatives_only",
        "recommended_option_id": None,
        "why": "Ranked recommendation belum diaktifkan pada M1 HOL-87 v0.1.",
        "change_conditions": [
            "Ranking rule memiliki source/validation yang cukup.",
            "Product decision evidence-ranked suggestion disetujui."
        ]
    }

    result["assessment"] = assessment
    result["action_options"] = options
    result["workflow_state"] = "options_ready"
    return result
