'use client';

import { ReviewFilters } from '@/components/inbox/review-filters';
import { ReviewTable } from '@/components/inbox/review-table';
import { mockReviews, getUnrepliedReviews, getNegativeReviews } from '@/lib/mock/reviews';
import { useFilterStore } from '@/lib/store';
import { useMemo } from 'react';

export default function InboxPage() {
  const { statusFilter, ratingFilter, searchQuery } = useFilterStore();

  const filteredReviews = useMemo(() => {
    let filtered = [...mockReviews];

    // ステータスフィルタ
    if (statusFilter === 'unreplied') {
      filtered = filtered.filter(r => r.status === 'unreplied');
    } else if (statusFilter === 'replied') {
      filtered = filtered.filter(r => r.status === 'replied' || r.status === 'auto_replied');
    }

    // 評価フィルタ
    if (ratingFilter === 'negative') {
      filtered = filtered.filter(r => r.rating <= 3);
    }

    // 検索クエリ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.text.toLowerCase().includes(query) ||
          r.authorName.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [statusFilter, ratingFilter, searchQuery]);

  const unrepliedCount = getUnrepliedReviews().length;
  const actionRequiredCount = mockReviews.filter(r => r.status === 'unreplied' && r.risk === 'high').length;
  const respondedCount = mockReviews.filter(r => r.status === 'replied' || r.status === 'auto_replied').length;

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
