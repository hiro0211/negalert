/**
 * レビューAPI - エントリーポイント
 * 環境に応じて適切な実装を選択
 */

import { Review } from '@/lib/types';
import { UpdateReviewInput } from '../types';
import { createClient } from '../../supabase/client';
import { ProductionReviewsApi } from './production';
import { MockReviewsApi } from './mock';

/**
 * モックデータモードかどうかを判定
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * 環境に応じたAPI実装を選択
 */
const reviewsApi = USE_MOCK_DATA ? MockReviewsApi : ProductionReviewsApi;

/**
 * すべてのレビューを取得
 */
export async function fetchReviews(): Promise<Review[]> {
  const supabase = createClient();
  return reviewsApi.fetchReviews(supabase);
}

/**
 * IDでレビューを取得
 */
export async function fetchReviewById(id: string): Promise<Review | null> {
  const supabase = createClient();
  return reviewsApi.fetchReviewById(id, supabase);
}

/**
 * 未返信のレビューを取得
 */
export async function fetchUnrepliedReviews(): Promise<Review[]> {
  const supabase = createClient();
  return reviewsApi.fetchUnrepliedReviews(supabase);
}

/**
 * ネガティブレビュー（★3以下）を取得
 */
export async function fetchNegativeReviews(): Promise<Review[]> {
  const supabase = createClient();
  return reviewsApi.fetchNegativeReviews(supabase);
}

/**
 * 高リスクレビューを取得
 */
export async function fetchHighRiskReviews(): Promise<Review[]> {
  const supabase = createClient();
  return reviewsApi.fetchHighRiskReviews(supabase);
}

/**
 * レビューに返信を投稿・更新
 * Phase 4のAPIエンドポイントを使用
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
 * レビュー情報を更新
 */
export async function updateReview(
  id: string,
  updates: UpdateReviewInput
): Promise<Review> {
  // 現在: モック実装（元のレビューを返す）
  // 将来: Supabaseを更新
  
  console.log('[Mock] レビューを更新:', { id, updates });
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const review = await fetchReviewById(id);
  if (!review) {
    throw new Error('レビューが見つかりません');
  }
  
  return review;
}

/**
 * レビューを削除
 */
export async function deleteReview(id: string): Promise<void> {
  // 現在: モック実装（何もしない）
  // 将来: Supabaseから削除（論理削除推奨）
  
  console.log('[Mock] レビューを削除:', { id });
  
  await new Promise(resolve => setTimeout(resolve, 300));
}

// 既存のコードとの互換性のため、APIオブジェクトもエクスポート
export { reviewsApi };
