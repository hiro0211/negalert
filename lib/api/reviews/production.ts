/**
 * レビューAPI - 本番環境実装
 * Supabaseからデータを取得
 */

import { Review } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ReviewsApi, convertDbReviewToReview } from './types';

/**
 * 本番環境用レビューAPI実装
 */
export const ProductionReviewsApi: ReviewsApi = {
  /**
   * すべてのレビューを取得
   */
  async fetchReviews(supabase: SupabaseClient): Promise<Review[]> {
    // Supabaseからレビューを取得（RLSで自動的にworkspace_idでフィルタリング）
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('review_created_at', { ascending: false });
    
    if (error) {
      throw new Error(`レビューの取得に失敗しました: ${error.message}`);
    }
    
    // DBデータをフロントエンド型に変換
    return (data || []).map(convertDbReviewToReview);
  },

  /**
   * IDでレビューを取得
   */
  async fetchReviewById(id: string, supabase: SupabaseClient): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // 見つからない
      }
      throw new Error(`レビューの取得に失敗しました: ${error.message}`);
    }
    
    return data ? convertDbReviewToReview(data) : null;
  },

  /**
   * 未返信のレビューを取得
   */
  async fetchUnrepliedReviews(supabase: SupabaseClient): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'unreplied')
      .order('review_created_at', { ascending: false });
    
    if (error) {
      throw new Error(`未返信レビューの取得に失敗しました: ${error.message}`);
    }
    
    return (data || []).map(convertDbReviewToReview);
  },

  /**
   * ネガティブレビュー（★3以下）を取得
   */
  async fetchNegativeReviews(supabase: SupabaseClient): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .lte('rating', 3)
      .order('review_created_at', { ascending: false });
    
    if (error) {
      throw new Error(`ネガティブレビューの取得に失敗しました: ${error.message}`);
    }
    
    return (data || []).map(convertDbReviewToReview);
  },

  /**
   * 高リスクレビューを取得
   * 未返信かつ低評価（1-2星）をハイリスクとみなす
   */
  async fetchHighRiskReviews(supabase: SupabaseClient): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'unreplied')
      .lte('rating', 2)
      .order('review_created_at', { ascending: false });
    
    if (error) {
      throw new Error(`高リスクレビューの取得に失敗しました: ${error.message}`);
    }
    
    return (data || []).map(convertDbReviewToReview);
  },
};
