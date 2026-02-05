/**
 * Workspace API - 本番環境実装
 * Supabaseのworkspacesテーブルを使用
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { Workspace, GoogleLocation } from '../types';
import { WorkspacesApi } from './types';

/**
 * 本番環境用Workspace API実装
 */
export const ProductionWorkspacesApi: WorkspacesApi = {
  /**
   * Google店舗情報をworkspacesテーブルに同期（UPSERT）
   */
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
    // ユニーク制約: (user_id, google_location_id)
    const { data, error } = await supabase
      .from('workspaces')
      .upsert(workspacesData, {
        onConflict: 'user_id,google_location_id',
        ignoreDuplicates: false, // 既存レコードを更新
      })
      .select();
    
    if (error) {
      throw new Error(`Workspaceの同期に失敗しました: ${error.message}`);
    }
    
    const syncedCount = data?.length || 0;
    return syncedCount;
  },

  /**
   * ユーザーのワークスペース一覧を取得
   */
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

  /**
   * 特定のワークスペースを取得
   */
  async getWorkspace(workspaceId: string, supabase: SupabaseClient): Promise<Workspace | null> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspaceId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // レコードが見つからない場合
        return null;
      }
      throw new Error(`Workspaceの取得に失敗しました: ${error.message}`);
    }
    
    return data;
  },

  /**
   * ワークスペースを削除
   */
  async deleteWorkspace(
    workspaceId: string,
    userId: string,
    supabase: SupabaseClient
  ): Promise<void> {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', workspaceId)
      .eq('user_id', userId); // 自分のワークスペースのみ削除可能
    
    if (error) {
      throw new Error(`Workspaceの削除に失敗しました: ${error.message}`);
    }
  },
};
