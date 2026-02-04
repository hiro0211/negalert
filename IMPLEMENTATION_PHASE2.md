# Phase 2: Google店舗情報の取得と保存 - 実装完了

## 実装概要

Google Business Profile APIを使用して店舗情報を取得し、Supabaseの`workspaces`テーブルに保存する機能を実装しました。

## 実装したファイル

### 1. 型定義の追加 (`lib/api/types.ts`)
- `Workspace` 型: workspacesテーブルの型定義
- `SyncLocationsResponse` 型: 同期APIのレスポンス型

### 2. トークン管理の強化 (`lib/api/tokens.ts`)
- **新規関数**: `getValidAccessToken(userId: string): Promise<string>`
  - DBからトークンを取得
  - 有効期限をチェック（5分のバッファ）
  - 期限切れの場合は自動でリフレッシュ
  - 有効なアクセストークンを返す

### 3. トークンリフレッシュの実装 (`lib/api/google-oauth.ts`)
- `refreshAccessToken()` のモックを削除し、実際のGoogle OAuth 2.0 Token Endpointを呼び出す実装に変更
- エラーハンドリングを追加

### 4. Google Business Profile API実装 (`lib/api/google-mybusiness.ts`)
- **定数更新**:
  - `GMB_API_BASE`: `https://mybusinessbusinessinformation.googleapis.com/v1`
  - `GMB_ACCOUNT_API_BASE`: `https://mybusinessaccountmanagement.googleapis.com/v1`

- **新規関数**: `getAccountId(accessToken: string): Promise<string>`
  - `GET ${GMB_ACCOUNT_API_BASE}/accounts` を呼び出し
  - 最初のアカウントのIDを返す
  - エラーハンドリング（401, 403, その他）

- **新規関数**: `listLocations(accessToken: string): Promise<GoogleLocation[]>`
  - `getAccountId()` でアカウントID取得
  - `GET ${GMB_API_BASE}/{accountId}/locations?readMask=name,title,storefrontAddress,metadata` を呼び出し
  - レスポンスを`GoogleLocation[]`型に変換
  - 住所フォーマット処理を含む

- **ヘルパー関数**: `formatAddress(address: any): string`
  - Google Business Profileの住所オブジェクトを文字列に変換

### 5. Workspace管理モジュール (`lib/api/workspaces.ts` 新規作成)
- **`syncWorkspaces(userId, locations, supabase?)`**
  - Google店舗情報をworkspacesテーブルにUPSERT
  - ユニーク制約: `(user_id, google_location_id)`
  - 既存レコードは`updated_at`を更新

- **`getWorkspaces(userId, supabase?)`**
  - ユーザーのワークスペース一覧を取得

- **`getWorkspace(workspaceId, supabase?)`**
  - 特定のワークスペースを取得

- **`deleteWorkspace(workspaceId, userId, supabase?)`**
  - ワークスペースを削除（権限チェック付き）

### 6. 同期APIエンドポイント (`app/api/locations/sync/route.ts` 新規作成)
- **エンドポイント**: `POST /api/locations/sync`
- **処理フロー**:
  1. Supabase Authでユーザー認証
  2. `getValidAccessToken()`で有効なトークン取得
  3. `listLocations()`でGoogle APIから店舗一覧取得
  4. `syncWorkspaces()`でDBに保存
  5. 結果をJSON形式で返す

- **レスポンス例**:
```json
{
  "success": true,
  "locations": [
    {
      "name": "カフェ＆レストラン 桜",
      "locationId": "accounts/123/locations/456",
      "address": "東京都渋谷区道玄坂1-2-3",
      "placeId": "ChIJ..."
    }
  ],
  "syncedCount": 1
}
```

- **エラーレスポンス例**:
```json
{
  "success": false,
  "error": "認証エラー: アクセストークンが無効です"
}
```

## エラーハンドリング

実装した主なエラーケース:

| エラー種類 | HTTPステータス | 対応 |
|-----------|---------------|------|
| 認証エラー（401） | 401 | トークンリフレッシュを試行、失敗時はエラーメッセージ |
| 権限エラー（403） | 403 | 適切なエラーメッセージを返す |
| アカウント/店舗なし | 200 | 空の配列を返す |
| API呼び出し失敗 | 500 | 詳細なエラーログと汎用エラーメッセージ |
| DB保存失敗 | 500 | エラーログとメッセージ |

## 使用方法

### 1. フロントエンドから呼び出し

```typescript
const response = await fetch('/api/locations/sync', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});

const result = await response.json();

if (result.success) {
  console.log(`${result.syncedCount}件の店舗を同期しました`);
  console.log('店舗一覧:', result.locations);
} else {
  console.error('同期エラー:', result.error);
}
```

### 2. 開発時のテスト

1. 開発サーバーを起動:
```bash
npm run dev
```

2. ログイン後、ブラウザのコンソールで実行:
```javascript
fetch('/api/locations/sync', { method: 'POST' })
  .then(res => res.json())
  .then(console.log);
```

3. Supabase Dashboardで`workspaces`テーブルを確認:
```sql
SELECT * FROM workspaces ORDER BY created_at DESC;
```

## 技術的なポイント

### トークンの自動リフレッシュ
- `getValidAccessToken()`が有効期限を自動チェック
- 期限切れ5分前から自動リフレッシュ
- リフレッシュトークンは保持される

### UPSERT処理
- `(user_id, google_location_id)`のユニーク制約を利用
- 既存レコードは`updated_at`のみ更新
- 新規レコードは自動で作成

### エラーログ
- すべての処理で適切なログ出力
- コンソールで処理の流れを追跡可能
- 本番環境では適切なログサービスへの転送を推奨

## 次のステップ

Phase 2が完了したので、次は以下の実装に進むことができます:

1. **Phase 3: レビュー取得機能**
   - `fetchGoogleReviews()`の実装
   - レビューをDBに保存

2. **Phase 4: レビュー返信機能**
   - `replyToGoogleReview()`の実装
   - `updateGoogleReviewReply()`の実装
   - `deleteGoogleReviewReply()`の実装

3. **UI統合**
   - 店舗選択画面での`/api/locations/sync`呼び出し
   - ワークスペース一覧の表示

## トラブルシューティング

### エラー: "認証トークンが見つかりません"
→ 再度ログインしてトークンを取得してください

### エラー: "Google Business Profileアカウントが見つかりません"
→ Google Business Profileアカウントが存在するか確認してください

### エラー: "権限エラー"
→ OAuth同意画面で`business.manage`スコープが設定されているか確認してください

### 店舗が0件返される
→ Google Business Profileに店舗が登録されているか確認してください

## 参考リンク

- [Google Business Profile API - Locations](https://developers.google.com/my-business/reference/businessinformation/rest/v1/accounts.locations)
- [Google Business Profile API - Accounts](https://developers.google.com/my-business/reference/accountmanagement/rest/v1/accounts)
- [OAuth 2.0 Token Endpoint](https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code)
