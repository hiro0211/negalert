'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Mail, CheckSquare, Settings, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Inbox',
    href: '/dashboard/inbox',
    icon: Mail,
  },
  // TODO機能を一時的に非表示
  // {
  //   title: 'ToDo',
  //   href: '/dashboard/todos',
  //   icon: CheckSquare,
  // },
  {
    title: '設定',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: '料金',
    href: '/dashboard/billing',
    icon: CreditCard,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-2xl font-bold text-primary text-gray-600">NegAlert</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground text-gray-300'
                  : 'text-gray-900 hover:bg-gray-200'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="text-xs text-gray-600">
          © 2024 NegAlert
        </div>
      </div>
    </div>
  );
}
