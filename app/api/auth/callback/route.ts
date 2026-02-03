/**
 * Google OAuth コールバック処理
 * Supabase Authが認証コードを処理し、セッションを作成
 * Provider TokenをDBに保存
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { saveGoogleToken } from '@/lib/api/tokens';

export async function GET(request: NextRequest) {
  // 最優先ログ: このルートが呼ばれたことを確認
  console.log('========================================');
  console.log('🔔🔔🔔 コールバックルート呼び出し 🔔🔔🔔');
  console.log('========================================');
  console.log('URL:', request.url);
  console.log('Method:', request.method);
  console.log('========================================');
  
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  console.log('📋 URLパラメータ:', {
    code: code ? `${code.substring(0, 20)}...` : null,
    error: error,
    allParams: Array.from(requestUrl.searchParams.entries()),
  });

  // エラーがある場合
  if (error) {
    console.error('❌ OAuth エラー:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  // 認証コードがある場合、Supabaseでセッションに交換
  if (code) {
    console.log('✅ 認証コード検出、セッション交換を開始...');
    const supabase = await createClient();
    
    // provider_tokenとprovider_refresh_tokenを取得するには
    // exchangeCodeForSession()を使用する必要がある
    console.log('🔄 exchangeCodeForSession呼び出し中...');
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('❌ コード交換エラー:', exchangeError);
      console.error('❌ エラー詳細:', {
        message: exchangeError.message,
        status: exchangeError.status,
        code: (exchangeError as any).code,
      });
      return NextResponse.redirect(
        new URL('/login?error=auth_failed', request.url)
      );
    }
    
    if (!data.session) {
      console.error('❌ セッションが見つかりません');
      return NextResponse.redirect(
        new URL('/login?error=no_session', request.url)
      );
    }
    
    console.log('✅ セッション交換成功');

    // セッションからTokenを取得してDBに保存
    try {
      const { user, provider_token, provider_refresh_token, expires_at } = data.session;
      
      // デバッグ: セッションの全プロパティをログ出力
      console.log('🔍 セッション情報（詳細版）:', {
        userId: user.id,
        email: user.email,
        hasProviderToken: !!provider_token,
        providerTokenLength: provider_token?.length || 0,
        hasProviderRefreshToken: !!provider_refresh_token,
        providerRefreshTokenLength: provider_refresh_token?.length || 0,
        providerRefreshTokenValue: provider_refresh_token ? `[${provider_refresh_token.substring(0, 20)}...]` : '[❌ NULL/UNDEFINED]',
        expiresAt: expires_at,
        expiresAtDate: expires_at ? new Date(expires_at * 1000).toISOString() : null,
        // セッションオブジェクトの全キーを確認
        sessionKeys: Object.keys(data.session),
        // 念のため、セッション全体を確認（本番環境では削除すること）
        fullSession: JSON.stringify(data.session, null, 2),
      });
      
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

    // 認証成功 - ダッシュボードにリダイレクト
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 認証コードがない場合
  console.error('❌ 認証コードが見つかりません');
  return NextResponse.redirect(
    new URL('/login?error=no_code', request.url)
  );
}
