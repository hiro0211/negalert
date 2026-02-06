/**
 * ダッシュボード統計データのモック
 * Google OAuth審査用デモ動画作成のための静的統計データ
 */

import { DashboardStats } from '../types';
import { mockReviews } from './mock-data';

/**
 * モックレビューデータから統計を計算
 */
function calculateMockStats(): DashboardStats {
  // 全レビュー数
  const totalReviews = mockReviews.length;
  
  // 平均評価を計算
  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  
  // ネガティブレビュー数（★3以下）
  const negativeCount = mockReviews.filter(r => r.rating <= 3).length;
  const negativeRate = (negativeCount / totalReviews) * 100;
  
  // 返信済みレビュー数
  const repliedCount = mockReviews.filter(r => 
    r.status === 'replied' || r.status === 'auto_replied'
  ).length;
  const replyRate = (repliedCount / totalReviews) * 100;
  
  // 星評価分布
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: mockReviews.filter(r => r.rating === rating).length,
  }));
  
  // レビュー推移（過去6ヶ月のシミュレーション）
  const reviewGrowth = [
    { month: '1月', count: 2 },
    { month: '2月', count: 3 },
    { month: '3月', count: 4 },
    { month: '4月', count: 3 },
    { month: '5月', count: 6 },
    { month: '6月', count: 2 }, // 今月（まだ月初）
  ];
  
  // ネガティブ要因（AI分析カテゴリから集計）
  const categoryCount: Record<string, number> = {};
  mockReviews
    .filter(r => r.rating <= 3)
    .forEach(r => {
      if (r.aiCategories) {
        r.aiCategories.forEach(category => {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
      }
    });
  
  const negativeFactors = Object.entries(categoryCount)
    .map(([factor, count]) => ({ factor, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // TOP5
  
  // 前月比（デモ用の値）
  const changes = {
    averageRating: 0.3,      // +0.3点
    totalReviews: 2,         // +2件
    negativeRate: -5.2,      // -5.2%（改善）
    replyRate: 8.5,          // +8.5%（改善）
  };
  
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
 * モック統計データ（事前計算）
 */
export const mockDashboardStats: DashboardStats = calculateMockStats();

/**
 * モックダッシュボード統計データを取得
 */
export async function getMockDashboardStats(): Promise<DashboardStats> {
  // APIコールをシミュレート（遅延）
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDashboardStats;
}

/**
 * モックレビュー推移データを取得
 */
export async function getMockReviewGrowth(months: number = 6): Promise<{ month: string; count: number }[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // 指定月数分のデータを返す
  const data = mockDashboardStats.reviewGrowth;
  return data.slice(-months);
}

/**
 * モック星評価分布を取得
 */
export async function getMockRatingDistribution(): Promise<{ rating: number; count: number }[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockDashboardStats.ratingDistribution;
}

/**
 * モックネガティブ要因を取得
 */
export async function getMockNegativeFactors(): Promise<{ factor: string; count: number }[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockDashboardStats.negativeFactors;
}

/**
 * 期間指定でモック統計データを取得
 */
export async function getMockStatsByPeriod(
  startDate: Date,
  endDate: Date
): Promise<DashboardStats> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // デモ用: 期間に関わらず同じデータを返す
  // 実際の実装では期間でフィルタリングする
  return mockDashboardStats;
}
