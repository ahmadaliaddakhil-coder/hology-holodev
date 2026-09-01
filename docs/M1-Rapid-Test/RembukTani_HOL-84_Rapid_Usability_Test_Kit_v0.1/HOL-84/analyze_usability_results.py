#!/usr/bin/env python3
from pathlib import Path
import csv
from collections import Counter

BASE = Path(__file__).resolve().parent

def to_int(v):
    try:
        return int(str(v).strip())
    except Exception:
        return None

def yes(v):
    return str(v).strip().lower() in {"yes","y","true","1","ya"}

def severity_weight(s):
    return {"S3":4,"S2":3,"S1":1,"S0":0}.get(str(s).strip().upper(),0)

def main():
    obs_path = BASE / "participant_observations.csv"
    with obs_path.open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))

    completed_sessions = [r for r in rows if yes(r.get("session_complete_yes_no"))]
    print("=== HOL-84 RAPID USABILITY SUMMARY ===")
    print(f"Completed sessions: {len(completed_sessions)}/3")

    if not completed_sessions:
        print("No participant results yet. HOL-84 remains READY TO RUN / RESULTS PENDING.")
    else:
        unassisted = sum(to_int(r.get("core_task_completion_0_2")) == 2 for r in completed_sessions)
        ev_pass = sum(to_int(r.get("evidence_comprehension_0_2")) == 2 for r in completed_sessions)
        ex_pass = sum(to_int(r.get("explanation_comprehension_0_2")) == 2 for r in completed_sessions)
        hc_zero = sum(to_int(r.get("human_control_0_2")) == 0 for r in completed_sessions)
        mock_fail = sum(to_int(r.get("mock_recognition_0_1")) == 0 for r in completed_sessions)

        print(f"Unassisted Decision Record completion: {unassisted}/{len(completed_sessions)}")
        print(f"Evidence comprehension pass: {ev_pass}/{len(completed_sessions)}")
        print(f"Explanation comprehension pass: {ex_pass}/{len(completed_sessions)}")
        print(f"Human-control failures (score 0): {hc_zero}")
        print(f"MOCK recognition failures: {mock_fail}")

        criteria = {
            "3 participant sessions": len(completed_sessions) >= 3,
            "3 unassisted Decision Record completions": unassisted >= 3,
            "Evidence comprehension >= 2/3": ev_pass >= 2 if len(completed_sessions) >= 3 else False,
            "Explanation comprehension >= 2/3": ex_pass >= 2 if len(completed_sessions) >= 3 else False,
            "Human-control integrity": hc_zero == 0,
        }
        print("\nAcceptance metrics:")
        for k,v in criteria.items():
            print(f"[{'PASS' if v else 'FAIL/PENDING'}] {k}")

    issue_path = BASE / "ux_issues.csv"
    with issue_path.open(encoding="utf-8", newline="") as f:
        issues = list(csv.DictReader(f))

    scored = []
    for i in issues:
        if not i.get("issue_title","").strip():
            continue
        freq = to_int(i.get("frequency_1_3")) or 0
        score = severity_weight(i.get("severity_S0_S3")) * freq
        if yes(i.get("core_or_safety_yes_no")):
            score += 2
        i["calculated_priority_score"] = score
        scored.append(i)

    scored.sort(key=lambda x: x["calculated_priority_score"], reverse=True)
    print("\nTop UX issues:")
    if not scored:
        print("- No participant-derived issues entered yet.")
    for i in scored[:5]:
        print(f"- {i.get('issue_id')}: {i.get('issue_title')} | score={i['calculated_priority_score']} | {i.get('severity_S0_S3')}")

if __name__ == "__main__":
    main()
