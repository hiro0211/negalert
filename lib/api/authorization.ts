/**
 * 認可チェックユーティリティ
 * APIエンドポイントでのアクセス制御に使用
 */

import { SupabaseClient } from '@supabase/supabase-js';

/**
 * ユーザーがワークスペースにアクセスできるか確認
 * 
 * @param supabase - Supabaseクライアント
 * @param userId - ユーザーID
 * @param workspaceId - ワークスペースID
 * @returns アクセス可能な場合true
 */
export async function authorizeWorkspaceAccess(
  supabase: SupabaseClient,
  userId: string,
  workspaceId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('workspaces')
    .select('id')
    .eq('id', workspaceId)
    .eq('user_id', userId)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  return true;
}

/**
 * ユーザーがレビューにアクセスできるか確認
 * レビューが属するロケーション→ワークスペースの所有者かを検証
 * 
 * @param supabase - Supabaseクライアント
 * @param userId - ユーザーID
 * @param reviewId - レビューID
 * @returns アクセス可能な場合true
 */
export async function authorizeReviewAccess(
  supabase: SupabaseClient,
  userId: string,
  reviewId: string
): Promise<boolean> {
  // レビュー → ロケーション → ワークスペース → ユーザーの関係を確認
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      locations!inner (
        id,
        workspaces!inner (
          user_id
        )
      )
    `)
    .eq('id', reviewId)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  // ネストしたオブジェクトから user_id を取得
  const workspaceUserId = (data.locations as any)?.workspaces?.user_id;
  return workspaceUserId === userId;
}

/**
 * ユーザーが返信スタイルにアクセスできるか確認
 * 
 * @param supabase - Supabaseクライアント
 * @param userId - ユーザーID
 * @param styleId - 返信スタイルID
 * @returns アクセス可能な場合true
 */
export async function authorizeReplyStyleAccess(
  supabase: SupabaseClient,
  userId: string,
  styleId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('reply_styles')
    .select(`
      id,
      workspaces!inner (
        user_id
      )
    `)
    .eq('id', styleId)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  const workspaceUserId = (data.workspaces as any)?.user_id;
  return workspaceUserId === userId;
}

/**
 * 認可エラーレスポンスを生成
 */
export function createUnauthorizedResponse() {
  return {
    error: '権限がありません',
    status: 403,
  };
}
