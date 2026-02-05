/**
 * レビュー同期API（サーバーサイド専用）
 * Googleレビューをデータベースに同期する機能
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { GoogleReview, convertGoogleRatingToNumber } from './types';

/**
 * Googleレビューをreviewsテーブルに同期（UPSERT）
 * 
 * @param workspaceId - ワークスペースID
 * @param reviews - Google Business Profileから取得したレビュー一覧
 * @param supabase - Supabaseクライアント（必須）
 * @returns 同期した件数
 */
export async function syncReviews(
  workspaceId: string,
  reviews: GoogleReview[],
  supabase: SupabaseClient
): Promise<number> {
  if (reviews.length === 0) {
    return 0;
  }
  
  // UPSERTするデータを準備
  const reviewsData = reviews.map(review => ({
    workspace_id: workspaceId,
    google_review_id: review.reviewId,
    rating: convertGoogleRatingToNumber(review.starRating),
    comment: review.comment || '',
    author_name: review.reviewer.displayName,
    author_photo_url: review.reviewer.profilePhotoUrl || null,
    review_created_at: review.createTime,
    reply_text: review.reviewReply?.comment || null,
    reply_created_at: review.reviewReply?.updateTime || null,
    status: review.reviewReply ? 'replied' : 'unreplied',
    updated_at: new Date().toISOString(),
  }));
  
  // reviewsテーブルにUPSERT
  // ユニーク制約: google_review_id
  const { data, error } = await supabase
    .from('reviews')
    .upsert(reviewsData, {
      onConflict: 'google_review_id',
      ignoreDuplicates: false, // 既存レコードを更新
    })
    .select();
  
  if (error) {
    throw new Error(`レビューの同期に失敗しました: ${error.message}`);
  }
  
  const syncedCount = data?.length || 0;
  
  return syncedCount;
}
