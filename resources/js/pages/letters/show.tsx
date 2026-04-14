import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowRight, Download, Archive, Send, 
    Printer, Clock, AlertCircle, Users, 
    Building2, FileText, CheckCircle, XCircle,
    Paperclip, Loader2
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import letters  from '@/routes/letters';
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

export default function LettersShow({ 
    letter, 
    securityLevels, 
    priorityLevels, 
    availableCases = [],
    can 
}: Props) {
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [selectedCase, setSelectedCase] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState<Case[]>(availableCases);

    // بارگذاری پرونده‌های قابل انتخاب برای بایگانی
    useEffect(() => {
        if (showArchiveModal && cases.length === 0) {
            router.get('/api/cases/available', {
                letter_id: letter.id
            }, {
                preserveState: false,
                onSuccess: (page) => {
                    setCases(page.props.cases || []);
                }
            });
        }
    }, [showArchiveModal]);

    const priorityColors: Record<string, string> = {
        low: 'bg-gray-100 text-gray-600',
        normal: 'bg-blue-100 text-blue-600',
        high: 'bg-yellow-100 text-yellow-600',
        urgent: 'bg-orange-100 text-orange-600',
        very_urgent: 'bg-red-100 text-red-600',
    };

    const statusColors: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-600',
        pending: 'bg-yellow-100 text-yellow-600',
        approved: 'bg-green-100 text-green-600',
        rejected: 'bg-red-100 text-red-600',
        archived: 'bg-gray-100 text-gray-500',
    };

    const statusLabels: Record<string, string> = {
        draft: 'پیش‌نویس',
        pending: 'در انتظار',
        approved: 'تایید شده',
        rejected: 'رد شده',
        archived: 'بایگانی شده',
    };

    const handleArchive = () => {
        if (!selectedCase) {
            alert('لطفاً پرونده مقصد را انتخاب کنید');

            return;
        }
        
        setLoading(true);
        router.post(letters.show({ letter: letter.id }), { //'letters.archive'
            case_id: selectedCase
        }, {
            onSuccess: () => {
                setShowArchiveModal(false);
                setSelectedCase(null);
                setLoading(false);
                // رفرش صفحه
                router.reload();
            },
            onError: () => {
                setLoading(false);
                alert('خطا در بایگانی نامه');
            }
        });
    };

    const handleApprove = () => {
        if (confirm('آیا از تأیید این نامه اطمینان دارید؟')) {
            setLoading(true);
            router.post(letters.show({ letter: letter.id }), {}, { //'letters.approve
                onSuccess: () => {
                    setLoading(false);
                    router.reload();
                },
                onError: () => {
                    setLoading(false);
                    alert('خطا در تأیید نامه');
                }
            });
        }
    };

    const handleReject = () => {
        const reason = prompt('لطفاً دلیل رد را وارد کنید:');

        if (reason) {
            setLoading(true);
            router.post(letters.show({ letter: letter.id }), { reason }, { //'letters.reject'
                onSuccess: () => {
                    setLoading(false);
                    router.reload();
                },
                onError: () => {
                    setLoading(false);
                    alert('خطا در رد نامه');
                }
            });
        }
    };

    const handleDownloadAttachment = (attachmentId: number) => {
        window.open(letters.show({query: { attachment: attachmentId }}), '_blank'); //'attachments.download'
    };

    const getActionTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            approval: 'تأیید',
            action: 'اقدام',
            information: 'اطلاع',
            coordination: 'هماهنگی',
            sign: 'امضاء'
        };

        return labels[type] || type;
    };

    return (
        <>
            <Head title={letter.subject} />

            <div className="max-w-5xl mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link
                                href={letters.index()}
                                className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                            >
                                <ArrowRight className="h-4 w-4" />
                                بازگشت به لیست
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{letter.subject}</h1>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[letter.priority]}`}>
                                {priorityLevels[letter.priority]}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[letter.final_status]}`}>
                                {statusLabels[letter.final_status]}
                            </span>
                            <span className="text-xs text-gray-400">شماره: {letter.letter_number}</span>
                            <span className="text-xs text-gray-400">پیگیری: {letter.tracking_number}</span>
                            {letter.date && (
                                <span className="text-xs text-gray-400">
                                    تاریخ: {new Date(letter.date).toLocaleDateString('fa-IR')}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                        {can.edit && letter.final_status === 'draft' && (
                            <Link
                                href={letters.edit({ letter: letter.id })}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                                ویرایش
                            </Link>
                        )}
                        {can.archive && letter.final_status === 'approved' && (
                            <button
                                onClick={() => setShowArchiveModal(true)}
                                disabled={loading}
                                className="inline-flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition disabled:opacity-50"
                            >
                                <Archive className="ml-2 h-4 w-4" />
                                بایگانی
                            </button>
                        )}
                        {can.route && letter.final_status === 'pending' && (
                            <Link
                                href={routings.create({ letter: letter.id })}
                                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                            >
                                <Send className="ml-2 h-4 w-4" />
                                ارجاع
                            </Link>
                        )}
                        {can.approve && letter.final_status === 'pending' && (
                            <>
                                <button
                                    onClick={handleApprove}
                                    disabled={loading}
                                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <CheckCircle className="ml-2 h-4 w-4" />}
                                    تأیید
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={loading}
                                    className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    <XCircle className="ml-2 h-4 w-4" />
                                    رد
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                            <Printer className="ml-2 h-4 w-4" />
                            چاپ
                        </button>
                    </div>
                </div>

                {/* Letter Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sender Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            فرستنده
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500">نام:</span> {letter.sender_name || '-'}</p>
                            <p><span className="text-gray-500">سمت:</span> {letter.sender_position_name || '-'}</p>
                            {letter.sender_department && (
                                <p><span className="text-gray-500">دپارتمان:</span> {letter.sender_department.name}</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Recipient Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-green-500" />
                            گیرنده
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500">نام:</span> {letter.recipient_name || '-'}</p>
                            <p><span className="text-gray-500">سمت:</span> {letter.recipient_position_name || '-'}</p>
                            {letter.recipient_department && (
                                <p><span className="text-gray-500">دپارتمان:</span> {letter.recipient_department.name}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Letter Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">متن نامه</h3>
                    </div>
                    <div className="p-6">
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: letter.content || '' }} />
                        {letter.summary && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">خلاصه:</span> {letter.summary}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Attachments */}
                {letter.attachments && letter.attachments.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                پیوست‌ها ({letter.attachments.length})
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {letter.attachments.map((attachment) => (
                                <div key={attachment.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{attachment.file_name}</p>
                                            <p className="text-xs text-gray-400">
                                                {(attachment.file_size / 1024).toFixed(1)} KB • {attachment.download_count} دانلود
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDownloadAttachment(attachment.id)}
                                        className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                                    >
                                        <Download className="h-4 w-4" />
                                        دانلود
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Routing History */}
                {letter.routings && letter.routings.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                تاریخچه ارجاعات
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {letter.routings.map((routing) => (
                                <div key={routing.id} className="px-6 py-4 hover:bg-gray-50 transition">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {getActionTypeLabel(routing.action_type)}
                                                </span>
                                                {routing.deadline && new Date(routing.deadline) < new Date() && routing.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                                        <AlertCircle className="h-3 w-3" />
                                                        تأخیر دار
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                از: {routing.from_user?.full_name || 'سیستم'} → به: {routing.to_user?.full_name || 'نامشخص'}
                                            </p>
                                            {routing.instruction && (
                                                <p className="text-xs text-gray-500 mt-1 bg-gray-50 p-2 rounded">
                                                    📌 {routing.instruction}
                                                </p>
                                            )}
                                            {routing.completed_note && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    یادداشت: {routing.completed_note}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">
                                                {new Date(routing.created_at).toLocaleDateString('fa-IR')}
                                                {routing.deadline && (
                                                    <span className="block text-xs text-gray-400 mt-1">
                                                        مهلت: {new Date(routing.deadline).toLocaleDateString('fa-IR')}
                                                    </span>
                                                )}
                                            </p>
                                            {routing.status === 'completed' && (
                                                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    تکمیل شده
                                                </span>
                                            )}
                                            {routing.status === 'rejected' && (
                                                <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full mt-1">
                                                    <XCircle className="h-3 w-3" />
                                                    رد شده
                                                </span>
                                            )}
                                            {routing.status === 'pending' && (
                                                <span className="inline-flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    در انتظار
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-semibold text-gray-900 mb-3">اطلاعات اضافی</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">ایجاد شده توسط</p>
                            <p className="font-medium text-gray-900">{letter.creator?.full_name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">تاریخ ایجاد</p>
                            <p className="font-medium text-gray-900">
                                {new Date(letter.created_at).toLocaleDateString('fa-IR')}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">آخرین ویرایش</p>
                            <p className="font-medium text-gray-900">
                                {new Date(letter.updated_at).toLocaleDateString('fa-IR')}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">تعداد صفحات</p>
                            <p className="font-medium text-gray-900">{letter.sheet_count || 1}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Archive Modal */}
            {showArchiveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">بایگانی نامه</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            لطفاً پرونده مقصد را انتخاب کنید
                        </p>
                        <select
                            value={selectedCase || ''}
                            onChange={(e) => setSelectedCase(parseInt(e.target.value) || null)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            <option value="">انتخاب پرونده...</option>
                            {cases.map((caseItem) => (
                                <option key={caseItem.id} value={caseItem.id}>
                                    {caseItem.title} ({caseItem.case_number})
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowArchiveModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                                disabled={loading}
                            >
                                انصراف
                            </button>
                            <button
                                onClick={handleArchive}
                                disabled={loading || !selectedCase}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition disabled:opacity-50"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                بایگانی
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}