/**
 * OpenAI APIを使用したレビュー分析サービス
 */

import OpenAI from 'openai';

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
 * OpenAI APIを使用してレビューを分析
 * 
 * @param reviewText - レビュー本文
 * @param rating - 評価（1-5）
 * @returns AI分析結果
 */
export async function analyzeReviewWithAI(
  reviewText: string,
  rating: number
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
  const systemPrompt = `あなたは日本の実店舗の経験豊富なベテラン店長です。
顧客レビューを分析し、以下のJSON形式で結果を返してください。

{
  "summary": "レビューの要約（50文字以内）",
  "risk": "high | medium | low （リスクレベル）",
  "categories": ["接客", "味", "価格", "雰囲気", "提供スピード"] から複数選択可能,
  "riskReason": "リスク判定の理由（30文字以内）",
  "replyDraft": "丁寧な返信案"
}

返信案のガイドライン:
- ★1-2（低評価）: 謝罪重視、具体的な改善提案を含める
- ★3（中評価）: バランス型、感謝と改善意欲を示す
- ★4-5（高評価）: 感謝重視、今後への期待を示す

リスクレベルの判定基準:
- high: ★1-2かつ強い不満表現、再訪意向の喪失
- medium: ★3または具体的な改善要望
- low: ★4-5または具体的な問題なし`;

  // ユーザープロンプトの構築
  const userPrompt = `評価: ★${rating}
レビュー内容:
${reviewText}`;

  try {
    console.log('🤖 OpenAI API呼び出し開始:', { rating, textLength: reviewText.length });
    
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
    
    console.log('✅ OpenAI API呼び出し成功');
    
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
      console.error('JSON パースエラー:', parseError);
      throw new Error('AI分析結果のパースに失敗しました');
    }
    
    console.log('📊 AI分析結果:', {
      summary: result.summary,
      risk: result.risk,
      categoriesCount: result.categories.length,
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ OpenAI API呼び出しエラー:', error);
    
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
