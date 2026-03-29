// resources/js/Layouts/AppLayout.jsx
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard, Mail, Inbox, Send, FileText,
  Archive, BarChart3, Bell, Settings, ChevronRight,
  LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'کارتابل',        href: '/',                  icon: LayoutDashboard },
  { name: 'نامه‌های وارده',  href: '/letters?type=incoming', icon: Inbox },
  { name: 'نامه‌های صادره',  href: '/letters?type=outgoing', icon: Send },
  { name: 'نامه‌های داخلی',  href: '/letters?type=internal', icon: Mail },
  { name: 'بایگانی',         href: '/archives',              icon: Archive },
  { name: 'گزارش‌ها',        href: '/reports',               icon: BarChart3 },
  { name: 'اطلاعیه‌ها',      href: '/announcements',         icon: Bell },
  { name: 'تنظیمات',         href: '/settings',              icon: Settings },
];

export default function AppLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const { auth, flash } = usePage().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex" dir="rtl">

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            سیستم مکاتبات اداری
          </span>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = window.location.pathname === item.href.split('?')[0];
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.name}
                {active && <ChevronRight className="w-4 h-4 mr-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src={auth.user.avatar_url}
              alt={auth.user.full_name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {auth.user.full_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
            </div>
            <Link
              href="/logout"
              method="post"
              as="button"
              className="p-1.5 text-gray-400 hover:text-red-500 rounded"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">{title}</h1>
          <NotificationBell />
        </header>

        {/* Flash messages */}
        {flash?.success && (
          <div className="mx-6 mt-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {flash.success}
          </div>
        )}

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function NotificationBell() {
  return (
    <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
      <Bell className="w-5 h-5" />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
    </button>
  );
}