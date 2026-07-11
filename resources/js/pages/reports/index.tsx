import { Head, router } from '@inertiajs/react';
import {
    FileText, Download, Filter, TrendingUp, Users, Mail,
    Clock, CheckCircle, XCircle, Archive, AlertTriangle,
    BarChart3, Building2, RotateCcw, Send, Inbox, MessageCircle,
    ArrowRightLeft, Shield
} from 'lucide-react';
import { useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import PersianDatePicker from '@/components/PersianDatePicker';

// ─── Types ───────────────────────────────────────────────────

interface Overview {
    total: number; incoming: number; outgoing: number; internal: number;
    pending: number; approved: number; rejected: number; archived: number;
    replied: number; urgent: number; today: number; this_week: number; this_month: number;
}

interface ChartItem { name: string; value: number; color: string }
interface MonthlyItem { month: string; count?: number; incoming?: number; replies?: number }
interface DeptItem { department: string; count: number }
interface OrgItem { name: string; count: number }
interface UserPerf { name: string; count: number }
interface RoutingStats { total: number; pending: number; completed: number; rejected: number; reception: number }

interface ReceptionStats {
    reception: {
        total_received: number; pending: number; forwarded: number; rejected: number;
        today_received: number; week_received: number; month_received: number; month_forwarded: number;
    };
    department: {
        total_incoming: number; total_replies: number; replies_today: number;
        replies_this_week: number; replies_this_month: number;
        incoming_today: number; incoming_this_month: number;
    };
}

interface DeptBreakdown {
    id: number; name: string; code: string; organization: string;
    received: number; pending: number; forwarded: number;
    incoming_letters: number; replies: number;
}

interface ReportContext {
    role: 'super-admin' | 'org-admin' | 'dept-manager' | 'reception' | 'user';
    title: string; description: string; scope_label: string;
}

interface Report {
    context: ReportContext;
    overview: Overview;
    monthly_trend: MonthlyItem[];
    type_distribution: ChartItem[];
    status_distribution: ChartItem[];
    priority_distribution: ChartItem[];
    organization_stats?: OrgItem[];
    department_stats?: DeptItem[];
    user_performance?: UserPerf[];
    routing_stats?: RoutingStats;
    reception_stats?: ReceptionStats;
    department_breakdown?: DeptBreakdown[];
}

interface FilterOptions {
    organizations: { id: number; name: string }[];
    departments: { id: number; name: string }[];
}

interface Filters {
    date_from?: string; date_to?: string; type?: string; status?: string;
    priority?: string; organization_id?: string; department_id?: string;
}

interface Props {
    report: Report;
    filterOptions: FilterOptions;
    filters: Filters;
    canExport: boolean;
}

const inputClass = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white";

// ─── Sub-components ──────────────────────────────────────────

function StatCard({ label, value, icon: Icon, gradient }: {
    label: string; value: number; icon: React.ElementType; gradient: string;
}) {
    return (
        <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-4 overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}>
            <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full" />
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-white/80 text-[11px] font-medium">{label}</p>
                    <p className="text-2xl font-bold text-white mt-0.5">{value.toLocaleString('fa-IR')}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-xl">
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </div>
        </div>
    );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5 mb-4">{subtitle}</p>}
            {!subtitle && <div className="mb-4" />}
            {children}
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────

export default function ReportsIndex({ report, filterOptions, filters, canExport }: Props) {
    const { context, overview } = report;
    const isReception = context.role === 'reception';

    const [form, setForm] = useState({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        type: filters.type || 'all',
        status: filters.status || 'all',
        priority: filters.priority || 'all',
        organization_id: filters.organization_id || '',
        department_id: filters.department_id || '',
    });

    const setField = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

    const applyFilters = () => {
        const params: Record<string, string> = {};
        Object.entries(form).forEach(([k, v]) => {
            if (v && v !== 'all') params[k] = v;
        });
        router.get('/reports', params, { preserveState: true, preserveScroll: true });
    };

    const resetFilters = () => {
        setForm({ date_from: '', date_to: '', type: 'all', status: 'all', priority: 'all', organization_id: '', department_id: '' });
        router.get('/reports');
    };

    const hasActiveFilters = Object.entries(form).some(([, v]) => v && v !== 'all');

    const handleExportExcel = () => {
        const params = new URLSearchParams();
        Object.entries(form).forEach(([k, v]) => { if (v && v !== 'all') params.set(k, v); });
        window.location.href = `/reports/export-excel?${params.toString()}`;
    };

    // ─── Role-specific overview cards ────────────────────────

    const overviewCards = isReception && report.reception_stats ? [
        { label: 'دریافت‌شده در دبیرخانه', value: report.reception_stats.reception.total_received, icon: Inbox, gradient: 'from-indigo-500 to-indigo-600' },
        { label: 'در انتظار ارجاع', value: report.reception_stats.reception.pending, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
        { label: 'ارجاع‌شده', value: report.reception_stats.reception.forwarded, icon: ArrowRightLeft, gradient: 'from-emerald-500 to-teal-500' },
        { label: 'رد شده', value: report.reception_stats.reception.rejected, icon: XCircle, gradient: 'from-red-500 to-rose-500' },
        { label: 'نامه‌های وارده ریاست', value: report.reception_stats.department.total_incoming, icon: Mail, gradient: 'from-blue-500 to-cyan-500' },
        { label: 'پاسخ‌های ریاست', value: report.reception_stats.department.total_replies, icon: MessageCircle, gradient: 'from-violet-500 to-purple-500' },
        { label: 'امروز دریافت', value: report.reception_stats.reception.today_received, icon: TrendingUp, gradient: 'from-sky-500 to-blue-500' },
        { label: 'پاسخ این ماه', value: report.reception_stats.department.replies_this_month, icon: Send, gradient: 'from-teal-500 to-emerald-500' },
    ] : [
        { label: 'مجموع مکاتیب', value: overview.total, icon: FileText, gradient: 'from-indigo-500 to-indigo-600' },
        { label: 'وارده', value: overview.incoming, icon: Inbox, gradient: 'from-emerald-500 to-teal-500' },
        { label: 'صادره', value: overview.outgoing, icon: Send, gradient: 'from-violet-500 to-purple-500' },
        { label: 'داخلی', value: overview.internal, icon: Mail, gradient: 'from-blue-500 to-cyan-500' },
        { label: 'در انتظار', value: overview.pending, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
        { label: 'تایید شده', value: overview.approved, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
        { label: 'رد شده', value: overview.rejected, icon: XCircle, gradient: 'from-red-500 to-rose-500' },
        { label: 'بایگانی', value: overview.archived, icon: Archive, gradient: 'from-slate-500 to-slate-600' },
    ];

    const secondaryCards = !isReception ? [
        { label: 'فوری/عاجل', value: overview.urgent, icon: AlertTriangle, color: 'text-red-600' },
        { label: 'دارای پاسخ', value: overview.replied, icon: MessageCircle, color: 'text-indigo-600' },
        { label: 'امروز', value: overview.today, icon: TrendingUp, color: 'text-sky-600' },
        { label: 'این هفته', value: overview.this_week, icon: BarChart3, color: 'text-violet-600' },
        { label: 'این ماه', value: overview.this_month, icon: BarChart3, color: 'text-emerald-600' },
    ] : [];

    return (
        <>
            <Head title={context.title} />

            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* ─── Header ─── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900">{context.title}</h1>
                            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                {context.scope_label}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">{context.description}</p>
                    </div>
                    {canExport && (
                        <button
                            onClick={handleExportExcel}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-md shadow-emerald-200/50"
                        >
                            <Download className="h-4 w-4" />
                            خروجی Excel
                        </button>
                    )}
                </div>

                {/* ─── Filters ─── */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-4 w-4 text-indigo-500" />
                        <h3 className="text-sm font-bold text-slate-700">فیلترهای گزارش</h3>
                        {hasActiveFilters && (
                            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">فعال</span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                        <PersianDatePicker
                            value={form.date_from}
                            onChange={(d) => setField('date_from', d)}
                            placeholder="از تاریخ"
                        />
                        <PersianDatePicker
                            value={form.date_to}
                            onChange={(d) => setField('date_to', d)}
                            placeholder="تا تاریخ"
                        />
                        <select value={form.type} onChange={(e) => setField('type', e.target.value)} className={inputClass}>
                            <option value="all">همه انواع</option>
                            <option value="incoming">وارده</option>
                            <option value="outgoing">صادره</option>
                            <option value="internal">داخلی</option>
                        </select>
                        <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={inputClass}>
                            <option value="all">همه وضعیت‌ها</option>
                            <option value="pending">در انتظار</option>
                            <option value="approved">تایید شده</option>
                            <option value="rejected">رد شده</option>
                            <option value="archived">بایگانی</option>
                        </select>
                        <select value={form.priority} onChange={(e) => setField('priority', e.target.value)} className={inputClass}>
                            <option value="all">همه اولویت‌ها</option>
                            <option value="low">کم</option>
                            <option value="normal">عادی</option>
                            <option value="high">مهم</option>
                            <option value="urgent">عاجل</option>
                            <option value="very_urgent">خیلی عاجل</option>
                        </select>
                        {context.role === 'super-admin' && filterOptions.organizations.length > 0 && (
                            <select value={form.organization_id} onChange={(e) => setField('organization_id', e.target.value)} className={inputClass}>
                                <option value="">همه سازمان‌ها</option>
                                {filterOptions.organizations.map(o => (
                                    <option key={o.id} value={o.id}>{o.name}</option>
                                ))}
                            </select>
                        )}
                        {['super-admin', 'org-admin'].includes(context.role) && filterOptions.departments.length > 0 && (
                            <select value={form.department_id} onChange={(e) => setField('department_id', e.target.value)} className={inputClass}>
                                <option value="">همه ریاست‌ها</option>
                                {filterOptions.departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={applyFilters} className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                            <Filter className="h-4 w-4" />
                            اعمال فیلتر
                        </button>
                        {hasActiveFilters && (
                            <button onClick={resetFilters} className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
                                <RotateCcw className="h-4 w-4" />
                                پاک کردن
                            </button>
                        )}
                    </div>
                </div>

                {/* ─── Overview Cards ─── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {overviewCards.map(c => <StatCard key={c.label} {...c} />)}
                </div>

                {secondaryCards.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {secondaryCards.map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3 hover:border-indigo-200 hover:shadow-sm transition">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                    <Icon className={`h-5 w-5 ${color}`} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-500">{label}</p>
                                    <p className="text-xl font-bold text-slate-900">{value.toLocaleString('fa-IR')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ─── Charts Row 1 ─── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    {/* Monthly Trend */}
                    <ChartCard title={isReception ? 'روند دریافت و پاسخ' : 'روند ماهانه مکاتیب'} subtitle="۶ ماه اخیر" >
                        <div className="h-[240px]">
                            {report.monthly_trend.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    {isReception ? (
                                        <AreaChart data={report.monthly_trend}>
                                            <defs>
                                                <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e2e8f0' }} />
                                            <Legend />
                                            <Area type="monotone" dataKey="incoming" stroke="#6366f1" fill="url(#inGrad)" name="وارده" strokeWidth={2} />
                                            <Area type="monotone" dataKey="replies" stroke="#10b981" fill="url(#repGrad)" name="پاسخ" strokeWidth={2} />
                                        </AreaChart>
                                    ) : (
                                        <AreaChart data={report.monthly_trend}>
                                            <defs>
                                                <linearGradient id="cntGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e2e8f0' }} />
                                            <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#cntGrad)" name="تعداد" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                                        </AreaChart>
                                    )}
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm">داده‌ای موجود نیست</div>
                            )}
                        </div>
                    </ChartCard>

                    {/* Status Distribution */}
                    <ChartCard title="توزیع وضعیت" subtitle="بر اساس وضعیت نهایی">
                        <div className="h-[240px]">
                            {report.status_distribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={report.status_distribution} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                                            {report.status_distribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm">داده‌ای موجود نیست</div>
                            )}
                        </div>
                    </ChartCard>

                    {/* Priority Distribution */}
                    <ChartCard title="توزیع اولویت" subtitle="بر اساس سطح اولویت">
                        <div className="h-[240px]">
                            {report.priority_distribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={report.priority_distribution} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                                            {report.priority_distribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm">داده‌ای موجود نیست</div>
                            )}
                        </div>
                    </ChartCard>
                </div>

                {/* ─── Charts Row 2 ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Type Distribution Bar */}
                    <ChartCard title="توزیع انواع مکاتیب">
                        <div className="h-[220px]">
                            {report.type_distribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={report.type_distribution}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                                        <Bar dataKey="value" name="تعداد" radius={[6, 6, 0, 0]}>
                                            {report.type_distribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm">داده‌ای موجود نیست</div>
                            )}
                        </div>
                    </ChartCard>

                    {/* Department / Organization stats */}
                    {(report.department_stats?.length ?? 0) > 0 && (
                        <ChartCard title="توزیع بر اساس ریاست" subtitle="۱۰ ریاست برتر">
                            <div className="h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={report.department_stats} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <YAxis type="category" dataKey="department" width={100} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                                        <Bar dataKey="count" name="تعداد" fill="#6366f1" radius={[0, 6, 6, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartCard>
                    )}

                    {/* Super-admin: Organization stats */}
                    {context.role === 'super-admin' && (report.organization_stats?.length ?? 0) > 0 && (
                        <ChartCard title="توزیع بر اساس سازمان" subtitle="۱۰ سازمان برتر">
                            <div className="h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={report.organization_stats}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                                        <Bar dataKey="count" name="تعداد" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartCard>
                    )}
                </div>

                {/* ─── Role-specific sections ─── */}

                {/* Dept-manager: Routing stats */}
                {context.role === 'dept-manager' && report.routing_stats && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-indigo-500" />
                            آمار گردش کار (ارجاعات)
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {[
                                { label: 'کل ارجاعات', value: report.routing_stats.total, color: 'text-slate-700' },
                                { label: 'در انتظار', value: report.routing_stats.pending, color: 'text-amber-600' },
                                { label: 'تکمیل‌شده', value: report.routing_stats.completed, color: 'text-emerald-600' },
                                { label: 'رد شده', value: report.routing_stats.rejected, color: 'text-red-600' },
                                { label: 'از دبیرخانه', value: report.routing_stats.reception, color: 'text-indigo-600' },
                            ].map(s => (
                                <div key={s.label} className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString('fa-IR')}</p>
                                    <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* User performance (org-admin & dept-manager) */}
                {(report.user_performance?.length ?? 0) > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                            <Users className="h-4 w-4 text-indigo-500" />
                            عملکرد کاربران (بر اساس ارسال مکتوب)
                        </h3>
                        <div className="space-y-2">
                            {report.user_performance!.map((u, i) => {
                                const max = report.user_performance![0].count;
                                const pct = max > 0 ? (u.count / max) * 100 : 0;
                                return (
                                    <div key={u.name} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-400 w-5 text-center">{i + 1}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-semibold text-slate-700">{u.name}</span>
                                                <span className="text-xs font-bold text-indigo-600">{u.count.toLocaleString('fa-IR')}</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-l from-indigo-500 to-indigo-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Reception: Department breakdown table */}
                {isReception && (report.department_breakdown?.length ?? 0) > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-indigo-500" />
                                آمار تفکیک‌شده به ازای هر ریاست
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right text-sm">
                                <thead>
                                    <tr className="text-slate-500 text-xs font-semibold border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-5 py-3">ریاست</th>
                                        <th className="px-5 py-3 text-center">دریافت دبیرخانه</th>
                                        <th className="px-5 py-3 text-center">در انتظار</th>
                                        <th className="px-5 py-3 text-center">ارجاع‌شده</th>
                                        <th className="px-5 py-3 text-center">نامه وارده</th>
                                        <th className="px-5 py-3 text-center">پاسخ‌ها</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.department_breakdown!.map(row => (
                                        <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                                            <td className="px-5 py-3">
                                                <p className="font-semibold text-slate-800">{row.name}</p>
                                                <p className="text-[10px] text-slate-400">{row.organization}</p>
                                            </td>
                                            <td className="px-5 py-3 text-center font-bold text-indigo-600">{row.received}</td>
                                            <td className="px-5 py-3 text-center text-amber-600">{row.pending}</td>
                                            <td className="px-5 py-3 text-center text-emerald-600">{row.forwarded}</td>
                                            <td className="px-5 py-3 text-center text-slate-700">{row.incoming_letters}</td>
                                            <td className="px-5 py-3 text-center text-violet-600">{row.replies}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
