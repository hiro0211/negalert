/**
 * レート制限ミドルウェア
 * 
 * 注意: この実装はメモリベースのシンプルなレート制限です。
 * 本番環境でスケーリングする場合は Upstash Redis などの
 * 分散キャッシュを使用することを推奨します。
 * 
 * Upstash導入手順:
 * 1. npm install @upstash/ratelimit @upstash/redis
 * 2. UPSTASH_REDIS_REST_URL と UPSTASH_REDIS_REST_TOKEN を設定
 * 3. このファイルの実装を Redis ベースに切り替え
 */

import { NextResponse } from 'next/server';

// メモリベースのレート制限ストア
// 注意: サーバーレス環境では永続化されません
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// レート制限の設定
interface RateLimitConfig {
  windowMs: number;      // 時間窓（ミリ秒）
  maxRequests: number;   // 最大リクエスト数
}

// デフォルト設定
const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000,   // 1分
  maxRequests: 30,       // 30リクエスト/分
};

// AI分析用の厳しい制限（コスト保護）
const AI_ANALYSIS_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000,   // 1分
  maxRequests: 10,       // 10リクエスト/分
};

/**
 * レート制限をチェック
 * 
 * @param identifier - ユーザー識別子（IPアドレスまたはユーザーID）
 * @param config - レート制限設定
 * @returns レート制限結果
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  
  // 既存のエントリを取得
  const existing = rateLimitStore.get(key);
  
  // エントリが存在しない、または期限切れの場合は新規作成
  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }
  
  // レート制限に達している場合
  if (existing.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: existing.resetTime,
    };
  }
  
  // カウントを増加
  existing.count++;
  rateLimitStore.set(key, existing);
  
  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    resetTime: existing.resetTime,
  };
}

/**
 * 通常のAPIエンドポイント用レート制限
 */
export function rateLimitDefault(identifier: string) {
  return checkRateLimit(identifier, DEFAULT_CONFIG);
}

/**
 * AI分析エンドポイント用レート制限（厳しい制限）
 */
export function rateLimitAI(identifier: string) {
  return checkRateLimit(identifier, AI_ANALYSIS_CONFIG);
}

/**
 * レート制限エラーレスポンスを生成
 */
export function createRateLimitResponse(resetTime: number) {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  
  return NextResponse.json(
    {
      error: 'リクエスト制限に達しました。しばらく待ってから再試行してください。',
      retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Reset': String(resetTime),
      },
    }
  );
}

/**
 * メモリストアをクリーンアップ（古いエントリを削除）
 * 定期的に呼び出すことを推奨
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// 5分ごとにクリーンアップを実行（メモリリーク防止）
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
