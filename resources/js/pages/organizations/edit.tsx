// resources/js/pages/organizations/edit.tsx

import { Head, Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { 
    Save, X, Building2, Trash2, Mail, Phone, MapPin, Globe, Link2, 
    ChevronDown, CheckCircle, AlertCircle, Eye, Sparkles, 
    Hash, TrendingUp, Shield, Clock, Users, Database,
    AlertTriangle, Info
} from 'lucide-react';
import React, { useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import organizationsRoutes from '@/routes/organizations';
import type { Organization } from '@/types';

interface Props {
    organization: Organization;
    organizations: Organization[];
}

export default function OrganizationsEdit({ organization, organizations }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: organization.name,
        code: organization.code,
        email: organization.email || '',
        phone: organization.phone || '',
        address: organization.address || '',
        website: organization.website || '',
        parent_id: organization.parent_id?.toString() || '',
        status: organization.status,
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'advanced'>('basic');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(organizationsRoutes.update({ organization: organization.id }), {
            preserveScroll: true,
        });
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field: string) => {
        return touched[field] && errors[field] ? errors[field] : null;
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(organizationsRoutes.destroy({ organization: organization.id }), {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
            },
        });
    };

    const statusOptions = [
        { value: 'active', label: 'فعال', color: 'emerald', icon: CheckCircle, description: 'سازمان فعال و قابل استفاده است', gradient: 'from-emerald-500 to-teal-600' },
        { value: 'inactive', label: 'غیرفعال', color: 'gray', icon: AlertCircle, description: 'سازمان غیرفعال و در دسترس نیست', gradient: 'from-gray-500 to-slate-600' },
    ];

    const tabs = [
        { id: 'basic', label: 'اطلاعات پایه', icon: Building2 },
        { id: 'contact', label: 'اطلاعات تماس', icon: Mail },
        { id: 'advanced', label: 'تنظیمات پیشرفته', icon: Shield },
    ];

    const stats = [
        { label: 'شناسه', value: organization.id, icon: Hash },
        { label: 'تاریخ ایجاد', value: new Date(organization.created_at).toLocaleDateString('fa-IR'), icon: Clock },
        { label: 'تاریخ ویرایش', value: new Date(organization.updated_at).toLocaleDateString('fa-IR'), icon: TrendingUp },
        { label: 'زیرمجموعه‌ها', value: organization.children?.length || 0, icon: Database },
    ];

    const selectedStatus = statusOptions.find(s => s.value === data.status);
    const StatusIcon = selectedStatus?.icon;

    return (
        <>
            <Head title={`ویرایش سازمان - ${organization.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        {/* Header Section */}
                        <div className="mb-8 animate-fade-in">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-50"></div>
                                            <div className="relative p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                                <Building2 className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">ویرایش سازمان</h1>
                                            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                                <Sparkles className="h-3 w-3 text-blue-500" />
                                                در حال ویرایش {organization.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={organizationsRoutes.show({ organization: organization.id })}
                                        className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <Eye className="ml-2 h-4 w-4" />
                                        مشاهده
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => router.get(organizationsRoutes.index())}
                                        className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <X className="ml-2 h-4 w-4" />
                                        انصراف
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="ml-2 h-4 w-4" />
                                        {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-up">
                            {stats.map((stat, index) => (
                                <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <stat.icon className="h-4 w-4" />
                                        <span className="text-xs">{stat.label}</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-6 animate-slide-up">
                            <nav className="flex gap-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                                            activeTab === tab.id
                                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Form Sections */}
                        <div className="space-y-6">
                            {/* Basic Information Tab */}
                            {activeTab === 'basic' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">اطلاعات پایه</h2>
                                                <p className="text-sm text-gray-500 mt-0.5">اطلاعات اصلی سازمان</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    نام سازمان <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        onBlur={() => handleBlur('name')}
                                                        className={`w-full pr-9 pl-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                                                            getFieldError('name')
                                                                ? 'border-red-300 focus:ring-red-500'
                                                                : 'border-gray-200 focus:ring-blue-500'
                                                        }`}
                                                    />
                                                </div>
                                                {getFieldError('name') && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    کد سازمان <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={data.code}
                                                        onChange={(e) => setData('code', e.target.value)}
                                                        onBlur={() => handleBlur('code')}
                                                        className={`w-full pr-9 pl-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                                                            getFieldError('code')
                                                                ? 'border-red-300 focus:ring-red-500'
                                                                : 'border-gray-200 focus:ring-blue-500'
                                                        }`}
                                                    />
                                                </div>
                                                {getFieldError('code') && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.code}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                آدرس
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                                <textarea
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    rows={3}
                                                    placeholder="آدرس کامل سازمان..."
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سازمان والد
                                            </label>
                                            <div className="relative">
                                                <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.parent_id}
                                                    onChange={(e) => setData('parent_id', e.target.value)}
                                                    className="w-full pr-9 pl-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white"
                                                >
                                                    <option value="">بدون والد</option>
                                                    {organizations
                                                        .filter(org => org.id !== organization.id)
                                                        .map(org => (
                                                            <option key={org.id} value={org.id}>{org.name}</option>
                                                        ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contact Information Tab */}
                            {activeTab === 'contact' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-5 w-5 text-emerald-600" />
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">اطلاعات تماس</h2>
                                                <p className="text-sm text-gray-500 mt-0.5">راه‌های ارتباطی با سازمان</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ایمیل
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        placeholder="info@organization.com"
                                                        className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    تلفن
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={data.phone}
                                                        onChange={(e) => setData('phone', e.target.value)}
                                                        placeholder="021-12345678"
                                                        className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                وبسایت
                                            </label>
                                            <div className="relative">
                                                <Globe className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="url"
                                                    value={data.website}
                                                    onChange={(e) => setData('website', e.target.value)}
                                                    placeholder="https://www.example.com"
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Advanced Settings Tab */}
                            {activeTab === 'advanced' && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Status Section */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-5 w-5 text-amber-600" />
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-900">وضعیت سازمان</h2>
                                                    <p className="text-sm text-gray-500 mt-0.5">تعیین وضعیت فعال یا غیرفعال سازمان</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {statusOptions.map((option) => {
                                                    const Icon = option.icon;
                                                    const isSelected = data.status === option.value;

                                                    return (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => setData('status', option.value)}
                                                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-right ${
                                                                isSelected
                                                                    ? `border-${option.color}-500 bg-${option.color}-50 shadow-md`
                                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2 rounded-lg ${
                                                                        isSelected ? `bg-${option.color}-100` : 'bg-gray-100'
                                                                    }`}>
                                                                        <Icon className={`h-5 w-5 ${
                                                                            isSelected ? `text-${option.color}-600` : 'text-gray-500'
                                                                        }`} />
                                                                    </div>
                                                                    <div>
                                                                        <p className={`font-medium ${
                                                                            isSelected ? `text-${option.color}-900` : 'text-gray-900'
                                                                        }`}>
                                                                            {option.label}
                                                                        </p>
                                                                        <p className={`text-xs mt-0.5 ${
                                                                            isSelected ? `text-${option.color}-600` : 'text-gray-500'
                                                                        }`}>
                                                                            {option.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {isSelected && (
                                                                    <CheckCircle className={`h-5 w-5 text-${option.color}-500`} />
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current Status Info */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
                                        <div className="flex items-start gap-3">
                                            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-blue-800">وضعیت فعلی سازمان</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {StatusIcon && <StatusIcon className={`h-4 w-4 ${selectedStatus?.color === 'emerald' ? 'text-emerald-600' : 'text-gray-500'}`} />}
                                                    <span className={`text-sm font-medium ${selectedStatus?.color === 'emerald' ? 'text-emerald-700' : 'text-gray-600'}`}>
                                                        {selectedStatus?.label}
                                                    </span>
                                                    <span className="text-xs text-blue-600">•</span>
                                                    <span className="text-xs text-blue-600">
                                                        آخرین بروزرسانی: {new Date(organization.updated_at).toLocaleDateString('fa-IR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete Section */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                                <div>
                                                    <h2 className="text-lg font-semibold text-red-900">منطقه خطر</h2>
                                                    <p className="text-sm text-red-600 mt-0.5">عملیات حذف سازمان - این عمل غیرقابل بازگشت است</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                                                <div className="flex items-start gap-3">
                                                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-red-800">هشدار!</p>
                                                        <p className="text-sm text-red-700 mt-1">
                                                            با حذف سازمان "{organization.name}"، تمام دپارتمان‌ها، کاربران و اطلاعات مرتبط با این سازمان نیز حذف خواهند شد.
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDeleteModal(true)}
                                                            className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all shadow-sm"
                                                        >
                                                            <Trash2 className="ml-2 h-4 w-4" />
                                                            حذف سازمان
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions for Mobile */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:hidden">
                                <button
                                    type="button"
                                    onClick={() => router.get(organizationsRoutes.index())}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                                >
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                .animate-slide-up {
                    animation: slideUp 0.5s ease-out;
                }
            `}</style>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="حذف سازمان"
                    message="آیا از حذف این سازمان اطمینان دارید؟"
                    itemName={organization.name}
                    type="organization"
                    isLoading={deleting}
                />
            )}
        </>
    );
}