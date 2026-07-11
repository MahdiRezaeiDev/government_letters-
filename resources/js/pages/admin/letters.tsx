import { Head, Link, router } from '@inertiajs/react';
import {
    Search, Filter, Eye, X, ChevronRight, ChevronLeft,
    FileText, Clock, CheckCircle, XCircle, Archive, Mail,
    AlertTriangle, TrendingUp, MessageCircle, BarChart3,
    Building2, ShieldCheck, RotateCcw
} from 'lucide-react';
import { useState } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import PersianDatePicker from '@/components/PersianDatePicker';
import { formatGregorianMonthKey } from '@/lib/afghan-calendar';

const inputClass = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white";

interface LetterRow {
    id: number;
    subject: string;
    letter_number: string;
    tracking_number: string;
    letter_type: string;
    priority: string;
    security_level: string;
    final_status: string;
    is_draft: boolean;
    created_at: string;
    replies_count: number;
    sender_name: string | null;
    recipient_name: string | null;
    organization?: { id: number; name: string } | null;
    recipient_organization?: { id: number; name: string } | null;
    sender_department?: { id: number; name: string } | null;
    recipient_department?: { id: number; name: string } | null;
    category?: { id: number; name: string } | null;
}

interface Props {
    letters: {
        data: LetterRow[];
        current_page: number;
        last_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        draft: number;
        archived: number;
        replied: number;
        today: number;
        this_week: number;
        this_month: number;
        urgent: number;
    };
    monthlyTrend: { month: string; label?: string; count: number }[];
    statusDistribution: { name: string; value: number; color: string }[];
    topOrganizations: { name: string; count: number }[];
    organizations: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    filters: Record<string, string | undefined>;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    draft:    { label: 'پیش‌نویس',  bg: 'bg-slate-100',   text: 'text-slate-600' },
    pending:  { label: 'در انتظار', bg: 'bg-amber-100',   text: 'text-amber-700' },
    approved: { label: 'تایید شده', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    rejected: { label: 'رد شده',    bg: 'bg-red-100',     text: 'text-red-700' },
    archived: { label: 'بایگانی',   bg: 'bg-indigo-100',  text: 'text-indigo-700' },
};

const priorityConfig: Record<string, { label: string; bg: string; text: string }> = {
    low:         { label: 'کم',        bg: 'bg-slate-100',  text: 'text-slate-600' },
    normal:      { label: 'عادی',      bg: 'bg-blue-100',   text: 'text-blue-700' },
    high:        { label: 'مهم',       bg: 'bg-yellow-100', text: 'text-yellow-700' },
    urgent:      { label: 'فوری',      bg: 'bg-orange-100', text: 'text-orange-700' },
    very_urgent: { label: 'خیلی فوری', bg: 'bg-red-100',    text: 'text-red-700' },
};

const securityLabels: Record<string, string> = {
    public: 'عمومی',
    internal: 'داخلی',
    confidential: 'محرمانه',
    secret: 'سری',
    top_secret: 'بسیار سری',
};

export default function AdminLettersDashboard({
    letters,
    stats,
    monthlyTrend,
    statusDistribution,
    topOrganizations,
    organizations,
    categories,
    filters,
}: Props) {
    const [showFilters, setShowFilters] = useState(true);
    const [form, setForm] = useState({
        search: filters.search || '',
        organization_id: filters.organization_id || '',
        letter_type: filters.letter_type || '',
        status: filters.status || '',
        priority: filters.priority || '',
        security_level: filters.security_level || '',
        category_id: filters.category_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        has_replies: filters.has_replies || '',
        is_draft: filters.is_draft || '',
        sender_name: filters.sender_name || '',
        recipient_name: filters.recipient_name || '',
    });

    const setField = (key: string, value: string) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const applyFilters = (page?: number) => {
        const params: Record<string, string | number> = {};
        Object.entries(form).forEach(([key, value]) => {
            if (value) {
                params[key] = value;
            }
        });
        if (page) {
            params.page = page;
        }
        router.get('/admin/letters-dashboard', params, { preserveState: true, preserveScroll: true });
    };

    const resetFilters = () => {
        setForm({
            search: '', organization_id: '', letter_type: '', status: '',
            priority: '', security_level: '', category_id: '', date_from: '',
            date_to: '', has_replies: '', is_draft: '', sender_name: '', recipient_name: '',
        });
        router.get('/admin/letters-dashboard');
    };

    const activeFilterCount = Object.values(form).filter(Boolean).length;

    const statCards = [
        { label: 'کل مکاتیب', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'در انتظار', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'تایید شده', value: stats.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'رد شده', value: stats.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'پیش‌نویس', value: stats.draft, icon: FileText, color: 'text-slate-500', bg: 'bg-slate-100' },
        { label: 'بایگانی', value: stats.archived, icon: Archive, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'دارای پاسخ', value: stats.replied, icon: MessageCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'فوری', value: stats.urgent, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'امروز', value: stats.today, icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
        { label: 'این هفته', value: stats.this_week, icon: Mail, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        { label: 'این ماه', value: stats.this_month, icon: BarChart3, color: 'text-violet-600', bg: 'bg-violet-50' },
    ];

    const chartData = monthlyTrend.map(item => ({
        ...item,
        label: item.label ?? formatGregorianMonthKey(item.month, true),
    }));

    return (
        <>
            <Head title="داشبورد مکاتیب — ادمین کل" />

            <div className="min-h-screen">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <ShieldCheck className="h-6 w-6 text-indigo-600" />
                                داشبورد مکاتیب — ادمین کل
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                دسترسی کامل به تمام مکاتیب سیستم با فیلترهای پیشرفته
                            </p>
                        </div>
                        <button
                            onClick={() => setShowFilters(v => !v)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition"
                        >
                            <Filter className="h-4 w-4" />
                            فیلترها
                            {activeFilterCount > 0 && (
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-3">
                        {statCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-3">
                                    <div className={`inline-flex p-1.5 rounded-lg ${card.bg} mb-2`}>
                                        <Icon className={`h-4 w-4 ${card.color}`} />
                                    </div>
                                    <p className="text-lg font-bold text-slate-900">{card.value}</p>
                                    <p className="text-[10px] text-slate-500 leading-tight">{card.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Advanced filters */}
                    {showFilters && (
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-indigo-500" />
                                    فیلترهای پیشرفته
                                </h2>
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 transition"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    پاک کردن همه
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-slate-500 mb-1">جستجو (موضوع، شماره، متن، فرستنده، گیرنده)</label>
                                    <div className="relative">
                                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={form.search}
                                            onChange={(e) => setField('search', e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                            placeholder="جستجو..."
                                            className={`${inputClass} pr-9`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">وزارت</label>
                                    <select value={form.organization_id} onChange={(e) => setField('organization_id', e.target.value)} className={inputClass}>
                                        <option value="">همه وزارت‌ها</option>
                                        {organizations.map(org => (
                                            <option key={org.id} value={org.id}>{org.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">کتگوری</label>
                                    <select value={form.category_id} onChange={(e) => setField('category_id', e.target.value)} className={inputClass}>
                                        <option value="">همه</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">نوع مکتوب</label>
                                    <select value={form.letter_type} onChange={(e) => setField('letter_type', e.target.value)} className={inputClass}>
                                        <option value="">همه</option>
                                        <option value="internal">داخلی</option>
                                        <option value="external">خارجی</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">وضعیت</label>
                                    <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={inputClass}>
                                        <option value="">همه</option>
                                        <option value="draft">پیش‌نویس</option>
                                        <option value="pending">در انتظار</option>
                                        <option value="approved">تایید شده</option>
                                        <option value="rejected">رد شده</option>
                                        <option value="archived">بایگانی</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">اولویت</label>
                                    <select value={form.priority} onChange={(e) => setField('priority', e.target.value)} className={inputClass}>
                                        <option value="">همه</option>
                                        <option value="low">کم</option>
                                        <option value="normal">عادی</option>
                                        <option value="high">مهم</option>
                                        <option value="urgent">فوری</option>
                                        <option value="very_urgent">خیلی فوری</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">سطح امنیتی</label>
                                    <select value={form.security_level} onChange={(e) => setField('security_level', e.target.value)} className={inputClass}>
                                        <option value="">همه</option>
                                        <option value="public">عمومی</option>
                                        <option value="internal">داخلی</option>
                                        <option value="confidential">محرمانه</option>
                                        <option value="secret">سری</option>
                                        <option value="top_secret">بسیار سری</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">وضعیت پاسخ</label>
                                    <select value={form.has_replies} onChange={(e) => setField('has_replies', e.target.value)} className={inputClass}>
                                        <option value="">همه</option>
                                        <option value="1">دارای پاسخ</option>
                                        <option value="0">بدون پاسخ</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">پیش‌نویس</label>
                                    <select value={form.is_draft} onChange={(e) => setField('is_draft', e.target.value)} className={inputClass}>
                                        <option value="">همه</option>
                                        <option value="1">فقط پیش‌نویس</option>
                                        <option value="0">بدون پیش‌نویس</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">نام فرستنده</label>
                                    <input
                                        type="text"
                                        value={form.sender_name}
                                        onChange={(e) => setField('sender_name', e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        placeholder="نام فرستنده..."
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">نام گیرنده</label>
                                    <input
                                        type="text"
                                        value={form.recipient_name}
                                        onChange={(e) => setField('recipient_name', e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        placeholder="نام گیرنده..."
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">از تاریخ</label>
                                    <PersianDatePicker
                                        value={form.date_from}
                                        onChange={(date) => setField('date_from', (date as string) || '')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">تا تاریخ</label>
                                    <PersianDatePicker
                                        value={form.date_to}
                                        onChange={(date) => setField('date_to', (date as string) || '')}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                                >
                                    <X className="h-4 w-4 inline ml-1" />
                                    پاک کردن
                                </button>
                                <button
                                    onClick={() => applyFilters()}
                                    className="px-5 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    <Search className="h-4 w-4 inline ml-1" />
                                    اعمال فیلتر
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
                            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-indigo-500" />
                                روند ۱۲ ماه اخیر
                            </h2>
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" name="مکاتیب" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h2 className="font-semibold text-slate-900 mb-4">توزیع وضعیت</h2>
                            {statusDistribution.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-10">داده‌ای موجود نیست</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={statusDistribution}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={55}
                                            outerRadius={85}
                                            paddingAngle={3}
                                        >
                                            {statusDistribution.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Top organizations */}
                    {topOrganizations.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-indigo-500" />
                                وزارت‌های پرمکاتبه
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                                {topOrganizations.map((org) => (
                                    <div key={org.name} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                                        <p className="text-lg font-bold text-indigo-600">{org.count}</p>
                                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{org.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Letters table */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-semibold text-slate-900">لیست مکاتیب</h2>
                            <span className="text-xs text-slate-500">
                                {letters.total} نتیجه
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="text-right px-4 py-3 font-medium">موضوع / شماره</th>
                                        <th className="text-right px-4 py-3 font-medium">فرستنده</th>
                                        <th className="text-right px-4 py-3 font-medium">گیرنده</th>
                                        <th className="text-center px-3 py-3 font-medium">وزارت</th>
                                        <th className="text-center px-3 py-3 font-medium">وضعیت</th>
                                        <th className="text-center px-3 py-3 font-medium">اولویت</th>
                                        <th className="text-center px-3 py-3 font-medium">امنیت</th>
                                        <th className="text-center px-3 py-3 font-medium">پاسخ</th>
                                        <th className="text-center px-3 py-3 font-medium">تاریخ</th>
                                        <th className="text-center px-3 py-3 font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {letters.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="text-center py-14 text-slate-400">
                                                <FileText className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                                                مکتوبی با این فیلترها یافت نشد
                                            </td>
                                        </tr>
                                    ) : (
                                        letters.data.map((letter) => {
                                            const status = statusConfig[letter.final_status] || statusConfig.pending;
                                            const priority = priorityConfig[letter.priority] || priorityConfig.normal;

                                            return (
                                                <tr key={letter.id} className="hover:bg-slate-50 transition">
                                                    <td className="px-4 py-3 max-w-[280px]">
                                                        <Link
                                                            href={`/letters/${letter.id}`}
                                                            className="font-medium text-slate-900 hover:text-indigo-600 line-clamp-1"
                                                        >
                                                            {letter.subject}
                                                        </Link>
                                                        <p className="text-xs text-slate-400 font-mono mt-0.5">{letter.letter_number}</p>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-slate-700 line-clamp-1">{letter.sender_name || '—'}</p>
                                                        {letter.sender_department && (
                                                            <p className="text-xs text-slate-400 line-clamp-1">{letter.sender_department.name}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-slate-700 line-clamp-1">{letter.recipient_name || '—'}</p>
                                                        {letter.recipient_department && (
                                                            <p className="text-xs text-slate-400 line-clamp-1">{letter.recipient_department.name}</p>
                                                        )}
                                                    </td>
                                                    <td className="text-center px-3 py-3">
                                                        <p className="text-xs text-slate-600 line-clamp-2 max-w-[120px] mx-auto">
                                                            {letter.organization?.name || '—'}
                                                        </p>
                                                    </td>
                                                    <td className="text-center px-3 py-3">
                                                        <span className={`inline-block px-2 py-1 rounded-full text-[11px] font-medium ${status.bg} ${status.text}`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="text-center px-3 py-3">
                                                        <span className={`inline-block px-2 py-1 rounded-full text-[11px] font-medium ${priority.bg} ${priority.text}`}>
                                                            {priority.label}
                                                        </span>
                                                    </td>
                                                    <td className="text-center px-3 py-3 text-xs text-slate-500">
                                                        {securityLabels[letter.security_level] || letter.security_level}
                                                    </td>
                                                    <td className="text-center px-3 py-3">
                                                        {letter.replies_count > 0 ? (
                                                            <span className="inline-flex items-center gap-1 text-xs text-purple-600">
                                                                <MessageCircle className="h-3.5 w-3.5" />
                                                                {letter.replies_count}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-slate-300">—</span>
                                                        )}
                                                    </td>
                                                    <td className="text-center px-3 py-3 text-xs text-slate-500 whitespace-nowrap">
                                                        {new Date(letter.created_at).toLocaleDateString('fa-IR')}
                                                    </td>
                                                    <td className="text-center px-3 py-3">
                                                        <Link
                                                            href={`/letters/${letter.id}`}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-100 transition"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            مشاهده
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {letters.last_page > 1 && (
                            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-xs text-slate-500">
                                    نمایش {letters.from} تا {letters.to} از {letters.total}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => applyFilters(letters.current_page - 1)}
                                        disabled={letters.current_page === 1}
                                        className="p-2 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition"
                                    >
                                        <ChevronRight className="h-4 w-4 text-slate-600" />
                                    </button>
                                    <span className="text-sm text-slate-700 px-2">
                                        {letters.current_page} / {letters.last_page}
                                    </span>
                                    <button
                                        onClick={() => applyFilters(letters.current_page + 1)}
                                        disabled={letters.current_page === letters.last_page}
                                        className="p-2 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition"
                                    >
                                        <ChevronLeft className="h-4 w-4 text-slate-600" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
