'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { ReviewGrowthChart } from '@/components/dashboard/review-growth-chart';
import { RatingBreakdown } from '@/components/dashboard/rating-breakdown';
import { NegativeFactors } from '@/components/dashboard/negative-factors';
import { PriorityWidget } from '@/components/dashboard/priority-widget';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorMessage } from '@/components/common/error-message';
import { useDashboardStats } from '@/lib/hooks/useStats';
import { useReviews } from '@/lib/hooks/useReviews';
import { useTodos } from '@/lib/hooks/useTodos';
import { countUnrepliedNegativeReviews } from '@/lib/services/review-stats';
import { Star, MessageSquare, TrendingDown, Reply } from 'lucide-react';
import { useMemo } from 'react';

export default function DashboardPage() {
  // カスタムフックでデータを取得
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { reviews, loading: reviewsLoading } = useReviews();
  const { todos, loading: todosLoading } = useTodos();

  // 統計情報を計算
  const unrepliedNegative = useMemo(
    () => countUnrepliedNegativeReviews(reviews),
    [reviews]
  );
  const pendingTodos = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos]
  );

  // ローディング状態
  if (statsLoading || reviewsLoading || todosLoading) {
    return <LoadingSpinner text="ダッシュボードを読み込んでいます..." />;
  }

  // エラー状態
  if (statsError) {
    return <ErrorMessage error={statsError} onRetry={refetchStats} />;
  }

  // データが存在しない場合
  if (!stats) {
    return <ErrorMessage error={new Error('統計データが取得できませんでした')} onRetry={refetchStats} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-700 mt-1">レビュー管理の概要</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="平均★評価"
          value={stats.averageRating.toFixed(2)}
          change={0.3}
          icon={Star}
          trend="up"
          valueClassName="text-green-600"
        />
        <StatsCard
          title="レビュー総数"
          value={stats.totalReviews}
          change={12}
          icon={MessageSquare}
          trend="up"
        />
        <StatsCard
          title="ネガティブ率"
          value={`${stats.negativeRate.toFixed(1)}%`}
          icon={TrendingDown}
          valueClassName="text-red-600"
        />
        <StatsCard
          title="返信率"
          value={`${stats.replyRate.toFixed(1)}%`}
          icon={Reply}
          valueClassName="text-blue-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReviewGrowthChart data={stats.reviewGrowth} />
        </div>
        <PriorityWidget
          unrepliedNegativeCount={unrepliedNegative}
          pendingTodosCount={pendingTodos}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RatingBreakdown data={stats.ratingDistribution} />
        <NegativeFactors data={stats.negativeFactors} />
      </div>
    </div>
  );
}
