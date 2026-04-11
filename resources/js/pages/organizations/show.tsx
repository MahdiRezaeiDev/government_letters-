// resources/js/pages/organizations/show.tsx

import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Building2, Users, Mail, Phone, MapPin, Globe, Pencil, Trash2 } from 'lucide-react';
import type { Organization, Department } from '@/types';

interface Props {
    organization: Organization & { departments: Department[] };
    stats: {
        total_departments: number;
        total_users: number;
        active_departments: number;
    };
    can: {
        edit: boolean;
        delete: boolean;
    };
}

export default function OrganizationsShow({ organization, stats, can }: Props) {
    const handleDelete = () => {
        if (confirm(`آیا از حذف سازمان "${organization.name}" اطمینان دارید؟`)) {
            router.delete(route('organizations.destroy', { organization: organization.id }));
        }
    };

    return (
        <>
            <Head title={organization.name} />

            <div className="max-w-5xl mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link
                                href={route('organizations.index')}
                                className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                            >
                                <ArrowRight className="h-4 w-4" />
                                بازگشت به لیست
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Building2 className="h-7 w-7 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
                                <p className="text-sm text-gray-500">کد: {organization.code}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {can.edit && (
                            <Link
                                href={route('organizations.edit', { organization: organization.id })}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 rounded-lg p-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">دپارتمان‌ها</p>
                                <p className="text-xl font-bold text-gray-900">{stats.total_departments}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-lg p-2">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">کاربران</p>
                                <p className="text-xl font-bold text-gray-900">{stats.total_users}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-100 rounded-lg p-2">
                                <Building2 className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">دپارتمان‌های فعال</p>
                                <p className="text-xl font-bold text-gray-900">{stats.active_departments}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">اطلاعات تماس</h3>
                    </div>
                    <div className="p-6 space-y-3">
                        {organization.email && (
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">{organization.email}</span>
                            </div>
                        )}
                        {organization.phone && (
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">{organization.phone}</span>
                            </div>
                        )}
                        {organization.address && (
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">{organization.address}</span>
                            </div>
                        )}
                        {organization.website && (
                            <div className="flex items-center gap-3 text-sm">
                                <Globe className="h-4 w-4 text-gray-400" />
                                <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                    {organization.website}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Parent Organization */}
                {organization.parent && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-semibold text-gray-900">سازمان والد</h3>
                        </div>
                        <div className="p-6">
                            <Link
                                href={route('organizations.show', { organization: organization.parent.id })}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                {organization.parent.name}
                            </Link>
                        </div>
                    </div>
                )}

                {/* Departments List */}
                {organization.departments && organization.departments.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">دپارتمان‌ها</h3>
                            <Link
                                href={route('departments.create', { organization_id: organization.id })}
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                + افزودن دپارتمان
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {organization.departments.map((dept) => (
                                <Link
                                    key={dept.id}
                                    href={route('departments.show', { department: dept.id })}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                                        <p className="text-xs text-gray-500">کد: {dept.code}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        dept.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {dept.status === 'active' ? 'فعال' : 'غیرفعال'}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}