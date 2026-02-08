'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InlineLoadingSpinner } from '@/components/common/loading-spinner';
import { Plus, X } from 'lucide-react';
import { ReplyStyle } from '@/lib/types';
import { useToast } from '@/lib/hooks/useToast';

interface ReplyStyleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (style: Partial<ReplyStyle>) => Promise<void>;
  initialData?: ReplyStyle | null;
  mode: 'create' | 'edit';
}

export function ReplyStyleForm({ open, onOpenChange, onSubmit, initialData, mode }: ReplyStyleFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [exampleReplies, setExampleReplies] = useState<string[]>(
    initialData?.exampleReplies || ['']
  );
  const [requiredElements, setRequiredElements] = useState<Array<{ key: string; value: string }>>(
    initialData?.requiredElements 
      ? Object.entries(initialData.requiredElements).map(([key, value]) => ({ key, value }))
      : [{ key: '店舗名', value: '' }, { key: '担当者名', value: '' }]
  );
  const [tone, setTone] = useState(initialData?.tone || 'friendly');
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddExample = () => {
    setExampleReplies([...exampleReplies, '']);
  };

  const handleRemoveExample = (index: number) => {
    if (exampleReplies.length > 1) {
      setExampleReplies(exampleReplies.filter((_, i) => i !== index));
    }
  };

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...exampleReplies];
    newExamples[index] = value;
    setExampleReplies(newExamples);
  };

  const handleAddElement = () => {
    setRequiredElements([...requiredElements, { key: '', value: '' }]);
  };

  const handleRemoveElement = (index: number) => {
    setRequiredElements(requiredElements.filter((_, i) => i !== index));
  };

  const handleElementChange = (index: number, field: 'key' | 'value', value: string) => {
    const newElements = [...requiredElements];
    newElements[index][field] = value;
    setRequiredElements(newElements);
  };

  const handleSubmit = async () => {
    // バリデーション
    if (!name.trim()) {
      toast({
        title: "エラー",
        description: "スタイル名を入力してください",
        variant: "destructive",
      });
      return;
    }

    const validExamples = exampleReplies.filter(e => e.trim());
    if (validExamples.length < 1) {
      toast({
        title: "エラー",
        description: "参考返信文を最低1件入力してください",
        variant: "destructive",
      });
      return;
    }

    // 必須要素をオブジェクトに変換
    const elementsObject: Record<string, string> = {};
    requiredElements.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) {
        elementsObject[key.trim()] = value.trim();
      }
    });

    try {
      setIsSaving(true);
      
      await onSubmit({
        name: name.trim(),
        description: description.trim() || null,
        exampleReplies: validExamples,
        requiredElements: elementsObject,
        tone,
        isDefault,
      });

      toast({
        title: "✓ 保存しました",
        description: mode === 'create' ? '新しいスタイルを作成しました' : 'スタイルを更新しました',
      });

      onOpenChange(false);
      
      // フォームをリセット
      setName('');
      setDescription('');
      setExampleReplies(['']);
      setRequiredElements([{ key: '店舗名', value: '' }, { key: '担当者名', value: '' }]);
      setTone('friendly');
      setIsDefault(false);
    } catch (err) {
      console.error('スタイル保存エラー:', err);
      toast({
        title: "エラー",
        description: err instanceof Error ? err.message : 'スタイルの保存に失敗しました',
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-800">
            {mode === 'create' ? 'カスタム返信スタイルを作成' : '返信スタイルを編集'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* スタイル名 */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">スタイル名 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 眉毛サロン標準"
              disabled={isSaving}
              className="text-gray-700 bg-white border-gray-300"
            />
          </div>

          {/* 説明 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">説明（任意）</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="このスタイルの用途や特徴を説明してください"
              className="min-h-[60px] text-gray-700 bg-white border-gray-300"
              disabled={isSaving}
            />
          </div>

          {/* 参考返信文 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700">参考返信文（3-5件推奨） *</Label>
              <span className="text-xs text-gray-500">{exampleReplies.filter(e => e.trim()).length}件</span>
            </div>
            <p className="text-sm text-gray-600">
              実際にあなたが書いた返信文を貼り付けてください。AIがこのスタイルを学習します。
            </p>
            <div className="space-y-3">
              {exampleReplies.map((example, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-700">例 {index + 1}</Label>
                    {exampleReplies.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveExample(index)}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={example}
                    onChange={(e) => handleExampleChange(index, e.target.value)}
                    placeholder="実際の返信文を貼り付けてください..."
                    className="min-h-[120px] text-gray-700 bg-white border-gray-300"
                    disabled={isSaving}
                  />
                </div>
              ))}
              {exampleReplies.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddExample}
                  disabled={isSaving}
                  className="w-full text-white border-gray-300 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  例を追加
                </Button>
              )}
            </div>
          </div>

          {/* 必須要素 */}
          <div className="space-y-2">
            <Label className="text-gray-700">必ず含める要素</Label>
            <p className="text-sm text-gray-600">
              返信に必ず含める情報（店舗名、担当者名など）を設定してください。
            </p>
            <div className="space-y-3">
              {requiredElements.map((element, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={element.key}
                    onChange={(e) => handleElementChange(index, 'key', e.target.value)}
                    placeholder="要素名（例: 店舗名）"
                    className="flex-1 text-gray-700 bg-white border-gray-300"
                    disabled={isSaving}
                  />
                  <Input
                    value={element.value}
                    onChange={(e) => handleElementChange(index, 'value', e.target.value)}
                    placeholder="例: 眉毛ファクトリー横浜店"
                    className="flex-1 text-gray-700 bg-white border-gray-300"
                    disabled={isSaving}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveElement(index)}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddElement}
                disabled={isSaving}
                className="w-full text-white border-gray-300 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                要素を追加
              </Button>
            </div>
          </div>

          {/* トーン選択 */}
          <div className="space-y-2">
            <Label htmlFor="tone" className="text-gray-700">トーン</Label>
            <Select value={tone} onValueChange={setTone} disabled={isSaving}>
              <SelectTrigger id="tone" className="text-gray-700 bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="friendly" className="text-gray-700">フレンドリー</SelectItem>
                <SelectItem value="professional" className="text-gray-700">プロフェッショナル</SelectItem>
                <SelectItem value="casual" className="text-gray-700">カジュアル</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* デフォルト設定 */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              disabled={isSaving}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isDefault" className="font-normal text-gray-700">
              このスタイルをデフォルトにする
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="text-gray-700 border-gray-300"
          >
            キャンセル
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving} className="text-white bg-blue-600 hover:bg-blue-700">
            {isSaving ? (
              <>
                <InlineLoadingSpinner className="mr-2" />
                保存中...
              </>
            ) : (
              mode === 'create' ? '作成' : '更新'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
