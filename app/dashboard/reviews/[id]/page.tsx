'use client';

import { ReviewDetail } from '@/components/reviews/review-detail';
import { AIPanel } from '@/components/reviews/ai-panel';
import { ReplyEditor } from '@/components/reviews/reply-editor';
import { TodoGenerator } from '@/components/reviews/todo-generator';
import { NotificationLog } from '@/components/reviews/notification-log';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorMessage } from '@/components/common/error-message';
import { useReview } from '@/lib/hooks/useReviews';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  // カスタムフックでレビューデータを取得
  const { review, loading, error, refetch } = useReview(params.id);

  // ローディング状態
  if (loading) {
    return <LoadingSpinner text="レビューを読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/inbox">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Inboxに戻る
          </Link>
        </Button>
        <ErrorMessage error={error} onRetry={refetch} />
      </div>
    );
  }

  // レビューが見つからない場合
  if (!review) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/inbox">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Inboxに戻る
          </Link>
        </Button>
        <ErrorMessage
          error={new Error('レビューが見つかりませんでした')}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/inbox">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Inboxに戻る
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">レビュー詳細</h1>
          <p className="text-gray-700 mt-1">ID: {review.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ReviewDetail review={review} />
          <ReplyEditor review={review} />
        </div>

        <div className="space-y-6">
          <AIPanel review={review} />
          <TodoGenerator review={review} />
          <NotificationLog />
        </div>
      </div>
    </div>
  );
}
