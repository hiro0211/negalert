/**
 * Google OAuth コールバック処理
 * Supabase Authが認証コードを処理し、セッションを作成
 * Provider TokenをDBに保存
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { saveGoogleToken } from '@/lib/api/tokens';

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
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('コード交換エラー:', exchangeError);
      return NextResponse.redirect(
        new URL('/login?error=auth_failed', request.url)
      );
    }

    // セッションからTokenを取得してDBに保存
    if (data.session) {
      try {
        const { user, provider_token, provider_refresh_token, expires_at } = data.session;
        
        if (provider_token) {
          // 認証済みのSupabaseクライアントを渡してToken保存
          await saveGoogleToken({
            supabase, // RLS対策: 認証済みのクライアントを渡す
            userId: user.id,
            accessToken: provider_token,
            refreshToken: provider_refresh_token || null,
            expiresAt: expires_at,
          });
          
          console.log('✅ OAuth Token保存完了:', {
            userId: user.id,
            email: user.email,
            hasRefreshToken: !!provider_refresh_token,
            isNewRefreshToken: !!provider_refresh_token,
          });
        } else {
          console.warn('⚠️ provider_tokenが見つかりません');
        }
      } catch (tokenError) {
        // Token保存エラーはログに記録するが、認証フローは継続
        console.error('❌ Token保存エラー（認証は継続）:', tokenError);
      }
    }

    // 認証成功 - ダッシュボードにリダイレクト
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 認証コードがない場合
  return NextResponse.redirect(
    new URL('/login?error=no_code', request.url)
  );
}
