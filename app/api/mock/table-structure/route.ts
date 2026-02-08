/**
 * モック用: oauth_tokensテーブルの構造を確認
 * モックモード（USE_MOCK_DATA=true）でのみ動作
 * 
 * セキュリティ注意: このエンドポイントは開発環境専用です
 * 本番環境では絶対に使用しないでください（スキーマ情報の漏洩リスク）
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logError, createSafeError } from '@/lib/utils/error-handler';

export async function GET() {
  try {
    // モックモードチェック（サーバーサイド専用の環境変数を優先）
    const isMockMode = process.env.USE_MOCK_DATA === 'true' || 
                       process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
    
    if (!isMockMode) {
      return NextResponse.json(
        { error: 'このエンドポイントはモックモード専用です' },
        { status: 403 }
      );
    }
    
    // 本番環境では完全にブロック（スキーマ情報の漏洩防止）
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: '本番環境ではこのエンドポイントは使用できません' },
        { status: 403 }
      );
    }

    const supabase = await createClient();
    
    // テーブル構造を確認
    const { data, error } = await supabase.rpc('get_table_columns', {
      table_name: 'oauth_tokens'
    });
    
    if (error) {
      // RPCが存在しない場合は、直接クエリ
      const { data: tableData, error: tableError } = await supabase
        .from('oauth_tokens')
        .select('*')
        .limit(1);
      
      if (tableError) {
        return NextResponse.json({
          error: tableError.message,
          code: tableError.code,
          details: tableError.details,
        }, { status: 500 });
      }
      
      return NextResponse.json({
        message: 'テーブルは存在します',
        sampleData: tableData,
        columns: tableData && tableData.length > 0 ? Object.keys(tableData[0]) : [],
      });
    }
    
    return NextResponse.json({
      columns: data,
    });
  } catch (err) {
    logError('table-structure', err);
    const safeError = createSafeError(err, 'テーブル構造の取得に失敗しました');
    return NextResponse.json({
      error: safeError.message,
    }, { status: 500 });
  }
}
