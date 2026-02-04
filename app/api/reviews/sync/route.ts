/**
 * Google Business Profileのレビューを取得してreviewsテーブルに同期するAPIエンドポイント
 * 
 * POST /api/reviews/sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getValidAccessToken } from '@/lib/api/tokens';
import { fetchGoogleReviews } from '@/lib/api/google-mybusiness';
import { syncReviews } from '@/lib/api/reviews-sync';
import { getWorkspaces } from '@/lib/api/workspaces';
import { SyncReviewsResponse } from '@/lib/api/types';

export async function POST(request: NextRequest) {
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
          totalReviews: 0,
          syncedWorkspaces: 0,
        } as SyncReviewsResponse,
        { status: 401 }
      );
    }
    
    console.log('🔄 レビュー同期を開始:', { userId: user.id });
    
    // 2. 有効なアクセストークンを取得（期限切れなら自動リフレッシュ）
    let accessToken: string;
    try {
      accessToken = await getValidAccessToken(user.id, supabase);
    } catch (tokenError) {
      console.error('トークン取得エラー:', tokenError);
      return NextResponse.json(
        {
          success: false,
          error: tokenError instanceof Error ? tokenError.message : 'トークンの取得に失敗しました',
          totalReviews: 0,
          syncedWorkspaces: 0,
        } as SyncReviewsResponse,
        { status: 401 }
      );
    }
    
    // 3. ユーザーの全ワークスペース（店舗）を取得
    let workspaces;
    try {
      workspaces = await getWorkspaces(user.id, supabase);
    } catch (workspaceError) {
      console.error('ワークスペース取得エラー:', workspaceError);
      return NextResponse.json(
        {
          success: false,
          error: workspaceError instanceof Error ? workspaceError.message : 'ワークスペースの取得に失敗しました',
          totalReviews: 0,
          syncedWorkspaces: 0,
        } as SyncReviewsResponse,
        { status: 500 }
      );
    }
    
    if (workspaces.length === 0) {
      console.log('⚠️ 同期するワークスペースがありません');
      return NextResponse.json(
        {
          success: true,
          totalReviews: 0,
          syncedWorkspaces: 0,
        } as SyncReviewsResponse,
        { status: 200 }
      );
    }
    
    // 4. 各ワークスペースのレビューを取得・同期
    // Promise.allSettledを使用して、一部の店舗でエラーが発生しても他の店舗の同期を継続
    let totalReviews = 0;
    let syncedWorkspaces = 0;
    const errors: string[] = [];
    
    const syncPromises = workspaces.map(async (workspace) => {
      try {
        console.log(`📥 ワークスペース「${workspace.name}」のレビュー取得中...`);
        
        // Google APIからレビュー取得
        const reviews = await fetchGoogleReviews(workspace.google_location_id, accessToken);
        
        if (reviews.length === 0) {
          console.log(`⚠️ ワークスペース「${workspace.name}」にレビューがありません`);
          return { workspaceId: workspace.id, count: 0 };
        }
        
        // DBに保存
        const syncedCount = await syncReviews(workspace.id, reviews, supabase);
        
        console.log(`✅ ワークスペース「${workspace.name}」: ${syncedCount}件のレビューを同期`);
        
        return { workspaceId: workspace.id, count: syncedCount };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '不明なエラー';
        console.error(`❌ ワークスペース「${workspace.name}」の同期エラー:`, errorMessage);
        errors.push(`${workspace.name}: ${errorMessage}`);
        return { workspaceId: workspace.id, count: 0, error: errorMessage };
      }
    });
    
    const results = await Promise.allSettled(syncPromises);
    
    // 結果を集計
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        if (!result.value.error) {
          totalReviews += result.value.count;
          syncedWorkspaces += 1;
        }
      }
    });
    
    // 5. 結果を返す
    console.log('✅ レビュー同期完了:', {
      totalReviews,
      syncedWorkspaces,
      totalWorkspaces: workspaces.length,
      errors: errors.length,
    });
    
    // 一部でもエラーがあった場合は警告を含める
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: true,
          totalReviews,
          syncedWorkspaces,
          error: `一部のワークスペースで同期に失敗しました: ${errors.join(', ')}`,
        } as SyncReviewsResponse,
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        totalReviews,
        syncedWorkspaces,
      } as SyncReviewsResponse,
      { status: 200 }
    );
    
  } catch (error) {
    console.error('予期しないエラー:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '予期しないエラーが発生しました',
        totalReviews: 0,
        syncedWorkspaces: 0,
      } as SyncReviewsResponse,
      { status: 500 }
    );
  }
}
