/**
 * RembukTani Database Query Reference
 * Common queries for M2 workflow
 */

import { supabase } from './supabase.js';
import type {
  Land,
  CropContext,
  DecisionCase,
  DecisionCaseEvidence,
  Assessment,
  ActionOption,
  DecisionRecord,
} from '../../domain/types.js';

// ===================================
// 1. PROFILE & AUTHENTICATION
// ===================================

/** Create profile after auth signup */
export async function createProfile(userId: string, email: string) {
  return await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      display_name: email.split('@')[0],
      role: 'farmer',
    })
    .select()
    .single();
}

/** Get current user profile */
export async function getProfile(userId: string) {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
}

// ===================================
// 2. LANDS
// ===================================

/** List user's lands */
export async function getUserLands(ownerId: string) {
  return await supabase
    .from('lands')
    .select('*')
    .eq('owner_id', ownerId)
    .is('archived_at', null) // exclude archived
    .order('created_at', { ascending: false });
}

/** Get land with active crop */
export async function getLandWithCrop(landId: string) {
  return await supabase
    .from('lands')
    .select(
      `
      *,
      crop_contexts (
        *
      )
    `
    )
    .eq('id', landId)
    .single();
}

/** Create new land */
export async function createLand(land: {
  owner_id: string;
  name: string;
  latitude: number;
  longitude: number;
  adm4_code?: string;
}) {
  const { data, error } = await supabase.from('lands').insert(land).select().single();
  if (error) throw error;
  return data;
}

/** Update land with resolved location */
export async function updateLandLocation(
  landId: string,
  locationUpdate: {
    adm4_code: string;
    province: string;
    regency: string;
    district: string;
    village: string;
    location_source: string;
    location_resolved_at: string;
  }
) {
  return await supabase
    .from('lands')
    .update(locationUpdate)
    .eq('id', landId)
    .select()
    .single();
}

// ===================================
// 3. CROP CONTEXTS
// ===================================

/** Create crop context for land */
export async function createCropContext(cropContext: {
  land_id: string;
  crop_name: string;
  variety_name?: string;
  growth_stage: string;
  planting_date?: string;
}) {
  // First, deactivate any existing active crop
  await supabase
    .from('crop_contexts')
    .update({ is_active: false })
    .eq('land_id', cropContext.land_id)
    .eq('is_active', true);

  // Then, create new active crop
  const { data, error } = await supabase
    .from('crop_contexts')
    .insert({ ...cropContext, is_active: true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Get active crop for land */
export async function getActiveCrop(landId: string) {
  return await supabase
    .from('crop_contexts')
    .select('*')
    .eq('land_id', landId)
    .eq('is_active', true)
    .single();
}

// ===================================
// 4. DECISION CASES
// ===================================

/** Create decision case */
export async function createDecisionCase(decisionCase: {
  land_id: string;
  crop_context_id: string;
  created_by: string;
  decision_type: string;
}) {
  const { data, error } = await supabase
    .from('decision_cases')
    .insert(decisionCase)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Get decision case with full context */
export async function getDecisionCaseWithContext(decisionCaseId: string) {
  return await supabase
    .from('decision_cases')
    .select(
      `
      *,
      crop_context:crop_contexts(*),
      land:lands(*),
      evidence:decision_case_evidence(*),
      assessments(*),
      decision_record:decision_records(*)
    `
    )
    .eq('id', decisionCaseId)
    .single();
}

/** Get decision cases by land */
export async function getDecisionCasesByLand(
  landId: string,
  status?: string
) {
  let query = supabase
    .from('decision_cases')
    .select('*')
    .eq('land_id', landId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  return await query;
}

/** Update decision case status */
export async function updateDecisionCaseStatus(
  decisionCaseId: string,
  status: string
) {
  return await supabase
    .from('decision_cases')
    .update({ status })
    .eq('id', decisionCaseId)
    .select()
    .single();
}

// ===================================
// 5. EXTERNAL SOURCE CACHE (BMKG)
// ===================================

/** Check cache for recent BMKG data */
export async function getBmkgCacheEntry(adm4Code: string) {
  return await supabase
    .from('external_source_cache')
    .select('*')
    .eq('source_name', 'BMKG')
    .eq('adm4_code', adm4Code)
    .gt('expires_at', new Date().toISOString()) // not expired
    .order('fetched_at', { ascending: false })
    .limit(1)
    .single();
}

/** Store raw BMKG response */
export async function cacheBmkgResponse(cache: {
  source_name: string;
  request_key: string;
  adm4_code: string;
  raw_payload: Record<string, any>;
  observed_at?: string;
  expires_at: string;
  status: string;
}) {
  return await supabase
    .from('external_source_cache')
    .insert(cache)
    .select()
    .single();
}

// ===================================
// 6. EVIDENCE
// ===================================

/** Add evidence to decision case */
export async function addEvidence(evidence: {
  decision_case_id: string;
  type: string;
  source: string;
  payload: Record<string, any>;
  observed_at?: string;
  is_mock?: boolean;
}) {
  const { data, error } = await supabase
    .from('decision_case_evidence')
    .insert(evidence)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Get all evidence for decision case */
export async function getEvidenceForDecisionCase(decisionCaseId: string) {
  return await supabase
    .from('decision_case_evidence')
    .select('*')
    .eq('decision_case_id', decisionCaseId)
    .order('collected_at', { ascending: false });
}

/** Get latest evidence by type */
export async function getLatestEvidenceByType(
  decisionCaseId: string,
  type: string
) {
  return await supabase
    .from('decision_case_evidence')
    .select('*')
    .eq('decision_case_id', decisionCaseId)
    .eq('type', type)
    .order('collected_at', { ascending: false })
    .limit(1)
    .single();
}

// ===================================
// 7. ASSESSMENTS
// ===================================

/** Create assessment */
export async function createAssessment(assessment: {
  decision_case_id: string;
  version: number;
  summary: string;
  basis_strength?: string;
  factors?: string[];
  missing_evidence?: string[];
  limitations?: string[];
}) {
  return await supabase
    .from('assessments')
    .insert(assessment)
    .select()
    .single();
}

/** Get assessment with action options */
export async function getAssessmentWithOptions(assessmentId: string) {
  return await supabase
    .from('assessments')
    .select(
      `
      *,
      options:action_options(
        *
      )
    `
    )
    .eq('id', assessmentId)
    .single();
}

/** Get latest active assessment for decision case */
export async function getLatestAssessment(decisionCaseId: string) {
  return await supabase
    .from('assessments')
    .select('*')
    .eq('decision_case_id', decisionCaseId)
    .eq('status', 'active')
    .order('version', { ascending: false })
    .limit(1)
    .single();
}

// ===================================
// 8. ACTION OPTIONS
// ===================================

/** Create action option */
export async function createActionOption(option: {
  assessment_id: string;
  title: string;
  description?: string;
  rationale?: string;
  display_order: number;
}) {
  return await supabase
    .from('action_options')
    .insert(option)
    .select()
    .single();
}

/** Batch create action options */
export async function createActionOptions(
  assessmentId: string,
  options: Array<{
    title: string;
    description?: string;
    rationale?: string;
    display_order: number;
  }>
) {
  const withAssessmentId = options.map((opt) => ({
    ...opt,
    assessment_id: assessmentId,
  }));

  return await supabase
    .from('action_options')
    .insert(withAssessmentId)
    .select();
}

// ===================================
// 9. DECISION RECORDS (IMMUTABLE)
// ===================================

/** Record final human decision */
export async function recordDecision(decision: {
  decision_case_id: string;
  decided_by: string;
  assessment_id: string;
  selected_action_option_id?: string | null;
  decision_type: string;
  decision_text: string;
  reason?: string;
}) {
  const { data, error } = await supabase
    .from('decision_records')
    .insert(decision)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to record decision: ${error.message}`);
  }

  // Update decision case status to 'decided'
  await supabase
    .from('decision_cases')
    .update({ status: 'decided', closed_at: new Date().toISOString() })
    .eq('id', decision.decision_case_id);

  return data;
}

/** Get decision record */
export async function getDecisionRecord(decisionCaseId: string) {
  return await supabase
    .from('decision_records')
    .select('*')
    .eq('decision_case_id', decisionCaseId)
    .single();
}

// ===================================
// 10. DECISION RECORD EVIDENCE LINK
// ===================================

/** Link evidence to decision record (audit trail) */
export async function linkEvidenceToDecision(
  decisionRecordId: string,
  evidenceIds: string[]
) {
  const links = evidenceIds.map((evidenceId) => ({
    decision_record_id: decisionRecordId,
    evidence_id: evidenceId,
  }));

  return await supabase
    .from('decision_record_evidence')
    .insert(links);
}

/** Get evidence linked to decision (audit trail) */
export async function getDecisionEvidence(decisionRecordId: string) {
  return await supabase
    .from('decision_record_evidence')
    .select(
      `
      evidence_id,
      evidence:decision_case_evidence(*)
    `
    )
    .eq('decision_record_id', decisionRecordId);
}

// ===================================
// 11. DECISION BRIEFS
// ===================================

/** Create decision brief (shareable output) */
export async function createDecisionBrief(brief: {
  decision_record_id: string;
  template_version?: string;
  content: string;
}) {
  return await supabase
    .from('decision_briefs')
    .insert(brief)
    .select()
    .single();
}

/** Get decision brief */
export async function getDecisionBrief(decisionRecordId: string) {
  return await supabase
    .from('decision_briefs')
    .select('*')
    .eq('decision_record_id', decisionRecordId)
    .single();
}

// ===================================
// 12. COMPLETE WORKFLOW HELPER
// ===================================

/**
 * End-to-end: Evidence → Assessment → Decision → Brief
 * Used in demo/integration tests
 */
export async function completeDecisionWorkflow(params: {
  decisionCaseId: string;
  decidedById: string;
  assessmentId: string;
  selectedOptionId?: string | null;
  decisionText: string;
  reason?: string;
  decisionBriefContent: string;
  evidenceIds: string[];
}) {
  try {
    // 1. Record the decision
    const decision = await recordDecision({
      decision_case_id: params.decisionCaseId,
      decided_by: params.decidedById,
      assessment_id: params.assessmentId,
      selected_action_option_id: params.selectedOptionId,
      decision_type: params.selectedOptionId ? 'selected_option' : 'custom',
      decision_text: params.decisionText,
      reason: params.reason,
    });

    // 2. Link evidence to decision for audit trail
    await linkEvidenceToDecision(decision.id, params.evidenceIds);

    // 3. Create decision brief
    const brief = await createDecisionBrief({
      decision_record_id: decision.id,
      template_version: '1.0',
      content: params.decisionBriefContent,
    });

    return {
      success: true,
      decisionRecord: decision,
      decisionBrief: brief,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ===================================
// 13. DEMO DATA HELPERS (M2 fixture scenarios)
// ===================================

/** Load DEMO-WATER-01: Happy path */
export async function loadDemoWater01(userId: string, profileId: string) {
  // Create land
  const land = await createLand({
    owner_id: profileId,
    name: 'Blok Tirto A3',
    latitude: -6.9271,
    longitude: 110.4305,
    adm4_code: '3401060030',
  });

  // Update with resolved location
  await updateLandLocation(land.id, {
    adm4_code: '3401060030',
    province: 'Jawa Tengah',
    regency: 'Sleman',
    district: 'Kalasan',
    village: 'Purwomartani',
    location_source: 'manual',
    location_resolved_at: new Date().toISOString(),
  });

  // Create crop
  const crop = await createCropContext({
    land_id: land.id,
    crop_name: 'Padi Inpari 32',
    variety_name: 'Inpari 32',
    growth_stage: 'vegetative',
    planting_date: '2026-08-15',
  });

  // Create decision case
  const decisionCase = await createDecisionCase({
    land_id: land.id,
    crop_context_id: crop.id,
    created_by: profileId,
    decision_type: 'water_condition',
  });

  // Add BMKG evidence (mock)
  const bmkgEvidence = await addEvidence({
    decision_case_id: decisionCase.id,
    type: 'bmkg_forecast',
    source: 'BMKG',
    payload: {
      temperature: 24,
      humidity: 85,
      condition: 'cloudy',
      rainfall_mm: 2.5,
    },
    is_mock: true,
  });

  // Add field pulse evidence (mock)
  const fieldEvidence = await addEvidence({
    decision_case_id: decisionCase.id,
    type: 'field_pulse',
    source: 'Manual',
    payload: {
      water_presence: 'limited',
      irrigation: 'not_flowing',
      soil_moisture: 'dry',
    },
    is_mock: true,
  });

  return {
    land,
    crop,
    decisionCase,
    evidence: [bmkgEvidence, fieldEvidence],
  };
}
