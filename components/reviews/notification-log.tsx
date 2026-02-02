import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageSquare } from 'lucide-react';

const mockNotifications = [
  {
    id: '1',
    type: 'slack',
    message: 'Slack通知送信済み',
    timestamp: '2024/06/05 12:34',
    icon: MessageSquare,
  },
  {
    id: '2',
    type: 'email',
    message: 'メール通知送信済み',
    timestamp: '2024/06/05 12:35',
    icon: Mail,
  },
];

export function NotificationLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          通知ログ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockNotifications.map((notification) => (
          <div key={notification.id} className="flex items-start gap-3 rounded-lg border p-3">
            <notification.icon className="h-4 w-4 mt-0.5 text-gray-600" />
            <div className="flex-1">
              <div className="text-sm font-medium">{notification.message}</div>
              <div className="text-xs text-gray-600 mt-1">{notification.timestamp}</div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              成功
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
