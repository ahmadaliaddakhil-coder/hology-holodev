# Curated Source Pack v0.2

| rule_id | Purpose | Input/logic | Source | Status | Limitation |
|---|---|---|---|---|---|
| `SRC-BMKG-01` | Parse forecast | Gunakan documented fields dan flatten `cuaca[][]`. | BMKG Public Forecast documentation | `curated_rule` | Nullability/schema evolution tidak dijamin per field. |
| `SRC-BMKG-02` | Attribution | UI mencantumkan BMKG. | BMKG API documentation | `curated_rule` | Copy/placement ditentukan PM/UX. |
| `POL-FRESH-01` | Source freshness | Bandingkan target slot, analysis time, fetch time, evaluation time. | Product/data policy | `system_policy` | Bukan agronomic expiry. |
| `POL-FIELD-01` | Preserve unknown | Unknown tetap unknown dan memicu missing information. | Product context v0.2 | `system_policy` | Tidak mengukur kualitas observer. |
| `POL-ABSTAIN-01` | Safe failure | Evidence required tidak usable → abstain. | HOL-88 safety boundary + product policy | `system_policy` | Tidak menilai urgensi agronomis. |
| `POL-OPTION-01` | No ranking | Hanya bounded alternatives. | Product context v0.2 | `system_policy` | Tidak menghitung outcome/trade-off agronomis. |
| `PRO-WATER-01` | Context summary | Echo Field Pulse lengkap tanpa mengubahnya menjadi risk. | Prototype semantic rule | `prototype_rule` | Belum divalidasi lapangan. |

Referensi resmi: https://data.bmkg.go.id/prakiraan-cuaca/

Tidak ada rule v0.2 yang menyimpulkan kebutuhan air, durasi irigasi, drought,
atau tindakan budidaya dari `t`, `hu`, `weather_desc`, `tcc`, atau `ws`.

