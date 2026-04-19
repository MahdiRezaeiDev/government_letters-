// resources/js/pages/users/create.tsx

import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Eye, EyeOff, Building2, Users, Briefcase, Shield,
    Mail, Phone, User, Key, Award, AlertCircle, CheckCircle,
    Loader2, CreditCard, Hash, Globe, Lock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import users from '@/routes/users';
import type { Organization, Department, Position, Role } from '@/types';

interface Props {
    organizations: Organization[];
    departments: Department[];
    positions: Position[];
    roles: Role[];
    myOrganizationId: number | null;
}

interface FormData {
    organization_id: number;
    department_id: number | null;
    primary_position_id: number | null;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
    national_code: string;
    mobile: string;
    employment_code: string;
    status: 'active' | 'inactive' | 'suspended';
    security_clearance: 'public' | 'internal' | 'confidential' | 'secret';
    role: string;
}

// ─── Config ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
    { value: 'active',   label: 'فعال',    desc: 'کاربر فعال و قابل استفاده',    icon: CheckCircle, color: '#10b981', bg: '#d1fae5', ring: '#6ee7b7' },
    { value: 'inactive', label: 'غیرفعال', desc: 'کاربر غیرفعال شده',            icon: AlertCircle, color: '#94a3b8', bg: '#f1f5f9', ring: '#cbd5e1' },
    { value: 'suspended',label: 'تعلیق',   desc: 'دسترسی موقتاً قطع شده',       icon: AlertCircle, color: '#ef4444', bg: '#fee2e2', ring: '#fca5a5' },
] as const;

const SECURITY_LEVELS = [
    { value: 'public',       label: 'عمومی',    icon: Globe,   color: '#64748b', bg: '#f8fafc' },
    { value: 'internal',     label: 'داخلی',    icon: Shield,  color: '#3b82f6', bg: '#eff6ff' },
    { value: 'confidential', label: 'محرمانه',  icon: Lock,    color: '#f59e0b', bg: '#fffbeb' },
    { value: 'secret',       label: 'سری',      icon: Shield,  color: '#ef4444', bg: '#fee2e2' },
] as const;

const ROLE_LABELS: Record<string, string> = {
    'super-admin': 'ادمین کل',
    'org-admin':   'ادمین سازمان',
    'dept-manager':'مدیر دپارتمان',
    'user':        'کاربر عادی',
};

// ─── Shared Field Components ───────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {children}
            {required && <span className="text-rose-400 mr-1">*</span>}
        </label>
    );
}

function Field({
    icon: Icon, type = 'text', value, onChange, onBlur, error, placeholder,
    disabled = false, maxLength, suffix
}: {
    icon?: React.ElementType; type?: string; value: string; onChange: (v: string) => void;
    onBlur?: () => void; error?: string | null; placeholder?: string;
    disabled?: boolean; maxLength?: number; suffix?: React.ReactNode;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${
                disabled ? 'opacity-60 bg-slate-50' :
                error
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100'
            }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none flex-shrink-0" />}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} ${suffix ? 'pl-10' : 'pl-4'} py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300`}
                />
                {suffix && <div className="absolute left-3.5">{suffix}</div>}
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
    icon: Icon, value, onChange, children, disabled = false, loading = false, error
}: {
    icon?: React.ElementType; value: string | number; onChange: (v: string) => void;
    children: React.ReactNode; disabled?: boolean; loading?: boolean; error?: string | null;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${
                disabled ? 'opacity-60 bg-slate-50' :
                error
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100'
            }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    disabled={disabled || loading}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-9 py-3 text-sm bg-transparent focus:outline-none appearance-none text-slate-700 ${disabled ? 'cursor-not-allowed' : ''}`}
                >
                    {children}
                </select>
                {loading
                    ? <Loader2 className="absolute left-3.5 h-4 w-4 text-slate-400 animate-spin pointer-events-none" />
                    : <svg className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                }
            </div>
            {error && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{error}
                </p>
            )}
        </div>
    );
}

function SectionCard({ icon: Icon, iconColor, title, subtitle, children }: {
    icon: React.ElementType; iconColor: string; title: string; subtitle: string; children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconColor + '18' }}>
                    <Icon className="h-4 w-4" style={{ color: iconColor }} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-800">{title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function UsersCreate({
    organizations, departments: initialDepartments, positions: initialPositions,
    roles, myOrganizationId
}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
    const [positions, setPositions] = useState<Position[]>(initialPositions);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadingPositions, setLoadingPositions] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        organization_id: myOrganizationId || organizations[0]?.id || 0,
        department_id: null,
        primary_position_id: null,
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
        national_code: '',
        mobile: '',
        employment_code: '',
        status: 'active',
        security_clearance: 'internal',
        role: 'user',
    });

    const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
    const getFieldError = (field: string) => touched[field] && errors[field] ? errors[field] : null;

    useEffect(() => {
        if (data.organization_id) {
            setLoadingDepts(true);
            fetch(`/users/departments-by-organization?organization_id=${data.organization_id}`)
                .then(r => r.json())
                .then(d => { setDepartments(d.departments); setLoadingDepts(false); })
                .catch(() => setLoadingDepts(false));
        }
    }, [data.organization_id]);

    useEffect(() => {
        if (data.department_id) {
            setLoadingPositions(true);
            fetch(`/users/positions-by-department?department_id=${data.department_id}`)
                .then(r => r.json())
                .then(d => { setPositions(d.positions); setLoadingPositions(false); })
                .catch(() => setLoadingPositions(false));
        } else {
            setPositions([]);
        }
    }, [data.department_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(users.store(), {
            preserveScroll: true,
            onSuccess: () => { reset(); router.get(users.index()); },
        });
    };

    const selectedStatus = STATUS_OPTIONS.find(s => s.value === data.status)!;
    const selectedSecurity = SECURITY_LEVELS.find(s => s.value === data.security_clearance)!;

    return (
        <>
            <Head title="ایجاد کاربر جدید" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
                * { font-family: 'Vazirmatn', sans-serif; }
                :root { direction: rtl; }
            `}</style>

            <div className="min-h-screen bg-slate-50/70" dir="rtl">

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-sky-50 text-sky-600 tracking-wide">
                                    کاربران
                                </span>
                                <span className="text-slate-300 text-lg font-light">/</span>
                                <h1 className="text-sm font-bold text-slate-800">ایجاد کاربر جدید</h1>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => router.get(users.index())}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    form="user-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ثبت...' : 'ایجاد کاربر'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="user-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* ── Intro strip ── */}
                            <div className="rounded-2xl border border-sky-100 bg-gradient-to-l from-sky-50 to-cyan-50 px-6 py-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">ایجاد کاربر جدید</p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        اطلاعات کاربر را تکمیل کنید. فیلدهای ستاره‌دار الزامی هستند.
                                    </p>
                                </div>
                            </div>

                            {/* ── 1. Personal Info ── */}
                            <SectionCard icon={User} iconColor="#0ea5e9" title="اطلاعات شخصی" subtitle="مشخصات هویتی کاربر">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <FieldLabel required>نام</FieldLabel>
                                        <Field
                                            value={data.first_name}
                                            onChange={v => setData('first_name', v)}
                                            onBlur={() => handleBlur('first_name')}
                                            error={getFieldError('first_name')}
                                            placeholder="علی"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel required>نام خانوادگی</FieldLabel>
                                        <Field
                                            value={data.last_name}
                                            onChange={v => setData('last_name', v)}
                                            onBlur={() => handleBlur('last_name')}
                                            error={getFieldError('last_name')}
                                            placeholder="رضایی"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel required>کد ملی</FieldLabel>
                                        <Field
                                            icon={Hash}
                                            value={data.national_code}
                                            onChange={v => setData('national_code', v)}
                                            onBlur={() => handleBlur('national_code')}
                                            error={getFieldError('national_code')}
                                            placeholder="1234567890"
                                            maxLength={10}
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel>تلفن همراه</FieldLabel>
                                        <Field
                                            icon={Phone}
                                            type="tel"
                                            value={data.mobile}
                                            onChange={v => setData('mobile', v)}
                                            placeholder="09123456789"
                                        />
                                    </div>
                                </div>
                            </SectionCard>

                            {/* ── 2. Account Info ── */}
                            <SectionCard icon={Key} iconColor="#10b981" title="اطلاعات حساب کاربری" subtitle="اطلاعات ورود به سیستم">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <FieldLabel required>نام کاربری</FieldLabel>
                                        <Field
                                            icon={User}
                                            value={data.username}
                                            onChange={v => setData('username', v)}
                                            onBlur={() => handleBlur('username')}
                                            error={getFieldError('username')}
                                            placeholder="ali.rezaei"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel required>ایمیل</FieldLabel>
                                        <Field
                                            icon={Mail}
                                            type="email"
                                            value={data.email}
                                            onChange={v => setData('email', v)}
                                            onBlur={() => handleBlur('email')}
                                            error={getFieldError('email')}
                                            placeholder="ali@example.com"
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel required>رمز عبور</FieldLabel>
                                        <Field
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={v => setData('password', v)}
                                            onBlur={() => handleBlur('password')}
                                            error={getFieldError('password')}
                                            placeholder="••••••••"
                                            suffix={
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(p => !p)}
                                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            }
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel required>تکرار رمز عبور</FieldLabel>
                                        <Field
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={v => setData('password_confirmation', v)}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </SectionCard>

                            {/* ── 3. Org Info ── */}
                            <SectionCard icon={Building2} iconColor="#8b5cf6" title="اطلاعات سازمانی" subtitle="ساختار سازمانی کاربر">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <FieldLabel required>سازمان</FieldLabel>
                                        <SelectField
                                            icon={Building2}
                                            value={data.organization_id}
                                            onChange={v => setData('organization_id', parseInt(v))}
                                        >
                                            {organizations.map(org => (
                                                <option key={org.id} value={org.id}>{org.name}</option>
                                            ))}
                                        </SelectField>
                                    </div>
                                    <div>
                                        <FieldLabel>دپارتمان</FieldLabel>
                                        <SelectField
                                            icon={Briefcase}
                                            value={data.department_id || ''}
                                            onChange={v => setData('department_id', parseInt(v) || null)}
                                            loading={loadingDepts}
                                        >
                                            <option value="">انتخاب کنید...</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </SelectField>
                                    </div>
                                    <div>
                                        <FieldLabel>سمت اصلی</FieldLabel>
                                        <SelectField
                                            icon={Award}
                                            value={data.primary_position_id || ''}
                                            onChange={v => setData('primary_position_id', parseInt(v) || null)}
                                            disabled={!data.department_id}
                                            loading={loadingPositions}
                                        >
                                            <option value="">انتخاب کنید...</option>
                                            {positions.map(pos => (
                                                <option key={pos.id} value={pos.id}>{pos.name}</option>
                                            ))}
                                        </SelectField>
                                        {!data.department_id && (
                                            <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                                                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                                ابتدا دپارتمان را انتخاب کنید
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <FieldLabel>کد پرسنلی</FieldLabel>
                                        <Field
                                            icon={CreditCard}
                                            value={data.employment_code}
                                            onChange={v => setData('employment_code', v)}
                                            placeholder="EMP001"
                                        />
                                    </div>
                                </div>
                            </SectionCard>

                            {/* ── 4. Status, Security & Role ── */}
                            <SectionCard icon={Shield} iconColor="#f59e0b" title="وضعیت و نقش" subtitle="سطح دسترسی و وضعیت فعالیت کاربر">
                                <div className="space-y-7">

                                    {/* User status */}
                                    <div>
                                        <FieldLabel>وضعیت کاربر</FieldLabel>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {STATUS_OPTIONS.map(opt => {
                                                const Icon = opt.icon;
                                                const isSelected = data.status === opt.value;
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setData('status', opt.value)}
                                                        style={isSelected ? { borderColor: opt.ring, backgroundColor: opt.bg } : {}}
                                                        className={`relative p-4 rounded-xl border-2 text-right transition-all duration-200 focus:outline-none ${
                                                            isSelected ? '' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                                                style={{ backgroundColor: isSelected ? opt.color + '22' : '#f1f5f9' }}>
                                                                <Icon className="h-4 w-4" style={{ color: isSelected ? opt.color : '#94a3b8' }} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold" style={{ color: isSelected ? opt.color : '#334155' }}>
                                                                    {opt.label}
                                                                </p>
                                                                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                                                            </div>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="absolute top-3 left-3 h-5 w-5 rounded-full flex items-center justify-center"
                                                                style={{ backgroundColor: opt.color }}>
                                                                <CheckCircle className="h-3.5 w-3.5 text-white" />
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Security clearance */}
                                    <div>
                                        <FieldLabel>سطح امنیتی</FieldLabel>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {SECURITY_LEVELS.map(lvl => {
                                                const Icon = lvl.icon;
                                                const isSelected = data.security_clearance === lvl.value;
                                                return (
                                                    <button
                                                        key={lvl.value}
                                                        type="button"
                                                        onClick={() => setData('security_clearance', lvl.value)}
                                                        style={isSelected ? {
                                                            borderColor: lvl.color + '60',
                                                            backgroundColor: lvl.bg,
                                                        } : {}}
                                                        className={`py-3.5 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 focus:outline-none ${
                                                            isSelected ? '' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                                                            style={{ backgroundColor: isSelected ? lvl.color + '22' : '#f1f5f9' }}>
                                                            <Icon className="h-4 w-4" style={{ color: isSelected ? lvl.color : '#94a3b8' }} />
                                                        </div>
                                                        <span className="text-xs font-bold" style={{ color: isSelected ? lvl.color : '#475569' }}>
                                                            {lvl.label}
                                                        </span>
                                                        {isSelected && (
                                                            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: lvl.color }} />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* Role */}
                                    <div>
                                        <FieldLabel required>نقش کاربری</FieldLabel>
                                        <SelectField
                                            icon={Shield}
                                            value={data.role}
                                            onChange={v => setData('role', v)}
                                            error={getFieldError('role')}
                                        >
                                            {roles.map(role => (
                                                <option key={role.name} value={role.name}>
                                                    {ROLE_LABELS[role.name] || role.name}
                                                </option>
                                            ))}
                                        </SelectField>
                                    </div>

                                    {/* Summary strip */}
                                    <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5">
                                        <span className="text-xs font-semibold text-slate-500 ml-1">خلاصه:</span>
                                        <span
                                            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                                            style={{ backgroundColor: selectedStatus.bg, color: selectedStatus.color }}
                                        >
                                            <selectedStatus.icon className="h-3 w-3" />
                                            {selectedStatus.label}
                                        </span>
                                        <span className="text-slate-300 text-xs">•</span>
                                        <span
                                            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                                            style={{ backgroundColor: selectedSecurity.bg, color: selectedSecurity.color }}
                                        >
                                            <selectedSecurity.icon className="h-3 w-3" />
                                            {selectedSecurity.label}
                                        </span>
                                        <span className="text-slate-300 text-xs">•</span>
                                        <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full">
                                            {ROLE_LABELS[data.role] || data.role}
                                        </span>
                                    </div>
                                </div>
                            </SectionCard>

                            {/* ── Mobile Actions ── */}
                            <div className="flex gap-3 sm:hidden pb-4">
                                <button
                                    type="button"
                                    onClick={() => router.get(users.index())}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 transition-all shadow-md disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ثبت...' : 'ایجاد کاربر'}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}