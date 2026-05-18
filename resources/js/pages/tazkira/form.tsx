// resources/js/pages/tazkira/form.tsx

import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    User, Hash, BookOpen, FileText, Grid, Calendar, MapPin, Phone, Mail,
    CheckCircle, AlertCircle, Save, X, Users, Fingerprint, Shield, Upload, Trash2,
    Paperclip, Plus
} from 'lucide-react';
import { useState } from 'react';
import SectionCard from '@/components/ui/SectionCard';

interface Attachment {
    id?: number;
    file_name: string;
    file_path?: string;
    file_url?: string;
    file_size: number;
    description?: string | null;
    is_new?: boolean;
    file?: File;
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
    status: string;
    notes: string | null;
    attachments?: Attachment[];
}

interface Props {
    tazkira?: Tazkira;
    isEdit?: boolean;
}

const STATUS_OPTIONS = [
    { value: 'pending', label: 'در انتظار بررسی', icon: AlertCircle, color: '#f59e0b', bg: '#fffbeb' },
    { value: 'approved', label: 'تایید شده', icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
    { value: 'rejected', label: 'رد شده', icon: AlertCircle, color: '#ef4444', bg: '#fee2e2' },
];

const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white";

export default function TazkiraForm({ tazkira, isEdit = false }: Props) {
    const { data, setData, processing, post, put, errors } = useForm({
        first_name: tazkira?.first_name || '',
        last_name: tazkira?.last_name || '',
        father_name: tazkira?.father_name || '',
        grandfather_name: tazkira?.grandfather_name || '',
        tazkira_number: tazkira?.tazkira_number || '',
        volume: tazkira?.volume || '',
        page: tazkira?.page || '',
        registration_number: tazkira?.registration_number || '',
        birth_date: tazkira?.birth_date || '',
        birth_place: tazkira?.birth_place || '',
        national_code: tazkira?.national_code || '',
        father_card_number: tazkira?.father_card_number || '',
        phone: tazkira?.phone || '',
        mobile: tazkira?.mobile || '',
        address: tazkira?.address || '',
        email: tazkira?.email || '',
        status: tazkira?.status || 'pending',
        notes: tazkira?.notes || '',
    });

    const [previewImage, setPreviewImage] = useState<string | null>(tazkira?.tazkira_image_url || null);
    const [tazkiraImage, setTazkiraImage] = useState<File | null>(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [attachments, setAttachments] = useState<Attachment[]>(tazkira?.attachments || []);
    const [attachmentDescription, setAttachmentDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        // اضافه کردن تمام فیلدها به FormData
        Object.keys(data).forEach(key => {
            const value = data[key as keyof typeof data];

            if (value !== null && value !== undefined) {
                formData.append(key, value as string);
            }
        });

        // اضافه کردن تصویر اصلی
        if (tazkiraImage) {
            formData.append('tazkira_image', tazkiraImage);
        }

        // حذف تصویر
        if (removeImage) {
            formData.append('remove_image', '1');
        }

        // اضافه کردن ضمیمه‌ها
        attachments.forEach(att => {
            if (att.is_new && att.file) {
                formData.append('attachments[]', att.file);
            }
        });

        // اضافه کردن توضیحات ضمیمه
        if (attachmentDescription) {
            formData.append('attachment_description', attachmentDescription);
        }

        // ارسال با router.post و تنظیمات صحیح
        const url = isEdit && tazkira?.id
            ? `/tazkira/${tazkira.id}`
            : '/tazkira';

        const method = isEdit ? 'POST' : 'POST';

        router.post(url, formData, {
            preserveScroll: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onSuccess: () => router.get('/tazkira'),
        });
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setTazkiraImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setTazkiraImage(null);
        setRemoveImage(true);
    };

    const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files) {
            const newAttachments: Attachment[] = Array.from(files).map(file => ({
                file_name: file.name,
                file_size: file.size,
                is_new: true,
                file: file,
            }));
            setAttachments([...attachments, ...newAttachments]);
        }

        e.target.value = '';
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) {
            return bytes + ' B';
        }

        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        }

        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <>
            <Head title={isEdit ? 'ویرایش تذکره' : 'ثبت تذکره جدید'} />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* Header */}
                            <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {isEdit ? 'ویرایش تذکره' : 'ثبت تذکره جدید'}
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {isEdit ? 'ویرایش اطلاعات تذکره' : 'ثبت تذکره الکترونیکی جدید در سیستم'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => router.get('/tazkira')}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* 1. معلومات شخصی */}
                            <SectionCard
                                icon={User}
                                iconColor="#0ea5e9"
                                title="معلومات شخصی"
                                subtitle="مشخصات هویتی فرد"
                                description="اطلاعات کامل شخص مطابق تذکره الکترونیکی"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            نام <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className={inputClass}
                                            placeholder="علی"
                                        />
                                        {errors.first_name && (
                                            <p className="text-xs text-red-500 mt-1">{errors.first_name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            تخلص <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className={inputClass}
                                            placeholder="رضایی"
                                        />
                                        {errors.last_name && (
                                            <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            نام پدر
                                        </label>
                                        <div className="relative">
                                            <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.father_name}
                                                onChange={(e) => setData('father_name', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="محمد"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">نام پدر شخص مطابق تذکره</p>
                                        {errors.father_name && (
                                            <p className="text-xs text-red-500 mt-1">{errors.father_name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            نام پدر کلان
                                        </label>
                                        <div className="relative">
                                            <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.grandfather_name}
                                                onChange={(e) => setData('grandfather_name', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="احمد"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">نام پدر بزرگ شخص</p>
                                        {errors.grandfather_name && (
                                            <p className="text-xs text-red-500 mt-1">{errors.grandfather_name}</p>
                                        )}
                                    </div>
                                </div>
                            </SectionCard>

                            {/* 2. مشخصات تذکره */}
                            <SectionCard
                                icon={Fingerprint}
                                iconColor="#8b5cf6"
                                title="مشخصات تذکره"
                                subtitle="اطلاعات تذکره الکترونیکی"
                                description="مشخصات اصلی تذکره شامل جلد، صفحه، صکو و شماره تذکره"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            شماره تذکره <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                value={data.tazkira_number}
                                                onChange={(e) => setData('tazkira_number', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="123456789"
                                            />
                                        </div>
                                        {errors.tazkira_number && (
                                            <p className="text-xs text-red-500 mt-1">{errors.tazkira_number}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            جلد
                                        </label>
                                        <div className="relative">
                                            <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.volume}
                                                onChange={(e) => setData('volume', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="1"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">شماره جلد تذکره</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            صفحه
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.page}
                                                onChange={(e) => setData('page', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="10"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">شماره صفحه تذکره</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            صکو / شماره ثبت
                                        </label>
                                        <div className="relative">
                                            <Grid className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.registration_number}
                                                onChange={(e) => setData('registration_number', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="12345"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">شماره ثبت / صکو در تذکره</p>
                                    </div>
                                </div>
                            </SectionCard>

                            {/* 3. اطلاعات تکمیلی */}
                            <SectionCard
                                icon={Calendar}
                                iconColor="#10b981"
                                title="اطلاعات تکمیلی"
                                subtitle="سایر مشخصات فرد"
                                description="اطلاعات تکمیلی مانند تاریخ تولد، کد ملی و ..."
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            تاریخ تولد
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="date"
                                                value={data.birth_date}
                                                onChange={(e) => setData('birth_date', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            محل تولد
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.birth_place}
                                                onChange={(e) => setData('birth_place', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="کابل"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            کد ملی
                                        </label>
                                        <div className="relative">
                                            <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.national_code}
                                                onChange={(e) => setData('national_code', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="1234567890"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            شماره کارت پدر
                                        </label>
                                        <div className="relative">
                                            <Fingerprint className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.father_card_number}
                                                onChange={(e) => setData('father_card_number', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="شماره کارت تذکره پدر"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>

                            {/* 4. اطلاعات تماس */}
                            <SectionCard
                                icon={Phone}
                                iconColor="#f59e0b"
                                title="اطلاعات تماس"
                                subtitle="راه‌های ارتباطی"
                                description="اطلاعات تماس فرد برای پیگیری‌های بعدی"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            تلفن ثابت
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="021-12345678"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            تلفن همراه
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.mobile}
                                                onChange={(e) => setData('mobile', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="09123456789"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            آدرس
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="آدرس کامل محل سکونت"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            ایمیل
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`${inputClass} pr-9`}
                                                placeholder="example@mail.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>

                            {/* 5. تصویر اصلی تذکره */}
                            <SectionCard
                                icon={Shield}
                                iconColor="#ef4444"
                                title="تصویر اصلی تذکره"
                                subtitle="بارگذاری تصویر تذکره"
                                description="تصویر اسکن شده تذکره الکترونیکی برای تأیید نهایی"
                            >
                                <div className="space-y-4">
                                    {previewImage ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={previewImage}
                                                alt="پیش‌نمایش تذکره"
                                                className="max-h-48 rounded-lg border shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                                <p className="text-sm text-gray-500">
                                                    <span className="font-semibold">برای آپلود کلیک کنید</span>
                                                </p>
                                                <p className="text-xs text-gray-500">JPEG, PNG, PDF (حداکثر 5MB)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*,application/pdf"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    )}
                                </div>
                            </SectionCard>

                            {/* 6. ضمیمه‌های اضافی */}
                            <SectionCard
                                icon={Paperclip}
                                iconColor="#8b5cf6"
                                title="ضمیمه‌های اضافی"
                                subtitle="بارگذاری فایل‌های اضافی"
                                description="اسناد و مدارک مرتبط با تذکره"
                            >
                                <div className="space-y-4">
                                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors">
                                        <Plus className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-600">افزودن فایل</span>
                                        <input type="file" multiple className="hidden" onChange={handleAddAttachment} />
                                    </label>

                                    {attachments.length > 0 && (
                                        <div className="space-y-2">
                                            {attachments.map((att, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Paperclip className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{att.file_name}</span>
                                                        <span className="text-xs text-gray-400">({formatFileSize(att.file_size)})</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAttachment(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </SectionCard>

                            {/* 7. وضعیت (فقط برای ویرایش) */}
                            {isEdit && (
                                <SectionCard
                                    icon={CheckCircle}
                                    iconColor="#10b981"
                                    title="وضعیت تأیید"
                                    subtitle="تعیین وضعیت تذکره"
                                    description="وضعیت نهایی تذکره پس از بررسی"
                                >
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {STATUS_OPTIONS.map(opt => {
                                                const Icon = opt.icon;
                                                const isSelected = data.status === opt.value;

                                                return (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setData('status', opt.value)}
                                                        className={`relative p-4 rounded-xl border-2 text-right transition-all ${isSelected
                                                            ? `border-${opt.value === 'approved' ? 'emerald' : opt.value === 'pending' ? 'amber' : 'red'}-400 bg-${opt.value === 'approved' ? 'emerald' : opt.value === 'pending' ? 'amber' : 'red'}-50`
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${isSelected
                                                                ? `bg-${opt.value === 'approved' ? 'emerald' : opt.value === 'pending' ? 'amber' : 'red'}-100`
                                                                : 'bg-gray-100'
                                                                }`}>
                                                                <Icon className={`h-4 w-4 ${isSelected
                                                                    ? `text-${opt.value === 'approved' ? 'emerald' : opt.value === 'pending' ? 'amber' : 'red'}-600`
                                                                    : 'text-gray-500'
                                                                    }`} />
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm font-bold ${isSelected
                                                                    ? `text-${opt.value === 'approved' ? 'emerald' : opt.value === 'pending' ? 'amber' : 'red'}-700`
                                                                    : 'text-gray-700'
                                                                    }`}>{opt.label}</p>
                                                            </div>
                                                        </div>
                                                        {isSelected && (
                                                            <CheckCircle className={`absolute top-3 left-3 h-5 w-5 text-${opt.value === 'approved' ? 'emerald' : opt.value === 'pending' ? 'amber' : 'red'}-500`} />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                                            <textarea
                                                value={data.notes}
                                                onChange={e => setData('notes', e.target.value)}
                                                rows={3}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="توضیحات اضافی در مورد تأیید یا رد تذکره..."
                                            />
                                        </div>
                                    </div>
                                </SectionCard>
                            )}

                            {/* دکمه‌های اقدام */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 z-20 rounded-lg shadow-lg">
                                <div className="flex gap-3 max-w-5xl mx-auto">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                                    >
                                        <Save className="h-4 w-4" />
                                        {processing ? 'در حال ذخیره...' : (isEdit ? 'ویرایش تذکره' : 'ثبت تذکره')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.get('/tazkira')}
                                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
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