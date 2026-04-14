import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, Building2, ChevronLeft, ChevronRight, Eye, Filter, X, MoreVertical, CheckCircle, XCircle, Calendar } from 'lucide-react';
import React, { useState } from 'react';
import organizationsRoute from '@/routes/organizations';
import type { Organization } from '@/types';

interface Props {
    organizations: {
        data: Organization[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
}

export default function OrganizationsIndex({ organizations, filters, can }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => {
        router.get(organizationsRoute.index(), {
            search: searchTerm,
            status: selectedStatus,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedStatus('');
        router.get(organizationsRoute.index(), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`آیا از حذف سازمان "${name}" اطمینان دارید؟`)) {
            router.delete(organizationsRoute.destroy({ organization: id }));
        }
    };

    const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
        active: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
        inactive: { bg: 'bg-gray-50', text: 'text-gray-600', icon: XCircle },
    };

    const statusLabels: Record<string, string> = {
        active: 'فعال',
        inactive: 'غیرفعال',
    };

    const hasActiveFilters = filters.search || filters.status;

    return (
        <>
            <Head title="مدیریت سازمان‌ها" />

            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                        <Building2 className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">سازمان‌ها</h1>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            مدیریت و نظارت بر تمام سازمان‌های سیستم
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {can.create && (
                                <Link
                                    href={organizationsRoute.create()}
                                    className="inline-flex items-center px-5 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <Plus className="ml-2 h-4 w-4" />
                                    افزودن سازمان جدید
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">کل سازمان‌ها</p>
                                    <p className="text-2xl font-bold text-gray-900">{organizations.total}</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">سازمان‌های فعال</p>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        {organizations.data.filter(o => o.status === 'active').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters Bar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
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
                                            placeholder="جستجو بر اساس نام، کد، ایمیل یا تلفن..."
                                            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                            showFilters || hasActiveFilters
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Filter className="ml-2 h-4 w-4" />
                                        فیلترها
                                        {hasActiveFilters && (
                                            <span className="mr-2 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleSearch}
                                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
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
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">همه وضعیت‌ها</option>
                                                <option value="active">فعال</option>
                                                <option value="inactive">غیرفعال</option>
                                            </select>
                                        </div>
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

                    {/* Organizations Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سازمان</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اطلاعات تماس</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {organizations.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Building2 className="h-12 w-12 text-gray-300 mb-3" />
                                                    <p className="text-gray-500 font-medium">هیچ سازمانی یافت نشد</p>
                                                    <p className="text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                                    {hasActiveFilters && (
                                                        <button
                                                            onClick={handleReset}
                                                            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                        >
                                                            پاک کردن فیلترها
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        organizations.data.map((org) => {
                                            const StatusIcon = statusColors[org.status].icon;

                                            return (
                                                <tr key={org.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="shrink-0 h-10 w-10 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                                                <Building2 className="h-5 w-5 text-blue-700" />
                                                            </div>
                                                            <div className="mr-3">
                                                                <p className="text-sm font-medium text-gray-900">{org.name}</p>
                                                                <p className="text-xs text-gray-500 mt-0.5">شناسه: {org.id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">{org.code}</code>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            {org.email && (
                                                                <p className="text-sm text-gray-600">{org.email}</p>
                                                            )}
                                                            {org.phone && (
                                                                <p className="text-sm text-gray-500">{org.phone}</p>
                                                            )}
                                                            {!org.email && !org.phone && (
                                                                <p className="text-sm text-gray-400">-</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[org.status].bg} ${statusColors[org.status].text}`}>
                                                            <StatusIcon className="h-3 w-3" />
                                                            {statusLabels[org.status]}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-left">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={organizationsRoute.show({ organization: org.id })}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="مشاهده"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            {can.edit && (
                                                                <Link
                                                                    href={organizationsRoute.edit({ organization: org.id })}
                                                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                                    title="ویرایش"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            )}
                                                            {can.delete && (
                                                                <button
                                                                    onClick={() => handleDelete(org.id, org.name)}
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
                        {organizations.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-600">
                                    نمایش <span className="font-medium">{organizations.from}</span> تا{' '}
                                    <span className="font-medium">{organizations.to}</span> از{' '}
                                    <span className="font-medium">{organizations.total}</span> نتیجه
                                </div>
                                <div className="flex gap-1.5">
                                    <Link
                                        href={organizations.current_page > 1 ? organizationsRoute.index({ query: { page: organizations.current_page - 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            organizations.current_page > 1
                                                ? 'text-gray-700 hover:bg-white hover:text-blue-600'
                                                : 'text-gray-300 cursor-not-allowed'
                                        }`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                    {(() => {
                                        const pages = [];
                                        const maxVisible = 5;
                                        let start = Math.max(1, organizations.current_page - Math.floor(maxVisible / 2));
                                        const end = Math.min(organizations.last_page, start + maxVisible - 1);
                                        
                                        if (end - start + 1 < maxVisible) {
                                            start = Math.max(1, end - maxVisible + 1);
                                        }
                                        
                                        if (start > 1) {
                                            pages.push(
                                                <Link
                                                    key={1}
                                                    href={organizationsRoute.index({ query: { page: 1, ...filters } })}
                                                    className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:text-blue-600 transition-colors"
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
                                                    href={organizationsRoute.index({ query: { page: i, ...filters } })}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                        organizations.current_page === i
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : 'text-gray-700 hover:bg-white hover:text-blue-600'
                                                    }`}
                                                >
                                                    {i}
                                                </Link>
                                            );
                                        }
                                        
                                        if (end < organizations.last_page) {
                                            if (end < organizations.last_page - 1) {
                                                pages.push(<span key="dots2" className="px-2 text-gray-400">...</span>);
                                            }

                                            pages.push(
                                                <Link
                                                    key={organizations.last_page}
                                                    href={organizationsRoute.index({ query: { page: organizations.last_page, ...filters } })}
                                                    className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:text-blue-600 transition-colors"
                                                >
                                                    {organizations.last_page}
                                                </Link>
                                            );
                                        }
                                        
                                        return pages;
                                    })()}
                                    <Link
                                        href={organizations.current_page < organizations.last_page ? organizationsRoute.index({ query: { page: organizations.current_page + 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            organizations.current_page < organizations.last_page
                                                ? 'text-gray-700 hover:bg-white hover:text-blue-600'
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
        </>
    );
}