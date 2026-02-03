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
