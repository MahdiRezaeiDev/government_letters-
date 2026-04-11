// resources/js/pages/users/edit.tsx

import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Save, X, Eye, EyeOff, Building2, Users, Briefcase, Shield, Trash2 } from 'lucide-react';
import type { User, Organization, Department, Position, Role } from '@/types';
import { update as UserUpdate } from '@/routes/users';

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

    // بارگذاری دپارتمان‌ها بر اساس سازمان انتخاب شده
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

    // بارگذاری پست‌ها بر اساس دپارتمان انتخاب شده
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
        put(UserUpdate({ user: user.id }), {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm(`آیا از حذف کاربر "${user.full_name}" اطمینان دارید؟`)) {
            router.delete(route('users.destroy', { user: user.id }));
        }
    };

    const handleAssignRole = (roleName: string) => {
        if (confirm(`آیا نقش کاربر به "${roleName}" تغییر کند؟`)) {
            router.post(route('users.assign-role', { user: user.id }), { role: roleName });
        }
    };

    const roleLabels: Record<string, string> = {
        'super-admin': 'ادمین کل',
        'org-admin': 'ادمین سازمان',
        'dept-manager': 'مدیر دپارتمان',
        user: 'کاربر عادی',
    };

    return (
        <>
            <Head title={`ویرایش کاربر - ${user.full_name}`} />

            <div className="max-w-4xl mx-auto py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">ویرایش کاربر</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {user.full_name} - {user.email}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.get(route('users.index'))}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                            >
                                <X className="ml-2 h-4 w-4" />
                                انصراف
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                <Save className="ml-2 h-4 w-4" />
                                {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                            </button>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        
                        {/* Personal Info */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                اطلاعات شخصی
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نام <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نام خانوادگی <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        کد ملی <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.national_code}
                                        onChange={(e) => setData('national_code', e.target.value)}
                                        maxLength={10}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.national_code && <p className="text-red-500 text-xs mt-1">{errors.national_code}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        تلفن همراه
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.mobile}
                                        onChange={(e) => setData('mobile', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-green-500" />
                                اطلاعات حساب کاربری
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نام کاربری <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ایمیل <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        رمز عبور جدید
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password || ''}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="در صورت تمایل رمز جدید وارد کنید"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        تکرار رمز عبور جدید
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation || ''}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="تکرار رمز جدید"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        کد پرسنلی
                                    </label>
                                    <input
                                        type="text"
                                        value={data.employment_code}
                                        onChange={(e) => setData('employment_code', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Organizational Info */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-purple-500" />
                                اطلاعات سازمانی
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        سازمان <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.organization_id}
                                        onChange={(e) => setData('organization_id', parseInt(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {organizations.map(org => (
                                            <option key={org.id} value={org.id}>{org.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        دپارتمان
                                    </label>
                                    <select
                                        value={data.department_id || ''}
                                        onChange={(e) => setData('department_id', parseInt(e.target.value) || null)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">انتخاب کنید...</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        سمت اصلی
                                    </label>
                                    <select
                                        value={data.primary_position_id || ''}
                                        onChange={(e) => setData('primary_position_id', parseInt(e.target.value) || null)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">انتخاب کنید...</option>
                                        {positions.map(pos => (
                                            <option key={pos.id} value={pos.id}>{pos.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        سطح امنیتی
                                    </label>
                                    <select
                                        value={data.security_clearance}
                                        onChange={(e) => setData('security_clearance', e.target.value as any)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="public">عمومی</option>
                                        <option value="internal">داخلی</option>
                                        <option value="confidential">محرمانه</option>
                                        <option value="secret">سری</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        وضعیت
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as any)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="active">فعال</option>
                                        <option value="inactive">غیرفعال</option>
                                        <option value="suspended">تعلیق</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Role */}
                        {canEditRole && (
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-orange-500" />
                                    نقش کاربری
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            نقش
                                        </label>
                                        <select
                                            value={data.role}
                                            onChange={(e) => handleAssignRole(e.target.value)}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {roles.map(role => (
                                                <option key={role.name} value={role.name}>
                                                    {roleLabels[role.name] || role.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}