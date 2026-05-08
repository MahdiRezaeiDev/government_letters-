import { usePage } from '@inertiajs/react';
import { useNotifications } from '@/hooks/use-notifications';

export default function NotificationBell() {
    const { auth } = usePage().props as any;
    const { notifications, unreadCount } = useNotifications(auth.user.id);

    return (
        <div>
            🔔 {unreadCount > 0 && <span>{unreadCount}</span>}
        </div>
    );
}