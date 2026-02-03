# Google OAuth認証セットアップガイド

このガイドでは、NegAlertアプリケーションでGoogle OAuth認証を設定する手順を説明します。

## 前提条件

- Google Cloud Platformアカウント
- Supabaseプロジェクト

## 1. Google Cloud Consoleでの設定

### 1.1 プロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）

### 1.2 OAuth 2.0 クライアントIDの作成

1. 左側メニューから「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「OAuth 2.0 クライアントID」をクリック
3. アプリケーションの種類: **ウェブアプリケーション**
4. 名前: `NegAlert` (任意)
5. **⚠️ 重要: 承認済みのリダイレクトURI**に以下を追加:
   - **Supabase側のCallback URL**（必須）: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
     - 例: `https://yhfwuasilnbvflkcbbru.supabase.co/auth/v1/callback`
     - ※ Supabase Dashboard → Authentication → Providers → Google の「Callback URL (for OAuth)」欄に記載されているURL
   - ~~開発環境: `http://localhost:3000/api/auth/callback`~~ ← 不要（Supabase経由のため）
6. 「作成」をクリック
7. **クライアントID**と**クライアントシークレット**をコピーして保存

### 1.3 Google My Business APIの有効化

1. 左側メニューから「APIとサービス」→「ライブラリ」を選択
2. 「Google My Business API」を検索
3. 「有効にする」をクリック

### 1.4 OAuth同意画面の設定

1. 左側メニューから「APIとサービス」→「OAuth同意画面」を選択
2. ユーザータイプ: **外部**を選択
3. アプリ情報を入力:
   - アプリ名: `NegAlert`
   - ユーザーサポートメール: あなたのメールアドレス
   - デベロッパーの連絡先情報: あなたのメールアドレス
4. スコープの追加:
   - `https://www.googleapis.com/auth/business.manage`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
5. テストユーザーを追加（開発中は必要）

## 2. Supabaseでの設定

### 2.1 Google認証プロバイダーの有効化

1. [Supabase Dashboard](https://supabase.com/dashboard)にアクセス
2. プロジェクトを選択
3. 左側メニューから「Authentication」→「Providers」を選択
4. 「Google」を有効化
5. Google Cloud Consoleで取得した**クライアントID**と**クライアントシークレット**を入力
6. 「Save」をクリック

> **注意**: Supabaseの現在のUIには「Additional OAuth Scopes」欄がありません。
> スコープはクライアント側の`signInWithOAuth`の`scopes`オプションで指定します（実装済み）。

### 2.2 リダイレクトURLの設定

1. 「Authentication」→「URL Configuration」を選択
2. **Site URL**を設定:
   - 開発環境: `http://localhost:3000`
   - 本番環境: `https://your-domain.com`
3. **Redirect URLs**に以下を追加:
   - `http://localhost:3000/api/auth/callback`
   - `https://your-domain.com/api/auth/callback` (本番環境)

## 3. 環境変数の設定

`.env.local`ファイルに以下の環境変数を設定します:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# リダイレクトURI
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# サイトURL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 環境変数の取得方法

- **NEXT_PUBLIC_SUPABASE_URL**: Supabase Dashboard → Settings → API → Project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase Dashboard → Settings → API → Project API keys → anon public
- **GOOGLE_CLIENT_ID**: Google Cloud Console → 認証情報 → OAuth 2.0 クライアントID
- **GOOGLE_CLIENT_SECRET**: Google Cloud Console → 認証情報 → OAuth 2.0 クライアントID

## 4. アプリケーションの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスし、「Googleでログイン」ボタンをクリックして認証フローをテストします。

## 5. トラブルシューティング

### エラー: "redirect_uri_mismatch"

- Google Cloud Consoleで設定したリダイレクトURIと、アプリケーションで使用しているリダイレクトURIが一致していることを確認してください。
- Supabaseの「URL Configuration」でも同じリダイレクトURIが設定されていることを確認してください。

### エラー: "access_denied"

- OAuth同意画面でテストユーザーとして登録されていることを確認してください（開発中）。
- 必要なスコープが正しく設定されていることを確認してください。

### セッションが保持されない

- Cookieの設定を確認してください。
- ブラウザのCookieが有効になっていることを確認してください。
- HTTPSを使用している場合は、`secure`フラグが正しく設定されていることを確認してください。

### Refresh Tokenが取得できない（null になる）

**原因1: Googleアカウントで既にアプリへのアクセス許可がある**

Googleは一度アクセス許可を与えたアプリに対して、2回目以降はRefresh Tokenを返さない仕様があります。

**解決方法:**
1. [Googleアカウントのセキュリティ設定](https://myaccount.google.com/permissions)にアクセス
2. 該当アプリ（NegAlert）を探して「アクセス権を削除」をクリック
3. 再度ログインすると、初回と同じように同意画面が表示され、Refresh Tokenが取得できます

**原因2: Google Cloud Consoleのリダイレクトが間違っている**

Google Cloud Console → 認証情報 → OAuth 2.0 クライアントID で、「承認済みのリダイレクトURI」に**Supabase側のCallback URL**（`https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`）が設定されているか確認してください。

**原因3: prompt='consent' が正しく送信されていない**

ブラウザの開発者ツールでネットワークタブを開き、Googleへのリダイレクト時のURLパラメータに `prompt=consent` が含まれているか確認してください。

### ビジネスプロフィールの管理権限が表示されない

**確認方法:**
1. ログイン時にGoogleの同意画面が表示されたら、権限一覧を確認
2. 「ビジネス プロフィールの管理」が表示されていない場合は以下を確認:

**チェックリスト:**
- [ ] Google Cloud Console → APIライブラリ → 「Google My Business API」（または「Business Profile API」）が有効になっている
- [ ] Google Cloud Console → OAuth同意画面 → スコープに `business.manage` が追加されている
- [ ] アプリのコード（`lib/api/auth.ts`）で `scopes: 'https://www.googleapis.com/auth/business.manage'` が設定されている

## 6. 本番環境へのデプロイ

1. Google Cloud Consoleで本番環境のリダイレクトURIを追加
2. Supabaseで本番環境のリダイレクトURLを追加
3. 環境変数を本番環境に設定:
   - `NEXT_PUBLIC_SITE_URL`を本番ドメインに変更
   - `NEXT_PUBLIC_GOOGLE_REDIRECT_URI`を本番ドメインに変更
4. OAuth同意画面を「本番」に変更（Google Cloud Console）

## 参考リンク

- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Google My Business API](https://developers.google.com/my-business)
