import { usePage } from '@inertiajs/react';
import Echo from 'laravel-echo';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useLetterNotifications() {
    const page = usePage<{ auth: { user: { id: number } } }>();
    const userId = page.props.auth?.user?.id;

    useEffect(() => {
        if (!userId) {
return;
}

        const echoInstance = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
        });

        console.log('Echo ساخته شد');

        echoInstance
            .private(`App.Models.User.${userId}`)
            .notification((data: any) => {
                console.log('✅ دریافت شد:', data);
                toast('📩 نامه جدید', {
                    description: data.title,
                    duration: 5000,
                });
            });

        return () => {
            echoInstance.leave(`App.Models.User.${userId}`);
            echoInstance.disconnect();
        };

    }, [userId]);
}