import { DashboardStats } from '../types';

export const mockStats: DashboardStats = {
  averageRating: 3.73,
  totalReviews: 15,
  negativeRate: 33.3,
  replyRate: 66.7,
  reviewGrowth: [
    { month: '2023年12月', count: 8 },
    { month: '2024年1月', count: 12 },
    { month: '2024年2月', count: 15 },
    { month: '2024年3月', count: 18 },
    { month: '2024年4月', count: 22 },
    { month: '2024年5月', count: 15 },
  ],
  ratingDistribution: [
    { rating: 5, count: 6 },
    { rating: 4, count: 4 },
    { rating: 3, count: 2 },
    { rating: 2, count: 2 },
    { rating: 1, count: 1 },
  ],
  negativeFactors: [
    { factor: '接客', count: 8 },
    { factor: '清潔さ', count: 3 },
    { factor: '料金', count: 2 },
  ],
};
