/**
 * Decision Record Repository
 * Data access for decision records (immutable final decisions)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import type { DecisionRecord, DecisionType, CreateDecisionRecordInput } from '../types.js';

export class DecisionRecordRepository extends BaseRepository<DecisionRecord> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'decision_records');
  }

  /**
   * Get decision record by decision case ID
   */
  async getByDecisionCaseId(decisionCaseId: string): Promise<DecisionRecord | null> {
    const { data, error } = await this.supabase
      .from('decision_records')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
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
   * Get decision record with full context
   */
  async getWithContext(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('decision_records')
      .select(
        `
        *,
        decided_by:profiles(*),
        assessment:assessments(*),
        selected_action_option:action_options(*),
        decision_case:decision_cases(*),
        evidence:decision_record_evidence(
          evidence_id,
          evidence:decision_case_evidence(*)
        ),
        brief:decision_briefs(*)
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
   * Create decision record (immutable)
   */
  async createDecision(input: CreateDecisionRecordInput): Promise<DecisionRecord> {
    // Verify decision case doesn't already have a record
    const existing = await this.getByDecisionCaseId(input.decision_case_id);
    if (existing) {
      throw new Error(`Decision case ${input.decision_case_id} already has a decision record`);
    }

    return await this.create(input as Partial<DecisionRecord>);
  }

  /**
   * Get decisions by creator
   */
  async getByDecidedBy(profileId: string): Promise<DecisionRecord[]> {
    const { data, error } = await this.supabase
      .from('decision_records')
      .select('*')
      .eq('decided_by', profileId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get decisions by type
   */
  async getByDecisionType(type: DecisionType): Promise<DecisionRecord[]> {
    const { data, error } = await this.supabase
      .from('decision_records')
      .select('*')
      .eq('decision_type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get recent decisions
   */
  async getRecent(limit = 20): Promise<DecisionRecord[]> {
    const { data, error } = await this.supabase
      .from('decision_records')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Count decisions by type
   */
  async countByType(type: DecisionType): Promise<number> {
    return await this.count({ decision_type: type });
  }

  /**
   * Count decisions by decided_by
   */
  async countByDecider(profileId: string): Promise<number> {
    return await this.count({ decided_by: profileId });
  }

  /**
   * Get decisions from specific assessment
   */
  async getByAssessmentId(assessmentId: string): Promise<DecisionRecord[]> {
    const { data, error } = await this.supabase
      .from('decision_records')
      .select('*')
      .eq('assessment_id', assessmentId);

    if (error) throw error;
    return data || [];
  }

  /**
   * Check if decision exists for case
   */
  async existsForCase(decisionCaseId: string): Promise<boolean> {
    const record = await this.getByDecisionCaseId(decisionCaseId);
    return record !== null;
  }

  /**
   * Get decision with selected option info
   */
  async getWithSelectedOption(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('decision_records')
      .select(
        `
        *,
        selected_option:action_options(*)
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
   * Get decisions with linked evidence
   */
  async getWithEvidence(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('decision_records')
      .select(
        `
        *,
        linked_evidence:decision_record_evidence(
          evidence_id,
          evidence:decision_case_evidence(*)
        )
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

  async linkEvidence(decisionRecordId: string, evidenceIds: string[]): Promise<void> {
    if (evidenceIds.length === 0) return;

    const links = evidenceIds.map((evidenceId) => ({
      decision_record_id: decisionRecordId,
      evidence_id: evidenceId,
    }));
    const { error } = await this.supabase
      .from('decision_record_evidence')
      .upsert(links, { onConflict: 'decision_record_id,evidence_id' });

    if (error) throw error;
  }

  /**
   * Get decisions made in date range
   */
  async getByDateRange(startDate: string, endDate: string): Promise<DecisionRecord[]> {
    const { data, error } = await this.supabase
      .from('decision_records')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * IMMUTABLE: Decision records cannot be updated or deleted
   */
  async update(): Promise<never> {
    throw new Error('Decision records are immutable and cannot be updated');
  }

  async delete(): Promise<never> {
    throw new Error('Decision records cannot be deleted');
  }
}
