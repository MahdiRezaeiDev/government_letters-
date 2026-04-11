import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Save, X, Briefcase } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { Department } from '@/types';
import positions from '@/routes/positions';

interface Props {
    departments: Department[];
    selectedDepartment?: number;
}

export default function PositionsCreate({ departments, selectedDepartment }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        department_id: selectedDepartment || departments[0]?.id || '',
        name: '',
        code: '',
        level: 0,
        is_management: false,
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(positions.store());
    };

    return (
        <>
            <Head title="ایجاد سمت جدید" />

            <div className="max-w-2xl mx-auto py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">ایجاد سمت جدید</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                اطلاعات سمت سازمانی را وارد کنید
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.get(positions.index())}
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
                                {processing ? 'در حال ذخیره...' : 'ایجاد سمت'}
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                دپارتمان <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.department_id}
                                onChange={(e) => setData('department_id', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                نام سمت <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="مثال: مدیر مالی"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                کد سمت <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="مثال: FIN-MGR"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                سطح
                            </label>
                            <input
                                type="number"
                                value={data.level}
                                onChange={(e) => setData('level', parseInt(e.target.value))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_management"
                                checked={data.is_management}
                                onChange={(e) => setData('is_management', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="is_management" className="text-sm text-gray-700">
                                سمت مدیریتی
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                توضیحات
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                placeholder="توضیحات مربوط به این سمت..."
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}