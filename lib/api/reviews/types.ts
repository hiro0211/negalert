/**
 * レビューAPI共通型定義
 */

import { Review } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * レビューAPIの共通インターフェース
 * モック実装と本番実装の両方がこのインターフェースに準拠する
 */
export interface ReviewsApi {
  /**
   * すべてのレビューを取得
   */
  fetchReviews(supabase: SupabaseClient): Promise<Review[]>;

  /**
   * IDでレビューを取得
   */
  fetchReviewById(id: string, supabase: SupabaseClient): Promise<Review | null>;

  /**
   * 未返信のレビューを取得
   */
  fetchUnrepliedReviews(supabase: SupabaseClient): Promise<Review[]>;

  /**
   * ネガティブレビュー（★3以下）を取得
   */
  fetchNegativeReviews(supabase: SupabaseClient): Promise<Review[]>;

  /**
   * 高リスクレビューを取得
   */
  fetchHighRiskReviews(supabase: SupabaseClient): Promise<Review[]>;
}

/**
 * データベースのレビューレコードをフロントエンド型に変換
 */
export function convertDbReviewToReview(dbReview: any): Review {
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
