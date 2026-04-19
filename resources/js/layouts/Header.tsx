import { Link, usePage } from '@inertiajs/react';
import {
    Menu, Bell, Search, ChevronDown,
    LogOut, Settings, UserCircle,
    Sparkles, Command, ShieldCheck
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { dashboard, logout } from '@/routes';
import profile from '@/routes/profile';

interface HeaderProps {
    onMenuClick: () => void;
    isMobile: boolean;
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
    const { auth } = usePage().props as any;
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // افکت برای شفافیت هدر هنگام اسکرول
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const notifications = [
        { id: 1, title: 'نامه جدید وارده', desc: 'از طرف ریاست احصائیه', time: '۵ دقیقه پیش', read: false },
        { id: 2, title: 'ارجاع جدید', desc: 'واحد فنی مکتوب شماره ۴۰۲ را ارجاع داد', time: '۱ ساعت پیش', read: false },
        { id: 3, title: 'نامه تأیید شد', desc: 'مکتوب صادره توسط مدیر امضا شد', time: '۲ ساعت پیش', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
            ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm py-2'
            : 'bg-[#fcfdfe] py-4'
            }`}>
            <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">

                {/* بخش راست: لوگو و جستجو */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        {isMobile && (
                            <button
                                onClick={onMenuClick}
                                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        )}

                        <Link href={dashboard()} className="flex items-center gap-3 group">
                            <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
                                <Sparkles className="text-white h-5 w-5" />
                            </div>
                            {!isMobile && (
                                <div className="hidden sm:block">
                                    <h1 className="font-black text-slate-800 text-lg leading-none">NSIA</h1>
                                    <p className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase">مکاتبات مرکزی</p>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* جستجوی Command-style */}
                    {!isMobile && (
                        <div className="hidden md:flex items-center bg-slate-100/50 border border-transparent focus-within:border-indigo-200 focus-within:bg-white rounded-2xl px-4 py-2 w-80 transition-all group">
                            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500" />
                            <input
                                type="text"
                                placeholder="جستجوی سریع..."
                                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400"
                            />
                            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded-md">
                                <Command className="h-3 w-3" /> K
                            </kbd>
                        </div>
                    )}
                </div>

                {/* بخش چپ: اکشن‌ها و پروفایل */}
                <div className="flex items-center gap-4">

                    {/* نوتیفیکیشن */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className={`p-2.5 rounded-2xl transition-all relative group ${notificationsOpen ? 'bg-indigo-50 text-indigo-600' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                        </button>

                        {notificationsOpen && (
                            <div className="absolute left-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-5">
                                <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-indigo-50/30">
                                    <h3 className="font-black text-slate-800 text-sm">اعلان‌های جدید</h3>
                                    <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{unreadCount} جدید</span>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto p-2">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className="p-4 rounded-[1.5rem] hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start">
                                                <p className={`text-sm font-bold ${!notif.read ? 'text-indigo-600' : 'text-slate-700'}`}>{notif.title}</p>
                                                <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full p-4 text-xs font-black text-indigo-600 bg-slate-50 hover:bg-indigo-50 transition-colors border-t border-slate-100">
                                    مشاهده تمامی فعالیت‌ها
                                </button>
                            </div>
                        )}
                    </div>

                    {/* پروفایل کاربر */}
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all border ${userMenuOpen ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-200 hover:border-indigo-200 shadow-sm'
                                }`}
                        >
                            <div className="text-right hidden sm:block">
                                <p className={`text-xs font-black leading-none ${userMenuOpen ? 'text-white' : 'text-slate-800'}`}>
                                    {auth.user?.name} {auth.user?.last_name}
                                </p>
                                <p className={`text-[9px] mt-1 font-bold ${userMenuOpen ? 'text-slate-400' : 'text-indigo-600'}`}>
                                    Senior Developer
                                </p>
                            </div>
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-inner">
                                <span className="text-xs font-black uppercase">
                                    {auth.user?.name?.[0]}{auth.user?.last_name?.[0]}
                                </span>
                            </div>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${userMenuOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
                        </button>

                        {userMenuOpen && (
                            <div className="absolute left-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 border border-slate-100 z-50 p-2 animate-in fade-in slide-in-from-top-5">
                                <div className="px-4 py-4 mb-2 bg-slate-50 rounded-[1.5rem]">
                                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase">حساب تایید شده</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate font-mono">{auth.user?.email}</p>
                                </div>

                                <div className="space-y-1">
                                    <Link href={profile.edit()} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all">
                                        <UserCircle className="h-4 w-4" />
                                        تنظیمات پروفایل
                                    </Link>
                                    <Link href={profile.edit()} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                                        <Settings className="h-4 w-4" />
                                        امنیت و دسترسی
                                    </Link>
                                </div>

                                <div className="border-t border-slate-100 my-2 mx-2"></div>

                                <Link
                                    href={logout()}
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                >
                                    <LogOut className="h-4 w-4" />
                                    خروج از سامانه
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}