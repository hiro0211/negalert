import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
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
  );
}
