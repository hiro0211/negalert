'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, User } from 'lucide-react';
import { mockUser } from '@/lib/mock/user';

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <Select defaultValue="loc1">
          <SelectTrigger className="w-[280px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="loc1">{mockUser.location.name}</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="30days">
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">直近7日</SelectItem>
            <SelectItem value="30days">直近30日</SelectItem>
            <SelectItem value="custom">カスタム</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="検索..."
            className="w-[200px] pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-medium">{mockUser.name}</div>
            <div className="text-xs text-gray-600">{mockUser.email}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
