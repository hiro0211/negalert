/**
 * モック用: oauth_tokensテーブルの構造を確認
 * モックモード（NEXT_PUBLIC_USE_MOCK_DATA=true）でのみ動作
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // モックモードチェック
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'true') {
      return NextResponse.json(
        { error: 'このエンドポイントはモックモード専用です' },
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
    return NextResponse.json({
      error: String(err),
    }, { status: 500 });
  }
}
