'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorMessage } from '@/components/common/error-message';
import { useTodos } from '@/lib/hooks/useTodos';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus, Trash2 } from 'lucide-react';

export default function TodosPage() {
  // カスタムフックでTODOデータを取得・操作
  const { todos, loading, error, refetch, toggleComplete, remove } = useTodos();
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleToggleComplete = async (id: string) => {
    try {
      await toggleComplete(id);
    } catch (err) {
      console.error('TODO完了状態の変更に失敗:', err);
      alert('TODO完了状態の変更に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このTODOを削除してもよろしいですか?')) {
      return;
    }
    
    try {
      await remove(id);
    } catch (err) {
      console.error('TODO削除に失敗:', err);
      alert('TODO削除に失敗しました');
    }
  };

  const priorityConfig = {
    high: { label: '高', color: 'bg-red-100 text-red-800' },
    medium: { label: '中', color: 'bg-yellow-100 text-yellow-800' },
    low: { label: '低', color: 'bg-green-100 text-green-800' },
  };

  // ローディング状態
  if (loading) {
    return <LoadingSpinner text="TODOを読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">ToDo管理</h1>
          <p className="text-gray-700 mt-1">レビューから生成されたタスク</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-gray-700">
              <Plus className="mr-2 h-4 w-4 text-gray-700" />
              新規追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新しいToDoを追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">タイトル</Label>
                <Input id="title" placeholder="ToDoのタイトル" />
              </div>
              <div>
                <Label htmlFor="priority">優先度</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setIsDialogOpen(false)}>追加</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
          すべて
        </Button>
        <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>
          未完了のみ
        </Button>
        <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>
          完了済み
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>ToDo</TableHead>
              <TableHead className="w-[120px]">優先度</TableHead>
              <TableHead className="w-[140px]">期限</TableHead>
              <TableHead className="w-[120px]">ステータス</TableHead>
              <TableHead className="w-[100px] text-right">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTodos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleComplete(todo.id)}
                  />
                </TableCell>
                <TableCell className={todo.completed ? 'line-through text-gray-400' : ''}>
                  {todo.title}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={priorityConfig[todo.priority].color}>
                    {priorityConfig[todo.priority].label}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(todo.dueDate), 'yyyy/MM/dd', { locale: ja })}</TableCell>
                <TableCell>
                  {todo.completed ? (
                    <Badge className="bg-green-500">完了</Badge>
                  ) : (
                    <Badge variant="secondary">未完了</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(todo.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
