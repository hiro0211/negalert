'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RatingBreakdownProps {
  data: { rating: number; count: number }[];
}

const COLORS = ['#22c55e', '#84cc16', '#facc15', '#fb923c', '#ef4444'];

export function RatingBreakdown({ data }: RatingBreakdownProps) {
  const chartData = data.map((item) => ({
    name: `★${item.rating}`,
    value: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>星評価分布</CardTitle>
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
              label={({ name, value }) => `${name}: ${value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
