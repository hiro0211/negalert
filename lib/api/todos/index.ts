/**
 * TODO API - エントリーポイント
 * 環境に応じて適切な実装を選択
 */

import { Todo } from '@/lib/types';
import { CreateTodoInput, UpdateTodoInput } from '../types';
import { createClient } from '../../supabase/client';
import { ProductionTodosApi } from './production';
import { MockTodosApi } from './mock';

/**
 * モックデータモードかどうかを判定
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * 環境に応じたAPI実装を選択
 */
const todosApi = USE_MOCK_DATA ? MockTodosApi : ProductionTodosApi;

/**
 * すべてのTODOを取得
 */
export async function fetchTodos(): Promise<Todo[]> {
  const supabase = createClient();
  return todosApi.fetchTodos(supabase);
}

/**
 * IDでTODOを取得
 */
export async function fetchTodoById(id: string): Promise<Todo | null> {
  const supabase = createClient();
  return todosApi.fetchTodoById(id, supabase);
}

/**
 * 新しいTODOを作成
 */
export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const supabase = createClient();
  return todosApi.createTodo(input, supabase);
}

/**
 * TODOを更新
 */
export async function updateTodo(
  id: string,
  updates: UpdateTodoInput
): Promise<Todo> {
  const supabase = createClient();
  return todosApi.updateTodo(id, updates, supabase);
}

/**
 * TODOの完了状態を切り替え
 */
export async function toggleTodoComplete(id: string): Promise<Todo> {
  const supabase = createClient();
  return todosApi.toggleTodoComplete(id, supabase);
}

/**
 * TODOを削除
 */
export async function deleteTodo(id: string): Promise<void> {
  const supabase = createClient();
  return todosApi.deleteTodo(id, supabase);
}

/**
 * 未完了のTODOを取得
 */
export async function fetchPendingTodos(): Promise<Todo[]> {
  const supabase = createClient();
  return todosApi.fetchPendingTodos(supabase);
}

/**
 * 完了済みのTODOを取得
 */
export async function fetchCompletedTodos(): Promise<Todo[]> {
  const supabase = createClient();
  return todosApi.fetchCompletedTodos(supabase);
}

/**
 * レビューに関連するTODOを取得
 */
export async function fetchTodosByReviewId(reviewId: string): Promise<Todo[]> {
  const supabase = createClient();
  return todosApi.fetchTodosByReviewId(reviewId, supabase);
}

// 既存のコードとの互換性のため、APIオブジェクトもエクスポート
export { todosApi };
