'use client';

import { ReviewFilters } from '@/components/inbox/review-filters';
import { ReviewTable } from '@/components/inbox/review-table';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorMessage } from '@/components/common/error-message';
import { useReviews } from '@/lib/hooks/useReviews';
import { useFilterStore } from '@/lib/store';
import { filterReviews } from '@/lib/services/review-filters';
import {
  countUnrepliedReviews,
  countHighRiskUnrepliedReviews,
} from '@/lib/services/review-stats';
import { useMemo } from 'react';

export default function InboxPage() {
  // カスタムフックでレビューデータを取得
  const { reviews, loading, error, refetch } = useReviews();
  
  // Zustandからフィルタ状態を取得
  const { statusFilter, ratingFilter, searchQuery } = useFilterStore();

  // サービス関数でフィルタリング
  const filteredReviews = useMemo(
    () => filterReviews(reviews, { statusFilter, ratingFilter, searchQuery, periodFilter: '30days' }),
    [reviews, statusFilter, ratingFilter, searchQuery]
  );

  // 統計情報を計算
  const unrepliedCount = useMemo(() => countUnrepliedReviews(reviews), [reviews]);
  const actionRequiredCount = useMemo(() => countHighRiskUnrepliedReviews(reviews), [reviews]);
  const respondedCount = useMemo(
    () => reviews.filter(r => r.status === 'replied' || r.status === 'auto_replied').length,
    [reviews]
  );

  // ローディング状態
  if (loading) {
    return <LoadingSpinner text="レビューを読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review Inbox</h1>
        <p className="text-gray-700 mt-1">すべてのレビューを一元管理</p>
      </div>

      <ReviewFilters
        unrepliedCount={unrepliedCount}
        actionRequiredCount={actionRequiredCount}
        respondedCount={respondedCount}
      />

      <ReviewTable reviews={filteredReviews} />
    </div>
  );
}
