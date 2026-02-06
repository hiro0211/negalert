/**
 * Workspace API - モック環境実装
 * 完全な静的モックデータを使用（Supabase不要）
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { Workspace, GoogleLocation } from '../types';
import { WorkspacesApi } from './types';
import {
  mockWorkspaces,
  mockLocations,
  getMockWorkspacesByUser,
  getMockWorkspaceById,
} from '@/lib/data/mock-data';

/**
 * モック環境用Workspace API実装
 * 注: 完全な静的データを返します（Google OAuth審査デモ用）
 */
export const MockWorkspacesApi: WorkspacesApi = {
  async syncWorkspaces(
    userId: string,
    locations: GoogleLocation[],
    _supabase: SupabaseClient
  ): Promise<number> {
    // モックモードでは同期処理をスキップ
    console.log('[Mock] Workspace同期をスキップ:', { userId, locationsCount: locations.length });
    return locations.length;
  },

  async getWorkspaces(userId: string, _supabase: SupabaseClient): Promise<Workspace[]> {
    // モックワークスペースを返す
    return getMockWorkspacesByUser(userId);
  },

  async getWorkspace(workspaceId: string, _supabase: SupabaseClient): Promise<Workspace | null> {
    return getMockWorkspaceById(workspaceId) || null;
  },

  async deleteWorkspace(
    workspaceId: string,
    userId: string,
    _supabase: SupabaseClient
  ): Promise<void> {
    // モックモードでは削除処理をスキップ
    console.log('[Mock] Workspace削除をスキップ:', { workspaceId, userId });
  },
};
