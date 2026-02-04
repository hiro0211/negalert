/**
 * API層の型定義
 * Google OAuth、Google My Business API、Supabase統合用の型を含む
 */

import { Review, Todo, DashboardStats, User } from '../types';

// =====================================
// APIレスポンス型
// =====================================

export type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: ApiError;
};

export type ApiError = {
  message: string;
  code: string;
  details?: unknown;
};

// =====================================
// 入力型
// =====================================

export type CreateTodoInput = Omit<Todo, 'id' | 'completed'>;

export type UpdateTodoInput = Partial<Omit<Todo, 'id'>>;

export type UpdateReviewInput = {
  reply?: string;
  replyDraft?: string;
  status?: Review['status'];
};

// =====================================
// Google OAuth関連型
// =====================================

export type AuthProvider = 'google';

export type AuthSession = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  provider: AuthProvider;
};

export type GoogleOAuthConfig = {
  clientId: string;
  redirectUri: string;
  scopes: string[];
};

export type GoogleTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
};

// =====================================
// Google My Business API関連型
// =====================================

export type GoogleLocation = {
  name: string;
  locationId: string;
  address: string;
  placeId?: string;
};

export type GoogleReviewStarRating = 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';

export type GoogleReview = {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  starRating: GoogleReviewStarRating;
  comment: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
};

export type GoogleReviewReplyInput = {
  comment: string;
};

// =====================================
// ヘルパー関数の型
// =====================================

/**
 * Google My Businessの星評価を1-5の数値に変換
 */
export function convertGoogleRatingToNumber(rating: GoogleReviewStarRating): 1 | 2 | 3 | 4 | 5 {
  const ratingMap: Record<GoogleReviewStarRating, 1 | 2 | 3 | 4 | 5> = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  };
  return ratingMap[rating];
}

/**
 * 1-5の数値をGoogle My Businessの星評価に変換
 */
export function convertNumberToGoogleRating(rating: 1 | 2 | 3 | 4 | 5): GoogleReviewStarRating {
  const ratingMap: Record<1 | 2 | 3 | 4 | 5, GoogleReviewStarRating> = {
    1: 'ONE',
    2: 'TWO',
    3: 'THREE',
    4: 'FOUR',
    5: 'FIVE',
  };
  return ratingMap[rating];
}

// =====================================
// Workspace関連型
// =====================================

export type Workspace = {
  id: string;
  user_id: string;
  google_location_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type SyncLocationsResponse = {
  success: boolean;
  locations: GoogleLocation[];
  syncedCount: number;
  error?: string;
};

// =====================================
// レビュー同期関連型
// =====================================

export type SyncReviewsResponse = {
  success: boolean;
  totalReviews: number;
  syncedWorkspaces: number;
  error?: string;
};

// =====================================
// レビュー返信関連型
// =====================================

/**
 * レビュー返信APIのレスポンス型
 */
export type ReplyToReviewResponse = {
  success: boolean;
  review?: any; // 更新後のレビュー情報
  error?: string;
};

/**
 * 返信削除APIのレスポンス型
 */
export type DeleteReplyResponse = {
  success: boolean;
  error?: string;
};

// =====================================
// AI分析関連型
// =====================================

/**
 * AI分析結果の型
 */
export interface AIAnalysisResult {
  summary: string;           // 50文字以内の要約
  risk: 'high' | 'medium' | 'low';
  categories: string[];      // カテゴリ配列
  riskReason: string;        // 30文字以内のリスク理由
  replyDraft: string;        // 返信案
}

/**
 * レビューAI分析APIのレスポンス型
 */
export interface AnalyzeReviewResponse {
  success: boolean;
  review?: any;               // 更新後のレビュー情報
  analysis?: AIAnalysisResult; // AI分析結果
  error?: string;
}
