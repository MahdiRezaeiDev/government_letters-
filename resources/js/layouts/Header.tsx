import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    LogOut,
    Settings,
    User,
    Menu,
    X,
    Check,
    Trash2
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

    // آپدیت زمان
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);

        return () => clearInterval(timer);
    }, []);

    // کلیک خارج از منو
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

    // بستن نوتیفیکیشن در حالت موبایل
    useEffect(() => {
        setShowNotifications(false);
    }, [isMobile]);

    // جلوگیری از اسکرول در موبایل
    useEffect(() => {
        if (showNotifications && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

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

        console.log(notification);


        if (notification.data.letter_id) {
            router.get(`/letters/${notification.data.letter_id}`);
        }

        setShowNotifications(false);
    };

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">

                {/* Right side - Menu button + Title */}
                <div className="flex items-center gap-3">
                    {isMobile && (
                        <button
                            onClick={onMenuClick}
                            className="p-2 -mr-2 rounded-lg hover:bg-slate-100 transition-colors"
                            aria-label="منوی موبایل"
                        >
                            <Menu className="h-5 w-5 text-slate-600" />
                        </button>
                    )}
                    {isMobile && (
                        <span className="text-sm font-bold text-slate-700">
                            سیستم مکاتبات
                        </span>
                    )}
                </div>
                {/* Left side - Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Date */}
                    <div className="hidden md:block text-left border-l pl-5 border-slate-200">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
                            امروز
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                            {currentTime.toLocaleDateString('fa-Af', {
                                day: 'numeric',
                                month: 'long'
                            })}
                        </p>
                    </div>

                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`
                                relative p-2 md:p-2.5 rounded-xl transition-all duration-200
                                ${showNotifications
                                    ? 'bg-slate-100 text-slate-800'
                                    : 'hover:bg-slate-100 text-slate-600'
                                }
                            `}
                            aria-label="اعلان‌ها"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 md:top-1.5 right-1 md:right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                            )}
                        </button>

                        {/* Notification Panel */}
                        {showNotifications && (
                            <>
                                {isMobile && (
                                    <div
                                        className="fixed inset-0 bg-black/20 z-40"
                                        onClick={() => setShowNotifications(false)}
                                    />
                                )}

                                <div className={`
                                    ${isMobile
                                        ? 'fixed inset-x-0 top-0 z-50 h-full bg-white'
                                        : 'absolute left-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-200'
                                    }
                                    animate-in slide-in-from-top-2 duration-200
                                `}>
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-slate-800">اعلان‌ها</h3>
                                            {unreadCount > 0 && (
                                                <span className="text-xs bg-slate-800 text-white px-2 py-0.5 rounded-full">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setActiveTab(activeTab === 'all' ? 'unread' : 'all')}
                                                className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                                            >
                                                {activeTab === 'all' ? 'خوانده نشده' : 'همه'}
                                            </button>
                                            <button
                                                onClick={() => setShowNotifications(false)}
                                                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <X className="h-4 w-4 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Notification List */}
                                    <div className={`${isMobile ? 'h-[calc(100%-8rem)]' : 'max-h-96'} overflow-y-auto`}>
                                        {filteredNotifications.length === 0 ? (
                                            <div className="py-16 text-center">
                                                <Bell className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                                <p className="text-sm text-slate-500">هیچ اعلانی نیست</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-50">
                                                {filteredNotifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        className={`
                                                            group relative p-4 hover:bg-slate-50 transition-colors cursor-pointer
                                                            ${!n.read_at ? 'bg-blue-50/30' : ''}
                                                        `}
                                                        onClick={() => handleNotificationClick(n)}
                                                    >
                                                        <div className="flex gap-3">
                                                            {!n.read_at && (
                                                                <div className="mt-1.5 flex-shrink-0">
                                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <p className={`
                                                                        text-sm leading-snug line-clamp-2
                                                                        ${!n.read_at ? 'font-medium text-slate-800' : 'text-slate-600'}
                                                                    `}>
                                                                        {n.title || 'نامه جدید'}
                                                                    </p>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            deleteNotification(n.id);
                                                                        }}
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5 text-slate-400 hover:text-red-500" />
                                                                    </button>
                                                                </div>
                                                                {n.message && (
                                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                                                        {n.message}
                                                                    </p>
                                                                )}
                                                                <p className="text-[10px] text-slate-400 mt-2">
                                                                    {new Date(n.created_at).toLocaleTimeString('fa-IR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    {notifications.length > 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white">
                                            <button
                                                onClick={markAllAsRead}
                                                className="w-full text-center text-xs font-medium text-slate-600 hover:text-slate-800 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                <Check className="h-3 w-3 inline-block ml-1" />
                                                علامت‌گذاری همه به عنوان خوانده شده
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Profile Menu */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
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
                            <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-sm">
                                {auth?.user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>

                        {showProfileMenu && (
                            <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                <div className="px-4 py-3 mb-2 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-800">
                                        {auth?.user?.first_name} {auth?.user?.last_name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                        {auth?.user?.email}
                                    </p>
                                </div>

                                <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all text-sm">
                                    <User className="h-4 w-4" />
                                    <span>پروفایل کاربری</span>
                                </Link>

                                <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all text-sm">
                                    <Settings className="h-4 w-4" />
                                    <span>تنظیمات حساب</span>
                                </Link>

                                <div className="h-px bg-slate-100 my-1 mx-2"></div>

                                <Link method="post" href="/logout" as="button" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-all text-sm">
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