# TASK 4.2: API Endpoints

The backend exposes the core RembukTani decision workflow under `/api`.

## Health

`GET /api/health`

## Lands and Crop Context

- `GET /api/lands` (owner derived from Supabase Auth token)
- `POST /api/lands`
- `GET /api/lands/:id`
- `PATCH /api/lands/:id`
- `DELETE /api/lands/:id` (soft archive)
- `GET /api/lands/:landId/crops`
- `GET /api/lands/:landId/crop-context`
- `POST /api/lands/:landId/crops`

## Decision Case and Evidence

- `POST /api/decision-cases`
- `GET /api/decision-cases` (owner derived from Supabase Auth token)
- `GET /api/decision-cases/:id`
- `PATCH /api/decision-cases/:id/status`
- `GET /api/decision-cases/:decisionCaseId/evidence`
- `POST /api/decision-cases/:decisionCaseId/evidence`
- `POST /api/locations/resolve`
- `POST /api/decision-cases/:decisionCaseId/bmkg/refresh`
- `POST /api/decision-cases/:decisionCaseId/field-pulse`

## Assessment and Options

- `GET /api/decision-cases/:decisionCaseId/assessments`
- `POST /api/decision-cases/:decisionCaseId/assessments`
- `GET /api/assessments/:assessmentId/options`
- `POST /api/assessments/:assessmentId/options`
- `POST /api/decision-cases/:decisionCaseId/assess`
- `GET /api/decision-cases/:decisionCaseId/assessment`

## Human Decision and Brief

- `GET /api/decision-cases/:decisionCaseId/decision`
- `POST /api/decision-cases/:decisionCaseId/decision`
- `GET /api/decision-records/:id/brief`
- `GET /api/decision-records/:id`
- `POST /api/decision-records/:id/brief`
- `GET /api/decision-records/:id/share-text`
- `GET /api/decision-records` (decider derived from Supabase Auth token)

## Trusted Review

- `POST /api/decision-cases/:decisionCaseId/reviews`
- `GET /api/decision-cases/:decisionCaseId/reviews`

When the review request body omits `status`, the case moves to `review_pending`.
When `status` is `approve`, `modify`, or `reject`, a review result is persisted.

## Example: Create a Decision Case

```json
{
  "land_id": "land-uuid",
  "crop_context_id": "crop-uuid",
  "created_by": "profile-uuid",
  "decision_type": "water_condition"
}
```

## Example: Add Evidence

```json
{
  "type": "field_pulse",
  "source": "Manual",
  "payload": {
    "water_presence": "limited",
    "soil_moisture": "dry"
  },
  "is_mock": true
}
```

Request validation is performed in the route layer. Repository errors are converted to JSON responses, and final decision records remain immutable through the repository contract.
