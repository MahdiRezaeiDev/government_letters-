import { Head, router } from '@inertiajs/react';
import * as letterRoutes from '@/routes/letters';
import * as notifs from '@/routes/notifications';

// ─── Types ───────────────────────────────

interface Notification {
    id: string;
    data: {
        letter_id:   number;
        subject:     string;
        action_type: string;
        from_name:   string;
        instruction: string | null;
        deadline:    string | null;
    };
    read_at:    string | null;
    created_at: string;
}

interface Props {
    notifications: {
        data:      Notification[];
        total:     number;
        last_page: number;
        links:     { url: string | null; label: string; active: boolean }[];
    };
}

// ─── Constants ───────────────────────────

const ACTION_LABEL: Record<string, string> = {
    action:       'اقدام',
    approval:     'تأیید',
    information:  'اطلاع',
    sign:         'امضا',
    coordination: 'هماهنگی',
};

const ACTION_COLOR: Record<string, string> = {
    action:       'bg-blue-100 text-blue-700',
    approval:     'bg-green-100 text-green-700',
    information:  'bg-gray-100 text-gray-600',
    sign:         'bg-purple-100 text-purple-700',
    coordination: 'bg-yellow-100 text-yellow-700',
};

// ─── Component ───────────────────────────

export default function Index({ notifications: data }: Props) {

    function handleMarkAllRead() {
        router.post(notifs.readAll().url);
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Head title="اعلان‌ها" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-800">
                    اعلان‌ها ({data.total})
                </h2>
                {data.total > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        همه را خوانده علامت بزن
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {data.data.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        اعلانی وجود ندارد
                    </div>
                ) : (
                    data.data.map(notif => (
                        <div
                            key={notif.id}
                            className={`rounded-lg p-4 border transition-colors ${
                                notif.read_at
                                    ? 'bg-white border-gray-100'
                                    : 'bg-blue-50 border-blue-100'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {!notif.read_at && (
                                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                        )}
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${ACTION_COLOR[notif.data.action_type] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {ACTION_LABEL[notif.data.action_type] ?? notif.data.action_type}
                                        </span>
                                    </div>

                                    <a
                                        href={letterRoutes.show(notif.data.letter_id).url}
                                        className="text-sm font-medium text-gray-800 hover:text-blue-600"
                                    >
                                        {notif.data.subject}
                                    </a>

                                    <p className="text-xs text-gray-500 mt-1">
                                        از: {notif.data.from_name}
                                        {notif.data.instruction && (
                                            <span className="mr-2">— {notif.data.instruction}</span>
                                        )}
                                    </p>

                                    {notif.data.deadline && (
                                        <p className="text-xs text-red-500 mt-1">
                                            مهلت: {notif.data.deadline}
                                        </p>
                                    )}
                                </div>

                                <div className="text-left flex-shrink-0">
                                    <p className="text-xs text-gray-400">
                                        {notif.created_at}
                                    </p>
                                    {!notif.read_at && (
                                        <button
                                            onClick={() => router.post(notifs.read(notif.id).url)}
                                            className="text-xs text-blue-600 hover:underline mt-1 block"
                                        >
                                            خوانده شد
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {data.last_page > 1 && (
                <div className="flex gap-2 mt-4 justify-center">
                    {data.links.map((link, i) => (
                         <a
                            key={i}
                            href={link.url ?? '#'}
                            className={`px-3 py-1 rounded text-sm ${
                                link.active
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 border hover:bg-gray-50'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}