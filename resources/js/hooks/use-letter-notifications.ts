import { usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Notification {
    id: string;
    letter_id: number;
    title: string;
    message: string;
    read_at?: string | null;
    created_at: string;
}

export function useLetterNotifications(userId: number) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { csrf_token } = usePage().props; // دریافت CSRF از Inertia

    useEffect(() => {
        if (!userId) return;

        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                // استفاده از router Inertia
                const response = await fetch('/notifications', {
                    headers: {
                        'X-CSRF-TOKEN': csrf_token as string,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'include',
                });

                const data = await response.json();
                setNotifications(data);
                const unread = data.filter(
                    (n: Notification) => !n.read_at,
                ).length;
                setUnreadCount(unread);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [userId, csrf_token]);

    // گوش دادن به نوتیفیکیشن‌های جدید
    useEcho(
        `App.Models.User.${userId}`,
        '.notification', // توجه: نقطه قبل از notification
        (eventData: any) => {
            console.log('New notification received:', eventData);

            // ساخت نوتیفیکیشن جدید
            const newNotification: Notification = {
                id: eventData.id || Date.now().toString(),
                letter_id: eventData.letter_id,
                title: eventData.title || 'نامه جدید',
                message:
                    eventData.message || 'شما یک نامه جدید دریافت کرده‌اید',
                created_at: new Date().toISOString(),
                read_at: null,
            };

            // بروزرسانی state
            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // نمایش toast
            toast(`📩 ${newNotification.title}`, {
                description: newNotification.message,
                duration: 5000,
                action: {
                    label: 'مشاهده',
                    onClick: () => handleNotificationClick(newNotification),
                },
            });
        },
    );

    // مارک کردن به عنوان خوانده شده
    const markAsRead = async (notificationId: string) => {
        try {
            await axios.post(`/notifications/${notificationId}/read`);

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId
                        ? { ...n, read_at: new Date().toISOString() }
                        : n,
                ),
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // مارک همه به عنوان خوانده شده
    const markAllAsRead = async () => {
        try {
            await axios.post('/notifications/mark-all-read');

            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString() })),
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // حذف نوتیفیکیشن
    const deleteNotification = async (notificationId: string) => {
        try {
            await axios.delete(`/notifications/${notificationId}`);

            const deleted = notifications.find((n) => n.id === notificationId);
            setNotifications((prev) =>
                prev.filter((n) => n.id !== notificationId),
            );

            if (deleted && !deleted.read_at) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }

            toast.success('نوتیفیکیشن حذف شد');
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // مدیریت کلیک روی نوتیفیکیشن
    const handleNotificationClick = (notification: Notification) => {
        // می‌توانید به صفحه نامه هدایت کنید
        window.location.href = `/letters/${notification.letter_id}`;
    };

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };
}
