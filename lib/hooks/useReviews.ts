/**
 * レビューデータ管理フック
 * データ取得とローディング・エラー状態を管理
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Review } from '../types';
import {
  fetchReviews,
  fetchReviewById,
  fetchUnrepliedReviews,
  fetchNegativeReviews,
  fetchHighRiskReviews,
} from '../api/reviews';

/**
 * すべてのレビューを取得するフック
 */
export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReviews();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('レビューの取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: loadReviews,
  };
}

/**
 * IDでレビューを取得するフック
 */
export function useReview(id: string) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadReview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReviewById(id);
      setReview(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('レビューの取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadReview();
  }, [loadReview]);

  // レビューデータを直接更新する関数（モックモード用）
  const updateReview = useCallback((updatedData: Partial<Review>) => {
    setReview(prev => {
      if (!prev) return null;
      return { ...prev, ...updatedData };
    });
  }, []);

  return {
    review,
    loading,
    error,
    refetch: loadReview,
    updateReview, // 直接更新用の関数を追加
  };
}

/**
 * 未返信レビューを取得するフック
 */
export function useUnrepliedReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUnrepliedReviews();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未返信レビューの取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: loadReviews,
  };
}

/**
 * ネガティブレビューを取得するフック
 */
export function useNegativeReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNegativeReviews();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('ネガティブレビューの取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: loadReviews,
  };
}

/**
 * 高リスクレビューを取得するフック
 */
export function useHighRiskReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHighRiskReviews();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('高リスクレビューの取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: loadReviews,
  };
}
