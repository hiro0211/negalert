import { StatsCard } from '@/components/dashboard/stats-card';
import { ReviewGrowthChart } from '@/components/dashboard/review-growth-chart';
import { RatingBreakdown } from '@/components/dashboard/rating-breakdown';
import { NegativeFactors } from '@/components/dashboard/negative-factors';
import { PriorityWidget } from '@/components/dashboard/priority-widget';
import { mockStats } from '@/lib/mock/stats';
import { getUnrepliedReviews, getNegativeReviews } from '@/lib/mock/reviews';
import { mockTodos } from '@/lib/mock/todos';
import { Star, MessageSquare, TrendingDown, Reply } from 'lucide-react';

export default function DashboardPage() {
  const unrepliedNegative = getUnrepliedReviews().filter(r => r.rating <= 3).length;
  const pendingTodos = mockTodos.filter(t => !t.completed).length;

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
          value={mockStats.averageRating.toFixed(2)}
          change={0.3}
          icon={Star}
          trend="up"
          valueClassName="text-green-600"
        />
        <StatsCard
          title="レビュー総数"
          value={mockStats.totalReviews}
          change={12}
          icon={MessageSquare}
          trend="up"
        />
        <StatsCard
          title="ネガティブ率"
          value={`${mockStats.negativeRate.toFixed(1)}%`}
          icon={TrendingDown}
          valueClassName="text-red-600"
        />
        <StatsCard
          title="返信率"
          value={`${mockStats.replyRate.toFixed(1)}%`}
          icon={Reply}
          valueClassName="text-blue-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReviewGrowthChart data={mockStats.reviewGrowth} />
        </div>
        <PriorityWidget
          unrepliedNegativeCount={unrepliedNegative}
          pendingTodosCount={pendingTodos}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RatingBreakdown data={mockStats.ratingDistribution} />
        <NegativeFactors data={mockStats.negativeFactors} />
      </div>
    </div>
  );
}
