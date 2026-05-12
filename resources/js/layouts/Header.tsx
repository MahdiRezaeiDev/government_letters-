import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    LogOut,
    Settings,
    User,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '@/hooks/use-notifications';

interface HeaderProps {
    onMenuClick: () => void;
    isMobile: boolean;
    collapsed: boolean;
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
    const { auth } = usePage().props as any;
    const userId = auth?.user?.id; // ایمپروومنت: چک کردن وجود کاربر

    // فقط اگر userId وجود داشت، هوک رو صدا بزن
    const { notifications = [], unreadCount = 0 } = useNotifications(userId || 0);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    // بروزرسانی زمان هر دقیقه
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // هر دقیقه

        return () => clearInterval(timer);
    }, []);

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
        <header className="sticky shadow-md top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
            <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">

                {/* بخش راست - منوی موبایل */}
                {isMobile && (
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}

                {/* بخش راست - لوگو یا عنوان */}
                <div className="flex items-center gap-10">
                    {!isMobile && (
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">L</span>
                            </div>
                            <h1 className="font-bold text-slate-800">سیستم نامه‌ها</h1>
                        </div>
                    )}
                </div>

                {/* بخش چپ */}
                <div className="flex items-center gap-4">

                    {/* تاریخ */}
                    <div className="hidden md:block text-left border-l pl-5 border-slate-200">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1 text-left">امروز</p>
                        <p className="text-sm font-bold text-slate-700">
                            {currentTime.toLocaleDateString('fa-IR', {
                                day: 'numeric',
                                month: 'long'
                            })}
                        </p>
                    </div>

                    {/* دراپ‌دان اعلان‌ها */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`relative p-2.5 rounded-xl transition-all shadow-sm group ${showNotifications
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                    <span className="font-bold text-sm text-slate-800">اعلان‌های جدید</span>
                                    {unreadCount > 0 && (
                                        <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                                            {unreadCount} مورد جدید
                                        </span>
                                    )}
                                </div>

                                <div className="max-h-64 overflow-y-auto">
                                    {!notifications || notifications.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <Bell className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-xs text-slate-400">
                                                اعلانی وجود ندارد
                                            </p>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
                                                onClick={() => {
                                                    // هدایت به صفحه نامه
                                                    if (n.letter_id) {
                                                        window.location.href = `/letters/${n.letter_id}`;
                                                    }
                                                    setShowNotifications(false);
                                                }}
                                            >
                                                {!n.read_at && (
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
                                                            جدید
                                                        </span>
                                                    </div>
                                                )}
                                                <p className="text-xs font-bold text-slate-800">
                                                    {n.title || 'نامه جدید'}
                                                </p>
                                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                                    {n.message}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-2">
                                                    {new Date(n.created_at).toLocaleTimeString('fa-IR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {notifications && notifications.length > 0 && (
                                    <button
                                        onClick={() => {
                                            // handle mark all as read
                                            console.log('نمایش همه اعلان‌ها');
                                            setShowNotifications(false);
                                        }}
                                        className="w-full py-3 text-center text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors border-t border-slate-100"
                                    >
                                        نمایش همه اعلان‌ها
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* دراپ‌دان پروفایل */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 p-0.5 pr-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
                        >
                            <div className="flex flex-col text-left hidden sm:flex">
                                <span className="text-xs font-bold text-slate-800 leading-none">
                                    {auth?.user?.first_name || 'کاربر'}
                                </span>
                                <span className="text-[10px] text-slate-400 leading-none mt-0.5">
                                    {auth?.user?.role || 'کاربر عادی'}
                                </span>
                            </div>
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all">
                                {auth?.user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showProfileMenu && (
                            <div className="absolute left-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                <div className="px-4 py-3 mb-2 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-800">
                                        {auth?.user?.first_name} {auth?.user?.last_name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                        {auth?.user?.email}
                                    </p>
                                </div>

                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    <User className="h-4 w-4" />
                                    <span className="text-xs font-bold">پروفایل کاربری</span>
                                </Link>

                                <Link
                                    href="/settings"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    <Settings className="h-4 w-4" />
                                    <span className="text-xs font-bold">تنظیمات حساب</span>
                                </Link>

                                <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>

                                <Link
                                    method="post"
                                    href="/logout"
                                    as="button"
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="text-xs font-bold">خروج از سیستم</span>
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}