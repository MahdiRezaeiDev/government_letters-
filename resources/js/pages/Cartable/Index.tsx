import { Head, Link } from '@inertiajs/react';
import * as letterRoutes from '@/routes/letters';

// ─── Types ───────────────────────────────

interface Routing {
    id: number;
    action_type: 'action' | 'approval' | 'information' | 'sign' | 'coordination';
    instruction: string | null;
    deadline: string | null;
    status: string;
    letter: {
        id: number;
        subject: string;
        letter_number: string | null;
        priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    };
    fromUser: { first_name: string; last_name: string } | null;
    fromPosition: { name: string } | null;
}

interface Letter {
    id: number;
    subject: string;
    letter_number: string | null;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    date: string;
    category: { name: string } | null;
}

interface Stats {
    pending_actions: number;
    incoming_new:    number;
    my_drafts:       number;
    sent_today:      number;
}

interface Props {
    pendingRoutings: Routing[];
    incomingLetters: Letter[];
    myDrafts:        Letter[];
    stats:           Stats;
}

// ─── Constants ───────────────────────────

const ACTION_LABEL: Record<Routing['action_type'], string> = {
    action:       'اقدام',
    approval:     'تأیید',
    information:  'اطلاع',
    sign:         'امضا',
    coordination: 'هماهنگی',
};

const ACTION_COLOR: Record<Routing['action_type'], string> = {
    action:       'bg-blue-100 text-blue-700',
    approval:     'bg-green-100 text-green-700',
    information:  'bg-gray-100 text-gray-600',
    sign:         'bg-purple-100 text-purple-700',
    coordination: 'bg-yellow-100 text-yellow-700',
};

const PRIORITY_COLOR: Record<Letter['priority'], string> = {
    low:         'bg-gray-100 text-gray-600',
    normal:      'bg-blue-100 text-blue-600',
    high:        'bg-yellow-100 text-yellow-700',
    urgent:      'bg-orange-100 text-orange-700',
    very_urgent: 'bg-red-100 text-red-700',
};

const PRIORITY_LABEL: Record<Letter['priority'], string> = {
    low:         'کم',
    normal:      'عادی',
    high:        'مهم',
    urgent:      'فوری',
    very_urgent: 'خیلی فوری',
};

// ─── Component ───────────────────────────

export default function Index({ pendingRoutings, incomingLetters, myDrafts, stats }: Props) {
    return (
        <>
            <Head title="کارتابل" />

            <div className="p-6 space-y-6">

                {/* آمار */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'در انتظار اقدام', value: stats.pending_actions, color: 'bg-orange-50 text-orange-700 border-orange-200' },
                        { label: 'وارده جدید',       value: stats.incoming_new,    color: 'bg-blue-50 text-blue-700 border-blue-200' },
                        { label: 'پیش‌نویس‌های من',  value: stats.my_drafts,       color: 'bg-gray-50 text-gray-700 border-gray-200' },
                        { label: 'ارسال امروز',       value: stats.sent_today,      color: 'bg-green-50 text-green-700 border-green-200' },
                    ].map((stat, i) => (
                        <div key={i} className={`rounded-lg border p-4 ${stat.color}`}>
                            <p className="text-3xl font-bold">{stat.value}</p>
                            <p className="text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* ارجاعات در انتظار */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b flex justify-between items-center">
                        <h2 className="font-semibold text-gray-700">
                            در انتظار اقدام
                            {stats.pending_actions > 0 && (
                                <span className="mr-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {stats.pending_actions}
                                </span>
                            )}
                        </h2>
                    </div>

                    {pendingRoutings.length === 0 ? (
                        <p className="text-center py-8 text-gray-400 text-sm">
                            هیچ موردی در انتظار اقدام نیست
                        </p>
                    ) : (
                        <div className="divide-y">
                            {pendingRoutings.map(routing => (
                                <div key={routing.id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${ACTION_COLOR[routing.action_type]}`}>
                                                    {ACTION_LABEL[routing.action_type]}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLOR[routing.letter.priority]}`}>
                                                    {PRIORITY_LABEL[routing.letter.priority]}
                                                </span>
                                            </div>
                                            <Link
                                                href={letterRoutes.show(routing.letter.id).url}
                                                className="font-medium text-gray-800 hover:text-blue-600"
                                            >
                                                {routing.letter.subject}
                                            </Link>
                                            <p className="text-xs text-gray-400 mt-1">
                                                از: {routing.fromUser
                                                    ? `${routing.fromUser.first_name} ${routing.fromUser.last_name}`
                                                    : routing.fromPosition?.name ?? '---'}
                                                {routing.instruction && (
                                                    <span className="mr-2 text-gray-500">
                                                        — {routing.instruction}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-left mr-4">
                                            {routing.deadline && (
                                                <p className="text-xs text-red-500">
                                                    مهلت: {routing.deadline}
                                                </p>
                                            )}
                                            <Link
                                                href={letterRoutes.show(routing.letter.id).url}
                                                className="text-xs text-blue-600 hover:underline mt-1 block"
                                            >
                                                مشاهده
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* دو ستون پایین */}
                <div className="grid grid-cols-2 gap-6">

                    {/* وارده جدید */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="font-semibold text-gray-700">وارده جدید</h2>
                        </div>
                        {incomingLetters.length === 0 ? (
                            <p className="text-center py-6 text-gray-400 text-sm">
                                نامه جدیدی وجود ندارد
                            </p>
                        ) : (
                            <div className="divide-y">
                                {incomingLetters.map(letter => (
                                    <div key={letter.id} className="px-6 py-3 hover:bg-gray-50">
                                        <Link
                                            href={letterRoutes.show(letter.id).url}
                                            className="text-sm font-medium text-gray-800 hover:text-blue-600 block"
                                        >
                                            {letter.subject}
                                        </Link>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-xs text-gray-400">
                                                {letter.date}
                                            </span>
                                            {letter.category && (
                                                <span className="text-xs text-gray-400">
                                                    · {letter.category.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* پیش‌نویس‌های من */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h2 className="font-semibold text-gray-700">پیش‌نویس‌های من</h2>
                            <Link
                                href={letterRoutes.create().url}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                + نامه جدید
                            </Link>
                        </div>
                        {myDrafts.length === 0 ? (
                            <p className="text-center py-6 text-gray-400 text-sm">
                                پیش‌نویسی وجود ندارد
                            </p>
                        ) : (
                            <div className="divide-y">
                                {myDrafts.map(letter => (
                                    <div key={letter.id} className="px-6 py-3 hover:bg-gray-50 flex justify-between items-center">
                                        <Link
                                            href={letterRoutes.show(letter.id).url}
                                            className="text-sm font-medium text-gray-800 hover:text-blue-600"
                                        >
                                            {letter.subject}
                                        </Link>
                                        <Link
                                            href={letterRoutes.edit(letter.id).url}
                                            className="text-xs text-yellow-600 hover:underline"
                                        >
                                            ویرایش
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}