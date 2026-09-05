/**
 * Action Option Repository
 * Data access for action options from assessments
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import type { ActionOption, CreateActionOptionInput } from '../types.js';

export class ActionOptionRepository extends BaseRepository<ActionOption> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'action_options');
  }

  /**
   * Get all options for an assessment
   */
  async getByAssessmentId(assessmentId: string): Promise<ActionOption[]> {
    const { data, error } = await this.supabase
      .from('action_options')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create action option
   */
  async createOption(input: CreateActionOptionInput): Promise<ActionOption> {
    return await this.create(input as Partial<ActionOption>);
  }

  /**
   * Create multiple options at once
   */
  async createOptions(
    assessmentId: string,
    options: Array<Omit<CreateActionOptionInput, 'assessment_id'>>
  ): Promise<ActionOption[]> {
    const withAssessmentId = options.map((opt, index) => ({
      ...opt,
      assessment_id: assessmentId,
      display_order: opt.display_order ?? index,
    }));

    const { data, error } = await this.supabase
      .from('action_options')
      .insert(withAssessmentId)
      .select();

    if (error) throw error;
    return data || [];
  }

  /**
   * Update option
   */
  async updateOption(id: string, title: string, description?: string): Promise<ActionOption> {
    return await this.update(id, {
      title,
      description,
    } as Partial<ActionOption>);
  }

  /**
   * Reorder options
   */
  async reorder(assessmentId: string, orderMap: Record<string, number>): Promise<void> {
    for (const [optionId, order] of Object.entries(orderMap)) {
      await this.update(optionId, {
        display_order: order,
      } as Partial<ActionOption>);
    }
  }

  /**
   * Count options for assessment
   */
  async countByAssessment(assessmentId: string): Promise<number> {
    return await this.count({ assessment_id: assessmentId });
  }

  /**
   * Check if assessment has options
   */
  async hasOptions(assessmentId: string): Promise<boolean> {
    const count = await this.countByAssessment(assessmentId);
    return count > 0;
  }

  /**
   * Delete all options for an assessment
   */
  async deleteByAssessment(assessmentId: string): Promise<void> {
    const { error } = await this.supabase
      .from('action_options')
      .delete()
      .eq('assessment_id', assessmentId);

    if (error) throw error;
  }

  /**
   * Get option by ID
   */
  async getOptionById(id: string): Promise<ActionOption | null> {
    return await this.getById(id);
  }

  /**
   * Get most popular options across assessments
   */
  async getMostUsed(limit = 10): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('action_options')
      .select('title, COUNT(*) as usage_count', { count: 'exact' })
      .order('usage_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}
