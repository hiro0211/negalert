/**
 * レビューフィルタリングロジック
 * UIから分離したビジネスロジック層
 */

import { Review, FilterState } from '../types';

/**
 * フィルタ条件に基づいてレビューをフィルタリング
 * 
 * @param reviews - レビュー一覧
 * @param filters - フィルタ条件
 * @returns フィルタリングされたレビュー一覧
 */
export function filterReviews(
  reviews: Review[],
  filters: FilterState
): Review[] {
  let filtered = [...reviews];

  // ステータスフィルタ
  if (filters.statusFilter === 'unreplied') {
    filtered = filtered.filter(r => r.status === 'unreplied');
  } else if (filters.statusFilter === 'replied') {
    filtered = filtered.filter(
      r => r.status === 'replied' || r.status === 'auto_replied'
    );
  }

  // 評価フィルタ
  if (filters.ratingFilter === 'negative') {
    filtered = filtered.filter(r => r.rating <= 3);
  }

  // 検索クエリ
  if (filters.searchQuery) {
    filtered = searchReviews(filtered, filters.searchQuery);
  }

  // 日付順にソート（新しい順）
  return filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * 検索クエリでレビューを検索
 * レビュー本文と投稿者名を対象に検索
 * 
 * @param reviews - レビュー一覧
 * @param query - 検索クエリ
 * @returns 検索結果
 */
export function searchReviews(reviews: Review[], query: string): Review[] {
  const lowerQuery = query.toLowerCase();
  
  return reviews.filter(
    review =>
      review.text.toLowerCase().includes(lowerQuery) ||
      review.authorName.toLowerCase().includes(lowerQuery) ||
      (review.aiSummary && review.aiSummary.toLowerCase().includes(lowerQuery)) ||
      (review.aiCategories && review.aiCategories.some(cat => cat.toLowerCase().includes(lowerQuery)))
  );
}

/**
 * リスクレベルでレビューをフィルタリング
 * 
 * @param reviews - レビュー一覧
 * @param risk - リスクレベル
 * @returns フィルタリングされたレビュー一覧
 */
export function filterByRisk(
  reviews: Review[],
  risk: 'high' | 'medium' | 'low'
): Review[] {
  return reviews.filter(r => r.risk === risk);
}

/**
 * 評価でレビューをフィルタリング
 * 
 * @param reviews - レビュー一覧
 * @param rating - 評価（1-5）
 * @returns フィルタリングされたレビュー一覧
 */
export function filterByRating(
  reviews: Review[],
  rating: 1 | 2 | 3 | 4 | 5
): Review[] {
  return reviews.filter(r => r.rating === rating);
}

/**
 * 期間でレビューをフィルタリング
 * 
 * @param reviews - レビュー一覧
 * @param startDate - 開始日
 * @param endDate - 終了日
 * @returns フィルタリングされたレビュー一覧
 */
export function filterByPeriod(
  reviews: Review[],
  startDate: Date,
  endDate: Date
): Review[] {
  return reviews.filter(review => {
    const reviewDate = new Date(review.date);
    return reviewDate >= startDate && reviewDate <= endDate;
  });
}

/**
 * 最近N日間のレビューを取得
 * 
 * @param reviews - レビュー一覧
 * @param days - 日数
 * @returns フィルタリングされたレビュー一覧
 */
export function filterByRecentDays(reviews: Review[], days: number): Review[] {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return reviews.filter(review => new Date(review.date) >= startDate);
}

/**
 * カテゴリでレビューをフィルタリング
 * 
 * @param reviews - レビュー一覧
 * @param category - カテゴリ名
 * @returns フィルタリングされたレビュー一覧
 */
export function filterByCategory(reviews: Review[], category: string): Review[] {
  return reviews.filter(review =>
    review.aiCategories && review.aiCategories.includes(category)
  );
}

/**
 * ソースでレビューをフィルタリング
 * 
 * @param reviews - レビュー一覧
 * @param source - ソース（現在は'google'のみ）
 * @returns フィルタリングされたレビュー一覧
 */
export function filterBySource(
  reviews: Review[],
  source: 'google'
): Review[] {
  return reviews.filter(r => r.source === source);
}

/**
 * 複数条件でレビューをフィルタリング（高度な検索）
 * 
 * @param reviews - レビュー一覧
 * @param conditions - フィルタ条件オブジェクト
 * @returns フィルタリングされたレビュー一覧
 */
export function advancedFilterReviews(
  reviews: Review[],
  conditions: {
    status?: FilterState['statusFilter'];
    rating?: 1 | 2 | 3 | 4 | 5;
    risk?: 'high' | 'medium' | 'low';
    category?: string;
    startDate?: Date;
    endDate?: Date;
    searchQuery?: string;
  }
): Review[] {
  let filtered = [...reviews];

  if (conditions.status) {
    if (conditions.status === 'unreplied') {
      filtered = filtered.filter(r => r.status === 'unreplied');
    } else if (conditions.status === 'replied') {
      filtered = filtered.filter(
        r => r.status === 'replied' || r.status === 'auto_replied'
      );
    }
  }

  if (conditions.rating) {
    filtered = filterByRating(filtered, conditions.rating);
  }

  if (conditions.risk) {
    filtered = filterByRisk(filtered, conditions.risk);
  }

  if (conditions.category) {
    filtered = filterByCategory(filtered, conditions.category);
  }

  if (conditions.startDate && conditions.endDate) {
    filtered = filterByPeriod(filtered, conditions.startDate, conditions.endDate);
  }

  if (conditions.searchQuery) {
    filtered = searchReviews(filtered, conditions.searchQuery);
  }

  return filtered;
}
