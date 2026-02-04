/**
 * Google OAuth 2.0 フロー専用モジュール
 * Google My Business API連携で使用
 */

import { GoogleOAuthConfig, GoogleTokenResponse } from './types';

// Google OAuth 2.0 エンドポイント
const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

// 必要なスコープ
const DEFAULT_SCOPES = [
  'https://www.googleapis.com/auth/business.manage', // レビュー管理
  'https://www.googleapis.com/auth/userinfo.email', // ユーザー情報取得
  'https://www.googleapis.com/auth/userinfo.profile', // プロフィール情報
];

/**
 * Google OAuth認証URLを生成
 * 
 * @param config - OAuth設定（clientId, redirectUri, scopes）
 * @returns 認証URL
 */
export function generateGoogleAuthUrl(config: GoogleOAuthConfig): string {
  // 現在: モック実装（ダッシュボードにリダイレクト）
  // 将来: 実際のGoogle OAuth URLを生成
  
  const scopes = config.scopes.length > 0 ? config.scopes : DEFAULT_SCOPES;
  
  // 本番実装例（コメントアウト）
  /*
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline', // リフレッシュトークンを取得
    prompt: 'consent', // 毎回同意画面を表示
  });
  
  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
  */
  
  // モック: ダッシュボードにリダイレクト
  console.log('[Mock] Google OAuth URL生成:', {
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    scopes,
  });
  
  return '/dashboard';
}

/**
 * 認証コードをアクセストークンに交換
 * 
 * @param code - Google OAuthから取得した認証コード
 * @returns アクセストークン、リフレッシュトークン、有効期限
 */
export async function exchangeCodeForTokens(
  code: string
): Promise<GoogleTokenResponse> {
  // 現在: モック実装
  // 将来: Google Token Endpointを呼び出し
  
  console.log('[Mock] 認証コードをトークンに交換:', code);
  
  // 本番実装例（コメントアウト）
  /*
  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  });
  
  if (!response.ok) {
    throw new Error('トークン交換に失敗しました');
  }
  
  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
  };
  */
  
  // モック: ダミートークンを返す
  return {
    accessToken: 'mock-access-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    expiresIn: 3600, // 1時間
    tokenType: 'Bearer',
  };
}

/**
 * リフレッシュトークンを使用してアクセストークンを更新
 * 
 * @param refreshToken - リフレッシュトークン
 * @returns 新しいアクセストークンと有効期限
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: 'refresh_token',
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('トークンリフレッシュエラー:', errorData);
    throw new Error(`トークンのリフレッシュに失敗しました: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

/**
 * アクセストークンが有効かどうかをチェック
 * 
 * @param expiresAt - トークンの有効期限（ミリ秒）
 * @returns トークンが有効な場合true
 */
export function isTokenValid(expiresAt: number): boolean {
  // 有効期限の5分前にfalseを返す（余裕を持たせる）
  const bufferTime = 5 * 60 * 1000; // 5分
  return Date.now() < expiresAt - bufferTime;
}
