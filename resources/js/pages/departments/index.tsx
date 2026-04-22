// resources/js/pages/departments/index.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Pencil, Trash2, Search, Building2, ChevronLeft, ChevronRight,
    Eye, Filter, X, CheckCircle, AlertCircle, Layers,
    FolderTree, TrendingUp, Sparkles, Hash,
    GitBranch, Network, Users
} from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import departmentRoutes from '@/routes/departments';
import type { Department, Organization } from '@/types';

interface Props {
    departments: {
        data: Department[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    organizations: Organization[];
    filters: {
        search?: string;
        status?: string;
        organization_id?: string;
    };
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
}

export default function DepartmentsIndex({ departments, organizations, filters, can }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedOrganization, setSelectedOrganization] = useState(filters.organization_id || '');
    const [showFilters, setShowFilters] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    const handleSearch = () => {
        router.get(departmentRoutes.index(), {
            search: searchTerm,
            status: selectedStatus,
            organization_id: selectedOrganization,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedOrganization('');
        router.get(departmentRoutes.index(), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (department: Department) => {
        setSelectedDepartment(department);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedDepartment) {
            return;
        }

        setDeleting(true);
        router.delete(departmentRoutes.destroy({ department: selectedDepartment.id }), {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
                setSelectedDepartment(null);
            },
        });
    };

    const getLevelPrefix = (level: number) => {
        const spaces = '—'.repeat(level);

        return spaces ? `${spaces} ` : '';
    };

    const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any; border: string }> = {
        active: {
            label: 'فعال',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            icon: CheckCircle,
            border: 'border-emerald-200'
        },
        inactive: {
            label: 'غیرفعال',
            bg: 'bg-gray-50',
            text: 'text-gray-600',
            icon: AlertCircle,
            border: 'border-gray-200'
        },
    };

    const hasActiveFilters = filters.search || filters.status || filters.organization_id;

    const stats = [
        { label: 'کل ریاست ها', value: departments.total, icon: Layers, color: 'indigo', gradient: 'from-indigo-500 to-purple-600', change: '+12%' },
        { label: 'ریاست های فعال', value: departments.data.filter(d => d.status === 'active').length, icon: CheckCircle, color: 'emerald', gradient: 'from-emerald-500 to-teal-600', change: '+8%' },
        { label: 'وزارت ها', value: organizations.length, icon: Building2, color: 'blue', gradient: 'from-blue-500 to-cyan-600', change: '+5%' },
        { label: 'سطوح', value: Math.max(...departments.data.map(d => d.level), 0), icon: GitBranch, color: 'purple', gradient: 'from-purple-500 to-pink-600', change: '-' },
    ];

    const getRandomGradient = (id: number) => {
        const gradients = [
            'from-indigo-500 to-purple-600',
            'from-emerald-500 to-teal-600',
            'from-blue-500 to-cyan-600',
            'from-rose-500 to-pink-600',
            'from-amber-500 to-orange-600',
        ];

        return gradients[id % gradients.length];
    };

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <>
            <Head title="مدیریت ریاست ها" />

            <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                                        <div className="relative p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                            <Network className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">مدیریت ریاست ها</h1>
                                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                            <Sparkles className="h-3 w-3 text-indigo-500" />
                                            مدیریت واحدهای سازمانی و ساختار سازمانی
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* View Toggle */}
                                <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'table'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        جدولی
                                    </button>
                                    <button
                                        onClick={() => setViewMode('cards')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'cards'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        کارتی
                                    </button>
                                </div>
                                {can.create && (
                                    <Link
                                        href={departmentRoutes.create()}
                                        className="group relative inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <Plus className="ml-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
                                        ریاست جدید
                                        <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-slide-up">
                            {stats.map((stat, index) => (
                                <div key={stat.label} className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
                                    <div className="relative p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`p-2.5 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-md`}>
                                                <stat.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                                <TrendingUp className="h-3 w-3" />
                                                {stat.change}
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString('fa-IR')}</p>
                                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search and Filters Bar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-slide-up">
                            <div className="p-5">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative group">
                                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                placeholder="جستجو بر اساس نام، کد، سازمان..."
                                                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${showFilters || hasActiveFilters
                                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Filter className="ml-2 h-4 w-4" />
                                            فیلترها
                                            {hasActiveFilters && (
                                                <span className="mr-2 w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSearch}
                                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
                                        >
                                            جستجو
                                        </button>
                                    </div>
                                </div>

                                {/* Extended Filters */}
                                <div className={`transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-96 opacity-100 mt-4 pt-4' : 'max-h-0 opacity-0'}`}>
                                    {showFilters && (
                                        <>
                                            <div className="border-t border-gray-100 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                                                        <select
                                                            value={selectedStatus}
                                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        >
                                                            <option value="">همه وضعیت‌ها</option>
                                                            <option value="active">فعال</option>
                                                            <option value="inactive">غیرفعال</option>
                                                        </select>
                                                    </div>
                                                    {organizations.length > 0 && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">سازمان</label>
                                                            <select
                                                                value={selectedOrganization}
                                                                onChange={(e) => setSelectedOrganization(e.target.value)}
                                                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            >
                                                                <option value="">همه وزارت ها</option>
                                                                {organizations.map((org) => (
                                                                    <option key={org.id} value={org.id}>{org.name}</option>
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
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* View Mode: Table or Cards */}
                        {viewMode === 'table' ? (
                            // Table View
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-gray-50 to-white">
                                            <tr>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ریاست</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سازمان</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">والد</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {departments.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-16 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                                <FolderTree className="h-12 w-12 text-gray-400" />
                                                            </div>
                                                            <p className="text-gray-500 font-medium">هیچ ریاستی یافت نشد</p>
                                                            <p className="text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                                            {hasActiveFilters && (
                                                                <button
                                                                    onClick={handleReset}
                                                                    className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                                                >
                                                                    پاک کردن فیلترها
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                departments.data.map((dept, index) => {
                                                    const status = statusConfig[dept.status];
                                                    const StatusIcon = status.icon;
                                                    const hasParent = dept.level > 0;

                                                    return (
                                                        <tr key={dept.id} className="hover:bg-gray-50 transition-colors group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    <div className={`shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br ${getRandomGradient(dept.id)} flex items-center justify-center text-white font-bold shadow-md`}>
                                                                        {getInitials(dept.name)}
                                                                    </div>
                                                                    <div className="mr-3">
                                                                        <p className="text-sm font-semibold text-gray-900">
                                                                            <span className="text-gray-400 text-xs ml-1">
                                                                                {getLevelPrefix(dept.level)}
                                                                            </span>
                                                                            {dept.name}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 mt-0.5">
                                                                            <Hash className="h-3 w-3 text-gray-400" />
                                                                            <code className="text-xs text-gray-500 font-mono">شناسه: {dept.id}</code>
                                                                            {dept.parent && (
                                                                                <>
                                                                                    <span className="text-gray-300">•</span>
                                                                                    <div className="flex items-center gap-1">
                                                                                        <GitBranch className="h-3 w-3 text-gray-400" />
                                                                                        <span className="text-xs text-gray-400">{dept.parent.name}</span>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                                                                    <Hash className="h-3.5 w-3.5 text-gray-400" />
                                                                    <code className="text-sm font-mono text-gray-700">{dept.code}</code>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {dept.organization ? (
                                                                    <Link
                                                                        href={`/organizations/${dept.organization.id}`}
                                                                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors group"
                                                                    >
                                                                        <Building2 className="h-3.5 w-3.5" />
                                                                        {dept.organization.name}
                                                                    </Link>
                                                                ) : (
                                                                    <span className="text-sm text-gray-400">-</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {dept.parent ? (
                                                                    <Link
                                                                        href={departmentRoutes.show({ department: dept.parent.id })}
                                                                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors group"
                                                                    >
                                                                        <FolderTree className="h-3.5 w-3.5" />
                                                                        {dept.parent.name}
                                                                    </Link>
                                                                ) : (
                                                                    <span className="text-sm text-gray-400">-</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${status.bg} ${status.text} border ${status.border}`}>
                                                                    <StatusIcon className="h-3.5 w-3.5" />
                                                                    {status.label}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-left">
                                                                <div className="flex items-center gap-1">
                                                                    <Link
                                                                        href={departmentRoutes.show({ department: dept.id })}
                                                                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                                                                        title="مشاهده"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                    {can.edit && (
                                                                        <Link
                                                                            href={departmentRoutes.edit({ department: dept.id })}
                                                                            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                                                            title="ویرایش"
                                                                        >
                                                                            <Pencil className="h-4 w-4" />
                                                                        </Link>
                                                                    )}
                                                                    {can.delete && (
                                                                        <button
                                                                            onClick={() => handleDelete(dept)}
                                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
                                {departments.last_page > 1 && (
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-gray-600">
                                            نمایش <span className="font-medium text-gray-900">{departments.from}</span> تا{' '}
                                            <span className="font-medium text-gray-900">{departments.to}</span> از{' '}
                                            <span className="font-medium text-gray-900">{departments.total}</span> نتیجه
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Link
                                                href={departments.current_page > 1 ? departmentRoutes.index({ query: { page: departments.current_page - 1, ...filters } }) : '#'}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${departments.current_page > 1
                                                    ? 'text-gray-700 hover:bg-white hover:text-indigo-600 shadow-sm'
                                                    : 'text-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                            {(() => {
                                                const pages = [];
                                                const maxVisible = 5;
                                                let start = Math.max(1, departments.current_page - Math.floor(maxVisible / 2));
                                                const end = Math.min(departments.last_page, start + maxVisible - 1);

                                                if (end - start + 1 < maxVisible) {
                                                    start = Math.max(1, end - maxVisible + 1);
                                                }

                                                if (start > 1) {
                                                    pages.push(
                                                        <Link
                                                            key={1}
                                                            href={departmentRoutes.index({ query: { page: 1, ...filters } })}
                                                            className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:text-indigo-600 transition-colors"
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
                                                            href={departmentRoutes.index({ query: { page: i, ...filters } })}
                                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${departments.current_page === i
                                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                                                : 'text-gray-700 hover:bg-white hover:text-indigo-600'
                                                                }`}
                                                        >
                                                            {i}
                                                        </Link>
                                                    );
                                                }

                                                if (end < departments.last_page) {
                                                    if (end < departments.last_page - 1) {
                                                        pages.push(<span key="dots2" className="px-2 text-gray-400">...</span>);
                                                    }

                                                    pages.push(
                                                        <Link
                                                            key={departments.last_page}
                                                            href={departmentRoutes.index({ query: { page: departments.last_page, ...filters } })}
                                                            className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:text-indigo-600 transition-colors"
                                                        >
                                                            {departments.last_page}
                                                        </Link>
                                                    );
                                                }

                                                return pages;
                                            })()}
                                            <Link
                                                href={departments.current_page < departments.last_page ? departmentRoutes.index({ query: { page: departments.current_page + 1, ...filters } }) : '#'}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${departments.current_page < departments.last_page
                                                    ? 'text-gray-700 hover:bg-white hover:text-indigo-600 shadow-sm'
                                                    : 'text-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Cards View
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
                                {departments.data.length === 0 ? (
                                    <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                <FolderTree className="h-12 w-12 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium">هیچ ریاستی یافت نشد</p>
                                            <p className="text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                        </div>
                                    </div>
                                ) : (
                                    departments.data.map((dept, index) => {
                                        const status = statusConfig[dept.status];
                                        const StatusIcon = status.icon;

                                        return (
                                            <div key={dept.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                                {/* Header Bar */}
                                                <div className={`h-1.5 bg-gradient-to-r ${getRandomGradient(dept.id)}`} />

                                                <div className="p-5">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getRandomGradient(dept.id)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                                                {getInitials(dept.name)}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900">{dept.name}</h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <code className="text-xs text-gray-500 font-mono">کد: {dept.code}</code>
                                                                    {dept.parent && (
                                                                        <>
                                                                            <span className="text-gray-300">•</span>
                                                                            <div className="flex items-center gap-1">
                                                                                <GitBranch className="h-3 w-3 text-gray-400" />
                                                                                <span className="text-xs text-gray-400">{dept.parent.name}</span>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium ${status.bg} ${status.text} border ${status.border}`}>
                                                            <StatusIcon className="h-3.5 w-3.5" />
                                                            {status.label}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-500">سازمان:</span>
                                                            {dept.organization ? (
                                                                <Link
                                                                    href={`/organizations/${dept.organization.id}`}
                                                                    className="text-gray-700 hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
                                                                >
                                                                    <Building2 className="h-3.5 w-3.5" />
                                                                    {dept.organization.name}
                                                                </Link>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-500">سطح:</span>
                                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-gray-50">
                                                                <GitBranch className="h-3 w-3 text-gray-400" />
                                                                {dept.level}
                                                            </span>
                                                        </div>
                                                        {dept.manager_position && (
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-500">مدیر:</span>
                                                                <span className="text-gray-700">{dept.manager_position.name}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <Link
                                                                href={departmentRoutes.show({ department: dept.id })}
                                                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            {can.edit && (
                                                                <Link
                                                                    href={departmentRoutes.edit({ department: dept.id })}
                                                                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            )}
                                                            {can.delete && (
                                                                <button
                                                                    onClick={() => handleDelete(dept)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                                            <Users className="h-3 w-3" />
                                                            {dept.users_count || 0} کاربر
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {/* Pagination for Cards View */}
                        {viewMode === 'cards' && departments.last_page > 1 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                                <div className="text-sm text-gray-600">
                                    نمایش <span className="font-medium text-gray-900">{departments.from}</span> تا{' '}
                                    <span className="font-medium text-gray-900">{departments.to}</span> از{' '}
                                    <span className="font-medium text-gray-900">{departments.total}</span> نتیجه
                                </div>
                                <div className="flex gap-1.5">
                                    <Link
                                        href={departments.current_page > 1 ? departmentRoutes.index({ query: { page: departments.current_page - 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${departments.current_page > 1
                                            ? 'text-gray-700 hover:bg-white hover:text-indigo-600 shadow-sm'
                                            : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                    {[...Array(Math.min(5, departments.last_page))].map((_, i) => {
                                        let pageNum;

                                        if (departments.last_page <= 5) {
                                            pageNum = i + 1;
                                        } else if (departments.current_page <= 3) {
                                            pageNum = i + 1;
                                        } else if (departments.current_page >= departments.last_page - 2) {
                                            pageNum = departments.last_page - 4 + i;
                                        } else {
                                            pageNum = departments.current_page - 2 + i;
                                        }

                                        return (
                                            <Link
                                                key={pageNum}
                                                href={departmentRoutes.index({ query: { page: pageNum, ...filters } })}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${departments.current_page === pageNum
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-white hover:text-indigo-600'
                                                    }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        );
                                    })}
                                    <Link
                                        href={departments.current_page < departments.last_page ? departmentRoutes.index({ query: { page: departments.current_page + 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${departments.current_page < departments.last_page
                                            ? 'text-gray-700 hover:bg-white hover:text-indigo-600 shadow-sm'
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
            {showDeleteModal && selectedDepartment && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedDepartment(null);
                    }}
                    onConfirm={confirmDelete}
                    title="حذف ریاست"
                    message="آیا از حذف این ریاست اطمینان دارید؟"
                    itemName={selectedDepartment.name}
                    type="department"
                    isLoading={deleting}
                />
            )}
        </>
    );
}