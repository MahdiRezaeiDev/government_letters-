// resources/js/pages/tazkira/create.tsx

import { Head, router } from '@inertiajs/react';
import {
    User, Hash, BookOpen, FileText, Grid, Calendar, MapPin, Phone, Mail,
    Save, X, Users, Fingerprint, Upload, Trash2, Paperclip, Plus,
    ArrowLeft, ImageIcon, File as FileIcon
} from 'lucide-react';
import { useState } from 'react';

interface Attachment {
    file_name: string;
    file_size: number;
    file?: File;
}

const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white placeholder-gray-400";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
        return bytes + ' B';
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + ' KB';
    }

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

export default function TazkiraCreate() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        father_name: '',
        grandfather_name: '',
        tazkira_number: '',
        volume: '',
        page: '',
        registration_number: '',
        birth_date: '',
        birth_place: '',
        national_code: '',
        father_card_number: '',
        phone: '',
        mobile: '',
        address: '',
        email: '',
        notes: '',
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [tazkiraImage, setTazkiraImage] = useState<File | null>(null);
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    const set = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) {
                fd.append(key, value);
            }
        });

        if (tazkiraImage) {
            fd.append('tazkira_image', tazkiraImage);
        }

        attachments.forEach(att => {
            if (att.file) {
                fd.append('attachments[]', att.file);
            }
        });

        router.post('/tazkira', fd, {
            preserveScroll: true,
            onSuccess: () => router.get('/tazkira'),
            onError: (errs) => {
                setErrors(errs); setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setTazkiraImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files) {
            return;
        }

        const newAtts: Attachment[] = Array.from(files).map(f => ({ file_name: f.name, file_size: f.size, file: f }));
        setAttachments(prev => [...prev, ...newAtts]);
        e.target.value = '';
    };

    return (
        <>
            <Head title="ثبت تذکره جدید" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* ── Header ── */}
                        <div className="flex items-center justify-between bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.get('/tazkira')}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">ثبت تذکره جدید</h1>
                                    <p className="text-xs text-gray-400 mt-0.5">ثبت تذکره الکترونیکی جدید در سیستم</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                فرم جدید
                            </div>
                        </div>

                        {/* ── ۱. معلومات شخصی ── */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#6366f1" title="معلومات شخصی" subtitle="مشخصات هویتی فرد مطابق تذکره" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>نام <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.first_name} onChange={e => set('first_name', e.target.value)} className={inputClass} placeholder="علی" />
                                    {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>تخلص <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.last_name} onChange={e => set('last_name', e.target.value)} className={inputClass} placeholder="رضایی" />
                                    {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>نام پدر</label>
                                    <div className="relative">
                                        <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.father_name} onChange={e => set('father_name', e.target.value)} className={`${inputClass} pr-9`} placeholder="محمد" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>نام پدر کلان</label>
                                    <div className="relative">
                                        <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.grandfather_name} onChange={e => set('grandfather_name', e.target.value)} className={`${inputClass} pr-9`} placeholder="احمد" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── ۲. مشخصات تذکره ── */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#8b5cf6" title="مشخصات تذکره" subtitle="اطلاعات اصلی تذکره الکترونیکی" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>شماره تذکره <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" required value={formData.tazkira_number} onChange={e => set('tazkira_number', e.target.value)} className={`${inputClass} pr-9`} placeholder="123456789" />
                                    </div>
                                    {errors.tazkira_number && <p className="text-xs text-red-500 mt-1">{errors.tazkira_number}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>جلد</label>
                                    <div className="relative">
                                        <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.volume} onChange={e => set('volume', e.target.value)} className={`${inputClass} pr-9`} placeholder="1" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>صفحه</label>
                                    <div className="relative">
                                        <FileText className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.page} onChange={e => set('page', e.target.value)} className={`${inputClass} pr-9`} placeholder="10" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>صکو / شماره ثبت</label>
                                    <div className="relative">
                                        <Grid className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.registration_number} onChange={e => set('registration_number', e.target.value)} className={`${inputClass} pr-9`} placeholder="12345" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── ۳. اطلاعات تکمیلی ── */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#10b981" title="اطلاعات تکمیلی" subtitle="تاریخ تولد، کد ملی و سایر مشخصات" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>تاریخ تولد</label>
                                    <div className="relative">
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="date" value={formData.birth_date} onChange={e => set('birth_date', e.target.value)} className={`${inputClass} pr-9`} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>محل تولد</label>
                                    <div className="relative">
                                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.birth_place} onChange={e => set('birth_place', e.target.value)} className={`${inputClass} pr-9`} placeholder="کابل" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>کد ملی</label>
                                    <div className="relative">
                                        <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.national_code} onChange={e => set('national_code', e.target.value)} className={`${inputClass} pr-9`} placeholder="1234567890" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>شماره کارت پدر</label>
                                    <div className="relative">
                                        <Fingerprint className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.father_card_number} onChange={e => set('father_card_number', e.target.value)} className={`${inputClass} pr-9`} placeholder="شماره کارت تذکره پدر" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── ۴. اطلاعات تماس ── */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#f59e0b" title="اطلاعات تماس" subtitle="راه‌های ارتباطی فرد" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>تلفن ثابت</label>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.phone} onChange={e => set('phone', e.target.value)} className={`${inputClass} pr-9`} placeholder="021-12345678" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>تلفن همراه</label>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.mobile} onChange={e => set('mobile', e.target.value)} className={`${inputClass} pr-9`} placeholder="09123456789" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>آدرس</label>
                                    <div className="relative">
                                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" value={formData.address} onChange={e => set('address', e.target.value)} className={`${inputClass} pr-9`} placeholder="آدرس کامل محل سکونت" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>ایمیل</label>
                                    <div className="relative">
                                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="email" value={formData.email} onChange={e => set('email', e.target.value)} className={`${inputClass} pr-9`} placeholder="example@mail.com" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── ۵. تصویر اصلی تذکره ── */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#ef4444" title="تصویر اصلی تذکره" subtitle="اسکن یا عکس تذکره الکترونیکی" />
                            {previewImage ? (
                                <div className="relative inline-block">
                                    <img src={previewImage} alt="پیش‌نمایش" className="max-h-52 rounded-xl border border-gray-200 shadow-sm" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreviewImage(null); setTazkiraImage(null);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
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

                        {/* ── ۶. ضمیمه‌های اضافی ── */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#06b6d4" title="ضمیمه‌های اضافی" subtitle="اسناد و مدارک مرتبط با تذکره" />
                            <div className="space-y-3">
                                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                                    <Plus className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">افزودن فایل</span>
                                    <input type="file" multiple className="hidden" onChange={handleAddAttachment} />
                                </label>
                                {attachments.length > 0 && (
                                    <div className="space-y-2">
                                        {attachments.map((att, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                                        <FileIcon className="h-4 w-4 text-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">{att.file_name}</p>
                                                        <p className="text-xs text-gray-400">{formatFileSize(att.file_size)}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── یادداشت ── */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <SectionHeader color="#64748b" title="یادداشت" subtitle="توضیحات اضافی" />
                            <textarea
                                value={formData.notes}
                                onChange={e => set('notes', e.target.value)}
                                rows={3}
                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                placeholder="یادداشت یا توضیحات اضافی..."
                            />
                        </div>

                        {/* ── دکمه‌های اقدام ── */}
                        <div className="sticky bottom-0 z-20">
                            <div className="bg-white/80 backdrop-blur-md border-t border-gray-200 rounded-2xl shadow-lg p-4">
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                                    >
                                        <Save className="h-4 w-4" />
                                        {processing ? 'در حال ثبت...' : 'ثبت تذکره'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.get('/tazkira')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                        انصراف
                                    </button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}