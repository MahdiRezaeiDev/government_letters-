import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal, UserCheck, UserX, UserCog, Building2, Mail, Shield, Users, Award, X } from 'lucide-react';
import React, { useState } from 'react';
import  register  from '@/routes/register';
import usersRoute from '@/routes/users';
import type { User, PaginatedResponse, Organization, Role } from '@/types';
import organizationsRoute from '@/routes/organizations';

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
            usersRoute.index(),
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
        router.get(usersRoute.index(), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`آیا از حذف کاربر "${name}" اطمینان دارید؟`)) {
            router.delete(usersRoute.destroy({ user: id }));
        }
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string; text: string; icon: any }> = {
        active: { 
            label: 'فعال', 
            color: 'emerald', 
            bg: 'bg-emerald-50', 
            text: 'text-emerald-700',
            icon: UserCheck
        },
        inactive: { 
            label: 'غیرفعال', 
            color: 'gray', 
            bg: 'bg-gray-50', 
            text: 'text-gray-600',
            icon: UserX
        },
        suspended: { 
            label: 'تعلیق', 
            color: 'red', 
            bg: 'bg-red-50', 
            text: 'text-red-700',
            icon: UserCog
        },
    };

    const roleColors: Record<string, { bg: string; text: string }> = {
        'super-admin': { bg: 'bg-purple-100', text: 'text-purple-700' },
        'org-admin': { bg: 'bg-blue-100', text: 'text-blue-700' },
        'dept-manager': { bg: 'bg-amber-100', text: 'text-amber-700' },
        user: { bg: 'bg-gray-100', text: 'text-gray-600' },
    };

    const roleLabels: Record<string, string> = {
        'super-admin': 'ادمین کل',
        'org-admin': 'ادمین سازمان',
        'dept-manager': 'مدیر دپارتمان',
        user: 'کاربر عادی',
    };

    const hasActiveFilters = filters.search || filters.status || filters.organization_id || filters.role;

    // Statistics
    const stats = {
        total: users.total,
        active: users.data.filter(u => u.status === 'active').length,
        suspended: users.data.filter(u => u.status === 'suspended').length,
        organizations: new Set(users.data.map(u => u.organization_id)).size,
    };

    return (
        <>
            <Head title="مدیریت کاربران" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">مدیریت کاربران</h1>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            مدیریت کاربران سیستم، تعیین نقش و دسترسی‌ها
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {can.create && (
                                <Link
                                    href={usersRoute.create()}
                                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <Plus className="ml-2 h-4 w-4" />
                                    کاربر جدید
                                </Link>
                            )}
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">کل کاربران</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-3 bg-cyan-50 rounded-lg">
                                        <Users className="h-6 w-6 text-cyan-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">کاربران فعال</p>
                                        <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                                    </div>
                                    <div className="p-3 bg-emerald-50 rounded-lg">
                                        <UserCheck className="h-6 w-6 text-emerald-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">کاربران تعلیق شده</p>
                                        <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
                                    </div>
                                    <div className="p-3 bg-red-50 rounded-lg">
                                        <UserCog className="h-6 w-6 text-red-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">سازمان‌ها</p>
                                        <p className="text-2xl font-bold text-purple-600">{stats.organizations}</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <Building2 className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters Bar */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-5">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                placeholder="جستجو بر اساس نام، ایمیل، کد ملی..."
                                                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                                showFilters || hasActiveFilters
                                                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                                                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Filter className="ml-2 h-4 w-4" />
                                            فیلترها
                                            {hasActiveFilters && (
                                                <span className="mr-2 w-1.5 h-1.5 bg-cyan-600 rounded-full"></span>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSearch}
                                            className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all shadow-sm"
                                        >
                                            جستجو
                                        </button>
                                    </div>
                                </div>

                                {/* Extended Filters */}
                                {showFilters && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                >
                                                    <option value="">همه وضعیت‌ها</option>
                                                    <option value="active">فعال</option>
                                                    <option value="inactive">غیرفعال</option>
                                                    <option value="suspended">تعلیق</option>
                                                </select>
                                            </div>
                                            {organizations.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">سازمان</label>
                                                    <select
                                                        value={selectedOrganization}
                                                        onChange={(e) => setSelectedOrganization(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                    >
                                                        <option value="">همه سازمان‌ها</option>
                                                        {organizations.map((org) => (
                                                            <option key={org.id} value={org.id}>{org.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {roles.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">نقش</label>
                                                    <select
                                                        value={selectedRole}
                                                        onChange={(e) => setSelectedRole(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                    >
                                                        <option value="">همه نقش‌ها</option>
                                                        {roles.map((role) => (
                                                            <option key={role.name} value={role.name}>{role.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={handleReset}
                                                className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                <X className="ml-1 h-4 w-4" />
                                                پاک کردن همه فیلترها
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کاربر</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ایمیل</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سازمان</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نقش</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {users.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Users className="h-12 w-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500 font-medium">هیچ کاربری یافت نشد</p>
                                                        <p className="text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                                        {hasActiveFilters && (
                                                            <button
                                                                onClick={handleReset}
                                                                className="mt-4 text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                                                            >
                                                                پاک کردن فیلترها
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            users.data.map((user) => {
                                                const status = statusConfig[user.status] || statusConfig.inactive;
                                                const StatusIcon = status.icon;
                                                const userRole = user.roles?.[0];
                                                const roleStyle = userRole ? roleColors[userRole.name] || roleColors.user : roleColors.user;
                                                
                                                return (
                                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-medium shadow-sm">
                                                                    {user.name?.[0]}{user.last_name?.[0]}
                                                                </div>
                                                                <div className="mr-3">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {user.full_name || `${user.name} ${user.last_name}`}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <code className="text-xs text-gray-500 font-mono">
                                                                            {user.national_code}
                                                                        </code>
                                                                        <span className="text-xs text-gray-300">•</span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {user.username}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1">
                                                                <Mail className="h-3 w-3 text-gray-400" />
                                                                <span className="text-sm text-gray-600">{user.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {user.organization ? (
                                                                <Link
                                                                    href={organizationsRoute.show( { organization: user.organization.id })}
                                                                    className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-cyan-600 transition-colors"
                                                                >
                                                                    <Building2 className="h-3 w-3" />
                                                                    {user.organization.name}
                                                                </Link>
                                                            ) : (
                                                                <span className="text-sm text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {userRole ? (
                                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
                                                                    <Shield className="h-3 w-3" />
                                                                    {roleLabels[userRole.name] || userRole.name}
                                                                </span>
                                                            ) : (
                                                                <span className="text-sm text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                                                <StatusIcon className="h-3 w-3" />
                                                                {status.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            <div className="flex items-center gap-2">
                                                                {can.edit && (
                                                                    <Link
                                                                        href={usersRoute.edit({ user: user.id })}
                                                                        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                                                        title="ویرایش"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Link>
                                                                )}
                                                                {can.delete && userRole?.name !== 'super-admin' && (
                                                                    <button
                                                                        onClick={() => handleDelete(user.id, user.full_name || `${user.name} ${user.last_name}`)}
                                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                        title="حذف"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {users.last_page > 1 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        نمایش <span className="font-medium">{users.from}</span> تا{' '}
                                        <span className="font-medium">{users.to}</span> از{' '}
                                        <span className="font-medium">{users.total}</span> نتیجه
                                    </div>
                                    <div className="flex gap-1.5">
                                        <Link
                                            href={users.current_page > 1 ? usersRoute.index({query: { page: users.current_page - 1, ...filters }}) : '#'}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                users.current_page > 1
                                                    ? 'text-gray-700 hover:bg-white hover:text-cyan-600'
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                        {(() => {
                                            const pages = [];
                                            const maxVisible = 5;
                                            let start = Math.max(1, users.current_page - Math.floor(maxVisible / 2));
                                            let end = Math.min(users.last_page, start + maxVisible - 1);
                                            
                                            if (end - start + 1 < maxVisible) {
                                                start = Math.max(1, end - maxVisible + 1);
                                            }
                                            
                                            if (start > 1) {
                                                pages.push(
                                                    <Link
                                                        key={1}
                                                        href={usersRoute.index({query: { page: 1, ...filters }})}
                                                        className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:text-cyan-600 transition-colors"
                                                    >
                                                        1
                                                    </Link>
                                                );

                                                if (start > 2) {
                                                    pages.push(<span key="dots1" className="px-2 text-gray-400">...</span>);
                                                }
                                            }
                                            
                                            for (let i = start; i <= end; i++) {
                                                pages.push(
                                                    <Link
                                                        key={i}
                                                        href={usersRoute.index({query: { page: i, ...filters }})}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                            users.current_page === i
                                                                ? 'bg-cyan-600 text-white shadow-sm'
                                                                : 'text-gray-700 hover:bg-white hover:text-cyan-600'
                                                        }`}
                                                    >
                                                        {i}
                                                    </Link>
                                                );
                                            }
                                            
                                            if (end < users.last_page) {
                                                if (end < users.last_page - 1) {
                                                    pages.push(<span key="dots2" className="px-2 text-gray-400">...</span>);
                                                }

                                                pages.push(
                                                    <Link
                                                        key={users.last_page}
                                                        href={usersRoute.index({query: { page: users.last_page, ...filters }})}
                                                        className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:text-cyan-600 transition-colors"
                                                    >
                                                        {users.last_page}
                                                    </Link>
                                                );
                                            }
                                            
                                            return pages;
                                        })()}
                                        <Link
                                            href={users.current_page < users.last_page ? usersRoute.index({query: { page: users.current_page + 1, ...filters }}) : '#'}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                users.current_page < users.last_page
                                                    ? 'text-gray-700 hover:bg-white hover:text-cyan-600'
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}