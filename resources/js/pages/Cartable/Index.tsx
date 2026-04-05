import { Head, Link } from '@inertiajs/react';
import {
    Clock, Inbox, Send, FileText,
    AlertCircle, TrendingUp, ChevronLeft, ArrowUpRight, CheckCircle2,
} from 'lucide-react';
import * as cartable from '@/routes/cartable';
import * as letterRoutes from '@/routes/letters';

// ─── Types ───────────────────────────────

interface RoutingLetter {
    id: number; subject: string; letter_number: string | null;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
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

const ACTION_STYLE: Record<Routing['action_type'], string> = {
    action:       'bg-primary/10 text-primary',
    approval:     'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    information:  'bg-muted text-muted-foreground',
    sign:         'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    coordination: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const PRIORITY_DOT: Record<Letter['priority'], string> = {
    low:         'bg-muted-foreground/30',
    normal:      'bg-primary',
    high:        'bg-amber-400',
    urgent:      'bg-orange-500',
    very_urgent: 'bg-destructive',
};

// ─── Sub-components ──────────────────────

function StatCard({ label, value, icon: Icon, accent = false, danger = false }: {
    label: string; value: number; icon: any; accent?: boolean; danger?: boolean;
}) {
    return (
        <div className={`
            relative rounded-xl border p-4 transition-all
            ${danger && value > 0
                ? 'bg-destructive/5 border-destructive/20'
                : 'bg-card border-border'
            }
        `}>
            <div className="flex items-start justify-between">
                <div>
                    <p className={`text-2xl font-bold tabular-nums ${danger && value > 0 ? 'text-destructive' : 'text-foreground'}`}>
                        {value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
                <div className={`p-2 rounded-lg ${danger && value > 0 ? 'bg-destructive/10 text-destructive' : accent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Icon size={15} />
                </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl ${danger && value > 0 ? 'bg-destructive/40' : accent ? 'bg-primary/40' : 'bg-border'}`} />
        </div>
    );
}

function SectionCard({ title, count, href, children }: {
    title: string; count?: number; href?: string; children: React.ReactNode;
}) {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{title}</span>
                    {count !== undefined && count > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full font-medium">
                            {count}
                        </span>
                    )}
                </div>
                {href && (
                    <Link href={href} className="text-xs text-primary hover:underline flex items-center gap-0.5">
                        همه <ChevronLeft size={11} />
                    </Link>
                )}
            </div>
            {children}
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center py-8 text-muted-foreground/40">
            <CheckCircle2 size={24} className="mb-2" />
            <p className="text-xs">{message}</p>
        </div>
    );
}

// ─── Main ─────────────────────────────────

export default function Index({
    pendingRoutings, incomingLetters, sentLetters,
    myDrafts, overdueRoutings, stats,
}: Props) {

    const isOverdue = (d: string | null) => d ? new Date(d) < new Date() : false;

    return (
        <>
            <Head title="کارتابل" />

            <div className="p-6 space-y-5 max-w-7xl mx-auto">

                {/* هدر */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-foreground">کارتابل</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date().toLocaleDateString('fa-IR', {
                                weekday: 'long', year: 'numeric',
                                month: 'long', day: 'numeric',
                            })}
                        </p>
                    </div>
                    <Link href={letterRoutes.create().url}
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors font-medium">
                        نامه جدید
                        <ArrowUpRight size={14} />
                    </Link>
                </div>

                {/* آمار */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <StatCard label="در انتظار اقدام" value={stats.pending_actions} icon={Clock} accent />
                    <StatCard label="وارده جدید"       value={stats.incoming_new}    icon={Inbox} />
                    <StatCard label="ارسالی در جریان"  value={stats.sent_pending}    icon={Send} />
                    <StatCard label="پیش‌نویس"         value={stats.my_drafts}       icon={FileText} />
                    <StatCard label="معوق"             value={stats.overdue}         icon={AlertCircle} danger />
                    <StatCard label="ارسال امروز"      value={stats.sent_today}      icon={TrendingUp} />
                </div>

                {/* معوق‌ها */}
                {overdueRoutings.length > 0 && (
                    <div className="rounded-xl border border-destructive/20 overflow-hidden">
                        <div className="px-5 py-3 bg-destructive/5 border-b border-destructive/20 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
                            <span className="text-sm font-semibold text-destructive">
                                معوق — مهلت گذشته ({overdueRoutings.length})
                            </span>
                        </div>
                        <div className="divide-y divide-border bg-card">
                            {overdueRoutings.map(r => (
                                <div key={r.id} className="px-5 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <div>
                                        <Link href={letterRoutes.show(r.letter.id).url}
                                            className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                                            {r.letter.subject}
                                        </Link>
                                        <p className="text-xs text-destructive mt-0.5">مهلت: {r.deadline}</p>
                                    </div>
                                    <Link href={letterRoutes.show(r.letter.id).url}
                                        className="text-xs bg-destructive hover:bg-destructive/90 text-white px-3 py-1.5 rounded-lg transition-colors">
                                        اقدام فوری
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ردیف اصلی */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* در انتظار اقدام — ۲ ستون */}
                    <div className="lg:col-span-2">
                        <SectionCard title="در انتظار اقدام" count={stats.pending_actions}>
                            {pendingRoutings.length === 0 ? (
                                <EmptyState message="موردی در انتظار اقدام نیست" />
                            ) : (
                                <div className="divide-y divide-border">
                                    {pendingRoutings.map(r => (
                                        <Link key={r.id}
                                            href={letterRoutes.show(r.letter.id).url}
                                            className="flex items-start gap-3 px-5 py-4 hover:bg-muted/40 transition-colors group">

                                            <span className={`block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${PRIORITY_DOT[r.letter.priority]}`} />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACTION_STYLE[r.action_type]}`}>
                                                        {ACTION_LABEL[r.action_type]}
                                                    </span>
                                                    {isOverdue(r.deadline) && (
                                                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                                                            معوق
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                                    {r.letter.subject}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    از: {r.fromUser
                                                        ? `${r.fromUser.first_name} ${r.fromUser.last_name}`
                                                        : r.fromPosition?.name ?? '---'}
                                                    {r.instruction && <span className="mr-2">← {r.instruction}</span>}
                                                </p>
                                            </div>

                                            <div className="flex-shrink-0">
                                                {r.deadline && (
                                                    <p className={`text-xs ${isOverdue(r.deadline) ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                                                        {r.deadline}
                                                    </p>
                                                )}
                                                <ChevronLeft size={13} className="text-border mt-1 mr-auto" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </SectionCard>
                    </div>

                    {/* ستون کنار */}
                    <div className="space-y-4">

                        {/* وارده جدید */}
                        <SectionCard title="وارده جدید" count={stats.incoming_new}>
                            {incomingLetters.length === 0 ? (
                                <EmptyState message="نامه جدیدی نیست" />
                            ) : (
                                <div className="divide-y divide-border">
                                    {incomingLetters.map(l => (
                                        <Link key={l.id} href={letterRoutes.show(l.id).url}
                                            className="flex items-start gap-2.5 px-5 py-3 hover:bg-muted/40 transition-colors group">
                                            <span className={`block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${PRIORITY_DOT[l.priority]}`} />
                                            <div className="min-w-0">
                                                <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                                    {l.subject}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{l.date}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </SectionCard>

                        {/* پیش‌نویس‌ها */}
                        <SectionCard title="پیش‌نویس‌ها" href={letterRoutes.create().url}>
                            {myDrafts.length === 0 ? (
                                <EmptyState message="پیش‌نویسی نیست" />
                            ) : (
                                <div className="divide-y divide-border">
                                    {myDrafts.map(l => (
                                        <div key={l.id} className="flex items-center px-5 py-3 hover:bg-muted/40 transition-colors gap-2">
                                            <Link href={letterRoutes.show(l.id).url}
                                                className="text-sm text-foreground hover:text-primary transition-colors truncate flex-1">
                                                {l.subject}
                                            </Link>
                                            <Link href={letterRoutes.edit(l.id).url}
                                                className="text-xs text-primary hover:underline flex-shrink-0">
                                                ادامه
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </SectionCard>

                    </div>
                </div>
            </div>
        </>
    );
}