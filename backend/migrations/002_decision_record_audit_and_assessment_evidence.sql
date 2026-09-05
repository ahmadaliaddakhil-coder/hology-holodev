-- RembukTani M2 follow-up migration
-- Adds the audit/snapshot fields required for immutable human decisions.

ALTER TABLE decision_records
  ADD COLUMN IF NOT EXISTS authority VARCHAR(20) NOT NULL DEFAULT 'human',
  ADD COLUMN IF NOT EXISTS is_mock BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS supersedes_record_id UUID,
  ADD COLUMN IF NOT EXISTS assessment_snapshot JSONB,
  ADD COLUMN IF NOT EXISTS evidence_snapshot JSONB;

ALTER TABLE external_source_cache
  ADD COLUMN IF NOT EXISTS request_uri TEXT;

CREATE INDEX IF NOT EXISTS idx_external_source_cache_fresh_bmkg
  ON external_source_cache(source_name, request_key, expires_at DESC);

ALTER TABLE decision_records
  DROP CONSTRAINT IF EXISTS decision_records_authority_check;

ALTER TABLE decision_records
  ADD CONSTRAINT decision_records_authority_check CHECK (authority = 'human');

ALTER TABLE decision_records
  DROP CONSTRAINT IF EXISTS fk_decision_records_supersedes;

ALTER TABLE decision_records
  ADD CONSTRAINT fk_decision_records_supersedes
  FOREIGN KEY (supersedes_record_id) REFERENCES decision_records(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_decision_records_supersedes_record_id
  ON decision_records(supersedes_record_id);

CREATE TABLE IF NOT EXISTS assessment_evidence (
  assessment_id UUID NOT NULL,
  evidence_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (assessment_id, evidence_id),
  CONSTRAINT fk_assessment_evidence_assessment
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  CONSTRAINT fk_assessment_evidence_evidence
    FOREIGN KEY (evidence_id) REFERENCES decision_case_evidence(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_assessment_evidence_evidence_id
  ON assessment_evidence(evidence_id);

ALTER TABLE assessment_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessment_evidence_select_via_case"
  ON assessment_evidence FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM assessments a
    JOIN decision_cases dc ON dc.id = a.decision_case_id
    JOIN lands l ON l.id = dc.land_id
    JOIN profiles p ON p.id = l.owner_id
    WHERE a.id = assessment_evidence.assessment_id
      AND p.user_id = auth.uid()
  ));

CREATE POLICY "assessment_evidence_insert_via_case"
  ON assessment_evidence FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1
    FROM assessments a
    JOIN decision_cases dc ON dc.id = a.decision_case_id
    JOIN lands l ON l.id = dc.land_id
    JOIN profiles p ON p.id = l.owner_id
    WHERE a.id = assessment_evidence.assessment_id
      AND p.user_id = auth.uid()
  ));
