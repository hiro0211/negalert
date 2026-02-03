/**
 * TODO管理フック
 * TODOデータの取得と操作
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types';
import { CreateTodoInput, UpdateTodoInput } from '../api/types';
import {
  fetchTodos,
  fetchTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
  fetchPendingTodos,
  fetchCompletedTodos,
} from '../api/todos';

/**
 * すべてのTODOを取得するフック
 */
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('TODOの取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // TODO作成
  const create = useCallback(
    async (input: CreateTodoInput) => {
      try {
        const newTodo = await createTodo(input);
        setTodos(prev => [...prev, newTodo]);
        return newTodo;
      } catch (err) {
        throw err instanceof Error ? err : new Error('TODOの作成に失敗しました');
      }
    },
    []
  );

  // TODO更新
  const update = useCallback(
    async (id: string, updates: UpdateTodoInput) => {
      try {
        const updatedTodo = await updateTodo(id, updates);
        setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
        return updatedTodo;
      } catch (err) {
        throw err instanceof Error ? err : new Error('TODOの更新に失敗しました');
      }
    },
    []
  );

  // TODO削除
  const remove = useCallback(async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('TODOの削除に失敗しました');
    }
  }, []);

  // 完了状態を切り替え
  const toggleComplete = useCallback(async (id: string) => {
    try {
      const updatedTodo = await toggleTodoComplete(id);
      setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
      return updatedTodo;
    } catch (err) {
      throw err instanceof Error ? err : new Error('TODO完了状態の変更に失敗しました');
    }
  }, []);

  return {
    todos,
    loading,
    error,
    refetch: loadTodos,
    create,
    update,
    remove,
    toggleComplete,
  };
}

/**
 * IDでTODOを取得するフック
 */
export function useTodo(id: string) {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTodo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodoById(id);
      setTodo(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('TODOの取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTodo();
  }, [loadTodo]);

  return {
    todo,
    loading,
    error,
    refetch: loadTodo,
  };
}

/**
 * 未完了TODOを取得するフック
 */
export function usePendingTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPendingTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未完了TODOの取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    todos,
    loading,
    error,
    refetch: loadTodos,
  };
}

/**
 * 完了済みTODOを取得するフック
 */
export function useCompletedTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCompletedTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('完了済みTODOの取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    todos,
    loading,
    error,
    refetch: loadTodos,
  };
}
