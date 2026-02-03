'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { InlineLoadingSpinner } from '@/components/common/loading-spinner';
import { Copy, Save, Send, Sparkles } from 'lucide-react';
import { Review } from '@/lib/types';
import { saveReplyDraft, updateReviewReply } from '@/lib/api/reviews';

interface ReplyEditorProps {
  review: Review;
}

const toneSamples = {
  polite: '大変申し訳ございませんでした。貴重なご意見をいただき、誠にありがとうございます。',
  casual: 'ご指摘ありがとうございます！改善に向けて取り組んでいきます。',
  apology: 'この度はご不快な思いをさせてしまい、心よりお詫び申し上げます。',
};

export function ReplyEditor({ review }: ReplyEditorProps) {
  const [replyText, setReplyText] = useState(review.replyDraft || review.reply || '');
  const [selectedTone, setSelectedTone] = useState<keyof typeof toneSamples>('polite');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
      alert('返信内容を入力してください');
      return;
    }

    if (!confirm('この返信を公開してもよろしいですか?')) {
      return;
    }

    try {
      setIsPublishing(true);
      // API層を経由して返信を投稿
      await updateReviewReply(review.id, replyText);
      alert('返信を公開しました');
      // ページをリロードして最新の状態を反映
      window.location.reload();
    } catch (error) {
      console.error('返信公開エラー:', error);
      alert('返信の公開に失敗しました');
    } finally {
      setIsPublishing(false);
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
            返信案
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
        <Textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="返信を入力してください..."
          className="min-h-[200px]"
          disabled={isPublishing}
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex-1"
            disabled={isSaving || isPublishing}
          >
            <Copy className="mr-2 h-4 w-4" />
            コピー
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            className="flex-1"
            disabled={isSaving || isPublishing}
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
            disabled={isSaving || isPublishing}
          >
            {isPublishing ? (
              <>
                <InlineLoadingSpinner className="mr-2" />
                公開中...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                公開
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
