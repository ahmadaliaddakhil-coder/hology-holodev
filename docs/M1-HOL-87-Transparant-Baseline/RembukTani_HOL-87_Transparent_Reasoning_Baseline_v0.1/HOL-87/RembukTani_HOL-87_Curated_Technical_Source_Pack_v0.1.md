# RembukTani — HOL-87 Curated Technical/Agronomic Source Pack v0.1

**Linear Issue:** HOL-87 — `[M1] Define transparent risk-engine baseline`  
**Milestone:** M1 — Scope & UX Freeze  
**Owner:** AI/Data  
**Tanggal:** 2 September 2026  
**Status:** **DRAFT — CURATED SOURCE BASIS FOR PROTOTYPE REASONING**

## 1. Tujuan

Source pack ini mencegah reasoning baseline mengarang threshold agronomis.

Setiap sumber dipakai hanya untuk klaim yang benar-benar didukung. Sumber tidak otomatis membuat rule RembukTani menjadi locally validated.

## 2. Evidence classes

### S1 — IRRI Rice Knowledge Bank: Water Management / Safe AWD

**Authority:** International Rice Research Institute (IRRI)  
**Type:** validated/practical rice-production knowledge  
**Use in HOL-87:**

- local field water status memang relevan terhadap irrigation decision;
- growth stage memengaruhi water-management practice;
- sekitar flowering, safe-AWD guidance memperlakukan water condition secara lebih konservatif;
- field water measurement digunakan dalam practical irrigation decisions.

**Tidak mendukung:**

- `irrigation_flow_percentage = 20` berarti "critical" secara universal;
- `8 consecutive dry days` adalah threshold agronomis universal;
- fixture `critical_low` sama dengan water-depth threshold AWD.

**Transferability:** conceptual/agronomic-general; bukan local calibration RembukTani.

Reference:
- IRRI Rice Knowledge Bank — *Water management*.
- IRRI Rice Knowledge Bank — *Saving Water with Alternate Wetting and Drying (AWD)*.

---

### S2 — IRRI Safe AWD practical threshold

IRRI menjelaskan safe AWD menggunakan **field water tube** untuk mengamati water depth, dengan re-irrigation sekitar 15 cm di bawah permukaan pada kondisi yang sesuai; namun periode sekitar flowering diperlakukan khusus.

**Use in HOL-87:**

- mendukung bahwa irrigation decisions seharusnya memakai **field water state**, bukan hanya regional weather;
- mendukung bahwa **satu numeric rule tidak boleh dipindahkan ke variable lain**.

**Important non-transfer rule:**

> Threshold AWD `-15 cm` tidak boleh diterjemahkan menjadi `20% irrigation flow`, `soil_crack=shallow`, atau label `critical_low`.

Variable-nya berbeda.

---

### S3 — Drought sensitivity around reproductive / flowering stage

**Source:** Zhang et al. (2018), *Effect of Drought on Agronomic Traits of Rice and Wheat: A Meta-Analysis*, International Journal of Environmental Research and Public Health, 15(5), 839.  
**DOI:** `10.3390/ijerph15050839`

Meta-analysis menunjukkan dampak drought pada rice sangat bergantung pada growth stage dan reproductive/flowering stages termasuk periode yang sangat sensitif.

**Use in HOL-87:**

Rule kualitatif:

> Jika local field evidence sudah menunjukkan water-shortage signal dan crop context = flowering, flowering dapat menjadi **attention modifier**.

**Tidak mendukung:**

- memberi prescription durasi/jumlah irigasi;
- menentukan risk probability;
- menganggap setiap dry-day forecast berarti drought stress tanaman.

---

### S4 — IrrigaSys DSS

**Source:** Simionesei et al. (2020), *IrrigaSys: A web-based irrigation decision support system based on open source data and technology*, Computers and Electronics in Agriculture, 178, 105822.  
**DOI:** `10.1016/j.compag.2020.105822`

IrrigaSys menggabungkan:
- plot/location;
- crop context;
- soil;
- irrigation information;
- local weather;
- weather forecast;
- model-based water reasoning.

Paper juga menyatakan keterbatasan prediction reliability terkait konfigurasi dan limited field data.

**Use in HOL-87:**

- mendukung product pattern **external weather + local field/crop context**;
- mendukung explicit uncertainty/limitations;
- mendukung input minimization.

**Tidak mendukung:**

- menyalin IrrigaSys model ke padi Indonesia;
- memakai output IrrigaSys sebagai threshold RembukTani.

---

### S5 — IrrigaSys post-evaluation

**Source:** Darouich et al. (2024), *Assessing the Impact of IrrigaSys Decision Support System on Farmers’ Irrigation Practices in Southern Portugal: A Post Evaluation Study*, Agronomy, 14(1), 66.  
**DOI:** `10.3390/agronomy14010066`

Sistem digunakan 2017–2022. Evaluasi mencatat bahwa integrasi precipitation forecast yang reliable dapat menjadi tantangan pada decision making.

**Use in HOL-87:**

- forecast bukan ground truth;
- confidence/explanation perlu mempertimbangkan keterbatasan evidence;
- model recommendation perlu dievaluasi berkala terhadap praktik/outcome.

**Tidak mendukung:**

- quantitative confidence RembukTani;
- threshold forecast tertentu untuk padi Indonesia.

---

## 3. Curated conclusions yang boleh masuk rule

### C1 — Local water status matters

Supported by S1/S2/S4.

> Climate/weather evidence saja tidak cukup untuk irrigation-oriented assessment; local field water information merupakan input yang relevan.

Ini mendukung **minimum-evidence product policy** RembukTani, tetapi keputusan bahwa local field observation menjadi blocking di M1 tetap merupakan **product/safety policy**, bukan hukum agronomi universal.

### C2 — Flowering increases concern when water-shortage evidence already exists

Supported by S1/S3.

> `growth_stage = flowering` boleh menjadi attention modifier **hanya ketika sudah ada local evidence yang menunjukkan water shortage/stress condition**.

Flowering sendirian bukan risk factor.

### C3 — Do not infer agronomic thresholds from unrelated fixture variables

Supported by variable semantics in S1/S2.

Do not create rules such as:
- `irrigation_flow_percentage <= 20 → critical`
- `consecutive_dry_days >= 8 → drought`
- `soil_crack = shallow → irrigate`

tanpa source yang secara langsung memvalidasi variable + threshold + context tersebut.

### C4 — Forecast contributes context, not certainty

Supported by S4/S5.

Forecast dapat menjadi evidence input, tetapi:
- tetap perlu local context;
- uncertainty harus terlihat;
- jangan menjadikannya satu-satunya basis prescription.

---

## 4. Source gaps yang masih ada

Belum tersedia evidence yang cukup untuk mengunci:

1. local Indonesian threshold untuk field-water state pada target RembukTani;
2. mapping `irrigation_flow_percentage` ke water-risk class;
3. threshold `consecutive_dry_days` untuk target hamparan;
4. exact freshness window untuk field observation;
5. exact weighting/source reliability score;
6. prescription irrigation amount/duration;
7. probabilistic calibration untuk `assessment.confidence`;
8. locally validated action ranking.

Karena itu rule terkait bagian tersebut harus tetap:
- `prototype_rule`; atau
- tidak diimplementasikan.

---

## 5. Rule status policy

### `curated_rule`

Boleh dipakai jika:
- klaim kualitatif langsung didukung source;
- variable semantics cocok;
- tidak melakukan transfer threshold yang tidak sah.

### `prototype_rule`

Gunakan jika:
- logic diperlukan untuk deterministic demo;
- belum tervalidasi agronomis;
- effect/threshold berasal dari fixture/product design.

### `system_policy`

Untuk:
- evidence completeness;
- abstention;
- provenance;
- freshness evaluation berdasarkan `valid_until`;
- human authority;
- recommendation feature gate.

`system_policy` bukan agronomic rule.

---

## 6. Freeze boundary

Source pack v0.1 cukup untuk:
- transparent demo reasoning;
- qualitative flowering modifier;
- explicit missing-evidence behavior;
- alternatives-only recommendation mode.

Belum cukup untuk:
- validated agronomic recommendation engine;
- ranked best suggestion;
- irrigation prescription.

