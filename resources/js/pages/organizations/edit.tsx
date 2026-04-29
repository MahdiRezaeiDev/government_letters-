import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Building2, Mail, Phone, MapPin, Globe,
    CheckCircle, AlertCircle, Upload, Trash2, Eye, Image
} from 'lucide-react';
import { useState } from 'react';
import FieldLabel from '@/components/ui/FieldLabel';
import InputField from '@/components/ui/InputField';
import organizationsRoute from '@/routes/organizations';
import type { Organization } from '@/types';

interface Props {
    organization: Organization;
    organizations?: Organization[];
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function OrganizationsEdit({ organization }: Props) {
    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: organization.name,
        code: organization.code,
        email: organization.email || '',
        phone: organization.phone || '',
        address: organization.address || '',
        website: organization.website || '',
        parent_id: organization.parent_id?.toString() || '',
        status: organization.status,
        logo: null as File | null,
        _method: 'PUT',
    });

    const [logoPreview, setLogoPreview] = useState<string>(organization.logo_url || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(organizationsRoute.update({ organization: organization.id }).url, {
            preserveScroll: true,
        });
    };

    const [isLogoChanged, setIsLogoChanged] = useState(false);


    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('حجم فایل نباید بیشتر از 2 مگابایت باشد');

            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

        if (!allowedTypes.includes(file.type)) {
            alert('فرمت فایل باید JPEG، PNG، JPG یا GIF باشد');

            return;
        }

        setData('logo', file);
        setIsLogoChanged(true);
        clearErrors('logo');

        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = () => {
        setData('logo', null);
        setLogoPreview('');
        setIsLogoChanged(true);
    };

    const statusOptions = [
        { value: 'active', label: 'فعال', icon: CheckCircle },
        { value: 'inactive', label: 'غیرفعال', icon: AlertCircle },
    ];

    return (
        <>
            <Head title={`ویرایش وزارت - ${organization.name}`} />

            <div className="min-h-screen">
                {/* Header */}
                <div className=" max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className='bg-white border-b shadow-sm border-slate-200 px-4 py-3 rounded-lg mt-5'>
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-slate-900">ویرایش وزارت</h1>
                                    <p className="text-xs text-slate-500">{organization.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Form Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="org-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Main Content - Left Side (2 columns) */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Basic Information Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-900">اطلاعات پایه</h3>
                                    </div>
                                    <div className="p-6 space-y-5">

                                        {/* Organization Name */}
                                        <div>
                                            <FieldLabel required>نام وزارت</FieldLabel>
                                            <InputField
                                                icon={Building2}
                                                value={data.name}
                                                onChange={v => {
                                                    setData('name', v); clearErrors('name');
                                                }}
                                                error={errors.name}
                                                placeholder="نام وزارت را وارد کنید"
                                            />
                                        </div>

                                        {/* Organization Code (Read-only) */}
                                        <div>
                                            <FieldLabel required>کد وزارت</FieldLabel>
                                            <InputField
                                                icon={Globe}
                                                value={data.code}
                                                onChange={v => setData('code', v)}
                                                error={errors.code}
                                                placeholder="کد وزارت"
                                                readOnly
                                            />
                                        </div>

                                        {/* Email & Phone in a row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <FieldLabel>ایمیل</FieldLabel>
                                                <InputField
                                                    icon={Mail}
                                                    type="email"
                                                    value={data.email}
                                                    onChange={v => setData('email', v)}
                                                    error={errors.email}
                                                    placeholder="example@org.com"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>تلفن</FieldLabel>
                                                <InputField
                                                    icon={Phone}
                                                    value={data.phone}
                                                    onChange={v => setData('phone', v)}
                                                    error={errors.phone}
                                                    placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
                                                />
                                            </div>
                                        </div>

                                        {/* Website */}
                                        <div>
                                            <FieldLabel>وبسایت</FieldLabel>
                                            <InputField
                                                icon={Globe}
                                                type="url"
                                                value={data.website}
                                                onChange={v => setData('website', v)}
                                                error={errors.website}
                                                placeholder="https://example.com"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <FieldLabel>آدرس</FieldLabel>
                                            <InputField
                                                icon={MapPin}
                                                value={data.address}
                                                onChange={v => setData('address', v)}
                                                placeholder="آدرس کامل وزارت را وارد کنید"
                                                textarea
                                                rows={3}
                                                error={errors.address}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Status Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-900">وضعیت وزارت</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex gap-3">
                                            {statusOptions.map((option) => {
                                                const Icon = option.icon;
                                                const isActive = data.status === option.value;

                                                return (
                                                    <label
                                                        key={option.value}
                                                        className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${isActive
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="status"
                                                            value={option.value}
                                                            checked={isActive}
                                                            onChange={() => setData('status', option.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-100' : 'bg-slate-100'
                                                            }`}>
                                                            <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'
                                                                }`} />
                                                        </div>
                                                        <div>
                                                            <p className={`font-medium text-sm ${isActive ? 'text-blue-700' : 'text-slate-700'
                                                                }`}>
                                                                {option.label}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                {option.value === 'active' ? 'وزارت فعال و در دسترس' : 'وزارت غیرفعال شده'}
                                                            </p>
                                                        </div>
                                                        {isActive && (
                                                            <CheckCircle className="h-5 w-5 text-blue-600 mr-auto" />
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Right Side (1 column) */}
                            <div className="space-y-6">

                                {/* Logo Upload Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-24">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-900">لوگوی وزارت</h3>
                                    </div>
                                    <div className="p-6">
                                        {errors.logo && (
                                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                                                <p className="text-sm text-red-600">{errors.logo}</p>
                                            </div>
                                        )}

                                        {/* Logo Preview */}
                                        {logoPreview ? (
                                            <div className="space-y-4">
                                                <div className="relative aspect-square rounded-lg border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50">
                                                    <img
                                                        src={logoPreview}
                                                        alt="پیش‌نمایش لوگو"
                                                        className="w-full h-full object-contain p-4"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer transition-colors">
                                                        <Upload className="h-4 w-4" />
                                                        تغییر لوگو
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg,image/png,image/jpg,image/gif"
                                                            onChange={handleLogoChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveLogo}
                                                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        حذف
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all">
                                                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                                    <Image className="h-8 w-8 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-600 mb-1">آپلود لوگو</p>
                                                <p className="text-xs text-slate-400 text-center">
                                                    فرمت‌های JPG، PNG یا GIF<br />
                                                    حداکثر حجم: ۲ مگابایت
                                                </p>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/jpg,image/gif"
                                                    onChange={handleLogoChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                        {organization.logo_url && !isLogoChanged && (
                                            <div className="mt-3 pt-3 border-t border-slate-100">
                                                <p className="text-xs text-slate-400">لوگوی فعلی حفظ خواهد شد</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Organization Info Card */}
                                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                                    <h4 className="text-sm font-semibold text-slate-800 mb-3">اطلاعات فعلی</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">کد:</span>
                                            <span className="font-mono text-slate-700">{organization.code}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">وضعیت:</span>
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${organization.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${organization.status === 'active' ? 'bg-green-500' : 'bg-slate-400'
                                                    }`}></span>
                                                {organization.status === 'active' ? 'فعال' : 'غیرفعال'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">آخرین بروزرسانی:</span>
                                            <span className="text-slate-700 text-xs">
                                                {new Date(organization.updated_at).toLocaleDateString('fa-Af')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Fixed Bottom Actions */}
                        <div className="mt-5 rounded-lg bg-white border shadow-sm border-slate-200 p-4 z-20">
                            <div className="flex gap-3 max-w-5xl mx-auto">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.get(organizationsRoute.index())}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}