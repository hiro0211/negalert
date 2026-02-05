/**
 * Workspace API - エントリーポイント
 * 環境に応じて適切な実装を選択
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '../../supabase/server';
import { Workspace, GoogleLocation } from '../types';
import { ProductionWorkspacesApi } from './production';
import { MockWorkspacesApi } from './mock';

/**
 * モックデータモードかどうかを判定
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * 環境に応じたAPI実装を選択
 */
const workspacesApi = USE_MOCK_DATA ? MockWorkspacesApi : ProductionWorkspacesApi;

/**
 * Google店舗情報をworkspacesテーブルに同期（UPSERT）
 */
export async function syncWorkspaces(
  userId: string,
  locations: GoogleLocation[],
  supabase?: SupabaseClient
): Promise<number> {
  const client = supabase || await createServerClient();
  return workspacesApi.syncWorkspaces(userId, locations, client);
}

/**
 * ユーザーのワークスペース一覧を取得
 */
export async function getWorkspaces(
  userId: string,
  supabase?: SupabaseClient
): Promise<Workspace[]> {
  const client = supabase || await createServerClient();
  return workspacesApi.getWorkspaces(userId, client);
}

/**
 * 特定のワークスペースを取得
 */
export async function getWorkspace(
  workspaceId: string,
  supabase?: SupabaseClient
): Promise<Workspace | null> {
  const client = supabase || await createServerClient();
  return workspacesApi.getWorkspace(workspaceId, client);
}

/**
 * ワークスペースを削除
 */
export async function deleteWorkspace(
  workspaceId: string,
  userId: string,
  supabase?: SupabaseClient
): Promise<void> {
  const client = supabase || await createServerClient();
  return workspacesApi.deleteWorkspace(workspaceId, userId, client);
}

// 既存のコードとの互換性のため、APIオブジェクトもエクスポート
export { workspacesApi };
