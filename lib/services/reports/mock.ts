/**
 * レポート生成サービス - モック環境実装
 * 最新50件のレビューを分析（期間フィルタリングなし）
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { generateReviewReport } from '../ai';
import { ReportsService, GenerateReportResult } from './types';

/**
 * モック環境用レポート生成サービス
 */
export const MockReportsService: ReportsService = {
  async generateWeeklyReport(userId: string, supabase: SupabaseClient): Promise<GenerateReportResult> {
    console.log('🎭 [MOCK MODE] レポート生成開始');
    
    // モックモード: 期間フィルタリングせず、最新50件を取得
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('id, comment, rating, review_created_at, author_name')
      .order('review_created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      throw new Error(`レビューの取得に失敗しました: ${error.message}`);
    }
    
    const reviewList = reviews || [];
    console.log('📝 取得したレビュー数:', reviewList.length);
    
    // 実際のレビュー日付範囲を集計期間とする
    let startDate = new Date();
    let endDate = new Date();
    
    if (reviewList.length > 0) {
      const dates = reviewList.map(r => new Date(r.review_created_at));
      startDate = new Date(Math.min(...dates.map(d => d.getTime())));
      endDate = new Date(Math.max(...dates.map(d => d.getTime())));
      console.log('🎭 [MOCK MODE] 実際のレビュー期間に調整:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    }
    
    // レビューが0件の場合
    if (reviewList.length === 0) {
      console.log('ℹ️ レビューが0件のため、空のレポートを返します');
      return {
        report: {
          overallSentiment: 'neutral',
          summary: 'レビューがありませんでした。',
          goodPoints: [],
          badPoints: [],
          actionPlan: 'レビューをインポートしてください。',
        },
        period: { startDate, endDate },
        reviewCount: 0,
      };
    }
    
    // AI分析を実行
    const reviewsForAI = reviewList.map(r => ({
      text: r.comment || '',
      rating: r.rating,
      date: new Date(r.review_created_at),
    }));
    
    const report = await generateReviewReport(reviewsForAI);
    
    console.log('✅ 週間レポート生成完了（モックモード）');
    
    return {
      report,
      period: { startDate, endDate },
      reviewCount: reviewList.length,
    };
  },
};
