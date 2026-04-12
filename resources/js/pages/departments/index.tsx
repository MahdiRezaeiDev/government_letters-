import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, Building2, ChevronLeft, ChevronRight, Eye, Filter, X, CheckCircle, AlertCircle, Layers, ChevronDown, FolderTree, Briefcase } from 'lucide-react';
import React, { useState } from 'react';
import type { Department, Organization } from '@/types';
import departmentRoutes from '@/routes/departments'

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

    const handleDelete = (id: number, name: string) => {
        if (confirm(`آیا از حذف دپارتمان "${name}" اطمینان دارید؟`)) {
            router.delete(departmentRoutes.destroy({ department: id }));
        }
    };

    const getLevelPrefix = (level: number) => {
        const spaces = '—'.repeat(level);
        return spaces ? `${spaces} ` : '';
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string; text: string; icon: any }> = {
        active: { 
            label: 'فعال', 
            color: 'emerald', 
            bg: 'bg-emerald-50', 
            text: 'text-emerald-700',
            icon: CheckCircle
        },
        inactive: { 
            label: 'غیرفعال', 
            color: 'gray', 
            bg: 'bg-gray-50', 
            text: 'text-gray-600',
            icon: AlertCircle
        },
    };

    const hasActiveFilters = filters.search || filters.status || filters.organization_id;

    // Statistics
    const stats = {
        total: departments.total,
        active: departments.data.filter(d => d.status === 'active').length,
        organizations: new Set(departments.data.map(d => d.organization_id)).size,
    };

    return (
        <>
            <Head title="مدیریت دپارتمان‌ها" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                                        <Layers className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">دپارتمان‌ها</h1>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            مدیریت واحدهای سازمانی و ساختار سازمانی
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {can.create && (
                                <Link
                                    href={departmentRoutes.create()}
                                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <Plus className="ml-2 h-4 w-4" />
                                    دپارتمان جدید
                                </Link>
                            )}
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">کل دپارتمان‌ها</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-3 bg-indigo-50 rounded-lg">
                                        <Layers className="h-6 w-6 text-indigo-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">دپارتمان‌های فعال</p>
                                        <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                                    </div>
                                    <div className="p-3 bg-emerald-50 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">سازمان‌های مرتبط</p>
                                        <p className="text-2xl font-bold text-purple-600">{stats.organizations}</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <Briefcase className="h-6 w-6 text-purple-600" />
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
                                                placeholder="جستجو بر اساس نام، کد، سازمان..."
                                                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                                showFilters || hasActiveFilters
                                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Filter className="ml-2 h-4 w-4" />
                                            فیلترها
                                            {hasActiveFilters && (
                                                <span className="mr-2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSearch}
                                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm"
                                        >
                                            جستجو
                                        </button>
                                    </div>
                                </div>

                                {/* Extended Filters */}
                                {showFilters && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    >
                                                        <option value="">همه سازمان‌ها</option>
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
                                )}
                            </div>
                        </div>

                        {/* Departments Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دپارتمان</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سازمان</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دپارتمان والد</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {departments.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FolderTree className="h-12 w-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500 font-medium">هیچ دپارتمانی یافت نشد</p>
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
                                            departments.data.map((dept) => {
                                                const status = statusConfig[dept.status] || statusConfig.inactive;
                                                const StatusIcon = status.icon;
                                                const hasParent = dept.level > 0;
                                                
                                                return (
                                                    <tr key={dept.id} className="hover:bg-gray-50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className={`flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                                                                    hasParent ? 'bg-gray-100' : 'bg-gradient-to-br from-indigo-100 to-indigo-200'
                                                                }`}>
                                                                    <Building2 className={`h-4 w-4 ${hasParent ? 'text-gray-500' : 'text-indigo-700'}`} />
                                                                </div>
                                                                <div className="mr-3">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        <span className="font-mono text-gray-400 text-xs ml-1">
                                                                            {getLevelPrefix(dept.level)}
                                                                        </span>
                                                                        {dept.name}
                                                                    </p>
                                                                    {dept.parent && (
                                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                                            زیرمجموعه: {dept.parent.name}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
                                                                {dept.code}
                                                            </code>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {dept.organization ? (
                                                                <Link
                                                                    href={`/organizations/${dept.organization.id}`}
                                                                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
                                                                >
                                                                    <Briefcase className="h-3 w-3" />
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
                                                                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
                                                                >
                                                                    <FolderTree className="h-3 w-3" />
                                                                    {dept.parent.name}
                                                                </Link>
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
                                                                <Link
                                                                    href={departmentRoutes.show({ department: dept.id })}
                                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                    title="مشاهده"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                                {can.edit && (
                                                                    <Link
                                                                        href={departmentRoutes.edit({ department: dept.id })}
                                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                                        title="ویرایش"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Link>
                                                                )}
                                                                {can.delete && (
                                                                    <button
                                                                        onClick={() => handleDelete(dept.id, dept.name)}
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
                            {departments.last_page > 1 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        نمایش <span className="font-medium">{departments.from}</span> تا{' '}
                                        <span className="font-medium">{departments.to}</span> از{' '}
                                        <span className="font-medium">{departments.total}</span> نتیجه
                                    </div>
                                    <div className="flex gap-1.5">
                                        <Link
                                            href={departments.current_page > 1 ? departmentRoutes.index({ query: { page: departments.current_page - 1, ...filters } }) : '#'}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                departments.current_page > 1
                                                    ? 'text-gray-700 hover:bg-white hover:text-indigo-600'
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                        {(() => {
                                            const pages = [];
                                            const maxVisible = 5;
                                            let start = Math.max(1, departments.current_page - Math.floor(maxVisible / 2));
                                            let end = Math.min(departments.last_page, start + maxVisible - 1);
                                            
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
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                            departments.current_page === i
                                                                ? 'bg-indigo-600 text-white shadow-sm'
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
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                departments.current_page < departments.last_page
                                                    ? 'text-gray-700 hover:bg-white hover:text-indigo-600'
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