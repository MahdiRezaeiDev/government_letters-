// resources/js/pages/tazkira/edit.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    User, Hash, BookOpen, FileText, Grid, MapPin,
    Save, X, Users, Fingerprint, Upload, Trash2, Paperclip, Plus,
    ArrowLeft, CheckCircle, AlertCircle, XCircle, Clock,
    File as FileIcon, Download, Eye, ImageIcon
} from 'lucide-react';
import { useState } from 'react';

interface ExistingAttachment {
    id: number;
    file_name: string;
    file_path: string;
    file_url: string;
    file_type: string;
    file_size: number;
    description: string | null;
    created_at: string;
}

interface NewAttachment {
    file_name: string;
    file_size: number;
    file: File;
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
    velayat: string | null;
    volosvali: string | null;
    qaria: string | null;
    tazkira_image: string | null;
    tazkira_image_url: string | null;
    status: string;
    notes: string | null;
    attachments: ExistingAttachment[];
}

interface Props {
    tazkira: Tazkira;
    can: {
        edit: boolean;
        delete: boolean;
    };
}

const STATUS_OPTIONS = [
    { value: 'pending', label: 'در انتظار بررسی', icon: Clock, color: 'amber' },
    { value: 'approved', label: 'تایید شده', icon: CheckCircle, color: 'emerald' },
    { value: 'rejected', label: 'رد شده', icon: XCircle, color: 'red' },
] as const;

const STATUS_COLORS: Record<string, { ring: string; bg: string; text: string; dot: string }> = {
    pending: { ring: 'ring-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
    approved: { ring: 'ring-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
    rejected: { ring: 'ring-red-400', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
};

const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white placeholder-gray-400";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

function SectionHeader({ color, title, subtitle }: { color: string; title: string; subtitle?: string }) {
    return (
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: color }} />
            <div>
                <h2 className="text-base font-bold text-gray-800">{title}</h2>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}

export default function TazkiraEdit({ tazkira, can }: Props) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        first_name: tazkira.first_name || '',
        last_name: tazkira.last_name || '',
        father_name: tazkira.father_name || '',
        grandfather_name: tazkira.grandfather_name || '',
        tazkira_number: tazkira.tazkira_number || '',
        volume: tazkira.volume || '',
        page: tazkira.page || '',
        registration_number: tazkira.registration_number || '',
        velayat: tazkira.velayat || '',
        volosvali: tazkira.volosvali || '',
        qaria: tazkira.qaria || '',
        status: tazkira.status || 'pending',
        notes: tazkira.notes || '',
    });

    const [previewImage, setPreviewImage] = useState<string | null>(tazkira.tazkira_image_url || null);
    const [tazkiraImage, setTazkiraImage] = useState<File | null>(null);
    const [removeImage, setRemoveImage] = useState(false);

    const [existingAttachments, setExistingAttachments] = useState<ExistingAttachment[]>(tazkira.attachments || []);
    const [removedAttachmentIds, setRemovedAttachmentIds] = useState<number[]>([]);
    const [newAttachments, setNewAttachments] = useState<NewAttachment[]>([]);
    const [previewAtt, setPreviewAtt] = useState<{ url: string; name: string } | null>(null);

    const set = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const fd = new FormData();
        fd.append('_method', 'PUT');

        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) fd.append(key, value);
        });

        if (tazkiraImage) fd.append('tazkira_image', tazkiraImage);
        if (removeImage) fd.append('remove_image', '1');

        removedAttachmentIds.forEach(id => fd.append('remove_attachments[]', String(id)));
        newAttachments.forEach(att => fd.append('attachments[]', att.file));

        router.post(`/tazkira/${tazkira.id}`, fd, {
            preserveScroll: true,
            onSuccess: () => router.get(`/tazkira/${tazkira.id}`),
            onError: (errs) => { setErrors(errs); setProcessing(false); },
            onFinish: () => setProcessing(false),
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setTazkiraImage(file);
        setRemoveImage(false);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleRemoveExistingImage = () => {
        setPreviewImage(null);
        setTazkiraImage(null);
        setRemoveImage(true);
    };

    const handleRemoveExistingAttachment = (id: number) => {
        setExistingAttachments(prev => prev.filter(a => a.id !== id));
        setRemovedAttachmentIds(prev => [...prev, id]);
    };

    const handleAddNewAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newAtts: NewAttachment[] = Array.from(files).map(f => ({ file_name: f.name, file_size: f.size, file: f }));
        setNewAttachments(prev => [...prev, ...newAtts]);
        e.target.value = '';
    };

    const currentStatus = STATUS_COLORS[formData.status] || STATUS_COLORS.pending;

    return (
        <>
            <Head title={`ویرایش تذکره — ${tazkira.first_name} ${tazkira.last_name}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Header */}
                        <div className="flex items-center justify-between bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/tazkira/${tazkira.id}`}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">ویرایش تذکره</h1>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {tazkira.first_name} {tazkira.last_name} • {tazkira.tazkira_number}
                                    </p>
                                </div>
                            </div>
                            <div className={`hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ring-1 ${currentStatus.ring} ${currentStatus.bg} ${currentStatus.text}`}>
                                <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
                                {STATUS_OPTIONS.find(s => s.value === formData.status)?.label}
                            </div>
                        </div>

                        {/* 1. معلومات شخصی */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#6366f1" title="معلومات شخصی" subtitle="مشخصات هویتی فرد مطابق تذکره" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>نام <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.first_name} onChange={e => set('first_name', e.target.value)} className={inputClass} />
                                    {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>تخلص <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.last_name} onChange={e => set('last_name', e.target.value)} className={inputClass} />
                                    {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>نام پدر</label>
                                    <div className="relative">
                                        <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.father_name} onChange={e => set('father_name', e.target.value)} className={`${inputClass} pr-9`} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>نام پدر کلان</label>
                                    <div className="relative">
                                        <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.grandfather_name} onChange={e => set('grandfather_name', e.target.value)} className={`${inputClass} pr-9`} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. مشخصات تذکره */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#8b5cf6" title="مشخصات تذکره" subtitle="اطلاعات اصلی تذکره الکترونیکی" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>شماره تذکره <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" required value={formData.tazkira_number} onChange={e => set('tazkira_number', e.target.value)} className={`${inputClass} pr-9`} />
                                    </div>
                                    {errors.tazkira_number && <p className="text-xs text-red-500 mt-1">{errors.tazkira_number}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>جلد</label>
                                    <div className="relative">
                                        <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.volume} onChange={e => set('volume', e.target.value)} className={`${inputClass} pr-9`} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>صفحه</label>
                                    <div className="relative">
                                        <FileText className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.page} onChange={e => set('page', e.target.value)} className={`${inputClass} pr-9`} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>صکو / شماره ثبت</label>
                                    <div className="relative">
                                        <Grid className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.registration_number} onChange={e => set('registration_number', e.target.value)} className={`${inputClass} pr-9`} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. اطلاعات تکمیلی (ولایت، ولسوالی، قریه) */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#10b981" title="اطلاعات تکمیلی" subtitle="موقعیت مکانی فرد" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>ولایت</label>
                                    <div className="relative">
                                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.velayat} onChange={e => set('velayat', e.target.value)} className={`${inputClass} pr-9`} placeholder="کابل" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>ولسوالی</label>
                                    <div className="relative">
                                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.volosvali} onChange={e => set('volosvali', e.target.value)} className={`${inputClass} pr-9`} placeholder="نهمارکزی" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>قریه / ناحیه</label>
                                    <div className="relative">
                                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.qaria} onChange={e => set('qaria', e.target.value)} className={`${inputClass} pr-9`} placeholder="سرک تذکره" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. تصویر اصلی تذکره */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#ef4444" title="تصویر اصلی تذکره" subtitle="اسکن یا عکس تذکره الکترونیکی" />
                            {previewImage ? (
                                <div className="relative inline-block">
                                    <img src={previewImage} alt="پیش‌نمایش" className="max-h-52 rounded-xl border border-gray-200 shadow-sm" />
                                    <div className="absolute top-2 right-2 flex gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewAtt({ url: previewImage, name: 'تصویر تذکره' })}
                                            className="p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemoveExistingImage}
                                            className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    {tazkiraImage && (
                                        <span className="absolute bottom-2 left-2 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">جدید</span>
                                    )}
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-indigo-300 transition-all">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-3 bg-white rounded-full shadow-sm">
                                            <Upload className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">برای آپلود کلیک کنید</p>
                                        <p className="text-xs text-gray-400">JPEG, PNG, PDF (حداکثر 5MB)</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>

                        {/* 5. ضمیمه‌ها */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#06b6d4" title="ضمیمه‌ها" subtitle="مدیریت فایل‌های پیوست تذکره" />
                            <div className="space-y-4">

                                {existingAttachments.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-2">ضمیمه‌های فعلی ({existingAttachments.length})</p>
                                        <div className="space-y-2">
                                            {existingAttachments.map(att => {
                                                const isImage = att.file_type?.startsWith('image/');
                                                return (
                                                    <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                                        <div
                                                            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                                                            onClick={() => isImage && setPreviewAtt({ url: att.file_url, name: att.file_name })}
                                                        >
                                                            {isImage ? (
                                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-blue-100 flex-shrink-0">
                                                                    <img src={att.file_url} alt={att.file_name} className="w-full h-full object-cover" />
                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                                        <Eye className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                                                                    <FileIcon className="h-4 w-4 text-indigo-500" />
                                                                </div>
                                                            )}
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-sm font-medium text-gray-700 truncate">{att.file_name}</p>
                                                                <p className="text-xs text-gray-400">{formatFileSize(att.file_size)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <a
                                                                href={att.file_url}
                                                                download
                                                                target="_blank"
                                                                className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors"
                                                                onClick={e => e.stopPropagation()}
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveExistingAttachment(att.id)}
                                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {newAttachments.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-indigo-600 mb-2">ضمیمه‌های جدید ({newAttachments.length})</p>
                                        <div className="space-y-2">
                                            {newAttachments.map((att, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100 group">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                                            <FileIcon className="h-4 w-4 text-indigo-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">{att.file_name}</p>
                                                            <p className="text-xs text-indigo-400">{formatFileSize(att.file_size)} • جدید</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setNewAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                                    <Plus className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">افزودن ضمیمه جدید</span>
                                    <input type="file" multiple className="hidden" onChange={handleAddNewAttachment} />
                                </label>
                            </div>
                        </div>

                        {/* 6. وضعیت تأیید */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#10b981" title="وضعیت تأیید" subtitle="تعیین وضعیت نهایی تذکره" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                                {STATUS_OPTIONS.map(opt => {
                                    const Icon = opt.icon;
                                    const isSelected = formData.status === opt.value;
                                    const colors = STATUS_COLORS[opt.value];
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => set('status', opt.value)}
                                            className={`relative flex items-center gap-3 p-4 rounded-xl border-2 text-right transition-all ${isSelected
                                                ? `${colors.bg} ${colors.ring} ring-1`
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-white' : 'bg-gray-100'}`}>
                                                <Icon className={`h-4 w-4 ${isSelected ? colors.text : 'text-gray-400'}`} />
                                            </div>
                                            <span className={`text-sm font-semibold ${isSelected ? colors.text : 'text-gray-600'}`}>
                                                {opt.label}
                                            </span>
                                            {isSelected && (
                                                <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${colors.dot}`} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div>
                                <label className={labelClass}>توضیحات / یادداشت</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => set('notes', e.target.value)}
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    placeholder="توضیحات اضافی در مورد ویرایش تذکره..."
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="sticky bottom-0 z-20">
                            <div className="bg-white/80 backdrop-blur-md border-t border-gray-200 rounded-2xl shadow-lg p-4">
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                                    >
                                        <Save className="h-4 w-4" />
                                        {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                    </button>
                                    <Link
                                        href={`/tazkira/${tazkira.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                        انصراف
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

            {/* Attachment Preview Modal */}
            {previewAtt && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreviewAtt(null)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <img
                            src={previewAtt.url}
                            alt={previewAtt.name}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="absolute -top-12 left-0 right-0 flex items-center justify-between">
                            <span className="text-white text-sm truncate max-w-xs">{previewAtt.name}</span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={previewAtt.url}
                                    download
                                    target="_blank"
                                    className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <Download className="h-5 w-5" />
                                </a>
                                <button
                                    onClick={() => setPreviewAtt(null)}
                                    className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                                >
                                    <XCircle className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}