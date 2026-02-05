import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  valueClassName?: string;
}

export function StatsCard({ title, value, change, icon: Icon, trend, valueClassName }: StatsCardProps) {
  // 変化がない場合（0の場合）を判定
  const isNoChange = change === 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-700" />
      </CardHeader>
      <CardContent>
        <div className={cn('text-3xl font-bold text-gray-900', valueClassName)}>{value}</div>
        {change !== undefined && (
          <div className="mt-2 flex items-center text-sm">
            {isNoChange ? (
              <Minus className="mr-1 h-4 w-4 text-gray-500" />
            ) : trend === 'up' ? (
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span className={isNoChange ? 'text-gray-500' : trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {isNoChange ? '変化なし' : `${change > 0 ? '+' : ''}${change}`}
            </span>
            <span className="ml-1 text-gray-700">前月比</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
