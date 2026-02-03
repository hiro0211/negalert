/**
 * TODO管理関連API
 * タスクの作成・更新・削除
 */

import { Todo } from '../types';
import { CreateTodoInput, UpdateTodoInput } from './types';
import { mockTodos } from '../mock/todos';

/**
 * すべてのTODOを取得
 * 
 * @returns TODO一覧
 */
export async function fetchTodos(): Promise<Todo[]> {
  // 現在: モックデータを返す
  // 将来: Supabaseから取得
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('dueDate', { ascending: true });
  
  if (error) throw error;
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockTodos];
}

/**
 * IDでTODOを取得
 * 
 * @param id - TODO ID
 * @returns TODO（見つからない場合はnull）
 */
export async function fetchTodoById(id: string): Promise<Todo | null> {
  // 現在: モックデータから検索
  // 将来: Supabaseから取得
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockTodos.find(todo => todo.id === id) || null;
}

/**
 * 新しいTODOを作成
 * 
 * @param input - TODO作成データ
 * @returns 作成されたTODO
 */
export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  // 現在: モック実装（IDを生成して返す）
  // 将来: Supabaseに保存
  
  console.log('[Mock] TODOを作成:', input);
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('todos')
    .insert({
      ...input,
      completed: false,
      createdAt: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newTodo: Todo = {
    id: `todo-${Date.now()}`,
    ...input,
    completed: false,
  };
  
  return newTodo;
}

/**
 * TODOを更新
 * 
 * @param id - TODO ID
 * @param updates - 更新内容
 * @returns 更新されたTODO
 */
export async function updateTodo(
  id: string,
  updates: UpdateTodoInput
): Promise<Todo> {
  // 現在: モック実装（元のTODOを返す）
  // 将来: Supabaseを更新
  
  console.log('[Mock] TODOを更新:', { id, updates });
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('todos')
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const todo = await fetchTodoById(id);
  if (!todo) {
    throw new Error('TODOが見つかりません');
  }
  
  return { ...todo, ...updates };
}

/**
 * TODOの完了状態を切り替え
 * 
 * @param id - TODO ID
 * @returns 更新されたTODO
 */
export async function toggleTodoComplete(id: string): Promise<Todo> {
  // 現在: モック実装
  // 将来: Supabaseを更新
  
  console.log('[Mock] TODO完了状態を切り替え:', { id });
  
  const todo = await fetchTodoById(id);
  if (!todo) {
    throw new Error('TODOが見つかりません');
  }
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('todos')
    .update({
      completed: !todo.completed,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...todo, completed: !todo.completed };
}

/**
 * TODOを削除
 * 
 * @param id - TODO ID
 */
export async function deleteTodo(id: string): Promise<void> {
  // 現在: モック実装（何もしない）
  // 将来: Supabaseから削除
  
  console.log('[Mock] TODOを削除:', { id });
  
  // 本番実装例（コメントアウト）
  /*
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  */
  
  await new Promise(resolve => setTimeout(resolve, 300));
}

/**
 * 未完了のTODOを取得
 * 
 * @returns 未完了TODO一覧
 */
export async function fetchPendingTodos(): Promise<Todo[]> {
  // 現在: モックデータをフィルタ
  // 将来: Supabaseでフィルタリング
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('completed', false)
    .order('dueDate', { ascending: true });
  
  if (error) throw error;
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockTodos.filter(todo => !todo.completed);
}

/**
 * 完了済みのTODOを取得
 * 
 * @returns 完了済みTODO一覧
 */
export async function fetchCompletedTodos(): Promise<Todo[]> {
  // 現在: モックデータをフィルタ
  // 将来: Supabaseでフィルタリング
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('completed', true)
    .order('dueDate', { ascending: false });
  
  if (error) throw error;
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockTodos.filter(todo => todo.completed);
}

/**
 * レビューに関連するTODOを取得
 * 
 * @param reviewId - レビューID
 * @returns 関連TODO一覧
 */
export async function fetchTodosByReviewId(reviewId: string): Promise<Todo[]> {
  // 現在: モックデータをフィルタ
  // 将来: Supabaseでフィルタリング
  
  // 本番実装例（コメントアウト）
  /*
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('relatedReviewId', reviewId)
    .order('dueDate', { ascending: true });
  
  if (error) throw error;
  return data;
  */
  
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockTodos.filter(todo => todo.relatedReviewId === reviewId);
}
