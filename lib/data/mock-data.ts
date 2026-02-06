/**
 * 完全なモックデータセット
 * Google OAuth審査用デモ動画作成のための静的データ
 * 
 * 注意: このファイルは審査用の一時的なモックデータです
 * 本番運用時は実際のSupabaseデータを使用してください
 */

import { Review } from '../types';
import { Workspace, GoogleLocation } from '../api/types';

// =====================================
// モックワークスペースデータ
// =====================================

/**
 * モック店舗情報
 */
export const mockLocations: GoogleLocation[] = [
  {
    name: 'デモレストラン 東京本店',
    locationId: 'mock-location-001',
    address: '東京都渋谷区代々木1-1-1',
    placeId: 'ChIJDemo123456789',
  },
  {
    name: 'デモカフェ 新宿店',
    locationId: 'mock-location-002',
    address: '東京都新宿区西新宿2-2-2',
    placeId: 'ChIJDemo987654321',
  },
];

/**
 * モックワークスペース
 */
export const mockWorkspaces: Workspace[] = [
  {
    id: 'workspace-001',
    user_id: 'mock-user-001',
    google_location_id: 'mock-location-001',
    name: 'デモレストラン 東京本店',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-06-01T00:00:00.000Z',
  },
  {
    id: 'workspace-002',
    user_id: 'mock-user-001',
    google_location_id: 'mock-location-002',
    name: 'デモカフェ 新宿店',
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-06-01T00:00:00.000Z',
  },
];

// =====================================
// モックレビューデータ
// =====================================

/**
 * デモ用レビューデータセット（充実したバリエーション）
 * - 高リスク: ★1-2の未返信レビュー
 * - 中リスク: ★3の未返信レビュー
 * - 低リスク: ★4-5のレビューまたは返信済み
 */
export const mockReviews: Review[] = [
  // ========== 高リスクレビュー（未返信・低評価） ==========
  {
    id: 'review-001',
    date: new Date('2024-06-10'),
    source: 'google',
    rating: 1,
    authorName: '田中太郎',
    text: '予約していたのに30分以上待たされました。スタッフの説明もなく、非常に不愉快な思いをしました。料理も冷めていて最悪でした。二度と行きません。',
    status: 'unreplied',
    risk: 'high',
    aiSummary: '予約客に長時間待機させ、説明不足と料理品質に問題',
    aiCategories: ['接客態度', '待ち時間', '料理品質'],
    aiRiskReason: '予約客への対応不備で信頼損失',
    photos: [],
  },
  {
    id: 'review-002',
    date: new Date('2024-06-09'),
    source: 'google',
    rating: 1,
    authorName: '山田花子',
    text: '店員の態度が最悪でした。質問しても無視され、オーダーミスがあっても謝罪の一言もありませんでした。こんな店は初めてです。',
    status: 'unreplied',
    risk: 'high',
    aiSummary: '店員の接客態度とオーダーミス対応に重大な問題',
    aiCategories: ['接客態度', 'オーダーミス', '謝罪なし'],
    aiRiskReason: '基本的な接客マナーの欠如',
    photos: [],
  },
  {
    id: 'review-003',
    date: new Date('2024-06-08'),
    source: 'google',
    rating: 2,
    authorName: '佐藤健一',
    text: 'トイレが汚れていて使えたものではありませんでした。衛生面に問題があると思います。食事も楽しめませんでした。',
    status: 'unreplied',
    risk: 'high',
    aiSummary: '衛生管理に深刻な問題、トイレの清潔さ不十分',
    aiCategories: ['清潔感', '衛生管理', '設備'],
    aiRiskReason: '衛生面の問題は飲食店として致命的',
    photos: [],
  },
  {
    id: 'review-004',
    date: new Date('2024-06-07'),
    source: 'google',
    rating: 2,
    authorName: '鈴木美咲',
    text: 'メニューの写真と実物が全く違います。明らかに誇大広告です。値段も高すぎてコスパ最悪。',
    status: 'unreplied',
    risk: 'high',
    aiSummary: 'メニュー表記と実物の乖離、価格設定への不満',
    aiCategories: ['料理品質', '価格', '誇大広告'],
    aiRiskReason: '誇大広告は法的リスクあり',
    photos: [],
  },

  // ========== 中リスクレビュー（未返信・中評価） ==========
  {
    id: 'review-005',
    date: new Date('2024-06-06'),
    source: 'google',
    rating: 3,
    authorName: '高橋誠',
    text: '普通でした。料理の味は悪くないですが、提供が遅く、店内も少し騒がしかったです。可もなく不可もなくといった感じです。',
    status: 'unreplied',
    risk: 'medium',
    aiSummary: '料理は普通レベル、提供速度と店内環境に改善余地',
    aiCategories: ['提供時間', '店内環境', '料理品質'],
    aiRiskReason: '改善点が明確で対応次第で評価向上可能',
    photos: [],
  },
  {
    id: 'review-006',
    date: new Date('2024-06-05'),
    source: 'google',
    rating: 3,
    authorName: '渡辺由美',
    text: '期待していたほどではありませんでした。味は悪くないのですが、量が少なく感じました。雰囲気は良かったです。',
    status: 'unreplied',
    risk: 'medium',
    aiSummary: '期待値とのギャップ、提供量への不満あり',
    aiCategories: ['料理品質', '提供量', '雰囲気'],
    aiRiskReason: '期待値管理と商品設計の見直しが必要',
    photos: [],
  },

  // ========== 返信済み低評価レビュー ==========
  {
    id: 'review-007',
    date: new Date('2024-06-04'),
    source: 'google',
    rating: 2,
    authorName: '伊藤和也',
    text: '注文してから料理が来るまで40分以上かかりました。忙しいのは分かりますが、一言説明が欲しかったです。',
    status: 'replied',
    risk: 'medium',
    aiSummary: '提供時間の長さとコミュニケーション不足',
    aiCategories: ['提供時間', '接客態度', 'コミュニケーション'],
    aiRiskReason: '待ち時間への事前説明で改善可能',
    reply: 'ご来店いただきありがとうございました。お料理の提供にお時間をいただき、大変申し訳ございませんでした。混雑時の対応フローを見直し、お待ちいただく際には必ず事前にご説明するよう改善いたしました。またのご来店を心よりお待ちしております。',
    replyCreatedAt: new Date('2024-06-05'),
    photos: [],
  },
  {
    id: 'review-008',
    date: new Date('2024-06-03'),
    source: 'google',
    rating: 2,
    authorName: '小林真理子',
    text: '駐車場が狭くて停めにくかったです。もう少し広いと良いと思います。',
    status: 'auto_replied',
    risk: 'low',
    aiSummary: '駐車場の広さへの不満',
    aiCategories: ['設備', '駐車場', 'アクセス'],
    aiRiskReason: '設備面の課題は長期的改善項目',
    reply: 'ご指摘ありがとうございます。駐車場につきましては構造上の制約がございますが、誘導スタッフの配置など、お客様がより停めやすい環境づくりに努めてまいります。ご不便をおかけいたしますが、引き続きご愛顧のほどよろしくお願いいたします。',
    replyCreatedAt: new Date('2024-06-04'),
    photos: [],
  },

  // ========== 高評価レビュー（返信済み） ==========
  {
    id: 'review-009',
    date: new Date('2024-06-02'),
    source: 'google',
    rating: 5,
    authorName: '中村隆',
    text: '素晴らしいお店でした！料理も美味しく、スタッフの方々の対応も丁寧で心地よく過ごせました。特にシェフのおすすめ料理は絶品でした。また必ず来ます！',
    status: 'replied',
    risk: 'low',
    aiSummary: '料理品質と接客サービスに高評価',
    aiCategories: ['料理品質', '接客態度', 'おすすめ料理'],
    aiRiskReason: 'ポジティブなレビュー',
    reply: 'この度は当店をご利用いただき、誠にありがとうございます。お褒めの言葉をいただき、スタッフ一同大変励みになります。シェフのおすすめ料理をお気に召していただけて嬉しく思います。またのご来店を心よりお待ちしております。',
    replyCreatedAt: new Date('2024-06-03'),
    photos: [],
  },
  {
    id: 'review-010',
    date: new Date('2024-06-01'),
    source: 'google',
    rating: 5,
    authorName: '加藤直樹',
    text: '記念日で利用しましたが、期待以上でした。サプライズのデザートプレートも用意していただき、最高の思い出になりました。ありがとうございました！',
    status: 'replied',
    risk: 'low',
    aiSummary: '記念日利用で特別な体験を提供',
    aiCategories: ['特別な日', 'サービス', 'デザート'],
    aiRiskReason: '特別な体験を評価',
    reply: '大切な記念日に当店をお選びいただき、誠にありがとうございます。素敵な思い出作りのお手伝いができましたこと、スタッフ一同大変嬉しく思っております。今後も特別な日にふさわしいサービスをご提供できるよう努めてまいります。',
    replyCreatedAt: new Date('2024-06-02'),
    photos: [],
  },
  {
    id: 'review-011',
    date: new Date('2024-05-31'),
    source: 'google',
    rating: 4,
    authorName: '森田香織',
    text: '雰囲気が良く、デートで利用しました。料理も美味しく、ワインの品揃えも良かったです。また来たいと思います。',
    status: 'replied',
    risk: 'low',
    aiSummary: '雰囲気と料理品質、ワイン選択に満足',
    aiCategories: ['雰囲気', '料理品質', 'ワイン'],
    aiRiskReason: 'デート利用に適した環境',
    reply: 'ご来店いただきありがとうございます。デートでのご利用、喜んでいただけて嬉しく思います。当店のワインセレクションもお楽しみいただけたようで何よりです。次回のご来店もお待ちしております。',
    replyCreatedAt: new Date('2024-06-01'),
    photos: [],
  },
  {
    id: 'review-012',
    date: new Date('2024-05-30'),
    source: 'google',
    rating: 4,
    authorName: '石井大輔',
    text: 'ランチで訪問しました。コストパフォーマンスが良く、味も満足です。ただ、お昼時は混雑するので予約した方が良さそうです。',
    status: 'replied',
    risk: 'low',
    aiSummary: 'ランチのコスパと味に満足、混雑時は予約推奨',
    aiCategories: ['コスパ', 'ランチ', '混雑状況'],
    aiRiskReason: '混雑は人気の証、予約促進で対応',
    reply: 'ランチタイムのご利用ありがとうございました。コストパフォーマンスにご満足いただけて嬉しいです。ご指摘の通り、お昼時は混雑することが多いため、事前のご予約をお勧めしております。次回もぜひお待ちしております。',
    replyCreatedAt: new Date('2024-05-31'),
    photos: [],
  },

  // ========== 高評価レビュー（未返信） ==========
  {
    id: 'review-013',
    date: new Date('2024-05-29'),
    source: 'google',
    rating: 5,
    authorName: '藤田結衣',
    text: '友人と訪問しましたが、全員大満足でした。料理の盛り付けも美しく、味も最高でした。スタッフの方も親切で、とても良い時間を過ごせました。',
    status: 'unreplied',
    risk: 'low',
    aiSummary: '友人との利用で料理とサービスに高評価',
    aiCategories: ['料理品質', '盛り付け', '接客態度'],
    aiRiskReason: '全体的に高評価',
    photos: [],
  },
  {
    id: 'review-014',
    date: new Date('2024-05-28'),
    source: 'google',
    rating: 4,
    authorName: '岡田祐介',
    text: '初めて訪問しましたが、接客が丁寧で好印象でした。料理の説明も分かりやすく、安心して食事を楽しめました。',
    status: 'unreplied',
    risk: 'low',
    aiSummary: '初訪問で接客と料理説明に好印象',
    aiCategories: ['接客態度', '料理説明', '初訪問'],
    aiRiskReason: 'リピーター獲得のチャンス',
    photos: [],
  },
  {
    id: 'review-015',
    date: new Date('2024-05-27'),
    source: 'google',
    rating: 5,
    authorName: '松本さくら',
    text: '家族で利用しました。子供向けのメニューもあり、スタッフの方が子供にも優しく接してくれて助かりました。料理も美味しく、家族全員満足です。',
    status: 'unreplied',
    risk: 'low',
    aiSummary: '家族利用で子供への配慮と料理に満足',
    aiCategories: ['ファミリー', '子供向けメニュー', '接客態度'],
    aiRiskReason: 'ファミリー層への訴求力',
    photos: [],
  },

  // ========== 追加のバリエーション（より多様な評価） ==========
  {
    id: 'review-016',
    date: new Date('2024-05-26'),
    source: 'google',
    rating: 3,
    authorName: '吉田雄一',
    text: '料理は美味しかったですが、店内が少し暗くてメニューが読みにくかったです。照明をもう少し明るくしてもらえると嬉しいです。',
    status: 'unreplied',
    risk: 'medium',
    aiSummary: '料理は好評だが店内照明に改善要望',
    aiCategories: ['料理品質', '照明', '店内環境'],
    aiRiskReason: '環境面の改善で評価向上可能',
    photos: [],
  },
  {
    id: 'review-017',
    date: new Date('2024-05-25'),
    source: 'google',
    rating: 4,
    authorName: '木村美穂',
    text: '女子会で利用しました。お料理が美味しくて、特にデザートが絶品でした！写真映えもするので、また来たいです。',
    status: 'replied',
    risk: 'low',
    aiSummary: '女子会利用でデザートと写真映えに高評価',
    aiCategories: ['デザート', '女子会', '写真映え'],
    aiRiskReason: 'SNS映えで集客効果期待',
    reply: '女子会でのご利用ありがとうございました！デザートをお気に召していただけて嬉しいです。当店のお料理はSNSでもたくさんシェアしていただいており、スタッフ一同励みになっています。次回もぜひお待ちしております。',
    replyCreatedAt: new Date('2024-05-26'),
    photos: [],
  },
  {
    id: 'review-018',
    date: new Date('2024-05-24'),
    source: 'google',
    rating: 5,
    authorName: '西村拓也',
    text: '接待で利用しました。落ち着いた雰囲気で、料理も素晴らしく、大変助かりました。個室もあってプライバシーが守られるのが良いですね。',
    status: 'replied',
    risk: 'low',
    aiSummary: '接待利用で雰囲気と料理、個室に満足',
    aiCategories: ['接待', '個室', '料理品質'],
    aiRiskReason: 'ビジネス利用での高評価',
    reply: '接待でのご利用、誠にありがとうございます。ご満足いただけたようで大変嬉しく思います。当店では接待やビジネスシーンにもご利用いただける個室をご用意しております。今後ともご愛顧のほどよろしくお願いいたします。',
    replyCreatedAt: new Date('2024-05-25'),
    photos: [],
  },
  {
    id: 'review-019',
    date: new Date('2024-05-23'),
    source: 'google',
    rating: 2,
    authorName: '大野健太',
    text: 'ネット予約したのに席が用意されておらず、結局30分待ちました。予約システムに問題があるのではないでしょうか。',
    status: 'unreplied',
    risk: 'high',
    aiSummary: 'ネット予約システムの不備で待ち時間発生',
    aiCategories: ['予約システム', '待ち時間', '運営管理'],
    aiRiskReason: '予約システムの信頼性に問題',
    photos: [],
  },
  {
    id: 'review-020',
    date: new Date('2024-05-22'),
    source: 'google',
    rating: 4,
    authorName: '村上千夏',
    text: '久しぶりに訪問しましたが、相変わらず美味しかったです。季節のメニューも楽しみにしています。',
    status: 'replied',
    risk: 'low',
    aiSummary: 'リピート客が継続的に高評価',
    aiCategories: ['リピート', '季節メニュー', '料理品質'],
    aiRiskReason: '常連客の満足度維持',
    reply: 'いつもご来店いただきありがとうございます。季節ごとのメニュー変更もお楽しみいただけているようで嬉しいです。今後も旬の食材を活かした料理をご提供してまいりますので、引き続きよろしくお願いいたします。',
    replyCreatedAt: new Date('2024-05-23'),
    photos: [],
  },
];

// =====================================
// ヘルパー関数
// =====================================

/**
 * IDでレビューを取得
 */
export function getMockReviewById(id: string): Review | undefined {
  return mockReviews.find(review => review.id === id);
}

/**
 * 未返信のレビューを取得
 */
export function getMockUnrepliedReviews(): Review[] {
  return mockReviews.filter(review => review.status === 'unreplied');
}

/**
 * ネガティブレビュー（★3以下）を取得
 */
export function getMockNegativeReviews(): Review[] {
  return mockReviews.filter(review => review.rating <= 3);
}

/**
 * 高リスクレビューを取得
 */
export function getMockHighRiskReviews(): Review[] {
  return mockReviews.filter(review => review.risk === 'high');
}

/**
 * ワークスペースIDでレビューをフィルタ
 */
export function getMockReviewsByWorkspace(workspaceId: string): Review[] {
  // デモ用: 全レビューを返す
  return mockReviews;
}

/**
 * ユーザーIDでワークスペースを取得
 */
export function getMockWorkspacesByUser(userId: string): Workspace[] {
  return mockWorkspaces.filter(ws => ws.user_id === userId);
}

/**
 * IDでワークスペースを取得
 */
export function getMockWorkspaceById(id: string): Workspace | undefined {
  return mockWorkspaces.find(ws => ws.id === id);
}
