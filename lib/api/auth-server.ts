/**
 * サーバーサイド認証API層
 * Server ComponentsやAPI Routesで使用
 */

import { createClient } from '../supabase/server';
import { AuthSession } from './types';

/**
 * サーバーサイドでセッションを取得
 * 
 * @returns 認証セッション（ログインしていない場合はnull）
 */
export async function getServerSession(): Promise<AuthSession | null> {
  const supabase = await createClient();
  
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
 * サーバーサイドで現在のユーザーを取得
 * 
 * @returns ユーザー情報（ログインしていない場合はnull）
 */
export async function getServerUser() {
  const session = await getServerSession();
  return session?.user || null;
}
