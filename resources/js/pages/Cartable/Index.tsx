import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import * as letterRoutes from '@/routes/letters';

// ─── Types ───────────────────────────────

interface Routing {
    id: number;
    action_type: 'action' | 'approval' | 'information' | 'sign' | 'coordination';
    instruction: string | null;
    deadline: string | null;
    status: string;
    is_overdue: boolean;
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
    incoming_new: number;
    my_drafts: number;
    sent_today: number;
}

interface Props {
    pendingRoutings: Routing[];
    incomingLetters: Letter[];
    myDrafts: Letter[];
    stats: Stats;
}

// ─── Constants ───────────────────────────────

const actionMap = {
    action: { label: 'اقدام', color: 'bg-blue-100 text-blue-700' },
    approval: { label: 'تأیید', color: 'bg-green-100 text-green-700' },
    sign: { label: 'امضاء', color: 'bg-purple-100 text-purple-700' },
    information: { label: 'جهت اطلاع', color: 'bg-gray-100 text-gray-600' },
    coordination: { label: 'هماهنگی', color: 'bg-yellow-100 text-yellow-700' }
};

const priorityMap = {
    very_urgent: 'bg-red-500',
    urgent: 'bg-orange-500',
    high: 'bg-yellow-500',
    normal: 'bg-blue-500',
    low: 'bg-gray-400'
};

const priorityLabel = {
    very_urgent: 'خیلی فوری',
    urgent: 'فوری',
    high: 'مهم',
    normal: 'عادی',
    low: 'کم'
};

// ─── Component ───────────────────────────────

export default function CartableIndex({ pendingRoutings, incomingLetters, myDrafts, stats }: Props) {
    const [selectedRouting, setSelectedRouting] = useState<Routing | null>(null);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [completionNote, setCompletionNote] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [showOnlyOverdue, setShowOnlyOverdue] = useState(false);

    // فیلتر کردن ارجاعات
    const filteredRoutings = pendingRoutings.filter(routing => {
        if (filterType !== 'all' && routing.action_type !== filterType) return false;
        if (showOnlyOverdue && !routing.is_overdue) return false;
        return true;
    });

    // آمار واقعی
    const statsCards = [
        { label: 'کل کارتابل', value: pendingRoutings.length, color: 'bg-slate-700', icon: 'inbox' },
        { label: 'در انتظار', value: pendingRoutings.filter(r => r.status === 'pending').length, color: 'bg-yellow-500', icon: 'clock' },
        { label: 'تأخیر دار', value: pendingRoutings.filter(r => r.is_overdue).length, color: 'bg-red-500', icon: 'alert' },
        { label: 'تکمیل امروز', value: stats.sent_today, color: 'bg-teal-500', icon: 'check' }
    ];

    const handleComplete = (routing: Routing) => {
        setSelectedRouting(routing);
        setShowCompleteModal(true);
    };

    const submitComplete = () => {
        if (!selectedRouting) return;

        router.post(route('cartable.complete', selectedRouting.id), {
            note: completionNote
        }, {
            onSuccess: () => {
                setShowCompleteModal(false);
                setCompletionNote('');
                setSelectedRouting(null);
            }
        });
    };

    return (
        <>
            <Head title="کارتابل" />

            <main className="flex-1 overflow-auto p-6 space-y-5">
                {/* آمار کارتابل */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsCards.map((stat, idx) => (
                        <div key={idx} className={`${stat.color} rounded-xl p-4 flex items-center gap-3`}>
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                {stat.icon === 'inbox' && (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" />
                                    </svg>
                                )}
                                {stat.icon === 'clock' && (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                {stat.icon === 'alert' && (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                )}
                                {stat.icon === 'check' && (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-white/70">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* فیلترها */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex rounded-lg border border-gray-200 text-sm overflow-hidden">
                        {['all', 'action', 'approval', 'sign'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 transition-colors ${filterType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                                } border-r border-gray-200 last:border-r-0`}
                            >
                                {type === 'all' ? 'همه' : actionMap[type as keyof typeof actionMap]?.label || type}
                            </button>
                        ))}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showOnlyOverdue}
                            onChange={(e) => setShowOnlyOverdue(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-red-500"
                        />
                        فقط تأخیر دار
                    </label>
                </div>

                {/* لیست ارجاعات */}
                <div className="space-y-3">
                    {filteredRoutings.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                            <p className="text-gray-500">موردی برای نمایش وجود ندارد</p>
                        </div>
                    ) : (
                        filteredRoutings.map((routing) => {
                            const action = actionMap[routing.action_type];
                            const priorityColor = priorityMap[routing.letter.priority];
                            const priorityText = priorityLabel[routing.letter.priority];
                            const fromName = routing.fromUser
                                ? `${routing.fromUser.first_name} ${routing.fromUser.last_name}`
                                : routing.fromPosition?.name || 'سیستم';

                            return (
                                <div
                                    key={routing.id}
                                    className={`bg-white rounded-xl border shadow-sm p-5 ${routing.is_overdue ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`w-2 h-2 rounded-full ${priorityColor} flex-shrink-0`} />
                                                <span className="text-xs text-gray-500 ml-2">{priorityText}</span>
                                                <Link
                                                    href={letterRoutes.show(routing.letter.id)}
                                                    className="text-gray-800 font-semibold hover:text-blue-600 transition-colors"
                                                >
                                                    {routing.letter.subject}
                                                </Link>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap text-xs">
                                                <span className={`${action.color} px-2 py-0.5 rounded-full font-medium`}>
                                                    {action.label}
                                                </span>
                                                <span className="text-gray-500">از: {fromName}</span>
                                                {routing.letter.letter_number && (
                                                    <span className="text-gray-400">شماره: {routing.letter.letter_number}</span>
                                                )}
                                                {routing.deadline && (
                                                    <span className={`flex items-center gap-1 ${routing.is_overdue ? 'text-red-600 font-medium' : 'text-gray-400'
                                                        }`}>
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        مهلت: {new Date(routing.deadline).toLocaleDateString('fa-IR')}
                                                        {routing.is_overdue && ' ⚠️ تأخیر'}
                                                    </span>
                                                )}
                                            </div>
                                            {routing.instruction && (
                                                <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg px-3 py-2">
                                                    {routing.instruction}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Link
                                                href={letterRoutes.show(routing.letter.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                مشاهده
                                            </Link>
                                            <button
                                                onClick={() => handleComplete(routing)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                اقدام
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {/* مودال تکمیل اقدام */}
            {showCompleteModal && selectedRouting && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">تکمیل اقدام</h3>
                            <button
                                onClick={() => setShowCompleteModal(false)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm font-medium text-gray-800">
                                    {selectedRouting.letter.subject}
                                </p>
                                {selectedRouting.instruction && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        دستورالعمل: {selectedRouting.instruction}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    یادداشت اقدام
                                </label>
                                <textarea
                                    rows={4}
                                    value={completionNote}
                                    onChange={(e) => setCompletionNote(e.target.value)}
                                    placeholder="نتیجه اقدام انجام شده را بنویسید..."
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowCompleteModal(false)}
                                    className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg"
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={submitComplete}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    تکمیل اقدام
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}