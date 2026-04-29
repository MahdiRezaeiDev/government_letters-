import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Search, Filter, Eye, Edit, Trash2,
    ChevronLeft, ChevronRight, FileText,
    Inbox, Send, File, Clock, AlertCircle,
    TrendingUp, Calendar, X, Mail, CheckCircle,
    AlertTriangle, Archive, Clock as ClockIcon
} from 'lucide-react';
import React, { useState } from 'react';
import lettersRoute from '@/routes/letters';
import type { Letter, PaginatedResponse, LetterCategory } from '@/types';

interface Props {
    letters: PaginatedResponse<Letter>;
    categories: LetterCategory[];
    filters: {
        search?: string;
        letter_type?: string;
        status?: string;
        priority?: string;
        date_from?: string;
        date_to?: string;
    };
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
    types: Record<string, string>;
    statuses: Record<string, string>;
    priorities: Record<string, string>;
}

export default function LettersIndex({ letters, categories, filters, can, types, statuses, priorities }: Props) {

    console.log(can);


    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.letter_type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedPriority, setSelectedPriority] = useState(filters.priority || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => {
        router.get(lettersRoute.index(), {
            search: searchTerm,
            letter_type: selectedType,
            status: selectedStatus,
            priority: selectedPriority,
            date_from: filters.date_from,
            date_to: filters.date_to,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedType('');
        setSelectedStatus('');
        setSelectedPriority('');
        router.get(lettersRoute.index(), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, subject: string) => {
        if (confirm(`آیا از حذف نامه "${subject}" اطمینان دارید؟`)) {
            router.delete(lettersRoute.destroy({ letter: id }));
        }
    };

    const priorityConfig: Record<string, { label: string; color: string; bg: string; text: string; icon: any }> = {
        low: { label: 'کم', color: 'gray', bg: 'bg-gray-50', text: 'text-gray-600', icon: AlertCircle },
        normal: { label: 'معمولی', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', icon: Mail },
        high: { label: 'بالا', color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-700', icon: TrendingUp },
        urgent: { label: 'فوری', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700', icon: AlertTriangle },
        very_urgent: { label: 'خیلی فوری', color: 'red', bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string; text: string; icon: any }> = {
        draft: { label: 'پیش‌نویس', color: 'gray', bg: 'bg-gray-50', text: 'text-gray-600', icon: FileText },
        pending: { label: 'در انتظار', color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-700', icon: ClockIcon },
        approved: { label: 'تایید شده', color: 'green', bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
        rejected: { label: 'رد شده', color: 'red', bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
        archived: { label: 'بایگانی شده', color: 'gray', bg: 'bg-gray-50', text: 'text-gray-500', icon: Archive },
    };

    const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
        incoming: { label: 'وارد', icon: Inbox, color: 'blue' },
        outgoing: { label: 'صادر', icon: Send, color: 'green' },
        internal: { label: 'داخلی', icon: File, color: 'purple' },
    };

    const hasActiveFilters = filters.search || filters.status || filters.priority || filters.letter_type;

    // Statistics
    const stats = {
        total: letters.total,
        pending: letters.data.filter(l => l.final_status === 'pending').length,
        approved: letters.data.filter(l => l.final_status === 'approved').length,
        urgent: letters.data.filter(l => l.priority === 'urgent' || l.priority === 'very_urgent').length,
    };

    return (
        <>
            <Head title="مدیریت نامه‌ها" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">مدیریت نامه‌ها</h1>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            مدیریت و پیگیری نامه‌های اداری
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {can.create && (
                                <Link
                                    href={lettersRoute.create()}
                                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <Plus className="ml-2 h-4 w-4" />
                                    نامه جدید
                                </Link>
                            )}
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">کل نامه‌ها</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">در انتظار بررسی</p>
                                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                    </div>
                                    <div className="p-3 bg-yellow-50 rounded-lg">
                                        <Clock className="h-6 w-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">تایید شده</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">نامه‌های فوری</p>
                                        <p className="text-2xl font-bold text-orange-600">{stats.urgent}</p>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-lg">
                                        <AlertCircle className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Type Filters */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                <button
                                    onClick={() => {
                                        setSelectedType('');
                                        handleSearch();
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${!selectedType
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    همه
                                </button>
                                {Object.entries(types).map(([key, label]) => {
                                    const Icon = typeConfig[key]?.icon || File;

                                    return (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSelectedType(key);
                                                handleSearch();
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap inline-flex items-center gap-2 ${selectedType === key
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {label}
                                        </button>
                                    );
                                })}
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
                                                placeholder="جستجو بر اساس شماره، موضوع، متن..."
                                                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${showFilters || hasActiveFilters
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
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">همه وضعیت‌ها</option>
                                                    {Object.entries(statuses).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">اولویت</label>
                                                <select
                                                    value={selectedPriority}
                                                    onChange={(e) => setSelectedPriority(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">همه اولویت‌ها</option>
                                                    {Object.entries(priorities).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
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

                        {/* Letters Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">موضوع</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اولویت</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {letters.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FileText className="h-12 w-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500 font-medium">هیچ نامه‌ای یافت نشد</p>
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
                                            letters.data.map((letter) => {
                                                const priority = priorityConfig[letter.priority] || priorityConfig.normal;
                                                const PriorityIcon = priority.icon;
                                                const status = statusConfig[letter.final_status] || statusConfig.draft;
                                                const StatusIcon = status.icon;
                                                const TypeIcon = typeConfig[letter.letter_type]?.icon || File;

                                                return (
                                                    <tr key={letter.id} className="hover:bg-gray-50 transition-colors group">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
                                                                {letter.letter_number}
                                                            </code>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                                {letter.subject}
                                                            </p>
                                                            {letter.description && (
                                                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                                    {letter.description.substring(0, 100)}...
                                                                </p>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                                                <TypeIcon className="h-4 w-4 text-blue-500" />
                                                                {types[letter.letter_type]}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.text}`}>
                                                                <PriorityIcon className="h-3 w-3" />
                                                                {priority.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                                                <StatusIcon className="h-3 w-3" />
                                                                {status.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                <Calendar className="h-3 w-3" />
                                                                {letter.date}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            <div className="flex items-center gap-2">
                                                                <Link
                                                                    href={lettersRoute.show({ letter: letter.id })}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="مشاهده"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                                {can.edit && letter.is_draft && (
                                                                    <Link
                                                                        href={lettersRoute.edit({ letter: letter.id })}
                                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                                        title="ویرایش"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Link>
                                                                )}
                                                                {can.delete && (
                                                                    <button
                                                                        onClick={() => handleDelete(letter.id, letter.subject)}
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
                            {letters.last_page > 1 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        نمایش <span className="font-medium">{letters.from}</span> تا{' '}
                                        <span className="font-medium">{letters.to}</span> از{' '}
                                        <span className="font-medium">{letters.total}</span> نتیجه
                                    </div>
                                    <div className="flex gap-1.5">
                                        <Link
                                            href={letters.current_page > 1 ? lettersRoute.index({ query: { page: letters.current_page - 1, ...filters } }) : '#'}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${letters.current_page > 1
                                                ? 'text-gray-700 hover:bg-white hover:text-blue-600'
                                                : 'text-gray-300 cursor-not-allowed'
                                                }`}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                        {(() => {
                                            const pages = [];
                                            const maxVisible = 5;
                                            let start = Math.max(1, letters.current_page - Math.floor(maxVisible / 2));
                                            const end = Math.min(letters.last_page, start + maxVisible - 1);

                                            if (end - start + 1 < maxVisible) {
                                                start = Math.max(1, end - maxVisible + 1);
                                            }

                                            if (start > 1) {
                                                pages.push(
                                                    <Link
                                                        key={1}
                                                        href={lettersRoute.index({ query: { page: 1, ...filters } })}
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
                                                        href={lettersRoute.index({ query: { page: i, ...filters } })}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${letters.current_page === i
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : 'text-gray-700 hover:bg-white hover:text-blue-600'
                                                            }`}
                                                    >
                                                        {i}
                                                    </Link>
                                                );
                                            }

                                            if (end < letters.last_page) {
                                                if (end < letters.last_page - 1) {
                                                    pages.push(<span key="dots2" className="px-2 text-gray-400">...</span>);
                                                }

                                                pages.push(
                                                    <Link
                                                        key={letters.last_page}
                                                        href={lettersRoute.index({ query: { page: letters.last_page, ...filters } })}
                                                        className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:text-blue-600 transition-colors"
                                                    >
                                                        {letters.last_page}
                                                    </Link>
                                                );
                                            }

                                            return pages;
                                        })()}
                                        <Link
                                            href={letters.current_page < letters.last_page ? lettersRoute.index({ query: { page: letters.current_page + 1, ...filters } }) : '#'}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${letters.current_page < letters.last_page
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
            </div>
        </>
    );
}