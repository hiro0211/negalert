/**
 * レビューAPI - モック環境実装
 * モックモードでもSupabaseから実店舗データを取得
 */

import { Review } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ReviewsApi, convertDbReviewToReview } from './types';

/**
 * モック環境用レビューAPI実装
 * 注: モックモードでもSupabaseから実店舗データを取得します
 */
export const MockReviewsApi: ReviewsApi = {
  /**
   * すべてのレビューを取得
   */
  async fetchReviews(supabase: SupabaseClient): Promise<Review[]> {
    // モックモードでもSupabaseから取得
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('review_created_at', { ascending: false });
    
    if (error) {
      throw new Error(`レビューの取得に失敗しました: ${error.message}`);
    }
    
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
