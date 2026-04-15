import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Briefcase, Layers, Hash, Award, FileText,
    AlertCircle, CheckCircle, TrendingUp, Shield, Star,
    Sparkles, Zap, Crown, Users, Building2, Info
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import positions from '@/routes/positions';
import type { Department } from '@/types';

interface Props {
    departments: Department[];
    selectedDepartment?: number;
}

export default function PositionsCreate({ departments, selectedDepartment }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        department_id: selectedDepartment || departments[0]?.id || '',
        name: '',
        code: '',
        level: 0,
        is_management: false,
        description: '',
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [selectedDeptName, setSelectedDeptName] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(positions.store(), {
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

    // Update selected department name when department changes
    useEffect(() => {
        const selectedDept = departments.find(d => d.id === Number(data.department_id));
        setSelectedDeptName(selectedDept?.name || '');
    }, [data.department_id, departments]);

    // Show preview when form has basic info
    useEffect(() => {
        if (data.name && data.code) {
            setShowPreview(true);
        } else {
            setShowPreview(false);
        }
    }, [data.name, data.code]);

    const getLevelLabel = (level: number) => {
        if (level === 0) {
            return { label: 'پایه', color: 'gray', icon: Users };
        }

        if (level === 1) {
            return { label: 'کارشناس', color: 'blue', icon: Shield };
        }

        if (level === 2) {
            return { label: 'کارشناس ارشد', color: 'emerald', icon: Star };
        }

        if (level === 3) {
            return { label: 'مدیر', color: 'amber', icon: Crown };
        }

        if (level === 4) {
            return { label: 'مدیر ارشد', color: 'orange', icon: Zap };
        }

        if (level >= 5) {
            return { label: `سطح ${level}`, color: 'purple', icon: TrendingUp };
        }

        return { label: `سطح ${level}`, color: 'gray', icon: TrendingUp };
    };

    const levelBadge = getLevelLabel(data.level);
    const LevelIcon = levelBadge.icon;

    return (
        <>
            <Head title="ایجاد سمت جدید" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl blur-lg opacity-50"></div>
                                            <div className="relative p-2.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                                <Briefcase className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">ایجاد سمت جدید</h1>
                                            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                                <Sparkles className="h-3 w-3 text-purple-500" />
                                                اطلاعات سمت سازمانی را در فرم زیر وارد کنید
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.get(positions.index())}
                                        className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <X className="ml-2 h-4 w-4" />
                                        انصراف
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 border border-transparent rounded-xl text-sm font-medium text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="ml-2 h-4 w-4" />
                                        {processing ? 'در حال ذخیره...' : 'ایجاد سمت'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Form Sections */}
                        <div className="space-y-6">
                            {/* Basic Information Section */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات پایه</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">اطلاعات اصلی سمت سازمانی</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-5">
                                    {/* Department Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            دپارتمان <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <select
                                                value={data.department_id}
                                                onChange={(e) => setData('department_id', e.target.value)}
                                                onBlur={() => handleBlur('department_id')}
                                                className={`w-full pr-9 pl-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${getFieldError('department_id')
                                                        ? 'border-red-300 focus:ring-red-500'
                                                        : 'border-gray-200 focus:ring-purple-500'
                                                    }`}
                                            >
                                                <option value="">انتخاب دپارتمان...</option>
                                                {departments.map(dept => (
                                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {getFieldError('department_id') && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.department_id}
                                            </p>
                                        )}
                                        {selectedDeptName && (
                                            <div className="mt-2 flex items-center gap-2 text-xs text-purple-600 bg-purple-50 p-2 rounded-lg">
                                                <Layers className="h-3 w-3" />
                                                ایجاد سمت برای دپارتمان {selectedDeptName}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Position Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نام سمت <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    onBlur={() => handleBlur('name')}
                                                    placeholder="مثال: مدیر مالی"
                                                    className={`w-full pr-9 pl-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${getFieldError('name')
                                                            ? 'border-red-300 focus:ring-red-500'
                                                            : 'border-gray-200 focus:ring-purple-500'
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

                                        {/* Position Code */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                کد سمت <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.code}
                                                    onChange={(e) => setData('code', e.target.value)}
                                                    onBlur={() => handleBlur('code')}
                                                    placeholder="مثال: FIN-MGR-001"
                                                    className={`w-full pr-9 pl-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${getFieldError('code')
                                                            ? 'border-red-300 focus:ring-red-500'
                                                            : 'border-gray-200 focus:ring-purple-500'
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Level */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سطح سمت
                                            </label>
                                            <div className="relative">
                                                <TrendingUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    value={data.level}
                                                    onChange={(e) => setData('level', parseInt(e.target.value) || 0)}
                                                    min="0"
                                                    max="10"
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                                />
                                            </div>
                                            <div className="mt-2 flex items-center gap-1.5">
                                                <LevelIcon className={`h-3.5 w-3.5 text-${levelBadge.color}-500`} />
                                                <span className={`text-xs text-${levelBadge.color}-600`}>
                                                    {levelBadge.label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                عدد بین 0 تا 10 - هرچه عدد بزرگتر، سطح بالاتر
                                            </p>
                                        </div>

                                        {/* Management Toggle */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نوع سمت
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setData('is_management', !data.is_management)}
                                                className={`relative w-full p-4 rounded-xl border-2 transition-all duration-200 text-right ${data.is_management
                                                        ? 'border-amber-500 bg-amber-50 shadow-sm'
                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${data.is_management ? 'bg-amber-100' : 'bg-gray-100'
                                                            }`}>
                                                            <Award className={`h-5 w-5 ${data.is_management ? 'text-amber-600' : 'text-gray-500'
                                                                }`} />
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-medium ${data.is_management ? 'text-amber-900' : 'text-gray-900'
                                                                }`}>
                                                                {data.is_management ? 'سمت مدیریتی' : 'سمت عادی'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {data.is_management
                                                                    ? 'دارای مسئولیت مدیریتی و تصمیم‌گیری'
                                                                    : 'سمت عملیاتی و اجرایی'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {data.is_management && (
                                                        <CheckCircle className="h-5 w-5 text-amber-500" />
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            توضیحات
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={4}
                                                placeholder="شرح وظایف، مسئولیت‌ها و اختیارات این سمت..."
                                                className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Information Preview */}
                            {showPreview && (
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-4 animate-fade-in">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Briefcase className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-purple-900">خلاصه اطلاعات</p>
                                            <div className="flex flex-wrap gap-3 mt-1 text-xs text-purple-700">
                                                <span className="inline-flex items-center gap-1">
                                                    <Briefcase className="h-3 w-3" />
                                                    نام: {data.name}
                                                </span>
                                                <span>•</span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Hash className="h-3 w-3" />
                                                    کد: {data.code}
                                                </span>
                                                {data.level > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="inline-flex items-center gap-1">
                                                            <TrendingUp className="h-3 w-3" />
                                                            سطح: {data.level} ({levelBadge.label})
                                                        </span>
                                                    </>
                                                )}
                                                {data.is_management && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="inline-flex items-center gap-1">
                                                            <Crown className="h-3 w-3" />
                                                            سمت مدیریتی
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            {selectedDeptName && (
                                                <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                                                    <Building2 className="h-3 w-3" />
                                                    دپارتمان: {selectedDeptName}
                                                </p>
                                            )}
                                        </div>
                                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                                    </div>
                                </div>
                            )}
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
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}