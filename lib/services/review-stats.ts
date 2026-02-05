/**
 * レビュー統計計算ロジック
 * 統計データの計算処理を集約
 */

import { Review } from '../types';

/**
 * 平均評価を計算
 * 
 * @param reviews - レビュー一覧
 * @returns 平均評価（1-5）
 */
export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

/**
 * ネガティブレビュー率を計算
 * 
 * @param reviews - レビュー一覧
 * @returns ネガティブ率（%）
 */
export function calculateNegativeRate(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  
  const negativeCount = reviews.filter(r => r.rating <= 3).length;
  return (negativeCount / reviews.length) * 100;
}

/**
 * 返信率を計算
 * 
 * @param reviews - レビュー一覧
 * @returns 返信率（%）
 */
export function calculateReplyRate(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  
  const repliedCount = reviews.filter(
    r => r.status === 'replied' || r.status === 'auto_replied'
  ).length;
  return (repliedCount / reviews.length) * 100;
}

/**
 * 星評価分布を計算
 * 
 * @param reviews - レビュー一覧
 * @returns 星評価別の件数
 */
export function calculateRatingDistribution(
  reviews: Review[]
): { rating: number; count: number }[] {
  const distribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
  }));
  
  return distribution;
}

/**
 * 月別レビュー推移を計算
 * 
 * @param reviews - レビュー一覧
 * @param months - 取得する月数
 * @returns 月別レビュー数
 */
export function calculateReviewGrowth(
  reviews: Review[],
  months: number = 6
): { month: string; count: number }[] {
  const now = new Date();
  const monthlyData: { month: string; count: number }[] = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${targetDate.getFullYear()}年${targetDate.getMonth() + 1}月`;
    
    const count = reviews.filter(review => {
      const reviewDate = new Date(review.date);
      return (
        reviewDate.getFullYear() === targetDate.getFullYear() &&
        reviewDate.getMonth() === targetDate.getMonth()
      );
    }).length;
    
    monthlyData.push({ month: monthStr, count });
  }
  
  return monthlyData;
}

/**
 * ネガティブ要因を集計
 * 
 * @param reviews - レビュー一覧
 * @param topN - 上位N件を取得（デフォルト: 3）
 * @returns ネガティブ要因とその件数
 */
export function calculateNegativeFactors(
  reviews: Review[],
  topN: number = 3
): { factor: string; count: number }[] {
  // ネガティブレビューのみを対象
  const negativeReviews = reviews.filter(r => r.rating <= 3);
  
  // カテゴリを集計
  const categoryCount = new Map<string, number>();
  negativeReviews.forEach(review => {
    if (review.aiCategories) {
      review.aiCategories.forEach(category => {
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      });
    }
  });
  
  // 件数順にソートしてTOP Nを取得
  return Array.from(categoryCount.entries())
    .map(([factor, count]) => ({ factor, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/**
 * リスクレベル別の件数を計算
 * 
 * @param reviews - レビュー一覧
 * @returns リスクレベル別の件数
 */
export function calculateRiskDistribution(
  reviews: Review[]
): { risk: 'high' | 'medium' | 'low'; count: number }[] {
  return [
    {
      risk: 'high' as const,
      count: reviews.filter(r => r.risk === 'high').length,
    },
    {
      risk: 'medium' as const,
      count: reviews.filter(r => r.risk === 'medium').length,
    },
    {
      risk: 'low' as const,
      count: reviews.filter(r => r.risk === 'low').length,
    },
  ];
}

/**
 * 未返信レビュー数を計算
 * 
 * @param reviews - レビュー一覧
 * @returns 未返信レビュー数
 */
export function countUnrepliedReviews(reviews: Review[]): number {
  return reviews.filter(r => r.status === 'unreplied').length;
}

/**
 * 未返信のネガティブレビュー数を計算
 * 
 * @param reviews - レビュー一覧
 * @returns 未返信のネガティブレビュー数
 */
export function countUnrepliedNegativeReviews(reviews: Review[]): number {
  return reviews.filter(
    r => r.status === 'unreplied' && r.rating <= 3
  ).length;
}

/**
 * 高リスクで未返信のレビュー数を計算
 * 
 * @param reviews - レビュー一覧
 * @returns 高リスク未返信レビュー数
 */
export function countHighRiskUnrepliedReviews(reviews: Review[]): number {
  return reviews.filter(
    r => r.status === 'unreplied' && r.risk === 'high'
  ).length;
}

/**
 * カテゴリ別のレビュー数を集計
 * 
 * @param reviews - レビュー一覧
 * @returns カテゴリ別の件数
 */
export function calculateCategoryDistribution(
  reviews: Review[]
): { category: string; count: number }[] {
  const categoryCount = new Map<string, number>();
  
  reviews.forEach(review => {
    if (review.aiCategories) {
      review.aiCategories.forEach(category => {
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      });
    }
  });
  
  return Array.from(categoryCount.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 期間内の統計サマリーを計算
 * 
 * @param reviews - レビュー一覧
 * @returns 統計サマリー
 */
export function calculateStatsSummary(reviews: Review[]): {
  total: number;
  averageRating: number;
  negativeRate: number;
  replyRate: number;
  unrepliedCount: number;
  highRiskCount: number;
} {
  return {
    total: reviews.length,
    averageRating: calculateAverageRating(reviews),
    negativeRate: calculateNegativeRate(reviews),
    replyRate: calculateReplyRate(reviews),
    unrepliedCount: countUnrepliedReviews(reviews),
    highRiskCount: reviews.filter(r => r.risk === 'high').length,
  };
}
