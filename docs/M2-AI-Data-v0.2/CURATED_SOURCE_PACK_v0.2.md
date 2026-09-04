# Curated Source Pack v0.2

| rule_id | Purpose | Input | Logic | Source | Status | Limitation |
|---|---|---|---|---|---|---|
| `SRC-BMKG-01` | Parse forecast | BMKG JSON | Flatten `cuaca[][]`; map hanya documented fields. | BMKG Public Forecast documentation | `curated_rule` | Nullability/schema evolution tidak dijamin per field. |
| `SRC-BMKG-02` | Attribution | `source.name` | UI wajib mencantumkan BMKG. | BMKG API documentation | `curated_rule` | Copy/placement ditentukan PM/UX. |
| `POL-FRESH-01` | Source freshness | target, analysis, fetch, evaluation time | Target relevan → current; target habis → stale. | Product/data policy | `system_policy` | Bukan agronomic expiry. |
| `POL-FIELD-01` | Preserve unknown | Field Pulse enums | Unknown tetap unknown dan masuk missing information. | Product context v0.2 | `system_policy` | Tidak mengukur kualitas observer. |
| `POL-ABSTAIN-01` | Safe failure | evidence evaluations | Required evidence tidak usable → abstain. | HOL-88 safety boundary + product policy | `system_policy` | Tidak menilai urgensi agronomis. |
| `POL-OPTION-01` | No ranking | context state | Emit bounded IDs tanpa score/ranking. | Product context v0.2 | `system_policy` | Tidak menghitung outcome/trade-off agronomis. |
| `PRO-WATER-01` | Context summary | Field Pulse | Echo observasi lengkap tanpa mengubahnya menjadi risk. | Prototype semantic rule | `prototype_rule` | Belum divalidasi lapangan. |

Referensi resmi: https://data.bmkg.go.id/prakiraan-cuaca/

Tidak ada rule v0.2 yang menyimpulkan kebutuhan air, durasi irigasi, drought,
atau tindakan budidaya dari `t`, `hu`, `weather_desc`, `tcc`, atau `ws`.
