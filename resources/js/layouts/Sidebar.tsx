// resources/js/components/layout/Sidebar.tsx

import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Building2,
    Map,
    Briefcase,
    Users,
    Mail,
    Inbox,
    Send,
    FileText,
    Archive,
    BarChart3,
    Settings,
    ChevronDown,
    ChevronLeft,
    FolderTree
} from 'lucide-react';
import React, { useState } from 'react';
import { dashboard } from '@/routes';
import archives from '@/routes/archives';
import cartable from '@/routes/cartable';
import categories from '@/routes/categories';
import { positions } from '@/routes/departments';
import letters from '@/routes/letters';
import organizations from '@/routes/organizations';
import profile from '@/routes/profile';
import reports from '@/routes/reports';
import users from '@/routes/users';

interface NavItem {
    title: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    children?: NavItem[];
    permission?: string;
}

export function Sidebar() {
    const { auth, url } = usePage().props as any;
    const [collapsed, setCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState<string[]>(['نامه‌ها']);

    const userRole = auth.user?.roles?.[0]?.name || 'user';

    const toggleMenu = (title: string) => {
        setOpenMenus(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    const navigationItems: NavItem[] = [
        {
            title: 'داشبورد',
            href: dashboard(),
            icon: LayoutDashboard,
        },
        {
            title: 'مدیریت سازمان',
            icon: Building2,
            permission: 'super-admin',
            children: [
                { title: 'سازمان‌ها', href: organizations.index(), icon: Building2 },
                { title: 'دپارتمان‌ها', href: organizations.index(), icon: Map },
                { title: 'سمت‌ها', href: positions, icon: Briefcase },
                { title: 'کاربران', href: users.index(), icon: Users },
                { title: 'دسته‌بندی نامه‌ها', href: categories.index(), icon: FolderTree },
            ],
        },
        {
            title: 'نامه‌ها',
            icon: Mail,
            children: [
                { title: 'نامه‌های وارده', href: letters.index({ query: { type: 'incoming' } }), icon: Inbox },
                { title: 'نامه‌های صادره', href: letters.index({ query: { type: 'outgoing' } }), icon: Send },
                { title: 'نامه‌های داخلی', href: letters.index({ query: { type: 'internal' } }), icon: FileText },
                { title: 'نامه جدید', href: letters.create(), icon: Mail },
            ],
        },
        {
            title: 'کارتابل',
            href: cartable.index(),
            icon: Inbox,
        },
        {
            title: 'بایگانی',
            href: archives.index(),
            icon: Archive,
        },
        {
            title: 'گزارشات',
            href: reports.index(),
            icon: BarChart3,
            permission: 'dept-manager',
        },
        {
            title: 'تنظیمات',
            icon: Settings,
            children: [
                { title: 'پروفایل', href: profile.edit(), icon: Users },
                { title: 'تنظیمات سیستم', href: profile.edit(), icon: Settings },
            ],
        },
    ];

    // فیلتر آیتم‌ها بر اساس نقش
    const filterByRole = (items: NavItem[]): NavItem[] => {
        return items.filter(item => {
            if (item.permission) {
                if (item.permission === 'super-admin' && !auth.user?.is_super_admin) {
                    return false;
                }

                if (item.permission === 'org-admin' && !auth.user?.is_org_admin) {
                    return false;
                }

                if (item.permission === 'dept-manager' && !auth.user?.is_dept_manager) {
                    return false;
                }
            }

            if (item.children) {
                item.children = filterByRole(item.children);

                return item.children.length > 0;
            }

            return true;
        });
    };

    const filteredNavItems = filterByRole(navigationItems);

    const isActive = (href?: string) => {
        if (!href) {
            return false;
        }

        // return url === href || url.startsWith(href + '?') || (href !== '/' && url.startsWith(href));
        return true;
    };

    return (
        <aside className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-sm transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
            {/* لوگو */}
            <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-4'} border-b border-gray-200`}>
                {!collapsed ? (
                    <Link href={dashboard()} className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">م</span>
                        </div>
                        <span className="font-bold text-gray-800">سیستم مکاتبات</span>
                    </Link>
                ) : (
                    <Link href={dashboard()}>
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">م</span>
                        </div>
                    </Link>
                )}
            </div>

            {/* دکمه جمع کردن */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -left-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50"
            >
                <ChevronLeft className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>

            {/* منوی ناوبری */}
            <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
                {filteredNavItems.map((item) => (
                    <div key={item.title}>
                        {item.children ? (
                            // آیتم با زیرمنو
                            <div>
                                <button
                                    onClick={() => toggleMenu(item.title)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${openMenus.includes(item.title)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-5 w-5" />
                                        {!collapsed && <span>{item.title}</span>}
                                    </div>
                                    {!collapsed && (
                                        <ChevronDown className={`h-4 w-4 transition-transform ${openMenus.includes(item.title) ? 'rotate-180' : ''}`} />
                                    )}
                                </button>

                                {!collapsed && openMenus.includes(item.title) && (
                                    <div className="mr-8 mt-1 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.title}
                                                href={child.href!}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive(child.href)
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <child.icon className="h-4 w-4" />
                                                <span>{child.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // آیتم ساده
                            <Link
                                href={item.href!}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(item.href)
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    } ${collapsed ? 'justify-center' : ''}`}
                            >
                                <item.icon className="h-5 w-5" />
                                {!collapsed && <span>{item.title}</span>}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
}