import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, Search, Eye, Filter, X, 
    Building2, Hash, MapPin, CheckCircle, XCircle,
    TrendingUp, Sparkles, Database, 
    ChevronLeft, ChevronRight, Home,
    Archive as ArchiveIcon,
    Pencil,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import archivesRoute from '@/routes/archives';
import type { Archive, Department } from '@/types';

interface Props {
    archives: {
        data: Archive[];
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

export default function ArchivesIndex({ archives, departments, filters, can }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedDepartment, setSelectedDepartment] = useState(filters.department_id || '');
    const [showFilters, setShowFilters] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedArchive, setSelectedArchive] = useState<Archive | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    const handleSearch = () => {
        router.get(archivesRoute.index(), {
            search: searchTerm,
            department_id: selectedDepartment,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedDepartment('');
        router.get(archivesRoute.index(), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (archive: Archive) => {
        setSelectedArchive(archive);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedArchive) {
return;
}
        
        setDeleting(true);
        router.delete(archivesRoute.destroy({ archive: selectedArchive.id }), {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
                setSelectedArchive(null);
            },
        });
    };

    const getLevelPrefix = (level?: number) => {
        if (!level) {
return '';
}

        return '—'.repeat(level) + (level > 0 ? ' ' : '');
    };

    const hasActiveFilters = filters.search || filters.department_id;

    const stats = [
        { label: 'کل بایگانی‌ها', value: archives.total, icon: ArchiveIcon, color: 'blue', gradient: 'from-blue-500 to-cyan-600', change: '+8%' },
        { label: 'بایگانی‌های فعال', value: archives.data.filter(a => a.is_active).length, icon: CheckCircle, color: 'emerald', gradient: 'from-emerald-500 to-teal-600', change: '+5%' },
        { label: 'دپارتمان‌ها', value: departments.length, icon: Building2, color: 'purple', gradient: 'from-purple-500 to-pink-600', change: '+3%' },
        { label: 'اسناد بایگانی', value: archives.data.reduce((acc, a) => acc + (a.cases_count || 0), 0), icon: Database, color: 'amber', gradient: 'from-amber-500 to-orange-600', change: '-' },
    ];

    const getRandomGradient = (id: number) => {
        const gradients = [
            'from-blue-500 to-cyan-600',
            'from-emerald-500 to-teal-600',
            'from-purple-500 to-pink-600',
            'from-amber-500 to-orange-600',
            'from-indigo-500 to-blue-600',
        ];

        return gradients[id % gradients.length];
    };

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <>
            <Head title="مدیریت بایگانی" />

            <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-600 rounded-xl blur-lg opacity-50"></div>
                                        <div className="relative p-2.5 bg-linear-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                                            <ArchiveIcon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">مدیریت بایگانی</h1>
                                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                            <Sparkles className="h-3 w-3 text-blue-500" />
                                            مدیریت بایگانی اسناد و پرونده‌ها
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
                                        href={archivesRoute.create()}
                                        className="group relative inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <Plus className="ml-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
                                        بایگانی جدید
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
                                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                placeholder="جستجو بر اساس نام، کد..."
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
                                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm"
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
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">دپارتمان</label>
                                                        <select
                                                            value={selectedDepartment}
                                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">بایگانی</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دپارتمان</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">موقعیت</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {archives.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-16 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                                <ArchiveIcon className="h-12 w-12 text-gray-400" />
                                                            </div>
                                                            <p className="text-gray-500 font-medium">هیچ بایگانی‌ای یافت نشد</p>
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
                                                archives.data.map((archive, index) => (
                                                    <tr key={archive.id} className="hover:bg-gray-50 transition-colors group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className={`shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br ${getRandomGradient(archive.id)} flex items-center justify-center text-white font-bold shadow-md`}>
                                                                    {getInitials(archive.name)}
                                                                </div>
                                                                <div className="mr-3">
                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                        {getLevelPrefix(archive.parent ? 1 : 0)}{archive.name}
                                                                    </p>
                                                                    {archive.parent && (
                                                                        <div className="flex items-center gap-2 mt-0.5">
                                                                            <Home className="h-3 w-3 text-gray-400" />
                                                                            <span className="text-xs text-gray-400">زیرمجموعه: {archive.parent.name}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                                                                <Hash className="h-3.5 w-3.5 text-gray-400" />
                                                                <code className="text-sm font-mono text-gray-700">{archive.code}</code>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {archive.department ? (
                                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                                    <Building2 className="h-3.5 w-3.5" />
                                                                    {archive.department.name}
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {archive.location ? (
                                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                                    <MapPin className="h-3.5 w-3.5" />
                                                                    {archive.location}
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${
                                                                archive.is_active
                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                    : 'bg-gray-50 text-gray-500 border border-gray-200'
                                                            }`}>
                                                                {archive.is_active ? (
                                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                                ) : (
                                                                    <XCircle className="h-3.5 w-3.5" />
                                                                )}
                                                                {archive.is_active ? 'فعال' : 'غیرفعال'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            <div className="flex items-center gap-1">
                                                                <Link
                                                                    href={archivesRoute.show({ archive: archive.id })}
                                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                                    title="مشاهده"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                                {can.edit && (
                                                                    <Link
                                                                        href={archivesRoute.edit({ archive: archive.id })}
                                                                        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                                        title="ویرایش"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Link>
                                                                )}
                                                                {can.delete && (
                                                                    <button
                                                                        onClick={() => handleDelete(archive)}
                                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
                                {archives.last_page > 1 && (
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-gray-600">
                                            نمایش <span className="font-medium text-gray-900">{archives.from}</span> تا{' '}
                                            <span className="font-medium text-gray-900">{archives.to}</span> از{' '}
                                            <span className="font-medium text-gray-900">{archives.total}</span> نتیجه
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Link
                                                href={archives.current_page > 1 ? archivesRoute.index({ query: { page: archives.current_page - 1, ...filters } }) : '#'}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${archives.current_page > 1
                                                    ? 'text-gray-700 hover:bg-white hover:text-blue-600 shadow-sm'
                                                    : 'text-gray-300 cursor-not-allowed'
                                                }`}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                            {(() => {
                                                const pages = [];
                                                const maxVisible = 5;
                                                let start = Math.max(1, archives.current_page - Math.floor(maxVisible / 2));
                                                const end = Math.min(archives.last_page, start + maxVisible - 1);
                                                
                                                if (end - start + 1 < maxVisible) {
                                                    start = Math.max(1, end - maxVisible + 1);
                                                }
                                                
                                                for (let i = start; i <= end; i++) {
                                                    pages.push(i);
                                                }
                                                
                                                return pages.map((page) => (
                                                    <Link
                                                        key={page}
                                                        href={archivesRoute.index({ query: { page, ...filters } })}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${archives.current_page === page
                                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                                                            : 'text-gray-700 hover:bg-white hover:text-blue-600'
                                                        }`}
                                                    >
                                                        {page}
                                                    </Link>
                                                ));
                                            })()}
                                            <Link
                                                href={archives.current_page < archives.last_page ? archivesRoute.index({ query: { page: archives.current_page + 1, ...filters } }) : '#'}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${archives.current_page < archives.last_page
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
                                {archives.data.length === 0 ? (
                                    <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                <ArchiveIcon className="h-12 w-12 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium">هیچ بایگانی‌ای یافت نشد</p>
                                            <p className="text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                        </div>
                                    </div>
                                ) : (
                                    archives.data.map((archive, index) => (
                                        <div key={archive.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                            {/* Header Bar */}
                                            <div className={`h-1.5 bg-gradient-to-r ${getRandomGradient(archive.id)}`} />
                                            
                                            <div className="p-5">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getRandomGradient(archive.id)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                                            {getInitials(archive.name)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900">{archive.name}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <code className="text-xs text-gray-500 font-mono">کد: {archive.code}</code>
                                                                {archive.parent && (
                                                                    <>
                                                                        <span className="text-gray-300">•</span>
                                                                        <span className="text-xs text-gray-400">زیرمجموعه {archive.parent.name}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium ${
                                                        archive.is_active
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : 'bg-gray-50 text-gray-500 border border-gray-200'
                                                    }`}>
                                                        {archive.is_active ? 'فعال' : 'غیرفعال'}
                                                    </span>
                                                </div>

                                                <div className="space-y-2.5">
                                                    {archive.department && (
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-500">دپارتمان:</span>
                                                            <span className="text-gray-700 inline-flex items-center gap-1">
                                                                <Building2 className="h-3.5 w-3.5" />
                                                                {archive.department.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {archive.location && (
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-500">موقعیت:</span>
                                                            <span className="text-gray-700 inline-flex items-center gap-1">
                                                                <MapPin className="h-3.5 w-3.5" />
                                                                {archive.location}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {archive.description && (
                                                        <div className="flex items-start gap-2 text-sm">
                                                            <span className="text-gray-500 shrink-0">توضیحات:</span>
                                                            <span className="text-gray-600 line-clamp-2">{archive.description}</span>
                                                        </div>
                                                    )}
                                                    {!archive.department && !archive.location && !archive.description && (
                                                        <div className="text-sm text-gray-400 text-center py-2">اطلاعات تکمیلی ثبت نشده است</div>
                                                    )}
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <Link
                                                            href={archivesRoute.show({ archive: archive.id })}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        {can.edit && (
                                                            <Link
                                                                href={archivesRoute.edit({ archive: archive.id })}
                                                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        )}
                                                        {can.delete && (
                                                            <button
                                                                onClick={() => handleDelete(archive)}
                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <Database className="h-3 w-3" />
                                                        {archive.cases_count || 0} پرونده
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Pagination for Cards View */}
                        {viewMode === 'cards' && archives.last_page > 1 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                                <div className="text-sm text-gray-600">
                                    نمایش <span className="font-medium text-gray-900">{archives.from}</span> تا{' '}
                                    <span className="font-medium text-gray-900">{archives.to}</span> از{' '}
                                    <span className="font-medium text-gray-900">{archives.total}</span> نتیجه
                                </div>
                                <div className="flex gap-1.5">
                                    <Link
                                        href={archives.current_page > 1 ? archivesRoute.index({ query: { page: archives.current_page - 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${archives.current_page > 1
                                            ? 'text-gray-700 hover:bg-white hover:text-blue-600 shadow-sm'
                                            : 'text-gray-300 cursor-not-allowed'
                                        }`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                    {[...Array(Math.min(5, archives.last_page))].map((_, i) => {
                                        let pageNum;

                                        if (archives.last_page <= 5) {
                                            pageNum = i + 1;
                                        } else if (archives.current_page <= 3) {
                                            pageNum = i + 1;
                                        } else if (archives.current_page >= archives.last_page - 2) {
                                            pageNum = archives.last_page - 4 + i;
                                        } else {
                                            pageNum = archives.current_page - 2 + i;
                                        }

                                        return (
                                            <Link
                                                key={pageNum}
                                                href={archivesRoute.index({ query: { page: pageNum, ...filters } })}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${archives.current_page === pageNum
                                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-white hover:text-blue-600'
                                                }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        );
                                    })}
                                    <Link
                                        href={archives.current_page < archives.last_page ? archivesRoute.index({ query: { page: archives.current_page + 1, ...filters } }) : '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${archives.current_page < archives.last_page
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
            {showDeleteModal && selectedArchive && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedArchive(null);
                    }}
                    onConfirm={confirmDelete}
                    title="حذف بایگانی"
                    message="آیا از حذف این بایگانی اطمینان دارید؟"
                    itemName={selectedArchive.name}
                    type="archive"
                    isLoading={deleting}
                />
            )}
        </>
    );
}