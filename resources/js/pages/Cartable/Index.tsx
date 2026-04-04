import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import * as letterRoutes from '@/routes/letters';
import * as cartable from '@/routes/cartable';

// ─── Types ───────────────────────────────

interface RoutingLetter {
    id: number; subject: string; letter_number: string | null;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    final_status: string; date: string;
}

interface Routing {
    id: number;
    action_type: 'action' | 'approval' | 'information' | 'sign' | 'coordination';
    instruction: string | null; deadline: string | null;
    letter: RoutingLetter;
    fromUser: { first_name: string; last_name: string } | null;
    fromPosition: { name: string } | null;
}

interface Letter {
    id: number; subject: string; letter_number: string | null;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    date: string; category: { name: string } | null;
}

interface Stats {
    pending_actions: number; incoming_new: number; sent_pending: number;
    my_drafts: number; overdue: number; sent_today: number;
}

interface Props {
    pendingRoutings: Routing[];
    incomingLetters: Letter[];
    sentLetters:     Letter[];
    myDrafts:        Letter[];
    overdueRoutings: Routing[];
    stats:           Stats;
}

// ─── Constants ───────────────────────────

const ACTION_LABEL: Record<Routing['action_type'], string> = {
    action: 'اقدام', approval: 'تأیید', information: 'اطلاع',
    sign: 'امضا', coordination: 'هماهنگی',
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
    low: 'کم', normal: 'عادی', high: 'مهم', urgent: 'فوری', very_urgent: 'خیلی فوری',
};

// ─── Component ───────────────────────────

export default function Index({
    pendingRoutings, incomingLetters, sentLetters,
    myDrafts, overdueRoutings, stats,
}: Props) {

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'کارتابل', href: cartable.index().url }]}>
            <Head title="کارتابل" />

            <div className="p-6 space-y-6">

                {/* ─── آمار ─── */}
                <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
                    {[
                        { label: 'در انتظار اقدام', value: stats.pending_actions, color: 'bg-orange-50 text-orange-700 border-orange-200' },
                        { label: 'وارده جدید',       value: stats.incoming_new,    color: 'bg-blue-50 text-blue-700 border-blue-200' },
                        { label: 'ارسالی در جریان',  value: stats.sent_pending,    color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                        { label: 'پیش‌نویس',         value: stats.my_drafts,       color: 'bg-gray-50 text-gray-700 border-gray-200' },
                        { label: 'معوق',             value: stats.overdue,         color: stats.overdue > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200' },
                        { label: 'ارسال امروز',       value: stats.sent_today,      color: 'bg-green-50 text-green-700 border-green-200' },
                    ].map((s, i) => (
                        <div key={i} className={`rounded-lg border p-4 ${s.color}`}>
                            <p className="text-2xl font-bold">{s.value}</p>
                            <p className="text-xs mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ─── معوق‌ها — اگه وجود داشت اول نشون بده ─── */}
                {overdueRoutings.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg">
                        <div className="px-6 py-4 border-b border-red-200">
                            <h2 className="font-semibold text-red-700 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                معوق — مهلت گذشته ({overdueRoutings.length})
                            </h2>
                        </div>
                        <div className="divide-y divide-red-100">
                            {overdueRoutings.map(r => (
                                <div key={r.id} className="px-6 py-3 flex justify-between items-center">
                                    <div>
                                        <Link href={letterRoutes.show(r.letter.id).url}
                                            className="text-sm font-medium text-red-800 hover:text-red-600">
                                            {r.letter.subject}
                                        </Link>
                                        <p className="text-xs text-red-500 mt-0.5">مهلت: {r.deadline}</p>
                                    </div>
                                    <Link href={letterRoutes.show(r.letter.id).url}
                                        className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                        اقدام
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── در انتظار اقدام ─── */}
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
                        <p className="text-center py-8 text-gray-400 text-sm">موردی در انتظار اقدام نیست</p>
                    ) : (
                        <div className="divide-y">
                            {pendingRoutings.map(r => (
                                <div key={r.id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${ACTION_COLOR[r.action_type]}`}>
                                                    {ACTION_LABEL[r.action_type]}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLOR[r.letter.priority]}`}>
                                                    {PRIORITY_LABEL[r.letter.priority]}
                                                </span>
                                                {r.deadline && new Date(r.deadline) < new Date() && (
                                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                                        معوق
                                                    </span>
                                                )}
                                            </div>
                                            <Link href={letterRoutes.show(r.letter.id).url}
                                                className="font-medium text-gray-800 hover:text-blue-600 text-sm">
                                                {r.letter.subject}
                                            </Link>
                                            <p className="text-xs text-gray-400 mt-1">
                                                از: {r.fromUser
                                                    ? `${r.fromUser.first_name} ${r.fromUser.last_name}`
                                                    : r.fromPosition?.name ?? '---'}
                                                {r.instruction && (
                                                    <span className="mr-2 text-gray-500">— {r.instruction}</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-left mr-4 flex-shrink-0">
                                            {r.deadline && (
                                                <p className={`text-xs ${new Date(r.deadline) < new Date() ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                                                    مهلت: {r.deadline}
                                                </p>
                                            )}
                                            <Link href={letterRoutes.show(r.letter.id).url}
                                                className="text-xs text-blue-600 hover:underline mt-1 block">
                                                مشاهده و اقدام
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── سه ستون پایین ─── */}
                <div className="grid grid-cols-3 gap-6">

                    {/* وارده جدید */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-5 py-4 border-b">
                            <h2 className="font-semibold text-gray-700 text-sm">
                                وارده جدید
                                {stats.incoming_new > 0 && (
                                    <span className="mr-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                        {stats.incoming_new}
                                    </span>
                                )}
                            </h2>
                        </div>
                        {incomingLetters.length === 0 ? (
                            <p className="text-center py-6 text-gray-400 text-xs">نامه جدیدی نیست</p>
                        ) : (
                            <div className="divide-y">
                                {incomingLetters.map(l => (
                                    <div key={l.id} className="px-5 py-3 hover:bg-gray-50">
                                        <Link href={letterRoutes.show(l.id).url}
                                            className="text-sm text-gray-800 hover:text-blue-600 block font-medium leading-5">
                                            {l.subject}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-400">{l.date}</span>
                                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${PRIORITY_COLOR[l.priority]}`}>
                                                {PRIORITY_LABEL[l.priority]}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ارسالی در جریان */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-5 py-4 border-b">
                            <h2 className="font-semibold text-gray-700 text-sm">ارسالی در جریان</h2>
                        </div>
                        {sentLetters.length === 0 ? (
                            <p className="text-center py-6 text-gray-400 text-xs">نامه‌ای در جریان نیست</p>
                        ) : (
                            <div className="divide-y">
                                {sentLetters.map(l => (
                                    <div key={l.id} className="px-5 py-3 hover:bg-gray-50">
                                        <Link href={letterRoutes.show(l.id).url}
                                            className="text-sm text-gray-800 hover:text-blue-600 block font-medium leading-5">
                                            {l.subject}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-400">{l.date}</span>
                                            {l.category && (
                                                <span className="text-xs text-gray-400">· {l.category.name}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* پیش‌نویس‌ها */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-5 py-4 border-b flex justify-between items-center">
                            <h2 className="font-semibold text-gray-700 text-sm">پیش‌نویس‌های من</h2>
                            <Link href={letterRoutes.create().url}
                                className="text-xs text-blue-600 hover:underline">
                                + جدید
                            </Link>
                        </div>
                        {myDrafts.length === 0 ? (
                            <p className="text-center py-6 text-gray-400 text-xs">پیش‌نویسی نیست</p>
                        ) : (
                            <div className="divide-y">
                                {myDrafts.map(l => (
                                    <div key={l.id} className="px-5 py-3 hover:bg-gray-50 flex justify-between items-center">
                                        <Link href={letterRoutes.show(l.id).url}
                                            className="text-sm text-gray-800 hover:text-blue-600 font-medium leading-5 flex-1 ml-2">
                                            {l.subject}
                                        </Link>
                                        <Link href={letterRoutes.edit(l.id).url}
                                            className="text-xs text-yellow-600 hover:underline flex-shrink-0">
                                            ویرایش
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}