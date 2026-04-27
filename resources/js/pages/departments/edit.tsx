import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Building2, Layers,
    CheckCircle, AlertCircle, FolderTree
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import FieldLabel from '@/components/ui/FieldLabel';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import departments from '@/routes/departments';
import type { Organization, Department } from '@/types';

interface Props {
    department: Department;
    organizations: Organization[];
    parentDepartments: Department[];
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function DepartmentsEdit({ department, organizations, parentDepartments }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        organization_id: department.organization_id,
        name: department.name,
        code: department.code,
        parent_id: department.parent_id || '',
        status: department.status,
    });

    const [availableParentDepts, setAvailableParentDepts] = useState<Department[]>(parentDepartments);
    const [loadingParents, setLoadingParents] = useState(false);

    const selectedOrgName = useMemo(() => {
        if (!data.organization_id) {
            return '';
        }

        const org = organizations.find(o => o.id === Number(data.organization_id));

        return org?.name || '';
    }, [data.organization_id, organizations]);

    // Filter out current department from parent options
    const filteredParents = useMemo(() =>
        availableParentDepts.filter(d => d.id !== department.id),
        [availableParentDepts, department.id]
    );

    useEffect(() => {
        if (!data.organization_id) {
            return; // Just return without setting state
        }

        let cancelled = false;
        setLoadingParents(true);

        fetch(`/departments-list?organization_id=${data.organization_id}`)
            .then(r => r.json())
            .then(d => {
                if (!cancelled) {
                    setAvailableParentDepts(d);
                    setLoadingParents(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setLoadingParents(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [data.organization_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(departments.update({ department: department.id }), {
            preserveScroll: true,
        });
    };

    const statusOptions = [
        { value: 'active', label: 'فعال', icon: CheckCircle },
        { value: 'inactive', label: 'غیرفعال', icon: AlertCircle },
    ];

    return (
        <>
            <Head title={`ویرایش ${department.name}`} />

            <div className="min-h-screen bg-slate-50/50" dir="rtl">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <Layers className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-slate-900">ویرایش ریاست</h1>
                                    <p className="text-xs text-slate-500">در حال ویرایش: {department.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.get(departments.index())}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    form="dept-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="dept-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Department Info Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-900">اطلاعات ریاست</h3>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        {/* Name & Code */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <FieldLabel required>نام ریاست</FieldLabel>
                                                <InputField
                                                    icon={FolderTree}
                                                    value={data.name}
                                                    onChange={v => setData('name', v)}
                                                    error={errors.name}
                                                    placeholder="نام ریاست را وارد کنید"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>کد ریاست</FieldLabel>
                                                <InputField
                                                    icon={FolderTree}
                                                    value={data.code}
                                                    onChange={v => setData('code', v)}
                                                    error={errors.code}
                                                    placeholder="کد ریاست (اختیاری)"
                                                />
                                            </div>
                                        </div>

                                        {/* Organization */}
                                        <div>
                                            <FieldLabel required>وزارت مربوطه</FieldLabel>
                                            <SelectField
                                                icon={Building2}
                                                value={data.organization_id}
                                                onChange={v => {
                                                    setData('organization_id', v);
                                                    setData('parent_id', '');
                                                }}
                                                error={errors.organization_id}
                                            >
                                                {organizations.map(org => (
                                                    <option key={org.id} value={org.id}>{org.name}</option>
                                                ))}
                                            </SelectField>
                                        </div>

                                        {/* Parent Department */}
                                        <div>
                                            <FieldLabel>ریاست والد</FieldLabel>
                                            <div className="relative">
                                                <SelectField
                                                    icon={Layers}
                                                    value={data.parent_id}
                                                    onChange={v => setData('parent_id', v)}
                                                    disabled={loadingParents || !data.organization_id}
                                                >
                                                    <option value="">بدون والد (ریاست سطح اول)</option>
                                                    {filteredParents.map(dept => (
                                                        <option key={dept.id} value={dept.id}>
                                                            {dept.name}{dept.code ? ` (${dept.code})` : ''}
                                                        </option>
                                                    ))}
                                                </SelectField>
                                                {loadingParents && (
                                                    <div className="absolute left-3 top-3">
                                                        <div className="h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                            {data.organization_id && !loadingParents && filteredParents.length === 0 && (
                                                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    هیچ ریاست والدی در این سازمان وجود ندارد
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-900">وضعیت ریاست</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex gap-3">
                                            {statusOptions.map((option) => {
                                                const Icon = option.icon;
                                                const isActive = data.status === option.value;

                                                return (
                                                    <label
                                                        key={option.value}
                                                        className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${isActive
                                                                ? 'border-indigo-500 bg-indigo-50'
                                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="status"
                                                            value={option.value}
                                                            checked={isActive}
                                                            onChange={() => setData('status', option.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-indigo-100' : 'bg-slate-100'
                                                            }`}>
                                                            <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'
                                                                }`} />
                                                        </div>
                                                        <div>
                                                            <p className={`font-medium text-sm ${isActive ? 'text-indigo-700' : 'text-slate-700'
                                                                }`}>
                                                                {option.label}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                {option.value === 'active' ? 'ریاست فعال و در دسترس' : 'ریاست غیرفعال شده'}
                                                            </p>
                                                        </div>
                                                        {isActive && (
                                                            <CheckCircle className="h-5 w-5 text-indigo-600 mr-auto" />
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">

                                {/* Preview Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-24">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-900">پیش‌نمایش</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <FolderTree className="h-4 w-4 text-indigo-500" />
                                                    <span className="text-sm font-medium text-indigo-700">
                                                        {data.name || department.name}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 text-xs">
                                                    {data.code && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-slate-500">کد:</span>
                                                            <span className="font-mono text-slate-700">{data.code}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-500">وزارت:</span>
                                                        <span className="text-slate-700">{selectedOrgName}</span>
                                                    </div>
                                                    {data.parent_id && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-slate-500">والد:</span>
                                                            <span className="text-slate-700">
                                                                {filteredParents.find(d => d.id === Number(data.parent_id))?.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
                                                        <span className="text-slate-500">وضعیت:</span>
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${data.status === 'active'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${data.status === 'active' ? 'bg-green-500' : 'bg-slate-400'
                                                                }`}></span>
                                                            {data.status === 'active' ? 'فعال' : 'غیرفعال'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tips Card */}
                                <div className="bg-indigo-50/50 rounded-xl border border-indigo-100 p-5">
                                    <h4 className="text-sm font-semibold text-indigo-900 mb-3">نکات مهم</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2 text-xs text-indigo-700">
                                            <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                                            هر ریاست باید به یک وزارت تعلق داشته باشد
                                        </li>
                                        <li className="flex items-start gap-2 text-xs text-indigo-700">
                                            <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                                            ریاست‌های والد باید در همان سازمان باشند
                                        </li>
                                        <li className="flex items-start gap-2 text-xs text-indigo-700">
                                            <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                                            کد ریاست می‌تواند خالی باشد
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-20">
                            <div className="flex gap-3 max-w-5xl mx-auto">
                                <button
                                    type="button"
                                    onClick={() => router.get(departments.index())}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    <Save className="h-4 w-4" />
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