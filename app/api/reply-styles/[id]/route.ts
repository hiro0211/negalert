import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/reply-styles/[id]
 * 特定の返信スタイルを取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // 返信スタイルを取得（RLSポリシーで自動的にワークスペースフィルタ）
    const { data: style, error: styleError } = await supabase
      .from('reply_styles')
      .select('*')
      .eq('id', id)
      .single();

    if (styleError || !style) {
      return NextResponse.json(
        { error: '返信スタイルが見つかりません' },
        { status: 404 }
      );
    }

    // キャメルケースに変換
    const formattedStyle = {
      id: style.id,
      workspaceId: style.workspace_id,
      name: style.name,
      description: style.description,
      exampleReplies: style.example_replies,
      requiredElements: style.required_elements || {},
      tone: style.tone,
      isDefault: style.is_default,
      createdBy: style.created_by,
      createdAt: style.created_at,
      updatedAt: style.updated_at,
    };

    return NextResponse.json(formattedStyle);
  } catch (error) {
    console.error('返信スタイル取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/reply-styles/[id]
 * 返信スタイルを更新
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // リクエストボディ取得
    const body = await request.json();
    const { name, description, exampleReplies, requiredElements, tone, isDefault } = body;

    // バリデーション
    if (name !== undefined && (!name || !name.trim())) {
      return NextResponse.json(
        { error: 'スタイル名は必須です' },
        { status: 400 }
      );
    }

    if (exampleReplies !== undefined && (!Array.isArray(exampleReplies) || exampleReplies.length < 1)) {
      return NextResponse.json(
        { error: '参考返信文は最低1件必要です' },
        { status: 400 }
      );
    }

    // デフォルトスタイルに設定する場合、既存のデフォルトを解除
    if (isDefault) {
      // まず現在のスタイルのworkspace_idを取得
      const { data: currentStyle } = await supabase
        .from('reply_styles')
        .select('workspace_id')
        .eq('id', id)
        .single();

      if (currentStyle) {
        await supabase
          .from('reply_styles')
          .update({ is_default: false })
          .eq('workspace_id', currentStyle.workspace_id)
          .eq('is_default', true)
          .neq('id', id);
      }
    }

    // 更新データを準備
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (exampleReplies !== undefined) updateData.example_replies = exampleReplies;
    if (requiredElements !== undefined) updateData.required_elements = requiredElements;
    if (tone !== undefined) updateData.tone = tone;
    if (isDefault !== undefined) updateData.is_default = isDefault;

    // 返信スタイルを更新
    const { data: updatedStyle, error: updateError } = await supabase
      .from('reply_styles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('返信スタイル更新エラー:', updateError);
      
      if (updateError.code === '23505') {
        return NextResponse.json(
          { error: '同じ名前のスタイルが既に存在します' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: '返信スタイルの更新に失敗しました' },
        { status: 500 }
      );
    }

    // キャメルケースに変換して返却
    const formattedStyle = {
      id: updatedStyle.id,
      workspaceId: updatedStyle.workspace_id,
      name: updatedStyle.name,
      description: updatedStyle.description,
      exampleReplies: updatedStyle.example_replies,
      requiredElements: updatedStyle.required_elements,
      tone: updatedStyle.tone,
      isDefault: updatedStyle.is_default,
      createdBy: updatedStyle.created_by,
      createdAt: updatedStyle.created_at,
      updatedAt: updatedStyle.updated_at,
    };

    return NextResponse.json(formattedStyle);
  } catch (error) {
    console.error('返信スタイル更新エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reply-styles/[id]
 * 返信スタイルを削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // 返信スタイルを削除
    const { error: deleteError } = await supabase
      .from('reply_styles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('返信スタイル削除エラー:', deleteError);
      return NextResponse.json(
        { error: '返信スタイルの削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('返信スタイル削除エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
