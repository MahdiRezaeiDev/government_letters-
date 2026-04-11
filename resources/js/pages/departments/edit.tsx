
// resources/js/pages/departments/edit.tsx

import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Save, X, Building2, Trash2 } from 'lucide-react';
import type { Organization, Department } from '@/types';

interface Props {
    department: Department;
    organizations: Organization[];
    parentDepartments: Department[];
}

export default function DepartmentsEdit({ department, organizations, parentDepartments }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        organization_id: department.organization_id,
        name: department.name,
        code: department.code,
        parent_id: department.parent_id || '',
        status: department.status,
    });

    const [availableParentDepts, setAvailableParentDepts] = useState<Department[]>(parentDepartments);

    // به‌روزرسانی لیست دپارتمان‌های والد با تغییر سازمان
    useEffect(() => {
        if (data.organization_id && data.organization_id !== department.organization_id) {
            router.get('/departments/list', 
                { organization_id: data.organization_id },
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        setAvailableParentDepts(page.props.departments as Department[]);
                    }
                }
            );
        }
    }, [data.organization_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('departments.update', { department: department.id }));
    };

    const handleDelete = () => {
        if (confirm(`آیا از حذف دپارتمان "${department.name}" اطمینان دارید؟`)) {
            router.delete(route('departments.destroy', { department: department.id }));
        }
    };

    return (
        <>
            <Head title={`ویرایش دپارتمان - ${department.name}`} />

            <div className="max-w-2xl mx-auto py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">ویرایش دپارتمان</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {department.name}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.get(route('departments.index'))}
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
                                نام دپارتمان <span className="text-red-500">*</span>
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
                                کد دپارتمان <span className="text-red-500">*</span>
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
                                دپارتمان والد
                            </label>
                            <select
                                value={data.parent_id}
                                onChange={(e) => setData('parent_id', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">بدون والد</option>
                                {availableParentDepts
                                    .filter(dept => dept.id !== department.id)
                                    .map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
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