import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Building2, Users, Briefcase, Pencil, Trash2 } from 'lucide-react';
import type { Department } from '@/types';

interface Props {
    department: Department;
    stats: {
        total_positions: number;
        total_users: number;
        active_positions: number;
        child_departments: number;
    };
    can: {
        edit: boolean;
        delete: boolean;
    };
}

export default function DepartmentsShow({ department, stats, can }: Props) {
    const handleDelete = () => {
        if (confirm(`آیا از حذف دپارتمان "${department.name}" اطمینان دارید؟`)) {
            router.delete(route('departments.destroy', { department: department.id }));
        }
    };

    return (
        <>
            <Head title={department.name} />

            <div className="max-w-4xl mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link
                                href={route('departments.index')}
                                className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                            >
                                <ArrowRight className="h-4 w-4" />
                                بازگشت به لیست
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
                                <p className="text-sm text-gray-500">کد: {department.code}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {can.edit && (
                            <Link
                                href={route('departments.edit', { department: department.id })}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                                <Pencil className="ml-2 h-4 w-4" />
                                ویرایش
                            </Link>
                        )}
                        {can.delete && (
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
                            >
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 rounded-lg p-2">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">پست‌های سازمانی</p>
                                <p className="text-xl font-bold text-gray-900">{stats.total_positions}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-lg p-2">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">تعداد کاربران</p>
                                <p className="text-xl font-bold text-gray-900">{stats.total_users}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 rounded-lg p-2">
                                <Briefcase className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">پست‌های فعال</p>
                                <p className="text-xl font-bold text-gray-900">{stats.active_positions}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-100 rounded-lg p-2">
                                <Building2 className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">زیردپارتمان‌ها</p>
                                <p className="text-xl font-bold text-gray-900">{stats.child_departments}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-900 mb-3">اطلاعات دپارتمان</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500">نام:</span> {department.name}</p>
                            <p><span className="text-gray-500">کد:</span> {department.code}</p>
                            <p><span className="text-gray-500">سازمان:</span> {department.organization?.name}</p>
                            <p><span className="text-gray-500">دپارتمان والد:</span> {department.parent?.name || '-'}</p>
                            <p><span className="text-gray-500">وضعیت:</span> 
                                <span className={`mr-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    department.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {department.status === 'active' ? 'فعال' : 'غیرفعال'}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-900 mb-3">مسیر سازمانی</h3>
                        <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                            {department.full_path || `${department.organization?.name} > ${department.name}`}
                        </div>
                    </div>
                </div>

                {/* Positions List */}
                {department.positions && department.positions.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-semibold text-gray-900">پست‌های سازمانی</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {department.positions.map((position) => (
                                <div key={position.id} className="px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{position.name}</p>
                                        <p className="text-xs text-gray-500">کد: {position.code}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        position.is_management ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {position.is_management ? 'مدیریتی' : 'عادی'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}