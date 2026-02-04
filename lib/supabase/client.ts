/**
 * Supabaseクライアント（クライアントコンポーネント用）
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // 環境変数のチェック
  if (!supabaseUrl) {
    throw new Error('環境変数 NEXT_PUBLIC_SUPABASE_URL が設定されていません');
  }
  
  if (!supabaseAnonKey) {
    throw new Error('環境変数 NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません');
  }
  
  // URLの検証
  if (!supabaseUrl.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL は https:// で始まる必要があります');
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
