// resources/js/pages/letters/show.tsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowRight, Download, Archive, Send, 
    Printer, Clock, AlertCircle, Users, 
    Building2, FileText, CheckCircle, XCircle
} from 'lucide-react';
import type { Letter } from '@/types';
import { show as LetterShow } from '@/routes/letters';

interface Props {
    letter: Letter;
    securityLevels: Record<string, string>;
    priorityLevels: Record<string, string>;
    can: {
        edit: boolean;
        delete: boolean;
        archive: boolean;
        route: boolean;
        approve: boolean;
    };
}

export default function LettersShow({ letter, securityLevels, priorityLevels, can }: Props) {
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [selectedCase, setSelectedCase] = useState<number | null>(null);

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
        if (selectedCase) {
            router.post(route('letters.archive', { letter: letter.id }), { case_id: selectedCase });
            setShowArchiveModal(false);
        }
    };

    const handleApprove = () => {
        if (confirm('آیا از تأیید این نامه اطمینان دارید؟')) {
            router.post(route('letters.approve', { letter: letter.id }));
        }
    };

    const handleReject = () => {
        const reason = prompt('لطفاً دلیل رد را وارد کنید:');
        if (reason) {
            router.post(route('letters.reject', { letter: letter.id }), { reason });
        }
    };

    return (
        <>
            <Head title={letter.subject} />

            <div className="max-w-5xl mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link
                                href={route('letters.index')}
                                className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                            >
                                <ArrowRight className="h-4 w-4" />
                                بازگشت به لیست
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{letter.subject}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[letter.priority]}`}>
                                {priorityLevels[letter.priority]}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[letter.final_status]}`}>
                                {statusLabels[letter.final_status]}
                            </span>
                            <span className="text-xs text-gray-400">شماره: {letter.letter_number}</span>
                            <span className="text-xs text-gray-400">پیگیری: {letter.tracking_number}</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {can.edit && letter.final_status === 'draft' && (
                            <Link
                                href={route('letters.edit', { letter: letter.id })}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                                ویرایش
                            </Link>
                        )}
                        {can.archive && letter.final_status === 'approved' && (
                            <button
                                onClick={() => setShowArchiveModal(true)}
                                className="inline-flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition"
                            >
                                <Archive className="ml-2 h-4 w-4" />
                                بایگانی
                            </button>
                        )}
                        {can.route && letter.final_status === 'pending' && (
                            <Link
                                href={route('routings.create', { letter: letter.id })}
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
                                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                                >
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                    تأیید
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
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
                            <p><span className="text-gray-500">نام:</span> {letter.sender_name}</p>
                            <p><span className="text-gray-500">سمت:</span> {letter.sender_position_name}</p>
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
                            <p><span className="text-gray-500">نام:</span> {letter.recipient_name}</p>
                            <p><span className="text-gray-500">سمت:</span> {letter.recipient_position_name}</p>
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
                                <div key={attachment.id} className="px-6 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-700">{attachment.file_name}</span>
                                        <span className="text-xs text-gray-400">
                                            {(attachment.file_size / 1024).toFixed(1)} KB
                                        </span>
                                    </div>
                                    <Link
                                        href={route('attachments.download', { attachment: attachment.id })}
                                        className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                                    >
                                        <Download className="h-4 w-4" />
                                        دانلود
                                    </Link>
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
                                <div key={routing.id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {routing.action_type === 'approval' ? 'تأیید' : 
                                                 routing.action_type === 'action' ? 'اقدام' :
                                                 routing.action_type === 'information' ? 'اطلاع' : 'ارجاع'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                از: {routing.from_user?.full_name} → به: {routing.to_user?.full_name}
                                            </p>
                                            {routing.instruction && (
                                                <p className="text-xs text-gray-500 mt-1">دستورالعمل: {routing.instruction}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">
                                                {new Date(routing.created_at).toLocaleDateString('fa-IR')}
                                            </p>
                                            {routing.status === 'completed' && (
                                                <span className="text-xs text-green-600">✓ تکمیل شده</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4"
                        >
                            <option value="">انتخاب پرونده...</option>
                            {/* options will be loaded from API */}
                        </select>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowArchiveModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                انصراف
                            </button>
                            <button
                                onClick={handleArchive}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
                            >
                                بایگانی
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}