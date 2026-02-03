/**
 * 認証API層（Google OAuth対応）
 * Supabase Authを使用したGoogle OAuth認証フロー管理
 */

import { AuthSession } from './types';
import { createClient } from '../supabase/client';

/**
 * Google OAuthフロー開始
 * Supabase AuthのGoogle OAuthを使用
 * 
 * @returns 認証URL
 */
export async function initiateGoogleOAuth(): Promise<{ authUrl: string }> {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      scopes: 'https://www.googleapis.com/auth/business.manage',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Google OAuth開始エラー:', error);
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
    console.error('セッション取得エラー:', error);
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
    console.error('ログアウトエラー:', error);
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
