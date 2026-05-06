import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Save, X, Briefcase, FileText, CheckCircle, Crown, Users, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import FieldLabel from '@/components/ui/FieldLabel';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import positions from '@/routes/positions';
import type { Organization } from '@/types';

interface Props {
    organizations: Organization[];
    selectedDepartment?: number;
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function PositionsCreate({ organizations }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        organization_id: '',
        department_id: '',
        name: '',
        is_management: true,
        description: '',
    });

    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        axios.get('/organizations/departments', { params: { organization_id: data.organization_id } })
            .then(res => {
                setDepartments(res.data.departments || []);
            })
            .catch(() => {
                setDepartments([]);
            });
    }, [data.organization_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(positions.store().url, {
            preserveScroll: true,
            onSuccess: () => reset()
        });
    };

    return (
        <>
            <Head title="ایجاد وظیفه جدید" />

            <div className="min-h-screen">
                {/* Form Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 ">
                    <form id="pos-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Position Info Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-900">اطلاعات وظیفه</h3>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        {/* Name & Department */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <FieldLabel required>وزارت مربوطه</FieldLabel>
                                                <SelectField
                                                    icon={Building2}
                                                    value={data.organization_id}
                                                    onChange={v => setData('organization_id', v)}
                                                    error={errors.organization_id}
                                                >
                                                    <option>انتخاب کنید</option>
                                                    {organizations.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </SelectField>
                                            </div>

                                            <div>
                                                <FieldLabel required>ریاست مربوطه</FieldLabel>
                                                <SelectField
                                                    icon={Building2}
                                                    value={data.department_id}
                                                    onChange={v => setData('department_id', v)}
                                                    error={errors.department_id}
                                                >
                                                    <option>انتخاب کنید</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </SelectField>
                                            </div>
                                            <div>
                                                <FieldLabel required>نام وظیفه</FieldLabel>
                                                <InputField
                                                    icon={Briefcase}
                                                    value={data.name}
                                                    onChange={v => setData('name', v)}
                                                    error={errors.name}
                                                    placeholder="نام وظیفه را وارد کنید"
                                                />
                                            </div>
                                        </div>

                                        {/* Type Selection */}
                                        {/* <div>
                                            <FieldLabel>نوع وظیفه</FieldLabel>
                                            <div className="grid grid-cols-2 gap-3">
                                                <label
                                                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${!data.is_management
                                                        ? 'border-slate-800 bg-slate-50'
                                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="is_management"
                                                        checked={!data.is_management}
                                                        onChange={() => setData('is_management', false)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${!data.is_management ? 'bg-slate-200' : 'bg-slate-100'
                                                        }`}>
                                                        <Users className={`h-5 w-5 ${!data.is_management ? 'text-slate-700' : 'text-slate-400'
                                                            }`} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium text-sm ${!data.is_management ? 'text-slate-800' : 'text-slate-500'
                                                            }`}>
                                                            عملیاتی
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            اجرای وظایف روزمره
                                                        </p>
                                                    </div>
                                                    {!data.is_management && (
                                                        <CheckCircle className="h-5 w-5 text-slate-700 mr-auto" />
                                                    )}
                                                </label>

                                                <label
                                                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${data.is_management
                                                        ? 'border-amber-400 bg-amber-50'
                                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="is_management"
                                                        checked={data.is_management}
                                                        onChange={() => setData('is_management', true)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${data.is_management ? 'bg-amber-100' : 'bg-slate-100'
                                                        }`}>
                                                        <Crown className={`h-5 w-5 ${data.is_management ? 'text-amber-600' : 'text-slate-400'
                                                            }`} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium text-sm ${data.is_management ? 'text-amber-800' : 'text-slate-500'
                                                            }`}>
                                                            مدیریتی
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            تصمیم‌گیری و سرپرستی
                                                        </p>
                                                    </div>
                                                    {data.is_management && (
                                                        <CheckCircle className="h-5 w-5 text-amber-500 mr-auto" />
                                                    )}
                                                </label>
                                            </div>
                                        </div> */}

                                        {/* Description */}
                                        <div>
                                            <FieldLabel>توضیحات</FieldLabel>
                                            <InputField
                                                icon={FileText}
                                                value={data.description}
                                                onChange={v => setData('description', v)}
                                                error={errors.description}
                                                placeholder="شرح وظایف، مسئولیت‌ها و اختیارات این وظیفه..."
                                                textarea
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Tips Card */}
                                <div className="bg-white rounded-xl border border-violet-100 p-5">
                                    <h4 className="text-sm font-semibold text-violet-900 mb-3">نکات مهم</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2 text-xs text-violet-700">
                                            <CheckCircle className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                                            هر وظیفه باید به یک ریاست تعلق داشته باشد
                                        </li>
                                        <li className="flex items-start gap-2 text-xs text-violet-700">
                                            <CheckCircle className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                                            وظایف مدیریتی برای سطوح سرپرستی تعریف می‌شوند
                                        </li>
                                        <li className="flex items-start gap-2 text-xs text-violet-700">
                                            <CheckCircle className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                                            توضیحات می‌تواند شامل شرح مسئولیت‌ها باشد
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="mt-5 rounded-2xl bg-white border-t border-slate-200 p-4 z-20">
                            <div className="flex gap-3 max-w-5xl mx-auto">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    {processing ? 'در حال ذخیره...' : 'ایجاد وظیفه'}
                                    <Save className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.get(positions.index())}
                                    className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    انصراف
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}