/**
 * Assessment Repository
 * Data access for assessments (reasoning output)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import type {
  Assessment,
  AssessmentStatus,
  BasisStrength,
  CreateAssessmentInput,
} from '../types.js';

export class AssessmentRepository extends BaseRepository<Assessment> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'assessments');
  }

  /**
   * Get assessment with action options
   */
  async getWithOptions(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('assessments')
      .select(
        `
        *,
        options:action_options(*)
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  }

  /**
   * Get all assessments for a decision case
   */
  async getByDecisionCaseId(decisionCaseId: string): Promise<Assessment[]> {
    const { data, error } = await this.supabase
      .from('assessments')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
      .order('version', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get latest/active assessment for a decision case
   */
  async getLatestActive(decisionCaseId: string): Promise<Assessment | null> {
    const { data, error } = await this.supabase
      .from('assessments')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
      .eq('status', 'active')
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  }

  /**
   * Get assessment by version
   */
  async getByVersion(decisionCaseId: string, version: number): Promise<Assessment | null> {
    const { data, error } = await this.supabase
      .from('assessments')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
      .eq('version', version)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  }

  /**
   * Create assessment
   */
  async createAssessment(input: CreateAssessmentInput): Promise<Assessment> {
    return await this.create(input as Partial<Assessment>);
  }

  /**
   * Update assessment
   */
  async updateAssessment(id: string, status: AssessmentStatus): Promise<Assessment> {
    return await this.update(id, {
      status,
    } as Partial<Assessment>);
  }

  /**
   * Set assessment as active (supersedes previous)
   */
  async setActive(id: string): Promise<Assessment> {
    // Get the assessment
    const assessment = await this.getById(id);
    if (!assessment) {
      throw new Error(`Assessment ${id} not found`);
    }

    // Supersede all other assessments for this decision case
    const allAssessments = await this.getByDecisionCaseId(assessment.decision_case_id);
    for (const other of allAssessments) {
      if (other.id !== id && other.status === 'active') {
        await this.updateAssessment(other.id, 'superseded');
      }
    }

    // Set this as active
    return await this.updateAssessment(id, 'active');
  }

  /**
   * Get assessments by basis strength
   */
  async getByBasisStrength(decisionCaseId: string, strength: BasisStrength): Promise<Assessment[]> {
    const { data, error } = await this.supabase
      .from('assessments')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
      .eq('basis_strength', strength);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get assessments by rule version
   */
  async getByRuleVersion(ruleVersion: string): Promise<Assessment[]> {
    const { data, error } = await this.supabase
      .from('assessments')
      .select('*')
      .eq('rule_version', ruleVersion)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get latest assessment versions (one per decision case)
   */
  async getLatestVersions(limit = 20): Promise<Assessment[]> {
    const { data, error } = await this.supabase
      .from('assessments')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Count active assessments
   */
  async countActive(): Promise<number> {
    return await this.count({ status: 'active' });
  }

  /**
   * Get next version number for decision case
   */
  async getNextVersion(decisionCaseId: string): Promise<number> {
    const assessments = await this.getByDecisionCaseId(decisionCaseId);
    if (assessments.length === 0) {
      return 1;
    }
    const maxVersion = Math.max(...assessments.map((a) => a.version));
    return maxVersion + 1;
  }

  async linkEvidence(assessmentId: string, evidenceIds: string[]): Promise<void> {
    if (evidenceIds.length === 0) return;
    const links = evidenceIds.map((evidenceId) => ({
      assessment_id: assessmentId,
      evidence_id: evidenceId,
    }));
    const { error } = await this.supabase
      .from('assessment_evidence')
      .upsert(links, { onConflict: 'assessment_id,evidence_id' });
    if (error) throw error;
  }
}
