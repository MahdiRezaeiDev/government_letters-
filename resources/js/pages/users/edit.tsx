// resources/js/pages/users/edit.tsx

import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Eye, EyeOff, Building2, Users, Briefcase, Shield,
    Mail, Phone, UserIcon, Key, Award, AlertCircle, CheckCircle,
    ChevronDown, Loader2, CreditCard, Hash, Globe, Lock, Trash2, Clock, Ban,
    Info,
    Calendar,
    MapPin
} from 'lucide-react';
import { useState, useEffect } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import users from '@/routes/users';
import type { User, Organization, Department, Position, Role } from '@/types';

interface Props {
    user: User;
    organizations: Organization[];
    departments: Department[];
    positions: Position[];
    roles: Role[];
    userRole: string;
    canEditRole: boolean;
}

interface FormData {
    organization_id: number;
    department_id: number | null;
    primary_position_id: number | null;
    email: string;
    password?: string;
    password_confirmation?: string;
    first_name: string;
    last_name: string;
    national_code: string;
    mobile: string;
    employment_code: string;
    gender: 'male' | 'female' | null;
    birth_date: string;
    emergency_phone: string;
    address: string;
    status: 'active' | 'inactive' | 'suspended';
    security_clearance: 'public' | 'internal' | 'confidential' | 'secret';
    role?: string;
}

const STATUS_OPTIONS = [
    { value: 'active', label: 'فعال', desc: 'کاربر فعال و قابل استفاده است', icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
    { value: 'inactive', label: 'غیرفعال', desc: 'کاربر غیرفعال شده و دسترسی ندارد', icon: Ban, color: '#94a3b8', bg: '#f1f5f9' },
    { value: 'suspended', label: 'تعلیق', desc: 'دسترسی کاربر به طور موقت قطع شده است', icon: Clock, color: '#ef4444', bg: '#fee2e2' },
] as const;

const SECURITY_LEVELS = [
    { value: 'public', label: 'عمومی', desc: 'دسترسی به اطلاعات عمومی', icon: Globe, color: '#64748b', bg: '#f8fafc' },
    { value: 'internal', label: 'داخلی', desc: 'دسترسی به اطلاعات داخلی سازمان', icon: Shield, color: '#3b82f6', bg: '#eff6ff' },
    { value: 'confidential', label: 'محرمانه', desc: 'دسترسی به اطلاعات محرمانه', icon: Lock, color: '#f59e0b', bg: '#fffbeb' },
    { value: 'secret', label: 'سری', desc: 'دسترسی به اطلاعات سری و حساس', icon: Shield, color: '#ef4444', bg: '#fee2e2' },
] as const;

const GENDER_OPTIONS = [
    { value: 'male', label: 'مرد', icon: UserIcon, color: '#3b82f6' },
    { value: 'female', label: 'زن', icon: UserIcon, color: '#ec4899' },
] as const;

const ROLE_LABELS: Record<string, string> = {
    'super-admin': 'ادمین کل',
    'org-admin': 'ادمین سازمان',
    'dept-manager': 'مدیر دپارتمان',
    'user': 'کاربر عادی',
};

// ─── Shared Components ─────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {children}
            {required && <span className="text-rose-400 mr-1">*</span>}
        </label>
    );
}

function Field({ icon: Icon, type = 'text', value, onChange, onBlur, error, placeholder, disabled = false, maxLength, suffix }: any) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${
                disabled ? 'opacity-60 bg-slate-50' :
                error ? 'border-rose-300 ring-1 ring-rose-300' :
                'border-slate-200 hover:border-slate-300 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100'
            }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
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
            {error && <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}
        </div>
    );
}

function SelectField({ icon: Icon, value, onChange, onBlur, children, disabled = false, loading = false, error }: any) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${
                disabled ? 'opacity-60 bg-slate-50' :
                error ? 'border-rose-300 ring-1 ring-rose-300' :
                'border-slate-200 hover:border-slate-300 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100'
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
                {loading ? (
                    <Loader2 className="absolute left-3.5 h-4 w-4 text-slate-400 animate-spin" />
                ) : (
                    <ChevronDown className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                )}
            </div>
            {error && <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}
        </div>
    );
}

function SectionCard({ icon: Icon, iconColor, title, subtitle, description, children }: any) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-start gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: iconColor + '18' }}>
                    <Icon className="h-4 w-4" style={{ color: iconColor }} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-800">{title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                    {description && (
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                            <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <span>{description}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function UsersEdit({
    user, organizations, departments: initialDepartments,
    positions: initialPositions, roles, userRole, canEditRole
}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
    const [positions, setPositions] = useState<Position[]>(initialPositions);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadingPositions, setLoadingPositions] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const { data, setData, put, processing, errors } = useForm<FormData>({
        organization_id: user.organization_id || 0,
        department_id: user.department_id,
        primary_position_id: user.primary_position_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        national_code: user.national_code,
        mobile: user.mobile || '',
        employment_code: user.employment_code || '',
        gender: null,
        birth_date: '',
        emergency_phone: '',
        address: '',
        status: user.status,
        security_clearance: user.security_clearance,
        role: userRole,
    });

    const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
    const getFieldError = (field: string) => touched[field] && errors[field] ? errors[field] : null;

    // بارگذاری دپارتمان‌ها
    useEffect(() => {
        if (data.organization_id) {
            setLoadingDepts(true);
            fetch(`/users/departments-by-organization?organization_id=${data.organization_id}`)
                .then(res => res.json())
                .then(data => {
                    setDepartments(data.departments || []);
                    setLoadingDepts(false);
                })
                .catch(() => setLoadingDepts(false));
        }
    }, [data.organization_id]);

    // بارگذاری پست‌ها
    useEffect(() => {
        if (data.department_id) {
            setLoadingPositions(true);
            fetch(`/users/positions-by-department?department_id=${data.department_id}`)
                .then(res => res.json())
                .then(data => {
                    setPositions(data.positions || []);
                    setLoadingPositions(false);
                })
                .catch(() => setLoadingPositions(false));
        } else {
            setPositions([]);
        }
    }, [data.department_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(users.update({ user: user.id }), {
            preserveScroll: true,
        });
    };

    const handleAssignRole = (roleName: string) => {
        if (confirm(`آیا نقش کاربر به "${roleName}" تغییر کند؟`)) {
            router.post(users.assignRole({ user: user.id }), { role: roleName });
        }
    };

    const selectedStatus = STATUS_OPTIONS.find(s => s.value === data.status)!;
    const selectedSecurity = SECURITY_LEVELS.find(s => s.value === data.security_clearance)!;

    function confirmDelete(): void {
        throw new Error('Function not implemented.');
    }

    return (
        <>
            <Head title={`ویرایش کاربر - ${user.full_name}`} />

            <div className="min-h-screen bg-slate-50/70" dir="rtl">
                {/* Top Bar */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-sky-50 text-sky-600">کاربران</span>
                                <h1 className="text-sm font-bold text-slate-800">ویرایش کاربر</h1>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => router.get(users.index())}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                                >
                                    <X className="h-4 w-4" /> انصراف
                                </button>
                                <button
                                    type="submit"
                                    form="user-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" /> {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="user-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* Intro */}
                            <div className="rounded-2xl border border-sky-100 bg-gradient-to-l from-sky-50 to-cyan-50 px-6 py-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-lg">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">ویرایش کاربر</p>
                                    <p className="text-xs text-slate-500">{user.full_name} - {user.email}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(true)}
                                    className="mr-auto flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" /> حذف کاربر
                                </button>
                            </div>

                            {/* 1. Personal Info */}
                            <SectionCard 
                                icon={UserIcon} 
                                iconColor="#0ea5e9" 
                                title="اطلاعات شخصی" 
                                subtitle="مشخصات هویتی کاربر"
                                description="این اطلاعات پایه و اصلی کاربر است. کد ملی باید دقیق و معتبر باشد.">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <FieldLabel required>نام</FieldLabel>
                                        <Field 
                                            value={data.first_name} 
                                            onChange={v => setData('first_name', v)} 
                                            onBlur={() => handleBlur('first_name')} 
                                            error={getFieldError('first_name')} 
                                            placeholder="علی" />
                                    </div>
                                    <div>
                                        <FieldLabel required>نام خانوادگی</FieldLabel>
                                        <Field 
                                            value={data.last_name} 
                                            onChange={v => setData('last_name', v)} 
                                            onBlur={() => handleBlur('last_name')} 
                                            error={getFieldError('last_name')} 
                                            placeholder="رضایی" />
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
                                            maxLength={10} />
                                        <p className="text-xs text-slate-400 mt-1.5">کد ملی ۱۰ رقمی و منحصر به فرد</p>
                                    </div>
                                    <div>
                                        <FieldLabel>تاریخ تولد</FieldLabel>
                                        <Field 
                                            icon={Calendar} 
                                            type="date" 
                                            value={data.birth_date} 
                                            onChange={v => setData('birth_date', v)} />
                                    </div>
                                    <div>
                                        <FieldLabel>جنسیت</FieldLabel>
                                        <div className="flex gap-3">
                                            {GENDER_OPTIONS.map(opt => (
                                                <button 
                                                    key={opt.value} 
                                                    type="button" 
                                                    onClick={() => setData('gender', opt.value)} 
                                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${data.gender === opt.value ? 'border-sky-400 bg-sky-50 text-sky-600' : 'border-slate-200 hover:border-slate-300'}`}>
                                                    <opt.icon className="h-4 w-4" /> {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <FieldLabel>تلفن همراه</FieldLabel>
                                        <Field 
                                            icon={Phone} 
                                            value={data.mobile} 
                                            onChange={v => setData('mobile', v)} 
                                            placeholder="09123456789" />
                                    </div>
                                    <div>
                                        <FieldLabel>تلفن اضطراری</FieldLabel>
                                        <Field 
                                            icon={Phone} 
                                            value={data.emergency_phone} 
                                            onChange={v => setData('emergency_phone', v)} 
                                            placeholder="تلفن همراه اضطراری" />
                                        <p className="text-xs text-slate-400 mt-1.5">برای مواقع ضروری - اختیاری</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <FieldLabel>آدرس</FieldLabel>
                                        <Field 
                                            icon={MapPin} 
                                            value={data.address} 
                                            onChange={v => setData('address', v)} 
                                            placeholder="آدرس کامل" />
                                    </div>
                                </div>
                            </SectionCard>

                            {/* 2. Account Info */}
                            <SectionCard 
                                icon={Key} 
                                iconColor="#10b981" 
                                title="اطلاعات حساب کاربری" 
                                subtitle="اطلاعات ورود به سیستم"
                                description="با این اطلاعات کاربر وارد سیستم می‌شود. ایمیل باید معتبر و یکتا باشد.">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <FieldLabel required>ایمیل</FieldLabel>
                                        <Field 
                                            icon={Mail} 
                                            type="email" 
                                            value={data.email} 
                                            onChange={v => setData('email', v)} 
                                            onBlur={() => handleBlur('email')} 
                                            error={getFieldError('email')} 
                                            placeholder="ali@example.com" />
                                        <p className="text-xs text-slate-400 mt-1.5">ایمیل به عنوان نام کاربری استفاده می‌شود</p>
                                    </div>
                                    <div>
                                        <FieldLabel>رمز عبور جدید</FieldLabel>
                                        <Field 
                                            type={showPassword ? 'text' : 'password'} 
                                            value={data.password || ''} 
                                            onChange={v => setData('password', v)} 
                                            placeholder="••••••••" 
                                            suffix={
                                                <button type="button" onClick={() => setShowPassword(p => !p)} className="text-slate-400 hover:text-slate-600">
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            } />
                                        <p className="text-xs text-slate-400 mt-1.5">در صورت تمایل رمز جدید وارد کنید</p>
                                    </div>
                                    <div>
                                        <FieldLabel>تکرار رمز عبور جدید</FieldLabel>
                                        <Field 
                                            type="password" 
                                            value={data.password_confirmation || ''} 
                                            onChange={v => setData('password_confirmation', v)} 
                                            placeholder="••••••••" />
                                    </div>
                                    <div>
                                        <FieldLabel>کد پرسنلی</FieldLabel>
                                        <Field 
                                            icon={CreditCard} 
                                            value={data.employment_code} 
                                            onChange={v => setData('employment_code', v)} 
                                            placeholder="EMP001" />
                                    </div>
                                </div>
                            </SectionCard>

                            {/* 3. Organizational Info */}
                            <SectionCard 
                                icon={Building2} 
                                iconColor="#8b5cf6" 
                                title="اطلاعات سازمانی" 
                                subtitle="ساختار سازمانی کاربر"
                                description="تعیین جایگاه کاربر در ساختار سازمانی. سمت اصلی در کارتابل و ارجاعات تأثیر دارد.">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <FieldLabel required>سازمان</FieldLabel>
                                        <SelectField 
                                            value={data.organization_id} 
                                            onChange={v => setData('organization_id', parseInt(v))}
                                            onBlur={() => handleBlur('organization_id')}>
                                            {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                                        </SelectField>
                                    </div>
                                    <div>
                                        <FieldLabel>دپارتمان</FieldLabel>
                                        <SelectField 
                                            value={data.department_id || ''} 
                                            onChange={v => setData('department_id', parseInt(v) || null)} 
                                            onBlur={() => handleBlur('department_id')}
                                            loading={loadingDepts}>
                                            <option value="">انتخاب کنید...</option>
                                            {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                        </SelectField>
                                    </div>
                                    <div>
                                        <FieldLabel>سمت اصلی</FieldLabel>
                                        <SelectField 
                                            value={data.primary_position_id || ''} 
                                            onChange={v => setData('primary_position_id', parseInt(v) || null)} 
                                            onBlur={() => handleBlur('primary_position_id')}
                                            disabled={!data.department_id} 
                                            loading={loadingPositions}>
                                            <option value="">انتخاب کنید...</option>
                                            {positions.map(pos => <option key={pos.id} value={pos.id}>{pos.name}</option>)}
                                        </SelectField>
                                        {!data.department_id && (
                                            <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" /> ابتدا دپارتمان را انتخاب کنید
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </SectionCard>

                            {/* 4. Status, Security & Role */}
                            <SectionCard 
                                icon={Shield} 
                                iconColor="#f59e0b" 
                                title="وضعیت و نقش" 
                                subtitle="سطح دسترسی و وضعیت فعالیت کاربر"
                                description="تعیین می‌کند کاربر چه دسترسی‌هایی در سیستم دارد.">
                                <div className="space-y-6">
                                    {/* Status */}
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
                                                        className={`relative p-4 rounded-xl border-2 text-right transition-all ${isSelected ? `border-${opt.value === 'active' ? 'emerald' : opt.value === 'inactive' ? 'gray' : 'red'}-400 bg-${opt.value === 'active' ? 'emerald' : opt.value === 'inactive' ? 'gray' : 'red'}-50` : 'border-slate-200 hover:border-slate-300'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${isSelected ? `bg-${opt.value === 'active' ? 'emerald' : opt.value === 'inactive' ? 'gray' : 'red'}-100` : 'bg-slate-100'}`}>
                                                                <Icon className={`h-4 w-4 ${isSelected ? `text-${opt.value === 'active' ? 'emerald' : opt.value === 'inactive' ? 'gray' : 'red'}-600` : 'text-slate-500'}`} />
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm font-bold ${isSelected ? `text-${opt.value === 'active' ? 'emerald' : opt.value === 'inactive' ? 'gray' : 'red'}-700` : 'text-slate-700'}`}>{opt.label}</p>
                                                                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                                                            </div>
                                                        </div>
                                                        {isSelected && (
                                                            <CheckCircle className={`absolute top-3 left-3 h-5 w-5 text-${opt.value === 'active' ? 'emerald' : opt.value === 'inactive' ? 'gray' : 'red'}-500`} />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Security Clearance */}
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
                                                        className={`py-3 px-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${isSelected ? `border-${lvl.value === 'public' ? 'gray' : lvl.value === 'internal' ? 'blue' : lvl.value === 'confidential' ? 'amber' : 'red'}-400 bg-${lvl.value === 'public' ? 'gray' : lvl.value === 'internal' ? 'blue' : lvl.value === 'confidential' ? 'amber' : 'red'}-50` : 'border-slate-200 hover:border-slate-300'}`}>
                                                        <Icon className={`h-5 w-5 ${isSelected ? `text-${lvl.value === 'public' ? 'gray' : lvl.value === 'internal' ? 'blue' : lvl.value === 'confidential' ? 'amber' : 'red'}-600` : 'text-slate-500'}`} />
                                                        <span className="text-xs font-bold">{lvl.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1.5">سطح دسترسی به اطلاعات محرمانه را تعیین می‌کند</p>
                                    </div>

                                    {/* Role */}
                                    {canEditRole && (
                                        <div>
                                            <FieldLabel required>نقش کاربری</FieldLabel>
                                            <SelectField 
                                                value={data.role || ''} 
                                                onChange={v => setData('role', v)} 
                                                onBlur={() => handleBlur('role')}
                                                error={getFieldError('role')}>
                                                {roles.map(role => <option key={role.name} value={role.name}>{ROLE_LABELS[role.name] || role.name}</option>)}
                                            </SelectField>
                                            {errors.role && (
                                                <div className="mt-2 flex items-center gap-2 text-rose-600 text-sm bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                                    <span>{errors.role}</span>
                                                </div>
                                            )}
                                            <p className="text-xs text-slate-400 mt-1.5">نقش تعیین می‌کند کاربر چه مجوزهایی در سیستم دارد</p>
                                        </div>
                                    )}

                                    {/* Summary */}
                                    <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                        <span className="text-xs font-semibold text-slate-500">خلاصه وضعیت:</span>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: selectedStatus.bg, color: selectedStatus.color }}>
                                            <selectedStatus.icon className="h-3 w-3" /> {selectedStatus.label}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: selectedSecurity.bg, color: selectedSecurity.color }}>
                                            <selectedSecurity.icon className="h-3 w-3" /> {selectedSecurity.label}
                                        </span>
                                        {data.role && (
                                            <>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full">{ROLE_LABELS[data.role] || data.role}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SectionCard>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="حذف کاربر"
                    message="آیا از حذف این کاربر اطمینان دارید؟"
                    itemName={user.full_name}
                    type="user"
                    isLoading={deleting}
                />
            )}
        </>
    );
}