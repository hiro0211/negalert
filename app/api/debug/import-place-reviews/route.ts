/**
 * デバッグ用: Google Places APIから他店舗のレビューをインポート
 * モックモード（NEXT_PUBLIC_USE_MOCK_DATA=true）でのみ動作
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWorkspaces } from '@/lib/api/workspaces';

/**
 * Google Places APIのレビュー型
 */
interface PlacesApiReview {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  text: string;
  time: number;
}

/**
 * Google Places APIのレスポンス型
 */
interface PlacesApiResponse {
  result: {
    name: string;
    reviews?: PlacesApiReview[];
  };
  status: string;
}

/**
 * リクエストボディの型
 */
interface ImportPlaceReviewsRequest {
  placeId: string;
}

/**
 * レスポンスの型
 */
interface ImportPlaceReviewsResponse {
  success: boolean;
  importedCount?: number;
  reviews?: any[];
  error?: string;
}

/**
 * POST /api/debug/import-place-reviews
 * Google Places APIから指定したplaceIdのレビューを取得してDBに保存
 */
export async function POST(request: NextRequest) {
  try {
    // 1. モックモードチェック（最優先）
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'true') {
      return NextResponse.json(
        { success: false, error: 'Mock mode is disabled' } as ImportPlaceReviewsResponse,
        { status: 403 }
      );
    }

    // 2. 認証チェック
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ImportPlaceReviewsResponse,
        { status: 401 }
      );
    }

    // 3. リクエストボディの取得
    const body: ImportPlaceReviewsRequest = await request.json();
    const { placeId } = body;

    if (!placeId) {
      return NextResponse.json(
        { success: false, error: 'placeId is required' } as ImportPlaceReviewsResponse,
        { status: 400 }
      );
    }

    // 4. ワークスペース取得
    const workspaces = await getWorkspaces(user.id, supabase);
    
    if (workspaces.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No workspace found for user' } as ImportPlaceReviewsResponse,
        { status: 404 }
      );
    }

    const workspaceId = workspaces[0].id;
    console.log('📍 ワークスペースID:', workspaceId);

    // 5. Google Places API呼び出し
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'GOOGLE_PLACES_API_KEY is not configured' } as ImportPlaceReviewsResponse,
        { status: 500 }
      );
    }

    const placesApiUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    placesApiUrl.searchParams.append('place_id', placeId);
    placesApiUrl.searchParams.append('fields', 'name,reviews');
    placesApiUrl.searchParams.append('language', 'ja');
    placesApiUrl.searchParams.append('key', apiKey);

    console.log('🌐 Google Places API呼び出し:', placeId);
    
    const placesResponse = await fetch(placesApiUrl.toString());
    const placesData: PlacesApiResponse = await placesResponse.json();

    if (placesData.status !== 'OK') {
      return NextResponse.json(
        { success: false, error: `Google Places API error: ${placesData.status}` } as ImportPlaceReviewsResponse,
        { status: 500 }
      );
    }

    const reviews = placesData.result.reviews || [];
    
    if (reviews.length === 0) {
      return NextResponse.json(
        { success: true, importedCount: 0, reviews: [] } as ImportPlaceReviewsResponse,
        { status: 200 }
      );
    }

    console.log(`📝 取得したレビュー数: ${reviews.length}`);

    // 6. レビューデータをDBスキーマに変換
    const reviewsData = reviews.map(review => ({
      workspace_id: workspaceId,
      google_review_id: `imported-${placeId}-${review.time}`,
      author_name: review.author_name,
      author_photo_url: review.profile_photo_url || null,
      rating: review.rating as 1 | 2 | 3 | 4 | 5,
      comment: review.text || '',
      review_created_at: new Date(review.time * 1000).toISOString(),
      status: 'unreplied' as const,
      reply_text: null,
      reply_created_at: null,
      updated_at: new Date().toISOString(),
    }));

    // 7. DBにUpsert保存
    console.log('💾 DBに保存中...');
    
    const { data: savedReviews, error: dbError } = await supabase
      .from('reviews')
      .upsert(reviewsData, {
        onConflict: 'google_review_id',
        ignoreDuplicates: false,
      })
      .select();

    if (dbError) {
      console.error('DB保存エラー:', dbError);
      return NextResponse.json(
        { success: false, error: `Database error: ${dbError.message}` } as ImportPlaceReviewsResponse,
        { status: 500 }
      );
    }

    const importedCount = savedReviews?.length || 0;
    console.log(`✅ インポート成功: ${importedCount}件`);

    return NextResponse.json({
      success: true,
      importedCount,
      reviews: savedReviews,
    } as ImportPlaceReviewsResponse);

  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { success: false, error: String(error) } as ImportPlaceReviewsResponse,
      { status: 500 }
    );
  }
}
