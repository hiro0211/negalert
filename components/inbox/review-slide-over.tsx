'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/common/star-rating';
import { StatusBadge } from '@/components/common/status-badge';
import { RiskBadge } from '@/components/common/risk-badge';
import { Review } from '@/lib/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ReviewSlideOverProps {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewSlideOver({ review, open, onOpenChange }: ReviewSlideOverProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>レビュー詳細</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
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

            <div className="font-semibold">{review.authorName}</div>
          </div>

          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm leading-relaxed">{review.text}</p>
          </div>

          {(review.aiSummary || review.aiCategories || review.aiRiskReason) && (
            <div className="space-y-3">
              <h3 className="font-semibold">AI分析</h3>
              
              {review.aiSummary && (
                <div className="rounded-lg border bg-blue-50 p-4">
                  <div className="text-sm">
                    <div className="font-medium text-blue-900">要約</div>
                    <p className="mt-1 text-blue-800">{review.aiSummary}</p>
                  </div>
                </div>
              )}

              {review.aiCategories && review.aiCategories.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">カテゴリ</div>
                  <div className="flex flex-wrap gap-2">
                    {review.aiCategories.map((category, index) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {review.aiRiskReason && (
                <div>
                  <div className="text-sm font-medium mb-2">リスク理由</div>
                  <p className="text-sm text-gray-700">{review.aiRiskReason}</p>
                </div>
              )}
            </div>
          )}

          {(review.replyDraft || review.reply) && (
            <div className="space-y-2">
              <h3 className="font-semibold">返信案</h3>
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="text-sm">{review.reply || review.replyDraft}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href={`/dashboard/reviews/${review.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                完全版で開く
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
