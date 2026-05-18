// resources/js/pages/tazkira/form.tsx

import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    User, Hash, BookOpen, Layers, FileText, Grid, Calendar, MapPin, Phone, Mail,
    CheckCircle, AlertCircle, Save, X, Users, Fingerprint, Shield, Upload, Eye, Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import SectionCard from '@/components/ui/SectionCard';
import InputField from '@/components/ui/InputField';
import FieldLabel from '@/components/ui/FieldLabel';
import SelectField from '@/components/ui/SelectField';

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

export default function TazkiraForm({ tazkira, isEdit = false }: Props) {
    const { data, setData, processing, post, put, errors, reset } = useForm({
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            const value = data[key as keyof typeof data];
            if (value !== null && value !== undefined) {
                formData.append(key, value as string);
            }
        });

        if (tazkiraImage) {
            formData.append('tazkira_image', tazkiraImage);
        }

        if (removeImage) {
            formData.append('remove_image', '1');
        }

        if (isEdit && tazkira?.id) {
            formData.append('_method', 'PUT');
            post(`/tazkira/${tazkira.id}`, {
                data: formData,
                preserveScroll: true,
                onSuccess: () => router.get('/tazkira'),
            });
        } else {
            post('/tazkira', {
                data: formData,
                preserveScroll: true,
                onSuccess: () => router.get('/tazkira'),
            });
        }
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

    return (
        <>
            <Head title={isEdit ? 'ویرایش تذکره' : 'ثبت تذکره جدید'} />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* Header */}
                            <div className="flex items-center justify-between">
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
                                        <FieldLabel required>نام</FieldLabel>
                                        <InputField
                                            value={data.first_name}
                                            onChange={v => setData('first_name', v)}
                                            error={errors.first_name}
                                            placeholder="علی"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel required>تخلص</FieldLabel>
                                        <InputField
                                            value={data.last_name}
                                            onChange={v => setData('last_name', v)}
                                            error={errors.last_name}
                                            placeholder="رضایی"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel>نام پدر</FieldLabel>
                                        <InputField
                                            icon={Users}
                                            value={data.father_name}
                                            onChange={v => setData('father_name', v)}
                                            error={errors.father_name}
                                            placeholder="محمد"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">نام پدر شخص مطابق تذکره</p>
                                    </div>
                                    <div>
                                        <FieldLabel>نام پدر کلان</FieldLabel>
                                        <InputField
                                            icon={Users}
                                            value={data.grandfather_name}
                                            onChange={v => setData('grandfather_name', v)}
                                            error={errors.grandfather_name}
                                            placeholder="احمد"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">نام پدر بزرگ شخص</p>
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
                                        <FieldLabel required>شماره تذکره</FieldLabel>
                                        <InputField
                                            icon={Hash}
                                            value={data.tazkira_number}
                                            onChange={v => setData('tazkira_number', v)}
                                            error={errors.tazkira_number}
                                            placeholder="123456789"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel>جلد</FieldLabel>
                                        <InputField
                                            icon={BookOpen}
                                            value={data.volume}
                                            onChange={v => setData('volume', v)}
                                            error={errors.volume}
                                            placeholder="1"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">شماره جلد تذکره</p>
                                    </div>
                                    <div>
                                        <FieldLabel>صفحه</FieldLabel>
                                        <InputField
                                            icon={FileText}
                                            value={data.page}
                                            onChange={v => setData('page', v)}
                                            error={errors.page}
                                            placeholder="10"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">شماره صفحه تذکره</p>
                                    </div>
                                    <div>
                                        <FieldLabel>صکو / شماره ثبت</FieldLabel>
                                        <InputField
                                            icon={Grid}
                                            value={data.registration_number}
                                            onChange={v => setData('registration_number', v)}
                                            error={errors.registration_number}
                                            placeholder="12345"
                                        />
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
                                        <FieldLabel>تاریخ تولد</FieldLabel>
                                        <InputField
                                            icon={Calendar}
                                            type="date"
                                            value={data.birth_date}
                                            onChange={v => setData('birth_date', v)}
                                            error={errors.birth_date}
                                            placeholder="1365-01-01"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel>محل تولد</FieldLabel>
                                        <InputField
                                            icon={MapPin}
                                            value={data.birth_place}
                                            onChange={v => setData('birth_place', v)}
                                            error={errors.birth_place}
                                            placeholder="کابل"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel>کد ملی</FieldLabel>
                                        <InputField
                                            icon={Hash}
                                            value={data.national_code}
                                            onChange={v => setData('national_code', v)}
                                            error={errors.national_code}
                                            placeholder="1234567890"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel>شماره کارت پدر</FieldLabel>
                                        <InputField
                                            icon={Fingerprint}
                                            value={data.father_card_number}
                                            onChange={v => setData('father_card_number', v)}
                                            error={errors.father_card_number}
                                            placeholder="شماره کارت تذکره پدر"
                                        />
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
                                        <FieldLabel>تلفن ثابت</FieldLabel>
                                        <InputField
                                            icon={Phone}
                                            value={data.phone}
                                            onChange={v => setData('phone', v)}
                                            error={errors.phone}
                                            placeholder="021-12345678"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel>تلفن همراه</FieldLabel>
                                        <InputField
                                            icon={Phone}
                                            value={data.mobile}
                                            onChange={v => setData('mobile', v)}
                                            error={errors.mobile}
                                            placeholder="09123456789"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FieldLabel>آدرس</FieldLabel>
                                        <InputField
                                            icon={MapPin}
                                            value={data.address}
                                            onChange={v => setData('address', v)}
                                            error={errors.address}
                                            placeholder="آدرس کامل محل سکونت"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FieldLabel>ایمیل</FieldLabel>
                                        <InputField
                                            icon={Mail}
                                            type="email"
                                            value={data.email}
                                            onChange={v => setData('email', v)}
                                            error={errors.email}
                                            placeholder="example@mail.com"
                                        />
                                    </div>
                                </div>
                            </SectionCard>

                            {/* 5. تصویر تذکره */}
                            <SectionCard
                                icon={Shield}
                                iconColor="#ef4444"
                                title="تصویر تذکره"
                                subtitle="بارگذاری تصویر تذکره"
                                description="تصویر اسکن شده تذکره الکترونیکی برای تأیید نهایی"
                            >
                                <div className="space-y-4">
                                    {previewImage ? (
                                        <div className="relative">
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
                                        <div className="flex items-center justify-center w-full">
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
                                        </div>
                                    )}
                                </div>
                            </SectionCard>

                            {/* 6. وضعیت (فقط برای ویرایش) */}
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
                                            <FieldLabel>توضیحات</FieldLabel>
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