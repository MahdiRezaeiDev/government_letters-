import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Building2, Users, Mail, Phone, MapPin, Globe, Pencil, Trash2, Calendar, CheckCircle, AlertCircle, ChevronLeft, ExternalLink, Layers, Briefcase } from 'lucide-react';
import React, { useState } from 'react';
import organizations from '@/routes/organizations';
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = () => {
        router.delete(organizations.destroy({ organization: organization.id }));
    };

    const statusConfig = {
        active: { label: 'فعال', color: 'emerald', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700' },
        inactive: { label: 'غیرفعال', color: 'gray', icon: AlertCircle, bg: 'bg-gray-50', text: 'text-gray-600' },
    };

    const currentStatus = statusConfig[organization.status as keyof typeof statusConfig] || statusConfig.inactive;
    const StatusIcon = currentStatus.icon;

    return (
        <>
            <Head title={organization.name} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Navigation */}
                        <div className="flex items-center gap-2 text-sm">
                            <Link
                                href={organizations.index()}
                                className="text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                بازگشت به لیست سازمان‌ها
                            </Link>
                        </div>

                        {/* Header Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                            <Building2 className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${currentStatus.bg} ${currentStatus.text}`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {currentStatus.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <code className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">کد: {organization.code}</code>
                                                <span>•</span>
                                                <span>شناسه: {organization.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        {can.edit && (
                                            <Link
                                                href={organizations.edit({ organization: organization.id })}
                                                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                            >
                                                <Pencil className="ml-2 h-4 w-4" />
                                                ویرایش
                                            </Link>
                                        )}
                                        {can.delete && (
                                            <>
                                                {!showDeleteConfirm ? (
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(true)}
                                                        className="inline-flex items-center px-4 py-2.5 border border-red-300 rounded-xl text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-all duration-200"
                                                    >
                                                        <Trash2 className="ml-2 h-4 w-4" />
                                                        حذف
                                                    </button>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleDelete}
                                                            className="inline-flex items-center px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all"
                                                        >
                                                            <Trash2 className="ml-2 h-4 w-4" />
                                                            تأیید حذف
                                                        </button>
                                                        <button
                                                            onClick={() => setShowDeleteConfirm(false)}
                                                            className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                        >
                                                            انصراف
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                                <div className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Layers className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">کل دپارتمان‌ها</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.total_departments}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 rounded-lg">
                                            <Briefcase className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">دپارتمان‌های فعال</p>
                                            <p className="text-2xl font-bold text-emerald-600">{stats.active_departments}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Users className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">کل کاربران</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <h3 className="font-semibold text-gray-900">اطلاعات تماس</h3>
                                <p className="text-sm text-gray-500 mt-0.5">راه‌های ارتباطی سازمان</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {organization.email && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Mail className="h-5 w-5 text-blue-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">ایمیل</p>
                                                <a href={`mailto:${organization.email}`} className="text-sm text-gray-900 hover:text-blue-600 transition-colors">
                                                    {organization.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {organization.phone && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Phone className="h-5 w-5 text-green-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">تلفن</p>
                                                <a href={`tel:${organization.phone}`} className="text-sm text-gray-900 hover:text-blue-600 transition-colors">
                                                    {organization.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {organization.address && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                                            <MapPin className="h-5 w-5 text-red-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500">آدرس</p>
                                                <p className="text-sm text-gray-900">{organization.address}</p>
                                            </div>
                                        </div>
                                    )}
                                    {organization.website && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                                            <Globe className="h-5 w-5 text-purple-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500">وبسایت</p>
                                                <a 
                                                    href={organization.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                                                >
                                                    {organization.website}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {!organization.email && !organization.phone && !organization.address && !organization.website && (
                                        <div className="text-center py-8 text-gray-500 col-span-2">
                                            <p>اطلاعات تماسی ثبت نشده است</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Parent Organization */}
                        {organization.parent && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <h3 className="font-semibold text-gray-900">سازمان والد</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">سازمان مادر این مجموعه</p>
                                </div>
                                <div className="p-6">
                                    <Link
                                        href={organizations.show({ organization: organization.parent.id })}
                                        className="inline-flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors w-full md:w-auto"
                                    >
                                        <Building2 className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{organization.parent.name}</p>
                                            <p className="text-xs text-gray-500">کد: {organization.parent.code}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-blue-600 mr-auto" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Departments List */}
                        {organization.departments && organization.departments.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">دپارتمان‌ها</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">لیست دپارتمان‌های زیرمجموعه</p>
                                    </div>
                                    <Link
                                        href={organizations.create({ query: { organization_id: organization.id } })}
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                    >
                                        <Building2 className="ml-1 h-4 w-4" />
                                        افزودن دپارتمان
                                    </Link>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {organization.departments.map((dept) => {
                                        const deptStatus = statusConfig[dept.status as keyof typeof statusConfig] || statusConfig.inactive;
                                        const DeptIcon = deptStatus.icon;
                                        return (
                                            <Link
                                                key={dept.id}
                                                href={organizations.show(dept.id)}
                                                className="block px-6 py-4 hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                            <Building2 className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                {dept.name}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <code className="text-xs text-gray-500 font-mono">کد: {dept.code}</code>
                                                                <span className="text-xs text-gray-300">•</span>
                                                                <span className="text-xs text-gray-500">شناسه: {dept.id}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${deptStatus.bg} ${deptStatus.text}`}>
                                                            <DeptIcon className="h-3 w-3" />
                                                            {deptStatus.label}
                                                        </span>
                                                        <ChevronLeft className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Empty State for Departments */}
                        {(!organization.departments || organization.departments.length === 0) && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <h3 className="font-semibold text-gray-900">دپارتمان‌ها</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">لیست دپارتمان‌های زیرمجموعه</p>
                                </div>
                                <div className="p-12 text-center">
                                    <div className="inline-flex p-3 bg-gray-100 rounded-full mb-4">
                                        <Layers className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">هیچ دپارتمانی یافت نشد</p>
                                    <p className="text-sm text-gray-400 mt-1">برای این سازمان دپارتمانی ثبت نشده است</p>
                                    <Link
                                        href={organizations.create({ query: { organization_id: organization.id } })}
                                        className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        <Building2 className="ml-2 h-4 w-4" />
                                        افزودن اولین دپارتمان
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}