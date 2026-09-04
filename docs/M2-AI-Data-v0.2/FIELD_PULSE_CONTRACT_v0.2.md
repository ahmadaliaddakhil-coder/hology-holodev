# Field Pulse Semantic Contract v0.2

Field Pulse adalah local field evidence untuk satu `decision_case` dan satu
`land_id`. Jawaban unknown adalah data valid, bukan validation error.

| Pertanyaan | Label UI | Enum backend | Makna observasi |
|---|---|---|---|
| Air di petak | Ada | `present` | User mengamati air masih ada. |
| Air di petak | Sedikit | `limited` | User mengamati air masih ada tetapi sedikit. |
| Air di petak | Tidak Ada | `none` | User tidak mengamati air di petak. |
| Air di petak | Tidak Yakin | `unknown` | User tidak dapat memastikan. |
| Aliran irigasi | Mengalir | `flowing` | User mengamati aliran berjalan. |
| Aliran irigasi | Terbatas | `limited` | User mengamati aliran ada tetapi terbatas. |
| Aliran irigasi | Tidak Mengalir | `not_flowing` | User tidak mengamati aliran. |
| Aliran irigasi | Tidak Tahu | `unknown` | User tidak mengetahui kondisinya. |

## Object

```json
{
  "water_presence": "limited",
  "irrigation_flow": "not_flowing",
  "observed_at": "2026-09-03T08:00:00Z",
  "reported_by": { "type": "user", "id": "demo_user" }
}
```

## Completeness

- `complete`: kedua jawaban bukan `unknown`.
- `partial`: tepat satu jawaban `unknown`.
- `unknown`: keduanya `unknown`.
- Missing object berbeda dari object dengan dua jawaban `unknown`.
- Partial/unknown menurunkan kekuatan dasar secara ordinal dan memunculkan
  `missing_evidence`; tidak pernah diubah menjadi label risiko.

