import { Head, Link, router } from '@inertiajs/react';
import {
    Archive, Send, Printer, Clock,
    FileText, CheckCircle, XCircle,
    Paperclip, Download,
    ChevronRight, CornerUpLeft,
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';
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

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; textColor: string }> = {
    draft: { label: 'پیش‌نویس', color: '#64748b', bg: 'bg-slate-100', textColor: 'text-slate-700' },
    pending: { label: 'در انتظار', color: '#b45309', bg: 'bg-amber-100', textColor: 'text-amber-700' },
    approved: { label: 'تأیید شده', color: '#15803d', bg: 'bg-emerald-100', textColor: 'text-emerald-700' },
    rejected: { label: 'رد شده', color: '#b91c1c', bg: 'bg-red-100', textColor: 'text-red-700' },
    archived: { label: 'بایگانی', color: '#475569', bg: 'bg-gray-100', textColor: 'text-gray-700' },
};

const ROUTING_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: 'تکمیل', color: '#15803d', bg: 'bg-emerald-50' },
    rejected: { label: 'رد', color: '#b91c1c', bg: 'bg-red-50' },
    pending: { label: 'در انتظار', color: '#b45309', bg: 'bg-amber-50' },
};

const ACTION_LABELS: Record<string, string> = {
    approval: 'جهت تأیید',
    action: 'جهت اقدام',
    information: 'جهت اطلاع',
    coordination: 'جهت هماهنگی',
    sign: 'جهت امضاء',
};

// ─── Helper Functions ────────────────────────────────────────────────────────
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
        return '—';
    }

    return new Date(dateString).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatSize = (bytes: number): string => {
    if (bytes === 0) {
        return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const isImage = (mime?: string, name?: string): boolean => {
    if (mime?.startsWith('image/')) {
        return true;
    }

    const ext = name?.split('.').pop()?.toLowerCase();

    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
};

const isPdf = (mime?: string, name?: string): boolean => {
    if (mime === 'application/pdf') {
        return true;
    }

    return name?.toLowerCase().endsWith('.pdf') || false;
};

const getDownloadUrl = (id: number) => `/attachments/${id}/download`;

// ─── Attachment Preview Modal (Compact) ─────────────────────────────────────
function AttachmentPreviewModal({ att, onClose }: { att: Attachment; onClose: () => void }) {
    const previewUrl = `/attachments/${att.id}/preview`;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const renderContent = () => {
        if (isImage(att.mime_type, att.file_name)) {
            return (
                <img
                    src={previewUrl}
                    alt={att.file_name}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
            );
        }

        if (isPdf(att.mime_type, att.file_name)) {
            return (
                <iframe
                    src={`${previewUrl}#toolbar=1`}
                    title={att.file_name}
                    className="w-full h-[80vh] rounded-lg shadow-2xl"
                />
            );
        }

        return (
            <div className="text-center p-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">پیش‌نمایش این فایل ممکن نیست</p>
                <a
                    href={getDownloadUrl(att.id)}
                    download
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                    <Download className="h-4 w-4" /> دانلود فایل
                </a>
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
                    <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{att.file_name}</p>
                            <p className="text-xs text-gray-400">{formatSize(att.file_size)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={getDownloadUrl(att.id)}
                            download
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="دانلود"
                        >
                            <Download className="h-4 w-4" />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 bg-gray-100 flex items-center justify-center min-h-[300px]">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

// ─── Attachment List Component ───────────────────────────────────────────────
function AttachmentList({ attachments, onPreview }: {
    attachments: Attachment[];
    onPreview: (att: Attachment) => void;
}) {
    if (!attachments?.length) {
        return null;
    }

    return (
        <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
                <Paperclip className="h-4 w-4 text-gray-400" />
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">پیوست‌ها</h4>
                <span className="text-xs text-gray-400">({attachments.length})</span>
            </div>

            <div className="space-y-2">
                {attachments.map((att) => (
                    <div
                        key={att.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group cursor-pointer"
                        onClick={() => onPreview(att)}
                    >
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate">{att.file_name}</p>
                            <p className="text-[10px] text-gray-400">{formatSize(att.file_size)}</p>
                        </div>
                        <a
                            href={getDownloadUrl(att.id)}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-gray-300 group-hover:text-blue-600 group-hover:bg-blue-100 transition opacity-0 group-hover:opacity-100"
                        >
                            <Download className="h-3.5 w-3.5" />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LettersShow({
    letter,
    securityLevels,
    priorityLevels,
    can
}: Props) {
    const [loading, setLoading] = useState(false);
    const [previewAtt, setPreviewAtt] = useState<Attachment | null>(null);

    const status = STATUS_CONFIG[letter.final_status] || STATUS_CONFIG.pending;

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

    return (
        <>
            <Head title={`نامه: ${letter.subject}`} />

            <div className="min-h-screen bg-gray-100 py-6 px-4" dir="rtl">
                <div className="max-w-3xl mx-auto">

                    {/* ── Header/Breadcrumb ── */}
                    <div className="flex items-center gap-2 mb-6 text-sm">
                        <Link
                            href={letters.index()}
                            className="text-gray-500 hover:text-gray-700 transition"
                        >
                            نامه‌ها
                        </Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-800 font-medium truncate">{letter.subject}</span>
                    </div>

                    {/* ── Main Card ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* Status & Actions Bar */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.textColor}`}>
                                    {status.label}
                                </span>

                                <span className="text-sm text-gray-600">
                                    <span className="text-gray-400">شماره:</span>{' '}
                                    <span className="font-mono font-bold">{letter.letter_number || '—'}</span>
                                </span>

                                <span className="text-sm text-gray-600">
                                    <span className="text-gray-400">تاریخ:</span>{' '}
                                    {formatDate(letter.date)}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                    onClick={() => window.print()}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                    title="چاپ"
                                >
                                    <Printer className="h-4 w-4" />
                                </button>

                                {can.reply && letter.final_status !== 'draft' && (
                                    <Link
                                        href={letters.reply.form({ letter: letter.id })}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                                    >
                                        <CornerUpLeft className="h-3.5 w-3.5" /> پاسخ
                                    </Link>
                                )}

                                {can.edit && letter.final_status === 'draft' && (
                                    <Link
                                        href={letters.edit({ letter: letter.id })}
                                        className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                    >
                                        ویرایش
                                    </Link>
                                )}

                                {can.archive && letter.final_status === 'approved' && (
                                    <button
                                        onClick={() => {
                                            router.post(letters.show({ letter: letter.id }), {
                                                case_id: prompt('آیدی پرونده را وارد کنید:')
                                            }, {
                                                onSuccess: () => router.reload()
                                            });
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                                    >
                                        <Archive className="h-3.5 w-3.5" /> بایگانی
                                    </button>
                                )}

                                {can.route && letter.final_status === 'pending' && (
                                    <Link
                                        href={routings.create({ letter: letter.id })}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                                    >
                                        <Send className="h-3.5 w-3.5" /> ارجاع
                                    </Link>
                                )}

                                {can.approve && letter.final_status === 'pending' && (
                                    <>
                                        <button
                                            onClick={handleApprove}
                                            disabled={loading}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition disabled:opacity-50"
                                        >
                                            <CheckCircle className="h-3.5 w-3.5" /> تأیید
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            disabled={loading}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-700 text-white rounded-lg hover:bg-red-800 transition disabled:opacity-50"
                                        >
                                            <XCircle className="h-3.5 w-3.5" /> رد
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ── Letter Content ── */}
                        <div className="p-6 space-y-5">
                            {/* Subject */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-relaxed">
                                    {letter.subject}
                                </h2>
                            </div>

                            {/* Meta Info Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">فرستنده</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {letter.sender_name || '—'}
                                    </p>
                                    {letter.sender_department && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {letter.sender_department.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">گیرنده</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {letter.recipient_name || '—'}
                                    </p>
                                    {letter.recipient_department && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {letter.recipient_department.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">اولویت</p>
                                    <span className={`text-sm font-bold ${letter.priority === 'urgent' ? 'text-red-600' :
                                        letter.priority === 'high' ? 'text-orange-600' :
                                            'text-gray-600'
                                        }`}>
                                        {priorityLevels[letter.priority]?.lable || letter.priority}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">سطح امنیتی</p>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {letter.security_level && letter.security_level !== 'public'
                                            ? securityLevels[letter.security_level]?.lable
                                            : 'عادی'}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">تاریخ ثبت</p>
                                    <p className="text-sm text-gray-700">{formatDate(letter.created_at)}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">وضعیت</p>
                                    <span className={`text-sm font-bold ${status.textColor}`}>
                                        {status.label}
                                    </span>
                                </div>
                            </div>

                            {/* Content Preview */}
                            {letter.content && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        متن نامه
                                    </h4>
                                    <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 max-h-40 overflow-y-auto">
                                        <div dangerouslySetInnerHTML={{ __html: letter.content }} />
                                    </div>
                                </div>
                            )}

                            {/* Summary */}
                            {letter.summary && (
                                <div className="border-r-4 border-amber-400 bg-amber-50 rounded-lg p-4">
                                    <p className="text-xs font-bold text-amber-700 mb-1">خلاصه</p>
                                    <p className="text-sm text-amber-800">{letter.summary}</p>
                                </div>
                            )}

                            {/* Attachments */}
                            <AttachmentList
                                attachments={letter.attachments as Attachment[]}
                                onPreview={setPreviewAtt}
                            />

                            {/* Actions Bottom */}
                            {letter.final_status === 'pending' && (
                                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                                    {can.approve && (
                                        <button
                                            onClick={handleApprove}
                                            disabled={loading}
                                            className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="h-4 w-4" /> تأیید نامه
                                        </button>
                                    )}
                                    {can.reject && (
                                        <button
                                            onClick={handleReject}
                                            disabled={loading}
                                            className="flex-1 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="h-4 w-4" /> رد نامه
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Routing History ── */}
                    {letter.routings && letter.routings.length > 0 && (
                        <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <h3 className="text-sm font-bold text-gray-800">تاریخچه ارجاعات</h3>
                                <span className="text-xs text-gray-500">({letter.routings.length})</span>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {letter.routings.map((routing: any, idx: number) => {
                                        const rStatus = ROUTING_STATUS_CONFIG[routing.status] || ROUTING_STATUS_CONFIG.pending;
                                        const isLast = idx === letter.routings.length - 1;

                                        return (
                                            <div key={routing.id} className="relative flex gap-3">
                                                {!isLast && (
                                                    <div className="absolute right-2.5 top-6 bottom-0 w-px bg-gray-200" />
                                                )}
                                                <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${rStatus.bg} mt-0.5`}>
                                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: rStatus.color }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-semibold text-gray-800">
                                                            {ACTION_LABELS[routing.action_type] || routing.action_type}
                                                        </span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                            {rStatus.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        از {routing.from_user?.full_name || 'سیستم'} به{' '}
                                                        {routing.to_user?.full_name || 'نامشخص'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                                        {formatDateTime(routing.created_at)}
                                                    </p>
                                                    {routing.instruction && (
                                                        <p className="text-xs text-gray-600 mt-2 bg-gray-50 rounded-lg p-2">
                                                            {routing.instruction}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {previewAtt && (
                <AttachmentPreviewModal
                    att={previewAtt}
                    onClose={() => setPreviewAtt(null)}
                />
            )}
        </>
    );
}