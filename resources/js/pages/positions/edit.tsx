import { Head, router, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Save, X, Briefcase, Trash2, Layers, Hash, Award, FileText, AlertCircle, Eye, TrendingUp, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { Position, Department } from '@/types';
import positions from '@/routes/positions';

interface Props {
    position: Position;
    departments: Department[];
}

export default function PositionsEdit({ position, departments }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        department_id: position.department_id,
        name: position.name,
        code: position.code,
        level: position.level,
        is_management: position.is_management,
        description: position.description || '',
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(positions.update({ position: position.id }));
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field: string) => {
        return touched[field] && errors[field] ? errors[field] : null;
    };

    const handleDelete = () => {
        router.delete(positions.destroy({ position: position.id }));
    };

    const selectedDepartment = departments.find(d => d.id === Number(data.department_id));

    return (
        <>
            <Head title={`ویرایش سمت - ${position.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                                            <Briefcase className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">ویرایش سمت</h1>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                در حال ویرایش {position.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={positions.show({ position: position.id })}
                                        className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <Eye className="ml-2 h-4 w-4" />
                                        مشاهده
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => router.get(positions.index())}
                                        className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <X className="ml-2 h-4 w-4" />
                                        انصراف
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="ml-2 h-4 w-4" />
                                        {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Form Sections */}
                        <div className="space-y-6">
                            {/* Basic Information Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <h2 className="text-lg font-semibold text-gray-900">اطلاعات پایه</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">اطلاعات اصلی سمت سازمانی</p>
                                </div>
                                <div className="p-6 space-y-5">
                                    {/* Department Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            دپارتمان <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Layers className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <select
                                                value={data.department_id}
                                                onChange={(e) => setData('department_id', e.target.value)}
                                                onBlur={() => handleBlur('department_id')}
                                                className={`w-full pr-9 pl-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${
                                                    getFieldError('department_id')
                                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                        : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                                                }`}
                                            >
                                                {departments.map(dept => (
                                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {getFieldError('department_id') && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.department_id}
                                            </p>
                                        )}
                                        {selectedDepartment && (
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <Layers className="h-3 w-3" />
                                                این سمت به دپارتمان {selectedDepartment.name} تعلق دارد
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Position Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نام سمت <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    onBlur={() => handleBlur('name')}
                                                    placeholder="مثال: مدیر مالی"
                                                    className={`w-full pr-9 pl-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('name')
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                                                    }`}
                                                />
                                            </div>
                                            {getFieldError('name') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Position Code */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                کد سمت <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.code}
                                                    onChange={(e) => setData('code', e.target.value)}
                                                    onBlur={() => handleBlur('code')}
                                                    placeholder="مثال: FIN-MGR-001"
                                                    className={`w-full pr-9 pl-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('code')
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                                                    }`}
                                                />
                                            </div>
                                            {getFieldError('code') && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.code}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Level */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سطح سمت
                                            </label>
                                            <div className="relative">
                                                <TrendingUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    value={data.level}
                                                    onChange={(e) => setData('level', parseInt(e.target.value) || 0)}
                                                    min="0"
                                                    max="10"
                                                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                عدد بین 0 تا 10 - هرچه عدد بزرگتر، سطح بالاتر
                                            </p>
                                        </div>

                                        {/* Management Toggle */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نوع سمت
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setData('is_management', !data.is_management)}
                                                className={`relative w-full p-3 rounded-lg border-2 transition-all duration-200 text-right ${
                                                    data.is_management
                                                        ? 'border-amber-500 bg-amber-50'
                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${
                                                            data.is_management ? 'bg-amber-100' : 'bg-gray-100'
                                                        }`}>
                                                            <Award className={`h-4 w-4 ${
                                                                data.is_management ? 'text-amber-600' : 'text-gray-500'
                                                            }`} />
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-medium ${
                                                                data.is_management ? 'text-amber-900' : 'text-gray-900'
                                                            }`}>
                                                                {data.is_management ? 'سمت مدیریتی' : 'سمت عادی'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {data.is_management 
                                                                    ? 'دارای مسئولیت مدیریتی و تصمیم‌گیری' 
                                                                    : 'سمت عملیاتی و اجرایی'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {data.is_management && (
                                                        <CheckCircle className="h-5 w-5 text-amber-600" />
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            توضیحات
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={4}
                                                placeholder="شرح وظایف، مسئولیت‌ها و اختیارات این سمت..."
                                                className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delete Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
                                    <h2 className="text-lg font-semibold text-red-900">منطقه خطر</h2>
                                    <p className="text-sm text-red-600 mt-0.5">عملیات حذف سمت - این عمل غیرقابل بازگشت است</p>
                                </div>
                                <div className="p-6">
                                    {!showDeleteConfirm ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all shadow-sm"
                                        >
                                            <Trash2 className="ml-2 h-4 w-4" />
                                            حذف سمت
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-700">
                                                آیا از حذف سمت <span className="font-bold text-red-600">"{position.name}"</span> اطمینان دارید؟
                                                <br />
                                                <span className="text-xs text-gray-500">
                                                    این عمل غیرقابل بازگشت است. در صورت وجود کاربران مرتبط با این سمت، ابتدا باید آن‌ها را به سمت دیگری منتقل کنید.
                                                </span>
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleDelete}
                                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all"
                                                >
                                                    <Trash2 className="ml-2 h-4 w-4" />
                                                    بله، حذف شود
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all"
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Information Preview */}
                            {(data.name !== position.name || data.code !== position.code || data.is_management !== position.is_management) && (
                                <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-amber-100 rounded-lg">
                                            <AlertCircle className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-amber-900">تغییرات اعمال شده</p>
                                            <p className="text-xs text-amber-700 mt-1">
                                                تغییرات شما تا زمان ذخیره شدن اعمال نخواهد شد
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions for Mobile */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:hidden">
                                <button
                                    type="button"
                                    onClick={() => router.get(positions.index())}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                                >
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}