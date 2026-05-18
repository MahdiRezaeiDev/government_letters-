// resources/js/pages/tazkira/show.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    User, Hash, BookOpen, FileText, Grid, Calendar, MapPin, Phone, Mail,
    CheckCircle, XCircle, Clock, Eye, Edit, Trash2, ArrowLeft, Printer,
    Download, AlertCircle, Shield, Users, Fingerprint, Paperclip, Image as ImageIcon,
    File, ChevronDown, ChevronUp, UserCheck, UserX, Plus
} from 'lucide-react';
import { useState } from 'react';
import { TazkiraAttachments } from '@/components/TazkiraAttachments';
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
    pending: { label: 'در انتظار بررسی', icon: Clock, color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d' },
    approved: { label: 'تایید شده', icon: CheckCircle, color: '#10b981', bg: '#d1fae5', border: '#34d399' },
    rejected: { label: 'رد شده', icon: XCircle, color: '#ef4444', bg: '#fee2e2', border: '#f87171' },
};

export default function TazkiraShow({ tazkira, can }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
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

    const SectionHeader = ({ icon: Icon, title, section, count }: any) => (
        <button
            onClick={() => toggleSection(section)}
            className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
            <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-indigo-500" />
                <h2 className="text-base font-bold text-gray-900">{title}</h2>
                {count !== undefined && (
                    <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
                        {count}
                    </span>
                )}
            </div>
            {expandedSections[section] ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
        </button>
    );

    const InfoItem = ({ label, value, icon: Icon }: any) => (
        <div className="border-b border-gray-100 pb-2">
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                <p className="text-sm font-medium text-gray-900">{value || '—'}</p>
            </div>
        </div>
    );

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

                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        تأیید تذکره
                                    </button>
                                    <button
                                        onClick={() => {
                                            setReviewAction('reject');
                                            setShowReviewModal(true);
                                        }}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        رد تذکره
                                    </button>
                                </>
                            )}

                            {can.edit && (
                                <Link
                                    href={`/tazkira/${tazkira.id}/edit`}
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                    ویرایش
                                </Link>
                            )}

                            {can.delete && (
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
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
                                        {tazkira.status === 'approved' ? 'تأیید کننده: ' : 'رد کننده: '}
                                        {tazkira.approved_by?.full_name} |
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
                                className="relative h-48 bg-gray-100 cursor-pointer overflow-hidden border-b"
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

                        <div className="p-6 space-y-4">

                            {/* 1. معلومات شخصی */}
                            <div>
                                <SectionHeader icon={User} title="معلومات شخصی" section="personal" />
                                {expandedSections.personal && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <InfoItem label="نام" value={tazkira.first_name} />
                                        <InfoItem label="تخلص" value={tazkira.last_name} />
                                        <InfoItem label="نام پدر" value={tazkira.father_name} />
                                        <InfoItem label="نام پدر کلان" value={tazkira.grandfather_name} />
                                    </div>
                                )}
                            </div>

                            {/* 2. مشخصات تذکره */}
                            <div>
                                <SectionHeader icon={Fingerprint} title="مشخصات تذکره" section="tazkira" />
                                {expandedSections.tazkira && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <InfoItem icon={Hash} label="شماره تذکره" value={tazkira.tazkira_number} />
                                        <InfoItem icon={BookOpen} label="جلد" value={tazkira.volume} />
                                        <InfoItem icon={FileText} label="صفحه" value={tazkira.page} />
                                        <InfoItem icon={Grid} label="صکو / شماره ثبت" value={tazkira.registration_number} />
                                    </div>
                                )}
                            </div>

                            {/* 3. اطلاعات تکمیلی */}
                            <div>
                                <SectionHeader icon={Calendar} title="اطلاعات تکمیلی" section="additional" />
                                {expandedSections.additional && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <InfoItem icon={Calendar} label="تاریخ تولد" value={tazkira.birth_date ? new Date(tazkira.birth_date).toLocaleDateString('fa-IR') : null} />
                                        <InfoItem icon={MapPin} label="محل تولد" value={tazkira.birth_place} />
                                        <InfoItem icon={Hash} label="کد ملی" value={tazkira.national_code} />
                                        <InfoItem icon={Fingerprint} label="شماره کارت پدر" value={tazkira.father_card_number} />
                                    </div>
                                )}
                            </div>

                            {/* 4. اطلاعات تماس */}
                            <div>
                                <SectionHeader icon={Phone} title="اطلاعات تماس" section="contact" />
                                {expandedSections.contact && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <InfoItem icon={Phone} label="تلفن ثابت" value={tazkira.phone} />
                                        <InfoItem icon={Phone} label="تلفن همراه" value={tazkira.mobile} />
                                        <InfoItem icon={Mail} label="ایمیل" value={tazkira.email} />
                                        <InfoItem icon={MapPin} label="آدرس" value={tazkira.address} className="md:col-span-2" />
                                    </div>
                                )}
                            </div>

                            {/* 5. ضمیمه‌ها */}
                            <div>
                                <SectionHeader icon={Paperclip} title="ضمیمه‌ها" section="attachments" count={tazkira.attachments?.length || 0} />
                                {expandedSections.attachments && (
                                    <div className="mt-4">
                                        <TazkiraAttachments
                                            tazkiraId={tazkira.id}
                                            attachments={tazkira.attachments || []}
                                            canUpload={true}
                                            canDelete={can.edit}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* 6. تاریخچه بررسی */}
                            {tazkira.review_logs && tazkira.review_logs.length > 0 && (
                                <div>
                                    <SectionHeader icon={Clock} title="تاریخچه بررسی" section="history" count={tazkira.review_logs.length} />
                                    {expandedSections.history && (
                                        <div className="space-y-3 mt-4">
                                            {tazkira.review_logs.map((log) => (
                                                <div key={log.id} className="border rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-3">
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
                                                        <div className="text-xs text-gray-400">
                                                            {log.reviewer?.full_name} | {new Date(log.reviewed_at).toLocaleDateString('fa-IR')}
                                                        </div>
                                                    </div>

                                                    {log.note && (
                                                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                                            <p className="text-xs text-gray-500 mb-1">یادداشت:</p>
                                                            <p className="text-sm text-gray-700">{log.note}</p>
                                                        </div>
                                                    )}

                                                    {log.attachments && log.attachments.length > 0 && (
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-2">ضمیمه‌ها:</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {log.attachments.map((att) => (
                                                                    <a
                                                                        key={att.id}
                                                                        href={att.file_url}
                                                                        download
                                                                        target="_blank"
                                                                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600 hover:bg-gray-200 transition-colors"
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
                            <div className="pt-4 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                                    <div>تاریخ ثبت: {new Date(tazkira.created_at).toLocaleDateString('fa-IR')}</div>
                                    <div>ثبت کننده: {tazkira.created_by?.full_name || '—'}</div>
                                    <div>آخرین بروزرسانی: {new Date(tazkira.updated_at).toLocaleDateString('fa-IR')}</div>
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
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">حذف تذکره</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            آیا از حذف تذکره <span className="font-bold">{tazkira.first_name} {tazkira.last_name}</span> با شماره <span className="font-mono">{tazkira.tazkira_number}</span> اطمینان دارید؟
                        </p>
                        <div className="flex gap-3">
                            <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                                حذف
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
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