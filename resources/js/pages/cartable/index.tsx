import { Head, router } from '@inertiajs/react';
import { 
    CheckCircle, XCircle, Clock, AlertCircle, 
    Eye, ChevronLeft, Filter 
} from 'lucide-react';
import { useState } from 'react';
import  cartable  from '@/routes/cartable';
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

    const handleComplete = (routingId: number) => {
        if (!note.trim()) {
            alert('لطفاً یادداشت اقدام را وارد کنید.');

            return;
        }
        
        router.post(cartable.complete(routingId), { note }, {
            preserveScroll: true,
            onStart: () => setCompletingId(routingId),
            onFinish: () => {
                setCompletingId(null);
                setNote('');
            },
        });
    };

    const handleReject = (routingId: number) => {
        if (!reason.trim()) {
            alert('لطفاً دلیل رد را وارد کنید.');

            return;
        }
        
        router.post(cartable.reject(routingId), { reason }, {
            preserveScroll: true,
            onStart: () => setRejectingId(routingId),
            onFinish: () => {
                setRejectingId(null);
                setReason('');
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
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
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
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
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
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
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
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
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
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <Filter className="h-4 w-4" />
                            فیلترها
                            <ChevronLeft className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-0' : 'rotate-180'}`} />
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
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    پاک کردن فیلترها
                                </button>
                                <button
                                    onClick={applyFilters}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'در حال اعمال...' : 'اعمال فیلتر'}
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
                            const priority = priorities[routing.letter?.priority];
                            
                            return (
                                <div
                                    key={routing.id}
                                    className={`bg-white rounded-xl shadow-sm border p-5 transition ${
                                        isOverdue ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
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
                                            
                                            <div className="flex items-start gap-2">
                                                <span className="text-gray-800 font-semibold">
                                                    {routing.letter?.subject}
                                                </span>
                                            </div>
                                            
                                            {routing.instruction && (
                                                <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg px-3 py-2">
                                                    📌 {routing.instruction}
                                                </p>
                                            )}
                                            
                                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                                <span>از: {routing.from_user?.first_name} {routing.from_user?.last_name}</span>
                                                {routing.deadline_jalali && (
                                                    <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                                                        <Clock className="h-3 w-3" />
                                                        مهلت: {routing.deadline_jalali}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <a
                                                href={letters.show(routing.letter_id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                مشاهده
                                            </a>
                                            <button
                                                onClick={() => {
                                                    setCompletingId(routing.id);
                                                    const note = prompt('لطفاً یادداشت اقدام را وارد کنید:');

                                                    if (note) {
                                                    handleComplete(routing.id);
                                                    } else {
                                                    setCompletingId(null);
                                                    }
                                                }}
                                                disabled={completingId === routing.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs transition disabled:opacity-50"
                                            >
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                {completingId === routing.id ? 'در حال...' : 'تکمیل'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setRejectingId(routing.id);
                                                    const reason = prompt('لطفاً دلیل رد را وارد کنید:');

                                                    if (reason) {
                                                    handleReject(routing.id);
                                                    } else {
                                                    setRejectingId(null);
                                                    }
                                                }}
                                                disabled={rejectingId === routing.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs transition disabled:opacity-50"
                                            >
                                                <XCircle className="h-3.5 w-3.5" />
                                                {rejectingId === routing.id ? 'در حال...' : 'رد'}
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
                    <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
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
                                className={`px-3 py-1 rounded-lg text-sm ${routings.current_page > 1 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                            >
                                قبلی
                            </button>
                            {[...Array(Math.min(5, routings.last_page))].map((_, i) => {
                                let pageNum;

                                if (routings.last_page <= 5) {
                                    pageNum = i + 1;
                                } else if (routings.current_page <= 3) {
                                    pageNum = i + 1;
                                } else if (routings.current_page >= routings.last_page - 2) {
                                    pageNum = routings.last_page - 4 + i;
                                } else {
                                    pageNum = routings.current_page - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => router.get(cartable.index(), { page: pageNum, ...filters })}
                                        className={`px-3 py-1 rounded-lg text-sm ${routings.current_page === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => {
                                    if (routings.current_page < routings.last_page) {
                                        router.get(cartable.index(), { page: routings.current_page + 1, ...filters });
                                    }
                                }}
                                disabled={routings.current_page === routings.last_page}
                                className={`px-3 py-1 rounded-lg text-sm ${routings.current_page < routings.last_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                            >
                                بعدی
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}