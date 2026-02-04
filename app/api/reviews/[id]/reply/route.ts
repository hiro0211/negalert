/**
 * Google Business Profileのレビューに返信を投稿・削除するAPIエンドポイント
 * 
 * POST /api/reviews/[id]/reply - 返信を投稿・更新
 * DELETE /api/reviews/[id]/reply - 返信を削除
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getValidAccessToken } from '@/lib/api/tokens';
import { replyToGoogleReview, deleteGoogleReviewReply } from '@/lib/api/google-mybusiness';
import { 
  updateReviewReplyInDb, 
  deleteReviewReplyInDb, 
  getReviewFromDb 
} from '@/lib/api/reviews-db';
import { ReplyToReviewResponse, DeleteReplyResponse } from '@/lib/api/types';

/**
 * レビューに返信を投稿・更新
 * POST /api/reviews/[id]/reply
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 0. paramsを解決
    const { id } = await params;
    
    // 1. 認証チェック
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('認証エラー:', authError);
      return NextResponse.json(
        {
          success: false,
          error: '認証が必要です',
        } as ReplyToReviewResponse,
        { status: 401 }
      );
    }
    
    console.log('💬 レビュー返信投稿を開始:', { reviewId: id, userId: user.id });
    
    // 2. リクエストボディから返信テキストを取得
    const body = await request.json();
    const { replyText } = body;
    
    if (!replyText || typeof replyText !== 'string' || replyText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '返信テキストが必要です',
        } as ReplyToReviewResponse,
        { status: 400 }
      );
    }
    
    // 3. アクセストークン取得（期限切れなら自動リフレッシュ）
    let accessToken: string;
    try {
      accessToken = await getValidAccessToken(user.id, supabase);
    } catch (tokenError) {
      console.error('トークン取得エラー:', tokenError);
      return NextResponse.json(
        {
          success: false,
          error: tokenError instanceof Error ? tokenError.message : 'トークンの取得に失敗しました',
        } as ReplyToReviewResponse,
        { status: 401 }
      );
    }
    
    // 4. レビュー情報を取得（google_review_idを取得するため）
    let review;
    try {
      review = await getReviewFromDb(id, supabase);
    } catch (reviewError) {
      console.error('レビュー取得エラー:', reviewError);
      return NextResponse.json(
        {
          success: false,
          error: reviewError instanceof Error ? reviewError.message : 'レビューの取得に失敗しました',
        } as ReplyToReviewResponse,
        { status: 404 }
      );
    }
    
    // 5. Google APIに返信を投稿
    try {
      await replyToGoogleReview(review.google_review_id, replyText, accessToken);
    } catch (googleError) {
      console.error('Google API呼び出しエラー:', googleError);
      
      // Google API失敗時はDBを更新せずにエラーを返す（整合性維持）
      const errorMessage = googleError instanceof Error ? googleError.message : 'Google APIの呼び出しに失敗しました';
      const statusCode = errorMessage.includes('認証エラー') ? 401 : 
                         errorMessage.includes('権限エラー') ? 403 : 
                         errorMessage.includes('見つかりません') ? 404 : 500;
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        } as ReplyToReviewResponse,
        { status: statusCode }
      );
    }
    
    // 6. DB更新（Google API成功後のみ）
    const repliedAt = new Date().toISOString();
    try {
      await updateReviewReplyInDb(id, replyText, repliedAt, supabase);
    } catch (dbError) {
      console.error('DB更新エラー:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: dbError instanceof Error ? dbError.message : 'DB更新に失敗しました',
        } as ReplyToReviewResponse,
        { status: 500 }
      );
    }
    
    // 7. 更新後のレビュー情報を取得
    let updatedReview;
    try {
      updatedReview = await getReviewFromDb(id, supabase);
    } catch (error) {
      // 更新後の取得に失敗しても、返信自体は成功しているので成功レスポンスを返す
      console.warn('更新後のレビュー取得に失敗:', error);
      updatedReview = null;
    }
    
    console.log('✅ レビュー返信投稿完了:', { reviewId: id });
    
    return NextResponse.json(
      {
        success: true,
        review: updatedReview,
      } as ReplyToReviewResponse,
      { status: 200 }
    );
    
  } catch (error) {
    console.error('予期しないエラー:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '予期しないエラーが発生しました',
      } as ReplyToReviewResponse,
      { status: 500 }
    );
  }
}

/**
 * レビューの返信を削除
 * DELETE /api/reviews/[id]/reply
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 0. paramsを解決
    const { id } = await params;
    
    // 1. 認証チェック
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('認証エラー:', authError);
      return NextResponse.json(
        {
          success: false,
          error: '認証が必要です',
        } as DeleteReplyResponse,
        { status: 401 }
      );
    }
    
    console.log('🗑️ レビュー返信削除を開始:', { reviewId: id, userId: user.id });
    
    // 2. アクセストークン取得（期限切れなら自動リフレッシュ）
    let accessToken: string;
    try {
      accessToken = await getValidAccessToken(user.id, supabase);
    } catch (tokenError) {
      console.error('トークン取得エラー:', tokenError);
      return NextResponse.json(
        {
          success: false,
          error: tokenError instanceof Error ? tokenError.message : 'トークンの取得に失敗しました',
        } as DeleteReplyResponse,
        { status: 401 }
      );
    }
    
    // 3. レビュー情報を取得（google_review_idを取得するため）
    let review;
    try {
      review = await getReviewFromDb(id, supabase);
    } catch (reviewError) {
      console.error('レビュー取得エラー:', reviewError);
      return NextResponse.json(
        {
          success: false,
          error: reviewError instanceof Error ? reviewError.message : 'レビューの取得に失敗しました',
        } as DeleteReplyResponse,
        { status: 404 }
      );
    }
    
    // 4. Google APIから返信を削除
    try {
      await deleteGoogleReviewReply(review.google_review_id, accessToken);
    } catch (googleError) {
      console.error('Google API呼び出しエラー:', googleError);
      
      // Google API失敗時はDBを更新せずにエラーを返す（整合性維持）
      const errorMessage = googleError instanceof Error ? googleError.message : 'Google APIの呼び出しに失敗しました';
      const statusCode = errorMessage.includes('認証エラー') ? 401 : 
                         errorMessage.includes('権限エラー') ? 403 : 
                         errorMessage.includes('見つかりません') ? 404 : 500;
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        } as DeleteReplyResponse,
        { status: statusCode }
      );
    }
    
    // 5. DB更新（Google API成功後のみ）
    try {
      await deleteReviewReplyInDb(id, supabase);
    } catch (dbError) {
      console.error('DB更新エラー:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: dbError instanceof Error ? dbError.message : 'DB更新に失敗しました',
        } as DeleteReplyResponse,
        { status: 500 }
      );
    }
    
    console.log('✅ レビュー返信削除完了:', { reviewId: id });
    
    return NextResponse.json(
      {
        success: true,
      } as DeleteReplyResponse,
      { status: 200 }
    );
    
  } catch (error) {
    console.error('予期しないエラー:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '予期しないエラーが発生しました',
      } as DeleteReplyResponse,
      { status: 500 }
    );
  }
}
