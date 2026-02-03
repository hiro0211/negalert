/**
 * 認証管理フック
 * Google OAuth認証状態の管理
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { AuthSession } from '../api/types';
import {
  getSession,
  signOut,
  getCurrentUser,
  initiateGoogleOAuth,
} from '../api/auth';

/**
 * 認証状態を管理するフック
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // セッション取得
  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionData = await getSession();
      setSession(sessionData);
      setUser(sessionData?.user || null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('セッションの取得に失敗しました'));
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // ログイン（Google OAuth開始）
  const login = useCallback(async () => {
    try {
      const { authUrl } = await initiateGoogleOAuth();
      window.location.href = authUrl;
    } catch (err) {
      throw err instanceof Error ? err : new Error('ログインに失敗しました');
    }
  }, []);

  // ログアウト
  const logout = useCallback(async () => {
    try {
      await signOut();
      setSession(null);
      setUser(null);
    } catch (err) {
      throw err instanceof Error ? err : new Error('ログアウトに失敗しました');
    }
  }, []);

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    refetch: loadSession,
  };
}

/**
 * 現在のユーザーを取得するフック
 */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('ユーザー情報の取得に失敗しました'));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    loading,
    error,
    refetch: loadUser,
  };
}
