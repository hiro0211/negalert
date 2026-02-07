'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, TrendingUp } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-700">料金・プラン</h1>
        <p className="text-gray-800 mt-1">現在のプランと使用状況</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-700">
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              現在のプラン
            </span>
            <Badge className="bg-blue-500">スタンダードプラン</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-gray-700 mb-1">月額料金</div>
              <div className="text-3xl font-bold text-gray-700">¥9,800</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-gray-700 mb-1">次回請求日</div>
              <div className="text-xl font-semibold text-gray-700">2026年7月1日</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">レビュー数の使用状況</span>
              <span className="text-sm text-gray-700">15 / 500件</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '3%' }}></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">残り 485件</p>
          </div>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              プランのアップグレード
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              プレミアムプランにアップグレードすると、月1000件のレビューまで対応でき、高度なAI分析機能が利用できます。
            </p>
            <Button
              onClick={() => alert('プラン変更機能は現在開発中です（モック）')}
              className="text-gray-700"
            >
              プランを変更
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-700">支払い履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '2026年6月1日', amount: '¥9,800', status: '支払い済み' },
              { date: '2026年5月1日', amount: '¥9,800', status: '支払い済み' },
              { date: '2026年4月1日', amount: '¥9,800', status: '支払い済み' },
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <div className="font-medium text-gray-700">{payment.date}</div>
                  <div className="text-sm text-gray-700">{payment.amount}</div>
                </div>
                <Badge className="bg-green-500">{payment.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
