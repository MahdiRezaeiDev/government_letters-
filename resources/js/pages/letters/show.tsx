import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Send, Clock, CheckCircle, XCircle, CornerUpLeft,
    CornerUpRight, UserCheck
} from 'lucide-react';
import { useState } from 'react';
import AttachmentList from '@/components/AttachmentList';
import AttachmentPreviewModal from '@/components/AttachmentPreviewModal';
import { DelegateReplyModal } from '@/components/DelegateReplyModal';
import letters from '@/routes/letters';
import routings from '@/routes/routings';
import type { Letter, Case } from '@/types';
import delegations from '@/routes/delegations';

interface Attachment {
    id: number;
    file_name: string;
    file_size: number;
    mime_type?: string;
    file_path?: string;
}

interface User {
    id: number;
    full_name: string;
    position?: { name: string };
    department?: { name: string };
}

interface Props {
    letter: Letter;
    securityLevels: Record<string, string>;
    priorityLevels: Record<string, string>;
    availableCases?: Case[];
    users: User[];  // اضافه شد - لیست کاربران برای ارجاع
    can: {
        edit: boolean;
        delete: boolean;
        archive: boolean;
        route: boolean;
        approve: boolean;
        reject: boolean;
        reply: boolean;
        delegate: boolean;  // اضافه شد - مجوز ارجاع
    };
}

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; textColor: string }> = {
    draft: { label: 'پیش‌نویس', color: '#64748b', bg: 'bg-slate-100', textColor: 'text-slate-700' },
    pending: { label: 'در انتظار', color: '#b45309', bg: 'bg-amber-100', textColor: 'text-amber-700' },
    approved: { label: 'تایید شده', color: '#15803d', bg: 'bg-emerald-100', textColor: 'text-emerald-700' },
    rejected: { label: 'رد شده', color: '#b91c1c', bg: 'bg-red-100', textColor: 'text-red-700' },
    archived: { label: 'ارشیف', color: '#475569', bg: 'bg-gray-100', textColor: 'text-gray-700' },
};

const ROUTING_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: 'تکمیل', color: '#15803d', bg: 'bg-emerald-50' },
    rejected: { label: 'رد', color: '#b91c1c', bg: 'bg-red-50' },
    pending: { label: 'در انتظار', color: '#b45309', bg: 'bg-amber-50' },
};

const ACTION_LABELS: Record<string, string> = {
    approval: 'جهت تایید',
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

    return new Date(dateString).toLocaleDateString('fa-Af', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fa-Af', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LettersShow({
    letter,
    securityLevels,
    priorityLevels,
    users,
    can
}: Props) {
    const [loading, setLoading] = useState(false);
    const [previewAtt, setPreviewAtt] = useState<Attachment | null>(null);
    const [showDelegateModal, setShowDelegateModal] = useState(false);

    const status = STATUS_CONFIG[letter.final_status] || STATUS_CONFIG.pending;
    const currentUser = usePage().props.auth.user;

    // بررسی ارجاع فعال به کاربر فعلی
    const activeDelegation = letter.delegations?.find(
        (d: any) => d.delegated_to_user_id === currentUser.id
            && d.status === 'pending'
    );

    console.log(letter.delegations);


    const isDelegatedToMe = !!activeDelegation;
    const isDelegatedByMe = letter.delegated_by_user_id === currentUser.id;

    const handleApprove = () => {
        if (!confirm('آیا از تأیید این مکتوب اطمینان دارید؟')) {
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
            <Head title={`مکتوب: ${letter.subject}`} />

            <div className="min-h-screen">
                <div className="max-w-3xl mx-auto">

                    {/* بنر ارجاع شده به من */}
                    {isDelegatedToMe && (
                        <div className="mb-4 bg-amber-50 border-r-4 border-r-amber-400 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <UserCheck className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-amber-800">
                                        این مکتوب توسط {activeDelegation.delegated_by?.full_name} به شما ارجاع شده است
                                    </p>
                                    {activeDelegation?.delegated_note && (
                                        <p className="text-sm text-amber-700 mt-2">
                                            📌 {activeDelegation.delegated_note}
                                        </p>
                                    )}

                                    {/* دکمه‌های اقدام */}
                                    <div className="flex gap-3 mt-4">
                                        {/* دکمه پذیرش */}
                                        <button
                                            onClick={() => {
                                                router.post(delegations.accept({ delegation: activeDelegation.id }), {}, {
                                                    onSuccess: () => router.reload()
                                                });
                                            }}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            پذیرش و پاسخ به مکتوب
                                        </button>

                                        {/* دکمه رد */}
                                        <button
                                            onClick={() => {
                                                const reason = prompt('لطفاً دلیل رد را وارد کنید:');

                                                if (reason) {
                                                    router.post(delegations.reject({ delegation: activeDelegation.id }), { reason }, {
                                                        onSuccess: () => router.reload()
                                                    });
                                                }
                                            }}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            رد ارجاع
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* بنر ارجاع داده شده توسط من */}
                    {isDelegatedByMe && (
                        <div className="mb-4 bg-blue-50 border-r-4 border-r-blue-400 rounded-xl p-4">
                            <div className="flex items-center gap-2">
                                <CornerUpRight className="h-5 w-5 text-blue-600" />
                                <p className="text-sm text-blue-700">
                                    شما این مکتوب را به شخص دیگری ارجاع داده‌اید
                                </p>
                            </div>
                        </div>
                    )}

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
                                    {(letter.date)}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {/* دکمه ارجاع برای پاسخ - فقط برای گیرنده اصلی */}
                                {can.delegate && !isDelegatedByMe && (
                                    <button
                                        onClick={() => setShowDelegateModal(true)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                                    >
                                        <CornerUpRight className="h-3.5 w-3.5" /> ارجاع برای پاسخ
                                    </button>
                                )}

                                {can.reply && letter.final_status !== 'draft' && !isDelegatedToMe && (
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

                                {/* {can.archive && letter.final_status === 'approved' && (
                                    <button
                                        onClick={() => {
                                            router.post(letters.show({ letter: letter.id }), {
                                                case_id: prompt('آیدی پرونده را وارد کنید:')
                                            }, { onSuccess: () => router.reload() });
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                                    >
                                        <Archive className="h-3.5 w-3.5" /> ارشیف
                                    </button>
                                )} */}
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
                                        متن مکتوب
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
                                            <CheckCircle className="h-4 w-4" /> تأیید مکتوب
                                        </button>
                                    )}
                                    {can.reject && (
                                        <button
                                            onClick={handleReject}
                                            disabled={loading}
                                            className="flex-1 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="h-4 w-4" /> رد مکتوب
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>


                    {/* ── Delegation History ── */}
                    {letter.delegations && letter.delegations.length > 0 && (
                        <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800">تاریخچه ارجاع برای پاسخ</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {letter.delegations.map((delegation: any) => (
                                        <div key={delegation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {delegation.delegated_by?.full_name} → {delegation.delegated_to?.full_name}
                                                </p>
                                                {delegation.delegated_note && (
                                                    <p className="text-xs text-gray-500 mt-1">{delegation.delegated_note}</p>
                                                )}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${delegation.status === 'replied' ? 'bg-emerald-100 text-emerald-700' :
                                                delegation.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {delegation.status === 'replied' ? 'پاسخ داده شد' :
                                                    delegation.status === 'pending' ? 'در انتظار' : delegation.status}
                                            </span>
                                        </div>
                                    ))}
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

            {/* Delegate Modal */}
            <DelegateReplyModal
                isOpen={showDelegateModal}
                onClose={() => setShowDelegateModal(false)}
                letterId={letter.id}
                letterSubject={letter.subject}
                users={users}
                currentUserId={(window as any).__page?.props?.auth?.user?.id}
            />
        </>
    );
}