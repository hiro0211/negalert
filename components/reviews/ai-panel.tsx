'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RiskBadge } from '@/components/common/risk-badge';
import { Review } from '@/lib/types';
import { Brain, Sparkles, AlertCircle } from 'lucide-react';

interface AIPanelProps {
  review: Review;
  onAnalysisComplete?: () => void; // 分析完了時のコールバック
}

export function AIPanel({ review, onAnalysisComplete }: AIPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // AI分析が実行済みかどうかを判定
  const hasAnalysis = review.aiSummary !== null && review.aiSummary !== '';
  
  // AI分析を実行
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/reviews/${review.id}/analyze`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'AI分析に失敗しました' }));
        throw new Error(errorData.error || 'AI分析に失敗しました');
      }
      
      // 成功時は親コンポーネントのrefetch()を呼び出す
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI分析に失敗しました';
      setError(errorMessage);
      console.error('AI分析エラー:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI分析
          </div>
          {!hasAnalysis && (
            <Button
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isAnalyzing ? 'AI分析中...' : 'AI分析を実行'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-900 font-medium">エラーが発生しました</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
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
        
        {!hasAnalysis && !error ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-4">
              AI分析を実行すると、レビューの要約、カテゴリ、リスクレベルが自動生成されます。
            </p>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isAnalyzing ? 'AI分析中...' : 'AI分析を実行'}
            </Button>
          </div>
        ) : hasAnalysis ? (
          <>
            <div>
              <h4 className="mb-2 text-sm font-semibold">要約</h4>
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-sm leading-relaxed text-blue-900">{review.aiSummary}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">カテゴリ</h4>
              <div className="flex flex-wrap gap-2">
                {review.aiCategories && review.aiCategories.length > 0 ? (
                  review.aiCategories.map((category, index) => (
                    <Badge key={index} variant="outline">
                      {category}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">カテゴリなし</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">リスクレベル</h4>
              <div className="flex items-start gap-2">
                <RiskBadge risk={review.risk} />
              </div>
              {review.aiRiskReason && (
                <p className="mt-2 text-sm text-gray-700">{review.aiRiskReason}</p>
              )}
            </div>
            
            {review.replyDraft && (
              <div>
                <h4 className="mb-2 text-sm font-semibold">AI生成返信案</h4>
                <div className="rounded-lg bg-green-50 p-3 border border-green-200">
                  <p className="text-sm leading-relaxed text-green-900">{review.replyDraft}</p>
                </div>
              </div>
            )}
            
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
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
