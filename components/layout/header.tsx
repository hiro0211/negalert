'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, User, LogOut, RefreshCw, Menu, Settings } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      toast({
        title: "エラー",
        description: "ログアウトに失敗しました",
        variant: "destructive",
      });
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

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

      <div className="flex items-center gap-2 md:gap-4">
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
          <span className="hidden sm:inline">{isSyncing ? '同期中...' : 'レビューを更新'}</span>
          <span className="sm:hidden">{isSyncing ? '同期中' : '更新'}</span>
        </Button>
        
        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-600">{user?.name || 'ユーザー'}</div>
                <div className="text-xs text-gray-600">{user?.email || ''}</div>
              </div>
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary text-gray-800">
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'ユーザー'}</p>
                <p className="text-xs leading-none text-gray-500">{user?.email || ''}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>設定</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              onClick={() => setShowLogoutDialog(true)}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>ログアウト</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logout Confirmation Dialog */}
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ログアウトしますか？</AlertDialogTitle>
              <AlertDialogDescription>
                ログアウトすると、再度ログインが必要になります。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoggingOut}>キャンセル</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
