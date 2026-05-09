import { Echo } from 'laravel-echo';
// resources/js/hooks/useNotifications.ts
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface Notification {
    id: string;
    data: { title: string; message: string; type: string };
    read_at: string | null;
    created_at: string;
}

export function useNotifications() {
    const { auth } = usePage<{ auth: { user: { id: number } } }>().props;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // بارگذاری اولیه از دیتابیس
    useEffect(() => {
        axios.get('/notifications').then(({ data }) => {
            setNotifications(data.data);
            setUnreadCount(data.data.filter((n: Notification) => !n.read_at).length);
        });
    }, []);

    // گوش دادن به ریل‌تایم
    useEffect(() => {
        const channel = window.Echo.private(`App.Models.User.${auth.user.id}`);

        channel.notification((notification: Notification['data'] & { id: string }) => {
            const newNotif: Notification = {
                id: notification.id,
                data: notification,
                read_at: null,
                created_at: new Date().toISOString(),
            };
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            window.Echo.leave(`App.Models.User.${auth.user.id}`);
        };
    }, [auth.user.id]);

    const markAsRead = async (id: string) => {
        await axios.post(`/notifications/${id}/read`);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        await axios.post('/notifications/read-all');
        setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
        setUnreadCount(0);
    };

    return { notifications, unreadCount, markAsRead, markAllAsRead };
}