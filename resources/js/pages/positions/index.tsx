import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, Briefcase, ChevronLeft, ChevronRight, Eye, Filter, X, Award, Users, TrendingUp, CheckCircle, AlertCircle, Layers } from 'lucide-react';
import { useState } from 'react';
import departmentsRoute from '@/routes/departments';
import positionsRoute from '@/routes/positions';
import type { Position, Department } from '@/types';

interface Props {
    positions: {
        data: Position[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    departments: Department[];
    filters: {
        search?: string;
        department_id?: string;
    };
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
}

export default function PositionsIndex({ positions, departments, filters, can }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedDepartment, setSelectedDepartment] = useState(filters.department_id || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => {
        router.get(positionsRoute.index(), {
            search: searchTerm,
            department_id: selectedDepartment,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedDepartment('');
        router.get(positionsRoute.index(), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`آیا از حذف سمت "${name}" اطمینان دارید؟`)) {
            router.delete(positionsRoute.destroy({ position: id }));
        }
    };

    const hasActiveFilters = filters.search || filters.department_id;

    // Statistics
    const stats = {
        total: positions.total,
        management: positions.data.filter(p => p.is_management).length,
        departments: new Set(positions.data.map(p => p.department_id)).size,
    };

    return (
        <>
            <Head title="مدیریت سمت‌ها" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                                        <Briefcase className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">سمت‌های سازمانی</h1>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            مدیریت پست‌های سازمانی و سطوح دسترسی
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {can.create && (
                                <Link
                                    href={positionsRoute.create()}
                                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <Plus className="ml-2 h-4 w-4" />
                                    سمت جدید
                                </Link>
                            )}
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">کل سمت‌ها</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <Briefcase className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">سمت‌های مدیریتی</p>
                                        <p className="text-2xl font-bold text-amber-600">{stats.management}</p>
                                    </div>
                                    <div className="p-3 bg-amber-50 rounded-lg">
                                        <Award className="h-6 w-6 text-amber-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">دپارتمان‌های مرتبط</p>
                                        <p className="text-2xl font-bold text-indigo-600">{stats.departments}</p>
                                    </div>
                                    <div className="p-3 bg-indigo-50 rounded-lg">
                                        <Layers className="h-6 w-6 text-indigo-600" />
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
                                                placeholder="جستجو بر اساس نام، کد، دپارتمان..."
                                                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                                showFilters || hasActiveFilters
                                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Filter className="ml-2 h-4 w-4" />
                                            فیلترها
                                            {hasActiveFilters && (
                                                <span className="mr-2 w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSearch}
                                            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all shadow-sm"
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
                                                <label className="block text-sm font-medium text-gray-700 mb-2">دپارتمان</label>
                                                <select
                                                    value={selectedDepartment}
                                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                >
                                                    <option value="">همه دپارتمان‌ها</option>
                                                    {departments.map((dept) => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
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

                        {/* Positions Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سمت</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دپارتمان</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سطح</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {positions.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Briefcase className="h-12 w-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500 font-medium">هیچ سمت سازمانی یافت نشد</p>
                                                        <p className="text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                                        {hasActiveFilters && (
                                                            <button
                                                                onClick={handleReset}
                                                                className="mt-4 text-purple-600 hover:text-purple-700 text-sm font-medium"
                                                            >
                                                                پاک کردن فیلترها
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            positions.data.map((position) => (
                                                <tr key={position.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className={`flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center ${
                                                                position.is_management 
                                                                    ? 'bg-gradient-to-br from-amber-100 to-amber-200' 
                                                                    : 'bg-gray-100'
                                                            }`}>
                                                                <Briefcase className={`h-4 w-4 ${
                                                                    position.is_management ? 'text-amber-700' : 'text-gray-500'
                                                                }`} />
                                                            </div>
                                                            <div className="mr-3">
                                                                <p className="text-sm font-medium text-gray-900">{position.name}</p>
                                                                {position.is_management && (
                                                                    <p className="text-xs text-amber-600 mt-0.5 inline-flex items-center gap-1">
                                                                        <Award className="h-3 w-3" />
                                                                        پست مدیریتی
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
                                                            {position.code}
                                                        </code>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {position.department ? (
                                                            <Link
                                                                href={departmentsRoute.show({ department: position.department.id })}
                                                                className="text-sm text-gray-600 hover:text-purple-600 transition-colors inline-flex items-center gap-1"
                                                            >
                                                                <Layers className="h-3 w-3" />
                                                                {position.department.name}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1">
                                                            <TrendingUp className="h-3 w-3 text-gray-400" />
                                                            <span className="text-sm text-gray-600">سطح {position.level}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {position.is_management ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                                                <Award className="h-3 w-3" />
                                                                مدیریتی
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
                                                                <Users className="h-3 w-3" />
                                                                عادی
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-left">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={positionsRoute.show({ position: position.id })}
                                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                                title="مشاهده"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            {can.edit && (
                                                                <Link
                                                                    href={positionsRoute.edit(position.id)}
                                                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                                    title="ویرایش"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            )}
                                                            {can.delete && (
                                                                <button
                                                                    onClick={() => handleDelete(position.id, position.name)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                            {positions.last_page > 1 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        نمایش <span className="font-medium">{positions.from}</span> تا{' '}
                                        <span className="font-medium">{positions.to}</span> از{' '}
                                        <span className="font-medium">{positions.total}</span> نتیجه
                                    </div>
                                    <div className="flex gap-1.5">
                                        <Link
                                            href={positions.current_page > 1 ? positionsRoute.index({ query: { page: positions.current_page - 1, ...filters } }) : '#'}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                positions.current_page > 1
                                                    ? 'text-gray-700 hover:bg-white hover:text-purple-600'
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                        {(() => {
                                            const pages = [];
                                            const maxVisible = 5;
                                            let start = Math.max(1, positions.current_page - Math.floor(maxVisible / 2));
                                            let end = Math.min(positions.last_page, start + maxVisible - 1);
                                            
                                            if (end - start + 1 < maxVisible) {
                                                start = Math.max(1, end - maxVisible + 1);
                                            }
                                            
                                            if (start > 1) {
                                                pages.push(
                                                    <Link
                                                        key={1}
                                                        href={positionsRoute.index({ query: { page: 1, ...filters } })}
                                                        className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:text-purple-600 transition-colors"
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
                                                        href={positionsRoute.index({ query: { page: i, ...filters } })}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                            positions.current_page === i
                                                                ? 'bg-purple-600 text-white shadow-sm'
                                                                : 'text-gray-700 hover:bg-white hover:text-purple-600'
                                                        }`}
                                                    >
                                                        {i}
                                                    </Link>
                                                );
                                            }
                                            
                                            if (end < positions.last_page) {
                                                if (end < positions.last_page - 1) {
                                                    pages.push(<span key="dots2" className="px-2 text-gray-400">...</span>);
                                                }
                                                
                                                pages.push(
                                                    <Link
                                                        key={positions.last_page}
                                                        href={positionsRoute.index({ query: { page: positions.last_page, ...filters } })}
                                                        className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:text-purple-600 transition-colors"
                                                    >
                                                        {positions.last_page}
                                                    </Link>
                                                );
                                            }
                                            
                                            return pages;
                                        })()}
                                        <Link
                                            href={positions.current_page < positions.last_page ? positionsRoute.index({ query: { page: positions.current_page + 1, ...filters } }) : '#'}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                positions.current_page < positions.last_page
                                                    ? 'text-gray-700 hover:bg-white hover:text-purple-600'
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