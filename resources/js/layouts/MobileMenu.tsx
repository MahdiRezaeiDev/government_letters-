// resources/js/components/layout/MobileMenu.tsx

import { Link, usePage } from '@inertiajs/react';
import {
    X, LayoutDashboard, Building2, Briefcase,
    Users, Mail, Inbox, Send, FileText, Archive,
    BarChart3, Settings, ChevronDown, FolderTree,
    LogOut, UserCircle,
    Map
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { auth, url } = usePage().props as any;
    const [openMenus, setOpenMenus] = useState<string[]>([]);

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
        { title: 'داشبورد', href: dashboard(), icon: LayoutDashboard },
        {
            title: 'مدیریت وزارت',
            icon: Building2,
            children: [
                { title: 'وزارت ها', href: organizations.index(), icon: Building2 },
                { title: 'دیپارتمنت ها', href: departments.index(), icon: Map },
                { title: 'بست ها', href: positions(), icon: Briefcase },
                { title: 'کاربران', href: users.index(), icon: Users },
                { title: 'دسته‌بندی مکتوب ها', href: categories.index(), icon: FolderTree },
            ],
        },
        {
            title: 'مکتوب ها',
            icon: Mail,
            children: [
                { title: 'مکتوب ها وارده', href: letters.index({ query: { type: 'incoming' } }), icon: Inbox },
                { title: 'مکتوب ها صادره', href: letters.index({ query: { type: 'outgoing' } }), icon: Send },
                { title: 'مکتوب ها داخلی', href: letters.index({ query: { type: 'internal' } }), icon: FileText },
                { title: 'مکتوب جدید', href: letters.create(), icon: Mail },
            ],
        },
        { title: 'کارتابل', href: cartable.index(), icon: Inbox },
        { title: 'ارشیف', href: archives.index(), icon: Archive },
        { title: 'گزارشات', href: reports.index(), icon: BarChart3 },
        {
            title: 'تنظیمات',
            icon: Settings,
            children: [
                { title: 'پروفایل', href: profile.edit(), icon: UserCircle },
                { title: 'تنظیمات سیستم', href: profile.edit(), icon: Settings },
            ],
        },
    ];

    const isActive = (href?: string) => {
        if (!href) {
            return false;
        }

        // return url === href || url.startsWith(href + '?');
        return true;
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
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">م</span>
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">سیستم مکتوب ها</p>
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
                    {navigationItems.map((item) => (
                        <div key={item.title}>
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleMenu(item.title)}
                                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors ${openMenus.includes(item.title)
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 transition-transform ${openMenus.includes(item.title) ? 'rotate-180' : ''}`} />
                                    </button>

                                    {openMenus.includes(item.title) && (
                                        <div className="mr-8 mt-1 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.title}
                                                    href={child.href!}
                                                    onClick={onClose}
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
                                <Link
                                    href={item.href!}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${isActive(item.href)
                                        ? 'text-blue-600 bg-blue-50'
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