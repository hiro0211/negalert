/**
 * レビューのAI分析を実行するAPIエンドポイント
 * 
 * POST /api/reviews/[id]/analyze - レビューをAI分析して結果をDBに保存
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getReviewFromDb, updateReviewAnalysisInDb } from '@/lib/api/reviews-db';
import { analyzeReviewWithAI } from '@/lib/services/ai';

/**
 * レビューのAI分析応答型
 */
export interface AnalyzeReviewResponse {
  success: boolean;
  review?: any;
  analysis?: {
    summary: string;
    risk: 'high' | 'medium' | 'low';
    categories: string[];
    riskReason: string;
    replyDraft: string;
  };
  error?: string;
}

/**
 * レビューをAI分析
 * POST /api/reviews/[id]/analyze
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 0. paramsを解決
    const { id } = await params;
    
    // リクエストボディから replyStyleId を取得
    let replyStyleId: string | null = null;
    try {
      const body = await request.json();
      replyStyleId = body.replyStyleId || null;
    } catch {
      // ボディがない場合はnullのまま
    }
    
    // 1. 認証チェック
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('認証エラー:', authError);
      return NextResponse.json(
        {
          success: false,
          error: '認証が必要です',
        } as AnalyzeReviewResponse,
        { status: 401 }
      );
    }
    
    console.log('🤖 AI分析を開始:', { reviewId: id, userId: user.id, replyStyleId });
    
    // 2. レビュー情報をDBから取得
    let review;
    try {
      review = await getReviewFromDb(id, supabase);
    } catch (reviewError) {
      console.error('レビュー取得エラー:', reviewError);
      return NextResponse.json(
        {
          success: false,
          error: reviewError instanceof Error ? reviewError.message : 'レビューの取得に失敗しました',
        } as AnalyzeReviewResponse,
        { status: 404 }
      );
    }
    
    // 3. カスタムスタイルを取得（指定されている場合）
    let customStyle = null;
    if (replyStyleId) {
      const { data: style, error: styleError } = await supabase
        .from('reply_styles')
        .select('*')
        .eq('id', replyStyleId)
        .single();
      
      if (!styleError && style) {
        customStyle = {
          id: style.id,
          workspaceId: style.workspace_id,
          name: style.name,
          description: style.description,
          exampleReplies: style.example_replies,
          requiredElements: style.required_elements || {},
          isDefault: style.is_default,
          createdBy: style.created_by,
          createdAt: new Date(style.created_at),
          updatedAt: new Date(style.updated_at),
        };
        console.log('📝 カスタムスタイル適用:', style.name);
      }
    }
    
    // 4. AI分析を実行
    let analysisResult;
    try {
      analysisResult = await analyzeReviewWithAI(
        review.comment || '',
        review.rating,
        customStyle
      );
    } catch (aiError) {
      console.error('AI分析エラー:', aiError);
      
      // AI APIエラーの詳細なハンドリング
      const errorMessage = aiError instanceof Error ? aiError.message : 'AI分析に失敗しました';
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        } as AnalyzeReviewResponse,
        { status: 500 }
      );
    }
    
    // 5. 分析結果をDBに保存
    try {
      await updateReviewAnalysisInDb(id, analysisResult, supabase);
    } catch (dbError) {
      console.error('DB更新エラー:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: dbError instanceof Error ? dbError.message : 'DB更新に失敗しました',
        } as AnalyzeReviewResponse,
        { status: 500 }
      );
    }
    
    // 6. 更新後のレビュー情報をDBから取得
    let updatedReview;
    try {
      updatedReview = await getReviewFromDb(id, supabase);
    } catch (error) {
      // 更新後の取得に失敗しても、分析自体は成功しているので成功レスポンスを返す
      console.warn('更新後のレビュー取得に失敗:', error);
      updatedReview = null;
    }
    
    console.log('✅ AI分析完了:', { reviewId: id });
    
    return NextResponse.json(
      {
        success: true,
        review: updatedReview,
        analysis: analysisResult,
      } as AnalyzeReviewResponse,
      { status: 200 }
    );
    
  } catch (error) {
    console.error('予期しないエラー:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '予期しないエラーが発生しました',
      } as AnalyzeReviewResponse,
      { status: 500 }
    );
  }
}
