import { Head, Link, router } from '@inertiajs/react';
import { Building2, Users, Briefcase, Pencil, Trash2, ChevronLeft, CheckCircle, AlertCircle, FolderTree, MapPin, Calendar, Hash, ExternalLink, GitBranch, Award, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import departments from '@/routes/departments';
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = () => {
        router.delete(departments.destroy({ department: department.id }));
    };

    const statusConfig = {
        active: { label: 'فعال', color: 'emerald', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700' },
        inactive: { label: 'غیرفعال', color: 'gray', icon: AlertCircle, bg: 'bg-gray-50', text: 'text-gray-600' },
    };

    const currentStatus = statusConfig[department.status as keyof typeof statusConfig] || statusConfig.inactive;
    const StatusIcon = currentStatus.icon;

    // Calculate hierarchy depth indicator
    const getHierarchyIcon = () => {
        if (department.level === 0) {
            return <Award className="h-5 w-5 text-amber-500" />;
        }

        if (department.level === 1) {
            return <TrendingUp className="h-5 w-5 text-blue-500" />;
        }

        return <GitBranch className="h-5 w-5 text-purple-500" />;
    };

    const getHierarchyText = () => {
        if (department.level === 0) {
            return 'دپارتمان سطح اول (ریشه)';
        }

        if (department.level === 1) {
            return 'دپارتمان سطح دوم';
        }

        return `دپارتمان سطح ${department.level + 1}`;
    };

    return (
        <>
            <Head title={department.name} />

            <div className="min-h-screen ">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                                            <Building2 className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${currentStatus.bg} ${currentStatus.text}`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {currentStatus.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <code className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">کد: {department.code}</code>
                                                <span>•</span>
                                                <span>شناسه: {department.id}</span>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    {getHierarchyIcon()}
                                                    <span className="text-xs">{getHierarchyText()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        {can.edit && (
                                            <Link
                                                href={departments.edit({ department: department.id })}
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
                            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                                <div className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                            <Briefcase className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">کل پست‌ها</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.total_positions}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 rounded-lg">
                                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">پست‌های فعال</p>
                                            <p className="text-2xl font-bold text-emerald-600">{stats.active_positions}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Users className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">تعداد کاربران</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-50 rounded-lg">
                                            <FolderTree className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">زیردپارتمان‌ها</p>
                                            <p className="text-2xl font-bold text-amber-600">{stats.child_departments}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Department Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <h3 className="font-semibold text-gray-900">اطلاعات دپارتمان</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">مشخصات و اطلاعات پایه</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Hash className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">کد دپارتمان</p>
                                            <p className="text-sm font-mono text-gray-900">{department.code}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Building2 className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">سازمان مادر</p>
                                            {department.organization ? (
                                                <Link 
                                                    href={departments.show( department.organization.id )}
                                                    className="text-sm text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                                                >
                                                    {department.organization.name}
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            ) : (
                                                <p className="text-sm text-gray-500">-</p>
                                            )}
                                        </div>
                                    </div>

                                    {department.parent && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <FolderTree className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">دپارتمان والد</p>
                                                <Link 
                                                    href={departments.show({ department: department.parent.id })}
                                                    className="text-sm text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                                                >
                                                    {department.parent.name}
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">تاریخ ایجاد</p>
                                            <p className="text-sm text-gray-900">
                                                {new Date(department.created_at).toLocaleDateString('fa-IR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Organizational Path */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <h3 className="font-semibold text-gray-900">مسیر سازمانی</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">موقعیت دپارتمان در ساختار سازمانی</p>
                                </div>
                                <div className="p-6">
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <MapPin className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                                            <span className="font-mono">
                                                {department?.full_path || `${department.organization?.name} › ${department.name}`}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Hierarchy Visualization */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 mb-2">ساختار سلسله‌مراتبی:</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            {department.organization && (
                                                <>
                                                    <span className="px-2 py-1 bg-gray-100 rounded">{department.organization.name}</span>
                                                    <ChevronLeft className="h-3 w-3 text-gray-400" />
                                                </>
                                            )}
                                            {department.parent && (
                                                <>
                                                    <span className="px-2 py-1 bg-gray-100 rounded">{department.parent.name}</span>
                                                    <ChevronLeft className="h-3 w-3 text-gray-400" />
                                                </>
                                            )}
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded font-medium">{department.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Positions List */}
                        {department.positions && department.positions.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">پست‌های سازمانی</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">لیست پست‌های سازمانی این دپارتمان</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-1 bg-indigo-50 rounded-lg text-xs text-indigo-600">
                                            مجموع: {stats.total_positions} پست
                                        </div>
                                        <div className="px-2 py-1 bg-emerald-50 rounded-lg text-xs text-emerald-600">
                                            فعال: {stats.active_positions} پست
                                        </div>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {department.positions.map((position) => (
                                        <div key={position.id} className="px-6 py-4 hover:bg-gray-50 transition-colors group">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                        <Briefcase className="h-4 w-4 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {position.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <code className="text-xs text-gray-500 font-mono">کد: {position.code}</code>
                                                            {position.is_management && (
                                                                <>
                                                                    <span className="text-xs text-gray-300">•</span>
                                                                    <span className="text-xs text-purple-600 inline-flex items-center gap-1">
                                                                        <Award className="h-3 w-3" />
                                                                        پست مدیریتی
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        position.status === 'active' 
                                                            ? 'bg-emerald-50 text-emerald-700' 
                                                            : 'bg-gray-50 text-gray-600'
                                                    }`}>
                                                        {position.status === 'active' ? (
                                                            <CheckCircle className="h-3 w-3" />
                                                        ) : (
                                                            <AlertCircle className="h-3 w-3" />
                                                        )}
                                                        {position.status === 'active' ? 'فعال' : 'غیرفعال'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State for Positions */}
                        {(!department.positions || department.positions.length === 0) && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <h3 className="font-semibold text-gray-900">پست‌های سازمانی</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">لیست پست‌های سازمانی این دپارتمان</p>
                                </div>
                                <div className="p-12 text-center">
                                    <div className="inline-flex p-3 bg-gray-100 rounded-full mb-4">
                                        <Briefcase className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">هیچ پست سازمانی یافت نشد</p>
                                    <p className="text-sm text-gray-400 mt-1">برای این دپارتمان پست سازمانی ثبت نشده است</p>
                                </div>
                            </div>
                        )}

                        {/* Child Departments Section */}
                        {stats.child_departments > 0 && department.children && department.children.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <h3 className="font-semibold text-gray-900">زیردپارتمان‌ها</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">دپارتمان‌های زیرمجموعه این دپارتمان</p>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {department.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={departments.show({ department: child.id })}
                                            className="block px-6 py-4 hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                        <FolderTree className="h-4 w-4 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {child.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">کد: {child.code}</p>
                                                    </div>
                                                </div>
                                                <ChevronLeft className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}