// resources/js/pages/categories/create.tsx

import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import categories from '@/routes/categories';
import type { Organization, LetterCategory } from '@/types';

interface Props {
    organizations: Organization[];
    parentCategories: LetterCategory[];
}

export default function CategoriesCreate({ organizations, parentCategories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        organization_id: organizations[0]?.id || '',
        name: '',
        code: '',
        parent_id: '',
        description: '',
        color: '#3b82f6',
        sort_order: 0,
        status: true,
    });

    const [availableParents, setAvailableParents] = useState(parentCategories);

    useEffect(() => {
        if (data.organization_id) {
            router.get('/categories/list', 
                { organization_id: data.organization_id },
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        setAvailableParents(page.props.categories as LetterCategory[]);
                    }
                }
            );
        }
    }, [data.organization_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(categories.store());
    };

    return (
        <>
            <Head title="ایجاد دسته‌بندی جدید" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">ایجاد دسته‌بندی جدید</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                اطلاعات دسته‌بندی نامه را وارد کنید
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.get(categories.index())}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                            >
                                <X className="ml-2 h-4 w-4" />
                                انصراف
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                <Save className="ml-2 h-4 w-4" />
                                {processing ? 'در حال ذخیره...' : 'ایجاد دسته‌بندی'}
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                سازمان <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.organization_id}
                                onChange={(e) => setData('organization_id', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {organizations.map(org => (
                                    <option key={org.id} value={org.id}>{org.name}</option>
                                ))}
                            </select>
                            {errors.organization_id && <p className="text-red-500 text-xs mt-1">{errors.organization_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                نام دسته‌بندی <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="مثال: اداری، مالی، پرسنلی"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                کد دسته‌بندی <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="مثال: CAT-001"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                دسته‌بندی والد
                            </label>
                            <select
                                value={data.parent_id}
                                onChange={(e) => setData('parent_id', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">بدون والد</option>
                                {availableParents.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                رنگ
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#3b82f6"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ترتیب نمایش
                            </label>
                            <input
                                type="number"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">اعداد کوچکتر زودتر نمایش داده می‌شوند</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                توضیحات
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                placeholder="توضیحات مربوط به این دسته‌بندی..."
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="status"
                                checked={data.status}
                                onChange={(e) => setData('status', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="status" className="text-sm text-gray-700">
                                فعال
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}