import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PriorityWidgetProps {
  unrepliedNegativeCount: number;
  pendingTodosCount: number;
}

export function PriorityWidget({ unrepliedNegativeCount, pendingTodosCount }: PriorityWidgetProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-700">
          <AlertCircle className="h-5 w-5 text-red-500" />
          今日やること
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">未返信ネガティブレビュー</span>
              <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">{unrepliedNegativeCount}件</Badge>
            </div>
          </div>
          {/* TODO機能を一時的に非表示 */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">要対応ToDo</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {pendingTodosCount}件
              </Badge>
            </div>
          </div> */}
        </div>
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href="/dashboard/inbox" className="bg-yellow-100 text-yellow-800">
              Inboxを開く
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {/* TODO機能を一時的に非表示 */}
          {/* <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard/todos">
              <CheckSquare className="mr-2 h-4 w-4" />
              ToDo
            </Link>
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
