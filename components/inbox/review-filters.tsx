'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useFilterStore } from '@/lib/store';

interface ReviewFiltersProps {
  unrepliedCount: number;
  actionRequiredCount: number;
  respondedCount: number;
}

export function ReviewFilters({ unrepliedCount, actionRequiredCount, respondedCount }: ReviewFiltersProps) {
  const { statusFilter, ratingFilter, periodFilter, searchQuery, setStatusFilter, setRatingFilter, setPeriodFilter, setSearchQuery } = useFilterStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px] text-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white text-gray-700">
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="unreplied">未返信のみ</SelectItem>
            <SelectItem value="replied">返信済のみ</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={ratingFilter === 'negative' ? 'default' : 'outline'}
          onClick={() => setRatingFilter(ratingFilter === 'negative' ? 'all' : 'negative')}
          className="w-full sm:w-auto"
        >
          ネガのみ (★1-3)
        </Button>

        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-full sm:w-[140px] text-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="7days" className="text-gray-700">直近7日</SelectItem>
            <SelectItem value="30days" className="text-gray-700">直近30日</SelectItem>
            <SelectItem value="custom" className="text-gray-700">カスタム</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700" />
          <Input
            placeholder="レビューを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white text-gray-700"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          {unrepliedCount} 未読
        </Badge>
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          {actionRequiredCount} 要対応
        </Badge>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {respondedCount} 返信済
        </Badge>
      </div>
    </div>
  );
}
