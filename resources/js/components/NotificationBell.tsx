import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} className="relative p-2">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border z-50">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold">اعلان‌ها</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-sm text-blue-500 hover:underline">
                                همه را خواندم
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-center text-gray-400 text-sm">اعلانی وجود ندارد</p>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.read_at && markAsRead(n.id)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!n.read_at ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                >
                                    <p className="font-medium text-sm">{n.data.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{n.data.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}