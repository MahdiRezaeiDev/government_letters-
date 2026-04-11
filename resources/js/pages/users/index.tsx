// resources/js/pages/users/index.tsx

import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import { register } from '@/routes';
import type { User, PaginatedResponse, Organization, Role } from '@/types';

interface Props {
    users: PaginatedResponse<User>;
    filters: {
        search?: string;
        status?: string;
        organization_id?: string;
        role?: string;
    };
    organizations: Organization[];
    roles: { name: string; label: string }[];
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
        assign_role: boolean;
    };
}

export default function UsersIndex({ users, filters, organizations, roles, can }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedOrganization, setSelectedOrganization] = useState(filters.organization_id || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => {
        router.get(
            route('users.index'),
            {
                search: searchTerm,
                status: selectedStatus,
                organization_id: selectedOrganization,
                role: selectedRole,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedOrganization('');
        setSelectedRole('');
        router.get(route('users.index'), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`آیا از حذف کاربر "${name}" اطمینان دارید؟`)) {
            router.delete(route('users.destroy', { user: id }));
        }
    };

    const statusColors: Record<string, string> = {
        active: 'bg-green-100 text-green-700',
        inactive: 'bg-gray-100 text-gray-700',
        suspended: 'bg-red-100 text-red-700',
    };

    const statusLabels: Record<string, string> = {
        active: 'فعال',
        inactive: 'غیرفعال',
        suspended: 'تعلیق',
    };

    const roleLabels: Record<string, string> = {
        'super-admin': 'ادمین کل',
        'org-admin': 'ادمین سازمان',
        'dept-manager': 'مدیر دپارتمان',
        user: 'کاربر',
    };

    return (
        <>
            <Head title="مدیریت کاربران" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">مدیریت کاربران</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            مدیریت کاربران سیستم، تعیین نقش و دسترسی‌ها
                        </p>
                    </div>
                    {can.create && (
                        <Link
                            href={route('users.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition"
                        >
                            <Plus className="ml-2 h-4 w-4" />
                            کاربر جدید
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <Filter className="h-4 w-4" />
                            فیلترها
                            <ChevronLeft className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-0' : 'rotate-180'}`} />
                        </button>
                    </div>
                    
                    {showFilters && (
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">جستجو</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            placeholder="نام، ایمیل، کد ملی..."
                                            className="w-full pr-10 pl-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">همه</option>
                                        <option value="active">فعال</option>
                                        <option value="inactive">غیرفعال</option>
                                        <option value="suspended">تعلیق</option>
                                    </select>
                                </div>
                                {organizations.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">سازمان</label>
                                        <select
                                            value={selectedOrganization}
                                            onChange={(e) => setSelectedOrganization(e.target.value)}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">همه</option>
                                            {organizations.map((org) => (
                                                <option key={org.id} value={org.id}>{org.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {roles.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">نقش</label>
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">همه</option>
                                            {roles.map((role) => (
                                                <option key={role.name} value={role.name}>{role.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    پاک کردن فیلترها
                                </button>
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    اعمال فیلتر
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کاربر</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ایمیل</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام کاربری</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سازمان</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نقش</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            کاربری یافت نشد
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                                                        {user.first_name[0]}{user.last_name[0]}
                                                    </div>
                                                    <div className="mr-3">
                                                        <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                                                        <p className="text-xs text-gray-500">{user.national_code}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.organization?.name || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.roles.map((role) => (
                                                    <span key={role.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                                                        {roleLabels[role.name] || role.name}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                                                    {statusLabels[user.status]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2 space-x-reverse">
                                                {can.edit && (
                                                    <Link
                                                        href={route('users.edit', { user: user.id })}
                                                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        ویرایش
                                                    </Link>
                                                )}
                                                {can.delete && user.roles[0]?.name !== 'super-admin' && (
                                                    <button
                                                        onClick={() => handleDelete(user.id, user.full_name)}
                                                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 mr-3"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        حذف
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                نمایش {users.from} تا {users.to} از {users.total} نتیجه
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={users.current_page > 1 ? route('users.index', { page: users.current_page - 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${users.current_page > 1 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                    قبلی
                                </Link>
                                {(() => {
                                    const pages = [];
                                    const maxVisible = 5;
                                    let start = Math.max(1, users.current_page - Math.floor(maxVisible / 2));
                                    let end = Math.min(users.last_page, start + maxVisible - 1);
                                    
                                    if (end - start + 1 < maxVisible) {
                                        start = Math.max(1, end - maxVisible + 1);
                                    }
                                    
                                    for (let i = start; i <= end; i++) {
                                        pages.push(i);
                                    }
                                    
                                    return pages.map((page) => (
                                        <Link
                                            key={page}
                                            href={route('users.index', { page, ...filters })}
                                            className={`px-3 py-1 rounded-lg text-sm ${users.current_page === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </Link>
                                    ));
                                })()}
                                <Link
                                    href={users.current_page < users.last_page ? route('users.index', { page: users.current_page + 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${users.current_page < users.last_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                    بعدی
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}