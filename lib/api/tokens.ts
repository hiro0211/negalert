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
 * トークンはpgcryptoで暗号化して保存される
 */
export async function saveGoogleToken(params: SaveTokenParams): Promise<void> {
  const { supabase, userId, accessToken, refreshToken, expiresAt } = params;
  
  // 暗号化キーの確認
  const encryptionKey = process.env.DB_ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('DB_ENCRYPTION_KEY環境変数が設定されていません');
  }
  
  // expires_atをISO文字列に変換
  const expiresAtTimestamp = expiresAt 
    ? new Date(expiresAt * 1000).toISOString()
    : null;
  
  // Refresh Tokenがない場合は、既存のRefresh Tokenを取得して保持
  let finalRefreshToken = refreshToken;
  
  if (!refreshToken) {
    // 既存のTokenレコードを取得（復号化して取得）
    const { data: existingToken } = await supabase.rpc('get_decrypted_refresh_token', {
      p_user_id: userId,
      p_provider: 'google',
      p_encryption_key: encryptionKey
    });
    
    // 既存のRefresh Tokenがあればそれを使用
    if (existingToken) {
      finalRefreshToken = existingToken;
    }
  }
  
  // 暗号化してUPSERT（生SQLを使用）
  const { error } = await supabase.rpc('upsert_encrypted_token', {
    p_user_id: userId,
    p_provider: 'google',
    p_access_token: accessToken,
    p_refresh_token: finalRefreshToken || null,
    p_expires_at: expiresAtTimestamp,
    p_encryption_key: encryptionKey
  });
  
  if (error) {
    throw new Error('Tokenの保存に失敗しました');
  }
}

/**
 * ユーザーのGoogle OAuth Tokenを取得
 * トークンはpgcryptoで復号化して返される
 * 
 * @param userId - ユーザーID
 * @param supabase - Supabaseクライアント（オプション、指定しない場合は新規作成）
 */
export async function getGoogleToken(
  userId: string,
  supabase?: SupabaseClient
): Promise<UserToken | null> {
  const client = supabase || await createServerClient();
  
  // 暗号化キーの確認
  const encryptionKey = process.env.DB_ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('DB_ENCRYPTION_KEY環境変数が設定されていません');
  }
  
  // 復号化してトークンを取得（生SQLを使用）
  const { data, error } = await client.rpc('get_decrypted_token', {
    p_user_id: userId,
    p_provider: 'google',
    p_encryption_key: encryptionKey
  });
  
  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('not found')) {
      // レコードが見つからない場合
      return null;
    }
    throw new Error('Tokenの取得に失敗しました');
  }
  
  // データが配列で返される場合と単一レコードで返される場合に対応
  const tokenData = Array.isArray(data) ? data[0] : data;
  
  return tokenData || null;
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
    .from('oauth_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('provider', 'google');
  
  if (error) {
    throw new Error('Tokenの削除に失敗しました');
  }
}

/**
 * 有効なGoogle OAuthアクセストークンを取得
 * トークンが期限切れの場合は自動的にリフレッシュ
 * 
 * @param userId - ユーザーID
 * @param supabase - Supabaseクライアント（オプション、指定しない場合は新規作成）
 * @returns 有効なアクセストークン
 */
export async function getValidAccessToken(
  userId: string,
  supabase?: SupabaseClient
): Promise<string> {
  const client = supabase || await createServerClient();
  
  // トークンを取得
  const token = await getGoogleToken(userId, client);
  
  if (!token) {
    throw new Error('認証トークンが見つかりません。再度ログインしてください。');
  }
  
  // 有効期限をチェック（5分のバッファを持たせる）
  const bufferTime = 5 * 60 * 1000; // 5分
  const expiresAt = token.expires_at ? new Date(token.expires_at).getTime() : 0;
  const isValid = Date.now() < expiresAt - bufferTime;
  
  // トークンが有効ならそのまま返す
  if (isValid && token.access_token) {
    return token.access_token;
  }
  
  // トークンが期限切れの場合、リフレッシュトークンで更新
  if (!token.refresh_token) {
    throw new Error('リフレッシュトークンが見つかりません。再度ログインしてください。');
  }
  
  try {
    // リフレッシュトークンでアクセストークンを更新
    const { refreshAccessToken } = await import('./google-oauth');
    const refreshResult = await refreshAccessToken(token.refresh_token);
    
    // 新しいトークンをDBに保存
    const newExpiresAt = Math.floor(Date.now() / 1000) + refreshResult.expiresIn;
    
    await saveGoogleToken({
      supabase: client,
      userId,
      accessToken: refreshResult.accessToken,
      refreshToken: token.refresh_token, // リフレッシュトークンは保持
      expiresAt: newExpiresAt,
    });
    
    return refreshResult.accessToken;
  } catch (error) {
    throw new Error('アクセストークンの更新に失敗しました。再度ログインしてください。');
  }
}
