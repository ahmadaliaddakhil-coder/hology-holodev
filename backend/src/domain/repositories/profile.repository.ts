/**
 * Profile Repository
 * Data access for user profiles
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import type { Profile, CreateProfileInput, UpdateProfileInput } from '../types.js';

export class ProfileRepository extends BaseRepository<Profile> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'profiles');
  }

  /**
   * Get profile by user ID
   */
  async getByUserId(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
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
   * Create profile for new user
   */
  async createForUser(userId: string, input: CreateProfileInput): Promise<Profile> {
    return await this.create({
      ...input,
      user_id: userId,
    } as Partial<Profile>);
  }

  /**
   * Update profile
   */
  async updateProfile(id: string, input: UpdateProfileInput): Promise<Profile> {
    return await this.update(id, input);
  }

  /**
   * Get profiles by role
   */
  async getByRole(role: string): Promise<Profile[]> {
    return await this.getAll({ role });
  }

  /**
   * Check if profile exists for user
   */
  async existsForUser(userId: string): Promise<boolean> {
    const profile = await this.getByUserId(userId);
    return profile !== null;
  }
}
