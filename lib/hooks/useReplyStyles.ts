/**
 * 返信スタイル管理のカスタムフック
 */

'use client';

import { useState, useEffect } from 'react';
import { ReplyStyle } from '@/lib/types';

export function useReplyStyles() {
  const [replyStyles, setReplyStyles] = useState<ReplyStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchReplyStyles();
  }, []);

  const fetchReplyStyles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/reply-styles');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '返信スタイルの取得に失敗しました');
      }
      
      const data = await response.json();
      setReplyStyles(data);
    } catch (err) {
      console.error('返信スタイル取得エラー:', err);
      setError(err instanceof Error ? err : new Error('返信スタイルの取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  };

  const createStyle = async (style: Omit<ReplyStyle, 'id' | 'workspaceId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/reply-styles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(style),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '返信スタイルの作成に失敗しました');
      }

      const newStyle = await response.json();
      setReplyStyles([newStyle, ...replyStyles]);
      
      return newStyle;
    } catch (err) {
      console.error('返信スタイル作成エラー:', err);
      throw err;
    }
  };

  const updateStyle = async (id: string, updates: Partial<ReplyStyle>) => {
    try {
      const response = await fetch(`/api/reply-styles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '返信スタイルの更新に失敗しました');
      }

      const updatedStyle = await response.json();
      setReplyStyles(replyStyles.map(style => 
        style.id === id ? updatedStyle : style
      ));
      
      return updatedStyle;
    } catch (err) {
      console.error('返信スタイル更新エラー:', err);
      throw err;
    }
  };

  const deleteStyle = async (id: string) => {
    try {
      const response = await fetch(`/api/reply-styles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '返信スタイルの削除に失敗しました');
      }

      setReplyStyles(replyStyles.filter(style => style.id !== id));
    } catch (err) {
      console.error('返信スタイル削除エラー:', err);
      throw err;
    }
  };

  return {
    replyStyles,
    loading,
    error,
    createStyle,
    updateStyle,
    deleteStyle,
    refetch: fetchReplyStyles,
  };
}
