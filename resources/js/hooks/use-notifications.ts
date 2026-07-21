import axios from 'axios';
import Echo from 'laravel-echo';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface Notification {
    id: string;
    letter_id: number;
    title: string;
    message: string;
    read_at?: string | null;
    created_at: string;
    type?: string;
}

export function useNotifications(userId: number) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const echoRef = useRef<any>(null);

    // دریافت نوتیفیکیشن‌های قبلی از دیتابیس
    useEffect(() => {
        if (!userId) {
            setIsLoading(false);

            return;
        }

        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `/notifications?user_id=${userId}`,
                );
                const data = (response.data as any[]).map((n) => ({
                    id: n.id,
                    letter_id: n.letter_id ?? n.data?.letter_id ?? n.data?.reply_letter_id ?? n.data?.original_letter_id,
                    title: n.title ?? n.data?.title ?? n.data?.original_letter_subject ?? 'اعلان جدید',
                    message: n.message ?? n.data?.message ?? n.data?.reply_content ?? '',
                    read_at: n.read_at,
                    created_at: n.created_at,
                    type: n.type,
                }));

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
    }, [userId]);

    // گوش دادن به نوتیفیکیشن‌های جدید با Reverb
    useEffect(() => {
        if (!userId) {
            return;
        }

        // ساخت Echo instance
        const echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: parseInt(import.meta.env.VITE_REVERB_PORT ?? '8080'),
            wssPort: parseInt(import.meta.env.VITE_REVERB_PORT ?? '8080'),
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
            auth: {
                headers: {
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            },
        });

        echoRef.current = echo;

        // استفاده از .notification() برای Laravel Notifications
        echo.private(`App.Models.User.${userId}`).notification(
            (eventData: any) => {
                const newNotification: Notification = {
                    id: eventData.id || Date.now().toString(),
                    letter_id: eventData.letter_id || eventData.data?.letter_id,
                    title:
                        eventData.title || eventData.data?.title || 'نامه جدید',
                    message:
                        eventData.message ||
                        eventData.data?.message ||
                        'شما یک نامه جدید دارید',
                    created_at: new Date().toISOString(),
                    read_at: null,
                    type: eventData.type || 'letter',
                };

                setNotifications((prev) => [newNotification, ...prev]);
                setUnreadCount((prev) => prev + 1);

                toast.info(`📩 ${newNotification.title}`, {
                    description: newNotification.message,
                    duration: 5000,
                    action: {
                        label: 'مشاهده',
                        onClick: () => {
                            if (newNotification.letter_id) {
                                window.location.href = `/letters/${newNotification.letter_id}`;
                            }
                        },
                    },
                });
            },
        );

        // Cleanup
        return () => {
            echo.leave(`App.Models.User.${userId}`);
            echo.disconnect();
        };
    }, [userId]);

    // مارک کردن یک نوتیفیکیشن به عنوان خوانده شده
    const markAsRead = useCallback(async (notificationId: string) => {
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
            toast.error('خطا در خواندن نوتیفیکیشن');
        }
    }, []);

    // مارک کردن همه نوتیفیکیشن‌ها به عنوان خوانده شده
    const markAllAsRead = useCallback(async () => {
        try {
            await axios.post('/notifications/mark-all-read');

            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString() })),
            );
            setUnreadCount(0);

            toast.success('همه اعلان‌ها خوانده شدند');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('خطا در خواندن همه نوتیفیکیشن‌ها');
        }
    }, []);

    // حذف یک نوتیفیکیشن
    const deleteNotification = useCallback(
        async (notificationId: string) => {
            try {
                await axios.delete(`/notifications/${notificationId}`);

                const deleted = notifications.find(
                    (n) => n.id === notificationId,
                );
                setNotifications((prev) =>
                    prev.filter((n) => n.id !== notificationId),
                );

                if (deleted && !deleted.read_at) {
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                }

                toast.success('نوتیفیکیشن حذف شد');
            } catch (error) {
                console.error('Error deleting notification:', error);
                toast.error('خطا در حذف نوتیفیکیشن');
            }
        },
        [notifications],
    );

    // حذف همه نوتیفیکیشن‌ها
    const deleteAllNotifications = useCallback(async () => {
        try {
            await axios.delete('/notifications/delete-all');

            setNotifications([]);
            setUnreadCount(0);

            toast.success('همه نوتیفیکیشن‌ها حذف شدند');
        } catch (error) {
            console.error('Error deleting all notifications:', error);
            toast.error('خطا در حذف نوتیفیکیشن‌ها');
        }
    }, []);

    // کلیک روی نوتیفیکیشن (هم خواندن و هم هدایت)
    const handleNotificationClick = useCallback(
        async (notification: Notification) => {
            // مارک به عنوان خوانده شده
            if (!notification.read_at) {
                await markAsRead(notification.id);
            }

            // هدایت به صفحه نامه
            if (notification.letter_id) {
                window.location.href = `/letters/${notification.letter_id}`;
            }
        },
        [markAsRead],
    );

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        handleNotificationClick,
    };
}
