# シーケンス図ドキュメント

NegAlertアプリケーションの主要機能のシーケンス図集です。各機能のデータフローとコンポーネント間の相互作用を詳細に記述しています。

## 目的

- バグ修正時の影響範囲の把握
- 新機能開発時の既存実装の理解
- コードレビュー時の参照資料
- オンボーディング時の学習資料

## シーケンス図一覧

### 1. [認証フロー](./01_AUTHENTICATION_FLOW.md)
Google OAuth 2.0を使用したユーザー認証とトークン管理のフロー

**主要コンポーネント:**
- ログインページ
- OAuth コールバック
- トークン管理

**キーポイント:**
- Supabase Authとの連携
- アクセストークンとリフレッシュトークンの管理
- セキュアなトークン保存

---

### 2. [レビュー同期フロー](./02_REVIEW_SYNC_FLOW.md)
Google Business Profile APIからレビューを取得してSupabaseに同期するフロー

**主要コンポーネント:**
- レビュー同期API
- Google Business Profile API
- トークンリフレッシュ機構

**キーポイント:**
- 自動トークンリフレッシュ（5分バッファ）
- 複数ワークスペースの処理
- UPSERT による重複防止

---

### 3. [AI分析フロー](./03_AI_ANALYSIS_FLOW.md)
OpenAI APIを使用したレビューの自動分析フロー

**主要コンポーネント:**
- AI分析API
- OpenAI API (gpt-4o-mini)
- レビューDB管理

**キーポイント:**
- リスクレベルの自動判定
- カテゴリ分類
- 返信案の自動生成
- モックモード対応

---

### 4. [週間レポート生成フロー](./04_WEEKLY_REPORT_FLOW.md)
直近7日間のレビューをAIが分析して週間レポートを生成するフロー

**主要コンポーネント:**
- レポート生成API
- OpenAI API (gpt-4o-mini)
- ダッシュボードUI

**キーポイント:**
- DB側での期間フィルタリング（ハルシネーション防止）
- トークン制限対策（最大50件）
- 総合評価と具体的なアクションプランの生成

---

### 5. [レビュー返信フロー](./05_REVIEW_REPLY_FLOW.md)
Google Business Profileのレビューへの返信投稿・削除フロー

**主要コンポーネント:**
- レビュー返信API
- Google Business Profile API
- レビューDB管理

**キーポイント:**
- Google APIとDBの両方を更新
- 返信の投稿と削除の両対応
- トークンの自動リフレッシュ

---

## 共通パターン

### 認証フロー
すべてのAPIエンドポイントで以下の認証チェックを実施:

```typescript
const supabase = await createClient();
const { data: { user }, error: authError } = await supabase.auth.getUser();

if (authError || !user) {
  return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
}
```

### トークン管理
Google API呼び出しには有効なアクセストークンが必要:

```typescript
const accessToken = await getValidAccessToken(user.id, supabase);
// 自動的にトークンをリフレッシュ（期限切れの場合）
```

### エラーハンドリング
各APIエンドポイントで統一されたエラーレスポンス:

```typescript
return NextResponse.json({
  success: false,
  error: 'エラーメッセージ'
}, { status: 500 });
```

### モックモード
開発・テスト用のモックモード対応:

```typescript
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
```

---

## 技術スタック

- **フロントエンド**: Next.js 16, React 19, TypeScript
- **バックエンド**: Next.js API Routes
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth + Google OAuth 2.0
- **AI**: OpenAI API (gpt-4o-mini)
- **外部API**: Google Business Profile API

---

## 関連ドキュメント

- [認証アーキテクチャ](../AUTHENTICATION_ARCHITECTURE.md)
- [Google トークン管理](../GOOGLE_TOKEN_MANAGEMENT.md)
- [モックモードガイド](../MOCK_MODE_GUIDE.md)
- [Google 認証セットアップ](../SETUP_GOOGLE_AUTH.md)

---

## 更新履歴

- 2026-02-05: 初版作成
  - 認証フロー
  - レビュー同期フロー
  - AI分析フロー
  - 週間レポート生成フロー
  - レビュー返信フロー
