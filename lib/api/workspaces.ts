/**
 * Workspace管理API
 * Google Business Profileの店舗情報をworkspacesテーブルに保存・管理
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '../supabase/server';
import { Workspace, GoogleLocation } from './types';

/**
 * Google店舗情報をworkspacesテーブルに同期（UPSERT）
 * 
 * @param userId - ユーザーID
 * @param locations - Google Business Profileから取得した店舗一覧
 * @param supabase - Supabaseクライアント（オプション）
 * @returns 同期した件数
 */
export async function syncWorkspaces(
  userId: string,
  locations: GoogleLocation[],
  supabase?: SupabaseClient
): Promise<number> {
  const client = supabase || await createServerClient();
  
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
  const { data, error } = await client
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
}

/**
 * ユーザーのワークスペース一覧を取得
 * 
 * @param userId - ユーザーID
 * @param supabase - Supabaseクライアント（オプション）
 * @returns ワークスペース一覧
 */
export async function getWorkspaces(
  userId: string,
  supabase?: SupabaseClient
): Promise<Workspace[]> {
  const client = supabase || await createServerClient();
  
  const { data, error } = await client
    .from('workspaces')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Workspaceの取得に失敗しました: ${error.message}`);
  }
  
  return data || [];
}

/**
 * 特定のワークスペースを取得
 * 
 * @param workspaceId - ワークスペースID
 * @param supabase - Supabaseクライアント（オプション）
 * @returns ワークスペース
 */
export async function getWorkspace(
  workspaceId: string,
  supabase?: SupabaseClient
): Promise<Workspace | null> {
  const client = supabase || await createServerClient();
  
  const { data, error } = await client
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
}

/**
 * ワークスペースを削除
 * 
 * @param workspaceId - ワークスペースID
 * @param userId - ユーザーID（権限チェック用）
 * @param supabase - Supabaseクライアント（オプション）
 */
export async function deleteWorkspace(
  workspaceId: string,
  userId: string,
  supabase?: SupabaseClient
): Promise<void> {
  const client = supabase || await createServerClient();
  
  const { error } = await client
    .from('workspaces')
    .delete()
    .eq('id', workspaceId)
    .eq('user_id', userId); // 自分のワークスペースのみ削除可能
  
  if (error) {
    throw new Error(`Workspaceの削除に失敗しました: ${error.message}`);
  }
}
