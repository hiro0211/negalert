# Google OAuth審査用ファイルのクリーンアップスクリプト（Windows PowerShell）
# 使用方法: .\cleanup-review-files.ps1

Write-Host "🧹 Google OAuth審査用ファイルのクリーンアップを開始します..." -ForegroundColor Cyan
Write-Host ""

# 削除対象のファイルリスト
$files = @(
    "RESTORE_PRODUCTION_DATA.md",
    "GOOGLE_OAUTH_REVIEW_GUIDE.md",
    "MOCK_MODE_SUMMARY.md",
    "OPENAI_API_DEMO_GUIDE.md"
)

# 削除前の確認
Write-Host "以下のファイルを削除します:" -ForegroundColor Yellow
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (見つかりません)" -ForegroundColor Red
    }
}

Write-Host ""
$confirm = Read-Host "削除を実行しますか？ (y/N)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ キャンセルしました" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "削除を実行中..." -ForegroundColor Cyan

# ファイルを削除
$deletedCount = 0
foreach ($file in $files) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ $file を削除しました" -ForegroundColor Green
        $deletedCount++
    }
}

# このスクリプト自体も削除
if (Test-Path "cleanup-review-files.ps1") {
    Write-Host ""
    $deleteSelf = Read-Host "このスクリプト自体も削除しますか？ (y/N)"
    if ($deleteSelf -eq "y" -or $deleteSelf -eq "Y") {
        Remove-Item "cleanup-review-files.ps1" -Force
        Write-Host "  ✓ cleanup-review-files.ps1 を削除しました" -ForegroundColor Green
        $deletedCount++
    }
}

# Bash版スクリプトも削除
if (Test-Path "cleanup-review-files.sh") {
    $deleteBash = Read-Host "Bash版スクリプト (cleanup-review-files.sh) も削除しますか？ (y/N)"
    if ($deleteBash -eq "y" -or $deleteBash -eq "Y") {
        Remove-Item "cleanup-review-files.sh" -Force
        Write-Host "  ✓ cleanup-review-files.sh を削除しました" -ForegroundColor Green
        $deletedCount++
    }
}

Write-Host ""
Write-Host "✅ クリーンアップ完了: ${deletedCount}個のファイルを削除しました" -ForegroundColor Green
Write-Host ""
Write-Host "次のステップ:" -ForegroundColor Yellow
Write-Host "1. .env.local で NEXT_PUBLIC_USE_MOCK_DATA=false に変更"
Write-Host "2. npm run dev でサーバーを再起動"
Write-Host "3. git add . && git commit -m 'chore: 審査用ファイル削除'"
Write-Host "4. git push origin main"
