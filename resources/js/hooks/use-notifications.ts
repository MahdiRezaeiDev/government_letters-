import { letters } from '@/routes/letters';
import { useEcho } from '@laravel/echo-react';
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

    useEcho(
        `App.Models.User.${userId}`,
        'notification',
        (e) => {
            console.log(e);
        }
    );

    return { notifications, unreadCount };
}