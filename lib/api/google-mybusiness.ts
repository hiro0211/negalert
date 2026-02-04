/**
 * Google My Business API クライアント
 * レビュー取得・返信投稿を実装
 */

import { GoogleLocation, GoogleReview, GoogleReviewReplyInput } from './types';

// Google Business Profile API エンドポイント
const GMB_API_BASE = 'https://mybusinessbusinessinformation.googleapis.com/v1';
const GMB_ACCOUNT_API_BASE = 'https://mybusinessaccountmanagement.googleapis.com/v1';

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
    const errorData = await response.json().catch(() => ({}));
    console.error('アカウントID取得エラー:', errorData);
    
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
  console.log('✅ アカウントID取得成功:', accountId);
  
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
    const errorData = await response.json().catch(() => ({}));
    console.error('ロケーション取得エラー:', errorData);
    
    if (response.status === 401) {
      throw new Error('認証エラー: アクセストークンが無効です');
    } else if (response.status === 403) {
      throw new Error('権限エラー: ロケーションへのアクセス権限がありません');
    }
    
    throw new Error(`ロケーション取得に失敗しました: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.locations || data.locations.length === 0) {
    console.log('⚠️ ロケーションが見つかりませんでした');
    return [];
  }
  
  // レスポンスをGoogleLocation型に変換
  const locations: GoogleLocation[] = data.locations.map((loc: any) => ({
    name: loc.title || loc.name || '店舗名なし',
    locationId: loc.name, // "accounts/123/locations/456" 形式
    address: formatAddress(loc.storefrontAddress),
    placeId: loc.metadata?.placeId,
  }));
  
  console.log(`✅ ロケーション取得成功: ${locations.length}件`);
  
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
  console.warn('⚠️ fetchGoogleLocations() は廃止されました。listLocations() を使用してください。');
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
