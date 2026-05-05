import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Pencil, Trash2, Search, Briefcase, ChevronLeft, ChevronRight,
    Eye, Filter, X, Users, TrendingUp,
    Layers, Sparkles, Star, Crown, Shield, Building2,
    UserCheck
} from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

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

    const handleDelete = (position: Position) => {
        setSelectedPosition(position);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedPosition) {
            return;
        }

        setDeleting(true);
        router.delete(positionsRoute.destroy({ position: selectedPosition.id }), {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
                setSelectedPosition(null);
            },
        });
    };

    const hasActiveFilters = filters.search || filters.department_id;

    const stats = [
        { label: 'مجموع وظایف', value: positions.total, icon: Briefcase, color: 'purple', gradient: 'from-purple-500 to-pink-600', change: '+12%' },
        { label: 'وظایف مدیریتی', value: positions.data.filter(p => p.is_management).length, icon: Crown, color: 'amber', gradient: 'from-amber-500 to-orange-600', change: '+5%' },
        { label: 'ریاست ها', value: new Set(positions.data.map(p => p.department_id)).size, icon: Layers, color: 'indigo', gradient: 'from-indigo-500 to-blue-600', change: '+8%' },
        { label: 'میانگین سطح', value: (positions.data.reduce((acc, p) => acc + p.level, 0) / positions.data.length || 0).toFixed(1), icon: TrendingUp, color: 'emerald', gradient: 'from-emerald-500 to-teal-600', change: '-' },
    ];

    const getRandomGradient = (id: number) => {
        const gradients = [
            'from-purple-500 to-pink-600',
            'from-amber-500 to-orange-600',
            'from-indigo-500 to-blue-600',
            'from-emerald-500 to-teal-600',
            'from-rose-500 to-red-600',
        ];

        return gradients[id % gradients.length];
    };

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    const getLevelBadge = (level: number) => {
        if (level === 0) {
            return { label: 'پایه', color: 'gray', icon: UserCheck };
        }

        if (level === 1) {
            return { label: 'کارشناس', color: 'blue', icon: Shield };
        }

        if (level === 2) {
            return { label: 'کارشناس ارشد', color: 'emerald', icon: Star };
        }

        if (level === 3) {
            return { label: 'مدیر', color: 'amber', icon: Crown };
        }

        return { label: `سطح ${level}`, color: 'purple', icon: TrendingUp };
    };

    return (
        <>
            <Head title="مدیریت وظایف" />

            <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-600 rounded-xl blur-lg opacity-50"></div>
                                        <div className="relative p-2.5 bg-linear-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                            <Briefcase className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">وظایف </h1>
                                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                            <Sparkles className="h-3 w-3 text-purple-500" />
                                            مدیریت وظایف و سطوح دسترسی
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
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        جدولی
                                    </button>
                                    <button
                                        onClick={() => setViewMode('cards')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'cards'
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        کارتی
                                    </button>
                                </div>
                                {can.create && (
                                    <Link
                                        href={positionsRoute.create()}
                                        className="group relative inline-flex items-center px-5 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl text-sm font-medium text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <Plus className="ml-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
                                        وظیفه جدید
                                        <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-slide-up">
                            {stats.map((stat) => (
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
                                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                placeholder="جستجو بر اساس نام، کد، ریاست..."
                                                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${showFilters || hasActiveFilters
                                                ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm'
                                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Filter className="ml-2 h-4 w-4" />
                                            فیلترها
                                            {hasActiveFilters && (
                                                <span className="mr-2 w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSearch}
                                            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm"
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
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">دیپارتمنت ها</label>
                                                        <select
                                                            value={selectedDepartment}
                                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        >
                                                            <option value="">همه ریاست ها</option>
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
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">وظیفه</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">وزارت</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">ریاست</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">نوع</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {positions.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-16 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                                <Briefcase className="h-12 w-12 text-gray-400" />
                                                            </div>
                                                            <p className="text-gray-500 font-medium">هیچ وظیفه ای یافت نشد</p>
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
                                                positions.data.map((position, index) => {
                                                    return (
                                                        <tr key={position.id} className="hover:bg-gray-50 transition-colors group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    <div className={`shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br ${getRandomGradient(position.id)} flex items-center justify-center text-white font-bold shadow-md`}>
                                                                        {getInitials(position.name)}
                                                                    </div>
                                                                    <div className="mr-3">
                                                                        <p className="text-sm font-semibold text-gray-900">{position.name}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {position?.department?.organization ? (
                                                                    <Link
                                                                        href={departmentsRoute.show({ department: position?.department?.organization.id })}
                                                                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-purple-600 transition-colors group"
                                                                    >
                                                                        <Building2 className="h-3.5 w-3.5" />
                                                                        {position?.department?.organization.name}
                                                                    </Link>
                                                                ) : (
                                                                    <span className="text-sm text-gray-400">-</span>
                                                                )}
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                {position.department ? (
                                                                    <Link
                                                                        href={departmentsRoute.show({ department: position.department.id })}
                                                                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-purple-600 transition-colors group"
                                                                    >
                                                                        <Building2 className="h-3.5 w-3.5" />
                                                                        {position.department.name}
                                                                    </Link>
                                                                ) : (
                                                                    <span className="text-sm text-gray-400">-</span>
                                                                )}
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                {position.is_management ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                                        <Crown className="h-3.5 w-3.5" />
                                                                        مدیریتی
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                                                        <Users className="h-3.5 w-3.5" />
                                                                        عادی
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-left">
                                                                <div className="flex items-center gap-1">
                                                                    <Link
                                                                        href={positionsRoute.show({ position: position.id })}
                                                                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                                                                        title="مشاهده"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                    {can.edit && (
                                                                        <Link
                                                                            href={positionsRoute.edit({ position: position.id })}
                                                                            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                                                            title="ویرایش"
                                                                        >
                                                                            <Pencil className="h-4 w-4" />
                                                                        </Link>
                                                                    )}
                                                                    {can.delete && (
                                                                        <button
                                                                            onClick={() => handleDelete(position)}
                                                                            className="p-2 text-gray-500 hover:text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-all duration-200"
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
                                {positions.last_page > 1 && (
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-gray-600">
                                            نمایش <span className="font-medium text-gray-900">{positions.from}</span> تا{' '}
                                            <span className="font-medium text-gray-900">{positions.to}</span> از{' '}
                                            <span className="font-medium text-gray-900">{positions.total}</span> نتیجه
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Link
                                                href={positions.current_page > 1 ? positionsRoute.index({ query: { page: positions.current_page - 1, ...filters } }) : '#'}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${positions.current_page > 1
                                                    ? 'text-gray-700 hover:bg-white hover:text-purple-600 shadow-sm'
                                                    : 'text-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                            {(() => {
                                                const pages = [];
                                                const maxVisible = 5;
                                                let start = Math.max(1, positions.current_page - Math.floor(maxVisible / 2));
                                                const end = Math.min(positions.last_page, start + maxVisible - 1);

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
                                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${positions.current_page === i
                                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
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
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${positions.current_page < positions.last_page
                                                    ? 'text-gray-700 hover:bg-white hover:text-purple-600 shadow-sm'
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
                                {positions.data.length === 0 ? (
                                    <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                <Briefcase className="h-12 w-12 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium">هیچ وظیفه ای یافت نشد</p>
                                            <p className="text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                        </div>
                                    </div>
                                ) : (
                                    positions.data.map((position, index) => {
                                        const levelBadge = getLevelBadge(position.level);
                                        const LevelIcon = levelBadge.icon;

                                        return (
                                            <div key={position.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                                {/* Header Bar */}
                                                <div className={`h-1.5 bg-gradient-to-r ${getRandomGradient(position.id)}`} />

                                                <div className="p-5">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getRandomGradient(position.id)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                                                {getInitials(position.name)}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900">{position.name}</h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <code className="text-xs text-gray-500 font-mono">کد: {position.code}</code>
                                                                    {position.is_management && (
                                                                        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                                                                            <Crown className="h-3 w-3" />
                                                                            مدیریتی
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {position.is_management && (
                                                            <div className="p-1.5 bg-amber-50 rounded-lg">
                                                                <Star className="h-4 w-4 text-amber-500" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-500">دیپارتمنت ها:</span>
                                                            {position.department ? (
                                                                <Link
                                                                    href={departmentsRoute.show({ department: position.department.id })}
                                                                    className="text-gray-700 hover:text-purple-600 transition-colors inline-flex items-center gap-1"
                                                                >
                                                                    <Building2 className="h-3.5 w-3.5" />
                                                                    {position.department.name}
                                                                </Link>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-500">سطح:</span>
                                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50">
                                                                <LevelIcon className="h-3.5 w-3.5 text-gray-500" />
                                                                <span className="text-sm font-medium text-gray-700">{levelBadge.label}</span>
                                                            </div>
                                                        </div>
                                                        {position.description && (
                                                            <div className="flex items-start gap-2 text-sm">
                                                                <span className="text-gray-500 shrink-0">توضیحات:</span>
                                                                <span className="text-gray-600 line-clamp-2">{position.description}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <Link
                                                                href={positionsRoute.show({ position: position.id })}
                                                                className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            {can.edit && (
                                                                <Link
                                                                    href={positionsRoute.edit({ position: position.id })}
                                                                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            )}
                                                            {can.delete && (
                                                                <button
                                                                    onClick={() => handleDelete(position)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                                            <Users className="h-3 w-3" />
                                                            {position.users_count || 0} کاربر
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
                        {viewMode === 'cards' && positions.last_page > 1 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                                <div className="text-sm text-gray-600">
                                    نمایش <span className="font-medium text-gray-900">{positions.from}</span> تا{' '}
                                    <span className="font-medium text-gray-900">{positions.to}</span> از{' '}
                                    <span className="font-medium text-gray-900">{positions.total}</span> نتیجه
                                </div>
                                <div className="flex gap-1.5">
                                    <Link
                                        href={positions.current_page > 1 ? positionsRoute.index({ query: { page: positions.current_page - 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${positions.current_page > 1
                                            ? 'text-gray-700 hover:bg-white hover:text-purple-600 shadow-sm'
                                            : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                    {[...Array(Math.min(5, positions.last_page))].map((_, i) => {
                                        let pageNum;

                                        if (positions.last_page <= 5) {
                                            pageNum = i + 1;
                                        } else if (positions.current_page <= 3) {
                                            pageNum = i + 1;
                                        } else if (positions.current_page >= positions.last_page - 2) {
                                            pageNum = positions.last_page - 4 + i;
                                        } else {
                                            pageNum = positions.current_page - 2 + i;
                                        }

                                        return (
                                            <Link
                                                key={pageNum}
                                                href={positionsRoute.index({ query: { page: pageNum, ...filters } })}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${positions.current_page === pageNum
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-white hover:text-purple-600'
                                                    }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        );
                                    })}
                                    <Link
                                        href={positions.current_page < positions.last_page ? positionsRoute.index({ query: { page: positions.current_page + 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${positions.current_page < positions.last_page
                                            ? 'text-gray-700 hover:bg-white hover:text-purple-600 shadow-sm'
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
            {showDeleteModal && selectedPosition && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedPosition(null);
                    }}
                    onConfirm={confirmDelete}
                    title="حذف سمت"
                    message="آیا از حذف این سمت اطمینان دارید؟"
                    itemName={selectedPosition.name}
                    type="department"
                    isLoading={deleting}
                />
            )}
        </>
    );
}