import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  risk: 'high' | 'medium' | 'low' | null;
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
    null: {
      label: '未分析',
      icon: HelpCircle,
      className: 'bg-gray-100 text-gray-800 border-gray-300',
    },
  };

  const riskKey = risk || 'null';
  const { label, icon: Icon, className } = config[riskKey];

  return (
    <Badge variant="outline" className={cn(className, 'font-medium')}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </Badge>
  );
}
