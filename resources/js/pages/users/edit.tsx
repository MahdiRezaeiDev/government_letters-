import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Eye, EyeOff, Building2, Users, Briefcase, Shield,
    Mail, Phone, UserIcon, Key, Award, AlertCircle, CheckCircle,
    ChevronDown, Loader2, CreditCard, Hash, Globe, Lock, Trash2, Clock, Ban
} from 'lucide-react';
import { useState, useEffect } from 'react';
import users from '@/routes/users';
import type { User, Organization, Department, Position, Role } from '@/types';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface Props {
    user: User;
    organizations: Organization[];
    departments: Department[];
    positions: Position[];
    roles: Role[];
    userRole: string;
    canEditRole: boolean;
}

interface FormData {
    organization_id: number;
    department_id: number | null;
    primary_position_id: number | null;
    username: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    first_name: string;
    last_name: string;
    national_code: string;
    mobile: string;
    employment_code: string;
    status: 'active' | 'inactive' | 'suspended';
    security_clearance: 'public' | 'internal' | 'confidential' | 'secret';
    role?: string;
}

export default function UsersEdit({
    user, organizations, departments: initialDepartments,
    positions: initialPositions, roles, userRole, canEditRole
}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
    const [positions, setPositions] = useState<Position[]>(initialPositions);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadingPositions, setLoadingPositions] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const { data, setData, put, processing, errors } = useForm<FormData>({
        organization_id: user.organization_id || 0,
        department_id: user.department_id,
        primary_position_id: user.primary_position_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        national_code: user.national_code,
        mobile: user.mobile || '',
        employment_code: user.employment_code || '',
        status: user.status,
        security_clearance: user.security_clearance,
        role: userRole,
    });

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field: string) => {
        return touched[field] && errors[field] ? errors[field] : null;
    };

    // بارگذاری دپارتمان‌ها بر اساس سازمان انتخاب شده
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

    // بارگذاری پست‌ها بر اساس دپارتمان انتخاب شده
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
        put(users.update({ user: user.id }), {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(users.destroy({ user: user.id }), {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
            },
        });
    };

    const handleAssignRole = (roleName: string) => {
        if (confirm(`آیا نقش کاربر به "${roleName}" تغییر کند؟`)) {
            router.post(users.assignRole({ user: user.id }), { role: roleName });
        }
    };

    const roleLabels: Record<string, string> = {
        'super-admin': 'ادمین کل',
        'org-admin': 'ادمین سازمان',
        'dept-manager': 'مدیر دپارتمان',
        user: 'کاربر عادی',
    };

    const statusOptions = [
        { value: 'active', label: 'فعال', color: 'emerald', icon: CheckCircle, desc: 'کاربر فعال و قابل استفاده' },
        { value: 'inactive', label: 'غیرفعال', color: 'gray', icon: Ban, desc: 'کاربر غیرفعال شده' },
        { value: 'suspended', label: 'تعلیق', color: 'red', icon: Clock, desc: 'دسترسی موقتاً قطع شده' },
    ];

    const securityLevels = [
        { value: 'public', label: 'عمومی', color: 'slate', icon: Globe },
        { value: 'internal', label: 'داخلی', color: 'blue', icon: Shield },
        { value: 'confidential', label: 'محرمانه', color: 'amber', icon: Lock },
        { value: 'secret', label: 'سری', color: 'red', icon: Shield },
    ];

    return (
        <>
            <Head title={`ویرایش کاربر - ${user.full_name}`} />

            <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        {/* هدر با کارت گرادیان */}
                        <div className="relative mb-8 overflow-hidden bg-linear-to-r from-amber-600 to-orange-700 rounded-2xl shadow-xl">
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
                                        <h1 className="text-2xl font-bold text-white">ویرایش کاربر</h1>
                                        <p className="text-amber-100 text-sm mt-0.5">{user.full_name} - {user.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-5 py-2.5 bg-red-500/20 backdrop-blur border border-red-500/30 rounded-xl text-sm font-medium text-white hover:bg-red-500/30 transition-all duration-200"
                                    >
                                        <Trash2 className="inline ml-2 h-4 w-4" />
                                        حذف کاربر
                                    </button>
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
                                        className="px-6 py-2.5 bg-white text-amber-700 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="inline ml-2 h-4 w-4" />
                                        {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* کارت اطلاعات شخصی */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <UserIcon className="h-5 w-5 text-blue-600" />
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
                                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${getFieldError('first_name')
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
                                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${getFieldError('last_name')
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
                                                    className={`w-full pr-11 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${getFieldError('national_code')
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
                                                    className="w-full pr-11 pl-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* کارت اطلاعات حساب کاربری */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
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
                                                <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.username}
                                                    onChange={(e) => setData('username', e.target.value)}
                                                    onBlur={() => handleBlur('username')}
                                                    className={`w-full pr-11 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${getFieldError('username')
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
                                                    className={`w-full pr-11 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${getFieldError('email')
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
                                                رمز عبور جدید
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={data.password || ''}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className="w-full pr-4 pl-11 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="در صورت تمایل رمز جدید وارد کنید"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                تکرار رمز عبور جدید
                                            </label>
                                            <input
                                                type="password"
                                                value={data.password_confirmation || ''}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                placeholder="تکرار رمز جدید"
                                            />
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
                                                    className="w-full pr-11 pl-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* کارت اطلاعات سازمانی */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
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
                                                سطح امنیتی
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {securityLevels.map((level) => {
                                                    const Icon = level.icon;
                                                    const isSelected = data.security_clearance === level.value;

                                                    return (
                                                        <button
                                                            key={level.value}
                                                            type="button"
                                                            onClick={() => setData('security_clearance', level.value as any)}
                                                            className={`py-2 px-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 justify-center ${isSelected
                                                                ? `border-${level.color}-500 bg-${level.color}-50 text-${level.color}-700`
                                                                : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                                                                }`}
                                                        >
                                                            <Icon className={`h-4 w-4 ${isSelected ? `text-${level.color}-500` : 'text-gray-400'}`} />
                                                            <span className="text-sm">{level.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                وضعیت
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {statusOptions.map((option) => {
                                                    const Icon = option.icon;
                                                    const isSelected = data.status === option.value;

                                                    return (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => setData('status', option.value as any)}
                                                            className={`py-2 px-2 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-1 ${isSelected
                                                                ? `border-${option.color}-500 bg-${option.color}-50`
                                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                                }`}
                                                        >
                                                            <Icon className={`h-4 w-4 ${isSelected ? `text-${option.color}-500` : 'text-gray-400'}`} />
                                                            <span className={`text-xs ${isSelected ? `text-${option.color}-700` : 'text-gray-600'}`}>
                                                                {option.label}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* نقش کاربری (فقط در صورت مجوز) */}
                            {canEditRole && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <Briefcase className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">نقش کاربری</h2>
                                                <p className="text-sm text-gray-500">تعیین سطح دسترسی کاربر</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {roles.map(role => (
                                                <button
                                                    key={role.name}
                                                    type="button"
                                                    onClick={() => handleAssignRole(role.name)}
                                                    className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 text-center ${data.role === role.name
                                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                                                        }`}
                                                >
                                                    <Shield className={`h-5 w-5 mx-auto mb-1 ${data.role === role.name ? 'text-orange-500' : 'text-gray-400'}`} />
                                                    <span className="text-sm font-medium">
                                                        {roleLabels[role.name] || role.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="حذف کاربر"
                    message="آیا از حذف این کاربر اطمینان دارید؟"
                    itemName={user.full_name}
                    type="user"
                    isLoading={deleting}
                />
            )}

        </>
    );
}