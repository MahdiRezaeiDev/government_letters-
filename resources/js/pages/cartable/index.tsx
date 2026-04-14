// resources/js/pages/cartable/index.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle, XCircle, Clock, AlertCircle,
    Eye, ChevronLeft, Filter, Loader2, User, Calendar, MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import cartable from '@/routes/cartable';
import letters from '@/routes/letters';

interface Routing {
    id: number;
    letter_id: number;
    action_type: string;
    instruction: string | null;
    deadline: string | null;
    deadline_jalali?: string;
    status: string;
    letter: {
        id: number;
        subject: string;
        letter_number: string;
        priority: string;
    };
    from_user: {
        first_name: string;
        last_name: string;
    } | null;
    to_user: {
        first_name: string;
        last_name: string;
    } | null;
}

interface Props {
    routings: {
        data: Routing[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    stats: {
        total: number;
        overdue: number;
        today: number;
        completed_today: number;
    };
    actionTypes: Record<string, string>;
    priorities: Record<string, string>;
    filters: {
        status?: string;
        action_type?: string;
        priority?: string;
        overdue?: boolean;
    };
}

export default function CartableIndex({ routings, stats, actionTypes, priorities, filters }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedActionType, setSelectedActionType] = useState(filters.action_type || '');
    const [selectedPriority, setSelectedPriority] = useState(filters.priority || '');
    const [showOnlyOverdue, setShowOnlyOverdue] = useState(filters.overdue || false);
    const [loading, setLoading] = useState(false);
    const [completingId, setCompletingId] = useState<number | null>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);

    // State برای مودال‌ها
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRoutingId, setSelectedRoutingId] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const [reason, setReason] = useState('');

    const applyFilters = () => {
        setLoading(true);
        router.get(cartable.index(), {
            action_type: selectedActionType,
            priority: selectedPriority,
            overdue: showOnlyOverdue,
        }, {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    const resetFilters = () => {
        setSelectedActionType('');
        setSelectedPriority('');
        setShowOnlyOverdue(false);
        setLoading(true);
        router.get(cartable.index(), {}, {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    const openCompleteModal = (routingId: number) => {
        setSelectedRoutingId(routingId);
        setNote('');
        setShowCompleteModal(true);
    };

    const openRejectModal = (routingId: number) => {
        setSelectedRoutingId(routingId);
        setReason('');
        setShowRejectModal(true);
    };

    const handleComplete = () => {
        if (!note.trim()) {
            alert('لطفاً یادداشت اقدام را وارد کنید.');

            return;
        }

        if (!selectedRoutingId) {
            return;
        }

        setCompletingId(selectedRoutingId);
        router.post(cartable.complete(selectedRoutingId), { note }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowCompleteModal(false);
                setSelectedRoutingId(null);
                setNote('');
                router.reload();
            },
            onFinish: () => {
                setCompletingId(null);
            },
        });
    };

    const handleReject = () => {
        if (!reason.trim()) {
            alert('لطفاً دلیل رد را وارد کنید.');

            return;
        }

        if (!selectedRoutingId) {
            return;
        }

        setRejectingId(selectedRoutingId);
        router.post(cartable.reject(selectedRoutingId), { reason }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                setSelectedRoutingId(null);
                setReason('');
                router.reload();
            },
            onFinish: () => {
                setRejectingId(null);
            },
        });
    };

    const actionTypeColors: Record<string, string> = {
        action: 'bg-blue-100 text-blue-700',
        information: 'bg-gray-100 text-gray-700',
        approval: 'bg-green-100 text-green-700',
        coordination: 'bg-yellow-100 text-yellow-700',
        sign: 'bg-purple-100 text-purple-700',
    };

    const priorityColors: Record<string, string> = {
        low: 'bg-gray-100 text-gray-600',
        normal: 'bg-blue-100 text-blue-600',
        high: 'bg-yellow-100 text-yellow-600',
        urgent: 'bg-orange-100 text-orange-600',
        very_urgent: 'bg-red-100 text-red-600',
    };

    const priorityLabels: Record<string, string> = {
        low: 'کم',
        normal: 'عادی',
        high: 'مهم',
        urgent: 'فوری',
        very_urgent: 'خیلی فوری',
    };

    return (
        <>
            <Head title="کارتابل من" />

            <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">کارتابل من</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        اقدامات و ارجاعات نیازمند پیگیری
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 transition hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500 rounded-lg p-2">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600">در انتظار اقدام</p>
                                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100 transition hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-500 rounded-lg p-2">
                                <AlertCircle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-red-600">تأخیر دار</p>
                                <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 transition hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-500 rounded-lg p-2">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-yellow-600">مهلت امروز</p>
                                <p className="text-2xl font-bold text-yellow-700">{stats.today}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100 transition hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500 rounded-lg p-2">
                                <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-green-600">تکمیل امروز</p>
                                <p className="text-2xl font-bold text-green-700">{stats.completed_today}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                        >
                            <Filter className="h-4 w-4" />
                            فیلترها
                            <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-0' : 'rotate-180'}`} />
                        </button>
                    </div>

                    {showFilters && (
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع اقدام</label>
                                    <select
                                        value={selectedActionType}
                                        onChange={(e) => setSelectedActionType(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">همه</option>
                                        {Object.entries(actionTypes).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">اولویت</label>
                                    <select
                                        value={selectedPriority}
                                        onChange={(e) => setSelectedPriority(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">همه</option>
                                        {Object.entries(priorities).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showOnlyOverdue}
                                            onChange={(e) => setShowOnlyOverdue(e.target.checked)}
                                            className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                                        />
                                        فقط نمایش تأخیر دار
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                                >
                                    پاک کردن فیلترها
                                </button>
                                <button
                                    onClick={applyFilters}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin inline ml-1" /> : 'اعمال فیلتر'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Routings List */}
                <div className="space-y-3">
                    {routings.data.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <p className="text-gray-500">موردی برای نمایش وجود ندارد</p>
                            <p className="text-sm text-gray-400 mt-1">کارتابل شما خالی است</p>
                        </div>
                    ) : (
                        routings.data.map((routing) => {
                            const isOverdue = routing.deadline && new Date(routing.deadline) < new Date();
                            const action = actionTypes[routing.action_type];
                            const priority = priorityLabels[routing.letter?.priority];

                            return (
                                <div
                                    key={routing.id}
                                    className={`bg-white rounded-xl shadow-sm border p-5 transition-all hover:shadow-md ${isOverdue ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex-1 min-w-0">
                                            {/* Badges */}
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${actionTypeColors[routing.action_type]}`}>
                                                    {action}
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[routing.letter?.priority]}`}>
                                                    {priority}
                                                </span>
                                                {isOverdue && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                        <AlertCircle className="h-3 w-3" />
                                                        تأخیر دار
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-400">{routing.letter?.letter_number}</span>
                                            </div>

                                            {/* Subject */}
                                            <Link
                                                href={letters.show(routing.letter_id)}
                                                className="text-gray-800 font-semibold hover:text-blue-600 transition line-clamp-2"
                                            >
                                                {routing.letter?.subject}
                                            </Link>

                                            {/* Instruction */}
                                            {routing.instruction && (
                                                <div className="mt-2 flex items-start gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                                                    <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                                    <span>{routing.instruction}</span>
                                                </div>
                                            )}

                                            {/* Meta info */}
                                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    از: {routing.from_user?.first_name} {routing.from_user?.last_name}
                                                </span>
                                                {routing.deadline_jalali && (
                                                    <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                                                        <Calendar className="h-3 w-3" />
                                                        مهلت: {routing.deadline_jalali}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Link
                                                href={letters.show(routing.letter_id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                مشاهده
                                            </Link>
                                            <button
                                                onClick={() => openCompleteModal(routing.id)}
                                                disabled={completingId === routing.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs transition disabled:opacity-50"
                                            >
                                                {completingId === routing.id ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                )}
                                                تکمیل
                                            </button>
                                            <button
                                                onClick={() => openRejectModal(routing.id)}
                                                disabled={rejectingId === routing.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs transition disabled:opacity-50"
                                            >
                                                {rejectingId === routing.id ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <XCircle className="h-3.5 w-3.5" />
                                                )}
                                                رد
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {routings.last_page > 1 && (
                    <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between flex-wrap gap-4">
                        <div className="text-sm text-gray-500">
                            نمایش {routings.from} تا {routings.to} از {routings.total} نتیجه
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (routings.current_page > 1) {
                                        router.get(cartable.index(), { page: routings.current_page - 1, ...filters });
                                    }
                                }}
                                disabled={routings.current_page === 1}
                                className={`px-3 py-1 rounded-lg text-sm transition ${routings.current_page > 1
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                قبلی
                            </button>
                            {(() => {
                                const pages = [];
                                const maxVisible = 5;
                                let start = Math.max(1, routings.current_page - Math.floor(maxVisible / 2));
                                const end = Math.min(routings.last_page, start + maxVisible - 1);

                                if (end - start + 1 < maxVisible) {
                                    start = Math.max(1, end - maxVisible + 1);
                                }

                                for (let i = start; i <= end; i++) {
                                    pages.push(i);
                                }

                                return pages.map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => router.get(cartable.index(), { page, ...filters })}
                                        className={`px-3 py-1 rounded-lg text-sm transition ${routings.current_page === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ));
                            })()}
                            <button
                                onClick={() => {
                                    if (routings.current_page < routings.last_page) {
                                        router.get(cartable.index(), { page: routings.current_page + 1, ...filters });
                                    }
                                }}
                                disabled={routings.current_page === routings.last_page}
                                className={`px-3 py-1 rounded-lg text-sm transition ${routings.current_page < routings.last_page
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                بعدی
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Complete Modal */}
            {showCompleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">تکمیل اقدام</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            لطفاً یادداشت اقدام را وارد کنید
                        </p>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={4}
                            placeholder="نتیجه اقدام انجام شده را بنویسید..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowCompleteModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                            >
                                انصراف
                            </button>
                            <button
                                onClick={handleComplete}
                                disabled={!note.trim()}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {completingId && <Loader2 className="h-4 w-4 animate-spin" />}
                                تأیید و تکمیل
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">رد اقدام</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            لطفاً دلیل رد را وارد کنید
                        </p>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            placeholder="دلیل رد را بنویسید..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                            >
                                انصراف
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!reason.trim()}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {rejectingId && <Loader2 className="h-4 w-4 animate-spin" />}
                                تأیید و رد
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}