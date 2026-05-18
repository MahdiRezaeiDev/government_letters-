// resources/js/pages/tazkira/index.tsx

import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    User, Hash, BookOpen, FileText, Grid, CheckCircle, AlertCircle,
    Save, X, Users, Fingerprint, Calendar, MapPin, Phone, Mail, Shield
} from 'lucide-react';
import { useState } from 'react';
import FieldLabel from '@/components/ui/FieldLabel';
import InputField from '@/components/ui/InputField';
import SectionCard from '@/components/ui/SectionCard';

interface Props {
    tazkira?: any;
    isEdit?: boolean;
}

const STATUS_OPTIONS = [
    { value: 'pending', label: 'در انتظار بررسی', icon: AlertCircle, color: '#f59e0b', bg: '#fffbeb' },
    { value: 'approved', label: 'تایید شده', icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
    { value: 'rejected', label: 'رد شده', icon: AlertCircle, color: '#ef4444', bg: '#fee2e2' },
];

export default function TazkiraForm({ tazkira, isEdit = false }: Props) {
    const { data, setData, processing, post, errors } = useForm({
        // معلومات شخصی
        first_name: tazkira?.first_name || '',
        last_name: tazkira?.last_name || '',
        father_name: tazkira?.father_name || '',
        grandfather_name: tazkira?.grandfather_name || '',

        // مشخصات تذکره
        tazkira_number: tazkira?.tazkira_number || '',
        volume: tazkira?.volume || '',        // جلد
        page: tazkira?.page || '',            // صفحه
        registration_number: tazkira?.registration_number || '', // صکو / شماره ثبت

        // اطلاعات اضافی
        birth_date: tazkira?.birth_date || '',
        birth_place: tazkira?.birth_place || '',
        national_code: tazkira?.national_code || '',
        father_card_number: tazkira?.father_card_number || '',

        // اطلاعات تماس
        phone: tazkira?.phone || '',
        mobile: tazkira?.mobile || '',
        address: tazkira?.address || '',
        email: tazkira?.email || '',

        // وضعیت
        status: tazkira?.status || 'pending',
        notes: tazkira?.notes || '',
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [tazkiraImage, setTazkiraImage] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key as keyof typeof data] as string);
        });

        if (tazkiraImage) {
            formData.append('tazkira_image', tazkiraImage);
        }

        if (isEdit && tazkira?.id) {
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

    return (
        <>
            <Head title={isEdit ? 'ویرایش تذکره' : 'ثبت تذکره جدید'} />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* ==================== 1. معلومات شخصی ==================== */}
                            <SectionCard
                                icon={User}
                                iconColor="#0ea5e9"
                                title="معلومات شخصی"
                                subtitle="مشخصات هویتی فرد"
                                description="اطلاعات کامل شخص مطابق تذکره الکترونیکی">

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
                                        <FieldLabel required>نام پدر</FieldLabel>
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
                                        <FieldLabel required>نام پدر کلان</FieldLabel>
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

                            {/* ==================== 2. مشخصات تذکره ==================== */}
                            <SectionCard
                                icon={Fingerprint}
                                iconColor="#8b5cf6"
                                title="مشخصات تذکره"
                                subtitle="اطلاعات تذکره الکترونیکی"
                                description="مشخصات اصلی تذکره شامل جلد، صفحه، صکو و شماره تذکره">

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
                                        <FieldLabel required>جلد</FieldLabel>
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
                                        <FieldLabel required>صفحه</FieldLabel>
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
                                        <FieldLabel required>صکو / شماره ثبت</FieldLabel>
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

                            {/* ==================== 3. اطلاعات تکمیلی ==================== */}
                            <SectionCard
                                icon={Calendar}
                                iconColor="#10b981"
                                title="اطلاعات تکمیلی"
                                subtitle="سایر مشخصات فرد"
                                description="اطلاعات تکمیلی مانند تاریخ تولد، کد ملی و ...">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <FieldLabel>تاریخ تولد</FieldLabel>
                                        <InputField
                                            icon={Calendar}
                                            type="date"
                                            value={data.birth_date}
                                            onChange={v => setData('birth_date', v)}
                                            error={errors.birth_date}
                                            placeholder="1365/01/01"
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

                            {/* ==================== 4. اطلاعات تماس ==================== */}
                            <SectionCard
                                icon={Phone}
                                iconColor="#f59e0b"
                                title="اطلاعات تماس"
                                subtitle="راه‌های ارتباطی"
                                description="اطلاعات تماس فرد برای پیگیری‌های بعدی">

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

                            {/* ==================== 5. آپلود تصویر تذکره ==================== */}
                            <SectionCard
                                icon={Shield}
                                iconColor="#ef4444"
                                title="تصویر تذکره"
                                subtitle="بارگذاری تصویر تذکره"
                                description="تصویر اسکن شده تذکره الکترونیکی برای تأیید نهایی">

                                <div className="space-y-4">
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">برای آپلود کلیک کنید</span>
                                                </p>
                                                <p className="text-xs text-gray-500">فرمت‌های مجاز: JPEG, PNG, PDF (حداکثر 5MB)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*,application/pdf"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>

                                    {previewImage && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">پیش‌نمایش تصویر:</p>
                                            <img src={previewImage} alt="پیش‌نمایش تذکره" className="max-h-48 rounded-lg border shadow-sm" />
                                        </div>
                                    )}
                                </div>
                            </SectionCard>

                            {/* ==================== 6. وضعیت ==================== */}
                            <SectionCard
                                icon={CheckCircle}
                                iconColor="#10b981"
                                title="وضعیت تأیید"
                                subtitle="تعیین وضعیت تذکره"
                                description="وضعیت نهایی تذکره پس از بررسی">

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
                                                        }`}>
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
                                        <FieldLabel>توضیحات (اختیاری)</FieldLabel>
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

                            {/* ==================== دکمه‌های اقدام ==================== */}
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