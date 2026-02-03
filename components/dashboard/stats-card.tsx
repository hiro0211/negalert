import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';
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
            {trend === 'up' ? (
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {change > 0 ? '+' : ''}{change}
            </span>
            <span className="ml-1 text-gray-700">前月比</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
