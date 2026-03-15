import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Bell,
    Building2,
    ChevronDown,
    FileText,
    Folder,
    Inbox,
    LayoutDashboard,
    LogOut,
    Mail,
    Megaphone,
    Menu,
    Send,
    Settings,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { label: 'داشبورد', href: '/dashboard', icon: LayoutDashboard },
    { label: 'کارتابل', href: '/cartable', icon: Inbox },
    {
        label: 'نامه‌ها',
        href: '#',
        icon: Mail,
        children: [
            { label: 'همه نامه‌ها', href: '/letters', icon: FileText },
            { label: 'وارده', href: '/letters?type=incoming', icon: Inbox },
            { label: 'صادره', href: '/letters?type=outgoing', icon: Send },
            { label: 'داخلی', href: '/letters?type=internal', icon: FileText },
            { label: 'ثبت نامه جدید', href: '/letters/create', icon: FileText },
        ],
    },
    {
        label: 'سازمان',
        href: '#',
        icon: Building2,
        children: [
            {
                label: 'واحدها',
                href: '/organization/departments',
                icon: Building2,
            },
            { label: 'سمت‌ها', href: '/organization/positions', icon: Users },
        ],
    },
    { label: 'بایگانی', href: '/archives', icon: Folder },
    { label: 'گزارش‌ها', href: '/reports', icon: BarChart3 },
    { label: 'اطلاعیه‌ها', href: '/announcements', icon: Megaphone },
    { label: 'تنظیمات', href: '/settings', icon: Settings },
];

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedItem, setExpandedItem] = useState(null);

    return (
        <div className="flex h-screen bg-gray-50 font-sans" dir="rtl">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-16'} flex flex-shrink-0 flex-col bg-slate-900 text-white transition-all duration-300`}
            >
                {/* لوگو */}
                <div className="flex h-16 items-center justify-between border-b border-slate-700 bg-slate-800 px-4">
                    {sidebarOpen && (
                        <span className="truncate text-sm font-bold text-white">
                            سیستم مکاتبات
                        </span>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* ناوبری */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
                    {navItems.map((item) => (
                        <div key={item.label}>
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() =>
                                            setExpandedItem(
                                                expandedItem === item.label
                                                    ? null
                                                    : item.label,
                                            )
                                        }
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                                    >
                                        <item.icon
                                            size={18}
                                            className="flex-shrink-0"
                                        />
                                        {sidebarOpen && (
                                            <>
                                                <span className="flex-1 text-right">
                                                    {item.label}
                                                </span>
                                                <ChevronDown
                                                    size={14}
                                                    className={`transition-transform ${expandedItem === item.label ? 'rotate-180' : ''}`}
                                                />
                                            </>
                                        )}
                                    </button>
                                    {sidebarOpen &&
                                        expandedItem === item.label && (
                                            <div className="mr-6 mt-1 space-y-1">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.label}
                                                        href={child.href}
                                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                                                    >
                                                        <child.icon size={14} />
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                                >
                                    <item.icon
                                        size={18}
                                        className="flex-shrink-0"
                                    />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* خروج */}
                <div className="border-t border-slate-700 p-2">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        {sidebarOpen && <span>خروج</span>}
                    </Link>
                </div>
            </aside>

            {/* محتوای اصلی */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* هدر */}
                <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
                    <div className="flex items-center gap-4">
                        {header && (
                            <div className="text-gray-700">{header}</div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {/* نوتیفیکیشن */}
                        <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                            <Bell size={20} />
                            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                        </button>

                        {/* پروفایل */}
                        <div className="flex items-center gap-2">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-medium text-gray-700">
                                    {auth?.user?.full_name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {auth?.user?.email}
                                </p>
                            </div>
                            <img
                                src={
                                    auth?.user?.avatar_url ||
                                    '/default-avatar.png'
                                }
                                alt={auth?.user?.full_name || 'User'}
                                className="h-9 w-9 rounded-full border-2 border-blue-100 object-cover"
                            />
                        </div>
                    </div>
                </header>

                {/* محتوا */}
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    );
}
