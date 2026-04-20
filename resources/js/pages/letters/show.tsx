import { Head, Link, router } from '@inertiajs/react';
import {
    Archive, Send, Printer, Clock, AlertCircle,
    Building2, FileText, CheckCircle, XCircle,
    Paperclip, Loader2, ChevronRight, FolderOpen, Download
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import letters from '@/routes/letters';
import routings from '@/routes/routings';
import type { Letter, Case } from '@/types';

interface Props {
    letter: Letter;
    securityLevels: Record<string, string>;
    priorityLevels: Record<string, string>;
    availableCases?: Case[];
    can: {
        edit: boolean;
        delete: boolean;
        archive: boolean;
        route: boolean;
        approve: boolean;
        reject: boolean;
    };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    draft:    { label: 'مسوده',       color: '#64748b', bg: '#f1f5f9', icon: FileText },
    pending:  { label: 'در انتظار',   color: '#b45309', bg: '#fef3c7', icon: Clock },
    approved: { label: 'تأیید شده',   color: '#15803d', bg: '#dcfce7', icon: CheckCircle },
    rejected: { label: 'رد شده',      color: '#b91c1c', bg: '#fee2e2', icon: XCircle },
    archived: { label: 'آرشیف شده',   color: '#475569', bg: '#f1f5f9', icon: Archive },
};

const ROUTING_STATUS: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    completed: { label: 'تکمیل شده', color: '#15803d', bg: '#dcfce7', icon: CheckCircle },
    rejected:  { label: 'رد شده',    color: '#b91c1c', bg: '#fee2e2', icon: XCircle },
    pending:   { label: 'در انتظار', color: '#b45309', bg: '#fef3c7', icon: Clock },
};

const ACTION_LABELS: Record<string, string> = {
    approval: 'جهت تأیید', action: 'جهت اقدام',
    information: 'جهت اطلاع', coordination: 'جهت هماهنگی', sign: 'جهت امضاء',
};

// ─── Archive Modal (بدون تغییر) ─────────────────────────────────────────────────────────
function ArchiveModal({ cases, loading, onClose, onConfirm }: {
    cases: Case[]; loading: boolean; onClose: () => void; onConfirm: (id: number) => void;
}) {
    const [sel, setSel] = useState<number | null>(null);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Archive className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">آرشیف نمودن مکتوب</h3>
                        <p className="text-xs text-slate-400 mt-0.5">دوسیه مقصد را انتخاب کنید</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
                        <FolderOpen className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select value={sel || ''} onChange={e => setSel(parseInt(e.target.value) || null)} disabled={loading}
                            className="w-full pr-10 pl-9 py-3 text-sm bg-transparent focus:outline-none appearance-none text-slate-700">
                            <option value="">انتخاب دوسیه...</option>
                            {cases.map(c => <option key={c.id} value={c.id}>{c.title} ({c.case_number})</option>)}
                        </select>
                        <svg className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} disabled={loading}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                            انصراف
                        </button>
                        <button onClick={() => sel && onConfirm(sel)} disabled={loading || !sel}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md disabled:opacity-50 transition-all">
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            آرشیف
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main ──────────────────────────────────────────────────────────────────
export default function LettersShow({ letter, securityLevels, priorityLevels, availableCases = [], can }: Props) {
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState<Case[]>(availableCases);

    const statusCfg = STATUS_CONFIG[letter.final_status] ?? STATUS_CONFIG.pending;
    const StatusIcon = statusCfg.icon;

    useEffect(() => {
        if (showArchiveModal && cases.length === 0) {
            router.get('/api/cases/available', { letter_id: letter.id }, {
                preserveState: false,
                onSuccess: (page) => setCases((page.props as any).cases || []),
            });
        }
    }, [showArchiveModal]);

    const handleArchive = (caseId: number) => {
        setLoading(true);
        router.post(letters.show({ letter: letter.id }), { case_id: caseId }, {
            onSuccess: () => {
 setShowArchiveModal(false); setLoading(false); router.reload(); 
},
            onError: () => setLoading(false),
        });
    };

    const handleApprove = () => {
        if (!confirm('آیا از تأیید این مکتوب اطمینان دارید؟')) {
return;
}

        setLoading(true);
        router.post(letters.show({ letter: letter.id }), {}, {
            onSuccess: () => {
 setLoading(false); router.reload(); 
},
            onError: () => setLoading(false),
        });
    };

    const handleReject = () => {
        const reason = prompt('لطفاً دلیل رد را وارد کنید:');

        if (!reason) {
return;
}

        setLoading(true);
        router.post(letters.show({ letter: letter.id }), { reason }, {
            onSuccess: () => {
 setLoading(false); router.reload(); 
},
            onError: () => setLoading(false),
        });
    };

    const letterDate = letter.date
        ? new Date(letter.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—';
    const createdDate = new Date(letter.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

    // تاریخ هجری شمسی با فرمت افغانستان (حمل، ثور...)
    const afgDate = letter.date
        ? new Date(letter.date).toLocaleDateString('fa-AF', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—';
    const afgCreated = new Date(letter.created_at).toLocaleDateString('fa-AF', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Head title={letter.subject} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap');
                * { font-family: 'Vazirmatn', sans-serif; }
                :root { direction: rtl; }

                /* ── Afghan official letter style ── */
                .afg-letter-paper {
                    background-color: #fcfcfc;
                    background-image:
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent calc(2.6rem - 1px),
                            rgba(0,40,20,0.03) calc(2.6rem - 1px),
                            rgba(0,40,20,0.03) 2.6rem
                        );
                    box-shadow:
                        0 4px 6px rgba(0,0,0,0.04),
                        0 12px 24px rgba(0,0,0,0.06),
                        0 0 0 1.5px rgba(0,0,0,0.08);
                    border: 1px solid #d4af37;
                }

                /* Afghan tri-color top band */
                .afg-header-band {
                    height: 6px;
                    background: linear-gradient(
                        to right,
                        #000000 0%, #000000 33%,
                        #c8102e 33%, #c8102e 66%,
                        #007a3d 66%, #007a3d 100%
                    );
                }

                .afg-footer-band {
                    height: 4px;
                    background: linear-gradient(
                        to right,
                        #000000 0%, #000000 33%,
                        #c8102e 33%, #c8102e 66%,
                        #007a3d 66%, #007a3d 100%
                    );
                }

                /* Double border with gold accent */
                .afg-border-accent {
                    position: absolute;
                    inset: 12px;
                    border: 1px solid rgba(212, 175, 55, 0.25);
                    pointer-events: none;
                }

                /* National Emblem watermark */
                .afg-watermark {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                    overflow: hidden;
                }
                .afg-watermark span {
                    font-size: 5rem;
                    font-weight: 900;
                    color: #007a3d;
                    opacity: 0.035;
                    transform: rotate(-15deg);
                    white-space: nowrap;
                    user-select: none;
                    letter-spacing: 0.5em;
                    text-transform: uppercase;
                }

                /* Official stamp */
                .afg-stamp {
                    width: 80px; height: 80px;
                    border-radius: 50%;
                    border: 2.5px solid #c8102e;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    opacity: 0.45;
                }
                .afg-stamp::before {
                    content: '';
                    position: absolute;
                    inset: 6px;
                    border-radius: 50%;
                    border: 1px solid #007a3d;
                }
                .afg-stamp::after {
                    content: '\\2726';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 24px;
                    color: #c8102e;
                    opacity: 0.6;
                }

                /* Letter body */
                .afg-letter-body {
                    font-size: 0.9375rem;
                    line-height: 2.6rem;
                    color: #1a1a1a;
                    text-align: justify;
                    word-spacing: 0.01em;
                }

                /* Print overrides */
                @media print {
                    .no-print { display: none !important; }
                    .afg-letter-paper {
                        box-shadow: none !important;
                        border: 1px solid #888 !important;
                        background-image: none !important;
                    }
                    body { background: white !important; }
                    .afg-watermark span { opacity: 0.06 !important; }
                }
            `}</style>

            <div className="min-h-screen bg-slate-200/40" dir="rtl">

                {/* ── Toolbar (بدون تغییر عمده، فقط واژه‌ها) ── */}
                <div className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between h-14 gap-3">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <Link href={letters.index()}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition">
                                    مکتوب‌ها
                                </Link>
                                <ChevronRight className="h-3 w-3 text-slate-300 flex-shrink-0" />
                                <span className="text-xs font-bold text-slate-700 truncate max-w-[200px] sm:max-w-sm">{letter.subject}</span>
                            </div>

                            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                                style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                                <StatusIcon className="h-3 w-3" />
                                {statusCfg.label}
                            </span>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button onClick={() => window.print()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                                    <Printer className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">چاپ</span>
                                </button>
                                {can.edit && letter.final_status === 'draft' && (
                                    <Link href={letters.edit({ letter: letter.id })}
                                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                                        ویرایش
                                    </Link>
                                )}
                                {can.archive && letter.final_status === 'approved' && (
                                    <button onClick={() => setShowArchiveModal(true)} disabled={loading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition shadow-sm disabled:opacity-50">
                                        <Archive className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">آرشیف</span>
                                    </button>
                                )}
                                {can.route && letter.final_status === 'pending' && (
                                    <Link href={routings.create({ letter: letter.id })}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm">
                                        <Send className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">ارجاع</span>
                                    </Link>
                                )}
                                {can.approve && letter.final_status === 'pending' && (
                                    <>
                                        <button onClick={handleApprove} disabled={loading}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm disabled:opacity-50">
                                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                                            <span className="hidden sm:inline">تأیید</span>
                                        </button>
                                        <button onClick={handleReject} disabled={loading}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-sm disabled:opacity-50">
                                            <XCircle className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">رد</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-8">

                    {/* ══════════════════════════════════════════
                        OFFICIAL AFGHAN GOVERNMENT LETTER
                    ══════════════════════════════════════════ */}
                    <div className="afg-letter-paper relative overflow-hidden rounded-sm">

                        {/* Tri-color top band */}
                        <div className="afg-header-band" />

                        {/* Inner border accent */}
                        <div className="afg-border-accent" />

                        {/* Watermark */}
                        <div className="afg-watermark">
                            <span>افغانستان</span>
                        </div>

                        <div className="relative z-10 px-8 py-7">

                            {/* ── Bismillah ── */}
                            <div className="text-center mb-6">
                                <p className="text-xl font-bold tracking-wider text-[#007a3d]">
                                    بسم الله الرحمن الرحیم
                                </p>
                            </div>

                            {/* ── National Emblem & Header ── */}
                            <div className="flex items-center gap-4 mb-5">

                                {/* Emblem */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                                    <div className="h-20 w-20 rounded-full border-2 border-[#d4af37]/50
                                        bg-gradient-to-br from-[#007a3d]/5 to-[#c8102e]/5
                                        flex items-center justify-center">
                                        <Building2 className="h-8 w-8 text-[#007a3d]/40" />
                                    </div>
                                    <span className="text-[9px] font-bold text-[#c8102e]/60 tracking-wider">نشان ملی</span>
                                </div>

                                {/* Org name */}
                                <div className="flex-1 text-center">
                                    <p className="text-[11px] font-black tracking-[0.15em] text-[#007a3d]/80 uppercase mb-1">
                                        امارت اسلامی افغانستان
                                    </p>
                                    <h1 className="text-[1.1rem] font-black text-[#1a1a1a] leading-tight">
                                        {letter.sender_department?.organization?.name || 'وزارت / ریاست'}
                                    </h1>
                                    <p className="text-[0.8rem] font-bold text-slate-600 mt-0.5">
                                        {letter.sender_department?.name || 'معینیت / آمریت'}
                                    </p>
                                </div>

                                {/* Letter metadata box - Afghan style */}
                                <div className="flex-shrink-0 border border-[#d4af37]/40 text-xs bg-[#fdfaf0]
                                    min-w-[150px] rounded-sm overflow-hidden">
                                    {[
                                        { key: 'شماره',   val: letter.letter_number || '—' },
                                        { key: 'تاریخ',   val: afgDate },
                                        { key: 'ضمیمه',   val: letter.attachments?.length ? `${letter.attachments.length} فایل` : 'ندارد' },
                                        { key: 'صفحات',   val: String(letter.sheet_count || 1) },
                                    ].map((row, i) => (
                                        <div key={row.key} className={`flex items-center ${i > 0 ? 'border-t border-[#d4af37]/20' : ''}`}>
                                            <span className="px-2 py-1.5 bg-[#007a3d]/5 text-[#007a3d]/70 font-bold w-14 flex-shrink-0 border-l border-[#d4af37]/20 text-center">
                                                {row.key}
                                            </span>
                                            <span className="px-2 py-1.5 font-black text-slate-800 tracking-wide">
                                                {row.val}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── Separation rule ── */}
                            <div className="border-b-2 border-[#d4af37]/30 mb-5" />

                            {/* ── To / Subject ── */}
                            <div className="mb-5 space-y-2 text-[0.875rem]">
                                <div className="flex gap-3">
                                    <span className="font-black text-[#007a3d] w-14 flex-shrink-0 text-left">به:</span>
                                    <span className="text-slate-800">
                                        <span className="font-bold">{letter.recipient_name || '—'}</span>
                                        {letter.recipient_position_name && (
                                            <> — <span className="font-semibold">{letter.recipient_position_name}</span></>
                                        )}
                                        {letter.recipient_department && (
                                            <span className="text-slate-500"> / {letter.recipient_department.name}</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-black text-[#007a3d] w-14 flex-shrink-0 text-left">موضوع:</span>
                                    <span className="font-bold text-slate-800">{letter.subject}</span>
                                </div>
                            </div>

                            {/* Thin separator */}
                            <div className="border-t border-dashed border-[#d4af37]/20 mb-5" />

                            {/* ── Salutation ── */}
                            <p className="text-[0.9375rem] font-semibold text-slate-800 mb-4 leading-[2.6rem]">
                                با عرض سلام و احترامات فائقه،
                            </p>

                            {/* ── Body ── */}
                            <div className="afg-letter-body min-h-48 mb-8"
                                dangerouslySetInnerHTML={{
                                    __html: letter.content || '<p style="color:#94a3b8;font-style:italic">متن مکتوب درج نگردیده است.</p>'
                                }}
                            />

                            {/* ── Summary ── */}
                            {letter.summary && (
                                <div className="mb-8 border-r-4 border-[#c8102e]/40 pr-4 py-2 bg-[#fdfaf0]">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#c8102e]/70 mb-1">خلاصه</p>
                                    <p className="text-[0.875rem] text-slate-700 leading-7">{letter.summary}</p>
                                </div>
                            )}

                            {/* ── Closing salutation ── */}
                            <p className="text-[0.875rem] text-slate-700 mb-10 leading-[2.6rem]">
                                با تقدیم احترامات
                            </p>

                            {/* ── Signature row ── */}
                            <div className="flex items-end justify-between mt-4">

                                {/* Stamp area */}
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className="afg-stamp" />
                                    <span className="text-[9px] font-semibold text-slate-400 tracking-wider">مهر رسمی</span>
                                </div>

                                {/* Security level seal */}
                                <div className="self-center">
                                    {letter.security_level && letter.security_level !== 'public' && (
                                        <div className="border-2 border-[#c8102e]/40 px-5 py-1.5 rounded-sm bg-[#fdfaf0]">
                                            <p className="text-[11px] font-black tracking-[0.2em] text-[#c8102e]/80 uppercase text-center">
                                                {securityLevels[letter.security_level] || letter.security_level}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Sender signature */}
                                <div className="text-center min-w-[160px]">
                                    <div className="h-12 mb-2" />
                                    <div className="border-b border-[#d4af37]/50 mb-2" />
                                    <p className="text-[0.875rem] font-black text-slate-800">{letter.sender_name || '—'}</p>
                                    <p className="text-[0.8rem] font-semibold text-slate-500 mt-0.5">{letter.sender_position_name || '—'}</p>
                                    {letter.sender_department && (
                                        <p className="text-[0.75rem] text-slate-400 mt-0.5">{letter.sender_department.name}</p>
                                    )}
                                </div>
                            </div>

                            {/* ── Footer band ── */}
                            <div className="afg-footer-band mt-8 mb-2" />

                            {/* Footer info line */}
                            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 tracking-wide">
                                <span>تعقیب: {letter.tracking_number || '—'}</span>
                                <span>ثبت: {afgCreated}</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Attachments panel ── */}
                    {letter.attachments && letter.attachments.length > 0 && (
                        <div className="no-print mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-l from-white to-slate-50/60">
                                <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                                    <Paperclip className="h-4 w-4 text-indigo-500" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 flex-1">ضمیمه‌جات</h3>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                                    {letter.attachments.length}
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {letter.attachments.map(att => (
                                    <div key={att.id}
                                        className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition group">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-4 w-4 text-indigo-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-700 truncate">{att.file_name}</p>
                                                <p className="text-xs text-slate-400">{(att.file_size / 1024).toFixed(1)} KB • {att.download_count} دانلود</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => window.open(letters.show({ query: { attachment: att.id } }), '_blank')}
                                            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-indigo-600
                                            hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition
                                            opacity-0 group-hover:opacity-100">
                                            <Download className="h-3.5 w-3.5" />
                                            دانلود
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Routing history ── */}
                    {letter.routings && letter.routings.length > 0 && (
                        <div className="no-print mt-5 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-l from-white to-slate-50/60">
                                <div className="h-8 w-8 rounded-xl bg-violet-50 flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-violet-500" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 flex-1">تاریخچه ارجاعات</h3>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">
                                    {letter.routings.length}
                                </span>
                            </div>
                            <div className="px-6 py-5 space-y-0">
                                {letter.routings.map((routing, idx) => {
                                    const rCfg = ROUTING_STATUS[routing.status] ?? ROUTING_STATUS.pending;
                                    const RIcon = rCfg.icon;
                                    const isOverdue = routing.deadline &&
                                        new Date(routing.deadline) < new Date() &&
                                        routing.status === 'pending';
                                    const isLast = idx === letter.routings.length - 1;

                                    return (
                                        <div key={routing.id} className="relative flex gap-4 pb-5">
                                            {!isLast && (
                                                <div className="absolute right-3 top-7 bottom-0 w-px bg-slate-200" />
                                            )}
                                            <div className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center z-10 mt-0.5"
                                                style={{ backgroundColor: rCfg.bg }}>
                                                <RIcon className="h-3.5 w-3.5" style={{ color: rCfg.color }} />
                                            </div>
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-bold text-slate-800">
                                                            {ACTION_LABELS[routing.action_type] || routing.action_type}
                                                        </span>
                                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                            style={{ backgroundColor: rCfg.bg, color: rCfg.color }}>
                                                            {rCfg.label}
                                                        </span>
                                                        {isOverdue && (
                                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                                                                <AlertCircle className="h-3 w-3" />تأخیردار
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-slate-400 flex-shrink-0">
                                                        {new Date(routing.created_at).toLocaleDateString('fa-AF')}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    از <span className="font-semibold text-slate-700">{routing.from_user?.full_name || 'سیستم'}</span>
                                                    {' '}←{' '}
                                                    به <span className="font-semibold text-slate-700">{routing.to_user?.full_name || 'نامشخص'}</span>
                                                </p>
                                                {routing.deadline && (
                                                    <p className={`text-xs mt-0.5 ${isOverdue ? 'text-rose-500 font-semibold' : 'text-slate-400'}`}>
                                                        مهلت: {new Date(routing.deadline).toLocaleDateString('fa-AF')}
                                                    </p>
                                                )}
                                                {routing.instruction && (
                                                    <div className="mt-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2">
                                                        <p className="text-xs text-violet-700 leading-relaxed">{routing.instruction}</p>
                                                    </div>
                                                )}
                                                {routing.completed_note && (
                                                    <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                                                        یادداشت: {routing.completed_note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showArchiveModal && (
                <ArchiveModal cases={cases} loading={loading}
                    onClose={() => setShowArchiveModal(false)}
                    onConfirm={handleArchive} />
            )}
        </>
    );
}