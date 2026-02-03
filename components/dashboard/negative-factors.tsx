'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface NegativeFactorsProps {
  data: { factor: string; count: number }[];
}

export function NegativeFactors({ data }: NegativeFactorsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-700">ネガ要因 TOP3</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#4b5563' }} />
            <YAxis type="category" dataKey="factor" tick={{ fontSize: 12, fill: '#4b5563' }} width={80} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
            />
            <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
