'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, CheckSquare } from 'lucide-react';
import { Review } from '@/lib/types';

interface TodoGeneratorProps {
  review: Review;
}

const suggestedTodos = [
  {
    id: 'todo-1',
    title: 'スタッフ研修の実施',
    completed: false,
  },
  {
    id: 'todo-2',
    title: '清掃チェックリストの作成',
    completed: false,
  },
  {
    id: 'todo-3',
    title: '料理提供時間の改善',
    completed: false,
  },
];

export function TodoGenerator({ review }: TodoGeneratorProps) {
  const handleAddTodo = (todoTitle: string) => {
    alert(`ToDoに追加しました: ${todoTitle}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          ToDo生成
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700">
          このレビューに基づいて、以下のToDoを提案します:
        </p>
        {suggestedTodos.map((todo) => (
          <div key={todo.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Checkbox id={todo.id} />
              <label htmlFor={todo.id} className="text-sm font-medium cursor-pointer">
                {todo.title}
              </label>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleAddTodo(todo.title)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
