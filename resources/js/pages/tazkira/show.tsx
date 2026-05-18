// resources/js/pages/tazkira/show.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    User, Hash, BookOpen, FileText, Grid, Calendar, MapPin, Phone, Mail,
    CheckCircle, XCircle, Clock, Eye, Edit, Trash2, ArrowLeft, Printer,
    Download, AlertCircle, Fingerprint, Paperclip, ImageIcon,
    File, ChevronDown, ChevronUp, Smartphone
} from 'lucide-react';
import { useState } from 'react';
import { TazkiraReviewModal } from '@/components/TazkiraReviewModal';

interface Attachment {
    id: number;
    file_name: string;
    file_path: string;
    file_url: string;
    file_type: string;
    file_size: number;
    description: string | null;
    uploaded_by?: { full_name: string };
    created_at: string;
}

interface ReviewAttachment {
    id: number;
    file_name: string;
    file_path: string;
    file_url: string;
    file_size: number;
    uploaded_by?: { full_name: string };
}

interface ReviewLog {
    id: number;
    action: 'approved' | 'rejected';
    action_text: string;
    action_color: string;
    note: string | null;
    reviewer: { full_name: string } | null;
    reviewed_at: string;
    attachments: ReviewAttachment[];
}

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
    status_text: string;
    status_color: string;
    notes: string | null;
    created_by: { id: number; full_name: string } | null;
    approved_by: { id: number; full_name: string } | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
    attachments: Attachment[];
    review_logs: ReviewLog[];
}

interface Props {
    tazkira: Tazkira;
    can: {
        edit: boolean;
        delete: boolean;
        approve: boolean;
    };
}

const STATUS_CONFIG = {
    pending: { label: 'در انتظار بررسی', icon: Clock, color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d', text: '#b45309' },
    approved: { label: 'تایید شده', icon: CheckCircle, color: '#10b981', bg: '#d1fae5', border: '#34d399', text: '#047857' },
    rejected: { label: 'رد شده', icon: XCircle, color: '#ef4444', bg: '#fee2e2', border: '#f87171', text: '#b91c1c' },
};

const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fa-IR');
};

export default function TazkiraShow({ tazkira, can }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
    const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        tazkira: true,
        additional: false,
        contact: false,
        attachments: true,
        history: true,
    });

    const statusConfig = STATUS_CONFIG[tazkira.status];
    const StatusIcon = statusConfig.icon;

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleDelete = () => {
        router.delete(`/tazkira/${tazkira.id}`, {
            onSuccess: () => router.get('/tazkira'),
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`تذکره - ${tazkira.first_name} ${tazkira.last_name}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/tazkira"
                                className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-200 border border-gray-100"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    جزئیات تذکره
                                </h1>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {tazkira.first_name} {tazkira.last_name} • {tazkira.tazkira_number}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                            >
                                <Printer className="h-4 w-4" />
                                چاپ
                            </button>

                            {can.approve && tazkira.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => {
                                            setReviewAction('approve');
                                            setShowReviewModal(true);
                                        }}
                                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all duration-200 shadow-sm"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        تأیید تذکره
                                    </button>
                                    <button
                                        onClick={() => {
                                            setReviewAction('reject');
                                            setShowReviewModal(true);
                                        }}
                                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all duration-200 shadow-sm"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        رد تذکره
                                    </button>
                                </>
                            )}

                            {can.edit && (
                                <Link
                                    href={`/tazkira/${tazkira.id}/edit`}
                                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                                >
                                    <Edit className="h-4 w-4" />
                                    ویرایش
                                </Link>
                            )}

                            {can.delete && (
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all duration-200 shadow-sm"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    حذف
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div
                        className="rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        style={{ backgroundColor: statusConfig.bg, borderRight: `4px solid ${statusConfig.color}` }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-full bg-white/50">
                                <StatusIcon className="h-5 w-5" style={{ color: statusConfig.color }} />
                            </div>
                            <div>
                                <p className="font-semibold" style={{ color: statusConfig.text }}>
                                    وضعیت: {statusConfig.label}
                                </p>
                                {tazkira.approved_by && (
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        {tazkira.status === 'approved' ? 'تأیید کننده: ' : 'رد کننده: '}
                                        {tazkira.approved_by?.full_name} |
                                        تاریخ: {formatDate(tazkira.approved_at)}
                                    </p>
                                )}
                            </div>
                        </div>
                        {tazkira.notes && tazkira.status !== 'pending' && (
                            <div className="text-sm text-gray-600 max-w-md bg-white/50 rounded-lg p-2 px-3">
                                <span className="font-medium">توضیحات:</span> {tazkira.notes}
                            </div>
                        )}
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                        {/* تصویر تذکره */}
                        {tazkira.tazkira_image_url && tazkira.tazkira_image_url !== '/images/no-image.png' ? (
                            <div
                                className="relative h-52 bg-gradient-to-r from-gray-100 to-gray-200 cursor-pointer overflow-hidden group"
                                onClick={() => setShowImageModal(true)}
                            >
                                <img
                                    src={tazkira.tazkira_image_url}
                                    alt="تصویر تذکره"
                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/no-image.png';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                                    <div className="bg-white/90 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        مشاهده بزرگ
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative h-52 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="p-3 bg-white/50 rounded-full inline-block mb-2">
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500">تصویر تذکره وجود ندارد</p>
                                </div>
                            </div>
                        )}

                        <div className="p-6 space-y-5">

                            {/* Section 1: معلومات شخصی */}
                            <div className="group">
                                <button
                                    onClick={() => toggleSection('personal')}
                                    className="flex items-center justify-between w-full"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                            <User className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        <h2 className="text-base font-bold text-gray-800">معلومات شخصی</h2>
                                    </div>
                                    {expandedSections.personal ? (
                                        <ChevronUp className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {expandedSections.personal && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-1">نام</p>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.first_name || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-1">تخلص</p>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.last_name || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-1">نام پدر</p>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.father_name || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-1">نام پدر کلان</p>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.grandfather_name || '—'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 2: مشخصات تذکره */}
                            <div className="group">
                                <button
                                    onClick={() => toggleSection('tazkira')}
                                    className="flex items-center justify-between w-full"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                            <Fingerprint className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <h2 className="text-base font-bold text-gray-800">مشخصات تذکره</h2>
                                    </div>
                                    {expandedSections.tazkira ? (
                                        <ChevronUp className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {expandedSections.tazkira && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Hash className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">شماره تذکره</p>
                                            </div>
                                            <p className="text-sm font-mono font-semibold text-gray-800">{tazkira.tazkira_number || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <BookOpen className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">جلد</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.volume || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <FileText className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">صفحه</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.page || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Grid className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">صکو / شماره ثبت</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.registration_number || '—'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 3: اطلاعات تکمیلی */}
                            <div className="group">
                                <button
                                    onClick={() => toggleSection('additional')}
                                    className="flex items-center justify-between w-full"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                            <Calendar className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <h2 className="text-base font-bold text-gray-800">اطلاعات تکمیلی</h2>
                                    </div>
                                    {expandedSections.additional ? (
                                        <ChevronUp className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {expandedSections.additional && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">تاریخ تولد</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.birth_date ? formatDate(tazkira.birth_date) : '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <MapPin className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">محل تولد</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.birth_place || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Hash className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">کد ملی</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.national_code || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Fingerprint className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">شماره کارت پدر</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.father_card_number || '—'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 4: اطلاعات تماس */}
                            <div className="group">
                                <button
                                    onClick={() => toggleSection('contact')}
                                    className="flex items-center justify-between w-full"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            <Phone className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h2 className="text-base font-bold text-gray-800">اطلاعات تماس</h2>
                                    </div>
                                    {expandedSections.contact ? (
                                        <ChevronUp className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {expandedSections.contact && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Phone className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">تلفن ثابت</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.phone || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Smartphone className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">تلفن همراه</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.mobile || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Mail className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">ایمیل</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800 break-all">{tazkira.email || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="flex items-center gap-1 mb-1">
                                                <MapPin className="h-3 w-3 text-gray-400" />
                                                <p className="text-xs text-gray-400">آدرس</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">{tazkira.address || '—'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 5: ضمیمه‌ها */}
                            <div className="group">
                                <button
                                    onClick={() => toggleSection('attachments')}
                                    className="flex items-center justify-between w-full"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                                            <Paperclip className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <h2 className="text-base font-bold text-gray-800">
                                            ضمیمه‌ها
                                            <span className="mr-2 text-xs font-normal text-gray-400">({tazkira.attachments?.length || 0})</span>
                                        </h2>
                                    </div>
                                    {expandedSections.attachments ? (
                                        <ChevronUp className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {expandedSections.attachments && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        {tazkira.attachments && tazkira.attachments.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {tazkira.attachments.map((att) => (
                                                    <div
                                                        key={att.id}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group/att"
                                                    >
                                                        <div
                                                            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                                                            onClick={() => {
                                                                if (att.file_type?.startsWith('image/')) {
                                                                    setPreviewImage({ url: att.file_url, name: att.file_name });
                                                                }
                                                            }}
                                                        >
                                                            {att.file_type?.startsWith('image/') ? (
                                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-blue-100 flex-shrink-0">
                                                                    <img
                                                                        src={att.file_url}
                                                                        alt={att.file_name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/0 group-hover/att:bg-black/20 transition-colors flex items-center justify-center">
                                                                        <Eye className="h-4 w-4 text-white opacity-0 group-hover/att:opacity-100 transition-opacity" />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="p-1.5 bg-gray-200 rounded-lg flex-shrink-0">
                                                                    <File className="h-4 w-4 text-gray-600" />
                                                                </div>
                                                            )}
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-sm font-medium text-gray-800 truncate" title={att.file_name}>
                                                                    {att.file_name}
                                                                </p>
                                                                <p className="text-xs text-gray-400">
                                                                    {formatFileSize(att.file_size)} • {formatDate(att.created_at)}
                                                                </p>
                                                                {att.description && (
                                                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{att.description}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={att.file_url}
                                                            download
                                                            target="_blank"
                                                            className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors opacity-0 group-hover/att:opacity-100"
                                                            title="دانلود"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50 rounded-xl">
                                                <Paperclip className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-sm text-gray-400">هیچ ضمیمه‌ای وجود ندارد</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Section 6: تاریخچه بررسی */}
                            {tazkira.review_logs && tazkira.review_logs.length > 0 && (
                                <div className="group">
                                    <button
                                        onClick={() => toggleSection('history')}
                                        className="flex items-center justify-between w-full"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                                                <Clock className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <h2 className="text-base font-bold text-gray-800">
                                                تاریخچه بررسی
                                                <span className="mr-2 text-xs font-normal text-gray-400">({tazkira.review_logs.length})</span>
                                            </h2>
                                        </div>
                                        {expandedSections.history ? (
                                            <ChevronUp className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                    {expandedSections.history && (
                                        <div className="space-y-4 mt-4 pt-4 border-t border-gray-100">
                                            {tazkira.review_logs.map((log) => (
                                                <div key={log.id} className="border rounded-xl overflow-hidden">
                                                    <div className={`p-3 flex items-center justify-between ${log.action === 'approved' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                                        <div className="flex items-center gap-2">
                                                            {log.action === 'approved' ? (
                                                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                                                            ) : (
                                                                <XCircle className="h-5 w-5 text-red-600" />
                                                            )}
                                                            <span className={`text-sm font-bold ${log.action === 'approved' ? 'text-emerald-700' : 'text-red-700'}`}>
                                                                {log.action_text}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {log.reviewer?.full_name} • {formatDate(log.reviewed_at)}
                                                        </div>
                                                    </div>
                                                    {log.note && (
                                                        <div className="p-3 bg-gray-50 border-b">
                                                            <p className="text-xs text-gray-500 mb-1">یادداشت:</p>
                                                            <p className="text-sm text-gray-700">{log.note}</p>
                                                        </div>
                                                    )}
                                                    {log.attachments && log.attachments.length > 0 && (
                                                        <div className="p-3">
                                                            <p className="text-xs text-gray-500 mb-2">ضمیمه‌ها:</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {log.attachments.map((att) => (
                                                                    <a
                                                                        key={att.id}
                                                                        href={att.file_url}
                                                                        download
                                                                        target="_blank"
                                                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                                                                    >
                                                                        <Download className="h-3 w-3" />
                                                                        {att.file_name}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* اطلاعات سیستمی */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>تاریخ ثبت: {formatDate(tazkira.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        <span>ثبت کننده: {tazkira.created_by?.full_name || '—'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>آخرین بروزرسانی: {formatDate(tazkira.updated_at)}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-full">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">حذف تذکره</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            آیا از حذف تذکره <span className="font-bold">{tazkira.first_name} {tazkira.last_name}</span> با شماره <span className="font-mono text-sm">{tazkira.tazkira_number}</span> اطمینان دارید؟
                        </p>
                        <div className="flex gap-3">
                            <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                                حذف
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal (تصویر اصلی تذکره) */}
            {showImageModal && tazkira.tazkira_image_url && tazkira.tazkira_image_url !== '/images/no-image.png' && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowImageModal(false)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={tazkira.tazkira_image_url}
                            alt="تصویر تذکره"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="absolute -top-12 left-0 right-0 flex items-center justify-between">
                            <span className="text-white text-sm">تصویر تذکره</span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={tazkira.tazkira_image_url}
                                    download
                                    target="_blank"
                                    className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Download className="h-5 w-5" />
                                </a>
                                <button
                                    onClick={() => setShowImageModal(false)}
                                    className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Attachment Preview Modal (ضمیمه‌ها) */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative max-w-[90vw] max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={previewImage.url}
                            alt={previewImage.name}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="absolute -top-12 left-0 right-0 flex items-center justify-between">
                            <span className="text-white text-sm truncate max-w-xs">{previewImage.name}</span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={previewImage.url}
                                    download
                                    target="_blank"
                                    className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Download className="h-5 w-5" />
                                </a>
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            <TazkiraReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                tazkiraId={tazkira.id}
                tazkiraName={`${tazkira.first_name} ${tazkira.last_name}`}
                action={reviewAction}
            />
        </>
    );
}