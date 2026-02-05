/**
 * 週間レポート生成APIエンドポイント
 * 
 * POST /api/reports/generate - 直近7日間のレビューを分析してレポートを生成
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReviewReport, WeeklyReportResult } from '@/lib/services/ai';

/**
 * モックデータモードかどうかを判定
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * 週間レポート生成応答型
 */
export interface GenerateReportResponse {
  success: boolean;
  report?: WeeklyReportResult;
  period?: {
    startDate: string;
    endDate: string;
  };
  reviewCount?: number;
  error?: string;
}

/**
 * 週間レポートを生成
 * POST /api/reports/generate
 */
export async function POST() {
  try {
    // 1. 認証チェック
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('認証エラー:', authError);
      return NextResponse.json(
        {
          success: false,
          error: '認証が必要です',
        } as GenerateReportResponse,
        { status: 401 }
      );
    }
    
    console.log('📊 週間レポート生成を開始:', { userId: user.id, mockMode: USE_MOCK_DATA });
    
    // 2. 期間計算（現在時刻から7日前）
    let endDate = new Date();
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    console.log('📅 集計期間:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    
    // 3. DBからレビューを取得
    let query = supabase
      .from('reviews')
      .select('id, comment, rating, review_created_at, author_name');
    
    // モックモード時は期間フィルタリングせず、最新50件を取得
    if (!USE_MOCK_DATA) {
      query = query.gte('review_created_at', startDate.toISOString());
    }
    
    const { data: reviews, error } = await query
      .order('review_created_at', { ascending: false })
      .limit(50); // トークン制限対策
    
    if (error) {
      console.error('レビュー取得エラー:', error);
      return NextResponse.json(
        {
          success: false,
          error: `レビューの取得に失敗しました: ${error.message}`,
        } as GenerateReportResponse,
        { status: 500 }
      );
    }
    
    const reviewList = reviews || [];
    console.log('📝 取得したレビュー数:', reviewList.length);
    
    // モックモード時は実際のレビュー日付範囲を集計期間とする
    if (USE_MOCK_DATA && reviewList.length > 0) {
      const dates = reviewList.map(r => new Date(r.review_created_at));
      startDate = new Date(Math.min(...dates.map(d => d.getTime())));
      endDate = new Date(Math.max(...dates.map(d => d.getTime())));
      console.log('🎭 [MOCK MODE] 実際のレビュー期間に調整:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    }
    
    // 4. 分岐処理: レビューが0件の場合
    if (reviewList.length === 0) {
      console.log('ℹ️ レビューが0件のため、空のレポートを返します');
      return NextResponse.json(
        {
          success: true,
          report: {
            overallSentiment: 'neutral' as const,
            summary: '直近1週間のレビューはありませんでした。',
            goodPoints: [],
            badPoints: [],
            actionPlan: '新しいレビューが投稿されるのを待ちましょう。',
          },
          period: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          reviewCount: 0,
        } as GenerateReportResponse,
        { status: 200 }
      );
    }
    
    // 5. AI分析を実行
    let reportResult: WeeklyReportResult;
    try {
      // レビューデータを整形してAI関数に渡す
      const reviewsForAI = reviewList.map(r => ({
        text: r.comment || '',
        rating: r.rating,
        date: new Date(r.review_created_at),
      }));
      
      reportResult = await generateReviewReport(reviewsForAI);
    } catch (aiError) {
      console.error('AI分析エラー:', aiError);
      
      const errorMessage = aiError instanceof Error ? aiError.message : '週間レポート生成に失敗しました';
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        } as GenerateReportResponse,
        { status: 500 }
      );
    }
    
    console.log('✅ 週間レポート生成完了');
    
    // 6. 成功レスポンスを返す
    return NextResponse.json(
      {
        success: true,
        report: reportResult,
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        reviewCount: reviewList.length,
      } as GenerateReportResponse,
      { status: 200 }
    );
    
  } catch (error) {
    console.error('予期しないエラー:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '予期しないエラーが発生しました',
      } as GenerateReportResponse,
      { status: 500 }
    );
  }
}
