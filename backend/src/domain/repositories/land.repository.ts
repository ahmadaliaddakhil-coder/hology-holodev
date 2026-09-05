/**
 * Land Repository
 * Data access for land/parcel objects
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import type { Land, CreateLandInput, UpdateLandInput } from '../types.js';

export class LandRepository extends BaseRepository<Land> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'lands');
  }

  /**
   * Get all lands owned by a user
   */
  async getByOwnerId(ownerId: string, excludeArchived = true): Promise<Land[]> {
    let query = this.supabase
      .from('lands')
      .select('*')
      .eq('owner_id', ownerId);

    if (excludeArchived) {
      query = query.is('archived_at', null);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get land with active crop context
   */
  async getWithActiveCrop(id: string): Promise<Land & { active_crop?: any } | null> {
    const { data, error } = await this.supabase
      .from('lands')
      .select(`
        *,
        active_crop:crop_contexts(*)
      `)
      .eq('id', id)
      .eq('crop_contexts.is_active', true)
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
   * Get lands by administrative code
   */
  async getByAdm4Code(adm4Code: string): Promise<Land[]> {
    return await this.getAll({ adm4_code: adm4Code, archived_at: null });
  }

  /**
   * Create new land
   */
  async createLand(ownerId: string, input: CreateLandInput): Promise<Land> {
    return await this.create({
      ...input,
      owner_id: ownerId,
    } as unknown as Partial<Land>);
  }

  /**
   * Update land details
   */
  async updateLand(id: string, input: UpdateLandInput): Promise<Land> {
    return await this.update(id, input);
  }

  async getByIdIncludingArchived(id: string): Promise<Land | null> {
    return await this.getById(id);
  }

  /**
   * Resolve location (set adm4_code and location metadata)
   */
  async resolveLocation(
    id: string,
    adm4Code: string,
    locationData: {
      province: string;
      regency: string;
      district: string;
      village: string;
      location_source: string;
    }
  ): Promise<Land> {
    return await this.update(id, {
      adm4_code: adm4Code,
      location_resolved_at: new Date().toISOString(),
      ...locationData,
    } as unknown as Partial<Land>);
  }

  /**
   * Archive land (soft delete)
   */
  async archiveLand(id: string): Promise<Land> {
    return await this.update(id, {
      archived_at: new Date().toISOString(),
    } as unknown as Partial<Land>);
  }

  /**
   * Unarchive land
   */
  async unarchiveLand(id: string): Promise<Land> {
    return await this.update(id, {
      archived_at: null,
    } as unknown as Partial<Land>);
  }

  /**
   * Get land count by owner
   */
  async countByOwner(ownerId: string, excludeArchived = true): Promise<number> {
    let query = this.supabase
      .from('lands')
      .select('*', { count: 'exact' })
      .eq('owner_id', ownerId);

    if (excludeArchived) {
      query = query.is('archived_at', null);
    }

    const { count, error } = await query;

    if (error) throw error;
    return count ?? 0;
  }
}
