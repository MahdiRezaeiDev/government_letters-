import { Link, router } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as notifs from '@/routes/notifications';

export function NotificationsBell() {

    const [count, setCount] = useState(0);

    // هر ۳۰ ثانیه چک کن
    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        
        return () => clearInterval(interval);
    }, []);

    async function fetchCount() {
        try {
            const res  = await fetch(notifs.unreadCount().url);
            const data = await res.json();
            setCount(data.count);
        } catch {}
    }

    return (
        <Link
            href={notifs.index().url}
            className="relative p-2 text-gray-500 hover:text-gray-700"
        >
            <Bell size={20} />
            {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </Link>
    );
}