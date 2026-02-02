import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: 1 | 2 | 3 | 4 | 5;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export function StarRating({ rating, size = 'md', showNumber = false }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const colorClass = rating <= 2 ? 'text-red-500' : rating === 3 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating ? colorClass : 'text-gray-300',
            star <= rating && 'fill-current'
          )}
        />
      ))}
      {showNumber && (
        <span className={cn('ml-1 font-medium', colorClass)}>
          {rating}.0
        </span>
      )}
    </div>
  );
}
