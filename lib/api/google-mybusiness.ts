/**
 * Google My Business API クライアント
 * レビュー取得・返信投稿を実装
 */

import { GoogleLocation, GoogleReview, GoogleReviewReplyInput } from './types';
import { mockLocations } from '@/lib/data/mock-data';

// Google Business Profile API エンドポイント
const GMB_API_BASE = 'https://mybusinessbusinessinformation.googleapis.com/v1';
const GMB_ACCOUNT_API_BASE = 'https://mybusinessaccountmanagement.googleapis.com/v1';

// モックモードの判定
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * Google Business ProfileのアカウントIDを取得
 * 
 * @param accessToken - Google OAuthアクセストークン
 * @returns アカウントID（例: "accounts/123456789"）
 */
export async function getAccountId(accessToken: string): Promise<string> {
  const response = await fetch(`${GMB_ACCOUNT_API_BASE}/accounts`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('認証エラー: アクセストークンが無効です');
    } else if (response.status === 403) {
      throw new Error('権限エラー: Google Business Profileへのアクセス権限がありません');
    }
    
    throw new Error(`アカウントID取得に失敗しました: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.accounts || data.accounts.length === 0) {
    throw new Error('Google Business Profileアカウントが見つかりません');
  }
  
  // 最初のアカウントのIDを返す
  const accountId = data.accounts[0].name; // "accounts/123456789" 形式
  return accountId;
}

/**
 * 店舗一覧を取得
 * 
 * @param accessToken - Google OAuthアクセストークン
 * @returns ロケーション一覧
 */
export async function listLocations(
  accessToken: string
): Promise<GoogleLocation[]> {
  // モックモード: 静的データを返す
  if (USE_MOCK_DATA) {
    console.log('[Mock] モックの店舗一覧を返します');
    // 遅延をシミュレート
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLocations;
  }

  // 本番モード: Google APIを呼び出す
  // アカウントIDを取得
  const accountId = await getAccountId(accessToken);
  
  // ロケーション一覧を取得
  const readMask = 'name,title,storefrontAddress,metadata';
  const url = `${GMB_API_BASE}/${accountId}/locations?readMask=${readMask}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('認証エラー: アクセストークンが無効です');
    } else if (response.status === 403) {
      throw new Error('権限エラー: ロケーションへのアクセス権限がありません');
    }
    
    throw new Error(`ロケーション取得に失敗しました: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.locations || data.locations.length === 0) {
    return [];
  }
  
  // レスポンスをGoogleLocation型に変換
  const locations: GoogleLocation[] = data.locations.map((loc: any) => ({
    name: loc.title || loc.name || '店舗名なし',
    locationId: loc.name, // "accounts/123/locations/456" 形式
    address: formatAddress(loc.storefrontAddress),
    placeId: loc.metadata?.placeId,
  }));
  
  return locations;
}

/**
 * 住所オブジェクトを文字列にフォーマット
 * 
 * @param address - Google Business Profileの住所オブジェクト
 * @returns フォーマットされた住所文字列
 */
function formatAddress(address: any): string {
  if (!address) {
    return '';
  }
  
  const parts: string[] = [];
  
  if (address.addressLines) {
    parts.push(...address.addressLines);
  }
  
  if (address.locality) {
    parts.push(address.locality);
  }
  
  if (address.administrativeArea) {
    parts.push(address.administrativeArea);
  }
  
  if (address.postalCode) {
    parts.push(address.postalCode);
  }
  
  return parts.filter(Boolean).join(', ');
}

/**
 * @deprecated この関数は廃止されました。listLocations() を使用してください。
 */
export async function fetchGoogleLocations(
  accessToken: string
): Promise<GoogleLocation[]> {
  return listLocations(accessToken);
}

/**
 * 指定ロケーションのレビューを取得
 * 
 * @param locationId - ロケーションID（例: accounts/123/locations/456）
 * @param accessToken - Google OAuthアクセストークン
 * @returns レビュー一覧
 */
export async function fetchGoogleReviews(
  locationId: string,
  accessToken: string
): Promise<GoogleReview[]> {
  // Google My Business API v4 のレビューエンドポイント
  // 注意: v4 API は廃止予定のため、将来的には Google Business Profile API に移行が必要
  const url = `https://mybusiness.googleapis.com/v4/${locationId}/reviews`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('認証エラー: アクセストークンが無効です');
    } else if (response.status === 403) {
      throw new Error('権限エラー: レビューへのアクセス権限がありません');
    } else if (response.status === 404) {
      // ロケーションが見つからない、またはレビューがない場合
      return [];
    }
    
    throw new Error(`レビュー取得に失敗しました: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.reviews || data.reviews.length === 0) {
    return [];
  }
  
  // レスポンスをGoogleReview型に変換
  const reviews: GoogleReview[] = data.reviews.map((review: any) => ({
    reviewId: review.reviewId || review.name,
    reviewer: {
      displayName: review.reviewer?.displayName || '匿名',
      profilePhotoUrl: review.reviewer?.profilePhotoUrl,
    },
    starRating: review.starRating || 'THREE',
    comment: review.comment || '',
    createTime: review.createTime,
    updateTime: review.updateTime,
    reviewReply: review.reviewReply ? {
      comment: review.reviewReply.comment,
      updateTime: review.reviewReply.updateTime,
    } : undefined,
  }));
  
  return reviews;
}

/**
 * レビューに返信を投稿・更新
 * 
 * @param reviewId - レビューID（例: accounts/123/locations/456/reviews/789）
 * @param replyText - 返信テキスト
 * @param accessToken - Google OAuthアクセストークン
 */
export async function replyToGoogleReview(
  reviewId: string,
  replyText: string,
  accessToken: string
): Promise<void> {
  // Google My Business API v4 のレビュー返信エンドポイント
  const url = `https://mybusiness.googleapis.com/v4/${reviewId}/reply`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment: replyText,
    } as GoogleReviewReplyInput),
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('認証エラー: アクセストークンが無効です');
    } else if (response.status === 403) {
      throw new Error('権限エラー: レビューへの返信権限がありません');
    } else if (response.status === 404) {
      throw new Error('レビューが見つかりません');
    }
    
    throw new Error(`返信投稿に失敗しました: ${response.status}`);
  }
}

/**
 * レビューの返信を削除
 * 
 * @param reviewId - レビューID（例: accounts/123/locations/456/reviews/789）
 * @param accessToken - Google OAuthアクセストークン
 */
export async function deleteGoogleReviewReply(
  reviewId: string,
  accessToken: string
): Promise<void> {
  // Google My Business API v4 のレビュー返信削除エンドポイント
  const url = `https://mybusiness.googleapis.com/v4/${reviewId}/reply`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('認証エラー: アクセストークンが無効です');
    } else if (response.status === 403) {
      throw new Error('権限エラー: レビューへの返信削除権限がありません');
    } else if (response.status === 404) {
      throw new Error('レビューまたは返信が見つかりません');
    }
    
    throw new Error(`返信削除に失敗しました: ${response.status}`);
  }
}
