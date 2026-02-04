/**
 * レビューDB操作API（サーバーサイド専用）
 * レビューの返信に関するデータベース操作を提供
 */

import { SupabaseClient } from '@supabase/supabase-js';

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
  console.log('💾 DB更新: レビュー返信を保存', { reviewId });
  
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
    console.error('DB更新エラー:', error);
    throw new Error(`DB更新に失敗しました: ${error.message}`);
  }
  
  console.log('✅ DB更新成功: レビュー返信を保存');
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
  console.log('💾 DB更新: レビュー返信を削除', { reviewId });
  
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
    console.error('DB更新エラー:', error);
    throw new Error(`DB更新に失敗しました: ${error.message}`);
  }
  
  console.log('✅ DB更新成功: レビュー返信を削除');
}

/**
 * レビュー情報をDBから取得
 * 
 * @param reviewId - レビューID（UUID）
 * @param supabase - Supabaseクライアント（必須）
 * @returns レビュー情報
 */
export async function getReviewFromDb(
  reviewId: string,
  supabase: SupabaseClient
): Promise<any> {
  console.log('🔍 DB取得: レビュー情報', { reviewId });
  
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .single();
  
  if (error) {
    console.error('レビュー取得エラー:', error);
    
    if (error.code === 'PGRST116') {
      throw new Error('レビューが見つかりません');
    }
    
    throw new Error(`レビュー取得に失敗しました: ${error.message}`);
  }
  
  console.log('✅ レビュー取得成功');
  
  return data;
}

/**
 * ユーザーがレビューにアクセスする権限があるかチェック
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
  
  // RLSで自動的にフィルタリングされるため、データが取得できればアクセス権限あり
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
  console.log('💾 DB更新: AI分析結果を保存', { reviewId });
  
  const { error } = await supabase
    .from('reviews')
    .update({
      ai_summary: analysisResult.summary,
      risk: analysisResult.risk,
      ai_categories: analysisResult.categories,
      ai_risk_reason: analysisResult.riskReason,
      reply_draft: analysisResult.replyDraft,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId);
  
  if (error) {
    console.error('DB更新エラー:', error);
    throw new Error(`DB更新に失敗しました: ${error.message}`);
  }
  
  console.log('✅ DB更新成功: AI分析結果を保存');
}
