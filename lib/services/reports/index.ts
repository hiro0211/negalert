/**
 * レポート生成サービス - エントリーポイント
 * 環境に応じて適切な実装を選択
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { ProductionReportsService } from './production';
import { MockReportsService } from './mock';
import { GenerateReportResult } from './types';

/**
 * モックデータモードかどうかを判定
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * 環境に応じたサービス実装を選択
 */
const reportsService = USE_MOCK_DATA ? MockReportsService : ProductionReportsService;

/**
 * 週間レポートを生成
 */
export async function generateWeeklyReport(
  userId: string,
  supabase: SupabaseClient
): Promise<GenerateReportResult> {
  return reportsService.generateWeeklyReport(userId, supabase);
}

// 既存のコードとの互換性のため、サービスオブジェクトもエクスポート
export { reportsService };

// 型定義もエクスポート
export type { GenerateReportResult, ReportPeriod, ReviewData } from './types';
