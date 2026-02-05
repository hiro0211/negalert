/**
 * Supabaseクライアント（Middleware用）
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // セッションをリフレッシュ（重要: getUser()を呼び出すことでセッションが更新される）
  // ※ OAuth認証コールバック(/api/auth/callback)は直接処理されるため、
  //   middlewareでは特別な処理は不要
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 公開ページのパス（ログイン不要でアクセス可能）
  const publicPaths = ['/login', '/api/auth', '/privacy', '/terms'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // 認証が必要なページへのアクセスをチェック
  if (!user && !isPublicPath && request.nextUrl.pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // ログイン済みユーザーがログインページにアクセスした場合、ダッシュボードにリダイレクト
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
