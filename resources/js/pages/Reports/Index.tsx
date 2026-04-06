import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import * as letterRoutes from '@/routes/letters';
import * as reportRoutes from '@/routes/reports';
import { BarChart2, AlertTriangle } from 'lucide-react';

interface Stats {
    total: number; incoming: number; outgoing: number;
    internal: number; pending: number; approved: number;
}
interface CategoryStat { name: string; count: number; }
interface Letter {
    id: number; subject: string; due_date: string;
    category: { name: string } | null;
    creator: { first_name: string; last_name: string } | null;
}
interface Props {
    stats: Stats; byPriority: Record<string, number>;
    byCategory: CategoryStat[]; daily: Record<string, number>;
    overdue: Letter[]; filters: { from: string; to: string };
}

const PRIORITY_LABEL: Record<string, string> = {
    low: 'کم', normal: 'عادی', high: 'مهم', urgent: 'فوری', very_urgent: 'خیلی فوری',
};

const PRIORITY_COLOR: Record<string, string> = {
    low: 'bg-muted-foreground/30', normal: 'bg-primary',
    high: 'bg-amber-400', urgent: 'bg-orange-500', very_urgent: 'bg-destructive',
};

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
    return (
        <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
            {sub && <p className="text-xs text-primary mt-0.5">{sub}</p>}
        </div>
    );
}

export default function Index({ stats, byPriority, byCategory, daily, overdue, filters }: Props) {

    const [from, setFrom] = useState(filters.from);
    const [to,   setTo]   = useState(filters.to);

    const maxDaily    = Math.max(...Object.values(daily), 1);
    const maxCategory = Math.max(...byCategory.map(c => c.count), 1);
    const maxPriority = Math.max(...Object.values(byPriority), 1);

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'گزارش‌ها', href: reportRoutes.index().url }]}>
            <Head title="گزارش‌ها" />
            <div className="p-6 max-w-6xl mx-auto space-y-5">

                {/* هدر */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-foreground">گزارش‌ها</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">آمار و تحلیل نامه‌ها</p>
                    </div>

                    {/* فیلتر تاریخ */}
                    <div className="flex items-center gap-2">
                        <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                        <span className="text-muted-foreground text-xs">تا</span>
                        <input type="date" value={to} onChange={e => setTo(e.target.value)}
                            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                        <button onClick={() => router.get(reportRoutes.index().url, { from, to }, { preserveState: true })}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            اعمال
                        </button>
                    </div>
                </div>

                {/* آمار کلی */}
                <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
                    <StatCard label="کل نامه‌ها"   value={stats.total} />
                    <StatCard label="وارده"         value={stats.incoming} />
                    <StatCard label="صادره"         value={stats.outgoing} />
                    <StatCard label="داخلی"         value={stats.internal} />
                    <StatCard label="در انتظار"     value={stats.pending} />
                    <StatCard label="تأیید شده"     value={stats.approved} />
                </div>

                {/* نمودار روزانه + اولویت */}
                <div className="grid grid-cols-3 gap-5">

                    {/* نمودار روزانه */}
                    <div className="col-span-2 bg-card border border-border rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart2 size={14} className="text-primary" />
                            <h2 className="text-sm font-semibold text-foreground">نامه‌های ۳۰ روز اخیر</h2>
                        </div>
                        <div className="flex items-end gap-0.5 h-28">
                            {Object.entries(daily).map(([date, count]) => (
                                <div key={date} className="flex-1 flex flex-col items-center group relative" title={`${date}: ${count}`}>
                                    <div className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all"
                                        style={{ height: `${(count / maxDaily) * 100}%`, minHeight: count > 0 ? '3px' : '0' }} />
                                    {/* tooltip */}
                                    <div className="absolute bottom-full mb-1 bg-foreground text-background text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {count}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">هر ستون = یک روز</p>
                    </div>

                    {/* اولویت */}
                    <div className="bg-card border border-border rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-4">بر اساس اولویت</h2>
                        <div className="space-y-3">
                            {Object.entries(byPriority).map(([priority, count]) => (
                                <div key={priority}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-muted-foreground">{PRIORITY_LABEL[priority] ?? priority}</span>
                                        <span className="text-foreground font-medium tabular-nums">{count}</span>
                                    </div>
                                    <div className="bg-muted rounded-full h-1.5 overflow-hidden">
                                        <div className={`${PRIORITY_COLOR[priority]} h-full rounded-full transition-all`}
                                            style={{ width: `${(count / maxPriority) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* دسته‌بندی */}
                {byCategory.length > 0 && (
                    <div className="bg-card border border-border rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-4">بر اساس دسته‌بندی</h2>
                        <div className="space-y-3">
                            {byCategory.map((cat, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-sm text-foreground w-32 truncate">{cat.name}</span>
                                    <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full"
                                            style={{ width: `${(cat.count / maxCategory) * 100}%` }} />
                                    </div>
                                    <span className="text-xs text-muted-foreground tabular-nums w-8 text-left">{cat.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* معوق */}
                {overdue.length > 0 && (
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
                            <AlertTriangle size={14} className="text-destructive" />
                            <h2 className="text-sm font-semibold text-destructive">نامه‌های معوق ({overdue.length})</h2>
                        </div>
                        <div className="divide-y divide-border">
                            {overdue.map(letter => (
                                <div key={letter.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{letter.subject}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {letter.creator ? `${letter.creator.first_name} ${letter.creator.last_name}` : '---'}
                                            {letter.category && <span className="mr-2">· {letter.category.name}</span>}
                                        </p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-destructive font-medium">مهلت: {letter.due_date}</p>
                                        <Link href={letterRoutes.show(letter.id).url}
                                            className="text-xs text-primary hover:underline mt-0.5 block">مشاهده</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}