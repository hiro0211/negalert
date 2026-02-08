import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/reply-styles
 * ワークスペースの返信スタイル一覧を取得
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // ワークスペースID取得
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: 'ワークスペースが見つかりません' },
        { status: 404 }
      );
    }

    // 返信スタイル一覧を取得
    const { data: styles, error: stylesError } = await supabase
      .from('reply_styles')
      .select('*')
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false });

    if (stylesError) {
      console.error('返信スタイル取得エラー:', stylesError);
      return NextResponse.json(
        { error: '返信スタイルの取得に失敗しました' },
        { status: 500 }
      );
    }

    // キャメルケースに変換
    const formattedStyles = (styles || []).map(style => ({
      id: style.id,
      workspaceId: style.workspace_id,
      name: style.name,
      description: style.description,
      exampleReplies: style.example_replies,
      requiredElements: style.required_elements || {},
      isDefault: style.is_default,
      createdBy: style.created_by,
      createdAt: style.created_at,
      updatedAt: style.updated_at,
    }));

    return NextResponse.json(formattedStyles);
  } catch (error) {
    console.error('返信スタイルAPI エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reply-styles
 * 新規返信スタイルを作成
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // ワークスペースID取得
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: 'ワークスペースが見つかりません' },
        { status: 404 }
      );
    }

    // リクエストボディ取得
    const body = await request.json();
    const { name, description, exampleReplies, requiredElements, isDefault } = body;

    // バリデーション
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'スタイル名は必須です' },
        { status: 400 }
      );
    }

    if (!exampleReplies || !Array.isArray(exampleReplies) || exampleReplies.length < 1) {
      return NextResponse.json(
        { error: '参考返信文は最低1件必要です' },
        { status: 400 }
      );
    }

    // デフォルトスタイルに設定する場合、既存のデフォルトを解除
    if (isDefault) {
      await supabase
        .from('reply_styles')
        .update({ is_default: false })
        .eq('workspace_id', workspace.id)
        .eq('is_default', true);
    }

    // 返信スタイルを作成
    const { data: newStyle, error: createError } = await supabase
      .from('reply_styles')
      .insert({
        workspace_id: workspace.id,
        name: name.trim(),
        description: description?.trim() || null,
        example_replies: exampleReplies,
        required_elements: requiredElements || {},
        is_default: isDefault || false,
        created_by: user.id,
      })
      .select()
      .single();

    if (createError) {
      console.error('返信スタイル作成エラー:', createError);
      
      if (createError.code === '23505') { // UNIQUE制約違反
        return NextResponse.json(
          { error: '同じ名前のスタイルが既に存在します' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: '返信スタイルの作成に失敗しました' },
        { status: 500 }
      );
    }

    // キャメルケースに変換して返却
    const formattedStyle = {
      id: newStyle.id,
      workspaceId: newStyle.workspace_id,
      name: newStyle.name,
      description: newStyle.description,
      exampleReplies: newStyle.example_replies,
      requiredElements: newStyle.required_elements,
      isDefault: newStyle.is_default,
      createdBy: newStyle.created_by,
      createdAt: newStyle.created_at,
      updatedAt: newStyle.updated_at,
    };

    return NextResponse.json(formattedStyle, { status: 201 });
  } catch (error) {
    console.error('返信スタイル作成API エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
