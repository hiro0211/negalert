/**
 * TODO API - モック環境実装
 * 静的なモックデータを返却
 */

import { Todo } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { CreateTodoInput, UpdateTodoInput } from '../types';
import { TodosApi } from './types';
import { mockTodos } from '@/lib/mock/todos';

/**
 * モック環境用TODO API実装
 */
export const MockTodosApi: TodosApi = {
  /**
   * すべてのTODOを取得
   */
  async fetchTodos(_supabase: SupabaseClient): Promise<Todo[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockTodos];
  },

  /**
   * IDでTODOを取得
   */
  async fetchTodoById(id: string, _supabase: SupabaseClient): Promise<Todo | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTodos.find(todo => todo.id === id) || null;
  },

  /**
   * 新しいTODOを作成
   */
  async createTodo(input: CreateTodoInput, _supabase: SupabaseClient): Promise<Todo> {
    console.log('[Mock] TODOを作成:', input);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      ...input,
      completed: false,
    };
    
    return newTodo;
  },

  /**
   * TODOを更新
   */
  async updateTodo(id: string, updates: UpdateTodoInput, supabase: SupabaseClient): Promise<Todo> {
    console.log('[Mock] TODOを更新:', { id, updates });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const todo = await this.fetchTodoById(id, supabase);
    if (!todo) {
      throw new Error('TODOが見つかりません');
    }
    
    return { ...todo, ...updates };
  },

  /**
   * TODOの完了状態を切り替え
   */
  async toggleTodoComplete(id: string, supabase: SupabaseClient): Promise<Todo> {
    console.log('[Mock] TODO完了状態を切り替え:', { id });
    
    const todo = await this.fetchTodoById(id, supabase);
    if (!todo) {
      throw new Error('TODOが見つかりません');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...todo, completed: !todo.completed };
  },

  /**
   * TODOを削除
   */
  async deleteTodo(id: string, _supabase: SupabaseClient): Promise<void> {
    console.log('[Mock] TODOを削除:', { id });
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  /**
   * 未完了のTODOを取得
   */
  async fetchPendingTodos(_supabase: SupabaseClient): Promise<Todo[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTodos.filter(todo => !todo.completed);
  },

  /**
   * 完了済みのTODOを取得
   */
  async fetchCompletedTodos(_supabase: SupabaseClient): Promise<Todo[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTodos.filter(todo => todo.completed);
  },

  /**
   * レビューに関連するTODOを取得
   */
  async fetchTodosByReviewId(reviewId: string, _supabase: SupabaseClient): Promise<Todo[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTodos.filter(todo => todo.relatedReviewId === reviewId);
  },
};
