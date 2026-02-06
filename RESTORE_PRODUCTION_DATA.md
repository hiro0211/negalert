# 本番データへの復元手順

## 概要

このドキュメントは、Google OAuth審査用に一時的にモックデータモードに切り替えた後、本番環境でSupabaseからの実データ取得に戻す手順を説明します。

## 📋 現在の状態（モックモード）

現在、アプリケーションは以下の設定で動作しています：

- **環境変数**: `NEXT_PUBLIC_USE_MOCK_DATA=true`
- **データソース**: 静的モックデータ（`lib/data/mock-data.ts`）
- **Google API**: モック実装（実際のAPIを呼び出さない）

### モックモードで影響を受けるファイル

1. `lib/api/reviews/mock.ts` - レビューデータを静的モックから取得
2. `lib/api/workspaces/mock.ts` - ワークスペースデータを静的モックから取得
3. `lib/api/google-mybusiness.ts` - Google My Business APIの呼び出しをモック化
4. `app/api/mock/import-place-reviews/route.ts` - Google Places APIの呼び出しをモック化
5. `lib/api/stats.ts` - ダッシュボード統計データを静的モックから取得

## 🔄 本番データへの復元手順

### ステップ1: 環境変数の変更

`.env.local` ファイルを開き、以下の行を変更します：

```bash
# 変更前（モックモード）
NEXT_PUBLIC_USE_MOCK_DATA=true

# 変更後（本番モード）
NEXT_PUBLIC_USE_MOCK_DATA=false
```

または、行をコメントアウトします：

```bash
# NEXT_PUBLIC_USE_MOCK_DATA=true
```

### ステップ2: 開発サーバーの再起動

環境変数の変更を反映するため、開発サーバーを再起動します：

```bash
# 1. 現在のサーバーを停止（Ctrl+C）

# 2. サーバーを再起動
npm run dev
```

### ステップ3: 動作確認

以下の項目を確認して、本番データが正しく取得されることを確認してください：

#### 3.1 ログイン後のダッシュボード

1. Google OAuth認証でログイン
2. ダッシュボードにSupabaseのデータが表示されることを確認

#### 3.2 店舗同期

1. 設定ページで「店舗を同期」ボタンをクリック
2. Google Business Profileから実際の店舗データが取得されることを確認

#### 3.3 レビュー同期

1. 「レビューを同期」ボタンをクリック
2. Google My Business APIから実際のレビューが取得され、Supabaseに保存されることを確認

#### 3.4 コンソールログの確認

ブラウザの開発者ツールのコンソールで、以下のようなモック関連のログが**表示されない**ことを確認：

```
[Mock] モックの店舗一覧を返します
[Mock] Workspace同期をスキップ
🎭 [Mock] モックレビューデータを使用します
```

### ステップ4: 本番環境へのデプロイ（該当する場合）

Vercel、Netlify、またはその他のホスティングサービスにデプロイする場合：

1. 環境変数 `NEXT_PUBLIC_USE_MOCK_DATA` を `false` に設定、または削除
2. アプリケーションを再デプロイ
3. 本番環境で動作確認を実施

## ⚠️ 注意事項

### モックモードとの違い

| 項目 | モックモード | 本番モード |
|------|-------------|----------|
| レビューデータ | 静的（20件固定） | Supabaseから動的取得 |
| ワークスペース | 固定2店舗 | Google API + Supabase |
| ダッシュボード統計 | 事前計算済み | Supabaseから動的計算 |
| Google API呼び出し | スキップ | 実際に実行 |
| データの永続化 | なし | Supabaseに保存 |

### トラブルシューティング

#### 問題: データが表示されない

**原因**: Supabaseにデータが存在しない

**解決策**:
1. Google OAuth認証でログイン
2. 「店舗を同期」を実行
3. 「レビューを同期」を実行

#### 問題: Google API エラーが発生

**原因**: アクセストークンの期限切れ、または権限不足

**解決策**:
1. 再度ログインして新しいトークンを取得
2. Google Cloud Consoleで必要なスコープが設定されているか確認：
   - `https://www.googleapis.com/auth/business.manage`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

#### 問題: 環境変数が反映されない

**原因**: Next.jsサーバーが古いキャッシュを使用

**解決策**:
```bash
# .next フォルダを削除してクリーンビルド
rm -rf .next
npm run dev
```

## 📝 コード変更の詳細（参考）

モックモードへの切り替えで変更したファイルと、復元時に自動的に本番モードに戻る仕組み：

### 自動切り替えの仕組み

各APIファイルは環境変数 `NEXT_PUBLIC_USE_MOCK_DATA` を参照して、自動的にモック実装と本番実装を切り替えます：

```typescript
// lib/api/reviews/index.ts
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
const reviewsApi = USE_MOCK_DATA ? MockReviewsApi : ProductionReviewsApi;
```

そのため、**環境変数を変更するだけで、コードの修正は不要**です。

### モックデータファイル（削除は不要）

以下のファイルはモックモード時のみ使用されます。本番モードでは参照されないため、削除する必要はありません。将来的にテストやデモで再利用できます。

- `lib/data/mock-data.ts` - レビュー・店舗モックデータ
- `lib/data/mock-stats.ts` - 統計データモックデータ

## 🗑️ 審査用ファイルのクリーンアップ（オプション）

審査合格後、以下のファイルは不要になります。削除することでコードベースをクリーンに保てます。

### 削除推奨ファイル

#### ドキュメントファイル（審査専用）
```bash
# 審査用ガイドドキュメント
RESTORE_PRODUCTION_DATA.md        # このファイル（復元手順）
GOOGLE_OAUTH_REVIEW_GUIDE.md      # OAuth審査ガイド
MOCK_MODE_SUMMARY.md              # モック実装サマリー
OPENAI_API_DEMO_GUIDE.md          # OpenAI APIデモガイド
```

#### モックデータファイル（必要に応じて保持も可）
```bash
# モックデータ定義（テスト時に再利用可能）
lib/data/mock-data.ts             # レビュー・店舗モックデータ
lib/data/mock-stats.ts            # 統計データモックデータ
```

### クリーンアップ手順

#### ステップ1: 審査用ドキュメントの削除

```bash
# プロジェクトルートで実行
rm RESTORE_PRODUCTION_DATA.md
rm GOOGLE_OAUTH_REVIEW_GUIDE.md
rm MOCK_MODE_SUMMARY.md
rm OPENAI_API_DEMO_GUIDE.md
```

または、Windowsの場合：
```powershell
del RESTORE_PRODUCTION_DATA.md
del GOOGLE_OAUTH_REVIEW_GUIDE.md
del MOCK_MODE_SUMMARY.md
del OPENAI_API_DEMO_GUIDE.md
```

#### ステップ2: モックデータファイルの削除（オプション）

**注意**: これらのファイルは将来のテストやデモで再利用できます。削除は慎重に判断してください。

```bash
# モックデータを完全に削除する場合
rm lib/data/mock-data.ts
rm lib/data/mock-stats.ts
```

または、保持する場合は何もしない（推奨）。

#### ステップ3: モックモード関連コードの削除（オプション・上級者向け）

**警告**: この手順は上級者向けです。慎重に実行してください。

モックモードの条件分岐コードを削除して、本番モードのみにする場合：

1. **環境変数チェックの削除**
   ```typescript
   // 削除対象の例
   const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
   ```

2. **条件分岐の削除**
   ```typescript
   // 削除対象の例
   if (USE_MOCK_DATA) {
     // モックモードの処理
   } else {
     // 本番モードの処理
   }
   ```

3. **影響を受けるファイル**
   - `lib/api/reviews/index.ts`
   - `lib/api/workspaces/index.ts`
   - `lib/api/stats.ts`
   - `lib/api/reviews-db.ts`
   - `lib/api/google-mybusiness.ts`
   - `app/api/reviews/[id]/reply/route.ts`
   - `app/api/mock/import-place-reviews/route.ts`

**推奨**: モックモードのコードは残しておくことを推奨します。将来的なテストやデバッグに役立ちます。

#### ステップ4: `.env.local` の整理

```bash
# .env.local から以下の行を削除またはコメントアウト
# NEXT_PUBLIC_USE_MOCK_DATA=true
```

モック関連の説明コメントも削除可能：
```bash
# 削除前
# =====================================
# テスト・デバッグ設定
# =====================================
# モックデータモード（Google OAuth審査用デモ動画作成用）
# ...（長い説明）...
NEXT_PUBLIC_USE_MOCK_DATA=true

# 削除後（シンプルに）
# モックデータモード（テスト用）
# NEXT_PUBLIC_USE_MOCK_DATA=true
```

### クリーンアップの判断基準

| ファイル/コード | 削除推奨 | 理由 |
|----------------|---------|------|
| 審査用ドキュメント | ✅ 推奨 | 審査後は不要 |
| モックデータファイル | ⚠️ 保持推奨 | テスト時に再利用可能 |
| モックモードコード | ⚠️ 保持推奨 | 将来のデバッグに有用 |
| モックモード環境変数 | ✅ コメントアウト | 誤って有効化しないように |

### 本番環境へのクリーンデプロイ

審査合格後、本番環境に以下の手順でデプロイ：

```bash
# 1. 審査用ドキュメントを削除
rm RESTORE_PRODUCTION_DATA.md GOOGLE_OAUTH_REVIEW_GUIDE.md MOCK_MODE_SUMMARY.md OPENAI_API_DEMO_GUIDE.md

# 2. .env.local でモックモードを無効化
# NEXT_PUBLIC_USE_MOCK_DATA=false

# 3. Gitにコミット
git add .
git commit -m "chore: 審査用ドキュメント削除、本番モードに切り替え"

# 4. 本番環境にデプロイ
git push origin main

# 5. Vercel/Netlifyで環境変数を確認
# NEXT_PUBLIC_USE_MOCK_DATA が false または未設定であることを確認
```

## ✅ 復元完了チェックリスト

### 必須作業
- [ ] `.env.local` の `NEXT_PUBLIC_USE_MOCK_DATA` を `false` に変更、またはコメントアウト
- [ ] 開発サーバーを再起動（`npm run dev`）
- [ ] Google OAuth認証でログイン成功
- [ ] 「店舗を同期」が正常に動作（実際のGoogle APIを呼び出す）
- [ ] 「レビューを同期」が正常に動作（実際のレビューがSupabaseに保存される）
- [ ] ダッシュボードにSupabaseのデータが表示される
- [ ] コンソールに `[Mock]` のログが表示されない
- [ ] （本番環境の場合）Vercel/Netlifyの環境変数を更新してデプロイ

### オプション作業（クリーンアップ）
- [ ] 審査用ドキュメント（4ファイル）を削除
- [ ] モックデータファイルの保持/削除を判断
- [ ] `.env.local` のコメントを簡潔に整理
- [ ] Gitコミット: "chore: 審査用ドキュメント削除、本番モードに切り替え"
- [ ] 本番環境にデプロイ

## 🎯 Google OAuth審査後のワークフロー

1. **審査用動画撮影**: モックモード（`NEXT_PUBLIC_USE_MOCK_DATA=true`）
2. **審査提出**: 動画をYouTubeにアップロードして審査申請
3. **審査中**: モックモードのまま待機（通常2-4週間）
4. **審査合格後**: 
   - このドキュメントの手順で本番モードに復元
   - 審査用ドキュメントをクリーンアップ（上記参照）
5. **本番リリース**: Supabaseとの連携を開始

## 📋 審査合格後のクイックスタートガイド

### 最小限の手順（5分で完了）

```bash
# 1. モックモードを無効化
# .env.local を開いて以下を変更
NEXT_PUBLIC_USE_MOCK_DATA=false

# 2. サーバーを再起動
npm run dev

# 3. 動作確認
# - ログイン
# - 店舗同期
# - レビュー同期

# 4. 審査用ドキュメントを削除（オプション）
# Windows:
.\cleanup-review-files.ps1

# Mac/Linux:
bash cleanup-review-files.sh

# または手動削除:
# rm RESTORE_PRODUCTION_DATA.md GOOGLE_OAUTH_REVIEW_GUIDE.md MOCK_MODE_SUMMARY.md OPENAI_API_DEMO_GUIDE.md

# 5. 本番環境にデプロイ
git add .
git commit -m "chore: 本番モードに切り替え、審査用ファイル削除"
git push origin main
```

### 完全なクリーンアップ（15分で完了）

上記の手順に加えて：

```bash
# 6. モックデータファイルも削除（オプション）
rm lib/data/mock-data.ts
rm lib/data/mock-stats.ts

# 7. .env.local のコメントを整理
# モック関連の長い説明を削除または簡潔化

# 8. 再度コミット
git add .
git commit -m "chore: モックデータファイルも削除"
git push origin main
```

## 📞 サポート

問題が解決しない場合は、以下を確認してください：

1. **環境変数**: `.env.local` ファイルの設定
2. **Supabaseの接続**: `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Google OAuth設定**: `GOOGLE_CLIENT_ID` と `GOOGLE_CLIENT_SECRET`
4. **ブラウザのコンソール**: エラーメッセージの確認
5. **サーバーログ**: ターミナルのログ出力

## 📦 審査用ファイル一覧（削除対象の完全リスト）

### 審査専用ドキュメント（削除推奨 ✅）

```
📄 RESTORE_PRODUCTION_DATA.md        ← このファイル
📄 GOOGLE_OAUTH_REVIEW_GUIDE.md      ← OAuth審査の完全ガイド
📄 MOCK_MODE_SUMMARY.md              ← モック実装のサマリー
📄 OPENAI_API_DEMO_GUIDE.md          ← AI分析デモ撮影ガイド
```

**自動削除スクリプト（推奨）**:

Windows PowerShell:
```powershell
.\cleanup-review-files.ps1
```

Mac/Linux:
```bash
bash cleanup-review-files.sh
```

**手動削除コマンド**:

Windows:
```powershell
del RESTORE_PRODUCTION_DATA.md, GOOGLE_OAUTH_REVIEW_GUIDE.md, MOCK_MODE_SUMMARY.md, OPENAI_API_DEMO_GUIDE.md
```

Mac/Linux:
```bash
rm RESTORE_PRODUCTION_DATA.md GOOGLE_OAUTH_REVIEW_GUIDE.md MOCK_MODE_SUMMARY.md OPENAI_API_DEMO_GUIDE.md
```

### モックデータファイル（保持推奨 ⚠️）

```
📁 lib/data/
  📄 mock-data.ts                    ← レビュー・店舗モックデータ
  📄 mock-stats.ts                   ← 統計データモックデータ
```

**理由**: 将来のテスト、デモ、開発時に再利用可能

**削除する場合（慎重に）**:
```bash
rm lib/data/mock-data.ts lib/data/mock-stats.ts
```

### モックモード実装コード（保持推奨 ⚠️）

以下のファイルにはモックモードの条件分岐が含まれていますが、**削除は推奨しません**：

```
lib/api/reviews/mock.ts              ← モックAPIの実装
lib/api/workspaces/mock.ts           ← モックAPIの実装
lib/api/reviews/index.ts             ← モード切り替えロジック
lib/api/workspaces/index.ts          ← モード切り替えロジック
lib/api/stats.ts                     ← モード切り替えロジック
lib/api/reviews-db.ts                ← モード切り替えロジック
lib/api/google-mybusiness.ts         ← モード切り替えロジック
app/api/reviews/[id]/reply/route.ts  ← モード切り替えロジック
app/api/mock/import-place-reviews/route.ts ← モック専用API
```

**理由**: 
- 将来のデバッグやテストに有用
- 本番環境では `NEXT_PUBLIC_USE_MOCK_DATA=false` で無効化されるため無害
- 削除すると将来の保守が困難になる

### 環境変数（コメントアウト推奨 ✅）

**`.env.local`** の以下の行：
```bash
# 審査後はコメントアウトまたは false に変更
NEXT_PUBLIC_USE_MOCK_DATA=true  ← これを false に変更
```

## 🚀 本番環境デプロイ前のチェックリスト

### Gitコミット前の確認

```bash
# 1. 削除したファイルを確認
git status

# 削除されるべきファイル:
# deleted: RESTORE_PRODUCTION_DATA.md
# deleted: GOOGLE_OAUTH_REVIEW_GUIDE.md
# deleted: MOCK_MODE_SUMMARY.md
# deleted: OPENAI_API_DEMO_GUIDE.md

# 2. .env.local が変更されていないことを確認（Gitで追跡されない）
# ローカルで NEXT_PUBLIC_USE_MOCK_DATA=false になっていればOK

# 3. コミット
git add .
git commit -m "chore: 審査用ドキュメント削除、本番モードに切り替え

- 削除: 審査用ドキュメント4ファイル
- 変更: .env.local でモックモード無効化（ローカルのみ）
- 状態: 本番モード（Supabaseから実データ取得）
"

# 4. プッシュ
git push origin main
```

### Vercel/Netlify環境変数の確認

本番環境のダッシュボードで以下を確認：

- [ ] `NEXT_PUBLIC_USE_MOCK_DATA` が **未設定** または **false**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` が正しく設定されている
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しく設定されている
- [ ] `SUPABASE_SERVICE_ROLE_KEY` が正しく設定されている
- [ ] `GOOGLE_CLIENT_ID` が正しく設定されている
- [ ] `GOOGLE_CLIENT_SECRET` が正しく設定されている
- [ ] `OPENAI_API_KEY` が正しく設定されている

### デプロイ後の動作確認

- [ ] 本番環境でログイン成功
- [ ] Google OAuth認証フローが動作
- [ ] 店舗同期が実際のGoogle APIを呼び出す
- [ ] レビュー同期が実際のレビューを取得
- [ ] ダッシュボードにSupabaseのデータが表示
- [ ] AI分析がOpenAI APIを呼び出す
- [ ] 返信投稿がGoogle APIに送信される
- [ ] コンソールに `[Mock]` ログが表示されない

---

**最終更新日**: 2026-02-06  
**作成者**: AI Assistant  
**目的**: Google OAuth審査用の一時的なモックモード実装の復元手順  
**重要**: 審査合格後、このファイル自体も削除してください
