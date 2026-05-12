import { Link, usePage } from '@inertiajs/react';
import {
    X, LayoutDashboard, Building2, Briefcase,
    Users, Inbox, Send, Archive,
    BarChart3, Settings, ChevronDown, FolderTree,
    LogOut, UserCircle, Map, Sparkles, Layout, Zap
} from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { dashboard, logout } from '@/routes';
import archives from '@/routes/archives';
import cartable from '@/routes/cartable';
import categories from '@/routes/categories';
import departments, { positions } from '@/routes/departments';
import letters from '@/routes/letters';
import organizations from '@/routes/organizations';
import profile from '@/routes/profile';
import reports from '@/routes/reports';
import users from '@/routes/users';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    title: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    children?: NavItem[];
    permission?: string;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { auth, url } = usePage().props as any;
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const userRole = auth?.user?.roles?.[0]?.name || 'user';

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const toggleMenu = (title: string) => {
        setOpenMenus(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    const navigationItems: NavItem[] = [
        { title: 'داشبورد', href: dashboard().url, icon: LayoutDashboard },
        {
            title: 'مدیریت تشکیلات',
            icon: Building2,
            children: [
                { title: 'وزارت‌ خانه‌ها', href: organizations.index().url, icon: Building2, permission: 'super-admin' },
                { title: 'ریاست‌ها', href: departments.index().url, icon: Map, permission: 'org-admin' },
                { title: 'بست‌های کاری', href: positions().url, icon: Briefcase, permission: 'dept-manager' },
                { title: 'مدیریت کارمندان', href: users.index().url, icon: Users, permission: 'dept-manager' },
                { title: 'طبقه‌بندی مکتوب ها', href: categories.index().url, icon: FolderTree },
            ],
        },
        { title: 'کارتابل جاری', href: cartable.index().url, icon: Layout },
        { title: 'مکتوب ها وارده', href: letters.index({ query: { direction: 'incoming' } }).url, icon: Inbox },
        { title: 'مکتوب ها صادره', href: letters.index({ query: { direction: 'outgoing' } }).url, icon: Send },
        { title: 'ثبت مکتوب / استعلام', href: letters.create().url, icon: Sparkles },
        { title: 'آرشیف مرکزی', href: archives.index().url, icon: Archive },
        { title: 'گزارشات تحلیلی', href: reports.index().url, icon: BarChart3, permission: 'dept-manager' },
        {
            title: 'تنظیمات سیستم',
            icon: Settings,
            children: [
                { title: 'پروفایل کاربری', href: profile.edit().url, icon: UserCircle },
                { title: 'پیکربندی اصلی', href: profile.edit().url, icon: Settings },
            ],
        },
    ];

    // فیلتر کردن آیتم‌ها بر اساس نقش کاربر
    const filteredNavItems = useMemo(() => {
        const filter = (items: NavItem[]): NavItem[] => {
            return items
                .filter(item => {
                    if (item.permission === 'super-admin') {
                        return userRole === 'super-admin';
                    }

                    if (item.permission === 'org-admin') {
                        return ['super-admin', 'org-admin'].includes(userRole);
                    }

                    if (item.permission === 'dept-manager') {
                        return ['super-admin', 'org-admin', 'dept-manager'].includes(userRole);
                    }

                    if (item.permission === 'user') {
                        return ['super-admin', 'org-admin', 'dept-manager', 'user'].includes(userRole);
                    }

                    return true;
                })
                .map(item => ({ ...item, children: item.children ? filter(item.children) : undefined }))
                .filter(item => !item.children || item.children.length > 0);
        };

        return filter(navigationItems);
    }, [userRole]);

    const isActive = (href?: string) => {
        if (!href) {
            return false;
        }

        const currentPath = url?.split('?')[0];
        const targetPath = href.split('?')[0];

        return currentPath === targetPath || currentPath?.startsWith(targetPath + '/');
    };

    if (!isOpen) {
        return null;
    }

    return (
        <>
            {/* اوورلی */}
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

            {/* منوی موبایل */}
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col animate-slide-in-right">
                {/* هدر */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Zap className="text-white h-5 w-5 fill-current" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">سیستم مدیریت مکتوب ها</p>
                            <p className="text-xs text-gray-500">{auth.user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* منو */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {filteredNavItems.map((item) => (
                        <div key={item.title}>
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleMenu(item.title)}
                                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors ${openMenus.includes(item.title)
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 transition-transform ${openMenus.includes(item.title) ? 'rotate-180' : ''
                                            }`} />
                                    </button>

                                    {openMenus.includes(item.title) && (
                                        <div className="mr-8 mt-1 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.title}
                                                    href={child.href!}
                                                    onClick={onClose}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive(child.href)
                                                        ? 'text-indigo-600 bg-indigo-50'
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
                                <Link
                                    href={item.href!}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${isActive(item.href)
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.title}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* فوتر */}
                <div className="p-4 border-t border-gray-200">
                    <Link
                        href={logout()}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        خروج از سیستم
                    </Link>
                </div>
            </div>
        </>
    );
}