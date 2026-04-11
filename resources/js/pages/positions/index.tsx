import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, Briefcase, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import React, { useState } from 'react';
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

    const handleSearch = () => {
        router.get(route('positions.index'), {
            search: searchTerm,
            department_id: selectedDepartment,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedDepartment('');
        router.get(route('positions.index'), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`آیا از حذف سمت "${name}" اطمینان دارید؟`)) {
            router.delete(route('positions.destroy', { position: id }));
        }
    };

    return (
        <>
            <Head title="مدیریت سمت‌ها" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">مدیریت سمت‌ها</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            مدیریت پست‌های سازمانی و سطوح دسترسی
                        </p>
                    </div>
                    {can.create && (
                        <Link
                            href={route('positions.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition"
                        >
                            <Plus className="ml-2 h-4 w-4" />
                            سمت جدید
                        </Link>
                    )}
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
                                    placeholder="نام، کد..."
                                    className="w-full pr-10 pl-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">دپارتمان</label>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">همه</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
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

                {/* Positions Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سمت</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دپارتمان</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سطح</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {positions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            سمتی یافت نشد
                                        </td>
                                    </tr>
                                ) : (
                                    positions.data.map((position) => (
                                        <tr key={position.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Briefcase className="h-5 w-5 text-gray-400 ml-3" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {position.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {position.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {position.department?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {position.level}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {position.is_management ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                                        مدیریتی
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                        عادی
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2 space-x-reverse">
                                                <Link
                                                    href={route('positions.show', { position: position.id })}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    مشاهده
                                                </Link>
                                                {can.edit && (
                                                    <Link
                                                        href={route('positions.edit', { position: position.id })}
                                                        className="text-yellow-600 hover:text-yellow-900 inline-flex items-center gap-1 mr-3"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        ویرایش
                                                    </Link>
                                                )}
                                                {can.delete && (
                                                    <button
                                                        onClick={() => handleDelete(position.id, position.name)}
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
                    {positions.last_page > 1 && (
                        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                نمایش {positions.from} تا {positions.to} از {positions.total} نتیجه
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={positions.current_page > 1 ? route('positions.index', { page: positions.current_page - 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${positions.current_page > 1 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                    قبلی
                                </Link>
                                {(() => {
                                    const pages = [];
                                    const maxVisible = 5;
                                    let start = Math.max(1, positions.current_page - Math.floor(maxVisible / 2));
                                    let end = Math.min(positions.last_page, start + maxVisible - 1);
                                    
                                    if (end - start + 1 < maxVisible) {
                                        start = Math.max(1, end - maxVisible + 1);
                                    }
                                    
                                    for (let i = start; i <= end; i++) {
                                        pages.push(i);
                                    }
                                    
                                    return pages.map((page) => (
                                        <Link
                                            key={page}
                                            href={route('positions.index', { page, ...filters })}
                                            className={`px-3 py-1 rounded-lg text-sm ${positions.current_page === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </Link>
                                    ));
                                })()}
                                <Link
                                    href={positions.current_page < positions.last_page ? route('positions.index', { page: positions.current_page + 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${positions.current_page < positions.last_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
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