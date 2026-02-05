'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/common/star-rating';
import { StatusBadge } from '@/components/common/status-badge';
import { RiskBadge } from '@/components/common/risk-badge';
import { Review } from '@/lib/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Brain, Sparkles, AlertCircle, Copy, Save, Send, CheckCircle2 } from 'lucide-react';
import { saveReplyDraft, updateReviewReply } from '@/lib/api/reviews';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InlineLoadingSpinner } from '@/components/common/loading-spinner';

interface ReviewSlideOverProps {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewSlideOver({ review: initialReview, open, onOpenChange }: ReviewSlideOverProps) {
  const [review, setReview] = useState(initialReview);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState(review.replyDraft || review.reply || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [replySuccess, setReplySuccess] = useState<string | null>(null);

  // AI分析が実行済みかどうかを判定
  const hasAnalysis = review.aiSummary !== null && review.aiSummary !== '';
  const hasExistingReply = !!review.reply;

  // AI分析を実行
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const response = await fetch(`/api/reviews/${review.id}/analyze`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'AI分析に失敗しました' }));
        throw new Error(errorData.error || 'AI分析に失敗しました');
      }
      
      const data = await response.json();
      console.log('✅ AI分析レスポンス:', data);
      
      // analysisオブジェクトから分析結果を取得
      const analysis = data.analysis;
      
      if (!analysis) {
        throw new Error('AI分析結果が取得できませんでした');
      }
      
      // レビューデータを更新
      setReview({
        ...review,
        aiSummary: analysis.summary,
        aiCategories: analysis.categories,
        risk: analysis.risk,
        aiRiskReason: analysis.riskReason,
        replyDraft: analysis.replyDraft,
      });
      
      // 返信案も更新
      if (analysis.replyDraft && !replyText) {
        setReplyText(analysis.replyDraft);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI分析に失敗しました';
      setAnalysisError(errorMessage);
      console.error('AI分析エラー:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(replyText);
    alert('返信案をコピーしました');
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveReplyDraft(review.id, replyText);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('下書き保存エラー:', error);
      alert('下書きの保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!replyText.trim()) {
      setReplyError('返信内容を入力してください');
      return;
    }

    const confirmMessage = hasExistingReply
      ? 'この返信を更新してもよろしいですか？'
      : 'この返信を公開してもよろしいですか？';

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setIsPublishing(true);
      setReplyError(null);
      setReplySuccess(null);
      
      await updateReviewReply(review.id, replyText);
      
      setReplySuccess(hasExistingReply ? '返信を更新しました' : '返信を公開しました');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('返信投稿エラー:', err);
      setReplyError(err instanceof Error ? err.message : '返信の投稿に失敗しました');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto bg-gray-50">
        <SheetHeader>
          <SheetTitle className="text-gray-600">レビュー詳細</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* レビュー基本情報 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <StarRating rating={review.rating} size="lg" showNumber />
              <div className="flex gap-2">
                <StatusBadge status={review.status} />
                <RiskBadge risk={review.risk} />
              </div>
            </div>

            <div className="text-sm text-gray-700">
              {format(new Date(review.date), 'yyyy年M月d日', { locale: ja })} · Google
            </div>

            <div className="font-semibold text-gray-800">{review.authorName}</div>
          </div>

          {/* レビュー本文 */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm leading-relaxed text-gray-600">{review.text}</p>
          </div>

          {/* AI分析セクション */}
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-600">AI分析</h3>
              </div>
              {!hasAnalysis && (
                <Button
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="gap-2 text-gray-500"
                >
                  <Sparkles className="h-4 w-4 text-gray-500" />
                  {isAnalyzing ? 'AI分析中...' : 'AI分析を実行'}
                </Button>
              )}
            </div>

            {analysisError && (
              <div className="rounded-lg bg-red-50 p-3 flex items-start gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-900 font-medium">エラーが発生しました</p>
                  <p className="text-sm text-red-700 mt-1">{analysisError}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="mt-2"
                  >
                    再試行
                  </Button>
                </div>
              </div>
            )}

            {!hasAnalysis && !analysisError ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-4">
                  AI分析を実行すると、レビューの要約、カテゴリ、リスクレベル、返信案が自動生成されます。
                </p>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="gap-2 text-gray-600"
                >
                  <Sparkles className="h-4 w-4 text-gray-600" />
                  {isAnalyzing ? 'AI分析中...' : 'AI分析を実行'}
                </Button>
              </div>
            ) : hasAnalysis ? (
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-600">要約</h4>
                  <div className="rounded-lg p-3">
                    <p className="text-sm leading-relaxed text-gray-600">{review.aiSummary}</p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-600">カテゴリ</h4>
                  <div className="flex flex-wrap gap-2">
                    {review.aiCategories && review.aiCategories.length > 0 ? (
                      review.aiCategories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-gray-400">
                          {category}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">カテゴリなし</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-600">リスクレベル</h4>
                  <div className="flex items-start gap-2">
                    <RiskBadge risk={review.risk} />
                  </div>
                  {review.aiRiskReason && (
                    <p className="mt-2 text-sm text-gray-700">{review.aiRiskReason}</p>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  再分析
                </Button>
              </div>
            ) : null}
          </div>

          {/* 返信エディタセクション */}
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-600">{hasExistingReply ? '返信を編集' : '返信案'}</h3>
              </div>
            </div>

            {replyError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{replyError}</AlertDescription>
              </Alert>
            )}

            {replySuccess && (
              <Alert className="border-green-500 bg-green-50 text-green-900 mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{replySuccess}</AlertDescription>
              </Alert>
            )}

            {hasExistingReply && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  この返信は既にGoogleに公開されています。編集すると上書きされます。
                </AlertDescription>
              </Alert>
            )}

            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="返信を入力してください..."
              className="min-h-[150px] mb-4 text-gray-600"
              disabled={isPublishing}
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex-1"
                disabled={isSaving || isPublishing}
              >
                <Copy className="mr-2 h-4 w-4" />
                コピー
              </Button>
              <Button
                variant="outline"
                onClick={handleSave}
                className="flex-1"
                disabled={isSaving || isPublishing}
              >
                {isSaving ? (
                  <>
                    <InlineLoadingSpinner className="mr-2" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaved ? '保存済み' : '下書き保存'}
                  </>
                )}
              </Button>
              <Button
                onClick={handlePublish}
                className="flex-1 text-gray-800"
                disabled={isSaving || isPublishing}
              >
                {isPublishing ? (
                  <>
                    <InlineLoadingSpinner className="mr-2" />
                    {hasExistingReply ? '更新中...' : '公開中...'}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4 text-gray-600" />
                    {hasExistingReply ? '更新' : '公開'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
