'use client';

import { use } from 'react';
import { ReviewDetail } from '@/components/reviews/review-detail';
import { AIPanel } from '@/components/reviews/ai-panel';
import { ReplyEditor } from '@/components/reviews/reply-editor';
// TODO機能を一時的に非表示
// import { TodoGenerator } from '@/components/reviews/todo-generator';
import { NotificationLog } from '@/components/reviews/notification-log';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorMessage } from '@/components/common/error-message';
import { useReview } from '@/lib/hooks/useReviews';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // paramsをアンラップ
  const { id } = use(params);
  
  // カスタムフックでレビューデータを取得
  const { review, loading, error, refetch, updateReview } = useReview(id);

  // 返信更新後のコールバック
  const handleReplyUpdated = () => {
    // レビューデータを再取得
    refetch();
  };

  // AI分析完了後のコールバック
  const handleAnalysisComplete = (data?: any) => {
    console.log('🔄 AI分析完了コールバック:', data);
    
    if (data && data.success && data.analysis) {
      // モックモード: APIレスポンスから直接UIを更新
      updateReview({
        aiSummary: data.analysis.summary,
        aiCategories: data.analysis.categories,
        aiRiskReason: data.analysis.riskReason,
        risk: data.analysis.risk,
        replyDraft: data.analysis.replyDraft,
      });
      console.log('✅ UI更新完了（モックモード）');
    } else {
      // 通常モード: DBから再取得
      refetch();
    }
  };

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
          <ReplyEditor review={review} onReplyUpdated={handleReplyUpdated} />
        </div>

        <div className="space-y-6">
          <AIPanel review={review} onAnalysisComplete={handleAnalysisComplete} />
          {/* TODO機能を一時的に非表示 */}
          {/* <TodoGenerator review={review} /> */}
          <NotificationLog />
        </div>
      </div>
    </div>
  );
}
