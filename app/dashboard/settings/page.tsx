'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Download, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsPage() {
  const router = useRouter();
  
  // モックモードの状態管理（LocalStorageと連携）
  const [isMockMode, setIsMockMode] = useState(false);
  
  const [ratingThreshold, setRatingThreshold] = useState([3]);
  const [dangerWords, setDangerWords] = useState([
    { id: '1', word: '最悪', addedDate: '2026/05/01' },
    { id: '2', word: '二度と行かない', addedDate: '2026/05/02' },
    { id: '3', word: '態度が悪い', addedDate: '2026/05/03' },
  ]);
  const [newWord, setNewWord] = useState('');
  
  // テストデータインポート用の状態
  const [placeId, setPlaceId] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    count?: number;
  }>({ type: null, message: '' });

  // LocalStorageからモックモード設定を読み込み
  useEffect(() => {
    const saved = localStorage.getItem('mockMode');
    if (saved) {
      setIsMockMode(saved === 'true');
    }
  }, []);

  // モックモードの切り替えハンドラ
  const handleMockModeToggle = (checked: boolean) => {
    setIsMockMode(checked);
    localStorage.setItem('mockMode', String(checked));
  };

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

  const handleImportReviews = async () => {
    if (!placeId.trim()) {
      setImportStatus({
        type: 'error',
        message: 'Place IDを入力してください',
      });
      return;
    }

    setIsImporting(true);
    setImportStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/mock/import-place-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ placeId: placeId.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        let message = `${data.importedCount}件のレビューをインポートしました`;
        if (data.workspaceCreated) {
          message += '\n※ モック用ワークスペースを自動作成しました';
        }
        setImportStatus({
          type: 'success',
          message,
          count: data.importedCount,
        });
        setPlaceId('');
      } else {
        setImportStatus({
          type: 'error',
          message: data.error || 'インポートに失敗しました',
        });
      }
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'エラーが発生しました: ' + (error instanceof Error ? error.message : String(error)),
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">設定</h1>
        <p className="text-sm md:text-base text-gray-800 mt-1">通知とレビュー管理の設定</p>
      </div>

      <Tabs defaultValue="notification" className="w-full">
        <TabsList className={`grid w-full ${isMockMode ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
          <TabsTrigger value="notification" className="text-gray-700">通知</TabsTrigger>
          <TabsTrigger value="reply" className="text-gray-700">返信設定</TabsTrigger>
          <TabsTrigger value="danger-words" className="text-gray-700">危険語辞書</TabsTrigger>
          {isMockMode && (
            <TabsTrigger value="test-data" className="text-gray-700">モックデータ</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="notification">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-700">通知設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-gray-700">★評価の通知閾値</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={ratingThreshold}
                    onValueChange={setRatingThreshold}
                    max={5}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xl md:text-2xl font-bold text-gray-700 w-12">★{ratingThreshold[0]}</span>
                </div>
                <p className="text-sm text-gray-700">
                  この評価以下のレビューが投稿されたときに通知します
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700">通知チャネル</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="slack" defaultChecked />
                    <label htmlFor="slack" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Slack通知を有効にする
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" defaultChecked />
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Email通知を有効にする
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Label className="text-gray-700">モックモード（テストデータ）</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="mockMode" 
                    checked={isMockMode}
                    onCheckedChange={handleMockModeToggle}
                  />
                  <label htmlFor="mockMode" className="text-sm font-medium text-gray-700 cursor-pointer">
                    モックモードを有効にする
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  モックモードを有効にすると、テストデータのインポート機能が使用できます
                </p>
              </div>

              <Button className="text-gray-700">設定を保存</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reply">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-700">返信設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-gray-700">デフォルトの返信トーン</Label>
                <RadioGroup defaultValue="polite">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="polite" id="polite" />
                    <label htmlFor="polite" className="text-gray-700 cursor-pointer">丁寧</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="casual" />
                    <label htmlFor="casual" className="text-gray-700 cursor-pointer">カジュアル</label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="signature" className="text-gray-700">署名テンプレート</Label>
                <Textarea
                  id="signature"
                  placeholder="返信の末尾に追加される署名"
                  defaultValue="カフェ＆レストラン 桜&#10;店長 山田太郎"
                  rows={4}
                  className="text-gray-700"
                />
              </div>

              <Button className="text-gray-700">設定を保存</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger-words">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-700">危険語辞書</CardTitle>
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
                  className="text-gray-700"
                />
                <Button onClick={handleAddWord}>
                  <Plus className="h-4 w-4 mr-2" />
                  追加
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">単語</TableHead>
                    <TableHead className="text-gray-700">追加日</TableHead>
                    <TableHead className="w-[100px] text-right text-gray-700">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dangerWords.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell className="text-gray-700">{word.word}</TableCell>
                      <TableCell className="text-gray-700">{word.addedDate}</TableCell>
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

        {isMockMode && (
          <TabsContent value="test-data">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-700">モックデータのインポート</CardTitle>
                <CardDescription className="text-gray-600">
                  Google Places APIから実店舗のレビューデータを取得してモックデータとして使用できます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-gray-700">
                    モックモードが有効です。このタブはテスト用のデータインポート機能を提供します。
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="placeId" className="text-gray-700">Place ID</Label>
                    <Input
                      id="placeId"
                      placeholder="ChIJ... で始まるPlace IDを入力"
                      value={placeId}
                      onChange={(e) => setPlaceId(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleImportReviews()}
                      disabled={isImporting}
                      className="text-gray-700"
                    />
                    <p className="text-sm text-gray-600">
                      例: ChIJR4fczVeLGGARWVp2HGalka0 (スターバックス渋谷店)
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-medium text-gray-700">Place IDの探し方</p>
                    <p className="text-sm text-gray-600">
                      1. Google Place ID Finderにアクセス
                    </p>
                    <a
                      href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Place ID Finderを開く
                    </a>
                    <p className="text-sm text-gray-600">
                      2. 店舗名や住所で検索してPlace IDをコピー
                    </p>
                  </div>

                  <Button
                    onClick={handleImportReviews}
                    disabled={isImporting || !placeId.trim()}
                    className="w-full text-gray-900"
                  >
                    {isImporting ? (
                      <>
                        <Download className="h-4 w-4 mr-2 animate-spin" />
                        インポート中...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2 text-gray-700" />
                        レビューをインポート
                      </>
                    )}
                  </Button>

                  {importStatus.type === 'success' && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {importStatus.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {importStatus.type === 'error' && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {importStatus.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {importStatus.type === 'success' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push('/dashboard')}
                        className="flex-1"
                      >
                        ダッシュボードで確認
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push('/dashboard/inbox')}
                        className="flex-1"
                      >
                        Inboxで確認
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
