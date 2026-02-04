'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (confirm('ログアウトしますか?')) {
      try {
        setIsLoggingOut(true);
        await logout();
      } catch (error) {
        console.error('ログアウトエラー:', error);
        alert('ログアウトに失敗しました');
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        {/* <Select defaultValue="loc1">
          <SelectTrigger className="w-[280px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="loc1">{user?.location.name || 'ロケーション'}</SelectItem>
          </SelectContent>
        </Select> */}

        {/* <Select defaultValue="30days">
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">直近7日</SelectItem>
            <SelectItem value="30days">直近30日</SelectItem>
            <SelectItem value="custom">カスタム</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      <div className="flex items-center gap-4">
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="検索..."
            className="w-[200px] pl-9"
          />
        </div> */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">{user?.name || 'ユーザー'}</div>
            <div className="text-xs text-gray-600">{user?.email || ''}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <User className="h-5 w-5" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="ml-2 text-gray-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
