import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Building2, Map as Sitemap, Briefcase,
    Users, Inbox, Send, Archive,
    BarChart3, Settings, ChevronDown, ChevronLeft,
    Sparkles, Layout, Zap, X, Mail
} from 'lucide-react';
import { useState, useMemo } from 'react';

// مسیرها
import { dashboard } from '@/routes';
import { index as archivesIndex } from '@/routes/archives';
import { index as cartableIndex } from '@/routes/cartable';
import { index as departmentsIndex } from '@/routes/departments';
import { index as lettersIndex, create as lettersCreate } from '@/routes/letters';
import { index as organizationsIndex } from '@/routes/organizations';
import positions from '@/routes/positions';
import { edit as profileEdit } from '@/routes/profile';
import { index as reportsIndex } from '@/routes/reports';
import settings from '@/routes/settings';
import tazkira from '@/routes/tazkira';
import { index as usersIndex } from '@/routes/users';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
    isMobile?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ collapsed, setCollapsed, isMobile, isOpen, onClose }: SidebarProps) {
    const { url } = usePage();
    const { auth } = usePage().props as any;
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const userRole = auth?.user?.roles?.[0]?.name || 'user';
    const isReceptionUser = auth?.isReceptionUser === true;

    const isUrlActive = (href: any) => {
        if (!url || !href || typeof href !== 'string') {
            return false;
        }

        const currentPath = url.split('?')[0];
        const targetPath = href.split('?')[0];

        return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
    };

    // لیست کامل آیتم‌ها
    const navigationItems = [
        { title: 'داشبورد', href: dashboard(), icon: LayoutDashboard },
        { title: 'داشبورد مکاتیب', href: '/admin/letters-dashboard', icon: BarChart3, permission: 'super-admin' },
        { title: 'کارتابل جاری', href: cartableIndex(), icon: Layout },
        ...(isReceptionUser ? [{ title: 'داشبورد دبیرخانه', href: '/reception', icon: Mail }] : []),
        {
            title: 'مدیریت تشکیلات',
            icon: Building2,
            children: [
                { title: 'وزارت‌ خانه‌ها', href: organizationsIndex(), icon: Building2, permission: 'super-admin' },
                { title: 'ریاست‌ها', href: departmentsIndex(), icon: Sitemap, permission: 'org-admin' },
                { title: 'بست‌های کاری', href: positions.index(), icon: Briefcase, permission: 'dept-manager' },
                { title: 'مدیریت کارمندان', href: usersIndex(), icon: Users, permission: 'dept-manager' },
                // { title: 'طبقه‌بندی مکتوب ها', href: categoriesIndex(), icon: FolderTree },
            ],
        },
        { title: 'مکتوب و استعلام ها وارده', href: lettersIndex({ query: { direction: 'incoming' } }), icon: Inbox },
        { title: 'مکتوب و استعلام ها صادره', href: lettersIndex({ query: { direction: 'outgoing' } }), icon: Send },
        { title: 'ثبت مکتوب / استعلام', href: lettersCreate(), icon: Sparkles },
        { title: 'آرشیف مرکزی', href: archivesIndex(), icon: Archive },
        { title: 'گزارشات تحلیلی', href: reportsIndex(), icon: BarChart3, permission: 'dept-manager' },
        { title: 'تایید تذکره', href: tazkira.index(), icon: BarChart3, },

        {
            title: 'تنظیمات سیستم',
            icon: Settings,
            children: [
                { title: 'پروفایل کاربری', href: profileEdit(), icon: Users },
                { title: 'پیکربندی اصلی', href: settings.index(), icon: Settings },
            ],
        },
    ];

    const filteredNavItems = useMemo(() => {
        const filter = (items: any[]): any[] => {
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

    // محتوای سایدبار (برای استفاده در هر دو حالت دسکتاپ و موبایل)
    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* لوگو */}
            <div className="h-20 flex items-center px-5 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/60">
                        <Zap className="text-white h-5 w-5 fill-current" />
                    </div>
                    {(!collapsed || isMobile) && (
                        <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                            <span className="font-bold text-sm text-slate-900 leading-tight">سیستم مدیریت مکاتیب</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">اداره اسناد و ارتباطات</span>
                        </div>
                    )}
                </div>
            </div>

            {!isMobile && (
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -left-3 top-8 h-6 w-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:border-indigo-300 transition-all z-50 group"
                >
                    <ChevronLeft className={`h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
                </button>
            )}

            {isMobile && onClose && (
                <button
                    onClick={onClose}
                    className="absolute left-4 top-6 h-8 w-8 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all z-50 group"
                >
                    <X className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                </button>
            )}

            {/* ناوبری */}
            <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:w-0 scrollbar-none">
                {filteredNavItems.map((item) => {
                    const active = isUrlActive(item.href);
                    const isOpen = openMenus.includes(item.title);
                    const hasActiveChild = item.children?.some((child: any) => isUrlActive(child.href));

                    return (
                        <div key={item.title}>
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => !collapsed && !isMobile && setOpenMenus(prev => prev.includes(item.title) ? prev.filter(t => t !== item.title) : [...prev, item.title])}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${(isOpen || hasActiveChild)
                                            ? 'text-indigo-700 bg-indigo-50/70'
                                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={`h-[18px] w-[18px] ${(isOpen || hasActiveChild) ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            {(!collapsed || isMobile) && <span className="text-[13px] font-semibold">{item.title}</span>}
                                        </div>
                                        {(!collapsed || isMobile) && <ChevronDown className={`h-3.5 w-3.5 opacity-40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
                                    </button>
                                    {(!collapsed || isMobile) && isOpen && (
                                        <div className="mr-[21px] pr-3 border-r-2 border-indigo-100 space-y-0.5 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {item.children.map((child: any) => {
                                                const childActive = isUrlActive(child.href);

                                                return (
                                                    <Link
                                                        key={child.title}
                                                        href={child.href}
                                                        onClick={() => isMobile && onClose?.()}
                                                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${childActive
                                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                            : 'text-slate-500 hover:text-indigo-700 hover:bg-indigo-50/70'
                                                            }`}
                                                    >
                                                        <child.icon className="h-4 w-4" />
                                                        <span>{child.title}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    onClick={() => isMobile && onClose?.()}
                                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active
                                        ? 'bg-gradient-to-l from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200/70'
                                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                        }`}
                                >
                                    <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                                    {(!collapsed || isMobile) && <span className="text-[13px] font-semibold">{item.title}</span>}
                                    {active && (!collapsed || isMobile) && (
                                        <span className="absolute left-3 h-1.5 w-1.5 rounded-full bg-white/70" />
                                    )}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* کارت کاربر */}
            <div className="shrink-0 p-3 border-t border-slate-100">
                <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50/80 ${collapsed && !isMobile ? 'justify-center' : ''}`}>
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">
                        {auth?.user?.first_name?.charAt(0)?.toUpperCase() || 'ک'}
                    </div>
                    {(!collapsed || isMobile) && (
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">
                                {auth?.user?.first_name} {auth?.user?.last_name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {auth?.user?.email}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // اگر موبایل است، با backdrop نمایش بده
    if (isMobile) {
        return (
            <>
                {isOpen && (
                    <div className="fixed inset-0 z-50">
                        <div
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={onClose}
                        />
                        <aside className="fixed right-0 top-0 h-full w-80 bg-white border-l border-slate-200 shadow-2xl transition-all duration-500 z-50 overflow-hidden">
                            {sidebarContent}
                        </aside>
                    </div>
                )}
            </>
        );
    }

    // حالت دسکتاپ
    return (
        <aside className={`fixed right-0 top-0 h-screen bg-white border-l border-slate-200/80 shadow-[0_0_40px_-12px_rgba(99,102,241,0.15)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-50 ${collapsed ? 'w-20' : 'w-72'}`}>
            {sidebarContent}
        </aside>
    );
}