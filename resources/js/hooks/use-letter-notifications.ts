// resources/js/hooks/use-letter-notifications.ts

import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { toast } from 'sonner';

type NotificationData = {
    letter_id: number;
    title: string;
    message: string;
};

export function useLetterNotifications() {
    const { auth } = usePage<{ auth: { user: { id: number } } }>().props;
    const userId = auth.user.id;

    useEcho<NotificationData>(
        `App.Models.User.${userId}`,
        '.letter.submitted',
        (data) => {
            toast('📩 نامه جدید دریافت شد', {
                description: data.title,
                duration: 5000,
                action: {
                    label: 'مشاهده نامه',
                    onClick: () => router.visit(`/letters/${data.letter_id}`),
                },
            });
        }
    );
}