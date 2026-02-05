/**
 * TODO API共通型定義
 */

import { Todo } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { CreateTodoInput, UpdateTodoInput } from '../types';

/**
 * TODO APIの共通インターフェース
 * モック実装と本番実装の両方がこのインターフェースに準拠する
 */
export interface TodosApi {
  /**
   * すべてのTODOを取得
   */
  fetchTodos(supabase: SupabaseClient): Promise<Todo[]>;

  /**
   * IDでTODOを取得
   */
  fetchTodoById(id: string, supabase: SupabaseClient): Promise<Todo | null>;

  /**
   * 新しいTODOを作成
   */
  createTodo(input: CreateTodoInput, supabase: SupabaseClient): Promise<Todo>;

  /**
   * TODOを更新
   */
  updateTodo(id: string, updates: UpdateTodoInput, supabase: SupabaseClient): Promise<Todo>;

  /**
   * TODOの完了状態を切り替え
   */
  toggleTodoComplete(id: string, supabase: SupabaseClient): Promise<Todo>;

  /**
   * TODOを削除
   */
  deleteTodo(id: string, supabase: SupabaseClient): Promise<void>;

  /**
   * 未完了のTODOを取得
   */
  fetchPendingTodos(supabase: SupabaseClient): Promise<Todo[]>;

  /**
   * 完了済みのTODOを取得
   */
  fetchCompletedTodos(supabase: SupabaseClient): Promise<Todo[]>;

  /**
   * レビューに関連するTODOを取得
   */
  fetchTodosByReviewId(reviewId: string, supabase: SupabaseClient): Promise<Todo[]>;
}
