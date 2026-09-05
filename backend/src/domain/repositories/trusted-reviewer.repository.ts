import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import type { CreateTrustedReviewerInput, TrustedReviewer } from '../types.js';

export class TrustedReviewerRepository extends BaseRepository<TrustedReviewer> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'trusted_reviewers');
  }

  public async getByOwnerId(ownerId: string): Promise<TrustedReviewer[]> {
    return this.getAll({ owner_id: ownerId });
  }

  public async createReviewer(input: CreateTrustedReviewerInput): Promise<TrustedReviewer> {
    return this.create(input);
  }

  public async getByRole(role: string): Promise<TrustedReviewer[]> {
    return this.getAll({ role });
  }

  public async countByOwner(ownerId: string): Promise<number> {
    return this.count({ owner_id: ownerId });
  }
}
