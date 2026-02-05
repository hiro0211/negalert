/**
 * 認証API層（Google OAuth対応）
 * Supabase Authを使用したGoogle OAuth認証フロー管理
 */

import { AuthSession } from './types';
import { createClient } from '../supabase/client';

/**
 * Google OAuthフロー開始
 * Supabase AuthのGoogle OAuthを使用
 * ビジネスプロフィールの管理権限とユーザー情報を要求
 * 
 * 重要: Supabase Dashboardの Google Provider設定で
 * "Additional OAuth Scopes" に https://www.googleapis.com/auth/business.manage を
 * 追加する必要があります。
 * 
 * @returns 認証URL
 */
export async function initiateGoogleOAuth(): Promise<{ authUrl: string }> {
  const supabase = createClient();
  
  // サイトURLを取得（window.location.originを優先、なければ環境変数）
  const siteUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_SITE_URL;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/api/auth/callback`,
      // scopes: Supabaseのデフォルトスコープに追加するスコープ
      // ※ Supabase Dashboardの「Additional OAuth Scopes」と合わせて設定
      scopes: 'https://www.googleapis.com/auth/business.manage',
      queryParams: {
        // access_type: 'offline' は Refresh Token取得に必須
        access_type: 'offline',
        // prompt: 'consent' は毎回同意画面を表示し、確実にRefresh Tokenを取得
        // ※ これがないと2回目以降のログインでRefresh Tokenが返ってこない
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw new Error('認証の開始に失敗しました');
  }

  if (!data.url) {
    throw new Error('認証URLの生成に失敗しました');
  }

  return { authUrl: data.url };
}

/**
 * OAuth コールバック処理
 * Supabase Authがコールバックを処理するため、この関数は不要
 * セッション情報はSupabaseが自動的に管理
 */

/**
 * 現在のセッションを取得
 * Supabase Authからセッション情報を取得
 * 
 * @returns 認証セッション（ログインしていない場合はnull）
 */
export async function getSession(): Promise<AuthSession | null> {
  const supabase = createClient();
  
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  if (!session) {
    return null;
  }

  // Supabaseのセッションを内部のAuthSession型に変換
  return {
    user: {
      id: session.user.id,
      name: session.user.user_metadata.full_name || session.user.user_metadata.name || session.user.email || 'ユーザー',
      email: session.user.email || '',
      location: {
        id: 'location-1',
        name: 'サンプルレストラン',
        address: '東京都渋谷区',
      },
    },
    accessToken: session.access_token,
    refreshToken: session.refresh_token || '',
    expiresAt: session.expires_at ? session.expires_at * 1000 : Date.now() + 3600000,
    provider: 'google',
  };
}

/**
 * ログアウト
 * Supabase Authのセッションをクリア
 */
export async function signOut(): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error('ログアウトに失敗しました');
  }

  // ログインページにリダイレクト
  window.location.href = '/login';
}

/**
 * 現在ログインしているユーザーを取得
 * 
 * @returns ユーザー情報（ログインしていない場合はnull）
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}
