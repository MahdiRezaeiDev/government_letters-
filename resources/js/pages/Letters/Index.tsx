import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Filter, FileText, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import * as letters from '@/routes/letters';

// ─── Types ───────────────────────────────

interface Letter {
    id: number;
    subject: string;
    letter_number: string | null;
    letter_type: 'incoming' | 'outgoing' | 'internal';
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    final_status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
    date: string;
}

interface Props {
    letters: {
        data: Letter[];
        total: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { type?: string; status?: string };
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

const PRIORITY_DOT: Record<Letter['priority'], string> = {
    low:         'bg-muted-foreground/30',
    normal:      'bg-primary',
    high:        'bg-amber-400',
    urgent:      'bg-orange-500',
    very_urgent: 'bg-destructive',
};

const STATUS_LABEL: Record<Letter['final_status'], string> = {
    draft:    'پیش‌نویس',
    pending:  'در انتظار',
    approved: 'تأیید شده',
    rejected: 'رد شده',
    archived: 'بایگانی',
};

const STATUS_STYLE: Record<Letter['final_status'], string> = {
    draft:    'bg-muted text-muted-foreground',
    pending:  'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    approved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    rejected: 'bg-destructive/10 text-destructive',
    archived: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
};

const TYPE_LABEL: Record<Letter['letter_type'], string> = {
    incoming: 'وارده',
    outgoing: 'صادره',
    internal: 'داخلی',
};

const TYPE_FILTERS = [
    { value: '',         label: 'همه' },
    { value: 'incoming', label: 'وارده' },
    { value: 'outgoing', label: 'صادره' },
    { value: 'internal', label: 'داخلی' },
];

// ─── Component ───────────────────────────

export default function Index({ letters: data, filters }: Props) {

    const [search, setSearch] = useState('');

    function handleFilter(type: string) {
        router.get(letters.index().url, { type }, { preserveState: true });
    }

    function handleDelete(id: number) {
        if (confirm('آیا مطمئن هستید؟')) {
            router.delete(letters.destroy(id).url);
        }
    }

    const filtered = search
        ? data.data.filter(l => l.subject.includes(search) || l.letter_number?.includes(search))
        : data.data;

    return (
        <>
            <Head title="نامه‌ها" />

            <div className="p-6 max-w-7xl mx-auto space-y-5">

                {/* ─── هدر ─── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-foreground">نامه‌ها</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{data.total} نامه</p>
                    </div>
                    <Link href={letters.create().url}
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors font-medium">
                        <Plus size={15} />
                        نامه جدید
                    </Link>
                </div>

                {/* ─── فیلتر و جستجو ─── */}
                <div className="flex items-center gap-3">

                    {/* فیلتر نوع */}
                    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                        {TYPE_FILTERS.map(f => (
                            <button key={f.value}
                                onClick={() => handleFilter(f.value)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                    (filters.type ?? '') === f.value
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}>
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* جستجو */}
                    <div className="relative flex-1 max-w-xs">
                        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="جستجو در موضوع یا شماره..."
                            className="w-full bg-background border border-border rounded-lg pr-9 pl-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </div>

                {/* ─── جدول ─── */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">

                    {/* هدر جدول */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
                        <span>موضوع</span>
                        <span>نوع / اولویت</span>
                        <span>وضعیت</span>
                        <span>تاریخ</span>
                        <span>عملیات</span>
                    </div>

                    {/* ردیف‌ها */}
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center py-16 text-muted-foreground/50">
                            <FileText size={32} className="mb-3" />
                            <p className="text-sm">هیچ نامه‌ای وجود ندارد</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {filtered.map(letter => (
                                <div key={letter.id}
                                    className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-muted/30 transition-colors group">

                                    {/* موضوع */}
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[letter.priority]}`} />
                                        <div className="min-w-0">
                                            <Link href={letters.show(letter.id).url}
                                                className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate block">
                                                {letter.subject}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">
                                                {letter.letter_number ?? '---'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* نوع / اولویت */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted-foreground">
                                            {TYPE_LABEL[letter.letter_type]}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full w-fit font-medium ${PRIORITY_STYLE[letter.priority]}`}>
                                            {PRIORITY_LABEL[letter.priority]}
                                        </span>
                                    </div>

                                    {/* وضعیت */}
                                    <span className={`text-xs px-2.5 py-1 rounded-full w-fit font-medium ${STATUS_STYLE[letter.final_status]}`}>
                                        {STATUS_LABEL[letter.final_status]}
                                    </span>

                                    {/* تاریخ */}
                                    <span className="text-xs text-muted-foreground">
                                        {letter.date}
                                    </span>

                                    {/* عملیات */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={letters.show(letter.id).url}
                                            className="text-xs text-primary hover:underline">
                                            مشاهده
                                        </Link>
                                        {letter.final_status === 'draft' && (
                                            <>
                                                <span className="text-border">·</span>
                                                <Link href={letters.edit(letter.id).url}
                                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                                    ویرایش
                                                </Link>
                                                <span className="text-border">·</span>
                                                <button onClick={() => handleDelete(letter.id)}
                                                    className="text-xs text-destructive/70 hover:text-destructive transition-colors">
                                                    حذف
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── صفحه‌بندی ─── */}
                {data.last_page > 1 && (
                    <div className="flex gap-1 justify-center">
                        {data.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'}
                                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground font-medium'
                                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}

            </div>
        </>
    );
}