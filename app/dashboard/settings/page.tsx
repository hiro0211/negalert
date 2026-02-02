'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';

export default function SettingsPage() {
  const [ratingThreshold, setRatingThreshold] = useState([3]);
  const [dangerWords, setDangerWords] = useState([
    { id: '1', word: '最悪', addedDate: '2024/05/01' },
    { id: '2', word: '二度と行かない', addedDate: '2024/05/02' },
    { id: '3', word: '態度が悪い', addedDate: '2024/05/03' },
  ]);
  const [newWord, setNewWord] = useState('');

  const handleAddWord = () => {
    if (newWord.trim()) {
      setDangerWords([
        ...dangerWords,
        {
          id: Date.now().toString(),
          word: newWord,
          addedDate: new Date().toLocaleDateString('ja-JP'),
        },
      ]);
      setNewWord('');
    }
  };

  const handleDeleteWord = (id: string) => {
    setDangerWords(dangerWords.filter((w) => w.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">設定</h1>
        <p className="text-gray-700 mt-1">通知とレビュー管理の設定</p>
      </div>

      <Tabs defaultValue="notification" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notification">通知</TabsTrigger>
          <TabsTrigger value="reply">返信設定</TabsTrigger>
          <TabsTrigger value="danger-words">危険語辞書</TabsTrigger>
        </TabsList>

        <TabsContent value="notification">
          <Card>
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>★評価の通知閾値</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={ratingThreshold}
                    onValueChange={setRatingThreshold}
                    max={5}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold w-12">★{ratingThreshold[0]}</span>
                </div>
                <p className="text-sm text-gray-700">
                  この評価以下のレビューが投稿されたときに通知します
                </p>
              </div>

              <div className="space-y-3">
                <Label>通知チャネル</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="slack" defaultChecked />
                    <label htmlFor="slack" className="text-sm font-medium cursor-pointer">
                      Slack通知を有効にする
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" defaultChecked />
                    <label htmlFor="email" className="text-sm font-medium cursor-pointer">
                      Email通知を有効にする
                    </label>
                  </div>
                </div>
              </div>

              <Button>設定を保存</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reply">
          <Card>
            <CardHeader>
              <CardTitle>返信設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>デフォルトの返信トーン</Label>
                <RadioGroup defaultValue="polite">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="polite" id="polite" />
                    <label htmlFor="polite" className="cursor-pointer">丁寧</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="casual" />
                    <label htmlFor="casual" className="cursor-pointer">カジュアル</label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="signature">署名テンプレート</Label>
                <Textarea
                  id="signature"
                  placeholder="返信の末尾に追加される署名"
                  defaultValue="カフェ＆レストラン 桜&#10;店長 山田太郎"
                  rows={4}
                />
              </div>

              <Button>設定を保存</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger-words">
          <Card>
            <CardHeader>
              <CardTitle>危険語辞書</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700">
                レビューに含まれるとリスクが高いと判定される単語を管理します
              </p>

              <div className="flex gap-2">
                <Input
                  placeholder="危険語を入力"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                />
                <Button onClick={handleAddWord}>
                  <Plus className="h-4 w-4 mr-2" />
                  追加
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>単語</TableHead>
                    <TableHead>追加日</TableHead>
                    <TableHead className="w-[100px] text-right">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dangerWords.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell>{word.word}</TableCell>
                      <TableCell>{word.addedDate}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWord(word.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
