// resources/js/components/layout/Header.tsx

import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Menu, Bell, Search, User, ChevronDown, 
    LogOut, Settings, UserCircle, Shield 
} from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
    isMobile: boolean;
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
    const { auth } = usePage().props as any;
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    // نمونه نوتیفیکیشن‌ها
    const notifications = [
        { id: 1, title: 'نامه جدید وارده', time: '۵ دقیقه پیش', read: false },
        { id: 2, title: 'ارجاع جدید', time: '۱ ساعت پیش', read: false },
        { id: 3, title: 'نامه شما تأیید شد', time: '۲ ساعت پیش', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 py-3 flex items-center justify-between">
                {/* سمت راست: دکمه منو + لوگو */}
                <div className="flex items-center gap-3">
                    {isMobile && (
                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="h-5 w-5 text-gray-600" />
                        </button>
                    )}
                    
                    <Link href={route('dashboard')} className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">م</span>
                        </div>
                        {!isMobile && (
                            <span className="font-bold text-gray-800 text-lg hidden sm:block">
                                سیستم مکاتبات
                            </span>
                        )}
                    </Link>
                </div>

                {/* وسط: جستجو (فقط دسکتاپ) */}
                {!isMobile && (
                    <div className="flex-1 max-w-md mx-4">
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="جستجو در نامه‌ها، کاربران..."
                                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                )}

                {/* سمت چپ: نوتیفیکیشن و پروفایل */}
                <div className="flex items-center gap-2">
                    {/* دکمه نوتیفیکیشن */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                        >
                            <Bell className="h-5 w-5 text-gray-600" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>

                        {/* منوی نوتیفیکیشن */}
                        {notificationsOpen && (
                            <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                                <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900">نوتیفیکیشن‌ها</h3>
                                    <button className="text-xs text-blue-600 hover:text-blue-700">
                                        مشاهده همه
                                    </button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}>
                                            <p className="text-sm text-gray-800">{notif.title}</p>
                                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* منوی کاربر */}
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                                {auth.user?.first_name?.[0]}{auth.user?.last_name?.[0]}
                            </div>
                            {!isMobile && (
                                <>
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium text-gray-800">
                                            {auth.user?.first_name} {auth.user?.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500">{auth.user?.email}</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                </>
                            )}
                        </button>

                        {/* منوی کشویی کاربر */}
                        {userMenuOpen && (
                            <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                                <div className="p-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">
                                        {auth.user?.first_name} {auth.user?.last_name}
                                    </p>
                                    <p className="text-xs text-gray-500">{auth.user?.email}</p>
                                </div>
                                <div className="py-2">
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <UserCircle className="h-4 w-4" />
                                        پروفایل
                                    </Link>
                                    <Link
                                        href={route('settings.index')}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <Settings className="h-4 w-4" />
                                        تنظیمات
                                    </Link>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        خروج
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}