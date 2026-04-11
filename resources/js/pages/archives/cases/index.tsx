// resources/js/pages/archives/cases/index.tsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, FolderGit2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Archive, Case } from '@/types';

interface Props {
    archive: Archive;
    cases: {
        data: Case[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        is_active?: string;
    };
}

export default function CasesIndex({ archive, cases, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showOnlyActive, setShowOnlyActive] = useState(filters.is_active === '1');

    const handleSearch = () => {
        router.get(route('archives.cases.index', { archive: archive.id }), {
            search: searchTerm,
            is_active: showOnlyActive ? '1' : '',
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        setShowOnlyActive(false);
        router.get(route('archives.cases.index', { archive: archive.id }), {}, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title={`پرونده‌های بایگانی - ${archive.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">پرونده‌های بایگانی</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {archive.name}
                        </p>
                    </div>
                    <Link
                        href={route('archives.cases.create', { archive: archive.id })}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition"
                    >
                        <Plus className="ml-2 h-4 w-4" />
                        پرونده جدید
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">جستجو</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="عنوان، شماره پرونده..."
                                    className="w-full pr-10 pl-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showOnlyActive}
                                    onChange={(e) => setShowOnlyActive(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                فقط پرونده‌های فعال
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
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

                {/* Cases Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره پرونده</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عنوان</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تعداد نامه‌ها</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ انقضا</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cases.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            پرونده‌ای یافت نشد
                                        </td>
                                    </tr>
                                ) : (
                                    cases.data.map((caseItem) => (
                                        <tr key={caseItem.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {caseItem.case_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FolderGit2 className="h-5 w-5 text-gray-400 ml-3" />
                                                    <span className="text-sm font-medium text-gray-900">{caseItem.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {caseItem.letters?.length || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {caseItem.is_active ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        فعال
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                        غیرفعال
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {caseItem.expiry_date ? new Date(caseItem.expiry_date).toLocaleDateString('fa-IR') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                <Link
                                                    href={route('archives.cases.show', { archive: archive.id, case: caseItem.id })}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    مشاهده
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {cases.last_page > 1 && (
                        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                نمایش {cases.from} تا {cases.to} از {cases.total} نتیجه
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={cases.current_page > 1 ? route('archives.cases.index', { archive: archive.id, page: cases.current_page - 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${cases.current_page > 1 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                    قبلی
                                </Link>
                                {(() => {
                                    const pages = [];
                                    const maxVisible = 5;
                                    let start = Math.max(1, cases.current_page - Math.floor(maxVisible / 2));
                                    let end = Math.min(cases.last_page, start + maxVisible - 1);
                                    
                                    if (end - start + 1 < maxVisible) {
                                        start = Math.max(1, end - maxVisible + 1);
                                    }
                                    
                                    for (let i = start; i <= end; i++) {
                                        pages.push(i);
                                    }
                                    
                                    return pages.map((page) => (
                                        <Link
                                            key={page}
                                            href={route('archives.cases.index', { archive: archive.id, page, ...filters })}
                                            className={`px-3 py-1 rounded-lg text-sm ${cases.current_page === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </Link>
                                    ));
                                })()}
                                <Link
                                    href={cases.current_page < cases.last_page ? route('archives.cases.index', { archive: archive.id, page: cases.current_page + 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${cases.current_page < cases.last_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
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