import { ReviewDetail } from '@/components/reviews/review-detail';
import { AIPanel } from '@/components/reviews/ai-panel';
import { ReplyEditor } from '@/components/reviews/reply-editor';
import { TodoGenerator } from '@/components/reviews/todo-generator';
import { NotificationLog } from '@/components/reviews/notification-log';
import { Button } from '@/components/ui/button';
import { getReviewById } from '@/lib/mock/reviews';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const review = getReviewById(params.id);

  if (!review) {
    notFound();
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
