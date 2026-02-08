'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '@/components/ui/select';
import { StarRating } from '@/components/common/star-rating';
import { StatusBadge } from '@/components/common/status-badge';
import { RiskBadge } from '@/components/common/risk-badge';
import { Review } from '@/lib/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Brain, Sparkles, AlertCircle, Copy, Send, CheckCircle2, Plus } from 'lucide-react';
import { updateReviewReply } from '@/lib/api/reviews';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InlineLoadingSpinner } from '@/components/common/loading-spinner';
import { useToast } from '@/lib/hooks/useToast';
import { useReplyStyles } from '@/lib/hooks/useReplyStyles';
import { useRouter } from 'next/navigation';

interface ReviewSlideOverProps {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewSlideOver({ review: initialReview, open, onOpenChange }: ReviewSlideOverProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [review, setReview] = useState(initialReview);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('default');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState(review.reply || '');
  const [isPublishing, setIsPublishing] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [replySuccess, setReplySuccess] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドでのみマウント状態を設定
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // クライアントサイドでのみスタイルを取得
  const { replyStyles, loading: stylesLoading } = useReplyStyles();

  // デフォルトスタイルを自動選択
  useEffect(() => {
    if (isMounted) {
      const defaultStyle = replyStyles.find(s => s.isDefault);
      if (defaultStyle) {
        setSelectedStyleId(defaultStyle.id);
      }
    }
  }, [replyStyles, isMounted]);

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replyStyleId: selectedStyleId === 'default' ? null : selectedStyleId,
        }),
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

  const handleStyleChange = (value: string) => {
    if (value === 'create-new') {
      router.push('/dashboard/settings/reply-styles');
      onOpenChange(false); // スライドオーバーを閉じる
    } else {
      setSelectedStyleId(value);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(replyText);
    toast({
      title: "✓ コピーしました",
      description: "返信案をクリップボードにコピーしました",
    });
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
      <SheetContent className="w-full sm:w-[700px] sm:max-w-[90vw] overflow-y-auto bg-gray-50">
        <SheetHeader>
          <SheetTitle className="text-gray-600">レビュー詳細</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* レビュー基本情報 */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
            </div>

            {/* 返信スタイル選択 (分析前のみ) */}
            {!hasAnalysis && isMounted && (
              <div className="space-y-2 pb-4 border-b mb-4">
                <Label className="text-sm font-medium text-gray-700">返信スタイル</Label>
                <Select
                  value={selectedStyleId}
                  onValueChange={handleStyleChange}
                  disabled={isAnalyzing || stylesLoading}
                >
                  <SelectTrigger className="text-gray-700 bg-white border-gray-300">
                    <SelectValue placeholder="スタイルを選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="default" className="text-gray-700">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>標準</span>
                      </div>
                    </SelectItem>
                    {replyStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id} className="text-gray-700">
                        <div className="flex items-center gap-2">
                          {style.isDefault && <span className="text-blue-500">★</span>}
                          <span>{style.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    {replyStyles.length > 0 && <SelectSeparator />}
                    <SelectItem value="create-new" className="text-blue-600">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>新しいスタイルを作成...</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {selectedStyleId !== 'default' && (
                  <p className="text-xs text-gray-600">
                    {replyStyles.find(s => s.id === selectedStyleId)?.description || 'カスタムスタイルで返信案を生成します'}
                  </p>
                )}
              </div>
            )}

            {!hasAnalysis && (
              <div className="mb-4">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isAnalyzing ? 'AI分析中...' : 'AI分析を実行'}
                </Button>
              </div>
            )}

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

                {/* 再分析セクション */}
                {isMounted && (
                  <div className="pt-4 border-t space-y-2">
                    <Label className="text-sm font-medium text-gray-700">返信スタイルを変更して再分析</Label>
                    <Select
                      value={selectedStyleId}
                      onValueChange={handleStyleChange}
                      disabled={isAnalyzing || stylesLoading}
                    >
                      <SelectTrigger className="text-gray-700 bg-white border-gray-300">
                        <SelectValue placeholder="スタイルを選択" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="default" className="text-gray-700">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            <span>標準</span>
                          </div>
                        </SelectItem>
                        {replyStyles.map((style) => (
                          <SelectItem key={style.id} value={style.id} className="text-gray-700">
                            <div className="flex items-center gap-2">
                              {style.isDefault && <span className="text-blue-500">★</span>}
                              <span>{style.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                        {replyStyles.length > 0 && <SelectSeparator />}
                        <SelectItem value="create-new" className="text-blue-600">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            <span>新しいスタイルを作成...</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                )}
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

            <div className="space-y-3">
              {/* 公開ボタン（強調） */}
              <div className="space-y-2">
                <Button
                  onClick={handlePublish}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg font-semibold shadow-md"
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    <>
                      <InlineLoadingSpinner className="mr-2" />
                      {hasExistingReply ? '更新中...' : 'Googleに投稿中...'}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      {hasExistingReply ? 'Googleに返信を更新' : 'Googleに返信を投稿'}
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  このアプリから直接Googleレビューに返信できます
                </p>
              </div>

              {/* コピーボタン */}
              <Button
                variant="outline"
                onClick={handleCopy}
                className="w-full"
                disabled={isPublishing}
              >
                <Copy className="mr-2 h-4 w-4" />
                コピー
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
