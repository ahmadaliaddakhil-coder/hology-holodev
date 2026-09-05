/**
 * Crop Context Repository
 * Data access for crop context (seasonal crop information)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository.js';
import type { CropContext, CreateCropContextInput, UpdateCropContextInput } from '../types.js';

export class CropContextRepository extends BaseRepository<CropContext> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'crop_contexts');
  }

  /**
   * Get active crop for a land
   */
  async getActiveCrop(landId: string): Promise<CropContext | null> {
    const { data, error } = await this.supabase
      .from('crop_contexts')
      .select('*')
      .eq('land_id', landId)
      .eq('is_active', true)
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
   * Get all crops for a land (historical)
   */
  async getByLandId(landId: string): Promise<CropContext[]> {
    return await this.getAll({ land_id: landId });
  }

  /**
   * Create new crop context
   * Automatically deactivates previous active crop
   */
  async createCrop(landId: string, input: CreateCropContextInput): Promise<CropContext> {
    // Deactivate previous active crop
    const activeCrop = await this.getActiveCrop(landId);
    if (activeCrop) {
      await this.update(activeCrop.id, { is_active: false } as Partial<CropContext>);
    }

    // Create new crop
    return await this.create({
      ...input,
      land_id: landId,
      is_active: true,
    } as Partial<CropContext>);
  }

  /**
   * Update crop context
   */
  async updateCrop(id: string, input: UpdateCropContextInput): Promise<CropContext> {
    return await this.update(id, input);
  }

  /**
   * Set crop as active (deactivates others)
   */
  async setActive(id: string): Promise<CropContext> {
    // Get the crop to find land_id
    const crop = await this.getById(id);
    if (!crop) {
      throw new Error(`Crop context ${id} not found`);
    }

    // Deactivate all other crops for this land
    const allCrops = await this.getByLandId(crop.land_id);
    for (const otherCrop of allCrops) {
      if (otherCrop.id !== id) {
        await this.update(otherCrop.id, { is_active: false } as Partial<CropContext>);
      }
    }

    // Activate this crop
    return await this.update(id, { is_active: true } as Partial<CropContext>);
  }

  /**
   * Get crop by growth stage
   */
  async getByGrowthStage(landId: string, growthStage: string): Promise<CropContext[]> {
    const { data, error } = await this.supabase
      .from('crop_contexts')
      .select('*')
      .eq('land_id', landId)
      .eq('growth_stage', growthStage)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get active crop count
   */
  async countActive(): Promise<number> {
    return await this.count({ is_active: true });
  }

  /**
   * Get crops planted in date range
   */
  async getByPlantingDateRange(
    landId: string,
    startDate: string,
    endDate: string
  ): Promise<CropContext[]> {
    const { data, error } = await this.supabase
      .from('crop_contexts')
      .select('*')
      .eq('land_id', landId)
      .gte('planting_date', startDate)
      .lte('planting_date', endDate)
      .order('planting_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
