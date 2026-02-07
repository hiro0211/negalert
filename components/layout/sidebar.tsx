'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Mail, CheckSquare, Settings, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
  // 料金機能を一時的に非表示
  // {
  //   title: '料金',
  //   href: '/dashboard/billing',
  //   icon: CreditCard,
  // },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

function SidebarContent() {
  const pathname = usePathname();

  return (
    <>
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
          © 2026 NegAlert
        </div>
      </div>
    </>
  );
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r bg-gray-50">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Sheet/Drawer) */}
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <VisuallyHidden>
            <SheetTitle>ナビゲーションメニュー</SheetTitle>
          </VisuallyHidden>
          <div className="flex h-full flex-col bg-gray-50">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
