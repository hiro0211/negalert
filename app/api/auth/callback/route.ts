/**
 * Google OAuth コールバック処理
 * Supabase Authが認証コードを処理し、セッションを作成
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  // エラーがある場合
  if (error) {
    console.error('OAuth エラー:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  // 認証コードがある場合、Supabaseでセッションに交換
  if (code) {
    const supabase = await createClient();
    
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('コード交換エラー:', exchangeError);
      return NextResponse.redirect(
        new URL('/login?error=auth_failed', request.url)
      );
    }

    // 認証成功 - ダッシュボードにリダイレクト
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 認証コードがない場合
  return NextResponse.redirect(
    new URL('/login?error=no_code', request.url)
  );
}
