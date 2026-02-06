/**
 * レビューDB操作API（サーバーサイド専用）
 * レビューの返信に関するデータベース操作を提供
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { getMockReviewById } from '@/lib/data/mock-data';

// モックモードの判定
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

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
  // モックモード: DB更新をスキップ（ログのみ）
  if (USE_MOCK_DATA) {
    console.log('[Mock] 返信のDB保存をスキップ:', {
      reviewId,
      replyText: replyText.substring(0, 50) + '...',
    });
    return;
  }

  // 本番モード: Supabaseに保存
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
    throw new Error(`DB更新に失敗しました: ${error.message}`);
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
  // モックモード: DB更新をスキップ（ログのみ）
  if (USE_MOCK_DATA) {
    console.log('[Mock] 返信削除のDB更新をスキップ:', reviewId);
    return;
  }

  // 本番モード: Supabaseから削除
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
    throw new Error(`DB更新に失敗しました: ${error.message}`);
  }
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
  // モックモード: 静的データから取得
  if (USE_MOCK_DATA) {
    console.log('[Mock] モックデータからレビューを取得:', reviewId);
    const mockReview = getMockReviewById(reviewId);
    
    if (!mockReview) {
      throw new Error('レビューが見つかりません');
    }
    
    // モックレビューをDB形式に変換
    return {
      id: mockReview.id,
      rating: mockReview.rating,
      comment: mockReview.text,
      author_name: mockReview.authorName,
      review_created_at: mockReview.date.toISOString(),
      status: mockReview.status,
      reply_text: mockReview.reply || null,
      reply_created_at: mockReview.replyCreatedAt?.toISOString() || null,
      ai_summary: mockReview.aiSummary,
      ai_categories: mockReview.aiCategories,
      ai_risk_reason: mockReview.aiRiskReason,
      risk: mockReview.risk,
      reply_draft: mockReview.replyDraft || null,
    };
  }

  // 本番モード: Supabaseから取得
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('レビューが見つかりません');
    }
    
    throw new Error(`レビュー取得に失敗しました: ${error.message}`);
  }
  
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
  // モックモード: DB更新をスキップ（ログのみ）
  if (USE_MOCK_DATA) {
    console.log('[Mock] AI分析結果のDB保存をスキップ:', {
      reviewId,
      summary: analysisResult.summary,
      risk: analysisResult.risk,
    });
    // モックモードではDB更新しないが、エラーも出さない
    return;
  }

  // 本番モード: Supabaseに保存
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
    throw new Error(`DB更新に失敗しました: ${error.message}`);
  }
}
