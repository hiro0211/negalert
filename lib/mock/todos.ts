import { Todo } from '../types';

export const mockTodos: Todo[] = [
  {
    id: '1',
    title: '接客研修の実施',
    priority: 'high',
    dueDate: new Date('2024-06-10'),
    completed: false,
    relatedReviewId: '1',
  },
  {
    id: '2',
    title: '予約システムの見直し',
    priority: 'high',
    dueDate: new Date('2024-06-08'),
    completed: false,
    relatedReviewId: '2',
  },
  {
    id: '3',
    title: 'トイレ清掃チェックリスト作成',
    priority: 'medium',
    dueDate: new Date('2024-06-12'),
    completed: false,
    relatedReviewId: '7',
  },
  {
    id: '4',
    title: 'メニュー写真の更新',
    priority: 'medium',
    dueDate: new Date('2024-06-15'),
    completed: false,
    relatedReviewId: '14',
  },
  {
    id: '5',
    title: '料理提供時間の短縮策検討',
    priority: 'low',
    dueDate: new Date('2024-06-20'),
    completed: true,
    relatedReviewId: '12',
  },
];
