import { useEchoPrivate } from '@laravel/echo-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Notification {
    id: string;
    letter_id: number;
    title: string;
    message: string;
}

export function useNotifications(userId: number) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEchoPrivate(
        `App.Models.User.${userId}`,
        'notification',
        (notification: Notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            toast(notification.message);
        }
    );

    return { notifications, unreadCount };
}