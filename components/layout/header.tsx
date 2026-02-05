'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { Search, User, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';

export function Header() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      
      toast({
        title: "同期を開始しました",
        description: "レビューデータを取得しています...",
      });
      
      // 店舗同期
      const locationsRes = await fetch('/api/locations/sync', {
        method: 'POST',
      });
      
      if (!locationsRes.ok) {
        const errorData = await locationsRes.json();
        throw new Error(errorData.error || '店舗同期に失敗しました');
      }
      
      // レビュー同期
      const reviewsRes = await fetch('/api/reviews/sync', {
        method: 'POST',
      });
      
      if (!reviewsRes.ok) {
        const errorData = await reviewsRes.json();
        throw new Error(errorData.error || 'レビュー同期に失敗しました');
      }
      
      const data = await reviewsRes.json();
      
      toast({
        title: "同期完了",
        description: `${data.totalReviews}件のレビューを取得しました`,
      });
      
      // ページをリロードして最新データを表示
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      toast({
        title: "同期エラー",
        description: error instanceof Error ? error.message : '同期に失敗しました',
        variant: "destructive",
        action: (
          <ToastAction altText="再試行" onClick={handleSync}>
            再試行
          </ToastAction>
        ),
      });
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('ログアウトしますか?')) {
      try {
        setIsLoggingOut(true);
        await logout();
      } catch (error) {
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
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={isSyncing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? '同期中...' : 'レビューを更新'}
        </Button>
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
