import { usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/use-notifications';

export default function NotificationBell() {
    const { auth } = usePage().props as any;
    const { notifications, unreadCount } = useNotifications(auth.user.id);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80 p-0" align="end">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold">اعلان‌ها</h4>
                    {unreadCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {unreadCount} خوانده نشده
                        </span>
                    )}
                </div>

                {/* لیست — بجای ScrollArea از div استفاده کن */}
                <div className="h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
                            اعلانی وجود ندارد
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className="flex flex-col gap-1 p-4 border-b hover:bg-muted/50 cursor-pointer"
                            >
                                <span className="text-sm font-medium">{n.title}</span>
                                <span className="text-xs text-muted-foreground">{n.message}</span>
                            </div>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}