'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorMessage } from '@/components/common/error-message';
import { ReplyStyleCard } from '@/components/settings/reply-style-card';
import { ReplyStyleForm } from '@/components/settings/reply-style-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Sparkles } from 'lucide-react';
import { useReplyStyles } from '@/lib/hooks/useReplyStyles';
import { useToast } from '@/lib/hooks/useToast';
import { ReplyStyle } from '@/lib/types';

export default function ReplyStylesPage() {
  const { replyStyles, loading, error, createStyle, updateStyle, deleteStyle, refetch } = useReplyStyles();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingStyle, setEditingStyle] = useState<ReplyStyle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStyleId, setDeletingStyleId] = useState<string | null>(null);

  const handleCreateClick = () => {
    setFormMode('create');
    setEditingStyle(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (style: ReplyStyle) => {
    setFormMode('edit');
    setEditingStyle(style);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingStyleId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingStyleId) return;

    try {
      await deleteStyle(deletingStyleId);
      toast({
        title: "✓ 削除しました",
        description: "返信スタイルを削除しました",
      });
    } catch (err) {
      toast({
        title: "エラー",
        description: err instanceof Error ? err.message : '削除に失敗しました',
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingStyleId(null);
    }
  };

  const handleFormSubmit = async (styleData: Partial<ReplyStyle>) => {
    if (formMode === 'create') {
      // 型変換: undefined を除外
      const createData = {
        name: styleData.name!,
        description: styleData.description ?? null,
        exampleReplies: styleData.exampleReplies!,
        requiredElements: styleData.requiredElements!,
        isDefault: styleData.isDefault!,
      };
      await createStyle(createData);
    } else if (editingStyle) {
      await updateStyle(editingStyle.id, styleData);
    }
  };

  // ローディング状態
  if (loading) {
    return <LoadingSpinner text="返信スタイルを読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">返信スタイル管理</h1>
          <p className="text-gray-600 mt-1">
            ワークスペース全体で使用するカスタム返信スタイルを管理します
          </p>
        </div>
        <Button onClick={handleCreateClick} className="gap-2 text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          新しいスタイルを作成
        </Button>
      </div>

      {/* 説明セクション */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">カスタム返信スタイルとは？</h3>
            <p className="text-sm text-gray-700">
              あなたの店舗の「声」をAIに学習させる機能です。過去の返信文を登録すると、
              AIが同じトーン・構造・表現を使って新しい返信案を自動生成します。
              複数のスタイルを作成し、レビューごとに使い分けることもできます。
            </p>
          </div>
        </div>
      </div>

      {/* スタイル一覧 */}
      {replyStyles.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            まだスタイルが登録されていません
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            最初のカスタムスタイルを作成して、AIに学習させましょう
          </p>
          <Button onClick={handleCreateClick} className="gap-2">
            <Plus className="h-4 w-4" />
            新しいスタイルを作成
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {replyStyles.map((style) => (
            <ReplyStyleCard
              key={style.id}
              style={style}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* スタイル作成/編集フォーム */}
      <ReplyStyleForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingStyle}
        mode={formMode}
      />

      {/* 削除確認ダイアログ */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>スタイルを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。削除してもよろしいですか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
