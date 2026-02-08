'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star } from 'lucide-react';
import { ReplyStyle } from '@/lib/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ReplyStyleCardProps {
  style: ReplyStyle;
  onEdit: (style: ReplyStyle) => void;
  onDelete: (id: string) => void;
}

export function ReplyStyleCard({ style, onEdit, onDelete }: ReplyStyleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg text-gray-700">{style.name}</span>
            {style.isDefault && (
              <Badge className="bg-blue-500">
                <Star className="mr-1 h-3 w-3" />
                デフォルト
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(style)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(style.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {style.description && (
          <p className="text-sm text-gray-600">{style.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">参考返信文:</span>
            <Badge className="text-gray-600" variant="outline">{style.exampleReplies.length}件</Badge>
          </div>
          
          {style.tone && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">トーン:</span>
              <Badge className="text-gray-600" variant="outline">
                {style.tone === 'friendly' && 'フレンドリー'}
                {style.tone === 'professional' && 'プロフェッショナル'}
                {style.tone === 'casual' && 'カジュアル'}
              </Badge>
            </div>
          )}
          
          {Object.keys(style.requiredElements).length > 0 && (
            <div className="text-sm">
              <span className="text-gray-600">必須要素:</span>
              <div className="mt-1 flex flex-wrap gap-1 text-gray-600">
                {Object.keys(style.requiredElements).map((key) => (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 pt-2 border-t">
          作成日: {format(new Date(style.createdAt), 'yyyy年M月d日', { locale: ja })}
        </div>
      </CardContent>
    </Card>
  );
}
