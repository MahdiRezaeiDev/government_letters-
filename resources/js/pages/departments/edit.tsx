import { Head, Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Building2, Trash2, Layers, Briefcase,
    Hash, CheckCircle, AlertCircle, FolderTree, Eye, Info, Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';
import departments from '@/routes/departments';
import type { Organization, Department } from '@/types';

interface Props {
    department: Department;
    organizations: Organization[];
    parentDepartments: Department[];
}

// ─── Shared Field Components (identical to DepartmentsCreate) ──────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {children}
            {required && <span className="text-rose-400 mr-1">*</span>}
        </label>
    );
}

function InputField({
    icon: Icon, value, onChange, onBlur, error, placeholder, disabled = false
}: {
    icon?: React.ElementType; value: string; onChange: (v: string) => void;
    onBlur?: () => void; error?: string | null; placeholder?: string; disabled?: boolean;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${
                disabled ? 'opacity-60 bg-slate-50 border-slate-200' :
                error
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'
            }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-4 py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300 ${disabled ? 'cursor-not-allowed' : ''}`}
                />
            </div>
            {error && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />{error}
                </p>
            )}
        </div>
    );
}

function SelectField({
    icon: Icon, value, onChange, onBlur, error, children, disabled = false, loading = false
}: {
    icon?: React.ElementType; value: string | number; onChange: (v: string) => void;
    onBlur?: () => void; error?: string | null; children: React.ReactNode;
    disabled?: boolean; loading?: boolean;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${
                disabled ? 'opacity-60 bg-slate-50 border-slate-200' :
                error
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'
            }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    disabled={disabled || loading}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-9 py-3 text-sm bg-transparent focus:outline-none appearance-none text-slate-700 ${disabled ? 'cursor-not-allowed' : ''}`}
                >
                    {children}
                </select>
                <svg className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {error && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{error}
                </p>
            )}
        </div>
    );
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [selectedOrgName, setSelectedOrgName] = useState(
        organizations.find(o => o.id === Number(department.organization_id))?.name || ''
    );

    const hasChanges = data.name !== department.name ||
        data.code !== department.code ||
        data.status !== department.status ||
        String(data.parent_id) !== String(department.parent_id || '') ||
        String(data.organization_id) !== String(department.organization_id);

    useEffect(() => {
        const org = organizations.find(o => o.id === Number(data.organization_id));
        setSelectedOrgName(org?.name || '');

        if (String(data.organization_id) !== String(department.organization_id)) {
            router.get('/departments/list', { organization_id: data.organization_id }, {
                preserveState: true,
                onSuccess: (page) => setAvailableParentDepts(page.props.departments as Department[]),
            });
        }
    }, [data.organization_id]);

    const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
    const getFieldError = (field: string) => touched[field] && errors[field] ? errors[field] : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(departments.update({ department: department.id }));
    };

    const handleDelete = () => router.delete(departments.destroy({ department: department.id }));

    const statusOptions = [
        { value: 'active',   label: 'فعال',     desc: 'دپارتمان فعال و قابل استفاده است',    icon: CheckCircle, color: '#10b981', bg: '#d1fae5', ring: '#6ee7b7' },
        { value: 'inactive', label: 'غیرفعال',  desc: 'دپارتمان غیرفعال و در دسترس نیست',   icon: AlertCircle, color: '#94a3b8', bg: '#f1f5f9', ring: '#cbd5e1' },
    ];

    const filteredParents = availableParentDepts.filter(d => d.id !== department.id);

    return (
        <>
            <Head title={`ویرایش — ${department.name}`} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
                * { font-family: 'Vazirmatn', sans-serif; }
                :root { direction: rtl; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
                .fade-up { animation: fadeUp 0.25s ease-out both; }
            `}</style>

            <div className="min-h-screen bg-slate-50/70" dir="rtl">

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 tracking-wide">
                                    دپارتمان‌ها
                                </span>
                                <span className="text-slate-300 text-lg font-light">/</span>
                                <h1 className="text-sm font-bold text-slate-800 truncate max-w-[160px] sm:max-w-xs">
                                    {department.name}
                                </h1>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Link
                                    href={departments.show({ department: department.id })}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                                >
                                    <Eye className="h-4 w-4" />
                                    <span className="hidden sm:inline">مشاهده</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => router.get(departments.index())}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="hidden sm:inline">انصراف</span>
                                </button>
                                <button
                                    type="submit"
                                    form="dept-edit-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="dept-edit-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* ── Intro strip ── */}
                            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-l from-indigo-50 to-violet-50 px-6 py-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Layers className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800">ویرایش دپارتمان</p>
                                    <p className="text-xs text-slate-500 mt-0.5">در حال ویرایش اطلاعات <span className="font-bold text-indigo-600">{department.name}</span></p>
                                </div>
                                {hasChanges && (
                                    <span className="fade-up flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-bold
                                        text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                                        <AlertCircle className="h-3 w-3" />
                                        تغییرات ذخیره نشده
                                    </span>
                                )}
                            </div>

                            {/* ── Basic Info ── */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <FolderTree className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">اطلاعات پایه</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">مشخصات اصلی دپارتمان</p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Organization */}
                                    <div>
                                        <FieldLabel required>سازمان</FieldLabel>
                                        <SelectField
                                            icon={Building2}
                                            value={data.organization_id}
                                            onChange={v => setData('organization_id', v)}
                                            onBlur={() => handleBlur('organization_id')}
                                            error={getFieldError('organization_id')}
                                        >
                                            {organizations.map(org => (
                                                <option key={org.id} value={org.id}>{org.name}</option>
                                            ))}
                                        </SelectField>
                                        {selectedOrgName && (
                                            <div className="mt-2.5 inline-flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                                                <Building2 className="h-3 w-3" />
                                                دپارتمان برای: {selectedOrgName}
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Name + Code */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel required>نام دپارتمان</FieldLabel>
                                            <InputField
                                                icon={FolderTree}
                                                value={data.name}
                                                onChange={v => setData('name', v)}
                                                onBlur={() => handleBlur('name')}
                                                error={getFieldError('name')}
                                                placeholder="مثال: اداره مالی"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel required>کد دپارتمان</FieldLabel>
                                            <InputField
                                                icon={Hash}
                                                value={data.code}
                                                onChange={v => setData('code', v)}
                                                onBlur={() => handleBlur('code')}
                                                error={getFieldError('code')}
                                                placeholder="مثال: FIN-001"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Parent department */}
                                    <div>
                                        <FieldLabel>دپارتمان والد</FieldLabel>
                                        <SelectField
                                            icon={Layers}
                                            value={data.parent_id}
                                            onChange={v => setData('parent_id', v)}
                                            disabled={filteredParents.length === 0}
                                        >
                                            <option value="">بدون والد (سطح اول)</option>
                                            {filteredParents.map(d => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name}{d.code ? ` (${d.code})` : ''}
                                                </option>
                                            ))}
                                        </SelectField>

                                        {department.parent && (
                                            <div className="mt-2.5 inline-flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                                                <Info className="h-3 w-3" />
                                                والد فعلی: {department.parent.name}
                                            </div>
                                        )}

                                        {filteredParents.length === 0 && (
                                            <div className="mt-2.5 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                                                <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
                                                <span>هیچ دپارتمان والدی یافت نشد. این دپارتمان به عنوان سطح اول باقی می‌ماند.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── Status ── */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                        <Shield className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">وضعیت دپارتمان</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">وضعیت فعال یا غیرفعال بودن را تعیین کنید</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {statusOptions.map(opt => {
                                            const Icon = opt.icon;
                                            const isSelected = data.status === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setData('status', opt.value)}
                                                    style={isSelected ? { borderColor: opt.ring, backgroundColor: opt.bg } : {}}
                                                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-right focus:outline-none ${
                                                        isSelected ? '' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                            style={{ backgroundColor: isSelected ? opt.color + '22' : '#f1f5f9' }}>
                                                            <Icon className="h-5 w-5" style={{ color: isSelected ? opt.color : '#94a3b8' }} />
                                                        </div>
                                                        <div className="flex-1 text-right">
                                                            <p className="text-sm font-bold" style={{ color: isSelected ? opt.color : '#334155' }}>{opt.label}</p>
                                                            <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0"
                                                                style={{ backgroundColor: opt.color }}>
                                                                <CheckCircle className="h-3.5 w-3.5 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Status info */}
                                    <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 mt-4">
                                        <div className="h-7 w-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Info className="h-3.5 w-3.5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-600 mb-1">وضعیت انتخابی</p>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: statusOptions.find(o => o.value === data.status)?.color }} />
                                                <span className="text-sm font-bold"
                                                    style={{ color: statusOptions.find(o => o.value === data.status)?.color }}>
                                                    {statusOptions.find(o => o.value === data.status)?.label}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    — {statusOptions.find(o => o.value === data.status)?.desc}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Danger Zone ── */}
                            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-rose-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-rose-50/40">
                                    <div className="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                                        <Trash2 className="h-4 w-4 text-rose-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-rose-800">منطقه خطر</h2>
                                        <p className="text-xs text-rose-400 mt-0.5">عملیات غیرقابل بازگشت</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {!showDeleteConfirm ? (
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">حذف دپارتمان «{department.name}»</p>
                                                <p className="text-xs text-slate-400 mt-0.5">پس از حذف، بازیابی این دپارتمان امکان‌پذیر نیست.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                حذف
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3.5">
                                                <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-bold text-rose-800">آیا اطمینان دارید؟</p>
                                                    <p className="text-xs text-rose-600 mt-1 leading-relaxed">
                                                        دپارتمان <span className="font-bold">«{department.name}»</span> حذف خواهد شد.
                                                        در صورت وجود زیردپارتمان‌ها، ابتدا باید آن‌ها را حذف یا انتقال دهید.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleDelete}
                                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    بله، حذف شود
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Mobile Actions ── */}
                            <div className="flex gap-3 sm:hidden pb-4">
                                <button type="button" onClick={() => router.get(departments.index())}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all">
                                    <X className="h-4 w-4" />انصراف
                                </button>
                                <button type="submit" disabled={processing}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50">
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ذخیره'}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}