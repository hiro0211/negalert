/**
 * レビュー関連API
 * データ取得・更新のインターフェース
 */

import { Review } from '../types';
import { UpdateReviewInput } from './types';
import {
  mockReviews,
  getReviewById as getMockReviewById,
  getUnrepliedReviews as getMockUnrepliedReviews,
  getNegativeReviews as getMockNegativeReviews,
  getHighRiskReviews as getMockHighRiskReviews,
} from '../mock/reviews';

/**
 * すべてのレビューを取得
 * 
 * @returns レビュー一覧
 */
export async function fetchReviews(): Promise<Review[]> {
  // 現在: モックデータを返す
  // 将来: Google My Business APIまたはSupabaseから取得
  
  // 本番実装例（コメントアウト）
  /*
  // オプション1: Google My Business APIから直接取得
  const session = await getSession();
  if (!session) {
    throw new Error('認証が必要です');
  }
  
  const googleReviews = await fetchGoogleReviews(
    session.user.location.id,
    session.accessToken
  );
  
  // Google形式からアプリ形式に変換
  return googleReviews.map(convertGoogleReviewToReview);
  */
  
  /*
  // オプション2: Supabaseから取得（キャッシュ）
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
  */
  
  // モック: 少し遅延を入れてリアルなAPI呼び出しをシミュレート
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockReviews];
}

/**
 * IDでレビューを取得
 * 
 * @param id - レビューID
 * @returns レビュー（見つからない場合はnull）
 */
export async function fetchReviewById(id: string): Promise<Review | null> {
  // 現在: モックデータから検索
  // 将来: SupabaseまたはGMB APIから取得
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // 見つからない
    }
    throw error;
  }
  
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 200));
  return getMockReviewById(id) || null;
}

/**
 * 未返信のレビューを取得
 * 
 * @returns 未返信レビュー一覧
 */
export async function fetchUnrepliedReviews(): Promise<Review[]> {
  // 現在: モックデータをフィルタ
  // 将来: Supabaseでフィルタリング
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'unreplied')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 200));
  return getMockUnrepliedReviews();
}

/**
 * ネガティブレビュー（★3以下）を取得
 * 
 * @returns ネガティブレビュー一覧
 */
export async function fetchNegativeReviews(): Promise<Review[]> {
  // 現在: モックデータをフィルタ
  // 将来: Supabaseでフィルタリング
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .lte('rating', 3)
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 200));
  return getMockNegativeReviews();
}

/**
 * 高リスクレビューを取得
 * 
 * @returns 高リスクレビュー一覧
 */
export async function fetchHighRiskReviews(): Promise<Review[]> {
  // 現在: モックデータをフィルタ
  // 将来: Supabaseでフィルタリング
  
  await new Promise(resolve => setTimeout(resolve, 200));
  return getMockHighRiskReviews();
}

/**
 * レビューに返信を投稿・更新
 * Phase 4のAPIエンドポイントを使用
 * 
 * @param id - レビューID
 * @param reply - 返信テキスト
 */
export async function updateReviewReply(
  id: string,
  reply: string
): Promise<void> {
  const response = await fetch(`/api/reviews/${id}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ replyText: reply }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '返信の投稿に失敗しました' }));
    throw new Error(error.error || '返信の投稿に失敗しました');
  }
}

/**
 * レビューの返信を削除
 * Phase 4のAPIエンドポイントを使用
 * 
 * @param id - レビューID
 */
export async function deleteReviewReply(id: string): Promise<void> {
  const response = await fetch(`/api/reviews/${id}/reply`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '返信の削除に失敗しました' }));
    throw new Error(error.error || '返信の削除に失敗しました');
  }
}

/**
 * 返信の下書きを保存
 * 
 * @param id - レビューID
 * @param draft - 下書きテキスト
 */
export async function saveReplyDraft(
  id: string,
  draft: string
): Promise<void> {
  // 現在: モック実装（何もしない）
  // 将来: Supabaseに下書きを保存
  
  console.log('[Mock] 下書きを保存:', { id, draft });
  
  // 本番実装例（コメントアウト）
  /*
  const { error } = await supabase
    .from('reviews')
    .update({
      replyDraft: draft,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id);
  
  if (error) throw error;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * レビュー情報を更新
 * 
 * @param id - レビューID
 * @param updates - 更新内容
 */
export async function updateReview(
  id: string,
  updates: UpdateReviewInput
): Promise<Review> {
  // 現在: モック実装（元のレビューを返す）
  // 将来: Supabaseを更新
  
  console.log('[Mock] レビューを更新:', { id, updates });
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('reviews')
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const review = await fetchReviewById(id);
  if (!review) {
    throw new Error('レビューが見つかりません');
  }
  
  return review;
}

/**
 * レビューを削除
 * 
 * @param id - レビューID
 */
export async function deleteReview(id: string): Promise<void> {
  // 現在: モック実装（何もしない）
  // 将来: Supabaseから削除（論理削除推奨）
  
  console.log('[Mock] レビューを削除:', { id });
  
  // 本番実装例（コメントアウト）
  /*
  // 論理削除
  const { error } = await supabase
    .from('reviews')
    .update({
      deletedAt: new Date().toISOString(),
    })
    .eq('id', id);
  
  if (error) throw error;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
}
