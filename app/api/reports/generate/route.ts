/**
 * 週間レポート生成APIエンドポイント
 * 
 * POST /api/reports/generate - 直近7日間のレビューを分析してレポートを生成
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateWeeklyReport } from '@/lib/services/reports';
import { WeeklyReportResult } from '@/lib/services/ai';

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
    
    console.log('📊 週間レポート生成を開始:', { userId: user.id });
    
    // 2. サービス層でレポート生成
    let result;
    try {
      result = await generateWeeklyReport(user.id, supabase);
    } catch (serviceError) {
      console.error('レポート生成エラー:', serviceError);
      
      const errorMessage = serviceError instanceof Error 
        ? serviceError.message 
        : '週間レポート生成に失敗しました';
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        } as GenerateReportResponse,
        { status: 500 }
      );
    }
    
    console.log('✅ 週間レポート生成完了');
    
    // 3. 成功レスポンスを返す
    return NextResponse.json(
      {
        success: true,
        report: result.report,
        period: {
          startDate: result.period.startDate.toISOString(),
          endDate: result.period.endDate.toISOString(),
        },
        reviewCount: result.reviewCount,
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
