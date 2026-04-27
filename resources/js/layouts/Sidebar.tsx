import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Building2, Map as Sitemap, Briefcase,
    Users, Mail, Inbox, Send, FileText, Archive,
    BarChart3, Settings, ChevronDown, ChevronLeft,
    FolderTree, Sparkles, Layout, Zap
} from 'lucide-react';
import { useState, useMemo } from 'react';

// مسیرها
import { dashboard } from '@/routes';
import { index as archivesIndex } from '@/routes/archives';
import { index as cartableIndex } from '@/routes/cartable';
import { index as categoriesIndex } from '@/routes/categories';
import { index as departmentsIndex } from '@/routes/departments';
import { index as lettersIndex, create as lettersCreate } from '@/routes/letters';
import { index as organizationsIndex } from '@/routes/organizations';
import positions from '@/routes/positions';
import { edit as profileEdit } from '@/routes/profile';
import { index as reportsIndex } from '@/routes/reports';
import { index as usersIndex } from '@/routes/users';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const { url } = usePage();
    const { auth } = usePage().props as any;
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const userRole = auth?.user?.roles?.[0]?.name || 'user';

    const isUrlActive = (href: any) => {
        if (!url || !href || typeof href !== 'string') {
            return false;
        }

        const currentPath = url.split('?')[0];
        const targetPath = href.split('?')[0];

        return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
    };

    // لیست کامل آیتم‌ها (همه بخش‌های قبلی بازگردانده شد)
    const navigationItems = [
        { title: 'داشبورد', href: dashboard(), icon: LayoutDashboard },
        {
            title: 'مدیریت تشکیلات',
            icon: Building2,
            children: [
                { title: 'وزارت‌خانه‌ها', href: organizationsIndex(), icon: Building2 },
                { title: 'ریاست‌ها', href: departmentsIndex(), icon: Sitemap },
                { title: 'بست‌های شغلی', href: positions.index(), icon: Briefcase },
                { title: 'مدیریت کاربران', href: usersIndex(), icon: Users },
                { title: 'طبقه‌بندی مکاتیب', href: categoriesIndex(), icon: FolderTree },
            ],
        },
        {
            title: 'میز مکاتبات',
            icon: Mail,
            children: [
                { title: 'مکاتیب وارده', href: lettersIndex({ query: { type: 'incoming' } }), icon: Inbox },
                { title: 'مکاتیب صادره', href: lettersIndex({ query: { type: 'outgoing' } }), icon: Send },
                { title: 'مکاتیب داخلی', href: lettersIndex({ query: { type: 'internal' } }), icon: FileText },
                { title: 'ثبت مکتوب جدید', href: lettersCreate(), icon: Sparkles },
            ],
        },
        { title: 'کارتابل جاری', href: cartableIndex(), icon: Layout },
        { title: 'آرشیف مرکزی', href: archivesIndex(), icon: Archive },
        { title: 'گزارشات تحلیلی', href: reportsIndex(), icon: BarChart3, permission: 'dept-manager' },
        {
            title: 'تنظیمات سیستم',
            icon: Settings,
            children: [
                { title: 'پروفایل کاربری', href: profileEdit(), icon: Users },
                { title: 'پیکربندی اصلی', href: usersIndex(), icon: Settings },
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

                    if (item.permission === 'dept-manager') {
                        return ['super-admin', 'org-admin', 'dept-manager'].includes(userRole);
                    }

                    return true;
                })
                .map(item => ({ ...item, children: item.children ? filter(item.children) : undefined }))
                .filter(item => !item.children || item.children.length > 0);
        };

        return filter(navigationItems);
    }, [userRole]);

    return (
        <aside className={`fixed right-0 top-0 h-screen bg-white/80 backdrop-blur-2xl border-l border-slate-200/60 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-50 ${collapsed ? 'w-20' : 'w-72'}`}>
            <div className="h-24 flex items-center px-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 ring-2 ring-white">
                        <Zap className="text-white h-5 w-5 fill-current" />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-700">
                            <span className="font-semibold text-xs text-slate-900 leading-none">سیستم مدیریت مکاتیب</span>
                            <span className="text-[10px] text-slate-500 font-medium mt-1">Correspondence System</span>
                        </div>
                    )}
                </div>
            </div>

            <button onClick={() => setCollapsed(!collapsed)} className="absolute -left-3.5 top-10 h-7 w-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all z-50 group">
                <ChevronLeft className={`h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform duration-500 ${collapsed ? 'rotate-180' : ''}`} />
            </button>

            <nav className="px-3 space-y-1 h-[calc(100%-10rem)] overflow-y-auto [&::-webkit-scrollbar]:w-0 scrollbar-none">
                {filteredNavItems.map((item) => {
                    const active = isUrlActive(item.href);
                    const isOpen = openMenus.includes(item.title);

                    return (
                        <div key={item.title}>
                            {item.children ? (
                                <>
                                    <button onClick={() => !collapsed && setOpenMenus(prev => prev.includes(item.title) ? prev.filter(t => t !== item.title) : [...prev, item.title])} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${isOpen && !collapsed ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <item.icon className={`h-5 w-5 ${isOpen ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            {!collapsed && <span className="text-sm font-semibold">{item.title}</span>}
                                        </div>
                                        {!collapsed && <ChevronDown className={`h-4 w-4 opacity-30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                                    </button>
                                    {!collapsed && isOpen && (
                                        <div className="mr-6 pr-3 border-r border-slate-200 space-y-1 py-1">
                                            {item.children.map((child: any) => (
                                                <Link key={child.title} href={child.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isUrlActive(child.href) ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                                                    <child.icon className="h-4 w-4" />
                                                    <span>{child.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <item.icon className={`h-5 w-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                                    {!collapsed && <span className="text-sm font-semibold">{item.title}</span>}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}