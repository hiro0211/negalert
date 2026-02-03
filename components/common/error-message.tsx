/**
 * エラーメッセージコンポーネント
 * エラー発生時の表示に使用
 */

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ error, onRetry, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 p-6',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900">エラーが発生しました</h3>
          <p className="mt-1 text-sm text-red-800">{error.message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              再試行
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * フルページエラーメッセージ
 */
export function FullPageErrorMessage({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    </div>
  );
}

/**
 * インラインエラーメッセージ（コンパクト版）
 */
export function InlineErrorMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-red-600',
        className
      )}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
