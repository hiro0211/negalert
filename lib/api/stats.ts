/**
 * 統計データ関連API
 * ダッシュボード用の統計情報を取得
 */

import { DashboardStats } from '../types';
import { mockStats } from '../mock/stats';

/**
 * ダッシュボード統計データを取得
 * 
 * @returns ダッシュボード統計
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  // 現在: モックデータを返す
  // 将来: Supabaseから集計データを取得、またはリアルタイムで計算
  
  // 本番実装例（コメントアウト）
  /*
  // Supabaseから集計
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('rating, status, date, aiCategories');
  
  if (error) throw error;
  
  // 統計を計算
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const negativeCount = reviews.filter(r => r.rating <= 3).length;
  const negativeRate = (negativeCount / totalReviews) * 100;
  const repliedCount = reviews.filter(r => r.status === 'replied' || r.status === 'auto_replied').length;
  const replyRate = (repliedCount / totalReviews) * 100;
  
  // レビュー推移を計算
  const reviewGrowth = calculateReviewGrowth(reviews);
  
  // 星評価分布を計算
  const ratingDistribution = calculateRatingDistribution(reviews);
  
  // ネガティブ要因を集計
  const negativeFactors = calculateNegativeFactors(reviews);
  
  return {
    averageRating,
    totalReviews,
    negativeRate,
    replyRate,
    reviewGrowth,
    ratingDistribution,
    negativeFactors,
  };
  */
  
  // モック: 少し遅延を入れてリアルなAPI呼び出しをシミュレート
  await new Promise(resolve => setTimeout(resolve, 400));
  return { ...mockStats };
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
  // 現在: モックデータから取得
  // 将来: Supabaseから期間を指定して集計
  
  // 本番実装例（コメントアウト）
  /*
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const { data, error } = await supabase
    .from('reviews')
    .select('date')
    .gte('date', startDate.toISOString());
  
  if (error) throw error;
  
  // 月別に集計
  const monthlyData = groupByMonth(data);
  return monthlyData;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockStats.reviewGrowth.slice(-months);
}

/**
 * 星評価分布を取得
 * 
 * @returns 星評価別のレビュー数
 */
export async function fetchRatingDistribution(): Promise<
  { rating: number; count: number }[]
> {
  // 現在: モックデータから取得
  // 将来: Supabaseから集計
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('reviews')
    .select('rating');
  
  if (error) throw error;
  
  // 星評価別に集計
  const distribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: data.filter(r => r.rating === rating).length,
  }));
  
  return distribution;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockStats.ratingDistribution];
}

/**
 * ネガティブ要因TOP3を取得
 * 
 * @returns ネガティブ要因とその件数
 */
export async function fetchNegativeFactors(): Promise<
  { factor: string; count: number }[]
> {
  // 現在: モックデータから取得
  // 将来: Supabaseからネガティブレビューのカテゴリを集計
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('reviews')
    .select('aiCategories')
    .lte('rating', 3);
  
  if (error) throw error;
  
  // カテゴリを集計
  const categoryCount = new Map<string, number>();
  data.forEach(review => {
    review.aiCategories.forEach((category: string) => {
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });
  });
  
  // TOP3を抽出
  const factors = Array.from(categoryCount.entries())
    .map(([factor, count]) => ({ factor, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  return factors;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockStats.negativeFactors];
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
  // 現在: モックデータを返す（期間は無視）
  // 将来: Supabaseから期間を指定して集計
  
  console.log('[Mock] 期間指定で統計取得:', { startDate, endDate });
  
  // 本番実装例（コメントアウト）
  /*
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString());
  
  if (error) throw error;
  
  // 統計を計算（fetchDashboardStatsと同様のロジック）
  // ...
  */
  
  await new Promise(resolve => setTimeout(resolve, 400));
  return { ...mockStats };
}
