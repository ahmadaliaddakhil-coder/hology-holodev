import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import type {
  CreateTrustedReviewInput,
  TrustedReview,
  TrustedReviewStatus,
} from '../types.js';

export class TrustedReviewRepository extends BaseRepository<TrustedReview> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'trusted_reviews');
  }

  public async getByDecisionCaseId(decisionCaseId: string): Promise<TrustedReview[]> {
    return this.getAll({ decision_case_id: decisionCaseId });
  }

  public async getByReviewer(reviewerId: string): Promise<TrustedReview[]> {
    return this.getAll({ reviewer_id: reviewerId });
  }

  public async getByStatus(status: TrustedReviewStatus): Promise<TrustedReview[]> {
    return this.getAll({ status });
  }

  public async submitReview(input: CreateTrustedReviewInput): Promise<TrustedReview> {
    return this.create({
      ...input,
      responded_at: new Date().toISOString(),
    } as Partial<TrustedReview>);
  }

  public async countPending(): Promise<number> {
    return this.count({ responded_at: null });
  }
}
