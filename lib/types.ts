export type Review = {
  id: string;
  date: Date;
  source: 'google';
  rating: 1 | 2 | 3 | 4 | 5;
  authorName: string;
  text: string;
  status: 'unreplied' | 'replied' | 'auto_replied';
  risk: 'high' | 'medium' | 'low' | null;
  aiSummary: string | null;
  aiCategories: string[] | null;
  aiRiskReason: string | null;
  reply?: string;
  replyCreatedAt?: Date;
  replyDraft?: string | null;
  photos?: string[];
};

export type DashboardStats = {
  averageRating: number;
  totalReviews: number;
  negativeRate: number;
  replyRate: number;
  reviewGrowth: { month: string; count: number }[];
  ratingDistribution: { rating: number; count: number }[];
  negativeFactors: { factor: string; count: number }[];
  // 前月比データ
  changes?: {
    averageRating?: number;
    totalReviews?: number;
    negativeRate?: number;
    replyRate?: number;
  };
};

export type Todo = {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  completed: boolean;
  relatedReviewId?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  location: {
    id: string;
    name: string;
    address: string;
  };
};

export type FilterState = {
  statusFilter: 'all' | 'unreplied' | 'replied';
  ratingFilter: 'all' | 'negative';
  periodFilter: '7days' | '30days' | 'custom';
  searchQuery: string;
};
