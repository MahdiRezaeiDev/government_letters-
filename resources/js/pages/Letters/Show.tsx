import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Paperclip, GitBranch, Clock, Shield, Tag } from 'lucide-react';
import AttachmentUploader from '@/Components/AttachmentUploader';
import RoutingPanel from '@/Components/RoutingPanel';
import * as letters from '@/routes/letters';

// ─── Types ───────────────────────────────

interface Attachment {
    id: number; file_name: string; file_size: number;
    extension: string; uploader_name: string;
    created_at: string; download_count: number;
}

interface Routing {
    id: number;
    action_type: 'action' | 'approval' | 'information' | 'sign' | 'coordination';
    status: 'pending' | 'in_progress' | 'completed' | 'rejected';
    instruction: string | null; deadline: string | null;
    completed_note: string | null; step_order: number;
    toUser: { first_name: string; last_name: string } | null;
    toPosition: { name: string } | null;
    fromUser: { first_name: string; last_name: string } | null;
}

interface Letter {
    id: number; letter_number: string | null; tracking_number: string | null;
    letter_type: 'incoming' | 'outgoing' | 'internal';
    subject: string; summary: string | null; content: string | null;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    security_level: 'public' | 'internal' | 'confidential' | 'secret' | 'top_secret';
    final_status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
    date: string; due_date: string | null;
    sender_name: string | null; sender_position: string | null;
    recipient_name: string | null; recipient_position: string | null;
    category: { name: string } | null;
    creator: { first_name: string; last_name: string } | null;
    attachments: Attachment[];
    routings: Routing[];
}

interface Position { id: number; name: string; department: { name: string }; }
interface User { id: number; first_name: string; last_name: string; activePosition: { name: string } | null; }

interface Props {
    letter: Letter; uploadUrl: string; storeRoutingUrl: string;
    positions: Position[]; users: User[];
}

// ─── Constants ───────────────────────────

const PRIORITY_LABEL: Record<Letter['priority'], string> = {
    low: 'کم', normal: 'عادی', high: 'مهم', urgent: 'فوری', very_urgent: 'خیلی فوری',
};

const PRIORITY_STYLE: Record<Letter['priority'], string> = {
    low:         'bg-muted text-muted-foreground',
    normal:      'bg-primary/10 text-primary',
    high:        'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    urgent:      'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    very_urgent: 'bg-destructive/10 text-destructive',
};

const STATUS_LABEL: Record<Letter['final_status'], string> = {
    draft: 'پیش‌نویس', pending: 'در انتظار تأیید',
    approved: 'تأیید شده', rejected: 'رد شده', archived: 'بایگانی',
};

const STATUS_STYLE: Record<Letter['final_status'], string> = {
    draft:    'bg-muted text-muted-foreground',
    pending:  'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    approved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    rejected: 'bg-destructive/10 text-destructive',
    archived: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
};

const SECURITY_LABEL: Record<Letter['security_level'], string> = {
    public: 'عمومی', internal: 'داخلی', confidential: 'محرمانه',
    secret: 'سری', top_secret: 'بسیار سری',
};

const SECURITY_STYLE: Record<Letter['security_level'], string> = {
    public:       'text-muted-foreground',
    internal:     'text-primary',
    confidential: 'text-amber-600 dark:text-amber-400',
    secret:       'text-orange-600 dark:text-orange-400',
    top_secret:   'text-destructive',
};

const TYPE_LABEL: Record<Letter['letter_type'], string> = {
    incoming: 'وارده', outgoing: 'صادره', internal: 'داخلی',
};

// ─── Sub-components ──────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex gap-2 py-2.5 border-b border-border last:border-0">
            <span className="text-xs text-muted-foreground w-28 flex-shrink-0 pt-0.5">{label}</span>
            <span className="text-sm text-foreground flex-1">{value}</span>
        </div>
    );
}

function SectionCard({ title, icon: Icon, children }: {
    title: string; icon: any; children: React.ReactNode;
}) {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
                <Icon size={14} className="text-primary" />
                <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

// ─── Component ───────────────────────────

export default function Show({ letter, uploadUrl, storeRoutingUrl, positions, users }: Props) {

    function handleDelete() {
        if (confirm('آیا مطمئن هستید؟')) {
            router.delete(letters.destroy(letter.id).url);
        }
    }

    return (
        <>
            <Head title={letter.subject} />

            <div className="p-6 max-w-4xl mx-auto space-y-5">

                {/* ─── هدر ─── */}
                <div className="bg-card border border-border rounded-xl p-5">

                    {/* بردکرامب و دکمه‌ها */}
                    <div className="flex items-start justify-between mb-4">
                        <Link href={letters.index().url}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowRight size={12} />
                            بازگشت به لیست
                        </Link>
                        {letter.final_status === 'draft' && (
                            <div className="flex gap-2">
                                <Link href={letters.edit(letter.id).url}
                                    className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-lg transition-colors font-medium">
                                    ویرایش
                                </Link>
                                <button onClick={handleDelete}
                                    className="text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-1.5 rounded-lg transition-colors font-medium">
                                    حذف
                                </button>
                            </div>
                        )}
                    </div>

                    {/* موضوع */}
                    <h1 className="text-xl font-bold text-foreground mb-3">
                        {letter.subject}
                    </h1>

                    {/* بج‌ها */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                            {TYPE_LABEL[letter.letter_type]}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${PRIORITY_STYLE[letter.priority]}`}>
                            {PRIORITY_LABEL[letter.priority]}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[letter.final_status]}`}>
                            {STATUS_LABEL[letter.final_status]}
                        </span>
                        {letter.category && (
                            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Tag size={10} />
                                {letter.category.name}
                            </span>
                        )}
                        <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${SECURITY_STYLE[letter.security_level]}`}>
                            <Shield size={10} />
                            {SECURITY_LABEL[letter.security_level]}
                        </span>
                    </div>
                </div>

                {/* ─── اطلاعات ─── */}
                <SectionCard title="اطلاعات نامه" icon={Tag}>
                    <div className="grid grid-cols-2 gap-x-8">
                        <div>
                            <InfoRow label="شماره نامه"
                                value={letter.letter_number
                                    ? <span className="font-mono text-sm">{letter.letter_number}</span>
                                    : <span className="text-muted-foreground">---</span>}
                            />
                            <InfoRow label="شماره پیگیری"
                                value={letter.tracking_number
                                    ? <span className="font-mono text-xs">{letter.tracking_number}</span>
                                    : <span className="text-muted-foreground">---</span>}
                            />
                            <InfoRow label="تاریخ" value={letter.date} />
                            <InfoRow label="مهلت اقدام"
                                value={letter.due_date
                                    ? <span className={new Date(letter.due_date) < new Date() ? 'text-destructive font-medium' : ''}>{letter.due_date}</span>
                                    : <span className="text-muted-foreground">---</span>}
                            />
                        </div>
                        <div>
                            <InfoRow label="فرستنده"
                                value={
                                    <div>
                                        <span>{letter.sender_name ?? '---'}</span>
                                        {letter.sender_position && (
                                            <span className="text-xs text-muted-foreground block">{letter.sender_position}</span>
                                        )}
                                    </div>
                                }
                            />
                            <InfoRow label="گیرنده"
                                value={
                                    <div>
                                        <span>{letter.recipient_name ?? '---'}</span>
                                        {letter.recipient_position && (
                                            <span className="text-xs text-muted-foreground block">{letter.recipient_position}</span>
                                        )}
                                    </div>
                                }
                            />
                            <InfoRow label="ثبت‌کننده"
                                value={letter.creator
                                    ? `${letter.creator.first_name} ${letter.creator.last_name}`
                                    : '---'}
                            />
                        </div>
                    </div>
                </SectionCard>

                {/* ─── خلاصه ─── */}
                {letter.summary && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                        <p className="text-xs font-medium text-primary mb-2">خلاصه</p>
                        <p className="text-sm text-foreground leading-7">{letter.summary}</p>
                    </div>
                )}

                {/* ─── متن ─── */}
                {letter.content && (
                    <SectionCard title="متن نامه" icon={Tag}>
                        <div className="text-sm text-foreground leading-8 prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: letter.content }} />
                    </SectionCard>
                )}

                {/* ─── پیوست‌ها ─── */}
                <SectionCard title={`پیوست‌ها (${letter.attachments.length})`} icon={Paperclip}>
                    <AttachmentUploader
                        letterId={letter.id}
                        attachments={letter.attachments}
                        uploadUrl={uploadUrl} />
                </SectionCard>

                {/* ─── گردش کار ─── */}
                <SectionCard title="گردش کار" icon={GitBranch}>
                    <RoutingPanel
                        letterId={letter.id}
                        routings={letter.routings}
                        positions={positions}
                        users={users}
                        storeUrl={storeRoutingUrl} />
                </SectionCard>

            </div>
        </>
    );
}