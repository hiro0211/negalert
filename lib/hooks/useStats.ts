/**
 * 統計データ管理フック
 * ダッシュボード統計の取得
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardStats } from '../types';
import {
  fetchDashboardStats,
  fetchReviewGrowth,
  fetchRatingDistribution,
  fetchNegativeFactors,
} from '../api/stats';

/**
 * ダッシュボード統計を取得するフック
 */
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('統計データの取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refetch: loadStats,
  };
}

/**
 * レビュー推移データを取得するフック
 */
export function useReviewGrowth(months: number = 6) {
  const [data, setData] = useState<{ month: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchReviewGrowth(months);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('レビュー推移の取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}

/**
 * 星評価分布を取得するフック
 */
export function useRatingDistribution() {
  const [data, setData] = useState<{ rating: number; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchRatingDistribution();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('星評価分布の取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}

/**
 * ネガティブ要因を取得するフック
 */
export function useNegativeFactors() {
  const [data, setData] = useState<{ factor: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchNegativeFactors();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('ネガティブ要因の取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}
