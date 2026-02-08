/**
 * OpenAI APIを使用したレビュー分析サービス
 */

import OpenAI from 'openai';
import { ReplyStyle } from '@/lib/types';

/**
 * AI分析結果の型定義
 */
export interface AIAnalysisResult {
  summary: string;           // 50文字以内の要約
  risk: 'high' | 'medium' | 'low';
  categories: string[];      // カテゴリ配列
  riskReason: string;        // 30文字以内のリスク理由
  replyDraft: string;        // 返信案
}

/**
 * 週間レポート結果の型定義
 */
export interface WeeklyReportResult {
  overallSentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  goodPoints: string[];
  badPoints: string[];
  actionPlan: string;
}

/**
 * OpenAI APIを使用してレビューを分析
 * 
 * @param reviewText - レビュー本文
 * @param rating - 評価（1-5）
 * @param customStyle - カスタム返信スタイル（オプション）
 * @returns AI分析結果
 */
export async function analyzeReviewWithAI(
  reviewText: string,
  rating: number,
  customStyle?: ReplyStyle | null
): Promise<AIAnalysisResult> {
  // 環境変数チェック
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEYが設定されていません');
  }
  
  // OpenAIクライアントの初期化
  const openai = new OpenAI({
    apiKey: apiKey,
  });
  
  // システムプロンプトの構築
  let systemPrompt = `あなたは日本の実店舗の経験豊富なベテラン店長です。
顧客レビューを分析し、以下のJSON形式で結果を返してください。

{
  "summary": "レビューの要約（50文字以内）",
  "risk": "high | medium | low （リスクレベル）",
  "categories": ["接客", "味", "価格", "雰囲気", "提供スピード"] から複数選択可能,
  "riskReason": "リスク判定の理由（30文字以内）",
  "replyDraft": "丁寧な返信案"
}

リスクレベルの判定基準:
- high: ★1-2かつ強い不満表現、再訪意向の喪失
- medium: ★3または具体的な改善要望
- low: ★4-5または具体的な問題なし`;

  // カスタムスタイルが指定されている場合、プロンプトを拡張
  if (customStyle) {
    const examplesText = customStyle.exampleReplies
      .map((example, i) => `【例${i + 1}】\n${example}`)
      .join('\n\n');
    
    const requiredElementsText = Object.entries(customStyle.requiredElements)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');

    systemPrompt += `

返信案のガイドライン - 以下のカスタムスタイルに従ってください:

【カスタムスタイル名】
${customStyle.name}

【参考返信文】
以下の返信文を参考に、同じトーン・構造・表現を使って返信案を生成してください。

${examplesText}

【必ず含める要素】
${requiredElementsText}

上記の参考返信文のスタイル、表現、構造を分析し、それを模倣して新しい返信案を生成してください。`;
  } else {
    // 標準プロンプト
    systemPrompt += `

返信案のガイドライン:
- ★1-2（低評価）: 謝罪重視、具体的な改善提案を含める
- ★3（中評価）: バランス型、感謝と改善意欲を示す
- ★4-5（高評価）: 感謝重視、今後への期待を示す`;
  }

  // ユーザープロンプトの構築
  const userPrompt = `評価: ★${rating}
レビュー内容:
${reviewText}`;

  try {
    // OpenAI APIを呼び出し
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    // レスポンスの取得
    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('OpenAI APIからのレスポンスが空です');
    }
    
    // JSONをパース
    let result: AIAnalysisResult;
    try {
      const parsed = JSON.parse(responseContent);
      
      // 型の検証とデフォルト値の設定
      result = {
        summary: String(parsed.summary || '分析結果を取得できませんでした').substring(0, 50),
        risk: ['high', 'medium', 'low'].includes(parsed.risk) ? parsed.risk : 'medium',
        categories: Array.isArray(parsed.categories) ? parsed.categories : [],
        riskReason: String(parsed.riskReason || '').substring(0, 30),
        replyDraft: String(parsed.replyDraft || 'ご利用ありがとうございました。'),
      };
    } catch (parseError) {
      throw new Error('AI分析結果のパースに失敗しました');
    }
    
    return result;
    
  } catch (error) {
    
    // エラーの種類に応じた処理
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        throw new Error('OpenAI APIキーが無効です');
      } else if (error.status === 429) {
        throw new Error('OpenAI APIのレート制限に達しました。しばらく待ってから再度お試しください');
      } else if (error.status === 500) {
        throw new Error('OpenAI APIでエラーが発生しました');
      }
    }
    
    // その他のエラー
    throw new Error(
      error instanceof Error 
        ? `AI分析に失敗しました: ${error.message}` 
        : 'AI分析に失敗しました'
    );
  }
}

/**
 * 複数のレビューをまとめて分析し、週間レポートを生成
 * 
 * @param reviews - レビューリスト（直近7日間分を想定）
 * @returns 週間レポート結果
 */
export async function generateReviewReport(
  reviews: Array<{ text: string; rating: number; date: Date }>
): Promise<WeeklyReportResult> {
  // 環境変数チェック
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEYが設定されていません');
  }
  
  // OpenAIクライアントの初期化
  const openai = new OpenAI({
    apiKey: apiKey,
  });
  
  // システムプロンプトの構築
  const systemPrompt = `あなたは店舗コンサルタントです。入力されたレビューリスト（直近1週間分）を読み、店舗オーナー向けの簡潔なレポートを作成してください。

以下のJSON形式で結果を返してください：

{
  "overallSentiment": "positive | neutral | negative （全体的な評価傾向）",
  "summary": "1週間の総評（100文字程度）",
  "goodPoints": ["良かった点1", "良かった点2", ...],
  "badPoints": ["改善点1", "改善点2", ...],
  "actionPlan": "来週に向けた具体的なアクション（1つ）"
}

ガイドライン:
- overallSentiment: 平均評価が4以上ならpositive、3以上ならneutral、それ以下ならnegative
- summary: 全体的な傾向を簡潔にまとめる
- goodPoints: 顧客から評価された点を2-3個抽出（配列）
- badPoints: 改善が必要な点を2-3個抽出（配列）。なければ空配列
- actionPlan: 具体的で実行可能なアクションを1つ提案`;

  // レビューリストを整形
  const reviewsText = reviews.map((r, idx) => 
    `${idx + 1}. [★${r.rating}] ${r.text}`
  ).join('\n\n');
  
  const userPrompt = `以下は直近1週間のレビューです（全${reviews.length}件）：

${reviewsText}`;

  try {
    // OpenAI APIを呼び出し
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    });
    
    // レスポンスの取得
    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('OpenAI APIからのレスポンスが空です');
    }
    
    // JSONをパース
    let result: WeeklyReportResult;
    try {
      const parsed = JSON.parse(responseContent);
      
      // 型の検証とデフォルト値の設定
      result = {
        overallSentiment: ['positive', 'neutral', 'negative'].includes(parsed.overallSentiment) 
          ? parsed.overallSentiment 
          : 'neutral',
        summary: String(parsed.summary || 'レポートを生成できませんでした'),
        goodPoints: Array.isArray(parsed.goodPoints) ? parsed.goodPoints : [],
        badPoints: Array.isArray(parsed.badPoints) ? parsed.badPoints : [],
        actionPlan: String(parsed.actionPlan || '引き続き顧客満足度の向上に努めましょう'),
      };
    } catch (parseError) {
      throw new Error('週間レポートのパースに失敗しました');
    }
    
    return result;
    
  } catch (error) {
    
    // エラーの種類に応じた処理
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        throw new Error('OpenAI APIキーが無効です');
      } else if (error.status === 429) {
        throw new Error('OpenAI APIのレート制限に達しました。しばらく待ってから再度お試しください');
      } else if (error.status === 500) {
        throw new Error('OpenAI APIでエラーが発生しました');
      }
    }
    
    // その他のエラー
    throw new Error(
      error instanceof Error 
        ? `週間レポート生成に失敗しました: ${error.message}` 
        : '週間レポート生成に失敗しました'
    );
  }
}
