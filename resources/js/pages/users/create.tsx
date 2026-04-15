// resources/js/pages/users/create.tsx

import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { 
    Save, X, Eye, EyeOff, Building2, Users, Briefcase, Shield, 
    Mail, Phone, User, Key, Award, AlertCircle, CheckCircle, 
    ChevronDown, Loader2, CreditCard, Hash, Globe, Lock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import users from '@/routes/users';
import type { Organization, Department, Position, Role } from '@/types';

interface Props {
    organizations: Organization[];
    departments: Department[];
    positions: Position[];
    roles: Role[];
    myOrganizationId: number | null;
}

interface FormData {
    organization_id: number;
    department_id: number | null;
    primary_position_id: number | null;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
    national_code: string;
    mobile: string;
    employment_code: string;
    status: 'active' | 'inactive' | 'suspended';
    security_clearance: 'public' | 'internal' | 'confidential' | 'secret';
    role: string;
}

export default function UsersCreate({
    organizations, departments: initialDepartments, positions: initialPositions,
    roles, myOrganizationId
}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
    const [positions, setPositions] = useState<Position[]>(initialPositions);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadingPositions, setLoadingPositions] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        organization_id: myOrganizationId || organizations[0]?.id || 0,
        department_id: null,
        primary_position_id: null,
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
        national_code: '',
        mobile: '',
        employment_code: '',
        status: 'active',
        security_clearance: 'internal',
        role: 'user',
    });

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field: string) => {
        return touched[field] && errors[field] ? errors[field] : null;
    };

    // بارگذاری دپارتمان‌ها
    useEffect(() => {
        if (data.organization_id) {
            setLoadingDepts(true);
            fetch(`/users/departments-by-organization?organization_id=${data.organization_id}`)
                .then(res => res.json())
                .then(data => {
                    setDepartments(data.departments);
                    setLoadingDepts(false);
                })
                .catch(() => setLoadingDepts(false));
        }
    }, [data.organization_id]);

    // بارگذاری پست‌ها
    useEffect(() => {
        if (data.department_id) {
            setLoadingPositions(true);
            fetch(`/users/positions-by-department?department_id=${data.department_id}`)
                .then(res => res.json())
                .then(data => {
                    setPositions(data.positions);
                    setLoadingPositions(false);
                })
                .catch(() => setLoadingPositions(false));
        } else {
            setPositions([]);
        }
    }, [data.department_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(users.store(), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                router.get(users.index());
            },
        });
    };

    const roleLabels: Record<string, string> = {
        'super-admin': 'ادمین کل',
        'org-admin': 'ادمین سازمان',
        'dept-manager': 'مدیر دپارتمان',
        user: 'کاربر عادی',
    };

    const statusOptions = [
        { value: 'active', label: 'فعال', color: 'emerald', icon: CheckCircle, desc: 'کاربر فعال و قابل استفاده' },
        { value: 'inactive', label: 'غیرفعال', color: 'gray', icon: AlertCircle, desc: 'کاربر غیرفعال شده' },
        { value: 'suspended', label: 'تعلیق', color: 'red', icon: AlertCircle, desc: 'دسترسی موقتاً قطع شده' },
    ];

    const securityLevels = [
        { value: 'public', label: 'عمومی', color: 'slate', icon: Globe },
        { value: 'internal', label: 'داخلی', color: 'blue', icon: Shield },
        { value: 'confidential', label: 'محرمانه', color: 'amber', icon: Lock },
        { value: 'secret', label: 'سری', color: 'red', icon: Shield },
    ];

    return (
        <>
            <Head title="ایجاد کاربر جدید" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        {/* هدر با کارت گرادیان */}
                        <div className="relative mb-8 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white rounded-full blur-3xl" />
                                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white rounded-full blur-3xl" />
                            </div>
                            <div className="relative px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                                        <Users className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white">ایجاد کاربر جدید</h1>
                                        <p className="text-blue-100 text-sm mt-0.5">اطلاعات کاربر را در فرم زیر وارد کنید</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.get(users.index())}
                                        className="px-5 py-2.5 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
                                    >
                                        <X className="inline ml-2 h-4 w-4" />
                                        انصراف
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 bg-white text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="inline ml-2 h-4 w-4" />
                                        {processing ? 'در حال ثبت...' : 'ایجاد کاربر'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* کارت اطلاعات شخصی */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات شخصی</h2>
                                            <p className="text-sm text-gray-500">مشخصات هویتی کاربر</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                نام <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.first_name}
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                onBlur={() => handleBlur('first_name')}
                                                placeholder="علی"
                                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                                    getFieldError('first_name')
                                                        ? 'border-red-300 focus:ring-red-500'
                                                        : 'border-gray-200 focus:ring-blue-500'
                                                }`}
                                            />
                                            {getFieldError('first_name') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.first_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                نام خانوادگی <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.last_name}
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                onBlur={() => handleBlur('last_name')}
                                                placeholder="رضایی"
                                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                                    getFieldError('last_name')
                                                        ? 'border-red-300 focus:ring-red-500'
                                                        : 'border-gray-200 focus:ring-blue-500'
                                                }`}
                                            />
                                            {getFieldError('last_name') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.last_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                کد ملی <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Hash className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.national_code}
                                                    onChange={(e) => setData('national_code', e.target.value)}
                                                    maxLength={10}
                                                    placeholder="1234567890"
                                                    className={`w-full pr-11 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('national_code')
                                                            ? 'border-red-300 focus:ring-red-500'
                                                            : 'border-gray-200 focus:ring-blue-500'
                                                    }`}
                                                />
                                            </div>
                                            {getFieldError('national_code') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.national_code}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                تلفن همراه
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={data.mobile}
                                                    onChange={(e) => setData('mobile', e.target.value)}
                                                    placeholder="09123456789"
                                                    className="w-full pr-11 pl-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* کارت اطلاعات حساب کاربری */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                            <Key className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات حساب کاربری</h2>
                                            <p className="text-sm text-gray-500">اطلاعات ورود به سیستم</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                نام کاربری <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <User className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.username}
                                                    onChange={(e) => setData('username', e.target.value)}
                                                    onBlur={() => handleBlur('username')}
                                                    placeholder="ali.rezaei"
                                                    className={`w-full pr-11 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('username')
                                                            ? 'border-red-300 focus:ring-red-500'
                                                            : 'border-gray-200 focus:ring-blue-500'
                                                    }`}
                                                />
                                            </div>
                                            {getFieldError('username') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.username}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                ایمیل <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    onBlur={() => handleBlur('email')}
                                                    placeholder="ali@example.com"
                                                    className={`w-full pr-11 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('email')
                                                            ? 'border-red-300 focus:ring-red-500'
                                                            : 'border-gray-200 focus:ring-blue-500'
                                                    }`}
                                                />
                                            </div>
                                            {getFieldError('email') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                رمز عبور <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    onBlur={() => handleBlur('password')}
                                                    placeholder="********"
                                                    className={`w-full pr-4 pl-11 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('password')
                                                            ? 'border-red-300 focus:ring-red-500'
                                                            : 'border-gray-200 focus:ring-blue-500'
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {getFieldError('password') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                تکرار رمز عبور <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="********"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* کارت اطلاعات سازمانی */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Building2 className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات سازمانی</h2>
                                            <p className="text-sm text-gray-500">ساختار سازمانی کاربر</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                سازمان <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.organization_id}
                                                    onChange={(e) => setData('organization_id', parseInt(e.target.value))}
                                                    className="w-full pr-11 pl-4 py-2.5 border border-gray-200 rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {organizations.map(org => (
                                                        <option key={org.id} value={org.id}>{org.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                دپارتمان
                                            </label>
                                            <div className="relative">
                                                <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.department_id || ''}
                                                    onChange={(e) => setData('department_id', parseInt(e.target.value) || null)}
                                                    className="w-full pr-11 pl-4 py-2.5 border border-gray-200 rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                                    disabled={loadingDepts}
                                                >
                                                    <option value="">انتخاب کنید...</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                {loadingDepts && (
                                                    <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                سمت اصلی
                                            </label>
                                            <div className="relative">
                                                <Award className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.primary_position_id || ''}
                                                    onChange={(e) => setData('primary_position_id', parseInt(e.target.value) || null)}
                                                    className="w-full pr-11 pl-4 py-2.5 border border-gray-200 rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                                    disabled={!data.department_id || loadingPositions}
                                                >
                                                    <option value="">انتخاب کنید...</option>
                                                    {positions.map(pos => (
                                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                {loadingPositions && (
                                                    <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                                                )}
                                            </div>
                                            {!data.department_id && (
                                                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    ابتدا دپارتمان را انتخاب کنید
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                کد پرسنلی
                                            </label>
                                            <div className="relative">
                                                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.employment_code}
                                                    onChange={(e) => setData('employment_code', e.target.value)}
                                                    placeholder="EMP001"
                                                    className="w-full pr-11 pl-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* کارت وضعیت و نقش */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-100 rounded-lg">
                                            <Shield className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">وضعیت و نقش</h2>
                                            <p className="text-sm text-gray-500">تعیین سطح دسترسی و وضعیت کاربر</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* وضعیت کاربر */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">وضعیت کاربر</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {statusOptions.map((option) => {
                                                const Icon = option.icon;
                                                const isSelected = data.status === option.value;
                                                return (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => setData('status', option.value as any)}
                                                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-right ${
                                                            isSelected
                                                                ? `border-${option.color}-500 bg-${option.color}-50`
                                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${isSelected ? `bg-${option.color}-100` : 'bg-gray-100'}`}>
                                                                <Icon className={`h-4 w-4 ${isSelected ? `text-${option.color}-600` : 'text-gray-500'}`} />
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm font-medium ${isSelected ? `text-${option.color}-700` : 'text-gray-900'}`}>
                                                                    {option.label}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
                                                            </div>
                                                        </div>
                                                        {isSelected && (
                                                            <CheckCircle className="absolute top-3 left-3 h-4 w-4 text-emerald-500" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* سطح امنیتی */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">سطح امنیتی</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {securityLevels.map((level) => {
                                                const Icon = level.icon;
                                                const isSelected = data.security_clearance === level.value;
                                                return (
                                                    <button
                                                        key={level.value}
                                                        type="button"
                                                        onClick={() => setData('security_clearance', level.value as any)}
                                                        className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                                                            isSelected
                                                                ? `border-${level.color}-500 bg-${level.color}-50`
                                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                        }`}
                                                    >
                                                        <Icon className={`h-5 w-5 ${isSelected ? `text-${level.color}-600` : 'text-gray-400'}`} />
                                                        <span className={`text-sm font-medium ${isSelected ? `text-${level.color}-700` : 'text-gray-700'}`}>
                                                            {level.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* نقش کاربری */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            نقش کاربری <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <select
                                                value={data.role}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="w-full pr-11 pl-4 py-2.5 border border-gray-200 rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {roles.map(role => (
                                                    <option key={role.name} value={role.name}>
                                                        {roleLabels[role.name] || role.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        {getFieldError('role') && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}