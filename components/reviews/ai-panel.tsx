import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskBadge } from '@/components/common/risk-badge';
import { Review } from '@/lib/types';
import { Brain } from 'lucide-react';

interface AIPanelProps {
  review: Review;
}

export function AIPanel({ review }: AIPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI分析
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-semibold">要約</h4>
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-sm leading-relaxed text-blue-900">{review.aiSummary}</p>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">カテゴリ</h4>
          <div className="flex flex-wrap gap-2">
            {review.aiCategories.map((category, index) => (
              <Badge key={index} variant="outline">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">リスクレベル</h4>
          <div className="flex items-start gap-2">
            <RiskBadge risk={review.risk} />
          </div>
          <p className="mt-2 text-sm text-gray-700">{review.aiRiskReason}</p>
        </div>
      </CardContent>
    </Card>
  );
}
