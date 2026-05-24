import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell, ChevronDown, LogOut, Settings, User,
    Menu, X, Check, Trash2, BellOff
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '@/hooks/use-notifications';

interface HeaderProps {
    onMenuClick: () => void;
    isMobile: boolean;
    collapsed?: boolean;
}

export function Header({ onMenuClick, isMobile, collapsed }: HeaderProps) {
    const { auth } = usePage().props as any;
    const userId = auth?.user?.id;
    const {
        notifications = [],
        unreadCount = 0,
        markAllAsRead,
        deleteNotification,
        markAsRead
    } = useNotifications(userId || 0);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('unread');

    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);

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

    // قفل اسکرول در موبایل
    useEffect(() => {
        document.body.style.overflow = (showNotifications && isMobile) ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [showNotifications, isMobile]);

    const filteredNotifications = activeTab === 'unread'
        ? notifications.filter(n => !n.read_at)
        : notifications;

    const handleNotificationClick = async (notification: any) => {
        if (!notification.read_at) {
            await markAsRead(notification.id);
        }

        if (notification.data?.letter_id) {
            router.get(`/letters/${notification.data.letter_id}`);
        }

        setShowNotifications(false);
    };

    const timeAgo = (dateStr: string) => {
        const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);

        if (diff < 1) {
            return 'همین الان';
        }

        if (diff < 60) {
            return `${diff} دقیقه پیش`;
        }

        if (diff < 1440) {
            return `${Math.floor(diff / 60)} ساعت پیش`;
        }

        return `${Math.floor(diff / 1440)} روز پیش`;
    };

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">

                {/* Right — menu + title */}
                <div className="flex items-center gap-3">
                    {isMobile && (
                        <button
                            onClick={onMenuClick}
                            className="p-2 -mr-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <Menu className="h-5 w-5 text-slate-600" />
                        </button>
                    )}
                    {isMobile && (
                        <span className="text-sm font-bold text-slate-700">سیستم مکاتبات</span>
                    )}
                </div>

                {/* Left — actions */}
                <div className="flex items-center gap-2 md:gap-4">

                    {/* Date */}
                    <div className="hidden md:block text-left border-l pl-5 border-slate-200">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">امروز</p>
                        <p className="text-sm font-bold text-slate-700">
                            {currentTime.toLocaleDateString('fa-Af', { day: 'numeric', month: 'long' })}
                        </p>
                    </div>

                    {/* ─── Notifications ─── */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications); setShowProfileMenu(false);
                            }}
                            className={`relative p-2 md:p-2.5 rounded-xl transition-all duration-200 ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-500'
                                }`}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                    {unreadCount > 9 ? '۹+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <>
                                {/* Overlay موبایل */}
                                {isMobile && (
                                    <div
                                        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                                        onClick={() => setShowNotifications(false)}
                                    />
                                )}

                                {/* پنل اعلان‌ها */}
                                <div className={`
                                    z-50 bg-white flex flex-col overflow-hidden
                                    ${isMobile
                                        ? 'fixed inset-x-0 bottom-0 rounded-t-3xl shadow-2xl'
                                        : 'absolute left-0 top-full mt-2 w-96 rounded-2xl shadow-xl border border-slate-200'
                                    }
                                `}
                                    style={isMobile ? { maxHeight: '85vh' } : { maxHeight: '480px' }}
                                >
                                    {/* دستگیره موبایل */}
                                    {isMobile && (
                                        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                                            <div className="w-10 h-1 bg-slate-300 rounded-full" />
                                        </div>
                                    )}

                                    {/* هدر پنل */}
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
                                        <div className="flex items-center gap-2.5">
                                            <h3 className="text-sm font-bold text-slate-800">اعلان‌ها</h3>
                                            {unreadCount > 0 && (
                                                <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {/* تب سوییچ */}
                                            <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                                                {(['unread', 'all'] as const).map(tab => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setActiveTab(tab)}
                                                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${activeTab === tab
                                                            ? 'bg-white text-slate-800 shadow-sm'
                                                            : 'text-slate-500 hover:text-slate-700'
                                                            }`}
                                                    >
                                                        {tab === 'unread' ? 'جدید' : 'همه'}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setShowNotifications(false)}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors mr-1"
                                            >
                                                <X className="h-4 w-4 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* لیست اعلان‌ها */}
                                    <div className="overflow-y-auto flex-1">
                                        {filteredNotifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                    <BellOff className="h-6 w-6 text-slate-400" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-semibold text-slate-600">
                                                        {activeTab === 'unread' ? 'اعلان جدیدی نیست' : 'هیچ اعلانی نیست'}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {activeTab === 'unread' ? 'همه اعلان‌ها خوانده شده‌اند' : 'اعلان‌های جدید اینجا نمایش داده می‌شوند'}
                                                    </p>
                                                </div>
                                                {activeTab === 'unread' && notifications.length > 0 && (
                                                    <button
                                                        onClick={() => setActiveTab('all')}
                                                        className="text-xs text-indigo-600 font-semibold hover:underline"
                                                    >
                                                        مشاهده همه اعلان‌ها
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-50">
                                                {filteredNotifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => handleNotificationClick(n)}
                                                        className={`group relative flex gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read_at ? 'bg-indigo-50/40' : ''
                                                            }`}
                                                    >
                                                        {/* نشانگر خوانده نشده */}
                                                        <div className="flex-shrink-0 mt-1.5">
                                                            {!n.read_at
                                                                ? <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                                                : <div className="w-2 h-2 rounded-full bg-transparent" />
                                                            }
                                                        </div>

                                                        {/* محتوا */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className={`text-sm leading-snug line-clamp-2 ${!n.read_at ? 'font-semibold text-slate-800' : 'font-normal text-slate-600'
                                                                    }`}>
                                                                    {n.title || 'اعلان جدید'}
                                                                </p>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); deleteNotification(n.id);
                                                                    }}
                                                                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-lg"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5 text-slate-400 hover:text-red-500" />
                                                                </button>
                                                            </div>
                                                            {n.message && (
                                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
                                                            )}
                                                            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                                                                {timeAgo(n.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* فوتر */}
                                    {notifications.length > 0 && unreadCount > 0 && (
                                        <div className="flex-shrink-0 px-5 py-3 border-t border-slate-100 bg-white">
                                            <button
                                                onClick={markAllAsRead}
                                                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 py-2 rounded-xl hover:bg-indigo-50 transition-all"
                                            >
                                                <Check className="h-3.5 w-3.5" />
                                                علامت‌گذاری همه به عنوان خوانده شده
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* ─── Profile Menu ─── */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => {
                                setShowProfileMenu(!showProfileMenu); setShowNotifications(false);
                            }}
                            className="flex items-center gap-2 md:gap-3 p-0.5 pr-2 md:pr-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="text-xs font-bold text-slate-800 leading-none">
                                    {auth?.user?.first_name || 'کاربر'}
                                </span>
                                <span className="text-[10px] text-slate-400 leading-none mt-0.5">
                                    {auth?.user?.role || 'کاربر'}
                                </span>
                            </div>
                            <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm">
                                {auth?.user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showProfileMenu && (
                            <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 mb-2 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-800">
                                        {auth?.user?.first_name} {auth?.user?.last_name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{auth?.user?.email}</p>
                                </div>

                                <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all text-sm">
                                    <User className="h-4 w-4" />
                                    <span>پروفایل کاربری</span>
                                </Link>
                                <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all text-sm">
                                    <Settings className="h-4 w-4" />
                                    <span>تنظیمات</span>
                                </Link>

                                <div className="h-px bg-slate-100 my-1 mx-2" />

                                <Link method="post" href="/logout" as="button" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-all text-sm">
                                    <LogOut className="h-4 w-4" />
                                    <span>خروج از سیستم</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}