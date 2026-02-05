/**
 * 環境に応じたロギングユーティリティ
 * 本番環境ではconsole.logを無効化し、エラーのみをログ出力
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  // 開発環境でのみ出力
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },

  // 情報ログ（開発環境のみ）
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },

  // 警告（本番環境でも出力するが、機密情報は含めない）
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },

  // エラー（本番環境でも出力するが、機密情報は含めない）
  error: (message: string, error?: any) => {
    if (isProduction) {
      // 本番環境ではエラーメッセージのみ
      console.error('[ERROR]', message);
    } else {
      // 開発環境では詳細も出力
      console.error('[ERROR]', message, error);
    }
  },

  // 成功ログ（開発環境のみ）
  success: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[SUCCESS]', ...args);
    }
  },
};
