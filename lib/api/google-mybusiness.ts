/**
 * Google My Business API クライアント
 * レビュー取得・返信投稿を実装
 */

import { GoogleLocation, GoogleReview, GoogleReviewReplyInput } from './types';

// Google My Business API エンドポイント
const GMB_API_BASE = 'https://mybusiness.googleapis.com/v4';

/**
 * ロケーション一覧を取得
 * 
 * @param accessToken - Google OAuthアクセストークン
 * @returns ロケーション一覧
 */
export async function fetchGoogleLocations(
  accessToken: string
): Promise<GoogleLocation[]> {
  // 現在: モック実装
  // 将来: GMB API /accounts/{accountId}/locations を呼び出し
  
  console.log('[Mock] Googleロケーション取得:', { accessToken });
  
  // 本番実装例（コメントアウト）
  /*
  const response = await fetch(`${GMB_API_BASE}/accounts/{accountId}/locations`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('ロケーション取得に失敗しました');
  }
  
  const data = await response.json();
  
  return data.locations.map((loc: any) => ({
    name: loc.locationName,
    locationId: loc.name,
    address: loc.address.addressLines.join(', '),
    placeId: loc.metadata?.placeId,
  }));
  */
  
  // モック: ダミーロケーションを返す
  return [
    {
      name: 'サンプルレストラン 渋谷店',
      locationId: 'accounts/123/locations/456',
      address: '東京都渋谷区渋谷1-1-1',
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    },
  ];
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
  // 現在: モック実装
  // 将来: GMB API /accounts/{accountId}/locations/{locationId}/reviews を呼び出し
  
  console.log('[Mock] Googleレビュー取得:', { locationId, accessToken });
  
  // 本番実装例（コメントアウト）
  /*
  const response = await fetch(
    `${GMB_API_BASE}/${locationId}/reviews`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('レビュー取得に失敗しました');
  }
  
  const data = await response.json();
  
  return data.reviews || [];
  */
  
  // モック: 空配列を返す（実際のレビューはlib/mock/reviews.tsから取得）
  return [];
}

/**
 * レビューに返信を投稿
 * 
 * @param reviewId - レビューID
 * @param replyText - 返信テキスト
 * @param accessToken - Google OAuthアクセストークン
 */
export async function replyToGoogleReview(
  reviewId: string,
  replyText: string,
  accessToken: string
): Promise<void> {
  // 現在: モック実装（何もしない）
  // 将来: GMB API で返信投稿
  
  console.log('[Mock] Googleレビューに返信:', {
    reviewId,
    replyText,
    accessToken,
  });
  
  // 本番実装例（コメントアウト）
  /*
  const response = await fetch(
    `${GMB_API_BASE}/${reviewId}/reply`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: replyText,
      } as GoogleReviewReplyInput),
    }
  );
  
  if (!response.ok) {
    throw new Error('返信投稿に失敗しました');
  }
  */
  
  // モック: 成功として扱う
  await new Promise(resolve => setTimeout(resolve, 500)); // 遅延をシミュレート
}

/**
 * レビューの返信を更新
 * 
 * @param reviewId - レビューID
 * @param replyText - 更新後の返信テキスト
 * @param accessToken - Google OAuthアクセストークン
 */
export async function updateGoogleReviewReply(
  reviewId: string,
  replyText: string,
  accessToken: string
): Promise<void> {
  // 現在: モック実装（何もしない）
  // 将来: GMB API で返信更新
  
  console.log('[Mock] Googleレビュー返信を更新:', {
    reviewId,
    replyText,
    accessToken,
  });
  
  // 本番実装例（コメントアウト）
  /*
  const response = await fetch(
    `${GMB_API_BASE}/${reviewId}/reply`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: replyText,
      } as GoogleReviewReplyInput),
    }
  );
  
  if (!response.ok) {
    throw new Error('返信更新に失敗しました');
  }
  */
  
  // モック: 成功として扱う
  await new Promise(resolve => setTimeout(resolve, 500));
}

/**
 * レビューの返信を削除
 * 
 * @param reviewId - レビューID
 * @param accessToken - Google OAuthアクセストークン
 */
export async function deleteGoogleReviewReply(
  reviewId: string,
  accessToken: string
): Promise<void> {
  // 現在: モック実装（何もしない）
  // 将来: GMB API で返信削除
  
  console.log('[Mock] Googleレビュー返信を削除:', {
    reviewId,
    accessToken,
  });
  
  // 本番実装例（コメントアウト）
  /*
  const response = await fetch(
    `${GMB_API_BASE}/${reviewId}/reply`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('返信削除に失敗しました');
  }
  */
  
  // モック: 成功として扱う
  await new Promise(resolve => setTimeout(resolve, 500));
}
