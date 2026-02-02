'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { mockLocations } from '@/lib/mock/user';
import { MapPin } from 'lucide-react';

export default function OnboardingLocationPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleComplete = () => {
    if (selectedLocation) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex gap-2">
              <div className="h-2 w-16 rounded-full bg-primary"></div>
              <div className="h-2 w-16 rounded-full bg-primary"></div>
              <div className="h-2 w-16 rounded-full bg-gray-300"></div>
            </div>
          </div>
          <CardTitle className="text-3xl">ロケーションを選択</CardTitle>
          <p className="text-gray-600 mt-2">
            Step 2/3: 管理するビジネスロケーションを選択してください
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedLocation || ''} onValueChange={setSelectedLocation}>
            <div className="space-y-3">
              {mockLocations.map((location) => (
                <div
                  key={location.id}
                  className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                    selectedLocation === location.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedLocation(location.id)}
                >
                  <RadioGroupItem value={location.id} id={location.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={location.id} className="cursor-pointer">
                      <div className="font-semibold text-lg">{location.name}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                        <MapPin className="h-4 w-4" />
                        {location.address}
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => router.back()}>
              戻る
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!selectedLocation}
              className="flex-1"
            >
              完了
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
