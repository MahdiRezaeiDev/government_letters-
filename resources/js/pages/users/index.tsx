// resources/js/pages/users/index.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight,
    UserCheck, UserX, UserCog, Building2, Mail, Shield, Users, X,
    TrendingUp, Award, Calendar, Clock, Star, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import organizationsRoute from '@/routes/organizations';
import usersRoute from '@/routes/users';
import type { User, PaginatedResponse, Organization } from '@/types';

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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

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

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedUser) {
            return;
        }

        setDeleting(true);
        router.delete(usersRoute.destroy({ user: selectedUser.id }), {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
                setSelectedUser(null);
            },
        });
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string; text: string; icon: any; border: string }> = {
        active: {
            label: 'فعال',
            color: 'emerald',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            icon: UserCheck,
            border: 'border-emerald-200'
        },
        inactive: {
            label: 'غیرفعال',
            color: 'gray',
            bg: 'bg-gray-50',
            text: 'text-gray-600',
            icon: UserX,
            border: 'border-gray-200'
        },
        suspended: {
            label: 'تعلیق',
            color: 'red',
            bg: 'bg-red-50',
            text: 'text-red-700',
            icon: UserCog,
            border: 'border-red-200'
        },
    };

    const roleColors: Record<string, { bg: string; text: string; icon: any }> = {
        'super-admin': { bg: 'bg-gradient-to-r from-purple-100 to-purple-50', text: 'text-purple-700', icon: Star },
        'org-admin': { bg: 'bg-gradient-to-r from-blue-100 to-blue-50', text: 'text-blue-700', icon: Shield },
        'dept-manager': { bg: 'bg-gradient-to-r from-amber-100 to-amber-50', text: 'text-amber-700', icon: Award },
        user: { bg: 'bg-gradient-to-r from-gray-100 to-gray-50', text: 'text-gray-600', icon: UserCheck },
    };

    const roleLabels: Record<string, string> = {
        'super-admin': 'ادمین کل',
        'org-admin': 'ادمین وزارت',
        'dept-manager': 'مدیر دیپارتمنت',
        'user': 'کاربر عادی',
    };

    const hasActiveFilters = filters.search || filters.status || filters.organization_id || filters.role;

    const stats = [
        { label: 'کل کارمندان', value: users.total, icon: Users, color: 'cyan', gradient: 'from-cyan-500 to-cyan-600' },
        { label: 'کارمندان فعال', value: users.data.filter(u => u.status === 'active').length, icon: UserCheck, color: 'emerald', gradient: 'from-emerald-500 to-emerald-600' },
        { label: 'کارمندان تعلیق', value: users.data.filter(u => u.status === 'suspended').length, icon: UserCog, color: 'red', gradient: 'from-red-500 to-red-600' },
        { label: 'وزارت‌ها', value: new Set(users.data.map(u => u.organization_id)).size, icon: Building2, color: 'purple', gradient: 'from-purple-500 to-purple-600' },
    ];

    const getInitials = (user: User) => {
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    };

    const getRandomGradient = (id: number) => {
        const gradients = [
            'from-cyan-500 to-blue-500',
            'from-emerald-500 to-teal-500',
            'from-purple-500 to-indigo-500',
            'from-rose-500 to-pink-500',
            'from-amber-500 to-orange-500',
        ];

        return gradients[id % gradients.length];
    };

    return (
        <>
            <Head title="مدیریت کارمندان" />

            <div className="min-h-screen">
                <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 ">
                    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                        {/* Header Section */}
                        <div className="flex bg-white p-5 rounded-2xl flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
                            <div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-50"></div>
                                        <div className="relative p-2 sm:p-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                                            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">مدیریت کارمندان</h1>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 flex items-center gap-1 sm:gap-2">
                                            <Sparkles className="h-3 w-3 text-cyan-500" />
                                            مدیریت کارمندان سیستم، تعیین وظیفه و دسترسی‌ها
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* View Toggle */}
                                <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${viewMode === 'table'
                                                ? 'bg-cyan-600 text-white shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        جدولی
                                    </button>
                                    <button
                                        onClick={() => setViewMode('cards')}
                                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${viewMode === 'cards'
                                                ? 'bg-cyan-600 text-white shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        کارتی
                                    </button>
                                </div>
                                {can.create && (
                                    <Link
                                        href={usersRoute.create()}
                                        className="group relative inline-flex items-center px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 border border-transparent rounded-xl text-xs sm:text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <Plus className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:rotate-90 duration-200" />
                                        <span className="hidden xs:inline">کارمند جدید</span>
                                        <span className="xs:hidden">جدید</span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards - Responsive Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 animate-slide-up">
                            {stats.map((stat, idx) => (
                                <div key={stat.label} className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <div className={`absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
                                    <div className="relative p-3 sm:p-4 lg:p-5">
                                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                                            <div className={`p-1.5 sm:p-2 lg:p-2.5 bg-gradient-to-br ${stat.gradient} rounded-lg sm:rounded-xl shadow-md`}>
                                                <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                                            </div>
                                        </div>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.value.toLocaleString('fa-IR')}</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search and Filters Bar */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 animate-slide-up">
                            <div className="p-3 sm:p-4 lg:p-5">
                                <div className="flex flex-col lg:flex-row gap-3">
                                    <div className="flex-1">
                                        <div className="relative group">
                                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                placeholder="جستجو بر اساس نام، ایمیل، کد ملی..."
                                                className="w-full pr-9 sm:pr-10 pl-3 sm:pl-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 sm:gap-3">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${showFilters || hasActiveFilters
                                                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm'
                                                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Filter className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <span className="hidden xs:inline">فیلترها</span>
                                            {hasActiveFilters && (
                                                <span className="mr-1 sm:mr-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-600 rounded-full animate-pulse"></span>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSearch}
                                            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-sm"
                                        >
                                            جستجو
                                        </button>
                                    </div>
                                </div>

                                {/* Extended Filters */}
                                <div className={`transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-[500px] opacity-100 mt-3 sm:mt-4' : 'max-h-0 opacity-0'}`}>
                                    {showFilters && (
                                        <>
                                            <div className="border-t border-gray-100 pt-3 sm:pt-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                                    <div>
                                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">وضعیت</label>
                                                        <select
                                                            value={selectedStatus}
                                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                                            className="w-full border border-gray-200 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                        >
                                                            <option value="">همه وضعیت‌ها</option>
                                                            <option value="active">فعال</option>
                                                            <option value="inactive">غیرفعال</option>
                                                            <option value="suspended">تعلیق</option>
                                                        </select>
                                                    </div>
                                                    {organizations.length > 0 && (
                                                        <div>
                                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">وزارت</label>
                                                            <select
                                                                value={selectedOrganization}
                                                                onChange={(e) => setSelectedOrganization(e.target.value)}
                                                                className="w-full border border-gray-200 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                            >
                                                                <option value="">همه وزارت‌ها</option>
                                                                {organizations.map((org) => (
                                                                    <option key={org.id} value={org.id}>{org.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                    {roles.length > 0 && (
                                                        <div>
                                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">وظیفه</label>
                                                            <select
                                                                value={selectedRole}
                                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                                className="w-full border border-gray-200 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                            >
                                                                <option value="">همه وظیفه‌ها</option>
                                                                {roles.map((role) => (
                                                                    <option key={role.name} value={role.name}>{role.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-end mt-3 sm:mt-4">
                                                    <button
                                                        onClick={handleReset}
                                                        className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                                    >
                                                        <X className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                        پاک کردن همه فیلترها
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* View Mode: Table or Cards */}
                        {viewMode === 'table' ? (
                            // ==================== TABLE VIEW ====================
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                                {/* Horizontal Scroll for Mobile */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-[900px] lg:min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-gray-50 to-white">
                                            <tr>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">کاربر</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">ایمیل</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">وزارت</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">ریاست \ آمریت</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">وظیفه</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">سطح دسترسی</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">وضعیت</th>
                                                <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {users.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="px-6 py-12 sm:py-16 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="p-3 sm:p-4 bg-gray-100 rounded-full mb-3 sm:mb-4">
                                                                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                                                            </div>
                                                            <p className="text-gray-500 font-medium">هیچ کاربری یافت نشد</p>
                                                            <p className="text-xs sm:text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                users.data.map((user, index) => {
                                                    const status = statusConfig[user.status] || statusConfig.inactive;
                                                    const StatusIcon = status.icon;
                                                    const userRole = user.roles?.[0];
                                                    const roleStyle = userRole ? roleColors[userRole.name] || roleColors.user : roleColors.user;
                                                    const RoleIcon = roleStyle.icon;

                                                    return (
                                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                                            {/* کاربر */}
                                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                                                <div className="flex items-center">
                                                                    <div className={`shrink-0 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-br ${getRandomGradient(user.id)} flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md`}>
                                                                        {getInitials(user)}
                                                                    </div>
                                                                    <div className="mr-2 sm:mr-3">
                                                                        <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                                                            {user.first_name} {user.last_name}
                                                                        </p>
                                                                        <div className="flex items-center gap-1 mt-0.5">
                                                                            <code className="text-[10px] sm:text-xs text-gray-500 font-mono truncate max-w-[80px] sm:max-w-none">
                                                                                {user.national_code}
                                                                            </code>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* ایمیل - مخفی در موبایل */}
                                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hidden sm:table-cell">
                                                                <div className="flex items-center gap-1 sm:gap-1.5">
                                                                    <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
                                                                    <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px] lg:max-w-none">
                                                                        {user.email}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            {/* وزارت */}
                                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                                                {user.organization ? (
                                                                    <Link
                                                                        href={organizationsRoute.show({ organization: user.organization.id })}
                                                                        className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-cyan-600 transition-colors"
                                                                    >
                                                                        <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                                                        <span className="truncate max-w-[100px] sm:max-w-[150px] lg:max-w-[200px]">
                                                                            {user.organization.name}
                                                                        </span>
                                                                    </Link>
                                                                ) : (
                                                                    <span className="text-xs sm:text-sm text-gray-400">-</span>
                                                                )}
                                                            </td>

                                                            {/* دیپارتمان - مخفی در تبلت */}
                                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hidden lg:table-cell">
                                                                {user.department ? (
                                                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                                                        <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
                                                                        <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px] xl:max-w-[180px]">
                                                                            {user.department.name}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs sm:text-sm text-gray-400">-</span>
                                                                )}
                                                            </td>

                                                            {/* پوزیشن - مخفی در لپ‌تاپ */}
                                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hidden xl:table-cell">
                                                                {user.primary_position ? (
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className="text-xs sm:text-sm font-medium text-gray-800 truncate max-w-[150px]">
                                                                            {user.primary_position.name}
                                                                        </span>
                                                                        {user.primary_position.is_management && (
                                                                            <span className="inline-flex w-fit px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-medium bg-amber-100 text-amber-700">
                                                                                مدیریتی
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs sm:text-sm text-gray-400">-</span>
                                                                )}
                                                            </td>

                                                            {/* وظیفه - مخفی در موبایل */}
                                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hidden md:table-cell">
                                                                <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${roleStyle.bg} ${roleStyle.text} shadow-sm`}>
                                                                    <RoleIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                                    {roleLabels[userRole?.name || 'user']}
                                                                </span>
                                                            </td>

                                                            {/* وضعیت */}
                                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                                                                <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${status.bg} ${status.text} border ${status.border}`}>
                                                                    <StatusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                                    {status.label}
                                                                </span>
                                                            </td>

                                                            {/* عملیات */}
                                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-left">
                                                                <div className="flex items-center gap-0.5 sm:gap-1">
                                                                    {can.edit && (
                                                                        <Link
                                                                            href={usersRoute.edit({ user: user.id })}
                                                                            className="p-1.5 sm:p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-200"
                                                                            title="ویرایش"
                                                                        >
                                                                            <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                        </Link>
                                                                    )}
                                                                    {can.delete && (
                                                                        <button
                                                                            onClick={() => handleDelete(user)}
                                                                            className="cursor-pointer p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                            title="حذف"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                                    <div className="bg-gray-50 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                        <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                                            نمایش {users.from} تا {users.to} از {users.total} نتیجه
                                        </div>
                                        <div className="flex gap-1 order-1 sm:order-2">
                                            {/* Previous Button */}
                                            {users.current_page > 1 ? (
                                                <Link
                                                    href={usersRoute.index({ query: { page: users.current_page - 1, ...filters } })}
                                                    className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-gray-700 hover:bg-white hover:text-cyan-600 transition-all"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
                                            ) : (
                                                <span className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-gray-300 cursor-not-allowed">
                                                    <ChevronRight className="h-4 w-4" />
                                                </span>
                                            )}

                                            {/* Page Numbers - Simplified on mobile */}
                                            <div className="hidden sm:flex gap-1">
                                                {[...Array(Math.min(5, users.last_page))].map((_, i) => {
                                                    let pageNum;
                                                    if (users.last_page <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (users.current_page <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (users.current_page >= users.last_page - 2) {
                                                        pageNum = users.last_page - 4 + i;
                                                    } else {
                                                        pageNum = users.current_page - 2 + i;
                                                    }

                                                    return (
                                                        <Link
                                                            key={pageNum}
                                                            href={usersRoute.index({ query: { page: pageNum, ...filters } })}
                                                            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${users.current_page === pageNum
                                                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                                                                    : 'text-gray-700 hover:bg-white hover:text-cyan-600'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </Link>
                                                    );
                                                })}
                                            </div>

                                            {/* Mobile page indicator */}
                                            <div className="sm:hidden flex items-center gap-1">
                                                <span className="text-xs text-gray-600">
                                                    صفحه {users.current_page} از {users.last_page}
                                                </span>
                                            </div>

                                            {/* Next Button */}
                                            {users.current_page < users.last_page ? (
                                                <Link
                                                    href={usersRoute.index({ query: { page: users.current_page + 1, ...filters } })}
                                                    className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-gray-700 hover:bg-white hover:text-cyan-600 transition-all"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Link>
                                            ) : (
                                                <span className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-gray-300 cursor-not-allowed">
                                                    <ChevronLeft className="h-4 w-4" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // ==================== CARDS VIEW ====================
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 animate-fade-in">
                                {users.data.length === 0 ? (
                                    <div className="col-span-full bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 lg:p-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-3 sm:p-4 bg-gray-100 rounded-full mb-3 sm:mb-4">
                                                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium">هیچ کاربری یافت نشد</p>
                                            <p className="text-xs sm:text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                        </div>
                                    </div>
                                ) : (
                                    users.data.map((user, index) => {
                                        const status = statusConfig[user.status] || statusConfig.inactive;
                                        const StatusIcon = status.icon;
                                        const userRole = user.roles?.[0];
                                        const roleStyle = userRole ? roleColors[userRole.name] || roleColors.user : roleColors.user;
                                        const RoleIcon = roleStyle.icon;

                                        return (
                                            <div key={user.id} className="group bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                                <div className={`h-1 sm:h-1.5 bg-gradient-to-r ${getRandomGradient(user.id)}`} />
                                                <div className="p-3 sm:p-4 lg:p-5">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <div className={`h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl bg-gradient-to-br ${getRandomGradient(user.id)} flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg shadow-md`}>
                                                                {getInitials(user)}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                                                                    {user.first_name} {user.last_name}
                                                                </h3>
                                                                <div className="flex items-center gap-1 sm:gap-2 mt-1">
                                                                    <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium ${status.bg} ${status.text} border ${status.border}`}>
                                                                        <StatusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                                        {status.label}
                                                                    </span>
                                                                    <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
                                                                        <RoleIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                                        {roleLabels[userRole?.name || 'user']}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-0.5 sm:gap-1">
                                                            {can.edit && (
                                                                <Link
                                                                    href={usersRoute.edit({ user: user.id })}
                                                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                                                                >
                                                                    <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                </Link>
                                                            )}
                                                            {can.delete && userRole?.name !== 'super-admin' && (
                                                                <button
                                                                    onClick={() => handleDelete(user)}
                                                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Contact Info */}
                                                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                                                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                                            <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 flex-shrink-0" />
                                                            <span className="text-gray-600 truncate">{user.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                                            <code className="text-[10px] sm:text-xs text-gray-500 font-mono">{user.national_code}</code>
                                                        </div>
                                                    </div>

                                                    {/* Separator */}
                                                    <div className="border-t border-gray-100 my-2 sm:my-3"></div>

                                                    {/* Organization Info */}
                                                    <div className="space-y-1.5 sm:space-y-2">
                                                        {/* وزارت */}
                                                        {user.organization && (
                                                            <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                                                <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="text-[9px] sm:text-xs text-gray-400 block">وزارت</span>
                                                                    <Link
                                                                        href={organizationsRoute.show({ organization: user.organization.id })}
                                                                        className="text-gray-700 hover:text-cyan-600 transition-colors text-xs sm:text-sm truncate block"
                                                                        title={user.organization.name}
                                                                    >
                                                                        {user.organization.name}
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* دیپارتمان */}
                                                        {user.department && (
                                                            <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                                                <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="text-[9px] sm:text-xs text-gray-400 block">دیپارتمنت</span>
                                                                    <span className="text-gray-700 text-xs sm:text-sm truncate block" title={user.department.name}>
                                                                        {user.department.name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* پوزیشن */}
                                                        {user.primary_position && (
                                                            <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                                                <UserCog className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="text-[9px] sm:text-xs text-gray-400 block">وظیفه</span>
                                                                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                                        <span className="text-gray-700 text-xs sm:text-sm font-medium truncate">
                                                                            {user.primary_position.name}
                                                                        </span>
                                                                        {user.primary_position.is_management && (
                                                                            <span className="inline-flex items-center px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-medium bg-amber-100 text-amber-700">
                                                                                مدیریتی
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-1 text-[9px] sm:text-xs text-gray-400">
                                                            <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                            <span className="hidden xs:inline">عضویت:</span>
                                                            {new Date(user.created_at).toLocaleDateString('fa-IR')}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[9px] sm:text-xs text-gray-400">
                                                            <code className="text-[9px] sm:text-xs">کد: {user.employment_code || '-'}</code>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
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
            {showDeleteModal && selectedUser && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedUser(null);
                    }}
                    onConfirm={confirmDelete}
                    title="حذف کاربر"
                    message="آیا از حذف این کاربر اطمینان دارید؟"
                    itemName={selectedUser.full_name || `${selectedUser.first_name} ${selectedUser.last_name}`}
                    isLoading={deleting}
                />
            )}
        </>
    );
}