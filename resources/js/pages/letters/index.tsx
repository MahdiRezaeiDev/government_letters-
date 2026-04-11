import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, Search, Filter, Eye, Edit, Trash2, 
    ChevronLeft, ChevronRight, FileText, 
    Inbox, Send, File, Clock, AlertCircle 
} from 'lucide-react';
import React, { useState } from 'react';
import { index as LetterIndex, create as LetterCreate, show as LetterShow } from '@/routes/letters';
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
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.letter_type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedPriority, setSelectedPriority] = useState(filters.priority || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => {
        router.get(LetterIndex(), {
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
        router.get(LetterIndex(), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, subject: string) => {
        if (confirm(`آیا از حذف نامه "${subject}" اطمینان دارید؟`)) {
            router.delete(route('letters.destroy', { letter: id }));
        }
    };

    const priorityColors: Record<string, string> = {
        low: 'bg-gray-100 text-gray-600',
        normal: 'bg-blue-100 text-blue-600',
        high: 'bg-yellow-100 text-yellow-600',
        urgent: 'bg-orange-100 text-orange-600',
        very_urgent: 'bg-red-100 text-red-600',
    };

    const statusColors: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-600',
        pending: 'bg-yellow-100 text-yellow-600',
        approved: 'bg-green-100 text-green-600',
        rejected: 'bg-red-100 text-red-600',
        archived: 'bg-gray-100 text-gray-500',
    };

    const typeIcons: Record<string, React.ReactNode> = {
        incoming: <Inbox className="h-4 w-4" />,
        outgoing: <Send className="h-4 w-4" />,
        internal: <File className="h-4 w-4" />,
    };

    return (
        <>
            <Head title="مدیریت نامه‌ها" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">مدیریت نامه‌ها</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            مدیریت و پیگیری نامه‌های اداری
                        </p>
                    </div>
                    {can.create && (
                        <Link
                            href={LetterCreate()}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition"
                        >
                            <Plus className="ml-2 h-4 w-4" />
                            نامه جدید
                        </Link>
                    )}
                </div>

                {/* Quick Type Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedType('')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                            !selectedType 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        همه
                    </button>
                    {Object.entries(types).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedType(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap inline-flex items-center gap-2 ${
                                selectedType === key 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {typeIcons[key]}
                            {label}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <Filter className="h-4 w-4" />
                            فیلترهای پیشرفته
                            <ChevronLeft className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-0' : 'rotate-180'}`} />
                        </button>
                    </div>
                    
                    {showFilters && (
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">جستجو</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            placeholder="موضوع، شماره، متن..."
                                            className="w-full pr-10 pl-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">همه</option>
                                        {Object.entries(statuses).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">اولویت</label>
                                    <select
                                        value={selectedPriority}
                                        onChange={(e) => setSelectedPriority(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">همه</option>
                                        {Object.entries(priorities).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    پاک کردن فیلترها
                                </button>
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    اعمال فیلتر
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Letters Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">موضوع</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اولویت</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {letters.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            نامه‌ای یافت نشد
                                        </td>
                                    </tr>
                                ) : (
                                    letters.data.map((letter) => (
                                        <tr key={letter.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {letter.letter_number}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                                                <p className="truncate">{letter.subject}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                                                    {typeIcons[letter.letter_type]}
                                                    {types[letter.letter_type]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[letter.priority]}`}>
                                                    {priorities[letter.priority]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[letter.final_status]}`}>
                                                    {statuses[letter.final_status]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(letter.date).toLocaleDateString('fa-IR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2 space-x-reverse">
                                                <Link
                                                    href={LetterShow({ letter: letter.id })}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    مشاهده
                                                </Link>
                                                {can.edit && letter.final_status === 'draft' && (
                                                    <Link
                                                        href={route('letters.edit', { letter: letter.id })}
                                                        className="text-yellow-600 hover:text-yellow-900 inline-flex items-center gap-1 mr-3"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        ویرایش
                                                    </Link>
                                                )}
                                                {can.delete && (
                                                    <button
                                                        onClick={() => handleDelete(letter.id, letter.subject)}
                                                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 mr-3"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        حذف
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {letters.last_page > 1 && (
                        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                نمایش {letters.from} تا {letters.to} از {letters.total} نتیجه
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={letters.current_page > 1 ? LetterIndex({ page: letters.current_page - 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${letters.current_page > 1 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                    قبلی
                                </Link>
                                {(() => {
                                    const pages = [];
                                    const maxVisible = 5;
                                    let start = Math.max(1, letters.current_page - Math.floor(maxVisible / 2));
                                    const end = Math.min(letters.last_page, start + maxVisible - 1);
                                    
                                    if (end - start + 1 < maxVisible) {
                                        start = Math.max(1, end - maxVisible + 1);
                                    }
                                    
                                    for (let i = start; i <= end; i++) {
                                        pages.push(i);
                                    }
                                    
                                    return pages.map((page) => (
                                        <Link
                                            key={page}
                                            href={LetterIndex({ page, ...filters })}
                                            className={`px-3 py-1 rounded-lg text-sm ${letters.current_page === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </Link>
                                    ));
                                })()}
                                <Link
                                    href={letters.current_page < letters.last_page ? LetterIndex({ page: letters.current_page + 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${letters.current_page < letters.last_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                    بعدی
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}