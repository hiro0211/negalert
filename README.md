# NegAlert - Googleレビュー特化SaaS MVP

NegAlertは、Googleレビューに特化したレビュー管理SaaSのMVPです。特に「Review Inbox（受信箱）中心の運用UI」を最優先で実装しています。

## 🎯 プロジェクト概要

### 主な特徴

- ✅ Next.js 14 App Router + TypeScript
- ✅ Tailwind CSS + shadcn/ui でモダンなUI
- ✅ Recharts によるデータ可視化
- ✅ Zustand による軽量状態管理
- ✅ 日本語UIで統一
- ✅ 競合SaaSのベストプラクティスを模倣

## 🚀 起動方法

### 必要な環境

- Node.js 21.7.1以上（推奨）
- npm 10.5.0以上

### インストールと起動

```bash
# ディレクトリに移動
cd negalert

# 依存関係のインストール（既にインストール済みの場合はスキップ可）
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが起動します。

### ビルド

```bash
npm run build
npm start
```

## 📂 プロジェクト構造

```
negalert/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # トップ → /login へリダイレクト
│   ├── login/                    # ログイン画面
│   ├── onboarding/               # オンボーディング（connect, location）
│   └── dashboard/                # ダッシュボード（メイン画面）
│       ├── layout.tsx            # サイドバー + ヘッダーレイアウト
│       ├── page.tsx              # ダッシュボードホーム
│       ├── inbox/                # Review Inbox（★最重要画面）
│       ├── reviews/[id]/         # レビュー詳細ページ
│       ├── todos/                # ToDo管理
│       ├── settings/             # 設定
│       └── billing/              # 料金プラン
├── components/
│   ├── ui/                       # shadcn/uiコンポーネント
│   ├── common/                   # 共通コンポーネント（StarRating, Badge等）
│   ├── layout/                   # レイアウトコンポーネント
│   ├── inbox/                    # Inbox関連コンポーネント
│   ├── reviews/                  # レビュー詳細関連コンポーネント
│   └── dashboard/                # ダッシュボード関連コンポーネント
├── lib/
│   ├── mock/                     # モックデータ（reviews, stats, todos, user）
│   ├── types.ts                  # TypeScript型定義
│   ├── store.ts                  # Zustand状態管理
│   └── utils.ts                  # ユーティリティ関数
└── README.md                     # このファイル
```

## 🎨 実装画面一覧

### 1. 認証・オンボーディング
- `/login` - ログイン画面（モック認証）
- `/onboarding/connect` - Google接続（Step 1/3）
- `/onboarding/location` - ロケーション選択（Step 2/3）

### 2. ダッシュボード
- `/dashboard` - ダッシュボードホーム
  - 指標カード（平均★、レビュー数、ネガ率、返信率）
  - レビュー推移グラフ
  - 星評価分布（ドーナツチャート）
  - ネガ要因TOP3（横棒グラフ）
  - 今日やることウィジェット

### 3. Review Inbox（★最重要）
- `/dashboard/inbox` - レビュー一覧
  - フィルタバー（未返信/ネガ/期間/検索）
  - テーブル形式（日付/ソース/評価/レビュー/ステータス/リスク/アクション）
  - 統計バッジ（未読/要対応/返信済）
  - スライドオーバー詳細表示

### 4. レビュー詳細
- `/dashboard/reviews/[id]` - レビュー詳細ページ
  - 左カラム：レビュー本文、返信エディタ（トーン切替機能）
  - 右カラム：AI分析パネル、ToDo生成、通知ログ

### 5. その他
- `/dashboard/todos` - ToDo管理（追加/完了/削除）
- `/dashboard/settings` - 設定（通知/返信設定/危険語辞書）
- `/dashboard/billing` - 料金プラン・請求履歴

## 🏆 競合UIから模倣した具体的ポイント

### 1. Reputation.com（Unified Review Inbox概念）
- **単一フィードで全レビュー管理**: 複数ソースを統合する設計思想を採用
- **AI-Assisted Responses**: 返信案自動生成を画面中心に配置
- 参考: https://reputation.com/platform/reviews

### 2. BrightLocal Review Inbox
- **テーブル列構成**: Date/Source/Rating/Status/Actionの5列構造をそのまま採用
- **フィルタバーの配置**: 上部に固定し、未読/ネガ/期間フィルタを横並び
- **ステータスバッジ**: 未返信（赤）/返信済（緑）の色分け
- **ページネーション表記**: "Showing 1-20 of 92 results"の形式
- 参考: BrightLocal Review Inbox ヘルプページ

### 3. Birdeye Inbox Reports
- **Median Response Time指標**: ダッシュボード指標カードに採用
- **Active Conversations概念**: 未返信カウントとして表示
- **左ナビ > Reports > Inbox**: ナビゲーション階層の設計
- 参考: https://support.birdeye.com/en/articles/12654002-understanding-inbox-reports

### 4. ReviewTrackers左サイドバー
- **アイコン付きナビゲーション**: Dashboard/Inbox/Todos/Settings/Billingのアイコン配置
- **シンプルな階層構造**: 3-5項目のフラットなナビ（深い階層を避ける）
- 参考: https://www.reviewtrackers.com/

### 5. BrightLocal/Reputation Manager Overview画面
- **指標カード4枚構成**: 平均★/総数/ネガ率/返信率のレイアウト
- **大きな数値表示**: 平均★を目立たせる（Average Star Rating 4.20）
- **ドーナツ+折れ線グラフ**: Star Rating Breakdown + Review Growthの組み合わせ

### 6. BrightLocal Auto-Replies
- **Inbox内でのルール管理**: NegAlertの「返信エディタ内トーン切替」の着想元
- **テンプレート中心設計**: Settings > 返信設定タブでテンプレート管理

## 📊 モックデータ

すべてのデータは `/lib/mock/` に格納されています。

- **reviews.ts**: 15件のレビューデータ（★1〜5の分布、未返信/返信済/自動返信）
- **stats.ts**: ダッシュボード指標（平均評価、レビュー推移、星分布、ネガ要因）
- **todos.ts**: 5件のToDoデータ
- **user.ts**: ユーザーとロケーション情報

## 🔧 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 14 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| UIコンポーネント | shadcn/ui |
| グラフ | Recharts |
| 状態管理 | Zustand |
| 日付処理 | date-fns |
| アイコン | lucide-react |

## 🎯 設計原則

1. **後方互換性**: モックデータは`lib/mock/`に集約し、将来的にAPI呼び出しに差し替え可能
2. **shadcn/ui中心**: 極力カスタムCSSを避け、shadcn/uiのコンポーネントで実装
3. **日本語UI**: 全ラベル/メッセージは日本語（内部キー/型定義は英語OK）
4. **レスポンシブ非対応（MVP）**: デスクトップ優先、モバイル対応は後回し
5. **ダミー認証**: ログイン画面は見た目のみ、実際の認証ロジックは将来実装

## 🚦 次のステップ（実装していない機能）

- [ ] バックエンド実装（Supabase等）
- [ ] 実際の認証（Auth.js等）
- [ ] Google My Business API連携
- [ ] 決済機能（Stripe）
- [ ] メール/Slack通知の実装
- [ ] レスポンシブデザイン（モバイル対応）
- [ ] 多言語対応
- [ ] ダークモード

## 📝 ライセンス

このプロジェクトはMVPのデモンストレーション目的で作成されています。

## 🙏 謝辞

このプロジェクトは、BrightLocal、Reputation.com、Birdeye、ReviewTrackersなどの優れたレビュー管理SaaSのUIデザインを参考にさせていただきました。競合製品の優れた設計思想に深く感謝いたします。
