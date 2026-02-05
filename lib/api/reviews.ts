/**
 * レビュー関連API
 * データ取得・更新のインターフェース
 */

import { Review } from '../types';
import { UpdateReviewInput } from './types';
import { createClient } from '../supabase/client';
import { mockReviews, getReviewById as getMockReviewById } from '../mock/reviews';

/**
 * モックデータモードかどうかを判定
 * 環境変数 USE_MOCK_DATA=true で有効化
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * データベースのレビューレコードをフロントエンド型に変換
 */
function convertDbReviewToReview(dbReview: any): Review {
  // リスク判定: DBに保存されている値を優先、なければ自動計算
  let risk: 'high' | 'medium' | 'low' = dbReview.risk || 'low';
  
  // AI分析未実行の場合は自動計算
  if (!dbReview.risk) {
    if (dbReview.status === 'unreplied') {
      if (dbReview.rating <= 2) {
        risk = 'high';
      } else if (dbReview.rating === 3) {
        risk = 'medium';
      }
    }
  }
  
  return {
    id: dbReview.id,
    date: new Date(dbReview.review_created_at),
    source: 'google',
    rating: dbReview.rating as 1 | 2 | 3 | 4 | 5,
    authorName: dbReview.author_name || '匿名',
    text: dbReview.comment || '',
    status: dbReview.status || 'unreplied',
    risk,
    // AI分析データをDBから取得（AI分析未実行の場合はnull）
    aiSummary: dbReview.ai_summary || null,
    aiCategories: dbReview.ai_categories || null,
    aiRiskReason: dbReview.ai_risk_reason || null,
    reply: dbReview.reply_text || undefined,
    replyCreatedAt: dbReview.reply_created_at ? new Date(dbReview.reply_created_at) : undefined,
    replyDraft: dbReview.reply_draft || null,
    photos: [],
  };
}

/**
 * すべてのレビューを取得
 * 
 * @returns レビュー一覧
 */
export async function fetchReviews(): Promise<Review[]> {
  // モックデータモードでも常にSupabaseからデータを取得
  // if (USE_MOCK_DATA) {
  //   console.log('🎭 [MOCK MODE] モックデータを使用しています');
  //   return Promise.resolve([...mockReviews]);
  // }

  const supabase = createClient();
  
  // Supabaseからレビューを取得（RLSで自動的にworkspace_idでフィルタリング）
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('review_created_at', { ascending: false });
  
  if (error) {
    console.error('レビュー取得エラー:', error);
    throw new Error(`レビューの取得に失敗しました: ${error.message}`);
  }
  
  // DBデータをフロントエンド型に変換
  return (data || []).map(convertDbReviewToReview);
}

/**
 * IDでレビューを取得
 * 
 * @param id - レビューID
 * @returns レビュー（見つからない場合はnull）
 */
export async function fetchReviewById(id: string): Promise<Review | null> {
  // モックデータモードでも常にSupabaseからデータを取得
  // if (USE_MOCK_DATA) {
  //   console.log('🎭 [MOCK MODE] モックデータからレビューを検索:', id);
  //   const review = getMockReviewById(id);
  //   return Promise.resolve(review || null);
  // }

  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // 見つからない
    }
    console.error('レビュー取得エラー:', error);
    throw new Error(`レビューの取得に失敗しました: ${error.message}`);
  }
  
  return data ? convertDbReviewToReview(data) : null;
}

/**
 * 未返信のレビューを取得
 * 
 * @returns 未返信レビュー一覧
 */
export async function fetchUnrepliedReviews(): Promise<Review[]> {
  // モックデータモードでも常にSupabaseからデータを取得
  // if (USE_MOCK_DATA) {
  //   console.log('🎭 [MOCK MODE] 未返信レビューをフィルタリング');
  //   return Promise.resolve(mockReviews.filter(r => r.status === 'unreplied'));
  // }

  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'unreplied')
    .order('review_created_at', { ascending: false });
  
  if (error) {
    console.error('未返信レビュー取得エラー:', error);
    throw new Error(`未返信レビューの取得に失敗しました: ${error.message}`);
  }
  
  return (data || []).map(convertDbReviewToReview);
}

/**
 * ネガティブレビュー（★3以下）を取得
 * 
 * @returns ネガティブレビュー一覧
 */
export async function fetchNegativeReviews(): Promise<Review[]> {
  // モックデータモードでも常にSupabaseからデータを取得
  // if (USE_MOCK_DATA) {
  //   console.log('🎭 [MOCK MODE] ネガティブレビューをフィルタリング');
  //   return Promise.resolve(mockReviews.filter(r => r.rating <= 3));
  // }

  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .lte('rating', 3)
    .order('review_created_at', { ascending: false });
  
  if (error) {
    console.error('ネガティブレビュー取得エラー:', error);
    throw new Error(`ネガティブレビューの取得に失敗しました: ${error.message}`);
  }
  
  return (data || []).map(convertDbReviewToReview);
}

/**
 * 高リスクレビューを取得
 * 
 * @returns 高リスクレビュー一覧
 */
export async function fetchHighRiskReviews(): Promise<Review[]> {
  // モックデータモードでも常にSupabaseからデータを取得
  // if (USE_MOCK_DATA) {
  //   console.log('🎭 [MOCK MODE] 高リスクレビューをフィルタリング');
  //   return Promise.resolve(mockReviews.filter(r => r.risk === 'high'));
  // }

  const supabase = createClient();
  
  // 注意: risk列がDBに存在しない場合は、評価とステータスでフィルタリング
  // 現時点では未返信かつ低評価（1-2星）をハイリスクとみなす
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'unreplied')
    .lte('rating', 2)
    .order('review_created_at', { ascending: false });
  
  if (error) {
    console.error('高リスクレビュー取得エラー:', error);
    throw new Error(`高リスクレビューの取得に失敗しました: ${error.message}`);
  }
  
  return (data || []).map(convertDbReviewToReview);
}

/**
 * レビューに返信を投稿・更新
 * Phase 4のAPIエンドポイントを使用
 * 
 * @param id - レビューID
 * @param reply - 返信テキスト
 */
export async function updateReviewReply(
  id: string,
  reply: string
): Promise<void> {
  const response = await fetch(`/api/reviews/${id}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ replyText: reply }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '返信の投稿に失敗しました' }));
    throw new Error(error.error || '返信の投稿に失敗しました');
  }
}

/**
 * レビューの返信を削除
 * Phase 4のAPIエンドポイントを使用
 * 
 * @param id - レビューID
 */
export async function deleteReviewReply(id: string): Promise<void> {
  const response = await fetch(`/api/reviews/${id}/reply`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '返信の削除に失敗しました' }));
    throw new Error(error.error || '返信の削除に失敗しました');
  }
}

/**
 * 返信の下書きを保存
 * 
 * @param id - レビューID
 * @param draft - 下書きテキスト
 */
export async function saveReplyDraft(
  id: string,
  draft: string
): Promise<void> {
  // 現在: モック実装（何もしない）
  // 将来: Supabaseに下書きを保存
  
  console.log('[Mock] 下書きを保存:', { id, draft });
  
  // 本番実装例（コメントアウト）
  /*
  const { error } = await supabase
    .from('reviews')
    .update({
      replyDraft: draft,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id);
  
  if (error) throw error;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * レビュー情報を更新
 * 
 * @param id - レビューID
 * @param updates - 更新内容
 */
export async function updateReview(
  id: string,
  updates: UpdateReviewInput
): Promise<Review> {
  // 現在: モック実装（元のレビューを返す）
  // 将来: Supabaseを更新
  
  console.log('[Mock] レビューを更新:', { id, updates });
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('reviews')
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const review = await fetchReviewById(id);
  if (!review) {
    throw new Error('レビューが見つかりません');
  }
  
  return review;
}

/**
 * レビューを削除
 * 
 * @param id - レビューID
 */
export async function deleteReview(id: string): Promise<void> {
  // 現在: モック実装（何もしない）
  // 将来: Supabaseから削除（論理削除推奨）
  
  console.log('[Mock] レビューを削除:', { id });
  
  // 本番実装例（コメントアウト）
  /*
  // 論理削除
  const { error } = await supabase
    .from('reviews')
    .update({
      deletedAt: new Date().toISOString(),
    })
    .eq('id', id);
  
  if (error) throw error;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
}
