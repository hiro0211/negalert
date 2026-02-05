/**
 * レポート生成サービス共通型定義
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { WeeklyReportResult } from '../ai';

/**
 * レビューデータ型（簡易版）
 */
export interface ReviewData {
  id: string;
  comment: string;
  rating: number;
  review_created_at: string;
  author_name: string;
}

/**
 * レポート期間型
 */
export interface ReportPeriod {
  startDate: Date;
  endDate: Date;
}

/**
 * レポート生成結果型
 */
export interface GenerateReportResult {
  report: WeeklyReportResult;
  period: ReportPeriod;
  reviewCount: number;
}

/**
 * レポート生成サービスの共通インターフェース
 */
export interface ReportsService {
  /**
   * 週間レポートを生成
   */
  generateWeeklyReport(userId: string, supabase: SupabaseClient): Promise<GenerateReportResult>;
}
