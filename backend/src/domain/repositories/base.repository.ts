/**
 * Base Repository Class
 * Abstract base for all repositories with common CRUD operations
 */

import { SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseRepository<T> {
  protected supabase: any;

  constructor(
    supabase: SupabaseClient,
    protected tableName: string
  ) {
    this.supabase = supabase;
  }

  /**
   * Get single record by ID
   */
  async getById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw error;
    }

    return data;
  }

  /**
   * Get all records with optional filters
   */
  async getAll(filters?: Record<string, any>): Promise<T[]> {
    let query = this.supabase.from(this.tableName).select('*');

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Create new record
   */
  async create(data: Partial<T>): Promise<T> {
    const response = await (this.supabase as any)
      .from(this.tableName)
      .insert([data] as unknown as never)
      .select()
      .single();
    const result = response.data as T;
    const error = response.error as Error | null;

    if (error) throw error;
    return result;
  }

  /**
   * Update record
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    const response = await (this.supabase as any)
      .from(this.tableName)
      .update(data as unknown as never)
      .eq('id', id)
      .select()
      .single();
    const result = response.data as T;
    const error = response.error as Error | null;

    if (error) throw error;
    return result;
  }

  /**
   * Delete record
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Check if record exists
   */
  async exists(id: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .eq('id', id);

    if (error) throw error;
    return (count ?? 0) > 0;
  }

  /**
   * Count records with optional filters
   */
  async count(filters?: Record<string, any>): Promise<number> {
    let query = this.supabase.from(this.tableName).select('*', { count: 'exact' });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { count, error } = await query;

    if (error) throw error;
    return count ?? 0;
  }
}
