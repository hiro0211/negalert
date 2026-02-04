'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/common/star-rating';
import { StatusBadge } from '@/components/common/status-badge';
import { RiskBadge } from '@/components/common/risk-badge';
import { Review } from '@/lib/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ReviewSlideOver } from './review-slide-over';

interface ReviewTableProps {
  reviews: Review[];
}

export function ReviewTable({ reviews }: ReviewTableProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] text-gray-700">日付</TableHead>
              <TableHead className="w-[100px] text-gray-700">ソース</TableHead>
              <TableHead className="w-[140px] text-gray-700">評価</TableHead>
              <TableHead className="text-gray-700">レビュー</TableHead>
              <TableHead className="w-[120px] text-gray-700">ステータス</TableHead>
              <TableHead className="w-[100px] text-gray-700">リスク</TableHead>
              <TableHead className="w-[100px] text-gray-700">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-sm">レビューがありません</p>
                    <p className="text-xs mt-1">Google Business Profileとの連携を確認してください</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
              <TableRow
                key={review.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedReview(review)}
              >
                <TableCell className="font-medium text-gray-900">
                  {format(new Date(review.date), 'M月d日', { locale: ja })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm text-gray-800">Google</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StarRating rating={review.rating} />
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    <div className="text-sm text-gray-900">{truncateText(review.text)}</div>
                    <div className="mt-1 text-xs text-gray-700">{review.authorName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={review.status} />
                </TableCell>
                <TableCell>
                  <RiskBadge risk={review.risk} showIcon={false} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReview(review);
                    }}
                  >
                    詳細
                  </Button>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-800">
        <div>Showing 1-{reviews.length} of {reviews.length} results</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            前へ
          </Button>
          <Button variant="outline" size="sm" disabled>
            次へ
          </Button>
        </div>
      </div>

      {selectedReview && (
        <ReviewSlideOver
          review={selectedReview}
          open={!!selectedReview}
          onOpenChange={(open) => !open && setSelectedReview(null)}
        />
      )}
    </>
  );
}
