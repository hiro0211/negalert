# 認証アーキテクチャ

NegAlertアプリケーションの認証システムの構造と実装の詳細を説明します。

## アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────┐
│                        ユーザー                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   クライアントコンポーネント                  │
│  - app/login/page.tsx (ログインページ)                      │
│  - components/layout/header.tsx (ヘッダー、ログアウト)       │
│  - lib/hooks/useAuth.ts (認証フック)                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   クライアントAPI層                           │
│  - lib/api/auth.ts (認証API)                                 │
│  - lib/supabase/client.ts (Supabaseクライアント)             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Auth                           │
│  - Google OAuth 2.0                                          │
│  - セッション管理                                            │
│  - トークンリフレッシュ                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Google OAuth                            │
│  - 認証フロー                                                │
│  - アクセストークン発行                                      │
│  - リフレッシュトークン発行                                  │
└─────────────────────────────────────────────────────────────┘
```

## ディレクトリ構造

```
negalert/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts           # OAuth コールバック (Server)
│   ├── login/
│   │   └── page.tsx                   # ログインページ (Client)
│   ├── dashboard/
│   │   └── layout.tsx                 # ダッシュボードレイアウト (Server)
│   └── page.tsx                       # ルートページ (Server)
├── components/
│   └── layout/
│       └── header.tsx                 # ヘッダー (Client)
├── lib/
│   ├── api/
│   │   ├── auth.ts                    # クライアント認証API
│   │   ├── auth-server.ts             # サーバー認証API
│   │   └── types.ts                   # 型定義
│   ├── hooks/
│   │   └── useAuth.ts                 # 認証フック (Client)
│   └── supabase/
│       ├── client.ts                  # Supabaseクライアント (Client)
│       ├── server.ts                  # Supabaseクライアント (Server)
│       └── middleware.ts              # Supabase Middleware
├── middleware.ts                      # Next.js Middleware
└── .env.local                         # 環境変数
```

## コンポーネントの役割

### クライアントコンポーネント

#### 1. `app/login/page.tsx`
- **役割**: ログインページのUI
- **機能**:
  - Googleログインボタンの表示
  - エラーメッセージの表示
  - ローディング状態の管理
- **使用するフック**: `useAuth()`

#### 2. `components/layout/header.tsx`
- **役割**: ダッシュボードのヘッダー
- **機能**:
  - ユーザー情報の表示
  - ログアウトボタン
  - ロケーション選択
- **使用するフック**: `useAuth()`

#### 3. `lib/hooks/useAuth.ts`
- **役割**: 認証状態の管理
- **機能**:
  - セッション情報の取得
  - ログイン処理
  - ログアウト処理
  - 認証状態の監視
- **使用するAPI**: `lib/api/auth.ts`

### サーバーコンポーネント

#### 1. `app/api/auth/callback/route.ts`
- **役割**: OAuth コールバックエンドポイント
- **機能**:
  - 認証コードの受け取り
  - Supabaseでセッションに交換
  - ダッシュボードへのリダイレクト
- **使用するクライアント**: `lib/supabase/server.ts`

#### 2. `app/page.tsx`
- **役割**: ルートページ
- **機能**:
  - セッション確認
  - ログイン済みの場合はダッシュボードへリダイレクト
  - 未ログインの場合はログインページへリダイレクト
- **使用するクライアント**: `lib/supabase/server.ts`

#### 3. `middleware.ts`
- **役割**: 認証チェック
- **機能**:
  - すべてのリクエストでセッションを確認
  - 未認証ユーザーをログインページへリダイレクト
  - ログイン済みユーザーがログインページにアクセスした場合、ダッシュボードへリダイレクト
- **使用するミドルウェア**: `lib/supabase/middleware.ts`

## API層

### クライアントAPI (`lib/api/auth.ts`)

クライアントコンポーネントから使用される認証API。

```typescript
// Google OAuth開始
export async function initiateGoogleOAuth(): Promise<{ authUrl: string }>

// セッション取得
export async function getSession(): Promise<AuthSession | null>

// ログアウト
export async function signOut(): Promise<void>

// 現在のユーザー取得
export async function getCurrentUser()
```

### サーバーAPI (`lib/api/auth-server.ts`)

サーバーコンポーネントから使用される認証API。

```typescript
// サーバーサイドでセッション取得
export async function getServerSession(): Promise<AuthSession | null>

// サーバーサイドでユーザー取得
export async function getServerUser()
```

## Supabaseクライアント

### クライアント用 (`lib/supabase/client.ts`)

クライアントコンポーネントで使用するSupabaseクライアント。

```typescript
export function createClient()
```

### サーバー用 (`lib/supabase/server.ts`)

サーバーコンポーネントとAPI Routeで使用するSupabaseクライアント。

```typescript
export async function createClient()
```

### Middleware用 (`lib/supabase/middleware.ts`)

Next.js Middlewareで使用するSupabaseクライアント。

```typescript
export async function updateSession(request: NextRequest)
```

## 認証フロー

### ログインフロー

```
1. ユーザーが「Googleでログイン」ボタンをクリック
   ↓
2. useAuth().login() が呼ばれる
   ↓
3. initiateGoogleOAuth() がSupabase AuthのGoogle OAuthを開始
   ↓
4. ユーザーがGoogleの認証画面にリダイレクトされる
   ↓
5. ユーザーがGoogleで認証
   ↓
6. Googleが /api/auth/callback にリダイレクト（認証コード付き）
   ↓
7. Supabase Authが認証コードをセッションに交換
   ↓
8. ダッシュボードにリダイレクト
   ↓
9. middlewareがセッションを確認し、アクセスを許可
```

### ログアウトフロー

```
1. ユーザーがログアウトボタンをクリック
   ↓
2. useAuth().logout() が呼ばれる
   ↓
3. signOut() がSupabase Authのセッションをクリア
   ↓
4. ログインページにリダイレクト
```

### セッション確認フロー

```
1. ユーザーがページにアクセス
   ↓
2. middlewareがリクエストをインターセプト
   ↓
3. Supabase Authでセッションを確認
   ↓
4. セッションが有効な場合、リクエストを続行
   ↓
5. セッションが無効な場合、ログインページにリダイレクト
```

## セキュリティ

### Cookie設定

Supabase Authは自動的に以下のCookie設定を使用します:

- `httpOnly: true` - JavaScriptからアクセス不可
- `secure: true` (本番環境) - HTTPS接続のみ
- `sameSite: 'lax'` - CSRF攻撃を防ぐ

### トークン管理

- アクセストークンは短期間（1時間）で期限切れ
- リフレッシュトークンを使用して自動的に更新
- Supabase Authが自動的にトークンをリフレッシュ

### 環境変数

機密情報は環境変数として管理:

- `GOOGLE_CLIENT_SECRET` - サーバーサイドのみで使用
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 公開鍵（クライアントで使用可能）

## テスト

### 開発環境でのテスト

1. `.env.local`に環境変数を設定
2. `npm run dev`でアプリケーションを起動
3. `http://localhost:3000`にアクセス
4. 「Googleでログイン」をクリック
5. Googleアカウントで認証
6. ダッシュボードにリダイレクトされることを確認
7. ログアウトボタンをクリック
8. ログインページにリダイレクトされることを確認

### エラーハンドリング

- 認証エラー時はログインページにリダイレクト
- エラーメッセージをURLパラメータで渡す
- ログインページでエラーメッセージを表示

## 今後の拡張

### Google My Business APIとの連携

現在の実装では、Google OAuthでアクセストークンを取得していますが、Google My Business APIを使用するには追加の設定が必要です:

1. アクセストークンを使用してGoogle My Business APIを呼び出す
2. ロケーション情報を取得してSupabaseに保存
3. レビュー情報を定期的に同期

### ユーザー情報の保存

現在はSupabase Authのみでユーザー情報を管理していますが、将来的には:

1. Supabaseのテーブルにユーザー情報を保存
2. ロケーション情報を関連付け
3. ユーザー設定を保存

## 参考資料

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
