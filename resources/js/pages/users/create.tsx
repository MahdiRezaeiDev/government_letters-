import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Save, X, Eye, EyeOff, Building2, Users, Briefcase, Shield, Mail, Phone, User, Key, Award, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import users, { create as UserCreate } from '@/routes/users';
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

    // Load departments based on selected organization
    useEffect(() => {
        if (data.organization_id) {
            router.get('/users/departments-by-organization', 
                { organization_id: data.organization_id },
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        setDepartments(page.props.departments as Department[]);
                    }
                }
            );
        }
    }, [data.organization_id]);

    // Load positions based on selected department
    useEffect(() => {
        if (data.department_id) {
            router.get('/users/positions-by-department',
                { department_id: data.department_id },
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        setPositions(page.props.positions as Position[]);
                    }
                }
            );
        }
    }, [data.department_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(UserCreate(), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
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
        { value: 'active', label: 'فعال', color: 'emerald', icon: CheckCircle, description: 'کاربر فعال و قابل استفاده است' },
        { value: 'inactive', label: 'غیرفعال', color: 'gray', icon: AlertCircle, description: 'کاربر غیرفعال و دسترسی ندارد' },
        { value: 'suspended', label: 'تعلیق', color: 'red', icon: AlertCircle, description: 'کاربر به طور موقت تعلیق شده است' },
    ];

    const securityLevels = [
        { value: 'public', label: 'عمومی', color: 'gray', description: 'دسترسی به اطلاعات عمومی' },
        { value: 'internal', label: 'داخلی', color: 'blue', description: 'دسترسی به اطلاعات داخلی سازمان' },
        { value: 'confidential', label: 'محرمانه', color: 'amber', description: 'دسترسی به اطلاعات محرمانه' },
        { value: 'secret', label: 'سری', color: 'red', description: 'دسترسی به اطلاعات سری و حساس' },
    ];

    const selectedOrganization = organizations.find(org => org.id === data.organization_id);

    return (
        <>
            <Head title="ایجاد کاربر جدید" />

            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">ایجاد کاربر جدید</h1>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                اطلاعات کاربر را در فرم زیر وارد کنید
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.get(users.index())}
                                        className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <X className="ml-2 h-4 w-4" />
                                        انصراف
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2.5 bg-linear-to-r from-cyan-600 to-cyan-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="ml-2 h-4 w-4" />
                                        {processing ? 'در حال ثبت...' : 'ایجاد کاربر'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Form Sections */}
                        <div className="space-y-6">
                            {/* Personal Information Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-cyan-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات شخصی</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">مشخصات هویتی کاربر</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نام <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.first_name}
                                                    onChange={(e) => setData('first_name', e.target.value)}
                                                    onBlur={() => handleBlur('first_name')}
                                                    placeholder="علی"
                                                    className={`w-full pr-9 pl-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('first_name')
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:ring-cyan-500 focus:border-cyan-500'
                                                    }`}
                                                />
                                            </div>
                                            {getFieldError('first_name') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.first_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نام خانوادگی <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.last_name}
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                onBlur={() => handleBlur('last_name')}
                                                placeholder="رضایی"
                                                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                                    getFieldError('last_name')
                                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                        : 'border-gray-200 focus:ring-cyan-500 focus:border-cyan-500'
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                کد ملی <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.national_code}
                                                onChange={(e) => setData('national_code', e.target.value)}
                                                onBlur={() => handleBlur('national_code')}
                                                maxLength={10}
                                                placeholder="1234567890"
                                                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all font-mono ${
                                                    getFieldError('national_code')
                                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                        : 'border-gray-200 focus:ring-cyan-500 focus:border-cyan-500'
                                                }`}
                                            />
                                            {getFieldError('national_code') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.national_code}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                تلفن همراه
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={data.mobile}
                                                    onChange={(e) => setData('mobile', e.target.value)}
                                                    placeholder="09123456789"
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-emerald-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات حساب کاربری</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">اطلاعات ورود به سیستم</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نام کاربری <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.username}
                                                    onChange={(e) => setData('username', e.target.value)}
                                                    onBlur={() => handleBlur('username')}
                                                    placeholder="ali.rezaei"
                                                    className={`w-full pr-9 pl-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('username')
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:ring-cyan-500 focus:border-cyan-500'
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ایمیل <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    onBlur={() => handleBlur('email')}
                                                    placeholder="ali@example.com"
                                                    className={`w-full pr-9 pl-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('email')
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:ring-cyan-500 focus:border-cyan-500'
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                رمز عبور <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    onBlur={() => handleBlur('password')}
                                                    placeholder="********"
                                                    className={`w-full pr-9 pl-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('password')
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:ring-cyan-500 focus:border-cyan-500'
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                تکرار رمز عبور <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="********"
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                کد پرسنلی
                                            </label>
                                            <input
                                                type="text"
                                                value={data.employment_code}
                                                onChange={(e) => setData('employment_code', e.target.value)}
                                                placeholder="EMP001"
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Organizational Information Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">اطلاعات سازمانی</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">ساختار سازمانی کاربر</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سازمان <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.organization_id}
                                                    onChange={(e) => setData('organization_id', parseInt(e.target.value))}
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none bg-white"
                                                >
                                                    {organizations.map(org => (
                                                        <option key={org.id} value={org.id}>{org.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                            {selectedOrganization && (
                                                <p className="text-xs text-gray-500 mt-1">کاربر به سازمان {selectedOrganization.name} اضافه می‌شود</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                دپارتمان
                                            </label>
                                            <div className="relative">
                                                <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.department_id || ''}
                                                    onChange={(e) => setData('department_id', parseInt(e.target.value) || null)}
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none bg-white"
                                                >
                                                    <option value="">انتخاب کنید...</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سمت اصلی
                                            </label>
                                            <div className="relative">
                                                <Award className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select
                                                    value={data.primary_position_id || ''}
                                                    onChange={(e) => setData('primary_position_id', parseInt(e.target.value) || null)}
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none bg-white"
                                                    disabled={!data.department_id}
                                                >
                                                    <option value="">انتخاب کنید...</option>
                                                    {positions.map(pos => (
                                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                            {!data.department_id && (
                                                <p className="text-xs text-amber-600 mt-1">ابتدا دپارتمان را انتخاب کنید</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                کد پرسنلی
                                            </label>
                                            <input
                                                type="text"
                                                value={data.employment_code}
                                                onChange={(e) => setData('employment_code', e.target.value)}
                                                placeholder="EMP001"
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status & Security Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-amber-600" />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">وضعیت و امنیت</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">تعیین سطح دسترسی و وضعیت کاربر</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Status Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">وضعیت کاربر</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                                            <div className={`p-2 rounded-lg ${
                                                                isSelected ? `bg-${option.color}-100` : 'bg-gray-100'
                                                            }`}>
                                                                <Icon className={`h-4 w-4 ${
                                                                    isSelected ? `text-${option.color}-600` : 'text-gray-500'
                                                                }`} />
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm font-medium ${
                                                                    isSelected ? `text-${option.color}-900` : 'text-gray-900'
                                                                }`}>
                                                                    {option.label}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-0.5">
                                                                    {option.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Security Clearance */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">سطح امنیتی</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {securityLevels.map((level) => {
                                                const isSelected = data.security_clearance === level.value;

                                                return (
                                                    <button
                                                        key={level.value}
                                                        type="button"
                                                        onClick={() => setData('security_clearance', level.value as any)}
                                                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                                                            isSelected
                                                                ? `border-${level.color}-500 bg-${level.color}-50`
                                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                        }`}
                                                    >
                                                        <p className={`text-sm font-medium ${
                                                            isSelected ? `text-${level.color}-700` : 'text-gray-700'
                                                        }`}>
                                                            {level.label}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {level.description}
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Role Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            نقش کاربری <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <select
                                                value={data.role}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none bg-white"
                                            >
                                                {roles.map(role => (
                                                    <option key={role.name} value={role.name}>
                                                        {roleLabels[role.name] || role.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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

                            {/* Form Actions for Mobile */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:hidden">
                                <button
                                    type="button"
                                    onClick={() => router.get(users.index())}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                                >
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2.5 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'در حال ثبت...' : 'ایجاد کاربر'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}