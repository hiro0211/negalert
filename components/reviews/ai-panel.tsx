'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '@/components/ui/select';
import { RiskBadge } from '@/components/common/risk-badge';
import { Review } from '@/lib/types';
import { Brain, Sparkles, AlertCircle, Plus, Settings } from 'lucide-react';
import { useReplyStyles } from '@/lib/hooks/useReplyStyles';
import { useRouter } from 'next/navigation';

interface AIPanelProps {
  review: Review;
  onAnalysisComplete?: (updatedReview?: any) => void; // 分析完了時のコールバック（更新データを渡す）
}

export function AIPanel({ review, onAnalysisComplete }: AIPanelProps) {
  const router = useRouter();
  const [selectedStyleId, setSelectedStyleId] = useState<string>('default');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  
  // AI分析を実行
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    
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
      
      // レスポンスデータを取得
      const data = await response.json();
      console.log('✅ AI分析レスポンス:', data);
      
      // 成功時は親コンポーネントに更新データを渡す
      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI分析に失敗しました';
      setError(errorMessage);
      console.error('AI分析エラー:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStyleChange = (value: string) => {
    if (value === 'create-new') {
      router.push('/dashboard/settings/reply-styles');
    } else {
      setSelectedStyleId(value);
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 返信スタイル選択 */}
        {!hasAnalysis && isMounted && (
          <div className="space-y-2 pb-4 border-b">
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
              AI分析を実行すると、レビューの要約、カテゴリ、リスクレベル、返信案が自動生成されます。
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
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
