import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'プライバシーポリシー | NegAlert',
  description: 'NegAlertのプライバシーポリシー - 個人情報の取り扱いについて',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            トップページに戻る
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            プライバシーポリシー
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            最終更新日: 2026年2月6日
          </p>

          {/* セクション1: 基本情報 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. 基本情報
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                NegAlert for Google Reviews（以下「本サービス」）は、Googleレビューの管理・分析サービスを提供しています。
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-semibold mb-2">事業者情報</p>
                <ul className="space-y-1 text-sm">
                  <li><strong>事業者名:</strong> NegAlert 運営事務局</li>
                  <li><strong>連絡先:</strong> <a href="mailto:arimurahiroaki40@gmail.com" className="text-blue-600 hover:underline">arimurahiroaki40@gmail.com</a></li>
                  <li><strong>住所:</strong> 請求があった場合、遅滞なく開示します。</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  ※特定商取引法に基づき、住所は請求に応じて開示いたします。
                </p>
              </div>
            </div>
          </section>

          {/* セクション2: 収集する情報 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. 収集する情報
            </h2>
            <div className="text-gray-700 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">2.1 Google OAuthから取得する情報</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>メールアドレス（ユーザー識別用）</li>
                  <li>プロフィール情報（氏名、プロフィール画像）</li>
                  <li>Google OAuthアクセストークン、リフレッシュトークン</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2.2 Google Business Profile APIから取得する情報</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>店舗情報（店舗名、住所、電話番号）</li>
                  <li>レビュー内容（レビューテキスト、評価、投稿者名、投稿日時）</li>
                  <li>返信内容（既存の返信がある場合）</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2.3 自動収集される情報</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
                  <li>Cookie情報（認証セッション管理用）</li>
                </ul>
              </div>
            </div>
          </section>

          {/* セクション3: 情報の利用目的 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. 情報の利用目的
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>収集した情報は、以下の目的で利用します：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>レビュー管理ダッシュボードの提供</li>
                <li>AIによるレビュー分析と改善提案の生成</li>
                <li>AI返信案の自動生成</li>
                <li>週間レポートの自動生成と配信</li>
                <li>ユーザーアカウントの管理と認証</li>
                <li>サービス改善のための統計分析（個人を特定しない形式）</li>
                <li>お問い合わせ対応とカスタマーサポート</li>
              </ul>
            </div>
          </section>

          {/* セクション4: Google API Limited Use Policy（最重要） */}
          <section className="mb-8 border-2 border-blue-200 bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Google API Limited Use Policyへの準拠
            </h2>
            <div className="text-gray-700 space-y-4">
              <p className="font-bold text-lg">
                NegAlertによるGoogle APIから受け取った情報の使用および他のアプリへの転送は、Limited Use要件を含む<a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google API Services User Data Policy</a>に準拠します。
              </p>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm font-semibold mb-2">OpenAI APIへのデータ送信について</p>
                <p className="text-sm">
                  ※OpenAI APIへのデータ送信は、ユーザーが要求した機能（返信案生成、レビュー分析）を提供するために必要な範囲でのみ行われ、これはLimited Use Policyの「ユーザー向け機能の提供に必要な転送」の例外規定に該当します。OpenAIは受け取ったデータをモデル学習に使用しません。
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">スコープとその理由</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li><code className="bg-gray-200 px-1 rounded">email</code>: ユーザー識別とアカウント管理のため</li>
                  <li><code className="bg-gray-200 px-1 rounded">profile</code>: ユーザー情報表示のため</li>
                  <li><code className="bg-gray-200 px-1 rounded">https://www.googleapis.com/auth/business.manage</code>: レビュー閲覧・返信管理のため</li>
                </ul>
              </div>
            </div>
          </section>

          {/* セクション5: 第三者提供 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. 第三者へのデータ提供
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                本サービスは、以下の第三者サービスを利用しています。これらのサービスには、サービス提供に必要な範囲でのみデータを送信します：
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">5.1 OpenAI（AI分析・返信案生成）</h3>
                  <ul className="space-y-1 text-sm">
                    <li><strong>送信するデータ:</strong> レビューテキスト、評価、店舗名</li>
                    <li><strong>使用目的:</strong> AI分析レポート生成、返信案の自動生成</li>
                    <li><strong>データの取り扱い:</strong> モデル学習には不使用、一時的な処理のみ</li>
                    <li><strong>規約:</strong> <a href="https://openai.com/policies/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Terms of Use</a></li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">5.2 Supabase（データベース）</h3>
                  <ul className="space-y-1 text-sm">
                    <li><strong>保存するデータ:</strong> ユーザー情報、レビューデータ、OAuthトークン</li>
                    <li><strong>使用目的:</strong> データの永続化と管理</li>
                    <li><strong>セキュリティ:</strong> AES-256暗号化、行レベルセキュリティ（RLS）</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">5.3 Vercel（ホスティング）</h3>
                  <ul className="space-y-1 text-sm">
                    <li><strong>使用目的:</strong> アプリケーションのホスティングと配信</li>
                    <li><strong>データの取り扱い:</strong> アクセスログのみ収集</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm font-semibold">
                ※上記以外の第三者に対して、ユーザーデータを販売、共有、レンタルすることは一切ありません。
              </p>
            </div>
          </section>

          {/* セクション6: データ保管とセキュリティ */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. データ保管とセキュリティ
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                お客様の個人情報とレビューデータは、以下のセキュリティ対策のもと厳重に管理されています：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>データベース暗号化:</strong> AES-256方式による暗号化保存</li>
                <li><strong>アクセス制御:</strong> 行レベルセキュリティ（RLS）による厳格なアクセス制限</li>
                <li><strong>通信の暗号化:</strong> TLS/SSL通信による暗号化</li>
                <li><strong>アクセストークン管理:</strong> 暗号化保存、定期的な更新</li>
                <li><strong>定期的なセキュリティ監査:</strong> 脆弱性のチェックと対応</li>
              </ul>
            </div>
          </section>

          {/* セクション7: Cookieとトラッキング */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              7. Cookieとトラッキング
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                本サービスでは、以下の目的でCookieを使用します：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>ユーザー認証セッションの維持</li>
                <li>ユーザー設定の保存</li>
                <li>サービス利用状況の分析（匿名化）</li>
              </ul>
              <p className="text-sm">
                ブラウザの設定でCookieを無効にすることができますが、その場合サービスの一部機能が正常に動作しない可能性があります。
              </p>
            </div>
          </section>

          {/* セクション8: データの削除方法（地雷対策） */}
          <section className="mb-8 border-2 border-orange-200 bg-orange-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              8. データの削除方法
            </h2>
            <div className="text-gray-700 space-y-4">
              <p className="font-semibold">
                ユーザーは、いつでも自身のデータを削除する権利を有しています。
              </p>
              <div className="bg-white p-4 rounded border border-orange-200">
                <h3 className="font-semibold mb-2">削除方法</h3>
                <p className="text-sm mb-2">
                  現在、アカウント削除をご希望の場合は、お問い合わせ先（<a href="mailto:arimurahiroaki40@gmail.com" className="text-blue-600 hover:underline">arimurahiroaki40@gmail.com</a>）までご連絡ください。速やかに対応いたします。
                </p>
                <p className="text-xs text-gray-600">
                  ※将来的には、設定画面からワンクリックでアカウント削除が可能になる予定です。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">削除されるデータ</h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>ユーザーアカウント情報（メールアドレス、プロフィール）</li>
                  <li>Google OAuthトークン</li>
                  <li>保存されたレビューデータ</li>
                  <li>生成されたレポートと分析データ</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border border-orange-200">
                <p className="text-sm">
                  <strong>データ保持期間:</strong> アカウント削除リクエスト後、<strong>30日以内に完全に消去</strong>されます。この期間中は、誤削除の復旧対応が可能です。
                </p>
              </div>
            </div>
          </section>

          {/* セクション9: ユーザーの権利 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              9. ユーザーの権利
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                お客様は、個人情報保護法に基づき、以下の権利を有しています：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>アクセス権:</strong> 自身のデータを確認する権利</li>
                <li><strong>訂正権:</strong> データの誤りを訂正する権利</li>
                <li><strong>削除権:</strong> データの削除を要求する権利</li>
                <li><strong>利用停止権:</strong> データの利用を停止する権利</li>
                <li><strong>データポータビリティ権:</strong> データを他のサービスに移行する権利</li>
              </ul>
              <p className="text-sm">
                これらの権利を行使される場合は、お問い合わせ先までご連絡ください。
              </p>
            </div>
          </section>

          {/* セクション10: プライバシーポリシーの変更 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              10. プライバシーポリシーの変更
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                本プライバシーポリシーは、法令の変更やサービス内容の変更に応じて更新されることがあります。重要な変更がある場合は、サービス内での通知またはメールでお知らせします。
              </p>
              <p className="text-sm">
                最新版は常に本ページに掲載されますので、定期的にご確認ください。
              </p>
            </div>
          </section>

          {/* セクション11: お問い合わせ先 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              11. お問い合わせ先
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                本プライバシーポリシーに関するご質問、個人情報の開示・訂正・削除のご請求、その他お問い合わせは、以下までご連絡ください：
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-semibold mb-2">NegAlert 運営事務局</p>
                <ul className="space-y-1 text-sm">
                  <li>メールアドレス: <a href="mailto:arimurahiroaki40@gmail.com" className="text-blue-600 hover:underline">arimurahiroaki40@gmail.com</a></li>
                  <li>受付時間: 平日 10:00-18:00（土日祝日を除く）</li>
                  <li>回答期間: 原則として3営業日以内</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                トップページに戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
