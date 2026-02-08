/**
 * レビューDB操作API（サーバーサイド専用）
 * レビューの返信に関するデータベース操作を提供
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { handleDatabaseError, logError } from '../utils/error-handler';

/**
 * レビューの返信をDBに保存
 * 
 * @param reviewId - レビューID（UUID）
 * @param replyText - 返信テキスト
 * @param repliedAt - 返信日時（ISO 8601形式）
 * @param supabase - Supabaseクライアント（必須）
 */
export async function updateReviewReplyInDb(
  reviewId: string,
  replyText: string,
  repliedAt: string,
  supabase: SupabaseClient
): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .update({
      reply_text: replyText,
      reply_created_at: repliedAt,
      status: 'replied',
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId);
  
  if (error) {
    logError('updateReviewReplyInDb', error, { reviewId });
    throw new Error(handleDatabaseError(error));
  }
}

/**
 * レビューの返信をDBから削除
 * 
 * @param reviewId - レビューID（UUID）
 * @param supabase - Supabaseクライアント（必須）
 */
export async function deleteReviewReplyInDb(
  reviewId: string,
  supabase: SupabaseClient
): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .update({
      reply_text: null,
      reply_created_at: null,
      status: 'unreplied',
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId);
  
  if (error) {
    logError('deleteReviewReplyInDb', error, { reviewId });
    throw new Error(handleDatabaseError(error));
  }
}

/**
 * レビュー情報をDBから取得
 * セキュリティ: 必要なカラムのみを取得（select('*')は使用しない）
 * 
 * @param reviewId - レビューID（UUID）
 * @param supabase - Supabaseクライアント（必須）
 * @returns レビュー情報
 */
export async function getReviewFromDb(
  reviewId: string,
  supabase: SupabaseClient
): Promise<any> {
  // セキュリティ: 必要なカラムのみを明示的に取得
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      workspace_id,
      google_review_id,
      author_name,
      author_photo_url,
      rating,
      comment,
      review_created_at,
      status,
      reply_text,
      reply_created_at,
      ai_summary,
      risk,
      ai_categories,
      ai_risk_reason,
      updated_at
    `)
    .eq('id', reviewId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('レビューが見つかりません');
    }
    
    logError('getReviewFromDb', error, { reviewId });
    throw new Error(handleDatabaseError(error));
  }
  
  return data;
}

/**
 * ユーザーがレビューにアクセスする権限があるかチェック
 * セキュリティ: RLSに加えて明示的な所有権チェックを実施
 * 
 * @param reviewId - レビューID（UUID）
 * @param userId - ユーザーID（UUID）
 * @param supabase - Supabaseクライアント（必須）
 * @returns アクセス権限がある場合true
 */
export async function checkReviewAccess(
  reviewId: string,
  userId: string,
  supabase: SupabaseClient
): Promise<boolean> {
  const { data, error } = await supabase
    .from('reviews')
    .select('workspace_id, workspaces!inner(user_id)')
    .eq('id', reviewId)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  // 明示的にユーザーIDを検証（RLSに加えての二重チェック）
  const workspaceUserId = (data as any).workspaces?.user_id;
  if (workspaceUserId && workspaceUserId !== userId) {
    logError('checkReviewAccess', new Error('Unauthorized access attempt'), {
      reviewId,
      requestedUserId: userId,
    });
    return false;
  }
  
  return true;
}

/**
 * AI分析結果をDBに保存
 * 
 * @param reviewId - レビューID（UUID）
 * @param analysisResult - AI分析結果
 * @param supabase - Supabaseクライアント（必須）
 */
export async function updateReviewAnalysisInDb(
  reviewId: string,
  analysisResult: {
    summary: string;
    risk: 'high' | 'medium' | 'low';
    categories: string[];
    riskReason: string;
    replyDraft: string;
  },
  supabase: SupabaseClient
): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .update({
      ai_summary: analysisResult.summary,
      risk: analysisResult.risk,
      ai_categories: analysisResult.categories,
      ai_risk_reason: analysisResult.riskReason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId);
  
  if (error) {
    logError('updateReviewAnalysisInDb', error, { reviewId });
    throw new Error(handleDatabaseError(error));
  }
}
