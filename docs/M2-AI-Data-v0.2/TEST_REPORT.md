# AI/Data v0.2 Test Report

**Tanggal:** 3 September 2026  
**Command:** `python data/evidence/v0.2/test_reasoning_v0_2.py`

## Result

```text
T1_NORMAL: PASS
T2_FIELD_PULSE_UNKNOWN: PASS
T3_BMKG_UNAVAILABLE: PASS
T4_CACHED_BMKG: PASS
T5_CONFLICTING_LOCAL_OBSERVATION: PASS
T6_REASONING_FAILURE: PASS
6 scenarios passed; same input + evaluation time = same output
```

Seluruh JSON pada `data/evidence/v0.2/` juga berhasil diparse. Test memastikan:

- output repeatable untuk input dan evaluation time yang sama;
- confidence `high` tidak digunakan;
- `recommended_option_id` selalu null;
- missing BMKG menyebabkan abstention;
- unknown Field Pulse tetap valid tetapi meminta verifikasi;
- reasoning failure tidak menghasilkan assessment palsu.

