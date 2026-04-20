import { Link, usePage } from '@inertiajs/react';
import {
    Search, Bell, LayoutDashboard, Menu,
    LogOut, User, Settings, ChevronDown
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
    onMenuClick: () => void;
    isMobile: boolean;
    collapsed: boolean;
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
    const { auth } = usePage().props as any;
    const [currentTime, setCurrentTime] = useState(new Date());

    // وضعیت دراپ‌دان‌ها
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Ref برای بستن دراپ‌دان با کلیک به بیرون
    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }

            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
            <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">

                {/* بخش راست: لوگو و جستجو */}
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        {isMobile ? (
                            <button onClick={onMenuClick} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                <Menu className="text-slate-600 h-6 w-6" />
                            </button>
                        ) : (
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <LayoutDashboard className="text-white h-6 w-6" />
                            </div>
                        )}
                        <h1 className="text-xl font-black tracking-tight text-slate-800 hidden sm:block">
                            سیستم مدیریت <span className="text-indigo-600">مکاتبات</span>
                        </h1>
                    </div>
                </div>

                {/* بخش چپ: تاریخ، نوتفیکیشن و پروفایل */}
                <div className="flex items-center gap-4">

                    {/* تاریخ */}
                    <div className="hidden md:block text-left border-l pl-5 border-slate-200">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1 text-left">امروز</p>
                        <p className="text-sm font-bold text-slate-700">
                            {currentTime.toLocaleDateString('fa-Af', { day: 'numeric', month: 'long' })}
                        </p>
                    </div>

                    {/* دراپ‌دان اعلان‌ها */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`relative p-2.5 rounded-xl transition-all shadow-sm group ${showNotifications ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                    <span className="font-bold text-sm text-slate-800">اعلان‌های جدید</span>
                                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">۳ مورد</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                                        <p className="text-xs font-bold text-slate-800">مکتوب جدید دریافت شد</p>
                                        <p className="text-[10px] text-slate-500 mt-1">از طرف: صدارت عظمی - ۵ دقیقه قبل</p>
                                    </div>
                                </div>
                                <button className="w-full py-3 text-center text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">نمایش همه اعلان‌ها</button>
                            </div>
                        )}
                    </div>

                    {/* دراپ‌دان پروفایل کاربر */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 p-1.5 pr-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
                        >
                            <div className="flex flex-col text-left hidden sm:flex">
                                <span className="text-xs font-bold text-slate-800 leading-none">
                                    {auth?.user?.first_name || 'کاربر'}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold mt-1 uppercase">
                                    {auth?.user?.roles?.[0]?.name || 'User'}
                                </span>
                            </div>
                            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:bg-indigo-600 transition-colors">
                                {auth?.user?.first_name?.charAt(0) || 'U'}
                            </div>
                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showProfileMenu && (
                            <div className="absolute left-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all">
                                    <User className="h-4 w-4" />
                                    <span className="text-xs font-bold">پروفایل کاربری</span>
                                </Link>
                                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all">
                                    <Settings className="h-4 w-4" />
                                    <span className="text-xs font-bold">تنظیمات حساب</span>
                                </Link>
                                <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>
                                <Link method="post" href="/logout" as="button" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all">
                                    <LogOut className="h-4 w-4" />
                                    <span className="text-xs font-bold">خروج از سامانه</span>
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}