import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'unreplied' | 'replied' | 'auto_replied';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    unreplied: {
      label: '未返信',
      variant: 'destructive' as const,
      className: 'bg-red-500 hover:bg-red-600',
    },
    replied: {
      label: '返信済',
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600',
    },
    auto_replied: {
      label: '自動返信',
      variant: 'secondary' as const,
      className: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
  };

  const { label, variant, className } = config[status];

  return (
    <Badge variant={variant} className={cn(className)}>
      {label}
    </Badge>
  );
}
