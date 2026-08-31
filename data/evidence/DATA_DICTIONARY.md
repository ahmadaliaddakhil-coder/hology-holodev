# Evidence Contract v0.1 — Data Dictionary

| Field | Type | Required | Description | Allowed Values / Example |
| :--- | :--- | :---: | :--- | :--- |
| `evidence_id` | string | Yes | Unique evidence ID | `EVD-CLM-001` |
| `evidence_type` | enum | Yes | Jenis evidence | `climate_external`, `field_observation`, `human_observation` |
| `source.category` | enum | Yes | Jenis source | `official_mock`, `group_observation`, `extension_worker` |
| `source.name` | string | Yes | Nama source | `BMKG`, `PPL` |
| `provenance.collection_mode`| enum | Yes | Cara data diperoleh | `fixture`, `manual` |
| `provenance.is_mock` | boolean | Yes | Data mock atau bukan | `true` |
| `location.district` | string | Yes | Nama kecamatan | `Kepanjen` |
| `observed_at` | datetime | Yes | Waktu evidence (ISO 8601)| `2026-08-30T00:00:00Z` |
| `valid_until` | datetime | Yes | Batas relevansi (ISO 8601)| `2026-09-06T00:00:00Z` |
| `quality.level` | enum | Yes | Kualitas evidence | `high`, `medium`, `low`, `unknown` |
| `quality.basis` | string | Yes | Dasar penilaian | `official_source_mock_fixture` |
| `payload` | object | Yes | Data spesifik per tipe | *Bervariasi* |