// resources/js/pages/categories/index.tsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, Pencil, Trash2, Search, FolderTree, 
    ChevronLeft, ChevronRight, Eye, Power, PowerOff 
} from 'lucide-react';
import type { LetterCategory, Organization } from '@/types';
import categoriesRoute from '@/routes/categories';

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

    const handleDelete = (id: number, name: string) => {
        if (confirm(`آیا از حذف دسته‌بندی "${name}" اطمینان دارید؟`)) {
            router.delete(categoriesRoute.destroy({ category: id }));
        }
    };

    const handleToggleStatus = (id: number) => {
        router.post(categoriesRoute.toggleStatus({ category: id }));
    };

    const getLevelPrefix = (level?: number) => {
        if (!level) return '';
        return '—'.repeat(level) + (level > 0 ? ' ' : '');
    };

    return (
        <>
            <Head title="مدیریت دسته‌بندی نامه‌ها" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">مدیریت دسته‌بندی نامه‌ها</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            مدیریت دسته‌بندی‌های نامه‌های اداری
                        </p>
                    </div>
                    {can.create && (
                        <Link
                            href={categoriesRoute.create()}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition"
                        >
                            <Plus className="ml-2 h-4 w-4" />
                            دسته‌بندی جدید
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">همه</option>
                                <option value="1">فعال</option>
                                <option value="0">غیرفعال</option>
                            </select>
                        </div>
                        {organizations.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">سازمان</label>
                                <select
                                    value={selectedOrganization}
                                    onChange={(e) => setSelectedOrganization(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">همه</option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
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

                {/* Categories Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام دسته‌بندی</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سازمان</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رنگ</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ترتیب</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            دسته‌بندی‌ای یافت نشد
                                        </td>
                                    </tr>
                                ) : (
                                    categories.data.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FolderTree className="h-5 w-5 text-gray-400 ml-3" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {getLevelPrefix(category.level)}{category.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {category.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {category.organization?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div 
                                                        className="w-6 h-6 rounded-full border border-gray-200" 
                                                        style={{ backgroundColor: category.color }}
                                                    />
                                                    <span className="text-sm text-gray-500">{category.color}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {category.sort_order}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(category.id)}
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        category.status 
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {category.status ? (
                                                        <><Power className="h-3 w-3 ml-1" /> فعال</>
                                                    ) : (
                                                        <><PowerOff className="h-3 w-3 ml-1" /> غیرفعال</>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2 space-x-reverse">
                                                <Link
                                                    href={categoriesRoute.show({ category: category.id })}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    مشاهده
                                                </Link>
                                                {can.edit && (
                                                    <Link
                                                        href={categoriesRoute.edit({ category: category.id })}
                                                        className="text-yellow-600 hover:text-yellow-900 inline-flex items-center gap-1 mr-3"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        ویرایش
                                                    </Link>
                                                )}
                                                {can.delete && (
                                                    <button
                                                        onClick={() => handleDelete(category.id, category.name)}
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
                    {categories.last_page > 1 && (
                        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                نمایش {categories.from} تا {categories.to} از {categories.total} نتیجه
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={categories.current_page > 1 ? categoriesRoute.index({query: { page: categories.current_page - 1, ...filters }}) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${categories.current_page > 1 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                    قبلی
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
                                            href={categoriesRoute.index({query : { page: pageNum, ...filters }})}
                                            className={`px-3 py-1 rounded-lg text-sm ${categories.current_page === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {pageNum}
                                        </Link>
                                    );
                                })}
                                <Link
                                    href={categories.current_page < categories.last_page ? categoriesRoute.index({query:  { page: categories.current_page + 1, ...filters }}) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${categories.current_page < categories.last_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
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