/**
 * レポート生成サービス - 本番環境実装
 * 直近7日間のレビューを分析
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { generateReviewReport } from '../ai';
import { ReportsService, GenerateReportResult, ReviewData } from './types';

/**
 * 本番環境用レポート生成サービス
 */
export const ProductionReportsService: ReportsService = {
  async generateWeeklyReport(userId: string, supabase: SupabaseClient): Promise<GenerateReportResult> {
    // 期間計算（現在時刻から7日前）
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    console.log('📅 集計期間:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    
    // DBからレビューを取得（直近7日間）
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('id, comment, rating, review_created_at, author_name')
      .gte('review_created_at', startDate.toISOString())
      .order('review_created_at', { ascending: false })
      .limit(50); // トークン制限対策
    
    if (error) {
      throw new Error(`レビューの取得に失敗しました: ${error.message}`);
    }
    
    const reviewList = reviews || [];
    console.log('📝 取得したレビュー数:', reviewList.length);
    
    // レビューが0件の場合
    if (reviewList.length === 0) {
      console.log('ℹ️ レビューが0件のため、空のレポートを返します');
      return {
        report: {
          overallSentiment: 'neutral',
          summary: '直近1週間のレビューはありませんでした。',
          goodPoints: [],
          badPoints: [],
          actionPlan: '新しいレビューが投稿されるのを待ちましょう。',
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
    
    console.log('✅ 週間レポート生成完了（本番モード）');
    
    return {
      report,
      period: { startDate, endDate },
      reviewCount: reviewList.length,
    };
  },
};
