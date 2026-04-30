import { Head, Link, router } from '@inertiajs/react';
import {
    Archive, Send, Printer, Clock, AlertCircle,
    Building2, FileText, CheckCircle, XCircle,
    Paperclip, Loader2, ChevronRight, FolderOpen, Download,
    Eye, X, ZoomIn, ZoomOut, RotateCw, ExternalLink, ImageIcon, FileIcon,
    CornerUpLeft, Bell, Calendar, Check, AlertTriangle
} from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import letters from '@/routes/letters';
import routings from '@/routes/routings';
import type { Letter, Case } from '@/types';

interface Attachment {
    id: number;
    file_name: string;
    file_size: number;
    mime_type?: string;
    file_path?: string;
}

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
        reply: boolean;
    };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    draft: { label: 'پیش‌نویس', color: '#64748b', bg: '#f1f5f9', icon: FileText },
    pending: { label: 'در انتظار', color: '#b45309', bg: '#fef3c7', icon: Clock },
    approved: { label: 'تأیید شده', color: '#15803d', bg: '#dcfce7', icon: CheckCircle },
    rejected: { label: 'رد شده', color: '#b91c1c', bg: '#fee2e2', icon: XCircle },
    archived: { label: 'بایگانی شده', color: '#475569', bg: '#f1f5f9', icon: Archive },
};

const ROUTING_STATUS: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    completed: { label: 'تکمیل شده', color: '#15803d', bg: '#dcfce7', icon: CheckCircle },
    rejected: { label: 'رد شده', color: '#b91c1c', bg: '#fee2e2', icon: XCircle },
    pending: { label: 'در انتظار', color: '#b45309', bg: '#fef3c7', icon: Clock },
};

const ACTION_LABELS: Record<string, string> = {
    approval: 'جهت تأیید', action: 'جهت اقدام',
    information: 'جهت اطلاع', coordination: 'جهت هماهنگی', sign: 'جهت امضاء',
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const getDownloadUrl = (id: number) => `/attachments/${id}/download`;
const getPreviewUrl = (id: number) => `/attachments/${id}/preview`;

const isImage = (mime?: string, name?: string) => {
    if (mime) {
        return mime.startsWith('image/');
    }

    const ext = name?.split('.').pop()?.toLowerCase();

    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
};

const isPdf = (mime?: string, name?: string) => {
    if (mime) {
        return mime === 'application/pdf';
    }

    return name?.toLowerCase().endsWith('.pdf');
};

const formatSize = (bytes: number) => {
    if (bytes === 0) {
        return '0 B';
    }

    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (att: Attachment) => {
    if (isImage(att.mime_type, att.file_name)) {
        return { icon: ImageIcon, color: 'text-violet-500', bg: 'bg-violet-50' };
    }

    if (isPdf(att.mime_type, att.file_name)) {
        return { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' };
    }

    return { icon: FileIcon, color: 'text-blue-500', bg: 'bg-blue-50' };
};

// ─── Attachment Preview Modal ────────────────────────────────────────────────
function AttachmentPreviewModal({ att, onClose }: { att: Attachment; onClose: () => void }) {
    const [zoom, setZoom] = useState(100);
    const [rotate, setRotate] = useState(0);
    const previewUrl = getPreviewUrl(att.id);
    const downloadUrl = getDownloadUrl(att.id);
    const canPreview = isImage(att.mime_type, att.file_name) || isPdf(att.mime_type, att.file_name);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/10"
                style={{ background: 'rgba(15,15,20,0.95)' }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getFileIcon(att).bg}`}>
                        {React.createElement(getFileIcon(att).icon, { className: `h-4 w-4 ${getFileIcon(att).color}` })}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{att.file_name}</p>
                        <p className="text-xs text-white/40">{formatSize(att.file_size)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isImage(att.mime_type, att.file_name) && (
                        <>
                            <button onClick={() => setZoom(z => Math.max(25, z - 25))}
                                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition">
                                <ZoomOut className="h-4 w-4" />
                            </button>
                            <span className="text-xs text-white/50 w-10 text-center">{zoom}%</span>
                            <button onClick={() => setZoom(z => Math.min(300, z + 25))}
                                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition">
                                <ZoomIn className="h-4 w-4" />
                            </button>
                            <button onClick={() => setRotate(r => (r + 90) % 360)}
                                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition">
                                <RotateCw className="h-4 w-4" />
                            </button>
                            <div className="w-px h-5 bg-white/20 mx-1" />
                        </>
                    )}
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition">
                        <ExternalLink className="h-4 w-4" />
                    </a>
                    <a href={downloadUrl} download
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition">
                        <Download className="h-3.5 w-3.5" /> دانلود
                    </a>
                    <button onClick={onClose} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition mr-1">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center p-6" onClick={e => e.stopPropagation()}>
                {isImage(att.mime_type, att.file_name) ? (
                    <img src={previewUrl} alt={att.file_name}
                        style={{
                            maxWidth: '100%', transform: `scale(${zoom / 100}) rotate(${rotate}deg)`,
                            transition: 'transform 0.2s ease', transformOrigin: 'center',
                            borderRadius: '4px', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                        }} />
                ) : isPdf(att.mime_type, att.file_name) ? (
                    <div className="w-full h-full min-h-[70vh]" style={{ maxWidth: '900px' }}>
                        <iframe src={`${previewUrl}#toolbar=1&navpanes=0`} title={att.file_name}
                            className="w-full h-full rounded-xl" style={{ minHeight: '70vh', border: 'none' }} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 text-center p-12">
                        <div className="h-24 w-24 rounded-2xl bg-white/5 flex items-center justify-center">
                            <FileIcon className="h-12 w-12 text-white/30" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-lg mb-1">{att.file_name}</p>
                            <p className="text-white/40 text-sm">پیش‌نمایش برای این نوع فایل در دسترس نیست</p>
                        </div>
                        <a href={downloadUrl} download
                            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg">
                            <Download className="h-4 w-4" /> دانلود فایل
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Archive Modal ───────────────────────────────────────────────────────────
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
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />} بایگانی
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Reply Modal ───────────────────────────────────────────────────────────
function ReplyModal({ letter, onClose, onSuccess }: {
    letter: Letter;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState(`پاسخ به: ${letter.subject}`);
    const [isFollowUp, setIsFollowUp] = useState(false);
    const [nextFollowUpDate, setNextFollowUpDate] = useState('');
    const [followUpNotes, setFollowUpNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('متن پاسخ الزامی است');
            return;
        }

        setLoading(true);
        setError('');

        router.post(letters.reply.store({ letter: letter.id }), {
            subject,
            content,
            is_draft: isDraft,
            is_follow_up: isFollowUp,
            next_follow_up_date: nextFollowUpDate || null,
            follow_up_notes: followUpNotes || null,
        }, {
            onSuccess: () => {
                onSuccess();
                onClose();
            },
            onError: (errors) => {
                setError(Object.values(errors).flat().join(', '));
                setLoading(false);
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <CornerUpLeft className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">پاسخ به نامه</h3>
                        <p className="text-xs text-slate-400 mt-0.5">پاسخ خود را بنویسید</p>
                    </div>
                </div>

                <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            موضوع <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            متن پاسخ <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={6}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            placeholder="متن پاسخ خود را بنویسید..."
                        />
                    </div>

                    {/* Follow-up Option */}
                    <div className="border-t border-slate-100 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isFollowUp}
                                onChange={(e) => setIsFollowUp(e.target.checked)}
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm font-medium text-slate-700">این پاسخ نیاز به تعقیب دارد</span>
                        </label>

                        {isFollowUp && (
                            <div className="mt-3 mr-6 space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                        تاریخ یادآوری بعدی
                                    </label>
                                    <input
                                        type="date"
                                        value={nextFollowUpDate}
                                        onChange={(e) => setNextFollowUpDate(e.target.value)}
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                        توضیحات تعقیب
                                    </label>
                                    <textarea
                                        value={followUpNotes}
                                        onChange={(e) => setFollowUpNotes(e.target.value)}
                                        rows={2}
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                                        placeholder="توضیحات مربوط به نحوه تعقیب..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                        >
                            انصراف
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={loading}
                            className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : <FileText className="h-4 w-4 inline ml-1" />}
                            پیش‌نویس
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-50 transition-all"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            ارسال پاسخ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── FollowUp Modal ───────────────────────────────────────────────────────────
function FollowUpModal({ letter, onClose, onSuccess }: {
    letter: Letter;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [status, setStatus] = useState(letter.follow_up_status || 'pending');
    const [notes, setNotes] = useState(letter.follow_up_notes || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        router.patch(letters.followUp.update({ letter: letter.id }), {
            status,
            follow_up_notes: notes,
        }, {
            onSuccess: () => {
                onSuccess();
                onClose();
            },
            onError: () => setLoading(false),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Bell className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">بروزرسانی وضعیت تعقیب</h3>
                        <p className="text-xs text-slate-400 mt-0.5">وضعیت پیگیری نامه را مشخص کنید</p>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            وضعیت
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                        >
                            <option value="pending">در انتظار</option>
                            <option value="in_progress">در حال پیگیری</option>
                            <option value="completed">تکمیل شده</option>
                            <option value="overdue">تأخیر خورده</option>
                            <option value="cancelled">لغو شده</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            یادداشت‌ها
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                            placeholder="توضیحات مربوط به پیگیری..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                        >
                            انصراف
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md disabled:opacity-50 transition-all"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            ذخیره تغییرات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LettersShow({ letter, securityLevels, priorityLevels, availableCases = [], can }: Props) {
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [previewAtt, setPreviewAtt] = useState<Attachment | null>(null);
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState<Case[]>(availableCases);

    const statusCfg = STATUS_CONFIG[letter.final_status] ?? STATUS_CONFIG.pending;
    const StatusIcon = statusCfg.icon;

    // آیا این نامه نیاز به تعقیب دارد؟
    const needsFollowUp = letter.is_follow_up &&
        letter.follow_up_status === 'pending' &&
        letter.next_follow_up_date &&
        new Date(letter.next_follow_up_date) <= new Date();

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
        if (!confirm('آیا از تأیید این نامه اطمینان دارید؟')) {
            return;
        }

        setLoading(true);
        router.post(letters.approve({ letter: letter.id }), {}, {
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
        router.post(letters.reject({ letter: letter.id }), { reason }, {
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

    return (
        <>
            <Head title={letter.subject} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap');

                .a4-page {
                    width: 210mm;
                    min-height: 297mm;
                    background: #ffffff;
                    margin: 0 auto;
                    position: relative;
                    font-family: 'Noto Nastaliq Urdu', 'Traditional Arabic', 'Tahoma', serif;
                }

                /* Header Area */
                .header-emblem {
                    width: 70px;
                    height: 82px;
                    border: 1.5px solid #1a1a1a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff;
                    padding: 4px;
                }

                .header-emblem img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                /* Bismillah */
                .bismillah-text {
                    font-family: 'Noto Nastaliq Urdu', serif;
                    font-size: 28px;
                    text-align: center;
                    color: #000;
                    margin: 8px 0 4px;
                    letter-spacing: 2px;
                    line-height: 2.5;
                }

                /* Org Name */
                .org-full-name {
                    font-family: 'Noto Nastaliq Urdu', serif;
                    font-size: 18px;
                    font-weight: 700;
                    text-align: center;
                    color: #000;
                    margin: 0;
                    line-height: 2;
                }

                .org-dept-name {
                    font-family: 'Noto Nastaliq Urdu', serif;
                    font-size: 15px;
                    font-weight: 600;
                    text-align: center;
                    color: #1a1a1a;
                    margin: 2px 0 0;
                    line-height: 1.8;
                }

                .recipient-dept-name {
                    font-family: 'Noto Nastaliq Urdu', serif;
                    font-size: 14px;
                    font-weight: 600;
                    text-align: center;
                    color: #1a1a1a;
                    margin: 6px 0 0;
                    line-height: 1.8;
                }

                /* Separators */
                .thick-black-line {
                    height: 2.5px;
                    background: #000;
                    margin: 12px 35px 0;
                }

                .thin-black-line {
                    height: 1px;
                    background: #000;
                    margin: 6px 35px;
                }

                /* Reference Row */
                .ref-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 0 35px;
                    padding: 8px 10px;
                    font-size: 14px;
                    font-weight: 700;
                    color: #000;
                    font-family: 'Courier New', 'Tahoma', monospace;
                }

                .ref-row-left {
                    text-align: right;
                }

                .ref-row-right {
                    text-align: left;
                }

                /* Recipient */
                .to-section {
                    margin: 12px 35px 0;
                    text-align: right;
                    font-size: 15px;
                    line-height: 2.2;
                    color: #000;
                }

                .to-name {
                    font-weight: 700;
                    font-size: 15px;
                }

                .to-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                }

                .salam-text {
                    font-size: 14px;
                    font-weight: 600;
                    margin-top: 4px;
                }

                /* Subject */
                .subject-row {
                    margin: 10px 35px;
                    text-align: right;
                    font-size: 14px;
                    font-weight: 700;
                    color: #000;
                    border-bottom: 1px solid #000;
                    padding-bottom: 6px;
                }

                .subject-label {
                    margin-left: 8px;
                }

                /* Body Content */
                .letter-body-content {
                    margin: 18px 35px;
                    text-align: justify;
                    font-size: 14px;
                    line-height: 2.4;
                    color: #000;
                }

                /* Summary Box */
                .summary-box {
                    margin: 10px 35px;
                    padding: 10px 14px;
                    background: #f9f9f9;
                    border: 1px solid #ddd;
                    font-size: 13px;
                    line-height: 2;
                    color: #444;
                }

                /* Signature */
                .sign-area {
                    margin: 35px 35px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }

                .stamp-placeholder {
                    width: 65px;
                    height: 65px;
                    border: 2px dashed #aaa;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 9px;
                    color: #999;
                    transform: rotate(-15deg);
                    text-align: center;
                    line-height: 1.3;
                }

                .sign-block {
                    text-align: center;
                    min-width: 180px;
                }

                .sign-name {
                    font-size: 15px;
                    font-weight: 700;
                    color: #000;
                    margin-bottom: 2px;
                }

                .sign-position {
                    font-size: 13px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 2px;
                }

                .sign-dept {
                    font-size: 12px;
                    color: #555;
                }

                /* Footer */
                .footer-row {
                    margin: 25px 35px 20px;
                    border-top: 2px solid #000;
                    padding-top: 10px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: #444;
                    line-height: 1.8;
                }

                .footer-right {
                    text-align: right;
                }

                .footer-left {
                    text-align: left;
                }

                .security-badge {
                    color: #c00;
                    font-weight: 700;
                }

                /* Print Styles */
                @media print {
                    body {
                        background: white !important;
                        margin: 0;
                        padding: 0;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .a4-page {
                        box-shadow: none !important;
                        border: none !important;
                        width: 100%;
                        margin: 0;
                        page-break-after: always;
                    }
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }

                /* Screen only */
                @media screen {
                    .a4-page {
                        box-shadow: 0 4px 24px rgba(0,0,0,0.15);
                        border: 1px solid #ccc;
                        margin: 0 auto 20px;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-gray-300 py-5" dir="rtl">

                {/* ── Toolbar ── */}
                <div className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-300 shadow-md mb-5">
                    <div className="max-w-[220mm] mx-auto px-4">
                        <div className="flex items-center justify-between h-14 gap-3">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <Link href={letters.index()}
                                    className="text-xs font-bold text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 transition">
                                    نامه‌ها
                                </Link>
                                <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <span className="text-xs font-bold text-gray-800 truncate max-w-[200px] sm:max-w-sm">
                                    {letter.subject}
                                </span>
                            </div>

                            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                                style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                                <StatusIcon className="h-3 w-3" /> {statusCfg.label}
                            </span>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button onClick={() => window.print()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition">
                                    <Printer className="h-3.5 w-3.5" /> <span className="hidden sm:inline">چاپ</span>
                                </button>

                                {/* دکمه پاسخ دادن */}
                                { letter.final_status !== 'draft' && (
                                    <Link href={letters.reply.form({ letter: letter.id })}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition shadow-sm">
                                        <CornerUpLeft className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">پاسخ</span>
                                    </Link>
                                )}

                                {/* دکمه بروزرسانی تعقیب */}
                                {letter.is_follow_up && (
                                    <button onClick={() => setShowFollowUpModal(true)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm relative ${needsFollowUp
                                            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                                            }`}>
                                        <Bell className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">تعقیب</span>
                                        {needsFollowUp && (
                                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-ping" />
                                        )}
                                    </button>
                                )}

                                {can.edit && letter.final_status === 'draft' && (
                                    <Link href={letters.edit({ letter: letter.id })}
                                        className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition">
                                        ویرایش
                                    </Link>
                                )}
                                {can.archive && letter.final_status === 'approved' && (
                                    <button onClick={() => setShowArchiveModal(true)} disabled={loading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded transition shadow-sm disabled:opacity-50">
                                        <Archive className="h-3.5 w-3.5" /> <span className="hidden sm:inline">بایگانی</span>
                                    </button>
                                )}
                                {can.route && letter.final_status === 'pending' && (
                                    <Link href={routings.create({ letter: letter.id })}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded transition shadow-sm">
                                        <Send className="h-3.5 w-3.5" /> <span className="hidden sm:inline">ارجاع</span>
                                    </Link>
                                )}
                                {can.approve && letter.final_status === 'pending' && (
                                    <>
                                        <button onClick={handleApprove} disabled={loading}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition shadow-sm disabled:opacity-50">
                                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                                            <span className="hidden sm:inline">تأیید</span>
                                        </button>
                                        <button onClick={handleReject} disabled={loading}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded transition shadow-sm disabled:opacity-50">
                                            <XCircle className="h-3.5 w-3.5" /> <span className="hidden sm:inline">رد</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Follow-up Warning Banner ── */}
                {needsFollowUp && (
                    <div className="no-print max-w-[210mm] mx-auto mb-4">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-red-800">
                                    این نامه نیاز به تعقیب دارد!
                                </p>
                                <p className="text-xs text-red-600 mt-0.5">
                                    تاریخ یادآوری: {new Date(letter.next_follow_up_date).toLocaleDateString('fa-IR')}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowFollowUpModal(true)}
                                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                            >
                                بروزرسانی وضعیت
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Thread/Conversation History ── */}
                {letter.replies && letter.replies.length > 0 && (
                    <div className="no-print mt-5 mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                        style={{ maxWidth: '210mm' }}>
                        <div className="px-6 py-4 border-b flex items-center gap-3 bg-gradient-to-l from-white to-emerald-50">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <CornerUpLeft className="h-4 w-4 text-emerald-600" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 flex-1">تاریخچه پاسخ‌ها</h3>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                                {letter.replies.length} پاسخ
                            </span>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            {letter.replies.map((reply: any) => (
                                <div key={reply.id} className="border-r-2 border-emerald-200 pr-4 py-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-800">
                                                {reply.sender_name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ({reply.sender_position_name})
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(reply.created_at).toLocaleDateString('fa-IR')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {reply.content}
                                    </p>
                                    {reply.is_follow_up && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <Bell className="h-3 w-3 text-amber-500" />
                                            <span className="text-xs text-amber-600">
                                                نیاز به تعقیب دارد
                                            </span>
                                        </div>
                                    )}
                                    <Link
                                        href={letters.show({ letter: reply.id })}
                                        className="inline-block mt-2 text-xs text-emerald-600 hover:text-emerald-700"
                                    >
                                        مشاهده کامل پاسخ →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── A4 Letter ── */}
                <div className="a4-page">

                    {/* Header with Emblems and Org Name */}
                    <div style={{ padding: '25px 35px 0' }}>

                        {/* Row: Right Emblem | Org Name | Left Emblem */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

                            {/* Right Emblem */}
                            <div className="header-emblem">
                                <img src="/img/gov.png" alt="نشان رسمی" />
                            </div>

                            {/* Center: Organization Name */}
                            <div style={{ flex: 1, padding: '0 15px' }}>
                                <div className="org-full-name">
                                    {letter.sender_department?.organization?.name || 'امارت اسلامی افغانستان'}
                                </div>
                                <div className="org-dept-name">
                                    {letter.sender_department?.name || 'وزارت / ریاست'}
                                </div>
                                {letter.recipient_department && (
                                    <div className="recipient-dept-name">
                                        به ریاست / آمریت محترم {letter.recipient_department.name}
                                    </div>
                                )}
                            </div>

                            {/* Left Emblem */}
                            <div className="header-emblem">
                                <img src="/img/gov.png" alt="نشان رسمی" />
                            </div>
                        </div>

                        {/* Bismillah */}
                        <div className="bismillah-text">
                            بسم الله الرحمن الرحیم
                        </div>
                    </div>

                    {/* Thick Line */}
                    <div className="thick-black-line" />

                    {/* Reference Numbers */}
                    <div className="ref-row">
                        <span className="ref-row-left">شماره: {letter.letter_number || '__________'}</span>
                        <span className="ref-row-right">تاریخ: {letterDate}</span>
                    </div>

                    {/* Thin Line */}
                    <div className="thin-black-line" />

                    {/* Recipient */}
                    <div className="to-section">
                        <p>
                            <span className="to-name">
                                محترم {letter.recipient_name || '_____________________'}
                            </span>
                            {letter.recipient_position_name && (
                                <span className="to-title"> صاحب / صاحبه</span>
                            )}
                        </p>
                        {letter.recipient_position_name && (
                            <p className="to-title">
                                {letter.recipient_position_name}
                            </p>
                        )}
                        <p className="salam-text">
                            السلام علیکم و رحمة الله و برکاته!
                        </p>
                        <p style={{ fontSize: '13px', marginTop: '4px', color: '#333' }}>
                            امید است مزاج تان سلامت و با کمال صحت و عافیت مصروف اجراآت امور خویش باشید.
                        </p>
                    </div>

                    {/* Subject */}
                    <div className="subject-row">
                        <span className="subject-label">موضوع:</span>
                        {letter.subject}
                    </div>

                    {/* Body */}
                    <div className="letter-body-content"
                        dangerouslySetInnerHTML={{
                            __html: letter.content || '<p style="color:#999;text-align:center;">[ متن نامه درج نشده است ]</p>'
                        }}
                    />

                    {/* Summary if exists */}
                    {letter.summary && (
                        <div className="summary-box">
                            <strong>خلاصه:</strong> {letter.summary}
                        </div>
                    )}

                    {/* Closing */}
                    <p style={{ textAlign: 'center', margin: '20px 35px', fontSize: '15px', fontWeight: 600 }}>
                        با احترام
                    </p>

                    {/* Signature */}
                    <div className="sign-area">
                        {/* Left: Stamp */}
                        <div>
                            <div className="stamp-placeholder">
                                محل مهر<br />رسمی
                            </div>
                        </div>

                        {/* Right: Signer Info */}
                        <div className="sign-block">
                            <p className="sign-name">
                                {letter.sender_name || '_________________'}
                            </p>
                            <p className="sign-position">
                                {letter.sender_position_name || ''}
                            </p>
                            {letter.sender_department && (
                                <p className="sign-dept">
                                    {letter.sender_department.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="footer-row">
                        <div className="footer-right">
                            {letter.sender_department?.organization?.address && (
                                <p>آدرس: {letter.sender_department.organization.address}</p>
                            )}
                            {letter.sender_department?.organization?.phone && (
                                <p>تلفن: {letter.sender_department.organization.phone}</p>
                            )}
                            {letter.sender_department?.organization?.email && (
                                <p>ایمیل: {letter.sender_department.organization.email}</p>
                            )}
                        </div>
                        <div className="footer-left">
                            {letter.security_level && letter.security_level !== 'public' && (
                                <p className="security-badge">
                                    {securityLevels[letter.security_level] || letter.security_level}
                                </p>
                            )}
                            <p>اولویت: {priorityLevels[letter.priority] || letter.priority}</p>
                            <p>ضمایم: {letter.attachments?.length ? `${letter.attachments.length} برگ` : 'ندارد'}</p>
                            {letter.sheet_count && (
                                <p>تعداد صفحات: {letter.sheet_count}</p>
                            )}
                        </div>
                    </div>

                </div> {/* End A4 Page */}

                {/* ── Follow-up Info Card ── */}
                {letter.is_follow_up && (
                    <div className="no-print mt-5 mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                        style={{ maxWidth: '210mm' }}>
                        <div className="px-6 py-4 border-b flex items-center gap-3 bg-gradient-to-l from-white to-amber-50">
                            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Bell className="h-4 w-4 text-amber-600" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 flex-1">اطلاعات تعقیب نامه</h3>
                        </div>
                        <div className="px-6 py-5 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">وضعیت تعقیب</p>
                                <p className={`text-sm font-semibold mt-1 ${letter.follow_up_status === 'completed' ? 'text-green-600' :
                                    letter.follow_up_status === 'overdue' ? 'text-red-600' :
                                        'text-amber-600'
                                    }`}>
                                    {letter.follow_up_status_label || 'در انتظار'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">تعداد تعقیب‌ها</p>
                                <p className="text-sm font-semibold text-gray-800 mt-1">
                                    {letter.follow_up_count || 0} بار
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">تاریخ یادآوری بعدی</p>
                                <p className="text-sm font-semibold text-gray-800 mt-1">
                                    {letter.next_follow_up_date
                                        ? new Date(letter.next_follow_up_date).toLocaleDateString('fa-IR')
                                        : '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">آخرین بروزرسانی</p>
                                <p className="text-sm font-semibold text-gray-800 mt-1">
                                    {letter.last_follow_up_at
                                        ? new Date(letter.last_follow_up_at).toLocaleDateString('fa-IR')
                                        : '—'}
                                </p>
                            </div>
                            {letter.follow_up_notes && (
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500">یادداشت‌ها</p>
                                    <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">
                                        {letter.follow_up_notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── ATTACHMENTS ── */}
                {letter.attachments && letter.attachments.length > 0 && (
                    <div className="no-print mt-6 mx-auto overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
                        style={{ maxWidth: '210mm', background: '#fff' }}>
                        <div className="px-6 py-4 flex items-center gap-3 bg-gradient-to-l from-gray-50 to-indigo-50 border-b">
                            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <Paperclip className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-800">پیوست‌ها</h3>
                                <p className="text-xs text-gray-400">برای مشاهده یا دانلود کلیک کنید</p>
                            </div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
                                {letter.attachments.length} فایل
                            </span>
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {letter.attachments.map((att: Attachment) => {
                                const { icon: FileIconComp, color, bg } = getFileIcon(att);
                                const canView = isImage(att.mime_type, att.file_name) || isPdf(att.mime_type, att.file_name);

                                return (
                                    <div key={att.id}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
                                        onClick={() => setPreviewAtt(att)}>
                                        <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                                            <FileIconComp className={`h-5 w-5 ${color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-700 truncate">{att.file_name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-gray-400">{formatSize(att.file_size)}</span>
                                                {canView && (
                                                    <span className="text-[10px] font-medium text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                                                        قابل نمایش
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={(e) => {
                                                e.stopPropagation(); setPreviewAtt(att);
                                            }}
                                                className="p-1.5 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <a href={getDownloadUrl(att.id)} download onClick={(e) => e.stopPropagation()}
                                                className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition">
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── ROUTING HISTORY ── */}
                {letter.routings && letter.routings.length > 0 && (
                    <div className="no-print mt-5 mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                        style={{ maxWidth: '210mm' }}>
                        <div className="px-6 py-4 border-b flex items-center gap-3 bg-gradient-to-l from-white to-violet-50">
                            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-violet-600" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 flex-1">تاریخچه ارجاعات</h3>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-600">
                                {letter.routings.length}
                            </span>
                        </div>
                        <div className="px-6 py-5">
                            {letter.routings.map((routing: any, idx: number) => {
                                const rCfg = ROUTING_STATUS[routing.status] ?? ROUTING_STATUS.pending;
                                const RIcon = rCfg.icon;
                                const isOverdue = routing.deadline && new Date(routing.deadline) < new Date() && routing.status === 'pending';
                                const isLast = idx === letter.routings.length - 1;

                                return (
                                    <div key={routing.id} className="relative flex gap-4 pb-5">
                                        {!isLast && <div className="absolute right-3 top-7 bottom-0 w-px bg-gray-200" />}
                                        <div className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center z-10 mt-0.5"
                                            style={{ backgroundColor: rCfg.bg }}>
                                            <RIcon className="h-3.5 w-3.5" style={{ color: rCfg.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex items-start justify-between gap-2 flex-wrap">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-bold text-gray-800">
                                                        {ACTION_LABELS[routing.action_type] || routing.action_type}
                                                    </span>
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                        style={{ backgroundColor: rCfg.bg, color: rCfg.color }}>
                                                        {rCfg.label}
                                                    </span>
                                                    {isOverdue && (
                                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                                            <AlertCircle className="h-3 w-3" /> تأخیردار
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-400 flex-shrink-0">
                                                    {new Date(routing.created_at).toLocaleDateString('fa-IR')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                از <span className="font-semibold text-gray-700">{routing.from_user?.full_name || 'سیستم'}</span>
                                                {' '}←{' '}
                                                به <span className="font-semibold text-gray-700">{routing.to_user?.full_name || 'نامشخص'}</span>
                                            </p>
                                            {routing.instruction && (
                                                <div className="mt-2 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
                                                    <p className="text-xs text-violet-700 leading-relaxed">{routing.instruction}</p>
                                                </div>
                                            )}
                                            {routing.completed_note && (
                                                <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
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

            {/* Modals */}
            {showArchiveModal && (
                <ArchiveModal cases={cases} loading={loading}
                    onClose={() => setShowArchiveModal(false)} onConfirm={handleArchive} />
            )}
            {showReplyModal && (
                <ReplyModal
                    letter={letter}
                    onClose={() => setShowReplyModal(false)}
                    onSuccess={() => router.reload()}
                />
            )}
            {showFollowUpModal && (
                <FollowUpModal
                    letter={letter}
                    onClose={() => setShowFollowUpModal(false)}
                    onSuccess={() => router.reload()}
                />
            )}
            {previewAtt && (
                <AttachmentPreviewModal att={previewAtt} onClose={() => setPreviewAtt(null)} />
            )}
        </>
    );
}