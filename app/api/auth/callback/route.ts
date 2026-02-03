/**
 * Google OAuth コールバック処理
 * 認証コードをトークンに交換してセッションを作成
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleOAuthCallback } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // エラーがある場合
  if (error) {
    console.error('OAuth エラー:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  // 認証コードがない場合
  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=no_code', request.url)
    );
  }

  try {
    // 認証コードをセッションに交換
    const session = await handleOAuthCallback(code);

    // 本番実装例（コメントアウト）
    /*
    // セッションをCookieに保存
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
      path: '/',
    });
    
    return response;
    */

    // または、Supabase Authを使用する場合
    /*
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      },
    });
    
    if (error) throw error;
    */

    // モック: ダッシュボードにリダイレクト
    console.log('[Mock] OAuth コールバック成功:', session.user.email);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (err) {
    console.error('OAuth コールバック処理エラー:', err);
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', request.url)
    );
  }
}
