import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  risk: 'high' | 'medium' | 'low';
  showIcon?: boolean;
}

export function RiskBadge({ risk, showIcon = true }: RiskBadgeProps) {
  const config = {
    high: {
      label: 'High',
      icon: AlertCircle,
      className: 'bg-red-100 text-red-800 border-red-300',
    },
    medium: {
      label: 'Medium',
      icon: AlertTriangle,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    low: {
      label: 'Low',
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800 border-green-300',
    },
  };

  const { label, icon: Icon, className } = config[risk];

  return (
    <Badge variant="outline" className={cn(className, 'font-medium')}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </Badge>
  );
}
