// resources/js/pages/cartable/index.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle, XCircle, Clock, AlertCircle,
    Eye, ChevronLeft, Filter, Loader2, User, Calendar, MessageSquare,
    TrendingUp, Sparkles, Zap, Target, Award, Bell, Flag,
    ChevronRight, CornerUpRight
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

interface Delegation {
    id: number;
    letter_id: number;
    delegated_note: string | null;
    delegated_at: string;
    status: string;
    letter: {
        id: number;
        subject: string;
        letter_number: string;
        priority: string;
        sender_user: {
            first_name: string;
            last_name: string;
        } | null;
    };
    delegated_by: {
        first_name: string;
        last_name: string;
    };
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
    pendingDelegations: Delegation[];
    acceptedDelegations: Delegation[];
    stats: {
        total: number;
        overdue: number;
        today: number;
        completed_today: number;
        pending_delegations: number;
        accepted_delegations: number;
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

export default function CartableIndex({
    routings,
    pendingDelegations,
    acceptedDelegations,
    stats,
    actionTypes,
    priorities,
    filters
}: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedActionType, setSelectedActionType] = useState(filters.action_type || '');
    const [selectedPriority, setSelectedPriority] = useState(filters.priority || '');
    const [showOnlyOverdue, setShowOnlyOverdue] = useState(filters.overdue || false);
    const [loading, setLoading] = useState(false);
    const [completingId, setCompletingId] = useState<number | null>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [acceptingDelegationId, setAcceptingDelegationId] = useState<number | null>(null);
    const [rejectingDelegationId, setRejectingDelegationId] = useState<number | null>(null);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showRejectDelegationModal, setShowRejectDelegationModal] = useState(false);
    const [selectedRoutingId, setSelectedRoutingId] = useState<number | null>(null);
    const [selectedDelegationId, setSelectedDelegationId] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const [reason, setReason] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [activeTab, setActiveTab] = useState<'routings' | 'delegations'>('routings');

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

    const openRejectDelegationModal = (delegationId: number) => {
        setSelectedDelegationId(delegationId);
        setReason('');
        setShowRejectDelegationModal(true);
    };

    const handleComplete = () => {
        if (!note.trim()) {
            alert('لطفاً یادداشت اقدام را وارد کنید.');
            return;
        }
        if (!selectedRoutingId) return;
        setCompletingId(selectedRoutingId);
        router.post(cartable.complete(selectedRoutingId), { note }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowCompleteModal(false);
                setSelectedRoutingId(null);
                setNote('');
                router.reload();
            },
            onFinish: () => setCompletingId(null),
        });
    };

    const handleReject = () => {
        if (!reason.trim()) {
            alert('لطفاً دلیل رد را وارد کنید.');
            return;
        }
        if (!selectedRoutingId) return;
        setRejectingId(selectedRoutingId);
        router.post(cartable.reject(selectedRoutingId), { reason }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                setSelectedRoutingId(null);
                setReason('');
                router.reload();
            },
            onFinish: () => setRejectingId(null),
        });
    };

    const handleAcceptDelegation = (delegationId: number) => {
        if (!confirm('آیا می‌خواهید این ارجاع را بپذیرید؟')) return;
        setAcceptingDelegationId(delegationId);
        router.post(route('cartable.delegations.accept', { delegation: delegationId }), {}, {
            preserveScroll: true,
            onSuccess: () => router.reload(),
            onFinish: () => setAcceptingDelegationId(null),
        });
    };

    const handleRejectDelegation = () => {
        if (!reason.trim()) {
            alert('لطفاً دلیل رد را وارد کنید.');
            return;
        }
        if (!selectedDelegationId) return;
        setRejectingDelegationId(selectedDelegationId);
        router.post(route('cartable.delegations.reject', { delegation: selectedDelegationId }), { reason }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectDelegationModal(false);
                setSelectedDelegationId(null);
                setReason('');
                router.reload();
            },
            onFinish: () => setRejectingDelegationId(null),
        });
    };

    const actionTypeColors: Record<string, { bg: string; text: string; icon: any }> = {
        action: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Zap },
        information: { bg: 'bg-gray-50', text: 'text-gray-600', icon: Bell },
        approval: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
        coordination: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: Target },
        sign: { bg: 'bg-purple-50', text: 'text-purple-700', icon: Award },
    };

    const priorityConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
        low: { bg: 'bg-gray-100', text: 'text-gray-600', icon: Clock, label: 'کم' },
        normal: { bg: 'bg-blue-100', text: 'text-blue-600', icon: Flag, label: 'عادی' },
        high: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: Flag, label: 'مهم' },
        urgent: { bg: 'bg-orange-100', text: 'text-orange-600', icon: AlertCircle, label: 'فوری' },
        very_urgent: { bg: 'bg-red-100', text: 'text-red-600', icon: AlertCircle, label: 'خیلی فوری' },
    };

    const hasActiveFilters = filters.action_type || filters.priority || filters.overdue;

    const statsCards = [
        { label: 'در انتظار اقدام', value: stats.total, icon: Clock, gradient: 'from-blue-500 to-blue-600' },
        { label: 'تأخیر دار', value: stats.overdue, icon: AlertCircle, gradient: 'from-red-500 to-red-600' },
        { label: 'مهلت امروز', value: stats.today, icon: Calendar, gradient: 'from-amber-500 to-orange-600' },
        { label: 'ارجاع برای پاسخ', value: stats.pending_delegations + stats.accepted_delegations, icon: CornerUpRight, gradient: 'from-amber-500 to-amber-600' },
    ];

    return (
        <>
            <Head title="کارتابل من" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl blur-lg opacity-50"></div>
                                        <div className="relative p-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                                            <Target className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">کارتابل من</h1>
                                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                            <Sparkles className="h-3 w-3 text-blue-500" />
                                            اقدامات و ارجاعات نیازمند پیگیری
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'list'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        لیستی
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        شبکه‌ای
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {statsCards.map((stat) => (
                                <div key={stat.label} className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
                                    <div className="relative p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`p-2.5 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-md`}>
                                                <stat.icon className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 border-b">
                            <button
                                onClick={() => setActiveTab('routings')}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'routings'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Target className="h-4 w-4" />
                                ارجاعات روتینگ
                                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                                    {routings.total}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('delegations')}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'delegations'
                                        ? 'border-amber-600 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <CornerUpRight className="h-4 w-4" />
                                ارجاع برای پاسخ
                                <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-xs">
                                    {pendingDelegations.length + acceptedDelegations.length}
                                </span>
                            </button>
                        </div>

                        {/* Filters Bar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="p-5">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex gap-3 mr-auto">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${showFilters || hasActiveFilters
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Filter className="ml-2 h-4 w-4" />
                                            فیلترها
                                            {hasActiveFilters && (
                                                <span className="mr-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                            )}
                                        </button>
                                        <button
                                            onClick={applyFilters}
                                            disabled={loading}
                                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin inline ml-1" /> : 'اعمال فیلتر'}
                                        </button>
                                    </div>
                                </div>

                                {showFilters && activeTab === 'routings' && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">نوع اقدام</label>
                                                <select
                                                    value={selectedActionType}
                                                    onChange={(e) => setSelectedActionType(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">همه</option>
                                                    {Object.entries(actionTypes).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">اولویت</label>
                                                <select
                                                    value={selectedPriority}
                                                    onChange={(e) => setSelectedPriority(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={resetFilters}
                                                className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                <XCircle className="ml-1 h-4 w-4" />
                                                پاک کردن همه فیلترها
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ==================== TAB: ROUTINGS ==================== */}
                        {activeTab === 'routings' && (
                            <>
                                {viewMode === 'list' ? (
                                    <div className="space-y-3">
                                        {routings.data.length === 0 ? (
                                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                        <Target className="h-12 w-12 text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-500 font-medium">موردی برای نمایش وجود ندارد</p>
                                                    <p className="text-sm text-gray-400 mt-1">کارتابل شما خالی است</p>
                                                </div>
                                            </div>
                                        ) : (
                                            routings.data.map((routing, index) => {
                                                const isOverdue = routing.deadline && new Date(routing.deadline) < new Date();
                                                const action = actionTypes[routing.action_type];
                                                const priority = priorityConfig[routing.letter?.priority] || priorityConfig.normal;
                                                const PriorityIcon = priority.icon;

                                                return (
                                                    <div key={routing.id} className={`group bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${isOverdue ? 'border-red-200 bg-gradient-to-r from-red-50 to-white' : 'border-gray-100'}`}>
                                                        <div className="p-5">
                                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${actionTypeColors[routing.action_type]?.bg} ${actionTypeColors[routing.action_type]?.text}`}>
                                                                            {action}
                                                                        </span>
                                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${priority.bg} ${priority.text}`}>
                                                                            <PriorityIcon className="h-3 w-3" />
                                                                            {priority.label}
                                                                        </span>
                                                                        {isOverdue && (
                                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
                                                                                <AlertCircle className="h-3 w-3" />
                                                                                تأخیر دار
                                                                            </span>
                                                                        )}
                                                                        <span className="text-xs text-gray-400">{routing.letter?.letter_number}</span>
                                                                    </div>
                                                                    <Link href={letters.show(routing.letter_id)} className="text-gray-800 font-semibold hover:text-blue-600 transition line-clamp-2 text-lg">
                                                                        {routing.letter?.subject}
                                                                    </Link>
                                                                    {routing.instruction && (
                                                                        <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                                                                            <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                                            <span>{routing.instruction}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 flex-wrap">
                                                                        <span className="flex items-center gap-1.5">
                                                                            <User className="h-3.5 w-3.5" />
                                                                            از: {routing.from_user?.first_name} {routing.from_user?.last_name}
                                                                        </span>
                                                                        {routing.deadline_jalali && (
                                                                            <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                                                                <Calendar className="h-3.5 w-3.5" />
                                                                                مهلت: {routing.deadline_jalali}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <Link href={letters.show(routing.letter_id)} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                                                                        <Eye className="h-4 w-4" />
                                                                        مشاهده
                                                                    </Link>
                                                                    <button onClick={() => openCompleteModal(routing.id)} disabled={completingId === routing.id} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm transition-all duration-200 shadow-sm disabled:opacity-50">
                                                                        {completingId === routing.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                                                        تکمیل
                                                                    </button>
                                                                    <button onClick={() => openRejectModal(routing.id)} disabled={rejectingId === routing.id} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm transition-all duration-200 shadow-sm disabled:opacity-50">
                                                                        {rejectingId === routing.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                                                        رد
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {routings.data.length === 0 ? (
                                            <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                        <Target className="h-12 w-12 text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-500 font-medium">موردی برای نمایش وجود ندارد</p>
                                                    <p className="text-sm text-gray-400 mt-1">کارتابل شما خالی است</p>
                                                </div>
                                            </div>
                                        ) : (
                                            routings.data.map((routing) => {
                                                const isOverdue = routing.deadline && new Date(routing.deadline) < new Date();
                                                const action = actionTypes[routing.action_type];
                                                const priority = priorityConfig[routing.letter?.priority] || priorityConfig.normal;
                                                const PriorityIcon = priority.icon;

                                                return (
                                                    <div key={routing.id} className={`group bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isOverdue ? 'border-red-200 bg-gradient-to-r from-red-50 to-white' : 'border-gray-100'}`}>
                                                        <div className="p-5">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${actionTypeColors[routing.action_type]?.bg} ${actionTypeColors[routing.action_type]?.text}`}>
                                                                        {action}
                                                                    </span>
                                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${priority.bg} ${priority.text}`}>
                                                                        <PriorityIcon className="h-3 w-3" />
                                                                        {priority.label}
                                                                    </span>
                                                                </div>
                                                                {isOverdue && (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
                                                                        <AlertCircle className="h-3 w-3" />
                                                                        تأخیر
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <Link href={letters.show(routing.letter_id)} className="text-gray-800 font-semibold hover:text-blue-600 transition line-clamp-2 text-base block mb-2">
                                                                {routing.letter?.subject}
                                                            </Link>
                                                            <p className="text-xs text-gray-400 mb-3">{routing.letter?.letter_number}</p>
                                                            {routing.instruction && (
                                                                <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                                                                    <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                                                    <span className="line-clamp-2">{routing.instruction}</span>
                                                                </div>
                                                            )}
                                                            <div className="mt-4 pt-3 border-t border-gray-100">
                                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                                    <span className="flex items-center gap-1.5">
                                                                        <User className="h-3.5 w-3.5" />
                                                                        {routing.from_user?.first_name} {routing.from_user?.last_name}
                                                                    </span>
                                                                    {routing.deadline_jalali && (
                                                                        <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                                                                            <Calendar className="h-3.5 w-3.5" />
                                                                            {routing.deadline_jalali}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 flex items-center gap-2">
                                                                <Link href={letters.show(routing.letter_id)} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                                                                    <Eye className="h-4 w-4" />
                                                                    مشاهده
                                                                </Link>
                                                                <button onClick={() => openCompleteModal(routing.id)} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm transition-all duration-200">
                                                                    <CheckCircle className="h-4 w-4" />
                                                                    تکمیل
                                                                </button>
                                                                <button onClick={() => openRejectModal(routing.id)} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm transition-all duration-200">
                                                                    <XCircle className="h-4 w-4" />
                                                                    رد
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}

                                {/* Pagination */}
                                {routings.last_page > 1 && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-gray-600">
                                            نمایش {routings.from} تا {routings.to} از {routings.total} نتیجه
                                        </div>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => { if (routings.current_page > 1) router.get(cartable.index(), { page: routings.current_page - 1, ...filters }); }}
                                                disabled={routings.current_page === 1}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${routings.current_page > 1 ? 'text-gray-700 hover:bg-white hover:text-blue-600 shadow-sm' : 'text-gray-300 cursor-not-allowed'}`}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                            {[...Array(Math.min(5, routings.last_page))].map((_, i) => {
                                                let pageNum;
                                                if (routings.last_page <= 5) pageNum = i + 1;
                                                else if (routings.current_page <= 3) pageNum = i + 1;
                                                else if (routings.current_page >= routings.last_page - 2) pageNum = routings.last_page - 4 + i;
                                                else pageNum = routings.current_page - 2 + i;
                                                return (
                                                    <button key={pageNum} onClick={() => router.get(cartable.index(), { page: pageNum, ...filters })} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${routings.current_page === pageNum ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'text-gray-700 hover:bg-white hover:text-blue-600'}`}>
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={() => { if (routings.current_page < routings.last_page) router.get(cartable.index(), { page: routings.current_page + 1, ...filters }); }}
                                                disabled={routings.current_page === routings.last_page}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${routings.current_page < routings.last_page ? 'text-gray-700 hover:bg-white hover:text-blue-600 shadow-sm' : 'text-gray-300 cursor-not-allowed'}`}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ==================== TAB: DELEGATIONS ==================== */}
                        {activeTab === 'delegations' && (
                            <div className="space-y-6">
                                {/* در انتظار تصمیم (pending) */}
                                {pendingDelegations.length > 0 && (
                                    <div>
                                        <h2 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-amber-500" />
                                            در انتظار تصمیم شما
                                            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-xs">
                                                {pendingDelegations.length}
                                            </span>
                                        </h2>
                                        <div className="space-y-3">
                                            {pendingDelegations.map((delegation, index) => {
                                                const priority = priorityConfig[delegation.letter?.priority] || priorityConfig.normal;
                                                const PriorityIcon = priority.icon;
                                                return (
                                                    <div key={delegation.id} className="group bg-white rounded-2xl shadow-sm border border-amber-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                                                        <div className="p-5 border-r-4 border-r-amber-400">
                                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-700">
                                                                            <CornerUpRight className="h-3 w-3" />
                                                                            ارجاع برای پاسخ
                                                                        </span>
                                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${priority.bg} ${priority.text}`}>
                                                                            <PriorityIcon className="h-3 w-3" />
                                                                            {priority.label}
                                                                        </span>
                                                                        <span className="text-xs text-gray-400">{delegation.letter?.letter_number}</span>
                                                                    </div>
                                                                    <Link href={letters.show(delegation.letter.id)} className="text-gray-800 font-semibold hover:text-amber-600 transition line-clamp-2 text-lg">
                                                                        {delegation.letter?.subject}
                                                                    </Link>
                                                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                                                        <User className="h-4 w-4" />
                                                                        <span>ارجاع شده توسط: {delegation.delegated_by?.first_name} {delegation.delegated_by?.last_name}</span>
                                                                    </div>
                                                                    {delegation.delegated_note && (
                                                                        <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 bg-amber-50 rounded-xl px-3 py-2">
                                                                            <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                                            <span>{delegation.delegated_note}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                                                        <span className="flex items-center gap-1.5">
                                                                            <Calendar className="h-3.5 w-3.5" />
                                                                            تاریخ ارجاع: {new Date(delegation.delegated_at).toLocaleDateString('fa-IR')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <Link href={letters.show(delegation.letter.id)} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                                                                        <Eye className="h-4 w-4" />
                                                                        مشاهده
                                                                    </Link>
                                                                    <button onClick={() => handleAcceptDelegation(delegation.id)} disabled={acceptingDelegationId === delegation.id} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm transition-all duration-200 shadow-sm disabled:opacity-50">
                                                                        {acceptingDelegationId === delegation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                                                        پذیرش
                                                                    </button>
                                                                    <button onClick={() => openRejectDelegationModal(delegation.id)} disabled={rejectingDelegationId === delegation.id} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm transition-all duration-200 shadow-sm disabled:opacity-50">
                                                                        {rejectingDelegationId === delegation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                                                        رد
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* پذیرفته شده - در انتظار پاسخ (accepted) */}
                                {acceptedDelegations.length > 0 && (
                                    <div>
                                        <h2 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                            پذیرفته شده - در انتظار پاسخ شما
                                            <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full text-xs">
                                                {acceptedDelegations.length}
                                            </span>
                                        </h2>
                                        <div className="space-y-3">
                                            {acceptedDelegations.map((delegation, index) => {
                                                const priority = priorityConfig[delegation.letter?.priority] || priorityConfig.normal;
                                                const PriorityIcon = priority.icon;
                                                return (
                                                    <div key={delegation.id} className="group bg-white rounded-2xl shadow-sm border border-emerald-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                                                        <div className="p-5 border-r-4 border-r-emerald-400">
                                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700">
                                                                            <CheckCircle className="h-3 w-3" />
                                                                            پذیرفته شده
                                                                        </span>
                                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${priority.bg} ${priority.text}`}>
                                                                            <PriorityIcon className="h-3 w-3" />
                                                                            {priority.label}
                                                                        </span>
                                                                        <span className="text-xs text-gray-400">{delegation.letter?.letter_number}</span>
                                                                    </div>
                                                                    <Link href={letters.show(delegation.letter.id)} className="text-gray-800 font-semibold hover:text-emerald-600 transition line-clamp-2 text-lg">
                                                                        {delegation.letter?.subject}
                                                                    </Link>
                                                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                                                        <User className="h-4 w-4" />
                                                                        <span>ارجاع شده توسط: {delegation.delegated_by?.first_name} {delegation.delegated_by?.last_name}</span>
                                                                    </div>
                                                                    {delegation.delegated_note && (
                                                                        <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                                                                            <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                                            <span>{delegation.delegated_note}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                                                        <span className="flex items-center gap-1.5">
                                                                            <Calendar className="h-3.5 w-3.5" />
                                                                            تاریخ ارجاع: {new Date(delegation.delegated_at).toLocaleDateString('fa-IR')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <Link href={letters.show(delegation.letter.id)} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                                                                        <Eye className="h-4 w-4" />
                                                                        مشاهده
                                                                    </Link>
                                                                    <Link href={letters.reply.form({ letter: delegation.letter.id })} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm transition-all duration-200 shadow-sm">
                                                                        <MessageSquare className="h-4 w-4" />
                                                                        ثبت پاسخ
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {pendingDelegations.length === 0 && acceptedDelegations.length === 0 && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                <CornerUpRight className="h-12 w-12 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium">هیچ مکتوبی به شما ارجاع نشده است</p>
                                            <p className="text-sm text-gray-400 mt-1">وقتی مکتوبی به شما ارجاع شود، در اینجا نمایش داده می‌شود</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Complete Modal */}
            {showCompleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">تکمیل اقدام</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">لطفاً یادداشت اقدام را وارد کنید</p>
                        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="نتیجه اقدام انجام شده را بنویسید..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" autoFocus />
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowCompleteModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition">انصراف</button>
                            <button onClick={handleComplete} disabled={!note.trim()} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition disabled:opacity-50">
                                {completingId && <Loader2 className="h-4 w-4 animate-spin" />}
                                تأیید و تکمیل
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">رد اقدام</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">لطفاً دلیل رد را وارد کنید</p>
                        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="دلیل رد را بنویسید..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" autoFocus />
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition">انصراف</button>
                            <button onClick={handleReject} disabled={!reason.trim()} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition disabled:opacity-50">
                                {rejectingId && <Loader2 className="h-4 w-4 animate-spin" />}
                                تأیید و رد
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Delegation Modal */}
            {showRejectDelegationModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">رد ارجاع مکتوب</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">لطفاً دلیل رد را وارد کنید</p>
                        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="دلیل رد ارجاع را بنویسید..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" autoFocus />
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowRejectDelegationModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition">انصراف</button>
                            <button onClick={handleRejectDelegation} disabled={!reason.trim()} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition disabled:opacity-50">
                                {rejectingDelegationId && <Loader2 className="h-4 w-4 animate-spin" />}
                                تأیید و رد
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}