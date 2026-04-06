import { Head, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import * as notifs from '@/routes/notifications';
import * as letterRoutes from '@/routes/letters';

interface Notification {
    id: string;
    data: {
        letter_id: number; subject: string; action_type: string;
        from_name: string; instruction: string | null; deadline: string | null;
    };
    read_at: string | null; created_at: string;
}

interface Props {
    notifications: {
        data: Notification[]; total: number; last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const ACTION_LABEL: Record<string, string> = {
    action: 'اقدام', approval: 'تأیید', information: 'اطلاع',
    sign: 'امضا', coordination: 'هماهنگی',
};

const ACTION_STYLE: Record<string, string> = {
    action:       'bg-primary/10 text-primary',
    approval:     'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    information:  'bg-muted text-muted-foreground',
    sign:         'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    coordination: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

export default function Index({ notifications: data }: Props) {

    const unreadCount = data.data.filter(n => !n.read_at).length;

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'اعلان‌ها', href: notifs.index().url }]}>
            <Head title="اعلان‌ها" />
            <div className="p-6 max-w-2xl mx-auto space-y-5">

                {/* هدر */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-foreground">اعلان‌ها</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{data.total} اعلان</p>
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={() => router.post(notifs.readAll().url)}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-lg">
                            <CheckCheck size={13} />
                            همه را خوانده علامت بزن
                        </button>
                    )}
                </div>

                {/* لیست */}
                <div className="space-y-2">
                    {data.data.length === 0 ? (
                        <div className="bg-card border border-border rounded-xl flex flex-col items-center py-16 text-muted-foreground/40">
                            <Bell size={32} className="mb-3" />
                            <p className="text-sm">اعلانی وجود ندارد</p>
                        </div>
                    ) : data.data.map(notif => (
                        <div key={notif.id}
                            className={`rounded-xl border p-4 transition-all ${
                                notif.read_at
                                    ? 'bg-card border-border'
                                    : 'bg-primary/5 border-primary/20'
                            }`}>
                            <div className="flex items-start gap-3">

                                {/* نقطه خوانده نشده */}
                                <div className="flex-shrink-0 mt-1">
                                    {!notif.read_at
                                        ? <span className="block w-2 h-2 bg-primary rounded-full" />
                                        : <span className="block w-2 h-2 bg-transparent rounded-full" />
                                    }
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* بج نوع */}
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACTION_STYLE[notif.data.action_type] ?? 'bg-muted text-muted-foreground'}`}>
                                            {ACTION_LABEL[notif.data.action_type] ?? notif.data.action_type}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{notif.created_at}</span>
                                    </div>

                                    {/* موضوع */}
                                    <Link href={letterRoutes.show(notif.data.letter_id).url}
                                        className="text-sm font-medium text-foreground hover:text-primary transition-colors block truncate">
                                        {notif.data.subject}
                                    </Link>

                                    {/* از کی */}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        از: {notif.data.from_name}
                                        {notif.data.instruction && (
                                            <span className="mr-2">← {notif.data.instruction}</span>
                                        )}
                                    </p>

                                    {notif.data.deadline && (
                                        <p className="text-xs text-destructive mt-1">مهلت: {notif.data.deadline}</p>
                                    )}
                                </div>

                                {/* دکمه خوانده شد */}
                                {!notif.read_at && (
                                    <button onClick={() => router.post(notifs.read(notif.id).url)}
                                        className="flex-shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                        خوانده شد
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* صفحه‌بندی */}
                {data.last_page > 1 && (
                    <div className="flex gap-1 justify-center">
                        {data.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'}
                                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground font-medium'
                                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}