/**
 * Workspace API共通型定義
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { Workspace, GoogleLocation } from '../types';

/**
 * Workspace APIの共通インターフェース
 * モック実装と本番実装の両方がこのインターフェースに準拠する
 */
export interface WorkspacesApi {
  /**
   * Google店舗情報をworkspacesテーブルに同期（UPSERT）
   */
  syncWorkspaces(
    userId: string,
    locations: GoogleLocation[],
    supabase: SupabaseClient
  ): Promise<number>;

  /**
   * ユーザーのワークスペース一覧を取得
   */
  getWorkspaces(userId: string, supabase: SupabaseClient): Promise<Workspace[]>;

  /**
   * 特定のワークスペースを取得
   */
  getWorkspace(workspaceId: string, supabase: SupabaseClient): Promise<Workspace | null>;

  /**
   * ワークスペースを削除
   */
  deleteWorkspace(
    workspaceId: string,
    userId: string,
    supabase: SupabaseClient
  ): Promise<void>;
}
