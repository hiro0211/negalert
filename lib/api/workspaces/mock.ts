/**
 * Workspace API - モック環境実装
 * モックモードでもSupabaseから実データを取得
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { Workspace, GoogleLocation } from '../types';
import { WorkspacesApi } from './types';

/**
 * モック環境用Workspace API実装
 * 注: モックモードでもSupabaseから実データを取得します
 */
export const MockWorkspacesApi: WorkspacesApi = {
  async syncWorkspaces(
    userId: string,
    locations: GoogleLocation[],
    supabase: SupabaseClient
  ): Promise<number> {
    if (locations.length === 0) {
      return 0;
    }
    
    // UPSERTするデータを準備
    const workspacesData = locations.map(location => ({
      user_id: userId,
      google_location_id: location.locationId,
      name: location.name,
      updated_at: new Date().toISOString(),
    }));
    
    // workspacesテーブルにUPSERT
    const { data, error } = await supabase
      .from('workspaces')
      .upsert(workspacesData, {
        onConflict: 'user_id,google_location_id',
        ignoreDuplicates: false,
      })
      .select();
    
    if (error) {
      throw new Error(`Workspaceの同期に失敗しました: ${error.message}`);
    }
    
    const syncedCount = data?.length || 0;
    return syncedCount;
  },

  async getWorkspaces(userId: string, supabase: SupabaseClient): Promise<Workspace[]> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Workspaceの取得に失敗しました: ${error.message}`);
    }
    
    return data || [];
  },

  async getWorkspace(workspaceId: string, supabase: SupabaseClient): Promise<Workspace | null> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspaceId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Workspaceの取得に失敗しました: ${error.message}`);
    }
    
    return data;
  },

  async deleteWorkspace(
    workspaceId: string,
    userId: string,
    supabase: SupabaseClient
  ): Promise<void> {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', workspaceId)
      .eq('user_id', userId);
    
    if (error) {
      throw new Error(`Workspaceの削除に失敗しました: ${error.message}`);
    }
  },
};
