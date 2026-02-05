/**
 * Workspace API - モック環境実装
 * 静的なモックデータを返却（将来実装）
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { Workspace, GoogleLocation } from '../types';
import { WorkspacesApi } from './types';

/**
 * モック環境用Workspace API実装
 * 注: 現在はモックデータが未定義のため、エラーをスローする
 */
export const MockWorkspacesApi: WorkspacesApi = {
  async syncWorkspaces(
    _userId: string,
    _locations: GoogleLocation[],
    _supabase: SupabaseClient
  ): Promise<number> {
    // モック実装: 静的なワークスペースデータを返す
    console.log('[Mock] Workspaceの同期');
    throw new Error('Workspace機能はモック環境ではまだ実装されていません');
  },

  async getWorkspaces(_userId: string, _supabase: SupabaseClient): Promise<Workspace[]> {
    // モック実装: 静的なワークスペース一覧を返す
    console.log('[Mock] Workspace一覧を取得');
    throw new Error('Workspace機能はモック環境ではまだ実装されていません');
  },

  async getWorkspace(_workspaceId: string, _supabase: SupabaseClient): Promise<Workspace | null> {
    // モック実装: 静的なワークスペースを返す
    console.log('[Mock] Workspaceを取得');
    throw new Error('Workspace機能はモック環境ではまだ実装されていません');
  },

  async deleteWorkspace(
    _workspaceId: string,
    _userId: string,
    _supabase: SupabaseClient
  ): Promise<void> {
    // モック実装: 何もしない
    console.log('[Mock] Workspaceを削除');
    throw new Error('Workspace機能はモック環境ではまだ実装されていません');
  },
};
