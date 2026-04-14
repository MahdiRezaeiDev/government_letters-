// resources/js/components/layout/Sidebar.tsx

import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Building2,
    Map as Sitemap,
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
import { index as archivesIndex } from '@/routes/archives';
import { index as cartableIndex } from '@/routes/cartable';
import { index as categoriesIndex } from '@/routes/categories';
import { index as departmentsIndex, positions as positionsList } from '@/routes/departments';
import { index as lettersIndex, create as lettersCreate } from '@/routes/letters';
import { index as organizationsIndex } from '@/routes/organizations';
import { edit as profileEdit } from '@/routes/profile';
import { index as reportsIndex } from '@/routes/reports';
import { index as usersIndex } from '@/routes/users';
import { index as settingsIndex } from '@/routes/users';

interface NavItem {
    title: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    children?: NavItem[];
    permission?: string;
}

// کامپوننت Tooltip ساده
function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
    if (!text) {
        return <>{children}</>;
    }

    return (
        <div className="relative group">
            {children}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {text}
            </div>
        </div>
    );
}

export function Sidebar() {
    const { auth, url } = usePage().props as any;
    const [collapsed, setCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState<string[]>(['نامه‌ها']);
    

    const userRole = auth.user?.roles?.[0]?.name || 'user';
    const isSuperAdmin = userRole === 'super-admin';
    const isOrgAdmin = userRole === 'org-admin';
    const isDeptManager = userRole === 'dept-manager';

    const toggleMenu = (title: string) => {
        if (collapsed) {
            return;
        }

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
                { title: 'سازمان‌ها', href: organizationsIndex(), icon: Building2 },
                { title: 'دپارتمان‌ها', href: departmentsIndex(), icon: Sitemap },
                { title: 'سمت‌ها', href: positionsList(), icon: Briefcase },
                { title: 'کاربران', href: usersIndex(), icon: Users },
                { title: 'دسته‌بندی نامه‌ها', href: categoriesIndex(), icon: FolderTree },
            ],
        },
        {
            title: 'نامه‌ها',
            icon: Mail,
            children: [
                { title: 'نامه‌های وارده', href: lettersIndex({query: { type: 'incoming' }}), icon: Inbox },
                { title: 'نامه‌های صادره', href: lettersIndex({query: { type: 'outgoing' }}), icon: Send },
                { title: 'نامه‌های داخلی', href: lettersIndex({query: { type: 'internal' }}), icon: FileText },
                { title: 'نامه جدید', href: lettersCreate(), icon: Mail },
            ],
        },
        {
            title: 'کارتابل',
            href: cartableIndex(),
            icon: Inbox,
        },
        {
            title: 'بایگانی',
            href: archivesIndex(),
            icon: Archive,
        },
        {
            title: 'گزارشات',
            href: reportsIndex(),
            icon: BarChart3,
            permission: 'dept-manager',
        },
        {
            title: 'تنظیمات',
            icon: Settings,
            children: [
                { title: 'پروفایل', href: profileEdit(), icon: Users },
                { title: 'تنظیمات سیستم', href: settingsIndex(), icon: Settings },
            ],
        },
    ];

    // فیلتر آیتم‌ها بر اساس نقش
    const filterByRole = (items: NavItem[]): NavItem[] => {
        return items.filter(item => {
            if (item.permission) {
                if (item.permission === 'super-admin' && !isSuperAdmin) {
                    return false;
                }

                if (item.permission === 'org-admin' && !isSuperAdmin && !isOrgAdmin) {
                    return false;
                }

                if (item.permission === 'dept-manager' && !isSuperAdmin && !isOrgAdmin && !isDeptManager) {
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

        return false;
    };

    return (
        <aside className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-sm transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
            {/* لوگو */}
            <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-4'} border-b border-gray-200`}>
                {!collapsed ? (
                    <Link href={dashboard()} className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">م</span>
                        </div>
                        <span className="font-bold text-gray-800">سیستم مکاتبات</span>
                    </Link>
                ) : (
                    <Link href={dashboard()}>
                        <div className="h-8 w-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">م</span>
                        </div>
                    </Link>
                )}
            </div>

            {/* دکمه جمع کردن */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -left-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors z-50"
            >
                <ChevronLeft className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>

            <nav className="p-3 space-y-1 overflow-hidden h-[calc(100%-4rem)]">
                {filteredNavItems.map((item) => (
                    <div key={item.title}>
                        {item.children ? (
                            <div>
                                <button
                                    onClick={() => toggleMenu(item.title)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${openMenus.includes(item.title) && !collapsed
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        } ${collapsed ? 'justify-center' : ''}`}
                                >
                                    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                                        <item.icon className="h-5 w-5" />
                                        {!collapsed && <span>{item.title}</span>}
                                    </div>
                                    {!collapsed && (
                                        <ChevronDown className={`h-4 w-4 transition-transform ${openMenus.includes(item.title) ? 'rotate-180' : ''}`} />
                                    )}
                                </button>

                                {/* زیرمنو */}
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
                            <Tooltip text={collapsed ? item.title : ''}>
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
                            </Tooltip>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
}