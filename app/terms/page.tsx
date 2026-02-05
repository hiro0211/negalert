import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: '利用規約 | NegAlert',
  description: 'NegAlertの利用規約',
};

export default function TermsPage() {
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
            利用規約
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            最終更新日: 2026年2月6日
          </p>

          {/* 第1条: 定義 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第1条（定義）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>本規約において、以下の用語は以下の意味を有します：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>「本サービス」</strong>: NegAlert for Google Reviewsが提供するGoogleレビュー管理・分析サービスの総称</li>
                <li><strong>「ユーザー」</strong>: 本サービスを利用する個人または法人</li>
                <li><strong>「運営者」</strong>: 本サービスを運営する事業者（NegAlert 運営事務局）</li>
                <li><strong>「レビューデータ」</strong>: Google Business Profileから取得されるレビュー情報</li>
                <li><strong>「AI機能」</strong>: OpenAI APIを利用したレビュー分析および返信案生成機能</li>
              </ul>
            </div>
          </section>

          {/* 第2条: 適用範囲 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第2条（適用範囲）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                1. 本規約は、本サービスの利用に関する運営者とユーザーとの間の権利義務関係を定めるものであり、ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されます。
              </p>
              <p>
                2. ユーザーは、本サービスを利用することにより本規約の全ての内容に同意したものとみなされます。
              </p>
              <p>
                3. 運営者が本サービス上で掲載する個別の規定やルールは、本規約の一部を構成します。
              </p>
            </div>
          </section>

          {/* 第3条: 利用登録 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第3条（利用登録）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                1. 本サービスの利用を希望する者は、Google OAuthによる認証を行うことで利用登録を申請できます。
              </p>
              <p>
                2. 運営者は、利用登録の申請者が以下のいずれかに該当する場合、利用登録を拒否することがあります：
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>本規約に違反したことがある者からの申請である場合</li>
                <li>登録情報に虚偽、誤記または記載漏れがあった場合</li>
                <li>反社会的勢力等である、または資金提供その他を通じて反社会的勢力等の維持、運営もしくは経営に協力もしくは関与する等、反社会的勢力等との何らかの交流もしくは関与を行っていると運営者が判断した場合</li>
                <li>その他、運営者が利用登録を適当でないと判断した場合</li>
              </ul>
            </div>
          </section>

          {/* 第4条: サービス内容 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第4条（サービス内容）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>本サービスは、以下の機能を提供します：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>レビュー一元管理:</strong> Google Business Profileのレビューを一括管理</li>
                <li><strong>AI分析:</strong> レビュー内容をAIが自動分析し、改善提案を生成</li>
                <li><strong>AI返信案生成:</strong> 各レビューに対する適切な返信案をAIが提案</li>
                <li><strong>週間レポート:</strong> レビューの統計情報と分析結果を定期的にレポート化</li>
                <li><strong>ダッシュボード:</strong> レビュー状況を可視化したダッシュボード</li>
              </ul>
              <p className="text-sm">
                運営者は、ユーザーへの事前通知なしに、サービス内容の変更、追加、廃止を行うことができます。
              </p>
            </div>
          </section>

          {/* 第5条: 禁止事項 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第5条（禁止事項）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>運営者、他のユーザー、またはその他第三者の権利または利益を侵害する行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>本サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
                <li>本サービスの不具合を意図的に利用する行為</li>
                <li>逆コンパイル、逆アセンブル、リバースエンジニアリング等の行為</li>
                <li>本サービスのAPIキー、アクセストークンを不正に取得または利用する行為</li>
                <li>AI機能を利用して、差別的、攻撃的、または虚偽の内容を生成・投稿する行為</li>
                <li>本サービスで生成されたコンテンツを、本サービス以外の目的で無断転載・商用利用する行為</li>
                <li>その他、運営者が不適切と判断する行為</li>
              </ul>
            </div>
          </section>

          {/* 第6条: 免責事項（AI関連強化） */}
          <section className="mb-8 border-2 border-red-200 bg-red-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第6条（免責事項）
            </h2>
            <div className="text-gray-700 space-y-4">
              <div className="bg-white p-4 rounded border border-red-200">
                <h3 className="font-semibold mb-2 text-red-800">AI機能に関する重要な免責事項</h3>
                <p className="font-bold mb-2">
                  本サービスはOpenAI社のAPIを利用して返信案を生成しますが、その内容の正確性、完全性、道徳的適切性を保証しません。生成された返信内容は、ユーザー自身の責任において確認・修正の上で投稿するものとし、AI生成物に起因する損害について運営者は一切の責任を負いません。
                </p>
                <p className="text-sm text-gray-700">
                  AIは時として誤った情報（ハルシネーション）、不適切な表現、または事実無根の内容を生成する可能性があります。必ずユーザー自身で内容を確認し、適切に編集した上でご利用ください。
                </p>
              </div>
              
              <div className="space-y-3">
                <p><strong>1. サービスの品質保証</strong></p>
                <p className="ml-4">
                  運営者は、本サービスの品質、正確性、完全性、有用性、安全性、最新性について、いかなる保証も行いません。
                </p>

                <p><strong>2. サービスの中断・停止</strong></p>
                <p className="ml-4">
                  運営者は、システムメンテナンス、障害、その他やむを得ない事由により、本サービスの全部または一部を予告なく中断または停止することがあります。これにより生じた損害について、運営者は一切の責任を負いません。
                </p>

                <p><strong>3. データの正確性</strong></p>
                <p className="ml-4">
                  本サービスは、Google APIから取得したデータをそのまま表示します。データの正確性、最新性については、Google側のシステムに依存するため、運営者は保証しません。
                </p>

                <p><strong>4. 第三者サービスの障害</strong></p>
                <p className="ml-4">
                  Google API、OpenAI API、Supabase等の第三者サービスの障害や仕様変更により本サービスが正常に動作しない場合でも、運営者は責任を負いません。
                </p>

                <p><strong>5. 損害賠償の制限</strong></p>
                <p className="ml-4">
                  本サービスの利用に起因してユーザーに生じた損害について、運営者の故意または重過失による場合を除き、運営者は一切の責任を負わないものとします。
                </p>

                <p><strong>6. ユーザー間のトラブル</strong></p>
                <p className="ml-4">
                  ユーザーと第三者（レビュー投稿者を含む）との間で生じたトラブルについて、運営者は一切の責任を負いません。
                </p>
              </div>
            </div>
          </section>

          {/* 第7条: 有料プランの利用条件 */}
          <section className="mb-8 border-2 border-green-200 bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第7条（有料プランの利用条件）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p className="font-semibold">
                現在、本サービスは無料デモ版として提供されています。
              </p>
              <div className="bg-white p-4 rounded border border-green-200">
                <h3 className="font-semibold mb-2">将来の有料化について</h3>
                <p className="text-sm mb-2">
                  運営者は、将来的に有料プランを導入する可能性があります。有料プランが導入される場合、以下が適用されます：
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>有料プランの詳細（料金、機能、支払い方法等）は別途定めます</li>
                  <li>有料プラン導入の少なくとも30日前に、既存ユーザーに通知します</li>
                  <li>既存ユーザーは、無料プランへの継続利用または有料プランへのアップグレードを選択できます</li>
                  <li>有料プランの利用には、別途有料プラン利用規約への同意が必要です</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="text-sm">
                  <strong>特定商取引法に基づく表記:</strong> 有料プラン導入時には、特定商取引法に基づく表記を別途定め、サイト上に明示します。
                </p>
              </div>
            </div>
          </section>

          {/* 第8条: サービスの変更・終了 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第8条（サービスの変更・終了）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                1. 運営者は、ユーザーへの事前通知なしに、本サービスの内容を変更、追加、または廃止することができます。
              </p>
              <p>
                2. 運営者は、運営上の都合により、本サービスの全部または一部を終了することができます。その場合、運営者は、合理的な事前通知期間をもってユーザーに通知します。
              </p>
              <p>
                3. 本条に基づく本サービスの変更、中断、または終了により、ユーザーまたは第三者に損害が生じた場合でも、運営者は一切の責任を負いません。
              </p>
            </div>
          </section>

          {/* 第9条: 利用規約の変更 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第9条（利用規約の変更）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                1. 運営者は、必要に応じて本規約を変更することができます。
              </p>
              <p>
                2. 本規約を変更する場合、変更後の規約の施行日および内容を、本サービス上での表示その他適切な方法により周知します。
              </p>
              <p>
                3. 変更後の利用規約は、施行日以降にユーザーが本サービスを利用した時点で、ユーザーが同意したものとみなされます。
              </p>
            </div>
          </section>

          {/* 第10条: アカウントの停止・削除 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第10条（アカウントの停止・削除）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                1. 運営者は、ユーザーが以下のいずれかに該当する場合、事前の通知なくアカウントを停止または削除することができます：
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>本規約のいずれかの条項に違反した場合</li>
                <li>登録情報に虚偽の事実があることが判明した場合</li>
                <li>1年以上本サービスの利用がない場合</li>
                <li>運営者からの連絡に対し、合理的な期間内に応答がない場合</li>
                <li>その他、運営者がサービスの利用を適当でないと判断した場合</li>
              </ul>
              <p>
                2. ユーザーは、いつでもアカウントの削除を申請することができます。削除方法については、プライバシーポリシーをご確認ください。
              </p>
            </div>
          </section>

          {/* 第11条: 知的財産権 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第11条（知的財産権）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                1. 本サービスに関する知的財産権は、すべて運営者または運営者にライセンスを許諾している者に帰属します。
              </p>
              <p>
                2. ユーザーが本サービスを利用することにより、運営者またはライセンサーの知的財産権を使用する権利を取得するものではありません。
              </p>
              <p>
                3. ユーザーがGoogle Business Profileから取得したレビューデータの著作権は、元のレビュー投稿者に帰属します。
              </p>
            </div>
          </section>

          {/* 第12条: 準拠法と管轄裁判所 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第12条（準拠法と管轄裁判所）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                1. 本規約の解釈にあたっては、日本法を準拠法とします。
              </p>
              <p>
                2. 本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄裁判所とします。
              </p>
            </div>
          </section>

          {/* 第13条: お問い合わせ先 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              第13条（お問い合わせ先）
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                本規約に関するお問い合わせは、以下までご連絡ください：
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-semibold mb-2">NegAlert 運営事務局</p>
                <ul className="space-y-1 text-sm">
                  <li>メールアドレス: <a href="mailto:arimurahiroaki40@gmail.com" className="text-blue-600 hover:underline">arimurahiroaki40@gmail.com</a></li>
                  <li>受付時間: 平日 10:00-18:00（土日祝日を除く）</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">
              以上
            </p>
            <p className="text-xs text-gray-500 text-center">
              2026年2月6日 制定・施行
            </p>
          </div>

          <div className="mt-8 text-center">
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
