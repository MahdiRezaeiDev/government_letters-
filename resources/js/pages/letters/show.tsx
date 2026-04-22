import { Head, Link, router } from '@inertiajs/react';
import {
    Archive, Send, Printer, Clock, AlertCircle,
    Building2, FileText, CheckCircle, XCircle,
    Paperclip, Loader2, ChevronRight, FolderOpen, Download
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import letters from '@/routes/letters';
import type { Letter, Case } from '@/types';
import routings from '@/routes/routings';

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
    draft:    { label: 'پیش‌نویس',    color: '#64748b', bg: '#f1f5f9', icon: FileText },
    pending:  { label: 'در انتظار',   color: '#b45309', bg: '#fef3c7', icon: Clock },
    approved: { label: 'تأیید شده',   color: '#15803d', bg: '#dcfce7', icon: CheckCircle },
    rejected: { label: 'رد شده',      color: '#b91c1c', bg: '#fee2e2', icon: XCircle },
    archived: { label: 'بایگانی شده', color: '#475569', bg: '#f1f5f9', icon: Archive },
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

// ─── Archive Modal ──────────────────────────────────────────────────────────
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
                        <h3 className="text-sm font-bold text-slate-800">بایگانی نامه</h3>
                        <p className="text-xs text-slate-400 mt-0.5">پرونده مقصد را انتخاب کنید</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
                        <FolderOpen className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select value={sel || ''} onChange={e => setSel(parseInt(e.target.value) || null)} disabled={loading}
                            className="w-full pr-10 pl-9 py-3 text-sm bg-transparent focus:outline-none appearance-none text-slate-700">
                            <option value="">انتخاب پرونده...</option>
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
                            بایگانی
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main ───────────────────────────────────────────────────────────────────
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
            onSuccess: () => { setShowArchiveModal(false); setLoading(false); router.reload(); },
            onError: () => setLoading(false),
        });
    };

    const handleApprove = () => {
        if (!confirm('آیا از تأیید این نامه اطمینان دارید؟')) return;
        setLoading(true);
        router.post(letters.show({ letter: letter.id }), {}, {
            onSuccess: () => { setLoading(false); router.reload(); },
            onError: () => setLoading(false),
        });
    };

    const handleReject = () => {
        const reason = prompt('لطفاً دلیل رد را وارد کنید:');
        if (!reason) return;
        setLoading(true);
        router.post(letters.show({ letter: letter.id }), { reason }, {
            onSuccess: () => { setLoading(false); router.reload(); },
            onError: () => setLoading(false),
        });
    };

    const letterDate = letter.date
        ? new Date(letter.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—';
    const createdDate = new Date(letter.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Head title={letter.subject} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap');
                * { font-family: 'Vazirmatn', sans-serif; }
                :root { direction: rtl; }

                /* ── White paper, no texture for clean print ── */
                .letter-paper {
                    background: #ffffff;
                    box-shadow:
                        0 1px 2px rgba(0,0,0,0.04),
                        0 4px 24px rgba(0,0,0,0.10),
                        0 0 0 1px rgba(0,0,0,0.04);
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                }

                /* ── Header top line ── */
                .header-top-line {
                    height: 6px;
                    background: #1a1a2e;
                }

                /* ── Divider between header and body ── */
                .header-divider {
                    border: none;
                    border-top: 1.5px solid #555;
                    margin: 0;
                }

                /* ── Footer top line ── */
                .footer-divider {
                    border: none;
                    border-top: 1.5px solid #555;
                    margin: 0;
                }

                /* ── Letter body ── */
                .letter-body {
                    font-size: 14px;
                    line-height: 2.2;
                    color: #111;
                    text-align: justify;
                    word-spacing: 0.04em;
                }
                .letter-body p { margin: 0 0 0.5rem 0; }

                /* ── Number/date table cells ── */
                .meta-row {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12.5px;
                    line-height: 1.8;
                    color: #222;
                }
                .meta-label {
                    font-weight: 700;
                    color: #333;
                    min-width: 52px;
                }

                /* ── Org name center ── */
                .org-center-name {
                    font-size: 50px;
                    font-weight: 800;
                    color: #1a1a2e;
                    line-height: 1.6;
                    text-align: center;
                }
                .sub-dept-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: #333;
                    text-align: center;
                    line-height: 1.7;
                }

                /* ── Emblem circle ── */
                .emblem-circle {
                    width: 80px; height: 80px;
                    border-radius: 50%;
                    border: 1.5px solid #aaa;
                    display: flex; align-items: center; justify-content: center;
                    background: #f9f9f9;
                    overflow: hidden;
                }

                /* ── Signature underline ── */
                .sig-line {
                    border-bottom: 1px solid #555;
                    margin-bottom: 6px;
                    min-height: 48px;
                }

                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    .letter-paper {
                        box-shadow: none !important;
                        width: 100% !important;
                        min-height: auto !important;
                        margin: 0 !important;
                    }
                    .print-area { padding: 0 !important; }
                }
            `}</style>

            <div className="min-h-screen bg-slate-200/70" dir="rtl">

                {/* ── Toolbar (no-print) ── */}
                <div className="no-print sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                    <div className="max-w-[220mm] mx-auto px-4">
                        <div className="flex items-center justify-between h-14 gap-3">
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-1.5 min-w-0">
                                <Link href={letters.index()}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition">
                                    نامه‌ها
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
                                        <span className="hidden sm:inline">بایگانی</span>
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

                {/* ── Print / View area ── */}
                <div className="print-area py-8 px-4">
                    <div className="letter-paper">

                        {/* ══ TOP COLOR BAR ══ */}
                        <div className="header-top-line" />

                        {/* ══ LETTERHEAD ══ */}
                        <div className="px-10 pt-5 pb-0">

                            {/* Row 1: Left emblem | Center org names | Right emblem */}
                            <div className="flex items-center justify-between gap-4">

                                {/* Right emblem */}
                                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                    <div className="emblem-circle">
                                        {letter.sender_department?.organization?.logo ? (
                                            <img src={letter.sender_department.organization.logo} alt="آرم" className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="h-8 w-8 text-slate-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Center: Organization names stacked */}
                                <div className="flex-1 text-center px-2">
                                    <p className="org-center-name nastaliq text-9xl">
                                        {letter.sender_department?.organization?.name || 'امارت اسلامی افغانستان'}
                                    </p>
                                    <p className="sub-dept-name">
                                        {letter.sender_department?.name || 'وزارت / معاونت'}
                                    </p>
                                </div>

                                {/* Left emblem */}
                                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                    <div className="emblem-circle">
                                        <Building2 className="h-8 w-8 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Recipient dept centered */}
                            {letter.recipient_department && (
                                <div className="text-center mt-3 mb-1">
                                    <p className="sub-dept-name">{letter.recipient_department.name}</p>
                                </div>
                            )}

                            {/* Row 3: Number / Date metadata — two columns */}
                            <div className="flex justify-between items-start mt-4 mb-3 gap-6">
                                {/* Right column: شماره + شماره رسیدات */}
                                <div className="space-y-0.5">
                                    <div className="meta-row">
                                        <span className="meta-label">شماره :</span>
                                        <span className="font-bold tracking-wide">{letter.letter_number || '—'}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label">شماره رسیدات:</span>
                                        <span>{letter.tracking_number || '—'}</span>
                                    </div>
                                </div>

                                {/* Left column: نیته (dates) + ضمایم */}
                                <div className="space-y-0.5 text-left">
                                    <div className="meta-row flex-row-reverse">
                                        <span className="meta-label text-right">نیته :</span>
                                        <span>{letterDate}</span>
                                    </div>
                                    <div className="meta-row flex-row-reverse">
                                        <span className="meta-label text-right">تاریخ ثبت :</span>
                                        <span>{createdDate}</span>
                                    </div>
                                    <div className="meta-row flex-row-reverse">
                                        <span className="meta-label text-right">ضمایم :</span>
                                        <span>{letter.attachments?.length ? `${letter.attachments.length} فایل` : 'ندارد'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Divider ── */}
                            <div className="header-divider" />
                        </div>

                        {/* ══ BODY ══ */}
                        <div className="px-10 pt-5 pb-4">

                            {/* Recipient / To line */}
                            <div className="text-center mb-4 space-y-0.5">
                                <p style={{ fontSize: '14px', fontWeight: 700, color: '#111', lineHeight: 1.8 }}>
                                    {letter.recipient_name || '—'}
                                    {letter.recipient_position_name && (
                                        <span style={{ fontWeight: 600, color: '#333' }}> {letter.recipient_position_name}</span>
                                    )}
                                    {' '}!
                                </p>
                            </div>

                            {/* Subject line */}
                            <div className="flex gap-2 mb-3" style={{ fontSize: '13.5px' }}>
                                <span style={{ fontWeight: 800, minWidth: '56px', color: '#1a1a2e' }}>موضوع :</span>
                                <span style={{ fontWeight: 700, color: '#111' }}>{letter.subject}</span>
                            </div>

                            {/* Salutation */}
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '8px', lineHeight: 2 }}>
                                السلام عليكم ورحمة الله وبركاته
                            </p>

                            {/* Letter body */}
                            <div className="letter-body mb-6"
                                dangerouslySetInnerHTML={{
                                    __html: letter.content || '<p style="color:#94a3b8;font-style:italic">متن نامه وارد نشده است.</p>'
                                }}
                            />

                            {/* Summary */}
                            {letter.summary && (
                                <div className="mb-5 pr-3 border-r-2 border-slate-400">
                                    <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.9 }}>{letter.summary}</p>
                                </div>
                            )}

                            {/* Closing */}
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', textAlign: 'center', margin: '12px 0 32px 0' }}>
                                والسلام
                            </p>

                            {/* ══ SIGNATURE BLOCK ══ */}
                            {/* Positioned left-of-center, like the scanned letter */}
                            <div className="flex justify-start pr-8 mb-10">
                                <div style={{ minWidth: '200px', maxWidth: '240px', textAlign: 'center' }}>
                                    {/* Signature space */}
                                    <div className="sig-line" />
                                    <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#111', lineHeight: 1.7 }}>
                                        {letter.sender_name || '—'}
                                    </p>
                                    <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', lineHeight: 1.7 }}>
                                        {letter.sender_position_name || '—'}
                                    </p>
                                    {letter.sender_department && (
                                        <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.7 }}>
                                            {letter.sender_department.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ══ FOOTER ══ */}
                        <div className="px-10 pb-5 mt-auto">
                            <div className="footer-divider mb-3" />
                            {/* Two-column contact footer, like the scanned letter */}
                            <div className="flex justify-between items-start" style={{ fontSize: '11.5px', color: '#444' }}>
                                {/* Right: Persian contact */}
                                <div className="space-y-0.5 text-right">
                                    {letter.sender_department?.organization?.address && (
                                        <p>ادرس: {letter.sender_department.organization.address}</p>
                                    )}
                                    {letter.sender_department?.organization?.phone && (
                                        <p>تلیفون: {letter.sender_department.organization.phone}</p>
                                    )}
                                    {letter.sender_department?.organization?.email && (
                                        <p>ایمیل: {letter.sender_department.organization.email}</p>
                                    )}
                                    {/* Fallbacks */}
                                    {!letter.sender_department?.organization?.address && (
                                        <p style={{ color: '#aaa' }}>آدرس سازمان</p>
                                    )}
                                </div>
                                {/* Left: security/priority badges */}
                                <div className="text-left space-y-1">
                                    {letter.security_level && letter.security_level !== 'public' && (
                                        <p style={{ fontWeight: 700 }}>
                                            سطح: {securityLevels[letter.security_level] || letter.security_level}
                                        </p>
                                    )}
                                    <p>
                                        اولویت: {priorityLevels[letter.priority] || letter.priority}
                                    </p>
                                    <p style={{ color: '#888' }}>صفحات: {letter.sheet_count || 1}</p>
                                </div>
                            </div>
                        </div>

                    </div>{/* /letter-paper */}

                    {/* ══ ATTACHMENTS PANEL (screen only) ══ */}
                    {letter.attachments && letter.attachments.length > 0 && (
                        <div className="no-print mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                            style={{ maxWidth: '210mm', margin: '24px auto 0' }}>
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-l from-white to-slate-50/60">
                                <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                                    <Paperclip className="h-4 w-4 text-indigo-500" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 flex-1">پیوست‌ها</h3>
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
                                                <p className="text-xs text-slate-400">{(att.file_size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => window.open(letters.show({ query: { attachment: att.id } }), '_blank')}
                                            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition opacity-0 group-hover:opacity-100">
                                            <Download className="h-3.5 w-3.5" />دانلود
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ══ ROUTING HISTORY (screen only) ══ */}
                    {letter.routings && letter.routings.length > 0 && (
                        <div className="no-print mt-5 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                            style={{ maxWidth: '210mm', margin: '20px auto 0' }}>
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-l from-white to-slate-50/60">
                                <div className="h-8 w-8 rounded-xl bg-violet-50 flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-violet-500" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 flex-1">تاریخچه ارجاعات</h3>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">
                                    {letter.routings.length}
                                </span>
                            </div>
                            <div className="px-6 py-5">
                                {letter.routings.map((routing, idx) => {
                                    const rCfg = ROUTING_STATUS[routing.status] ?? ROUTING_STATUS.pending;
                                    const RIcon = rCfg.icon;
                                    const isOverdue = routing.deadline && new Date(routing.deadline) < new Date() && routing.status === 'pending';
                                    const isLast = idx === letter.routings.length - 1;
                                    return (
                                        <div key={routing.id} className="relative flex gap-4 pb-5">
                                            {!isLast && <div className="absolute right-3 top-7 bottom-0 w-px bg-slate-200" />}
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
                                                        {new Date(routing.created_at).toLocaleDateString('fa-IR')}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    از <span className="font-semibold text-slate-700">{routing.from_user?.full_name || 'سیستم'}</span>
                                                    {' '}←{' '}
                                                    به <span className="font-semibold text-slate-700">{routing.to_user?.full_name || 'نامشخص'}</span>
                                                </p>
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

                </div>{/* /print-area */}
            </div>

            {showArchiveModal && (
                <ArchiveModal cases={cases} loading={loading}
                    onClose={() => setShowArchiveModal(false)}
                    onConfirm={handleArchive} />
            )}
        </>
    );
}