import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Pencil, Trash2, Search, FolderTree,
    Eye, Power, PowerOff, Filter, X,
    TrendingUp, Layers, Hash, SortAsc,
    Building2, Tag, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import categoriesRoute from '@/routes/categories';
import type { LetterCategory, Organization } from '@/types';

interface Props {
    categories: {
        data: LetterCategory[];
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

export default function CategoriesIndex({ categories, organizations, filters, can }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedOrganization, setSelectedOrganization] = useState(filters.organization_id || '');
    const [showFilters, setShowFilters] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<LetterCategory | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    const handleSearch = () => {
        router.get(categoriesRoute.index(), {
            search: searchTerm,
            status: selectedStatus,
            organization_id: selectedOrganization,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedOrganization('');
        router.get(categoriesRoute.index(), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (category: LetterCategory) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedCategory) {
            return;
        }

        setDeleting(true);
        router.delete(categoriesRoute.destroy({ category: selectedCategory.id }), {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
                setSelectedCategory(null);
            },
        });
    };

    const handleToggleStatus = (id: number) => {
        router.post(categoriesRoute.toggleStatus({ category: id }));
    };

    const getLevelPrefix = (level?: number) => {
        if (!level) {
            return '';
        }

        return '—'.repeat(level) + (level > 0 ? ' ' : '');
    };

    const hasActiveFilters = filters.search || filters.status || filters.organization_id;

    const stats = [
        { label: 'کل دسته‌بندی‌ها', value: categories.total, icon: FolderTree, color: 'cyan', gradient: 'from-cyan-500 to-blue-500', change: '+8%' },
        { label: 'دسته‌بندی‌های فعال', value: categories.data.filter(c => c.status).length, icon: Tag, color: 'emerald', gradient: 'from-emerald-500 to-teal-500', change: '+5%' },
        { label: 'سازمان‌ها', value: organizations.length, icon: Building2, color: 'purple', gradient: 'from-purple-500 to-pink-500', change: '+2%' },
        { label: 'سطوح', value: Math.max(...categories.data.map(c => c.level || 0), 0), icon: Layers, color: 'amber', gradient: 'from-amber-500 to-orange-500', change: '-' },
    ];

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
            <Head title="مدیریت دسته‌بندی نامه‌ها" />

            <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-50"></div>
                                        <div className="relative p-2.5 bg-linear-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                                            <FolderTree className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">مدیریت دسته‌بندی نامه‌ها</h1>
                                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                            <Sparkles className="h-3 w-3 text-cyan-500" />
                                            مدیریت دسته‌بندی‌های نامه‌های اداری
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
                                            ? 'bg-cyan-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        جدولی
                                    </button>
                                    <button
                                        onClick={() => setViewMode('cards')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'cards'
                                            ? 'bg-cyan-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        کارتی
                                    </button>
                                </div>
                                {can.create && (
                                    <Link
                                        href={categoriesRoute.create()}
                                        className="group relative inline-flex items-center px-5 py-2.5 bg-linear-to-r from-cyan-600 to-blue-600 rounded-xl text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <Plus className="ml-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
                                        دسته‌بندی جدید
                                        <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-slide-up">
                            {stats.map((stat, index) => (
                                <div key={stat.label} className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
                                    <div className="relative p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`p-2.5 bg-linear-to-br ${stat.gradient} rounded-xl shadow-md`}>
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
                                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                placeholder="جستجو بر اساس نام، کد..."
                                                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${showFilters || hasActiveFilters
                                                ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm'
                                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Filter className="ml-2 h-4 w-4" />
                                            فیلترها
                                            {hasActiveFilters && (
                                                <span className="mr-2 w-2 h-2 bg-cyan-600 rounded-full animate-pulse"></span>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSearch}
                                            className="px-6 py-2.5 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-sm"
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
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                                                        <select
                                                            value={selectedStatus}
                                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                        >
                                                            <option value="">همه وضعیت‌ها</option>
                                                            <option value="1">فعال</option>
                                                            <option value="0">غیرفعال</option>
                                                        </select>
                                                    </div>
                                                    {organizations.length > 0 && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">سازمان</label>
                                                            <select
                                                                value={selectedOrganization}
                                                                onChange={(e) => setSelectedOrganization(e.target.value)}
                                                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دسته‌بندی</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سازمان</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رنگ</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ترتیب</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {categories.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-16 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                                <FolderTree className="h-12 w-12 text-gray-400" />
                                                            </div>
                                                            <p className="text-gray-500 font-medium">هیچ دسته‌بندی‌ای یافت نشد</p>
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
                                                categories.data.map((category, index) => (
                                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className={`shrink-0 h-9 w-9 rounded-xl bg-linear-to-br ${getRandomGradient(category.id)} flex items-center justify-center text-white shadow-md`}>
                                                                    <FolderTree className="h-4 w-4" />
                                                                </div>
                                                                <div className="mr-3">
                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                        {getLevelPrefix(category.level)}{category.name}
                                                                    </p>
                                                                    {category.parent && (
                                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                                            والد: {category.parent.name}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-1.5">
                                                                <Hash className="h-3.5 w-3.5 text-gray-400" />
                                                                <span className="text-sm text-gray-600 font-mono">{category.code}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {category.organization ? (
                                                                <div className="flex items-center gap-1.5">
                                                                    <Building2 className="h-3.5 w-3.5 text-gray-400" />
                                                                    <span className="text-sm text-gray-600">{category.organization.name}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-7 h-7 rounded-xl shadow-sm"
                                                                    style={{ backgroundColor: category.color }}
                                                                />
                                                                <span className="text-xs text-gray-500 font-mono">{category.color}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50">
                                                                <SortAsc className="h-3 w-3 text-gray-400" />
                                                                <span className="text-sm text-gray-600">{category.sort_order}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => handleToggleStatus(category.id)}
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${category.status
                                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                                                    }`}
                                                            >
                                                                {category.status ? (
                                                                    <Power className="h-3 w-3" />
                                                                ) : (
                                                                    <PowerOff className="h-3 w-3" />
                                                                )}
                                                                {category.status ? 'فعال' : 'غیرفعال'}
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            <div className="flex items-center gap-1">
                                                                <Link
                                                                    href={categoriesRoute.show({ category: category.id })}
                                                                    className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-200"
                                                                    title="مشاهده"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                                {can.edit && (
                                                                    <Link
                                                                        href={categoriesRoute.edit({ category: category.id })}
                                                                        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                                                        title="ویرایش"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Link>
                                                                )}
                                                                {can.delete && (
                                                                    <button
                                                                        onClick={() => handleDelete(category)}
                                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                        title="حذف"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {categories.last_page > 1 && (
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-gray-600">
                                            نمایش <span className="font-medium text-gray-900">{categories.from}</span> تا{' '}
                                            <span className="font-medium text-gray-900">{categories.to}</span> از{' '}
                                            <span className="font-medium text-gray-900">{categories.total}</span> نتیجه
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Link
                                                href={categories.current_page > 1 ? categoriesRoute.index({ query: { page: categories.current_page - 1, ...filters } }) : '#'}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${categories.current_page > 1
                                                    ? 'text-gray-700 hover:bg-white hover:text-cyan-600 shadow-sm'
                                                    : 'text-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                            {[...Array(Math.min(5, categories.last_page))].map((_, i) => {
                                                let pageNum;

                                                if (categories.last_page <= 5) {
                                                    pageNum = i + 1;
                                                } else if (categories.current_page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (categories.current_page >= categories.last_page - 2) {
                                                    pageNum = categories.last_page - 4 + i;
                                                } else {
                                                    pageNum = categories.current_page - 2 + i;
                                                }

                                                return (
                                                    <Link
                                                        key={pageNum}
                                                        href={categoriesRoute.index({ query: { page: pageNum, ...filters } })}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${categories.current_page === pageNum
                                                            ? 'bg-linear-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                                                            : 'text-gray-700 hover:bg-white hover:text-cyan-600'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </Link>
                                                );
                                            })}
                                            <Link
                                                href={categories.current_page < categories.last_page ? categoriesRoute.index({ query: { page: categories.current_page + 1, ...filters } }) : '#'}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${categories.current_page < categories.last_page
                                                    ? 'text-gray-700 hover:bg-white hover:text-cyan-600 shadow-sm'
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
                                {categories.data.length === 0 ? (
                                    <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                <FolderTree className="h-12 w-12 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium">هیچ دسته‌بندی‌ای یافت نشد</p>
                                            <p className="text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                        </div>
                                    </div>
                                ) : (
                                    categories.data.map((category, index) => (
                                        <div key={category.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                            {/* Color Bar */}
                                            <div className="h-1.5" style={{ backgroundColor: category.color }} />

                                            <div className="p-5">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getRandomGradient(category.id)} flex items-center justify-center text-white shadow-md`}>
                                                            <FolderTree className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">
                                                                {getLevelPrefix(category.level)}{category.name}
                                                            </h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <code className="text-xs text-gray-500 font-mono">{category.code}</code>
                                                                {category.parent && (
                                                                    <span className="text-xs text-gray-400">• زیرمجموعه {category.parent.name}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleToggleStatus(category.id)}
                                                        className={`p-1.5 rounded-lg transition-all ${category.status
                                                            ? 'text-emerald-500 hover:bg-emerald-50'
                                                            : 'text-gray-400 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {category.status ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                                                    </button>
                                                </div>

                                                <div className="space-y-2.5">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">سازمان:</span>
                                                        <span className="text-gray-700">{category.organization?.name || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">ترتیب نمایش:</span>
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-gray-50">
                                                            <SortAsc className="h-3 w-3 text-gray-400" />
                                                            {category.sort_order}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">رنگ:</span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-lg shadow-sm" style={{ backgroundColor: category.color }} />
                                                            <span className="text-xs text-gray-500 font-mono">{category.color}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <Link
                                                            href={categoriesRoute.show({ category: category.id })}
                                                            className="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        {can.edit && (
                                                            <Link
                                                                href={categoriesRoute.edit({ category: category.id })}
                                                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        )}
                                                        {can.delete && (
                                                            <button
                                                                onClick={() => handleDelete(category)}
                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium ${category.status
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-gray-50 text-gray-500'
                                                        }`}>
                                                        {category.status ? 'فعال' : 'غیرفعال'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Pagination for Cards View */}
                        {viewMode === 'cards' && categories.last_page > 1 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                                <div className="text-sm text-gray-600">
                                    نمایش <span className="font-medium text-gray-900">{categories.from}</span> تا{' '}
                                    <span className="font-medium text-gray-900">{categories.to}</span> از{' '}
                                    <span className="font-medium text-gray-900">{categories.total}</span> نتیجه
                                </div>
                                <div className="flex gap-1.5">
                                    <Link
                                        href={categories.current_page > 1 ? categoriesRoute.index({ query: { page: categories.current_page - 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${categories.current_page > 1
                                            ? 'text-gray-700 hover:bg-white hover:text-cyan-600 shadow-sm'
                                            : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                    {[...Array(Math.min(5, categories.last_page))].map((_, i) => {
                                        let pageNum;

                                        if (categories.last_page <= 5) {
                                            pageNum = i + 1;
                                        } else if (categories.current_page <= 3) {
                                            pageNum = i + 1;
                                        } else if (categories.current_page >= categories.last_page - 2) {
                                            pageNum = categories.last_page - 4 + i;
                                        } else {
                                            pageNum = categories.current_page - 2 + i;
                                        }

                                        return (
                                            <Link
                                                key={pageNum}
                                                href={categoriesRoute.index({ query: { page: pageNum, ...filters } })}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${categories.current_page === pageNum
                                                    ? 'bg-linear-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-white hover:text-cyan-600'
                                                    }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        );
                                    })}
                                    <Link
                                        href={categories.current_page < categories.last_page ? categoriesRoute.index({ query: { page: categories.current_page + 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${categories.current_page < categories.last_page
                                            ? 'text-gray-700 hover:bg-white hover:text-cyan-600 shadow-sm'
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
                .delay-300 {
                    animation-delay: 300ms;
                }
            `}</style>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedCategory && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedCategory(null);
                    }}
                    onConfirm={confirmDelete}
                    title="حذف دسته‌بندی"
                    message="آیا از حذف این دسته‌بندی اطمینان دارید؟"
                    itemName={selectedCategory.name}
                    type="department"
                    isLoading={deleting}
                />
            )}
        </>
    );
}