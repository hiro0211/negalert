/**
 * レビューAPI - モック環境実装
 * 完全な静的モックデータを使用（Supabase不要）
 */

import { Review } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ReviewsApi } from './types';
import {
  mockReviews,
  getMockReviewById,
  getMockUnrepliedReviews,
  getMockNegativeReviews,
  getMockHighRiskReviews,
} from '@/lib/data/mock-data';

/**
 * モック環境用レビューAPI実装
 * 注: 完全な静的データを返します（Google OAuth審査デモ用）
 */
export const MockReviewsApi: ReviewsApi = {
  /**
   * すべてのレビューを取得
   */
  async fetchReviews(_supabase: SupabaseClient): Promise<Review[]> {
    // 静的モックデータを返す（日付順にソート）
    return [...mockReviews].sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  /**
   * IDでレビューを取得
   */
  async fetchReviewById(id: string, _supabase: SupabaseClient): Promise<Review | null> {
    const review = getMockReviewById(id);
    return review || null;
  },

  /**
   * 未返信のレビューを取得
   */
  async fetchUnrepliedReviews(_supabase: SupabaseClient): Promise<Review[]> {
    return getMockUnrepliedReviews().sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  /**
   * ネガティブレビュー（★3以下）を取得
   */
  async fetchNegativeReviews(_supabase: SupabaseClient): Promise<Review[]> {
    return getMockNegativeReviews().sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  /**
   * 高リスクレビューを取得
   */
  async fetchHighRiskReviews(_supabase: SupabaseClient): Promise<Review[]> {
    return getMockHighRiskReviews().sort((a, b) => b.date.getTime() - a.date.getTime());
  },
};
