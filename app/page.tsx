import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  FileText,
  ArrowRight 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-gray-900">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">NegAlert</h1>
            </div>
            <Link href="/login" className="text-gray-900">
              <Button variant="default" size="lg">
                ログイン
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ヒーローセクション */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Googleレビューを
            <span className="text-blue-600">一元管理</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AIが自動分析し、最適な返信案を提案。
            <br />
            ネガティブレビューの早期発見で、ビジネスを守ります。
          </p>
          <Link href="/login" className="text-gray-900">
            <Button size="lg" className="text-lg px-8 py-6 text-gray-700">
              今すぐ始める（無料）
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Google My Businessアカウントで簡単ログイン
          </p>
        </div>
      </section>

      {/* 機能紹介セクション */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            主要機能
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 機能1: レビュー一元管理 */}
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  レビュー一元管理
                </h4>
                <p className="text-gray-600">
                  複数店舗のGoogleレビューを一つのダッシュボードで管理。未返信レビューを見逃しません。
                </p>
              </CardContent>
            </Card>

            {/* 機能2: AI分析 */}
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  AI分析・改善提案
                </h4>
                <p className="text-gray-600">
                  レビューをAIが自動分析し、顧客満足度向上のための具体的な改善提案を生成。
                </p>
              </CardContent>
            </Card>

            {/* 機能3: 自動返信案生成 */}
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  AI返信案生成
                </h4>
                <p className="text-gray-600">
                  各レビューに対して、AIが適切なトーンで返信案を自動生成。返信作業を大幅に効率化。
                </p>
              </CardContent>
            </Card>

            {/* 機能4: 週間レポート */}
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  週間レポート
                </h4>
                <p className="text-gray-600">
                  レビューの傾向、評価の推移、改善点を毎週自動でレポート化。経営判断に活用できます。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            3ステップで簡単スタート
          </h3>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Googleアカウントでログイン
                </h4>
                <p className="text-gray-600">
                  Google My Businessアカウントで認証するだけ。面倒な設定は不要です。
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  レビューを自動同期
                </h4>
                <p className="text-gray-600">
                  ログイン後、自動的にレビューデータを取得。すぐにダッシュボードで確認できます。
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  AI分析と返信案を活用
                </h4>
                <p className="text-gray-600">
                  AIが生成した分析レポートと返信案を確認し、効率的にレビュー対応。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            今すぐNegAlertを始めましょう
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            無料で全機能をお試しいただけます
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              無料で始める
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-6 w-6 text-blue-400" />
                <h4 className="text-xl font-bold text-white">NegAlert</h4>
              </div>
              <p className="text-sm">
                Googleレビューを一元管理し、AIで自動分析。ビジネスの評判管理を効率化します。
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4">法的情報</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    利用規約
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4">お問い合わせ</h5>
              <p className="text-sm">
                ご質問やサポートが必要な場合は、
                <br />
              <a href="mailto:arimurahiroaki40@gmail.com" className="text-blue-400 hover:text-blue-300">
                arimurahiroaki40@gmail.com
              </a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 NegAlert. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
