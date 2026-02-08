/**
 * 安全なエラーハンドリングユーティリティ
 * 本番環境では詳細なエラー情報を隠蔽
 */

const isProd = process.env.NODE_ENV === 'production';

/**
 * エラーレスポンス型
 */
export interface SafeErrorResponse {
  message: string;
  details?: string;
  code?: string;
}

/**
 * 安全なエラーレスポンスを生成
 * 本番環境では詳細情報を隠蔽
 * 
 * @param error - 発生したエラー
 * @param publicMessage - ユーザーに表示するメッセージ
 * @param errorCode - エラーコード（オプション）
 * @returns 安全なエラーレスポンス
 */
export function createSafeError(
  error: unknown,
  publicMessage: string = '内部エラーが発生しました',
  errorCode?: string
): SafeErrorResponse {
  const response: SafeErrorResponse = {
    message: publicMessage,
  };
  
  if (errorCode) {
    response.code = errorCode;
  }
  
  // 開発環境でのみ詳細情報を追加
  if (!isProd && error instanceof Error) {
    response.details = error.message;
  }
  
  return response;
}

/**
 * データベースエラーを安全に処理
 * 
 * @param error - データベースエラー
 * @returns 安全なエラーメッセージ
 */
export function handleDatabaseError(error: unknown): string {
  // 開発環境では詳細を返す
  if (!isProd && error instanceof Error) {
    return `データベースエラー: ${error.message}`;
  }
  
  // 本番環境では一般的なメッセージ
  return 'データベース操作に失敗しました';
}

/**
 * 認証エラーを安全に処理
 * 
 * @param error - 認証エラー
 * @returns 安全なエラーメッセージ
 */
export function handleAuthError(error: unknown): string {
  // 認証エラーは詳細を返さない（セキュリティ上の理由）
  return '認証に失敗しました。再度ログインしてください。';
}

/**
 * API呼び出しエラーを安全に処理
 * 
 * @param error - APIエラー
 * @param serviceName - サービス名
 * @returns 安全なエラーメッセージ
 */
export function handleApiError(error: unknown, serviceName: string): string {
  if (!isProd && error instanceof Error) {
    return `${serviceName}エラー: ${error.message}`;
  }
  
  return `${serviceName}との通信に失敗しました`;
}

/**
 * エラーをログに記録（センシティブ情報をマスク）
 * 
 * @param context - エラーコンテキスト
 * @param error - エラーオブジェクト
 * @param additionalData - 追加データ
 */
export function logError(
  context: string,
  error: unknown,
  additionalData?: Record<string, unknown>
): void {
  const sanitizedData = additionalData ? sanitizeForLogging(additionalData) : undefined;
  
  console.error(`[ERROR] ${context}:`, {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: !isProd && error instanceof Error ? error.stack : undefined,
    data: sanitizedData,
    timestamp: new Date().toISOString(),
  });
}

/**
 * ログ用にデータをサニタイズ（センシティブ情報をマスク）
 */
function sanitizeForLogging(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ['password', 'token', 'key', 'secret', 'authorization', 'cookie'];
  
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      const isKeywordSensitive = sensitiveKeys.some(
        (sensitive) => key.toLowerCase().includes(sensitive)
      );
      
      if (isKeywordSensitive) {
        return [key, '[REDACTED]'];
      }
      
      if (typeof value === 'object' && value !== null) {
        return [key, sanitizeForLogging(value as Record<string, unknown>)];
      }
      
      return [key, value];
    })
  );
}
