// resources/js/pages/organizations/edit.tsx

import React from 'react';
import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Save, X, Building2, Trash2 } from 'lucide-react';
import type { Organization } from '@/types';

interface Props {
    organization: Organization;
    organizations: Organization[];
}

export default function OrganizationsEdit({ organization, organizations }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: organization.name,
        code: organization.code,
        email: organization.email || '',
        phone: organization.phone || '',
        address: organization.address || '',
        website: organization.website || '',
        parent_id: organization.parent_id?.toString() || '',
        status: organization.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('organizations.update', { organization: organization.id }));
    };

    const handleDelete = () => {
        if (confirm(`آیا از حذف سازمان "${organization.name}" اطمینان دارید؟`)) {
            router.delete(route('organizations.destroy', { organization: organization.id }));
        }
    };

    return (
        <>
            <Head title={`ویرایش سازمان - ${organization.name}`} />

            <div className="max-w-2xl mx-auto py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">ویرایش سازمان</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {organization.name}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.get(route('organizations.index'))}
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
                                {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                نام سازمان <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                کد سازمان <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ایمیل
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                تلفن
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                آدرس
                            </label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                وبسایت
                            </label>
                            <input
                                type="url"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                سازمان والد
                            </label>
                            <select
                                value={data.parent_id}
                                onChange={(e) => setData('parent_id', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">بدون والد</option>
                                {organizations
                                    .filter(org => org.id !== organization.id)
                                    .map(org => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                وضعیت
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active">فعال</option>
                                <option value="inactive">غیرفعال</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}