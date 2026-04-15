import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Info } from 'lucide-react';
import {
    Save, X, Building2, ChevronDown, Layers, Hash,
    CheckCircle, AlertCircle, FolderTree, Sparkles,
    Shield
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import departments from '@/routes/departments';
import type { Organization, Department } from '@/types';

interface Props {
    organizations: Organization[];
    parentDepartments: Department[];
    selectedOrganization?: number;
}

export default function DepartmentsCreate({ organizations, parentDepartments, selectedOrganization }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        organization_id: selectedOrganization || organizations[0]?.id || '',
        name: '',
        code: '',
        parent_id: '',
        status: 'active',
    });

    const [availableParentDepts, setAvailableParentDepts] = useState<Department[]>(parentDepartments);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [selectedOrgName, setSelectedOrgName] = useState('');
    const [loadingParents, setLoadingParents] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

    // Update parent departments list when organization changes
    useEffect(() => {
        if (data.organization_id) {
            const selectedOrg = organizations.find(org => org.id === Number(data.organization_id));
            setSelectedOrgName(selectedOrg?.name || '');

            setLoadingParents(true);
            fetch(`/departments-list?organization_id=${data.organization_id}`)
                .then(response => response.json())
                .then(data => {                    
                    setAvailableParentDepts(data);
                    setLoadingParents(false);
                })
                .catch(() => setLoadingParents(false));
        }
    }, [data.organization_id, organizations]);

    // Show preview when form has basic info
    useEffect(() => {
        if (data.name && data.code) {
            setShowPreview(true);
        } else {
            setShowPreview(false);
        }
    }, [data.name, data.code]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(departments.store(), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field: string) => {
        return touched[field] && errors[field] ? errors[field] : null;
    };

    const statusOptions = [
        { value: 'active', label: 'فعال', color: 'emerald', icon: CheckCircle, description: 'دپارتمان فعال و قابل استفاده است', gradient: 'from-emerald-500 to-teal-600' },
        { value: 'inactive', label: 'غیرفعال', color: 'gray', icon: AlertCircle, description: 'دپارتمان غیرفعال و در دسترس نیست', gradient: 'from-gray-500 to-slate-600' },
    ];

    const tabs = [
        { id: 'basic', label: 'اطلاعات پایه', icon: FolderTree },
        { id: 'advanced', label: 'تنظیمات پیشرفته', icon: Shield },
    ];

    const selectedStatus = statusOptions.find(s => s.value === data.status);
    const StatusIcon = selectedStatus?.icon;

    const getRandomGradient = () => {
        const gradients = [
            'from-indigo-500 to-purple-600',
            'from-blue-500 to-cyan-600',
            'from-emerald-500 to-teal-600',
            'from-amber-500 to-orange-600',
            'from-rose-500 to-pink-600',
        ];

        return gradients[Math.floor(Math.random() * gradients.length)];
    };

    return (
        <>
            <Head title="ایجاد دپارتمان جدید" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        {/* Header Section */}
                        <div className="mb-8 animate-fade-in">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                                            <div className="relative p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                                <Layers className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">ایجاد دپارتمان جدید</h1>
                                            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                                <Sparkles className="h-3 w-3 text-indigo-500" />
                                                اطلاعات دپارتمان را در فرم زیر وارد کنید
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.get(departments.index())}
                                        className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <X className="ml-2 h-4 w-4" />
                                        انصراف
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="ml-2 h-4 w-4" />
                                        {processing ? 'در حال ذخیره...' : 'ایجاد دپارتمان'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-6 animate-slide-up">
                            <nav className="flex gap-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === tab.id
                                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30'
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
                                            <FolderTree className="h-5 w-5 text-indigo-600" />
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">اطلاعات پایه</h2>
                                                <p className="text-sm text-gray-500 mt-0.5">اطلاعات اصلی دپارتمان</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        {/* Organization Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سازمان <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.organization_id}
                                                    onChange={(e) => setData('organization_id', e.target.value)}
                                                    onBlur={() => handleBlur('organization_id')}
                                                    className={`w-full pr-9 pl-8 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${getFieldError('organization_id')
                                                            ? 'border-red-300 focus:ring-red-500'
                                                            : 'border-gray-200 focus:ring-indigo-500'
                                                        }`}
                                                >
                                                    {organizations.map(org => (
                                                        <option key={org.id} value={org.id}>{org.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                            {getFieldError('organization_id') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.organization_id}
                                                </p>
                                            )}
                                            {selectedOrgName && !getFieldError('organization_id') && (
                                                <div className="mt-2 flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 p-2 rounded-lg">
                                                    <Building2 className="h-3 w-3" />
                                                    در حال ایجاد دپارتمان برای سازمان {selectedOrgName}
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {/* Department Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    نام دپارتمان <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <FolderTree className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        onBlur={() => handleBlur('name')}
                                                        placeholder="مثال: اداره مالی"
                                                        className={`w-full pr-9 pl-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${getFieldError('name')
                                                                ? 'border-red-300 focus:ring-red-500'
                                                                : 'border-gray-200 focus:ring-indigo-500'
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

                                            {/* Department Code */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    کد دپارتمان <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={data.code}
                                                        onChange={(e) => setData('code', e.target.value)}
                                                        onBlur={() => handleBlur('code')}
                                                        placeholder="مثال: FIN-001"
                                                        className={`w-full pr-9 pl-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${getFieldError('code')
                                                                ? 'border-red-300 focus:ring-red-500'
                                                                : 'border-gray-200 focus:ring-indigo-500'
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

                                        {/* Parent Department */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                دپارتمان والد
                                            </label>
                                            <div className="relative">
                                                <Layers className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.parent_id}
                                                    onChange={(e) => setData('parent_id', e.target.value)}
                                                    className="w-full pr-9 pl-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none bg-white disabled:bg-gray-50"
                                                    disabled={loadingParents || availableParentDepts?.length === 0}
                                                >
                                                    <option value="">بدون والد (دپارتمان سطح اول)</option>
                                                    {availableParentDepts.map(dept => (
                                                        <option key={dept.id} value={dept.id}>
                                                            {dept.name} {dept.code && `(${dept.code})`}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                {loadingParents && (
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                        <div className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                            {availableParentDepts.length === 0 && data.organization_id && !loadingParents && (
                                                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    هیچ دپارتمان والدی برای این سازمان وجود ندارد. این دپارتمان به عنوان دپارتمان سطح اول ایجاد می‌شود.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Advanced Settings Tab */}
                            {activeTab === 'advanced' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-amber-600" />
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">وضعیت دپارتمان</h2>
                                                <p className="text-sm text-gray-500 mt-0.5">تعیین وضعیت فعال یا غیرفعال دپارتمان</p>
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
                                                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-right ${isSelected
                                                                ? `border-${option.color}-500 bg-${option.color}-50 shadow-md`
                                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg ${isSelected ? `bg-${option.color}-100` : 'bg-gray-100'
                                                                    }`}>
                                                                    <Icon className={`h-5 w-5 ${isSelected ? `text-${option.color}-600` : 'text-gray-500'
                                                                        }`} />
                                                                </div>
                                                                <div>
                                                                    <p className={`font-medium ${isSelected ? `text-${option.color}-900` : 'text-gray-900'
                                                                        }`}>
                                                                        {option.label}
                                                                    </p>
                                                                    <p className={`text-xs mt-0.5 ${isSelected ? `text-${option.color}-600` : 'text-gray-500'
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

                                        {/* Current Status Info */}
                                        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 bg-indigo-100 rounded-lg">
                                                    <Info className="h-4 w-4 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-indigo-800">وضعیت انتخابی</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {StatusIcon && <StatusIcon className={`h-4 w-4 ${selectedStatus?.color === 'emerald' ? 'text-emerald-600' : 'text-gray-500'}`} />}
                                                        <span className={`text-sm font-medium ${selectedStatus?.color === 'emerald' ? 'text-emerald-700' : 'text-gray-600'}`}>
                                                            {selectedStatus?.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Information Preview */}
                            {showPreview && (
                                <div className={`bg-gradient-to-r ${getRandomGradient()} rounded-xl p-4 animate-fade-in`}>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                                            <Layers className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">خلاصه اطلاعات دپارتمان</p>
                                            <div className="flex flex-wrap gap-3 mt-1 text-xs text-white/90">
                                                <span className="inline-flex items-center gap-1">
                                                    <FolderTree className="h-3 w-3" />
                                                    نام: {data.name}
                                                </span>
                                                <span>•</span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Hash className="h-3 w-3" />
                                                    کد: {data.code}
                                                </span>
                                                {data.parent_id && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="inline-flex items-center gap-1">
                                                            <Layers className="h-3 w-3" />
                                                            والد: {availableParentDepts.find(d => d.id === Number(data.parent_id))?.name}
                                                        </span>
                                                    </>
                                                )}
                                                <span>•</span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Building2 className="h-3 w-3" />
                                                    سازمان: {selectedOrgName}
                                                </span>
                                            </div>
                                        </div>
                                        <CheckCircle className="h-5 w-5 text-white/80" />
                                    </div>
                                </div>
                            )}

                            {/* Form Actions for Mobile */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:hidden">
                                <button
                                    type="button"
                                    onClick={() => router.get(departments.index())}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                                >
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'در حال ذخیره...' : 'ایجاد دپارتمان'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
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
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-slide-up {
                    animation: slideUp 0.5s ease-out;
                }
            `}</style>
        </>
    );
}
