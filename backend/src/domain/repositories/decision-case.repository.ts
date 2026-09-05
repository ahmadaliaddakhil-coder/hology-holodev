/**
 * Decision Case Repository
 * Data access for decision case (decision-making sessions)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import type {
  DecisionCase,
  DecisionCaseStatus,
  CreateDecisionCaseInput,
  UpdateDecisionCaseInput,
} from '../types.js';

export class DecisionCaseRepository extends BaseRepository<DecisionCase> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'decision_cases');
  }

  /**
   * Get decision case with full context
   * Includes: land, crop, evidence, assessment, options, decision, brief
   */
  async getWithContext(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('decision_cases')
      .select(
        `
        *,
        land:lands(*),
        crop_context:crop_contexts(*),
        created_by_profile:profiles(*),
        evidence:decision_case_evidence(*),
        assessments(*),
        decision_record:decision_records(*)
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
   * Get all decision cases for a land
   */
  async getByLandId(
    landId: string,
    status?: DecisionCaseStatus,
    excludeClosed = false
  ): Promise<DecisionCase[]> {
    let query = this.supabase
      .from('decision_cases')
      .select('*')
      .eq('land_id', landId);

    if (status) {
      query = query.eq('status', status);
    }

    if (excludeClosed) {
      query = query.is('closed_at', null);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get decision cases by creator
   */
  async getByCreator(profileId: string): Promise<DecisionCase[]> {
    const { data, error } = await this.supabase
      .from('decision_cases')
      .select('*')
      .eq('created_by', profileId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByOwnerId(ownerId: string): Promise<DecisionCase[]> {
    const { data, error } = await this.supabase
      .from('decision_cases')
      .select('*, land:lands!inner(*)')
      .eq('land.owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get decision cases by type
   */
  async getByType(decisionType: string): Promise<DecisionCase[]> {
    const { data, error } = await this.supabase
      .from('decision_cases')
      .select('*')
      .eq('decision_type', decisionType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create new decision case
   */
  async createCase(input: CreateDecisionCaseInput): Promise<DecisionCase> {
    return await this.create(input as Partial<DecisionCase>);
  }

  /**
   * Update decision case
   */
  async updateCase(id: string, input: UpdateDecisionCaseInput): Promise<DecisionCase> {
    return await this.update(id, input);
  }

  /**
   * Update status
   */
  async updateStatus(id: string, status: DecisionCaseStatus): Promise<DecisionCase> {
    return await this.update(id, {
      status,
      updated_at: new Date().toISOString(),
    } as Partial<DecisionCase>);
  }

  /**
   * Close decision case
   */
  async closeCase(id: string): Promise<DecisionCase> {
    return await this.update(id, {
      status: 'decided',
      closed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Partial<DecisionCase>);
  }

  /**
   * Get active decision cases (not yet decided)
   */
  async getActive(): Promise<DecisionCase[]> {
    const { data, error } = await this.supabase
      .from('decision_cases')
      .select('*')
      .neq('status', 'decided')
      .is('closed_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get decided cases
   */
  async getDecided(limit = 20): Promise<DecisionCase[]> {
    const { data, error } = await this.supabase
      .from('decision_cases')
      .select('*')
      .eq('status', 'decided')
      .order('closed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Count by status
   */
  async countByStatus(status: DecisionCaseStatus): Promise<number> {
    return await this.count({ status });
  }

  /**
   * Get case by crop context (usually latest/active)
   */
  async getByCropContextId(cropContextId: string): Promise<DecisionCase[]> {
    return await this.getAll({ crop_context_id: cropContextId });
  }

  /**
   * Get pending review cases
   */
  async getPendingReview(): Promise<DecisionCase[]> {
    const { data, error } = await this.supabase
      .from('decision_cases')
      .select('*')
      .eq('status', 'review_pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
