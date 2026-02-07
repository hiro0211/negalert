'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { ReviewGrowthChart } from '@/components/dashboard/review-growth-chart';
import { RatingBreakdown } from '@/components/dashboard/rating-breakdown';
import { NegativeFactors } from '@/components/dashboard/negative-factors';
import { PriorityWidget } from '@/components/dashboard/priority-widget';
import { AIReportCard } from '@/components/dashboard/ai-report-card';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorMessage } from '@/components/common/error-message';
import { useDashboardStats } from '@/lib/hooks/useStats';
import { useReviews } from '@/lib/hooks/useReviews';
// TODO機能を一時的に非表示
// import { useTodos } from '@/lib/hooks/useTodos';
import { countUnrepliedNegativeReviews } from '@/lib/services/review-stats';
import { Star, MessageSquare, TrendingDown, Reply, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  // カスタムフックでデータを取得
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { reviews, loading: reviewsLoading } = useReviews();
  // TODO機能を一時的に非表示
  // const { todos, loading: todosLoading } = useTodos();

  // 統計情報を計算
  const unrepliedNegative = useMemo(
    () => countUnrepliedNegativeReviews(reviews),
    [reviews]
  );
  // TODO機能を一時的に非表示
  // const pendingTodos = useMemo(
  //   () => todos.filter(t => !t.completed).length,
  //   [todos]
  // );
  const pendingTodos = 0; // TODO機能を一時的に非表示のため0を設定

  // ローディング状態
  // TODO機能を一時的に非表示のため todosLoading を削除
  if (statsLoading || reviewsLoading) {
    return <LoadingSpinner text="ダッシュボードを読み込んでいます..." />;
  }

  // エラー状態
  if (statsError) {
    return <ErrorMessage error={statsError} onRetry={refetchStats} />;
  }

  // データが存在しない場合（レビューがゼロ件）
  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <MessageSquare className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">レビューデータがありません</h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            ヘッダーの「レビューを更新」ボタンをクリックして、Google Business Profileからレビューを取得してください。
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              初回ログイン時は自動的に同期を試みていますが、データがまだ取得されていない可能性があります。
              数秒後にページを更新するか、手動で同期ボタンをクリックしてください。
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            ページを更新
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-800 mt-1">レビュー管理の概要</p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="平均★評価"
          value={stats.averageRating.toFixed(2)}
          change={stats.changes?.averageRating}
          icon={Star}
          trend={stats.changes?.averageRating && stats.changes.averageRating > 0 ? 'up' : stats.changes?.averageRating && stats.changes.averageRating < 0 ? 'down' : undefined}
          valueClassName="text-green-600"
        />
        <StatsCard
          title="レビュー総数"
          value={stats.totalReviews}
          change={stats.changes?.totalReviews}
          icon={MessageSquare}
          trend={stats.changes?.totalReviews && stats.changes.totalReviews > 0 ? 'up' : stats.changes?.totalReviews && stats.changes.totalReviews < 0 ? 'down' : undefined}
        />
        <StatsCard
          title="ネガティブ率"
          value={`${stats.negativeRate.toFixed(1)}%`}
          change={stats.changes?.negativeRate}
          icon={TrendingDown}
          trend={stats.changes?.negativeRate && stats.changes.negativeRate > 0 ? 'up' : stats.changes?.negativeRate && stats.changes.negativeRate < 0 ? 'down' : undefined}
          valueClassName="text-red-600"
        />
        <StatsCard
          title="返信率"
          value={`${stats.replyRate.toFixed(1)}%`}
          change={stats.changes?.replyRate}
          icon={Reply}
          trend={stats.changes?.replyRate && stats.changes.replyRate > 0 ? 'up' : stats.changes?.replyRate && stats.changes.replyRate < 0 ? 'down' : undefined}
          valueClassName="text-blue-600"
        />
      </div>

      <AIReportCard />

      {/* TODO機能を一時的に非表示 */}
      {/* <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReviewGrowthChart data={stats.reviewGrowth} />
        </div>
        <PriorityWidget
          unrepliedNegativeCount={unrepliedNegative}
          pendingTodosCount={pendingTodos}
        />
      </div> */}

      <ReviewGrowthChart data={stats.reviewGrowth} />

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <RatingBreakdown data={stats.ratingDistribution} />
        <NegativeFactors data={stats.negativeFactors} />
      </div>
    </div>
  );
}
