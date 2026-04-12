import { Head, Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Save, X, Building2, Trash2, Layers, Briefcase, Hash, CheckCircle, AlertCircle, FolderTree, ChevronDown, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import departments from '@/routes/departments';
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [selectedOrgName, setSelectedOrgName] = useState('');

    // Update parent departments list when organization changes
    useEffect(() => {
        if (data.organization_id && data.organization_id !== department.organization_id) {
            const selectedOrg = organizations.find(org => org.id === Number(data.organization_id));
            setSelectedOrgName(selectedOrg?.name || '');
            
            router.get('/departments/list', 
                { organization_id: data.organization_id },
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        setAvailableParentDepts(page.props.departments as Department[]);
                    }
                }
            );
        } else {
            const selectedOrg = organizations.find(org => org.id === Number(data.organization_id));
            setSelectedOrgName(selectedOrg?.name || '');
        }
    }, [data.organization_id, department.organization_id, organizations]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(departments.update({ department: department.id }));
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field: string) => {
        return touched[field] && errors[field] ? errors[field] : null;
    };

    const handleDelete = () => {
        router.delete(departments.destroy({ department: department.id }));
    };

    const statusOptions = [
        { value: 'active', label: 'فعال', color: 'emerald', icon: CheckCircle, description: 'دپارتمان فعال و قابل استفاده است' },
        { value: 'inactive', label: 'غیرفعال', color: 'gray', icon: AlertCircle, description: 'دپارتمان غیرفعال و در دسترس نیست' },
    ];

    const currentStatus = statusOptions.find(opt => opt.value === department.status);

    return (
        <>
            <Head title={`ویرایش دپارتمان - ${department.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                                            <Layers className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">ویرایش دپارتمان</h1>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                در حال ویرایش {department.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={departments.show({department: department.id })}
                                        className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <Eye className="ml-2 h-4 w-4" />
                                        مشاهده
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => router.get(departments.index())}
                                        className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    >
                                        <X className="ml-2 h-4 w-4" />
                                        انصراف
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    <p className="text-sm text-gray-500 mt-0.5">اطلاعات اصلی دپارتمان</p>
                                </div>
                                <div className="p-6 space-y-5">
                                    {/* Organization Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            سازمان <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <select
                                                value={data.organization_id}
                                                onChange={(e) => setData('organization_id', e.target.value)}
                                                onBlur={() => handleBlur('organization_id')}
                                                className={`w-full pr-9 pl-8 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${
                                                    getFieldError('organization_id')
                                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                        : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
                                                }`}
                                            >
                                                {organizations.map(org => (
                                                    <option key={org.id} value={org.id}>{org.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        {getFieldError('organization_id') && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.organization_id}
                                            </p>
                                        )}
                                        {selectedOrgName && (
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <Building2 className="h-3 w-3" />
                                                این دپارتمان به سازمان {selectedOrgName} تعلق دارد
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Department Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نام دپارتمان <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <FolderTree className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    onBlur={() => handleBlur('name')}
                                                    placeholder="مثال: اداره مالی"
                                                    className={`w-full pr-9 pl-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('name')
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
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

                                        {/* Department Code */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                کد دپارتمان <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.code}
                                                    onChange={(e) => setData('code', e.target.value)}
                                                    onBlur={() => handleBlur('code')}
                                                    placeholder="مثال: FIN-001"
                                                    className={`w-full pr-9 pl-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                                        getFieldError('code')
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
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

                                    {/* Parent Department */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            دپارتمان والد
                                        </label>
                                        <div className="relative">
                                            <Layers className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <select
                                                value={data.parent_id}
                                                onChange={(e) => setData('parent_id', e.target.value)}
                                                className="w-full pr-9 pl-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white"
                                                disabled={availableParentDepts.filter(dept => dept.id !== department.id).length === 0}
                                            >
                                                <option value="">بدون والد (دپارتمان سطح اول)</option>
                                                {availableParentDepts
                                                    .filter(dept => dept.id !== department.id)
                                                    .map(dept => (
                                                        <option key={dept.id} value={dept.id}>
                                                            {dept.name} {dept.code && `(${dept.code})`}
                                                        </option>
                                                    ))}
                                            </select>
                                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        {department.parent && (
                                            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                دپارتمان والد فعلی: {department.parent.name}
                                            </p>
                                        )}
                                        {availableParentDepts.filter(dept => dept.id !== department.id).length === 0 && (
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                هیچ دپارتمان والدی برای انتخاب وجود ندارد (به غیر از خود دپارتمان)
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                    <h2 className="text-lg font-semibold text-gray-900">وضعیت دپارتمان</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">تعیین وضعیت فعال یا غیرفعال دپارتمان</p>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {statusOptions.map((option) => {
                                            const Icon = option.icon;
                                            const isSelected = data.status === option.value;

                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setData('status', option.value)}
                                                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-right ${
                                                        isSelected
                                                            ? `border-${option.color}-500 bg-${option.color}-50`
                                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${
                                                                isSelected ? `bg-${option.color}-100` : 'bg-gray-100'
                                                            }`}>
                                                                <Icon className={`h-5 w-5 ${
                                                                    isSelected ? `text-${option.color}-600` : 'text-gray-500'
                                                                }`} />
                                                            </div>
                                                            <div>
                                                                <p className={`font-medium ${
                                                                    isSelected ? `text-${option.color}-900` : 'text-gray-900'
                                                                }`}>
                                                                    {option.label}
                                                                </p>
                                                                <p className={`text-xs mt-0.5 ${
                                                                    isSelected ? `text-${option.color}-600` : 'text-gray-500'
                                                                }`}>
                                                                    {option.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {isSelected && (
                                                            <CheckCircle className={`h-5 w-5 text-${option.color}-600`} />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Delete Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
                                    <h2 className="text-lg font-semibold text-red-900">منطقه خطر</h2>
                                    <p className="text-sm text-red-600 mt-0.5">عملیات حذف دپارتمان - این عمل غیرقابل بازگشت است</p>
                                </div>
                                <div className="p-6">
                                    {!showDeleteConfirm ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all shadow-sm"
                                        >
                                            <Trash2 className="ml-2 h-4 w-4" />
                                            حذف دپارتمان
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-700">
                                                آیا از حذف دپارتمان <span className="font-bold text-red-600">"{department.name}"</span> اطمینان دارید؟
                                                <br />
                                                <span className="text-xs text-gray-500">
                                                    این عمل غیرقابل بازگشت است. در صورت وجود دپارتمان‌های زیرمجموعه، ابتدا باید آن‌ها را حذف یا انتقال دهید.
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
                            {(data.name !== department.name || data.code !== department.code || data.status !== department.status) && (
                                <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-yellow-100 rounded-lg">
                                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-yellow-900">تغییرات اعمال شده</p>
                                            <p className="text-xs text-yellow-700 mt-1">
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
                                    onClick={() => router.get(departments.index())}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                                >
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-50"
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