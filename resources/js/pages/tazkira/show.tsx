// resources/js/pages/tazkira/show.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    User, Hash, BookOpen, Layers, FileText, Grid, Calendar, MapPin, Phone, Mail,
    CheckCircle, XCircle, Clock, Eye, Edit, Trash2, ArrowLeft, Printer,
    Download, AlertCircle, Shield, Users, Fingerprint, Home, Briefcase
} from 'lucide-react';
import { useState } from 'react';

interface Tazkira {
    id: number;
    first_name: string;
    last_name: string;
    father_name: string | null;
    grandfather_name: string | null;
    tazkira_number: string;
    volume: string | null;
    page: string | null;
    registration_number: string | null;
    birth_date: string | null;
    birth_place: string | null;
    national_code: string | null;
    father_card_number: string | null;
    phone: string | null;
    mobile: string | null;
    address: string | null;
    email: string | null;
    tazkira_image: string | null;
    tazkira_image_url: string | null;
    status: 'pending' | 'approved' | 'rejected';
    notes: string | null;
    created_by: { id: number; full_name: string } | null;
    approved_by: { id: number; full_name: string } | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    tazkira: Tazkira;
    can?: {
        edit?: boolean;
        delete?: boolean;
        approve?: boolean;
    };
}

const STATUS_CONFIG = {
    pending: { label: 'در انتظار بررسی', icon: Clock, color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d' },
    approved: { label: 'تایید شده', icon: CheckCircle, color: '#10b981', bg: '#d1fae5', border: '#34d399' },
    rejected: { label: 'رد شده', icon: XCircle, color: '#ef4444', bg: '#fee2e2', border: '#f87171' },
};

export default function TazkiraShow({ tazkira, can = {} }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [rejectNote, setRejectNote] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const statusConfig = STATUS_CONFIG[tazkira.status];
    const StatusIcon = statusConfig.icon;

    const handleDelete = () => {
        router.delete(`/tazkira/${tazkira.id}`, {
            onSuccess: () => router.get('/tazkira'),
        });
    };

    const handleApprove = () => {
        router.post(`/tazkira/${tazkira.id}/approve`, {}, {
            onSuccess: () => router.reload(),
        });
    };

    const handleReject = () => {
        if (!rejectNote.trim()) {
            alert('لطفاً دلیل رد را وارد کنید');
            return;
        }
        router.post(`/tazkira/${tazkira.id}/reject`, { notes: rejectNote }, {
            onSuccess: () => {
                setShowRejectModal(false);
                router.reload();
            },
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`تذکره - ${tazkira.first_name} ${tazkira.last_name}`} />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/tazkira"
                                className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    جزئیات تذکره
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {tazkira.first_name} {tazkira.last_name} - {tazkira.tazkira_number}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Printer className="h-4 w-4" />
                                چاپ
                            </button>

                            {can.approve && tazkira.status === 'pending' && (
                                <>
                                    <button
                                        onClick={handleApprove}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        تأیید تذکره
                                    </button>
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        رد تذکره
                                    </button>
                                </>
                            )}

                            {can.edit && (
                                <Link
                                    href={`/tazkira/${tazkira.id}/edit`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                    ویرایش
                                </Link>
                            )}

                            {can.delete && (
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    حذف
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div
                        className="rounded-xl p-4 mb-6 flex items-center justify-between"
                        style={{ backgroundColor: statusConfig.bg, borderRight: `4px solid ${statusConfig.color}` }}
                    >
                        <div className="flex items-center gap-3">
                            <StatusIcon className="h-6 w-6" style={{ color: statusConfig.color }} />
                            <div>
                                <p className="font-semibold" style={{ color: statusConfig.color }}>
                                    وضعیت: {statusConfig.label}
                                </p>
                                {tazkira.approved_by && (
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        تأیید کننده: {tazkira.approved_by?.full_name} |
                                        تاریخ: {new Date(tazkira.approved_at!).toLocaleDateString('fa-IR')}
                                    </p>
                                )}
                            </div>
                        </div>
                        {tazkira.notes && tazkira.status !== 'pending' && (
                            <div className="text-sm text-gray-600 max-w-md">
                                <span className="font-medium">توضیحات:</span> {tazkira.notes}
                            </div>
                        )}
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* تصویر تذکره */}
                        {tazkira.tazkira_image_url && (
                            <div
                                className="relative h-48 bg-gray-100 cursor-pointer overflow-hidden"
                                onClick={() => setShowImageModal(true)}
                            >
                                <img
                                    src={tazkira.tazkira_image_url}
                                    alt="تصویر تذکره"
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Eye className="h-8 w-8 text-white" />
                                    <span className="text-white mr-2">مشاهده بزرگ</span>
                                </div>
                            </div>
                        )}

                        <div className="p-6 space-y-6">

                            {/* 1. معلومات شخصی */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                                    <User className="h-5 w-5 text-indigo-500" />
                                    معلومات شخصی
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="نام" value={tazkira.first_name} />
                                    <InfoItem label="تخلص" value={tazkira.last_name} />
                                    <InfoItem label="نام پدر" value={tazkira.father_name || '—'} />
                                    <InfoItem label="نام پدر کلان" value={tazkira.grandfather_name || '—'} />
                                </div>
                            </div>

                            {/* 2. مشخصات تذکره */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                                    <Fingerprint className="h-5 w-5 text-purple-500" />
                                    مشخصات تذکره
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="شماره تذکره" value={tazkira.tazkira_number} />
                                    <InfoItem label="جلد" value={tazkira.volume || '—'} />
                                    <InfoItem label="صفحه" value={tazkira.page || '—'} />
                                    <InfoItem label="صکو / شماره ثبت" value={tazkira.registration_number || '—'} />
                                </div>
                            </div>

                            {/* 3. اطلاعات تکمیلی */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                                    <Calendar className="h-5 w-5 text-emerald-500" />
                                    اطلاعات تکمیلی
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem
                                        label="تاریخ تولد"
                                        value={tazkira.birth_date ? new Date(tazkira.birth_date).toLocaleDateString('fa-IR') : '—'}
                                    />
                                    <InfoItem label="محل تولد" value={tazkira.birth_place || '—'} />
                                    <InfoItem label="کد ملی" value={tazkira.national_code || '—'} />
                                    <InfoItem label="شماره کارت پدر" value={tazkira.father_card_number || '—'} />
                                </div>
                            </div>

                            {/* 4. اطلاعات تماس */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                                    <Phone className="h-5 w-5 text-blue-500" />
                                    اطلاعات تماس
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="تلفن ثابت" value={tazkira.phone || '—'} />
                                    <InfoItem label="تلفن همراه" value={tazkira.mobile || '—'} />
                                    <InfoItem label="ایمیل" value={tazkira.email || '—'} />
                                    <InfoItem label="آدرس" value={tazkira.address || '—'} className="md:col-span-2" />
                                </div>
                            </div>

                            {/* 5. اطلاعات سیستمی */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                                    <Shield className="h-5 w-5 text-gray-500" />
                                    اطلاعات سیستمی
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem
                                        label="تاریخ ثبت"
                                        value={new Date(tazkira.created_at).toLocaleDateString('fa-IR')}
                                    />
                                    <InfoItem
                                        label="ثبت کننده"
                                        value={tazkira.created_by?.full_name || '—'}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">حذف تذکره</h3>
                        <p className="text-gray-600 mb-6">
                            آیا از حذف تذکره <span className="font-bold">{tazkira.first_name} {tazkira.last_name}</span> اطمینان دارید؟
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                            >
                                حذف
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">رد تذکره</h3>
                        <p className="text-gray-600 mb-4">
                            لطفاً دلیل رد تذکره را وارد کنید:
                        </p>
                        <textarea
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="دلیل رد را بنویسید..."
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleReject}
                                disabled={!rejectNote.trim()}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                رد تذکره
                            </button>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {showImageModal && tazkira.tazkira_image_url && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
                    <img
                        src={tazkira.tazkira_image_url}
                        alt="تصویر تذکره"
                        className="max-w-[90vw] max-h-[90vh] object-contain"
                    />
                    <button
                        onClick={() => setShowImageModal(false)}
                        className="absolute top-4 left-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                    >
                        <XCircle className="h-6 w-6" />
                    </button>
                </div>
            )}
        </>
    );
}

// کامپوننت کمکی برای نمایش آیتم‌های اطلاعات
function InfoItem({ label, value, className = '' }: { label: string; value: string; className?: string }) {
    return (
        <div className={className}>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-medium text-gray-900">{value || '—'}</p>
        </div>
    );
}