'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InlineLoadingSpinner } from '@/components/common/loading-spinner';
import { Copy, Save, Send, Sparkles, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Review } from '@/lib/types';
import { saveReplyDraft, updateReviewReply, deleteReviewReply } from '@/lib/api/reviews';

interface ReplyEditorProps {
  review: Review;
  onReplyUpdated?: () => void; // 返信更新後のコールバック
}

const toneSamples = {
  polite: '大変申し訳ございませんでした。貴重なご意見をいただき、誠にありがとうございます。',
  casual: 'ご指摘ありがとうございます！改善に向けて取り組んでいきます。',
  apology: 'この度はご不快な思いをさせてしまい、心よりお詫び申し上げます。',
};

export function ReplyEditor({ review, onReplyUpdated }: ReplyEditorProps) {
  const [replyText, setReplyText] = useState(review.replyDraft || review.reply || '');
  const [selectedTone, setSelectedTone] = useState<keyof typeof toneSamples>('polite');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hasExistingReply = !!review.reply;

  const handleCopy = () => {
    navigator.clipboard.writeText(replyText);
    alert('返信案をコピーしました');
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // API層を経由して下書きを保存
      await saveReplyDraft(review.id, replyText);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('下書き保存エラー:', error);
      alert('下書きの保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!replyText.trim()) {
      setError('返信内容を入力してください');
      return;
    }

    const confirmMessage = hasExistingReply
      ? 'この返信を更新してもよろしいですか？'
      : 'この返信を公開してもよろしいですか？';

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setIsPublishing(true);
      setError(null);
      setSuccess(null);
      
      await updateReviewReply(review.id, replyText);
      
      setSuccess(hasExistingReply ? '返信を更新しました' : '返信を公開しました');
      
      // 親コンポーネントに通知
      if (onReplyUpdated) {
        onReplyUpdated();
      }
      
      // 2秒後にページをリロード
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('返信投稿エラー:', err);
      setError(err instanceof Error ? err.message : '返信の投稿に失敗しました');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!hasExistingReply) {
      return;
    }

    if (!confirm('この返信を削除してもよろしいですか？削除すると元に戻せません。')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      setSuccess(null);
      
      await deleteReviewReply(review.id);
      
      setSuccess('返信を削除しました');
      setReplyText('');
      
      // 親コンポーネントに通知
      if (onReplyUpdated) {
        onReplyUpdated();
      }
      
      // 2秒後にページをリロード
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('返信削除エラー:', err);
      setError(err instanceof Error ? err.message : '返信の削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToneChange = (tone: keyof typeof toneSamples) => {
    setSelectedTone(tone);
    // 簡易的なトーン変更デモ
    setReplyText(toneSamples[tone] + '\n\n' + replyText.split('\n\n').slice(1).join('\n\n'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {hasExistingReply ? '返信を編集' : '返信案'}
          </span>
          <div className="flex gap-2">
            <Badge
              variant={selectedTone === 'polite' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleToneChange('polite')}
            >
              丁寧
            </Badge>
            <Badge
              variant={selectedTone === 'casual' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleToneChange('casual')}
            >
              カジュアル
            </Badge>
            <Badge
              variant={selectedTone === 'apology' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleToneChange('apology')}
            >
              謝罪
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* エラー表示 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 成功表示 */}
        {success && (
          <Alert className="border-green-500 bg-green-50 text-green-900">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* 既存の返信がある場合の警告 */}
        {hasExistingReply && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              この返信は既にGoogleに公開されています。編集すると上書きされます。
            </AlertDescription>
          </Alert>
        )}

        <Textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="返信を入力してください..."
          className="min-h-[200px]"
          disabled={isPublishing || isDeleting}
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex-1"
            disabled={isSaving || isPublishing || isDeleting}
          >
            <Copy className="mr-2 h-4 w-4" />
            コピー
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            className="flex-1"
            disabled={isSaving || isPublishing || isDeleting}
          >
            {isSaving ? (
              <>
                <InlineLoadingSpinner className="mr-2" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isSaved ? '保存済み' : '下書き保存'}
              </>
            )}
          </Button>
          <Button
            onClick={handlePublish}
            className="flex-1"
            disabled={isSaving || isPublishing || isDeleting}
          >
            {isPublishing ? (
              <>
                <InlineLoadingSpinner className="mr-2" />
                {hasExistingReply ? '更新中...' : '公開中...'}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {hasExistingReply ? '更新' : '公開'}
              </>
            )}
          </Button>
          {hasExistingReply && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving || isPublishing || isDeleting}
            >
              {isDeleting ? (
                <>
                  <InlineLoadingSpinner className="mr-2" />
                  削除中...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  削除
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
