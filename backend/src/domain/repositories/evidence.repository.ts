/**
 * Evidence Repository
 * Data access for decision case evidence
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import type {
  DecisionCaseEvidence,
  EvidenceType,
  FreshnessStatus,
  CreateDecisionCaseEvidenceInput,
} from '../types.js';

export class EvidenceRepository extends BaseRepository<DecisionCaseEvidence> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'decision_case_evidence');
  }

  /**
   * Get all evidence for a decision case
   */
  async getByDecisionCaseId(
    decisionCaseId: string,
    sortBy: 'collected_at' | 'created_at' = 'collected_at'
  ): Promise<DecisionCaseEvidence[]> {
    const { data, error } = await this.supabase
      .from('decision_case_evidence')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
      .order(sortBy, { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get latest evidence by type for a decision case
   */
  async getLatestByType(decisionCaseId: string, type: EvidenceType): Promise<DecisionCaseEvidence | null> {
    const { data, error } = await this.supabase
      .from('decision_case_evidence')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
      .eq('type', type)
      .order('collected_at', { ascending: false })
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
   * Get all evidence by type
   */
  async getByType(decisionCaseId: string, type: EvidenceType): Promise<DecisionCaseEvidence[]> {
    const { data, error } = await this.supabase
      .from('decision_case_evidence')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
      .eq('type', type)
      .order('collected_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create evidence
   */
  async createEvidence(input: CreateDecisionCaseEvidenceInput): Promise<DecisionCaseEvidence> {
    return await this.create(input as Partial<DecisionCaseEvidence>);
  }

  /**
   * Get mock evidence (for demo/testing)
   */
  async getMockEvidence(decisionCaseId: string): Promise<DecisionCaseEvidence[]> {
    const { data, error } = await this.supabase
      .from('decision_case_evidence')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
      .eq('is_mock', true);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get fresh evidence
   */
  async getFreshEvidence(decisionCaseId: string): Promise<DecisionCaseEvidence[]> {
    const { data, error } = await this.supabase
      .from('decision_case_evidence')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
      .eq('freshness_status', 'fresh');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get evidence by freshness status
   */
  async getByFreshnessStatus(
    decisionCaseId: string,
    status: FreshnessStatus
  ): Promise<DecisionCaseEvidence[]> {
    const { data, error } = await this.supabase
      .from('decision_case_evidence')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
      .eq('freshness_status', status);

    if (error) throw error;
    return data || [];
  }

  /**
   * Update evidence freshness status
   */
  async updateFreshnessStatus(id: string, status: FreshnessStatus): Promise<DecisionCaseEvidence> {
    return await this.update(id, {
      freshness_status: status,
    } as Partial<DecisionCaseEvidence>);
  }

  /**
   * Count evidence by type for decision case
   */
  async countByType(decisionCaseId: string, type: EvidenceType): Promise<number> {
    const { count, error } = await this.supabase
      .from('decision_case_evidence')
      .select('*', { count: 'exact' })
      .eq('decision_case_id', decisionCaseId)
      .eq('type', type);

    if (error) throw error;
    return count ?? 0;
  }

  /**
   * Get evidence by source
   */
  async getBySource(decisionCaseId: string, source: string): Promise<DecisionCaseEvidence[]> {
    const { data, error } = await this.supabase
      .from('decision_case_evidence')
      .select('*')
      .eq('decision_case_id', decisionCaseId)
      .eq('source', source);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get all evidence types collected for a decision case
   */
  async getTypes(decisionCaseId: string): Promise<EvidenceType[]> {
    const evidence = await this.getByDecisionCaseId(decisionCaseId);
    const types = new Set(evidence.map((e) => e.type as EvidenceType));
    return Array.from(types);
  }

  /**
   * Check if evidence type exists
   */
  async hasEvidenceType(decisionCaseId: string, type: EvidenceType): Promise<boolean> {
    const count = await this.countByType(decisionCaseId, type);
    return count > 0;
  }
}
