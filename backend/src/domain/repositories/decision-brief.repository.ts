/**
 * Decision Brief Repository
 * Data access for decision briefs (shareable output)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import type { DecisionBrief, CreateDecisionBriefInput } from '../types.js';

export class DecisionBriefRepository extends BaseRepository<DecisionBrief> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'decision_briefs');
  }

  /**
   * Get brief by decision record ID
   */
  async getByDecisionRecordId(decisionRecordId: string): Promise<DecisionBrief | null> {
    const { data, error } = await this.supabase
      .from('decision_briefs')
      .select('*')
      .eq('decision_record_id', decisionRecordId)
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
   * Get brief with full decision context
   */
  async getWithDecisionContext(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('decision_briefs')
      .select(
        `
        *,
        decision_record:decision_records(
          *,
          decision_case:decision_cases(*),
          assessment:assessments(*)
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

  /**
   * Create brief
   */
  async createBrief(input: CreateDecisionBriefInput): Promise<DecisionBrief> {
    // Verify decision record exists
    const { data: decisionRecord, error: drError } = await this.supabase
      .from('decision_records')
      .select('id')
      .eq('id', input.decision_record_id)
      .single();

    if (drError || !decisionRecord) {
      throw new Error(`Decision record ${input.decision_record_id} not found`);
    }

    // Check if brief already exists
    const existing = await this.getByDecisionRecordId(input.decision_record_id);
    if (existing) {
      throw new Error(`Brief already exists for decision record ${input.decision_record_id}`);
    }

    return await this.create(input as Partial<DecisionBrief>);
  }

  /**
   * Update brief content
   */
  async updateContent(id: string, content: string): Promise<DecisionBrief> {
    return await this.update(id, {
      content,
    } as Partial<DecisionBrief>);
  }

  /**
   * Get briefs by template version
   */
  async getByTemplateVersion(version: string): Promise<DecisionBrief[]> {
    const { data, error } = await this.supabase
      .from('decision_briefs')
      .select('*')
      .eq('template_version', version)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get recent briefs
   */
  async getRecent(limit = 20): Promise<DecisionBrief[]> {
    const { data, error } = await this.supabase
      .from('decision_briefs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Search briefs by content
   */
  async searchContent(query: string): Promise<DecisionBrief[]> {
    // Basic text search in content field
    const { data, error } = await this.supabase
      .from('decision_briefs')
      .select('*')
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Count briefs by template version
   */
  async countByVersion(version: string): Promise<number> {
    return await this.count({ template_version: version });
  }

  /**
   * Get briefs created in date range
   */
  async getByDateRange(startDate: string, endDate: string): Promise<DecisionBrief[]> {
    const { data, error } = await this.supabase
      .from('decision_briefs')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Check if brief exists for decision
   */
  async existsForDecision(decisionRecordId: string): Promise<boolean> {
    const brief = await this.getByDecisionRecordId(decisionRecordId);
    return brief !== null;
  }
}
