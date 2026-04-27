import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Briefcase, FileText,
    CheckCircle, Crown, Users, Building2
} from 'lucide-react';
import { useMemo } from 'react';
import FieldLabel from '@/components/ui/FieldLabel';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import positions from '@/routes/positions';
import type { Position, Department } from '@/types';

interface Props {
    position: Position;
    departments: Department[];
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function PositionsEdit({ position, departments }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        department_id: position.department_id,
        name: position.name,
        is_management: position.is_management,
        description: position.description || '',
    });

    const selectedDeptName = useMemo(() => {
        const dept = departments.find(d => d.id === Number(data.department_id));

        return dept?.name || '';
    }, [data.department_id, departments]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(positions.update({ position: position.id }).url, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`ویرایش ${position.name}`} />

            <div className="min-h-screen bg-slate-50/50" dir="rtl">
                {/* Form Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                                <FieldLabel required>نام وظیفه</FieldLabel>
                                                <InputField
                                                    icon={Briefcase}
                                                    value={data.name}
                                                    onChange={v => setData('name', v)}
                                                    error={errors.name}
                                                    placeholder="نام وظیفه را وارد کنید"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel required>ریاست مربوطه</FieldLabel>
                                                <SelectField
                                                    icon={Building2}
                                                    value={data.department_id}
                                                    onChange={v => setData('department_id', v)}
                                                    error={errors.department_id}
                                                >
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </SelectField>
                                            </div>
                                        </div>

                                        {/* Type Selection */}
                                        <div>
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
                                        </div>

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

                                {/* Preview Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-24">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h3 className="font-semibold text-slate-900">پیش‌نمایش</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Briefcase className="h-4 w-4 text-violet-500" />
                                                    <span className="text-sm font-medium text-violet-700">
                                                        {data.name || position.name}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 text-xs">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-500">ریاست:</span>
                                                        <span className="text-slate-700">{selectedDeptName}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-2 border-t border-violet-100">
                                                        <span className="text-slate-500">نوع:</span>
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${data.is_management
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {data.is_management ? (
                                                                <Crown className="h-3 w-3" />
                                                            ) : (
                                                                <Users className="h-3 w-3" />
                                                            )}
                                                            {data.is_management ? 'مدیریتی' : 'عملیاتی'}
                                                        </span>
                                                    </div>
                                                    {data.description && (
                                                        <div className="pt-2 border-t border-violet-100">
                                                            <span className="text-slate-500 block mb-1">توضیحات:</span>
                                                            <p className="text-slate-600 leading-relaxed line-clamp-3">
                                                                {data.description}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tips Card */}
                                <div className="bg-violet-50/50 rounded-xl border border-violet-100 p-5">
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
                        <div className="bg-white p-4">
                            <div className="flex gap-3 max-w-5xl mx-auto">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.get(positions.index())}
                                    className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}