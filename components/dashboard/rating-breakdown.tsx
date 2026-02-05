'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RatingBreakdownProps {
  data: { rating: number; count: number }[];
}

const COLORS = ['#22c55e', '#84cc16', '#facc15', '#fb923c', '#ef4444'];

export function RatingBreakdown({ data }: RatingBreakdownProps) {
  // 0件のレビューを除外
  const chartData = data
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: `★${item.rating}`,
      value: item.count,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-700">星評価分布</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name }) => name}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value || 0}件のレビュー`, name || '']}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                color: '#111827',
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#374151' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
