# デモ用ブランチワークフロー

## 📋 現在の状態

```
✅ main ブランチ: 本番用（モック実装前の状態を維持）
✅ demo-for-oauth-review ブランチ: 審査用（モック実装済み）← 現在ここ
```

## 🎯 ブランチ戦略

### ブランチの役割

| ブランチ | 状態 | 用途 |
|---------|------|------|
| `main` | モック実装前（クリーン） | 審査合格後の本番用 |
| `demo-for-oauth-review` | モック実装済み | デモ動画撮影・審査提出用 |

### 環境変数設定

#### Vercel本番環境の設定

**現在の設定**:
```
Settings → General → Production Branch
→ demo-for-oauth-review に変更
```

**環境変数**:
```
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
OPENAI_API_KEY=...
```

## 🎬 デモ動画撮影の流れ

### 1. Vercel設定変更

```
Vercel Dashboard → Settings → General
→ Production Branch を "demo-for-oauth-review" に変更
→ Save
```

### 2. 自動デプロイ確認

ブランチをプッシュした時点で自動的にデプロイされています：
```
https://your-app.vercel.app
```

### 3. デモ動画撮影

本番URLで撮影：
- OAuth認証フロー
- モックデータでのUI表示
- OpenAI API分析の実行
- レビューへの返信デモ

### 4. 審査提出

- YouTubeに動画アップロード
- Google Cloud Consoleから審査申請

## ✅ 審査合格後の手順

### ステップ1: Vercel本番ブランチを戻す

```
Vercel Dashboard → Settings → General
→ Production Branch を "main" に戻す
→ Save
```

### ステップ2: 環境変数を本番モードに変更

```
Vercel → Settings → Environment Variables
→ NEXT_PUBLIC_USE_MOCK_DATA を false に変更（または削除）
→ Save
```

### ステップ3: ローカルでmainブランチに切り替え

```bash
git checkout main
```

### ステップ4: デモ用ブランチを削除（オプション）

```bash
# ローカルブランチを削除
git branch -D demo-for-oauth-review

# リモートブランチを削除
git push origin --delete demo-for-oauth-review
```

## 🔄 緊急時: デモブランチから本番に切り替え

もしデモ撮影中に緊急で本番に戻す必要がある場合：

```bash
# Vercelで Production Branch を main に戻す
# または
# mainブランチに緊急修正をプッシュ
git checkout main
git push origin main
```

## 📊 現在のブランチ状態

### コミット履歴

```
main: 
  └─ 最後のクリーンな状態（本番用）

demo-for-oauth-review:
  └─ main + モック実装
     - 完全なモックデータ
     - OpenAI API分析（実行）
     - 統計データのモック化
     - 審査用ドキュメント
```

### ファイル差分

```bash
# 差分を確認
git diff main demo-for-oauth-review

# 変更されたファイル一覧
git diff --name-status main demo-for-oauth-review
```

## 🎯 審査合格後の最終状態

```
main (本番用・クリーン)
  ↓
[Vercel本番環境] ← mainブランチをデプロイ
  ↓
本番サービス開始
  ↓
demo-for-oauth-review ブランチは削除済み ✓
```

## ⚠️ 重要な注意事項

### やってはいけないこと

❌ **demo-for-oauth-review を main にマージしない**
- 理由：モック実装コードを本番に持ち込まない

❌ **本番で NEXT_PUBLIC_USE_MOCK_DATA=true のまま運用**
- 理由：実際のユーザーがモックデータを見てしまう

### 推奨される運用

✅ **審査期間中**:
- Vercel Production Branch: `demo-for-oauth-review`
- 環境変数: `NEXT_PUBLIC_USE_MOCK_DATA=true`

✅ **審査合格後**:
- Vercel Production Branch: `main`
- 環境変数: `NEXT_PUBLIC_USE_MOCK_DATA=false` または未設定
- demo-for-oauth-review ブランチは削除

## 📝 チェックリスト

### デモ動画撮影前

- [x] demo-for-oauth-review ブランチを作成
- [x] モック実装をコミット
- [x] リモートにプッシュ
- [ ] Vercel Production Branch を変更
- [ ] 環境変数 NEXT_PUBLIC_USE_MOCK_DATA=true を設定
- [ ] 本番URLで動作確認

### デモ動画撮影

- [ ] OAuth認証フローを撮影
- [ ] ダッシュボード表示を撮影
- [ ] レビュー管理機能を撮影
- [ ] OpenAI API分析を撮影
- [ ] YouTubeにアップロード

### 審査提出

- [ ] Google Cloud Consoleで審査申請
- [ ] 動画URLを提出
- [ ] 審査結果を待つ

### 審査合格後

- [ ] Vercel Production Branch を main に戻す
- [ ] NEXT_PUBLIC_USE_MOCK_DATA を false に変更
- [ ] 本番環境で動作確認
- [ ] demo-for-oauth-review ブランチを削除
- [ ] 本番サービス開始

## 🆘 トラブルシューティング

### 問題: デプロイが失敗する

**原因**: 環境変数が不足している

**解決策**:
```
Vercel → Settings → Environment Variables
→ すべての必須環境変数を確認
```

### 問題: モックデータが表示されない

**原因**: 環境変数が設定されていない

**解決策**:
```
NEXT_PUBLIC_USE_MOCK_DATA=true が設定されているか確認
Vercel → Settings → Environment Variables
```

### 問題: ブランチの切り替えができない

**原因**: 未コミットの変更がある

**解決策**:
```bash
git status
git stash  # 一時的に変更を退避
git checkout main
git stash pop  # 変更を戻す
```

---

**作成日**: 2026-02-06  
**現在のブランチ**: demo-for-oauth-review  
**次のアクション**: Vercel Production Branchを変更してデモ動画撮影
