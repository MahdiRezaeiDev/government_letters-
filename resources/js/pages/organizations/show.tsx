// resources/js/pages/organizations/show.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight, Building2, Users, Mail, Phone, MapPin, Globe,
    Pencil, Trash2, Calendar, CheckCircle, AlertCircle, ChevronLeft,
    ExternalLink, Layers, Briefcase, Sparkles, Hash,
    Database
} from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import departments from '@/routes/departments';
import organizations from '@/routes/organizations';
import type { Organization, Department } from '@/types';

interface Props {
    organization: Organization & { departments: Department[] };
    stats: {
        total_departments: number;
        total_users: number;
        active_departments: number;
        total_cases?: number;
        total_letters?: number;
    };
    can: {
        edit: boolean;
        delete: boolean;
    };
}

export default function OrganizationsShow({ organization, stats, can }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(organizations.destroy({ organization: organization.id }), {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
            },
        });
    };

    const statusConfig = {
        active: {
            label: 'فعال',
            color: 'emerald',
            icon: CheckCircle,
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200',
            gradient: 'from-emerald-500 to-teal-600'
        },
        inactive: {
            label: 'غیرفعال',
            color: 'gray',
            icon: AlertCircle,
            bg: 'bg-gray-50',
            text: 'text-gray-600',
            border: 'border-gray-200',
            gradient: 'from-gray-500 to-slate-600'
        },
    };

    const currentStatus = statusConfig[organization.status as keyof typeof statusConfig] || statusConfig.inactive;
    const StatusIcon = currentStatus.icon;

    const statsCards = [
        { label: 'کل دپارتمان‌ها', value: stats.total_departments, icon: Layers, color: 'blue', gradient: 'from-blue-500 to-cyan-600', change: '+12%' },
        { label: 'دپارتمان‌های فعال', value: stats.active_departments, icon: Briefcase, color: 'emerald', gradient: 'from-emerald-500 to-teal-600', change: '+8%' },
        { label: 'کل کاربران', value: stats.total_users, icon: Users, color: 'purple', gradient: 'from-purple-500 to-pink-600', change: '+5%' },
        { label: 'کل پرونده‌ها', value: stats.total_cases || 0, icon: Database, color: 'amber', gradient: 'from-amber-500 to-orange-600', change: '-' },
    ];

    const getRandomGradient = (id: number) => {
        const gradients = [
            'from-blue-500 to-cyan-600',
            'from-emerald-500 to-teal-600',
            'from-purple-500 to-pink-600',
            'from-amber-500 to-orange-600',
            'from-indigo-500 to-blue-600',
        ];

        return gradients[id % gradients.length];
    };

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <>
            <Head title={organization.name} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Navigation */}
                        <div className="flex items-center gap-2 text-sm animate-fade-in">
                            <Link
                                href={organizations.index()}
                                className="text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1 group"
                            >
                                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                                بازگشت به لیست سازمان‌ها
                            </Link>
                        </div>

                        {/* Header Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
                            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white rounded-full blur-3xl" />
                                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white rounded-full blur-3xl" />
                                </div>
                                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-lg shadow-lg">
                                            <Building2 className="h-10 w-10 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h1 className="text-2xl font-bold text-white">{organization.name}</h1>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur text-white border border-white/30`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {currentStatus.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-blue-100">
                                                <Hash className="h-3.5 w-3.5" />
                                                <code className="px-2 py-0.5 bg-white/10 rounded text-xs font-mono">کد: {organization.code}</code>
                                                <span>•</span>
                                                <span>شناسه: {organization.id}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    ایجاد: {new Date(organization.created_at).toLocaleDateString('fa-IR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        {can.edit && (
                                            <Link
                                                href={organizations.edit({ organization: organization.id })}
                                                className="inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
                                            >
                                                <Pencil className="ml-2 h-4 w-4" />
                                                ویرایش
                                            </Link>
                                        )}
                                        {can.delete && (
                                            <button
                                                onClick={() => setShowDeleteModal(true)}
                                                className="inline-flex items-center px-5 py-2.5 bg-red-500/20 backdrop-blur border border-red-500/30 rounded-xl text-sm font-medium text-white hover:bg-red-500/30 transition-all duration-200"
                                            >
                                                <Trash2 className="ml-2 h-4 w-4" />
                                                حذف
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                                {statsCards.map((stat, index) => (
                                    <div key={stat.label} className="p-6 hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                                <stat.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                                                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString('fa-IR')}</p>
                                                {stat.change !== '-' && (
                                                    <p className="text-xs text-emerald-600 mt-0.5">{stat.change} از ماه قبل</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">اطلاعات تماس</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">راه‌های ارتباطی سازمان</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {organization.email && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                <Mail className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">ایمیل</p>
                                                <a href={`mailto:${organization.email}`} className="text-sm text-gray-900 hover:text-blue-600 transition-colors">
                                                    {organization.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {organization.phone && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors group">
                                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                                <Phone className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">تلفن</p>
                                                <a href={`tel:${organization.phone}`} className="text-sm text-gray-900 hover:text-green-600 transition-colors">
                                                    {organization.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {organization.address && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors group md:col-span-2">
                                            <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                                <MapPin className="h-5 w-5 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">آدرس</p>
                                                <p className="text-sm text-gray-900">{organization.address}</p>
                                            </div>
                                        </div>
                                    )}
                                    {organization.website && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors group md:col-span-2">
                                            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                                <Globe className="h-5 w-5 text-purple-600" />
                                            </div>
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
                                        <div className="text-center py-12 text-gray-500 col-span-2">
                                            <div className="inline-flex p-3 bg-gray-100 rounded-full mb-3">
                                                <Mail className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="font-medium">اطلاعات تماسی ثبت نشده است</p>
                                            <p className="text-sm text-gray-400 mt-1">برای این سازمان اطلاعات تماسی وارد نشده است</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Parent Organization */}
                        {organization.parent && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-indigo-600" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">سازمان والد</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">سازمان مادر این مجموعه</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <Link
                                        href={organizations.show({ organization: organization.parent.id })}
                                        className="inline-flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl hover:from-indigo-100 hover:to-blue-100 transition-all duration-300 w-full md:w-auto group"
                                    >
                                        <div className={`p-2 bg-gradient-to-br ${getRandomGradient(organization.parent.id)} rounded-lg shadow-md`}>
                                            <Building2 className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {organization.parent.name}
                                            </p>
                                            <p className="text-xs text-gray-500">کد: {organization.parent.code}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-indigo-500 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Departments List */}
                        {organization.departments && organization.departments.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
                                <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <Layers className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">دپارتمان‌ها</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">لیست دپارتمان‌های زیرمجموعه</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={departments.create({query: { organization_id: organization.id }})}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                    >
                                        <Building2 className="h-4 w-4" />
                                        افزودن دپارتمان
                                    </Link>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {organization.departments.map((dept, index) => {
                                        const deptStatus = statusConfig[dept.status as keyof typeof statusConfig] || statusConfig.inactive;
                                        const DeptIcon = deptStatus.icon;

                                        return (
                                            <Link
                                                key={dept.id}
                                                href={departments.show(dept.id)}
                                                className="block px-6 py-4 hover:bg-gray-50 transition-colors group animate-fade-in"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-2 bg-gradient-to-br ${getRandomGradient(dept.id)} rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                                            <Building2 className="h-4 w-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                {dept.name}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <code className="text-xs text-gray-500 font-mono">کد: {dept.code}</code>
                                                                <span className="text-xs text-gray-300">•</span>
                                                                <span className="text-xs text-gray-500">شناسه: {dept.id}</span>
                                                                {dept.parent && (
                                                                    <>
                                                                        <span className="text-xs text-gray-300">•</span>
                                                                        <span className="text-xs text-gray-500">زیرمجموعه: {dept.parent.name}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${deptStatus.bg} ${deptStatus.text} border ${deptStatus.border}`}>
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
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <div className="flex items-center gap-2">
                                        <Layers className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">دپارتمان‌ها</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">لیست دپارتمان‌های زیرمجموعه</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-12 text-center">
                                    <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                                        <Layers className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">هیچ دپارتمانی یافت نشد</p>
                                    <p className="text-sm text-gray-400 mt-1">برای این سازمان دپارتمانی ثبت نشده است</p>
                                    <Link
                                        href={route('departments.create', { organization_id: organization.id })}
                                        className="inline-flex items-center mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
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

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                .animate-slide-up {
                    animation: slideUp 0.5s ease-out;
                }
            `}</style>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="حذف سازمان"
                    message="آیا از حذف این سازمان اطمینان دارید؟"
                    itemName={organization.name}
                    type="organization"
                    isLoading={deleting}
                />
            )}
        </>
    );
}