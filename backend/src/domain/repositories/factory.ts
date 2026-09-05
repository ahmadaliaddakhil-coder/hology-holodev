/**
 * Repository Factory
 * Creates and manages all repository instances with dependency injection
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  ProfileRepository,
  LandRepository,
  CropContextRepository,
  DecisionCaseRepository,
  EvidenceRepository,
  AssessmentRepository,
  ActionOptionRepository,
  DecisionRecordRepository,
  DecisionBriefRepository,
  TrustedReviewerRepository,
  TrustedReviewRepository,
} from './index.js';

export class RepositoryFactory {
  private supabase: SupabaseClient;

  private profileRepository: ProfileRepository;
  private landRepository: LandRepository;
  private cropContextRepository: CropContextRepository;
  private decisionCaseRepository: DecisionCaseRepository;
  private evidenceRepository: EvidenceRepository;
  private assessmentRepository: AssessmentRepository;
  private actionOptionRepository: ActionOptionRepository;
  private decisionRecordRepository: DecisionRecordRepository;
  private decisionBriefRepository: DecisionBriefRepository;
  private trustedReviewerRepository: TrustedReviewerRepository;
  private trustedReviewRepository: TrustedReviewRepository;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;

    // Initialize all repositories
    this.profileRepository = new ProfileRepository(supabase);
    this.landRepository = new LandRepository(supabase);
    this.cropContextRepository = new CropContextRepository(supabase);
    this.decisionCaseRepository = new DecisionCaseRepository(supabase);
    this.evidenceRepository = new EvidenceRepository(supabase);
    this.assessmentRepository = new AssessmentRepository(supabase);
    this.actionOptionRepository = new ActionOptionRepository(supabase);
    this.decisionRecordRepository = new DecisionRecordRepository(supabase);
    this.decisionBriefRepository = new DecisionBriefRepository(supabase);
    this.trustedReviewerRepository = new TrustedReviewerRepository(supabase);
    this.trustedReviewRepository = new TrustedReviewRepository(supabase);
  }

  // Getters for all repositories
  get profiles(): ProfileRepository {
    return this.profileRepository;
  }

  get lands(): LandRepository {
    return this.landRepository;
  }

  get cropContexts(): CropContextRepository {
    return this.cropContextRepository;
  }

  get decisionCases(): DecisionCaseRepository {
    return this.decisionCaseRepository;
  }

  get evidence(): EvidenceRepository {
    return this.evidenceRepository;
  }

  get assessments(): AssessmentRepository {
    return this.assessmentRepository;
  }

  get actionOptions(): ActionOptionRepository {
    return this.actionOptionRepository;
  }

  get decisionRecords(): DecisionRecordRepository {
    return this.decisionRecordRepository;
  }

  get decisionBriefs(): DecisionBriefRepository {
    return this.decisionBriefRepository;
  }

  get trustedReviewers(): TrustedReviewerRepository {
    return this.trustedReviewerRepository;
  }

  get trustedReviews(): TrustedReviewRepository {
    return this.trustedReviewRepository;
  }

  /**
   * Get Supabase client instance
   */
  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }
}

/**
 * Create repository factory instance
 * Usage in Express middleware/handlers:
 *
 * const repos = createRepositoryFactory(supabaseClient);
 * const lands = await repos.lands.getByOwnerId(userId);
 */
export function createRepositoryFactory(supabase: SupabaseClient): RepositoryFactory {
  return new RepositoryFactory(supabase);
}
