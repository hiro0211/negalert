# Refresh Token 確認手順

## 1. ターミナルログの確認

開発サーバーのログで以下を確認：

```
🔍 セッション情報: {
  hasProviderRefreshToken: true  ← これが true ならRefresh Token取得成功
}
✅ OAuth Token保存完了: {
  hasRefreshToken: true  ← これが true ならDB保存成功
}
```

## 2. Supabase Dashboardでの確認

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. プロジェクトを選択
3. 左側メニューから「Table Editor」を選択
4. `oauth_tokens` テーブルを開く
5. 最新のレコードで `refresh_token` カラムに値があるか確認

## 3. SQLでの確認

Supabase Dashboard → SQL Editor で以下を実行：

```sql
SELECT 
  user_id,
  provider,
  CASE 
    WHEN refresh_token IS NOT NULL THEN '✅ 存在'
    ELSE '❌ NULL'
  END as refresh_token_status,
  created_at,
  updated_at
FROM oauth_tokens
ORDER BY created_at DESC
LIMIT 5;
```

## 4. ローカルでの確認（オプション）

アプリ内で以下のAPIエンドポイントを作成して確認することもできます：

```typescript
// app/api/debug/tokens/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGoogleToken } from '@/lib/api/tokens';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  const token = await getGoogleToken(user.id, supabase);
  
  return NextResponse.json({
    hasToken: !!token,
    hasRefreshToken: !!token?.refresh_token,
    tokenInfo: token ? {
      provider: token.provider,
      expiresAt: token.expires_at,
      createdAt: token.created_at,
      updatedAt: token.updated_at,
    } : null,
  });
}
```

アクセス: `http://localhost:3000/api/debug/tokens`

## トラブルシューティング

### refresh_token が null の場合

1. Googleアカウントのサードパーティアプリのアクセス権を削除
2. 再度ログインを試行
3. ログで `hasProviderRefreshToken: false` が表示される場合：
   - Google Cloud Consoleの「承認済みのリダイレクトURI」を再確認
   - OAuth同意画面のスコープ設定を再確認
