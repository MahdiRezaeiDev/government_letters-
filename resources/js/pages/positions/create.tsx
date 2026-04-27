import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Briefcase, Layers, FileText,
    CheckCircle, Crown, Users, Building2, Info
} from 'lucide-react';
import { useMemo } from 'react';
import FieldLabel from '@/components/ui/FieldLabel';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import positions from '@/routes/positions';
import type { Department } from '@/types';

interface Props {
    departments: Department[];
    selectedDepartment?: number;
}


// ─── Main Component ────────────────────────────────────────────────────────

export default function PositionsCreate({ departments, selectedDepartment }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        department_id: selectedDepartment || departments[0]?.id || '',
        name: '',
        is_management: false,
        description: '',
    });

    const selectedDeptName = useMemo(() => {
        const dept = departments.find(d => d.id === Number(data.department_id));

        return dept?.name || '';
    }, [data.department_id, departments]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(positions.store().url, { onSuccess: () => reset() });
    };



    const hasPreview = !!(data.name);

    return (
        <>
            <Head title="ایجاد وظیفه جدید" />
            <div className="min-h-screen bg-slate-50/70">

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-violet-50 text-violet-600 tracking-wide">
                                    وظایف
                                </span>
                                <span className="text-slate-300 text-lg font-light">/</span>
                                <h1 className="text-sm font-bold text-slate-800">ایجاد وظیفه جدید</h1>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => router.get(positions.index())}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    form="pos-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ایجاد وظیفه'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="pos-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* ── Intro strip ── */}
                            <div className="rounded-2xl border border-violet-100 bg-gradient-to-l from-violet-50 to-purple-50 px-6 py-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Briefcase className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">ایجاد وظیفه جدید</p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        اطلاعات وظیفه را تکمیل کنید. فیلدهای ستاره‌دار الزامی هستند.
                                    </p>
                                </div>
                            </div>

                            {/* ── Main Form Card ── */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                                        <Info className="h-4 w-4 text-violet-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">اطلاعات پایه</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">مشخصات اصلی وظیفه </p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">

                                    {/* Department */}
                                    <div>
                                        <FieldLabel required>ریاست</FieldLabel>
                                        <SelectField
                                            icon={Building2}
                                            value={data.department_id}
                                            onChange={v => setData('department_id', v)}
                                            error={errors.department_id}
                                        >
                                            <option value="">انتخاب ریاست...</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </SelectField>
                                        {selectedDeptName && !errors.department_id && (
                                            <div className="mt-2.5 inline-flex items-center gap-2 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full">
                                                <Layers className="h-3 w-3" />
                                                وظیفه برای: {selectedDeptName}
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Name + Code */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel required>نام وظیفه</FieldLabel>
                                            <InputField
                                                icon={Briefcase}
                                                value={data.name}
                                                onChange={v => setData('name', v)}
                                                error={errors.name}
                                                placeholder="مثال: مدیر مالی"
                                            />
                                        </div>

                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Level + Management Type */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Management toggle card */}
                                        <div>
                                            <FieldLabel>نوع وظیفه</FieldLabel>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    {
                                                        value: false,
                                                        icon: Users,
                                                        title: 'عملیاتی',
                                                        desc: 'اجرای وظایف روزمره',
                                                    },
                                                    {
                                                        value: true,
                                                        icon: Crown,
                                                        title: 'مدیریتی',
                                                        desc: 'تصمیم‌گیری و سرپرستی',
                                                    },
                                                ].map(opt => {
                                                    const Icon = opt.icon;
                                                    const active = data.is_management === opt.value;

                                                    return (
                                                        <button
                                                            key={String(opt.value)}
                                                            type="button"
                                                            onClick={() => setData('is_management', opt.value)}
                                                            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all duration-150 focus:outline-none ${active
                                                                ? opt.value
                                                                    ? 'border-amber-400 bg-amber-50 shadow-sm'
                                                                    : 'border-slate-800 bg-slate-50 shadow-sm'
                                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {/* آیکون */}
                                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${active
                                                                ? opt.value ? 'bg-amber-100' : 'bg-slate-200'
                                                                : 'bg-slate-100'
                                                                }`}>
                                                                <Icon className={`h-5 w-5 transition-colors ${active
                                                                    ? opt.value ? 'text-amber-600' : 'text-slate-700'
                                                                    : 'text-slate-400'
                                                                    }`} />
                                                            </div>

                                                            {/* متن */}
                                                            <div>
                                                                <p className={`text-sm font-bold ${active
                                                                    ? opt.value ? 'text-amber-800' : 'text-slate-800'
                                                                    : 'text-slate-500'
                                                                    }`}>
                                                                    {opt.title}
                                                                </p>
                                                                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                                                    {opt.desc}
                                                                </p>
                                                            </div>

                                                            {/* نشانگر انتخاب */}
                                                            {active && (
                                                                <span className={`absolute top-2.5 left-2.5 h-2 w-2 rounded-full ${opt.value ? 'bg-amber-400' : 'bg-slate-800'
                                                                    }`} />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Description */}
                                    <div>
                                        <FieldLabel>توضیحات</FieldLabel>
                                        <InputField
                                            icon={FileText}
                                            value={data.description}
                                            onChange={v => setData('description', v)}
                                            placeholder="شرح وظایف، مسئولیت‌ها و اختیارات این وظیفه..."
                                            textarea
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── Live Preview strip ── */}
                            {hasPreview && (
                                <div className="rounded-2xl border border-violet-100 bg-gradient-to-l from-violet-600 to-purple-700 px-6 py-4 flex items-center gap-4 fade-up">
                                    <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                                        <Briefcase className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-white/70 mb-1">پیش‌نمایش وظیفه</p>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <span className="text-sm font-bold text-white">{data.name}</span>
                                            <span className="text-white/40 text-xs">•</span>
                                            {data.is_management && (
                                                <>
                                                    <span className="text-white/40 text-xs">•</span>
                                                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                                                        <Crown className="h-3 w-3" />مدیریتی
                                                    </span>
                                                </>
                                            )}
                                            {selectedDeptName && (
                                                <>
                                                    <span className="text-white/40 text-xs">•</span>
                                                    <span className="text-xs text-white/70 flex items-center gap-1">
                                                        <Building2 className="h-3 w-3" />{selectedDeptName}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <CheckCircle className="h-5 w-5 text-emerald-300 flex-shrink-0" />
                                </div>
                            )}

                            {/* ── Mobile Actions ── */}
                            <div className="flex gap-3 sm:hidden pb-4">
                                <button
                                    type="button"
                                    onClick={() => router.get(positions.index())}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-md disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ایجاد وظیفه'}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}