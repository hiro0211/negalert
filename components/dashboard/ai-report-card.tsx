'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InlineLoadingSpinner } from '@/components/common/loading-spinner';
import { FileText, TrendingUp, AlertCircle, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface WeeklyReport {
  overallSentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  goodPoints: string[];
  badPoints: string[];
  actionPlan: string;
}

interface Period {
  startDate: string;
  endDate: string;
}

export function AIReportCard() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [period, setPeriod] = useState<Period | null>(null);
  const [reviewCount, setReviewCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'レポートの生成に失敗しました');
      }

      setReport(data.report);
      setPeriod(data.period);
      setReviewCount(data.reviewCount);
    } catch (err) {
      console.error('レポート生成エラー:', err);
      setError(err instanceof Error ? err.message : 'レポートの生成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // センチメントに応じたバッジの色とアイコン
  const getSentimentBadge = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <TrendingUp className="h-3 w-3 mr-1" />
            良好
          </Badge>
        );
      case 'neutral':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Sparkles className="h-3 w-3 mr-1" />
            普通
          </Badge>
        );
      case 'negative':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            要改善
          </Badge>
        );
    }
  };

  // 期間の表示フォーマット
  const formatPeriod = (period: Period) => {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    return `${format(start, 'yyyy/MM/dd', { locale: ja })} 〜 ${format(end, 'yyyy/MM/dd', { locale: ja })}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-700" />
          <CardTitle className="text-lg font-semibold text-gray-700">週間レポート</CardTitle>
        </div>
        <Button
          onClick={handleGenerateReport}
          disabled={loading}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <InlineLoadingSpinner className="mr-2" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              レポートを作成
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {/* 期間表示 */}
        {period && (
          <div className="mb-4 text-sm text-gray-600">
            <span className="font-medium">集計対象:</span> {formatPeriod(period)}
            {reviewCount !== null && (
              <span className="ml-2">（{reviewCount}件のレビュー）</span>
            )}
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">エラーが発生しました</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* レポート表示 */}
        {report && !error && (
          <div className="space-y-4">
            {/* 総合評価 */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">総合評価:</span>
              {getSentimentBadge(report.overallSentiment)}
            </div>

            {/* 総評 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-800 leading-relaxed">{report.summary}</p>
            </div>

            {/* 良かった点 */}
            {report.goodPoints.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  良かった点
                </h4>
                <ul className="space-y-2">
                  {report.goodPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 font-bold mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 改善点 */}
            {report.badPoints.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-orange-600" />
                  改善点
                </h4>
                <ul className="space-y-2">
                  {report.badPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* アクションプラン */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                来週のアクションプラン
              </h4>
              <p className="text-sm text-blue-800">{report.actionPlan}</p>
            </div>
          </div>
        )}

        {/* 初期状態（レポート未生成） */}
        {!report && !error && !loading && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              「レポートを作成」ボタンをクリックして、
              <br />
              直近7日間のレビューを分析します
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
