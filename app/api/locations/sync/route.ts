/**
 * Google Business Profileの店舗一覧を取得してWorkspacesに同期するAPIエンドポイント
 * 
 * POST /api/locations/sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getValidAccessToken } from '@/lib/api/tokens';
import { listLocations } from '@/lib/api/google-mybusiness';
import { syncWorkspaces } from '@/lib/api/workspaces';
import { SyncLocationsResponse } from '@/lib/api/types';

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
        } as SyncLocationsResponse,
        { status: 401 }
      );
    }
    
    console.log('🔄 店舗同期を開始:', { userId: user.id });
    
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
        } as SyncLocationsResponse,
        { status: 401 }
      );
    }
    
    // 3. Google Business Profileから店舗一覧を取得
    let locations;
    try {
      locations = await listLocations(accessToken);
    } catch (apiError) {
      console.error('Google API呼び出しエラー:', apiError);
      
      // エラーメッセージに応じてステータスコードを変更
      const errorMessage = apiError instanceof Error ? apiError.message : 'Google APIの呼び出しに失敗しました';
      const statusCode = errorMessage.includes('認証エラー') ? 401 : 
                         errorMessage.includes('権限エラー') ? 403 : 500;
      
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        } as SyncLocationsResponse,
        { status: statusCode }
      );
    }
    
    // 4. Workspacesテーブルに同期
    let syncedCount: number;
    try {
      syncedCount = await syncWorkspaces(user.id, locations, supabase);
    } catch (syncError) {
      console.error('Workspace同期エラー:', syncError);
      return NextResponse.json(
        {
          success: false,
          error: syncError instanceof Error ? syncError.message : 'Workspaceの同期に失敗しました',
        } as SyncLocationsResponse,
        { status: 500 }
      );
    }
    
    // 5. 成功レスポンスを返す
    console.log('✅ 店舗同期完了:', { syncedCount, locationsCount: locations.length });
    
    return NextResponse.json(
      {
        success: true,
        locations,
        syncedCount,
      } as SyncLocationsResponse,
      { status: 200 }
    );
    
  } catch (error) {
    console.error('予期しないエラー:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '予期しないエラーが発生しました',
      } as SyncLocationsResponse,
      { status: 500 }
    );
  }
}
