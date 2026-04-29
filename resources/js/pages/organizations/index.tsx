import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Pencil, Trash2, Search, Building2, ChevronLeft, ChevronRight,
    Eye, Filter, X, CheckCircle, XCircle, Calendar,
    Mail, Phone, Globe, MapPin, TrendingUp,
    Sparkles, Layers, Hash
} from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

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

    const handleDelete = (org: Organization) => {
        setSelectedOrganization(org);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedOrganization) {
            return;
        }

        setDeleting(true);
        router.delete(organizationsRoute.destroy({ organization: selectedOrganization.id }), {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
                setSelectedOrganization(null);
            },
        });
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
            icon: XCircle,
            border: 'border-gray-200'
        },
    };

    const hasActiveFilters = filters.search || filters.status;

    const stats = [
        { label: 'کل وزارت ها', value: organizations.total, icon: Building2, color: 'blue', gradient: 'from-blue-500 to-indigo-600', change: '+12%' },
        { label: 'وزارت های فعال', value: organizations.data.filter(o => o.status === 'active').length, icon: CheckCircle, color: 'emerald', gradient: 'from-emerald-500 to-teal-600', change: '+8%' },
        { label: 'وزارت های غیرفعال', value: organizations.data.filter(o => o.status === 'inactive').length, icon: XCircle, color: 'gray', gradient: 'from-gray-500 to-slate-600', change: '-3%' },
        { label: 'ریاست ها', value: organizations.data.reduce((acc, org) => acc + (org.departments_count || 0), 0), icon: Layers, color: 'purple', gradient: 'from-purple-500 to-pink-600', change: '+5%' },
    ];

    const getRandomGradient = (id: number) => {
        const gradients = [
            'from-blue-500 to-indigo-600',
            'from-emerald-500 to-teal-600',
            'from-purple-500 to-pink-600',
            'from-amber-500 to-orange-600',
            'from-rose-500 to-red-600',
        ];

        return gradients[id % gradients.length];
    };

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <>
            <Head title="مدیریت وزارت ها" />

            <div className="min-h-screen bg-gray-200">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col bg-white rounded-lg p-5 shadow-sm border lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-50"></div>
                                        <div className="relative p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                            <Building2 className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">مدیریت وزارت ها</h1>
                                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                            <Sparkles className="h-3 w-3 text-blue-500" />
                                            مدیریت و نظارت بر تمام وزارت های سیستم
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
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        جدولی
                                    </button>
                                    <button
                                        onClick={() => setViewMode('cards')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'cards'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        کارتی
                                    </button>
                                </div>
                                {can.create && (
                                    <Link
                                        href={organizationsRoute.create()}
                                        className="group relative inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <Plus className="ml-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
                                         ثبت وزارت
                                        <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="p-5">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative group">
                                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                placeholder="جستجو بر اساس نام، کد، ایمیل یا تلفن..."
                                                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${showFilters || hasActiveFilters
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Filter className="ml-2 h-4 w-4" />
                                            فیلترها
                                            {hasActiveFilters && (
                                                <span className="mr-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSearch}
                                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
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
                                                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* View Mode: Table or Cards */}
                        {viewMode === 'table' ? (
                            // Table View
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-gray-50 to-white">
                                            <tr>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وزارت</th>
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
                                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                                <Building2 className="h-12 w-12 text-gray-400" />
                                                            </div>
                                                            <p className="text-gray-500 font-medium">هیچ وزارتی یافت نشد</p>
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
                                                organizations.data.map((org, index) => {
                                                    const status = statusConfig[org.status];
                                                    const StatusIcon = status.icon;

                                                    return (
                                                        <tr key={org.id} className="hover:bg-gray-50 transition-colors group" style={{ animationDelay: `${index * 50}ms` }}>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    <div className={`shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br ${getRandomGradient(org.id)} flex items-center justify-center text-white font-bold shadow-md`}>
                                                                        {getInitials(org.name)}
                                                                    </div>
                                                                    <div className="mr-3">
                                                                        <p className="text-sm font-semibold text-gray-900">{org.name}</p>
                                                                        <div className="flex items-center gap-2 mt-0.5">
                                                                            <Hash className="h-3 w-3 text-gray-400" />
                                                                            <code className="text-xs text-gray-500 font-mono">ID: {org.id}</code>
                                                                            {org.parent && (
                                                                                <>
                                                                                    <span className="text-gray-300">•</span>
                                                                                    <span className="text-xs text-gray-400">والد: {org.parent.name}</span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                                                                    <Hash className="h-3.5 w-3.5 text-gray-400" />
                                                                    <code className="text-sm font-mono text-gray-700">{org.code}</code>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="space-y-1">
                                                                    {org.email && (
                                                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                                                                            {org.email}
                                                                        </div>
                                                                    )}
                                                                    {org.phone && (
                                                                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                                            {org.phone}
                                                                        </div>
                                                                    )}
                                                                    {!org.email && !org.phone && (
                                                                        <span className="text-sm text-gray-400">-</span>
                                                                    )}
                                                                </div>
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
                                                                        href={organizationsRoute.show({ organization: org.id })}
                                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                                        title="مشاهده"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                    {can.edit && (
                                                                        <Link
                                                                            href={organizationsRoute.edit({ organization: org.id })}
                                                                            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                                                            title="ویرایش"
                                                                        >
                                                                            <Pencil className="h-4 w-4" />
                                                                        </Link>
                                                                    )}
                                                                    {can.delete && (
                                                                        <button
                                                                            onClick={() => handleDelete(org)}
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
                                {organizations.last_page > 1 && (
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-gray-600">
                                            نمایش <span className="font-medium text-gray-900">{organizations.from}</span> تا{' '}
                                            <span className="font-medium text-gray-900">{organizations.to}</span> از{' '}
                                            <span className="font-medium text-gray-900">{organizations.total}</span> نتیجه
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Link
                                                href={organizations.current_page > 1 ? organizationsRoute.index({ query: { page: organizations.current_page - 1, ...filters } }) : '#'}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${organizations.current_page > 1
                                                    ? 'text-gray-700 hover:bg-white hover:text-blue-600 shadow-sm'
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
                                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${organizations.current_page === i
                                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
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
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${organizations.current_page < organizations.last_page
                                                    ? 'text-gray-700 hover:bg-white hover:text-blue-600 shadow-sm'
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {organizations.data.length === 0 ? (
                                    <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                <Building2 className="h-12 w-12 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium">هیچ وزارتی یافت نشد</p>
                                            <p className="text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                        </div>
                                    </div>
                                ) : (
                                    organizations.data.map((org, index) => {
                                        const status = statusConfig[org.status];
                                        const StatusIcon = status.icon;

                                        return (
                                            <div key={org.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: `${index * 50}ms` }}>
                                                {/* Header Bar */}
                                                <div className={`h-1.5 bg-gradient-to-r ${getRandomGradient(org.id)}`} />

                                                <div className="p-5">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getRandomGradient(org.id)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                                                {getInitials(org.name)}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900">{org.name}</h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <code className="text-xs text-gray-500 font-mono">کد: {org.code}</code>
                                                                    {org.parent && (
                                                                        <span className="text-xs text-gray-400">• زیرمجموعه {org.parent.name}</span>
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
                                                        {org.email && (
                                                            <div className="flex items-center gap-2.5 text-sm">
                                                                <Mail className="h-4 w-4 text-gray-400" />
                                                                <span className="text-gray-600">{org.email}</span>
                                                            </div>
                                                        )}
                                                        {org.phone && (
                                                            <div className="flex items-center gap-2.5 text-sm">
                                                                <Phone className="h-4 w-4 text-gray-400" />
                                                                <span className="text-gray-600">{org.phone}</span>
                                                            </div>
                                                        )}
                                                        {org.address && (
                                                            <div className="flex items-start gap-2.5 text-sm">
                                                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                                                <span className="text-gray-600 line-clamp-2">{org.address}</span>
                                                            </div>
                                                        )}
                                                        {org.website && (
                                                            <div className="flex items-center gap-2.5 text-sm">
                                                                <Globe className="h-4 w-4 text-gray-400" />
                                                                <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                                                                    {org.website}
                                                                </a>
                                                            </div>
                                                        )}
                                                        {!org.email && !org.phone && !org.address && !org.website && (
                                                            <div className="text-sm text-gray-400 text-center py-2">اطلاعات تماسی ثبت نشده است</div>
                                                        )}
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <Link
                                                                href={organizationsRoute.show({ organization: org.id })}
                                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            {can.edit && (
                                                                <Link
                                                                    href={organizationsRoute.edit({ organization: org.id })}
                                                                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            )}
                                                            {can.delete && (
                                                                <button
                                                                    onClick={() => handleDelete(org)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(org.created_at).toLocaleDateString('fa-IR')}
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
                        {viewMode === 'cards' && organizations.last_page > 1 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-600">
                                    نمایش <span className="font-medium text-gray-900">{organizations.from}</span> تا{' '}
                                    <span className="font-medium text-gray-900">{organizations.to}</span> از{' '}
                                    <span className="font-medium text-gray-900">{organizations.total}</span> نتیجه
                                </div>
                                <div className="flex gap-1.5">
                                    {/* Same pagination as table view */}
                                    <Link
                                        href={organizations.current_page > 1 ? organizationsRoute.index({ query: { page: organizations.current_page - 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${organizations.current_page > 1
                                            ? 'text-gray-700 hover:bg-white hover:text-blue-600 shadow-sm'
                                            : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                    {[...Array(Math.min(5, organizations.last_page))].map((_, i) => {
                                        let pageNum;

                                        if (organizations.last_page <= 5) {
                                            pageNum = i + 1;
                                        } else if (organizations.current_page <= 3) {
                                            pageNum = i + 1;
                                        } else if (organizations.current_page >= organizations.last_page - 2) {
                                            pageNum = organizations.last_page - 4 + i;
                                        } else {
                                            pageNum = organizations.current_page - 2 + i;
                                        }

                                        return (
                                            <Link
                                                key={pageNum}
                                                href={organizationsRoute.index({ query: { page: pageNum, ...filters } })}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${organizations.current_page === pageNum
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-white hover:text-blue-600'
                                                    }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        );
                                    })}
                                    <Link
                                        href={organizations.current_page < organizations.last_page ? organizationsRoute.index({ query: { page: organizations.current_page + 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${organizations.current_page < organizations.last_page
                                            ? 'text-gray-700 hover:bg-white hover:text-blue-600 shadow-sm'
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedOrganization && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedOrganization(null);
                    }}
                    onConfirm={confirmDelete}
                    title="حذف سازمان"
                    message="آیا از حذف این سازمان اطمینان دارید؟"
                    itemName={selectedOrganization.name}
                    isLoading={deleting}
                />
            )}
        </>
    );
}