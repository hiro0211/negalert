/**
 * Google OAuth Token管理API
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '../supabase/server';

export interface UserToken {
  id: string;
  user_id: string;
  provider: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SaveTokenParams {
  supabase: SupabaseClient; // 認証済みのSupabaseクライアントを受け取る
  userId: string;
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: number; // Unix timestamp (seconds)
}

/**
 * Google OAuth Tokenをデータベースに保存
 * 既存のレコードがあればUPSERT（更新）、なければINSERT
 * 
 * 重要: Refresh Tokenがnull/undefinedの場合は既存の値を保持する
 */
export async function saveGoogleToken(params: SaveTokenParams): Promise<void> {
  const { supabase, userId, accessToken, refreshToken, expiresAt } = params;
  
  // expires_atをISO文字列に変換
  const expiresAtTimestamp = expiresAt 
    ? new Date(expiresAt * 1000).toISOString()
    : null;
  
  // Refresh Tokenがない場合は、既存のRefresh Tokenを取得して保持
  let finalRefreshToken = refreshToken;
  
  if (!refreshToken) {
    // 既存のTokenレコードを取得
    const { data: existingToken } = await supabase
      .from('user_tokens')
      .select('refresh_token')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();
    
    // 既存のRefresh Tokenがあればそれを使用
    if (existingToken?.refresh_token) {
      finalRefreshToken = existingToken.refresh_token;
      console.log('ℹ️ 既存のRefresh Tokenを保持します');
    }
  }
  
  const { error } = await supabase
    .from('user_tokens')
    .upsert(
      {
        user_id: userId,
        provider: 'google',
        access_token: accessToken,
        refresh_token: finalRefreshToken || null,
        expires_at: expiresAtTimestamp,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,provider', // user_idとproviderの組み合わせで重複チェック
      }
    );
  
  if (error) {
    console.error('Token保存エラー:', error);
    throw new Error('Tokenの保存に失敗しました');
  }
  
  console.log('✅ Google OAuth Token保存成功:', {
    userId,
    hasRefreshToken: !!finalRefreshToken,
    isNewRefreshToken: !!refreshToken,
    expiresAt: expiresAtTimestamp,
  });
}

/**
 * ユーザーのGoogle OAuth Tokenを取得
 * 
 * @param userId - ユーザーID
 * @param supabase - Supabaseクライアント（オプション、指定しない場合は新規作成）
 */
export async function getGoogleToken(
  userId: string,
  supabase?: SupabaseClient
): Promise<UserToken | null> {
  const client = supabase || await createServerClient();
  
  const { data, error } = await client
    .from('user_tokens')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'google')
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // レコードが見つからない場合
      return null;
    }
    console.error('Token取得エラー:', error);
    throw new Error('Tokenの取得に失敗しました');
  }
  
  return data;
}

/**
 * ユーザーのGoogle OAuth Tokenを削除
 * 
 * @param userId - ユーザーID
 * @param supabase - Supabaseクライアント（オプション、指定しない場合は新規作成）
 */
export async function deleteGoogleToken(
  userId: string,
  supabase?: SupabaseClient
): Promise<void> {
  const client = supabase || await createServerClient();
  
  const { error } = await client
    .from('user_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('provider', 'google');
  
  if (error) {
    console.error('Token削除エラー:', error);
    throw new Error('Tokenの削除に失敗しました');
  }
  
  console.log('✅ Google OAuth Token削除成功:', userId);
}
