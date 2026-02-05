/**
 * 統計データ関連API
 * ダッシュボード用の統計情報を取得
 */

import { DashboardStats } from '../types';
import { createClient } from '../supabase/client';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * ダッシュボード統計データを取得
 * 
 * @returns ダッシュボード統計
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();
  
  // Supabaseから全レビューを取得
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('rating, status, review_created_at');
  
  if (error) {
    console.error('統計データ取得エラー:', error);
    throw new Error(`統計データの取得に失敗しました: ${error.message}`);
  }
  
  // データが存在しない場合のデフォルト値
  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      negativeRate: 0,
      replyRate: 0,
      reviewGrowth: [],
      ratingDistribution: [
        { rating: 1, count: 0 },
        { rating: 2, count: 0 },
        { rating: 3, count: 0 },
        { rating: 4, count: 0 },
        { rating: 5, count: 0 },
      ],
      negativeFactors: [],
      changes: {
        averageRating: 0,
        totalReviews: 0,
        negativeRate: 0,
        replyRate: 0,
      },
    };
  }
  
  // 今月と先月の期間を計算
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  
  // 今月のレビュー
  const thisMonthReviews = reviews.filter(r => {
    const reviewDate = new Date(r.review_created_at);
    return reviewDate >= thisMonthStart;
  });
  
  // 先月のレビュー
  const lastMonthReviews = reviews.filter(r => {
    const reviewDate = new Date(r.review_created_at);
    return reviewDate >= lastMonthStart && reviewDate <= lastMonthEnd;
  });
  
  // 統計を計算
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const negativeCount = reviews.filter(r => r.rating <= 3).length;
  const negativeRate = (negativeCount / totalReviews) * 100;
  const repliedCount = reviews.filter(r => r.status === 'replied' || r.status === 'auto_replied').length;
  const replyRate = (repliedCount / totalReviews) * 100;
  
  // 前月比を計算
  const changes = calculateMonthlyChanges(thisMonthReviews, lastMonthReviews);
  
  // レビュー推移を計算（過去6ヶ月）
  const reviewGrowth = calculateReviewGrowth(reviews);
  
  // 星評価分布を計算
  const ratingDistribution = calculateRatingDistribution(reviews);
  
  // ネガティブ要因（暫定：AI分析機能は今後実装予定）
  const negativeFactors = [
    { factor: 'データ分析中', count: negativeCount },
  ];
  
  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    negativeRate: Math.round(negativeRate * 10) / 10,
    replyRate: Math.round(replyRate * 10) / 10,
    reviewGrowth,
    ratingDistribution,
    negativeFactors,
    changes,
  };
}

/**
 * レビュー推移を計算（過去6ヶ月）
 */
function calculateReviewGrowth(reviews: any[]): { month: string; count: number }[] {
  const months = [];
  const now = new Date();
  
  // 過去6ヶ月の月初・月末を計算
  for (let i = 5; i >= 0; i--) {
    const targetMonth = subMonths(now, i);
    const monthStart = startOfMonth(targetMonth);
    const monthEnd = endOfMonth(targetMonth);
    
    const count = reviews.filter(r => {
      const reviewDate = new Date(r.review_created_at);
      return reviewDate >= monthStart && reviewDate <= monthEnd;
    }).length;
    
    months.push({
      month: format(targetMonth, 'M月', { locale: ja }),
      count,
    });
  }
  
  return months;
}

/**
 * 星評価分布を計算
 */
function calculateRatingDistribution(reviews: any[]): { rating: number; count: number }[] {
  return [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
  }));
}

/**
 * 前月比を計算
 */
function calculateMonthlyChanges(
  thisMonthReviews: any[],
  lastMonthReviews: any[]
): {
  averageRating?: number;
  totalReviews?: number;
  negativeRate?: number;
  replyRate?: number;
} {
  // 先月のデータがない場合は前月比なし
  if (lastMonthReviews.length === 0) {
    return {
      averageRating: undefined,
      totalReviews: undefined,
      negativeRate: undefined,
      replyRate: undefined,
    };
  }
  
  // 今月の統計
  const thisMonthTotal = thisMonthReviews.length;
  const thisMonthAvgRating = thisMonthTotal > 0
    ? thisMonthReviews.reduce((sum, r) => sum + r.rating, 0) / thisMonthTotal
    : 0;
  const thisMonthNegativeRate = thisMonthTotal > 0
    ? (thisMonthReviews.filter(r => r.rating <= 3).length / thisMonthTotal) * 100
    : 0;
  const thisMonthReplyRate = thisMonthTotal > 0
    ? (thisMonthReviews.filter(r => r.status === 'replied' || r.status === 'auto_replied').length / thisMonthTotal) * 100
    : 0;
  
  // 先月の統計
  const lastMonthTotal = lastMonthReviews.length;
  const lastMonthAvgRating = lastMonthReviews.reduce((sum, r) => sum + r.rating, 0) / lastMonthTotal;
  const lastMonthNegativeRate = (lastMonthReviews.filter(r => r.rating <= 3).length / lastMonthTotal) * 100;
  const lastMonthReplyRate = (lastMonthReviews.filter(r => r.status === 'replied' || r.status === 'auto_replied').length / lastMonthTotal) * 100;
  
  // 差分を計算
  return {
    averageRating: Math.round((thisMonthAvgRating - lastMonthAvgRating) * 10) / 10,
    totalReviews: thisMonthTotal - lastMonthTotal,
    negativeRate: Math.round((thisMonthNegativeRate - lastMonthNegativeRate) * 10) / 10,
    replyRate: Math.round((thisMonthReplyRate - lastMonthReplyRate) * 10) / 10,
  };
}

/**
 * レビュー推移データを取得
 * 
 * @param months - 取得する月数（デフォルト: 6ヶ月）
 * @returns 月別レビュー数
 */
export async function fetchReviewGrowth(
  months: number = 6
): Promise<{ month: string; count: number }[]> {
  const supabase = createClient();
  const startDate = subMonths(new Date(), months);
  
  const { data, error } = await supabase
    .from('reviews')
    .select('review_created_at')
    .gte('review_created_at', startDate.toISOString());
  
  if (error) {
    console.error('レビュー推移取得エラー:', error);
    throw new Error(`レビュー推移の取得に失敗しました: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    return [];
  }
  
  // 月別に集計
  return calculateReviewGrowthForMonths(data, months);
}

/**
 * 指定月数分のレビュー推移を計算
 */
function calculateReviewGrowthForMonths(
  reviews: any[],
  months: number
): { month: string; count: number }[] {
  const monthsData = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const targetMonth = subMonths(now, i);
    const monthStart = startOfMonth(targetMonth);
    const monthEnd = endOfMonth(targetMonth);
    
    const count = reviews.filter(r => {
      const reviewDate = new Date(r.review_created_at);
      return reviewDate >= monthStart && reviewDate <= monthEnd;
    }).length;
    
    monthsData.push({
      month: format(targetMonth, 'M月', { locale: ja }),
      count,
    });
  }
  
  return monthsData;
}

/**
 * 星評価分布を取得
 * 
 * @returns 星評価別のレビュー数
 */
export async function fetchRatingDistribution(): Promise<
  { rating: number; count: number }[]
> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .select('rating');
  
  if (error) {
    console.error('星評価分布取得エラー:', error);
    throw new Error(`星評価分布の取得に失敗しました: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    return [1, 2, 3, 4, 5].map(rating => ({ rating, count: 0 }));
  }
  
  // 星評価別に集計
  const distribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: data.filter(r => r.rating === rating).length,
  }));
  
  return distribution;
}

/**
 * ネガティブ要因TOP3を取得
 * 
 * @returns ネガティブ要因とその件数
 */
export async function fetchNegativeFactors(): Promise<
  { factor: string; count: number }[]
> {
  const supabase = createClient();
  
  // AI分析機能は今後実装予定のため、暫定的にネガティブレビュー数のみ返す
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .lte('rating', 3);
  
  if (error) {
    console.error('ネガティブ要因取得エラー:', error);
    throw new Error(`ネガティブ要因の取得に失敗しました: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    return [];
  }
  
  // 暫定: AI分析機能実装までは簡易表示
  return [
    { factor: 'AI分析準備中', count: data.length },
  ];
}

/**
 * 期間を指定して統計データを取得
 * 
 * @param startDate - 開始日
 * @param endDate - 終了日
 * @returns 期間内の統計データ
 */
export async function fetchStatsByPeriod(
  startDate: Date,
  endDate: Date
): Promise<DashboardStats> {
  const supabase = createClient();
  
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('rating, status, review_created_at')
    .gte('review_created_at', startDate.toISOString())
    .lte('review_created_at', endDate.toISOString());
  
  if (error) {
    console.error('期間指定統計取得エラー:', error);
    throw new Error(`期間指定統計の取得に失敗しました: ${error.message}`);
  }
  
  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      negativeRate: 0,
      replyRate: 0,
      reviewGrowth: [],
      ratingDistribution: [
        { rating: 1, count: 0 },
        { rating: 2, count: 0 },
        { rating: 3, count: 0 },
        { rating: 4, count: 0 },
        { rating: 5, count: 0 },
      ],
      negativeFactors: [],
    };
  }
  
  // 統計を計算（fetchDashboardStatsと同様のロジック）
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const negativeCount = reviews.filter(r => r.rating <= 3).length;
  const negativeRate = (negativeCount / totalReviews) * 100;
  const repliedCount = reviews.filter(r => r.status === 'replied' || r.status === 'auto_replied').length;
  const replyRate = (repliedCount / totalReviews) * 100;
  
  const reviewGrowth = calculateReviewGrowth(reviews);
  const ratingDistribution = calculateRatingDistribution(reviews);
  
  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    negativeRate: Math.round(negativeRate * 10) / 10,
    replyRate: Math.round(replyRate * 10) / 10,
    reviewGrowth,
    ratingDistribution,
    negativeFactors: [{ factor: 'データ分析中', count: negativeCount }],
  };
}
