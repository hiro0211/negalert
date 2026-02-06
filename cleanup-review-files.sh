#!/bin/bash
# Google OAuth審査用ファイルのクリーンアップスクリプト
# 使用方法: bash cleanup-review-files.sh

echo "🧹 Google OAuth審査用ファイルのクリーンアップを開始します..."
echo ""

# 削除対象のファイルリスト
FILES=(
  "RESTORE_PRODUCTION_DATA.md"
  "GOOGLE_OAUTH_REVIEW_GUIDE.md"
  "MOCK_MODE_SUMMARY.md"
  "OPENAI_API_DEMO_GUIDE.md"
)

# 削除前の確認
echo "以下のファイルを削除します:"
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (見つかりません)"
  fi
done

echo ""
read -p "削除を実行しますか？ (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "❌ キャンセルしました"
  exit 0
fi

echo ""
echo "削除を実行中..."

# ファイルを削除
deleted_count=0
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    rm "$file"
    echo "  ✓ $file を削除しました"
    deleted_count=$((deleted_count + 1))
  fi
done

# このスクリプト自体も削除
if [ -f "cleanup-review-files.sh" ]; then
  echo ""
  read -p "このスクリプト自体も削除しますか？ (y/N): " delete_self
  if [ "$delete_self" = "y" ] || [ "$delete_self" = "Y" ]; then
    rm "cleanup-review-files.sh"
    echo "  ✓ cleanup-review-files.sh を削除しました"
    deleted_count=$((deleted_count + 1))
  fi
fi

echo ""
echo "✅ クリーンアップ完了: ${deleted_count}個のファイルを削除しました"
echo ""
echo "次のステップ:"
echo "1. .env.local で NEXT_PUBLIC_USE_MOCK_DATA=false に変更"
echo "2. npm run dev でサーバーを再起動"
echo "3. git add . && git commit -m 'chore: 審査用ファイル削除'"
echo "4. git push origin main"
