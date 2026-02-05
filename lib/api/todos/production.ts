/**
 * TODO API - 本番環境実装
 * Supabaseからデータを取得（将来実装）
 */

import { Todo } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { CreateTodoInput, UpdateTodoInput } from '../types';
import { TodosApi } from './types';

/**
 * 本番環境用TODO API実装
 * 注: 現在はSupabaseにtodosテーブルが存在しないため、エラーをスローする
 */
export const ProductionTodosApi: TodosApi = {
  async fetchTodos(_supabase: SupabaseClient): Promise<Todo[]> {
    // 本番実装: Supabaseからtodosテーブルを取得
    // const { data, error } = await supabase
    //   .from('todos')
    //   .select('*')
    //   .order('dueDate', { ascending: true });
    // 
    // if (error) throw new Error(`TODOの取得に失敗しました: ${error.message}`);
    // return data || [];

    throw new Error('TODO機能は本番環境ではまだ実装されていません');
  },

  async fetchTodoById(_id: string, _supabase: SupabaseClient): Promise<Todo | null> {
    // 本番実装: Supabaseからtodoを取得
    // const { data, error } = await supabase
    //   .from('todos')
    //   .select('*')
    //   .eq('id', id)
    //   .single();
    // 
    // if (error) {
    //   if (error.code === 'PGRST116') return null;
    //   throw new Error(`TODOの取得に失敗しました: ${error.message}`);
    // }
    // 
    // return data;

    throw new Error('TODO機能は本番環境ではまだ実装されていません');
  },

  async createTodo(_input: CreateTodoInput, _supabase: SupabaseClient): Promise<Todo> {
    // 本番実装: Supabaseにtodoを作成
    // const { data, error } = await supabase
    //   .from('todos')
    //   .insert({
    //     ...input,
    //     completed: false,
    //     created_at: new Date().toISOString(),
    //   })
    //   .select()
    //   .single();
    // 
    // if (error) throw new Error(`TODOの作成に失敗しました: ${error.message}`);
    // return data;

    throw new Error('TODO機能は本番環境ではまだ実装されていません');
  },

  async updateTodo(_id: string, _updates: UpdateTodoInput, _supabase: SupabaseClient): Promise<Todo> {
    // 本番実装: Supabaseでtodoを更新
    // const { data, error } = await supabase
    //   .from('todos')
    //   .update({
    //     ...updates,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('id', id)
    //   .select()
    //   .single();
    // 
    // if (error) throw new Error(`TODOの更新に失敗しました: ${error.message}`);
    // return data;

    throw new Error('TODO機能は本番環境ではまだ実装されていません');
  },

  async toggleTodoComplete(_id: string, _supabase: SupabaseClient): Promise<Todo> {
    // 本番実装: 完了状態を切り替え
    // const todo = await this.fetchTodoById(id, supabase);
    // if (!todo) throw new Error('TODOが見つかりません');
    // 
    // const { data, error } = await supabase
    //   .from('todos')
    //   .update({
    //     completed: !todo.completed,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('id', id)
    //   .select()
    //   .single();
    // 
    // if (error) throw new Error(`TODOの更新に失敗しました: ${error.message}`);
    // return data;

    throw new Error('TODO機能は本番環境ではまだ実装されていません');
  },

  async deleteTodo(_id: string, _supabase: SupabaseClient): Promise<void> {
    // 本番実装: Supabaseからtodoを削除
    // const { error } = await supabase
    //   .from('todos')
    //   .delete()
    //   .eq('id', id);
    // 
    // if (error) throw new Error(`TODOの削除に失敗しました: ${error.message}`);

    throw new Error('TODO機能は本番環境ではまだ実装されていません');
  },

  async fetchPendingTodos(_supabase: SupabaseClient): Promise<Todo[]> {
    // 本番実装: 未完了のtodoを取得
    // const { data, error } = await supabase
    //   .from('todos')
    //   .select('*')
    //   .eq('completed', false)
    //   .order('dueDate', { ascending: true });
    // 
    // if (error) throw new Error(`未完了TODOの取得に失敗しました: ${error.message}`);
    // return data || [];

    throw new Error('TODO機能は本番環境ではまだ実装されていません');
  },

  async fetchCompletedTodos(_supabase: SupabaseClient): Promise<Todo[]> {
    // 本番実装: 完了済みのtodoを取得
    // const { data, error } = await supabase
    //   .from('todos')
    //   .select('*')
    //   .eq('completed', true)
    //   .order('dueDate', { ascending: false });
    // 
    // if (error) throw new Error(`完了済みTODOの取得に失敗しました: ${error.message}`);
    // return data || [];

    throw new Error('TODO機能は本番環境ではまだ実装されていません');
  },

  async fetchTodosByReviewId(_reviewId: string, _supabase: SupabaseClient): Promise<Todo[]> {
    // 本番実装: レビューに関連するtodoを取得
    // const { data, error } = await supabase
    //   .from('todos')
    //   .select('*')
    //   .eq('relatedReviewId', reviewId)
    //   .order('dueDate', { ascending: true });
    // 
    // if (error) throw new Error(`関連TODOの取得に失敗しました: ${error.message}`);
    // return data || [];

    throw new Error('TODO機能は本番環境ではまだ実装されていません');
  },
};
