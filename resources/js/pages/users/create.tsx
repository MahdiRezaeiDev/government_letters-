import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Building2, Shield, Mail, Phone, User, Key, AlertCircle, CheckCircle, Hash, Globe, Lock, MapPin,
    Save,
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import PersianDatePicker from '@/components/PersianDatePicker';
import FieldLabel from '@/components/ui/FieldLabel';
import InputField from '@/components/ui/InputField';
import SectionCard from '@/components/ui/SectionCard';
import SelectField from '@/components/ui/SelectField';
import users from '@/routes/users';
import type { Organization, Department, Position, Role } from '@/types';

interface Props {
    organizations: Organization[];
    departments: Department[];
    positions: Position[];
    roles: Role[];
    myOrganizationId: number | null;
}

const STATUS_OPTIONS = [
    { value: 'active', label: 'فعال', desc: 'کاربر فعال و قابل استفاده است', icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
    { value: 'inactive', label: 'غیرفعال', desc: 'کاربر غیرفعال شده و دسترسی ندارد', icon: AlertCircle, color: '#94a3b8', bg: '#f1f5f9' },
    { value: 'suspended', label: 'تعلیق', desc: 'دسترسی کاربر به طور موقت قطع شده است', icon: AlertCircle, color: '#ef4444', bg: '#fee2e2' },
] as const;

const SECURITY_LEVELS = [
    { value: 'public', label: 'عمومی', desc: 'دسترسی به اطلاعات عمومی', icon: Globe, color: '#64748b', bg: '#f8fafc' },
    { value: 'internal', label: 'داخلی', desc: 'دسترسی به اطلاعات داخلی سازمان', icon: Shield, color: '#3b82f6', bg: '#eff6ff' },
    { value: 'confidential', label: 'محرمانه', desc: 'دسترسی به اطلاعات محرمانه', icon: Lock, color: '#f59e0b', bg: '#fffbeb' },
    { value: 'secret', label: 'سری', desc: 'دسترسی به اطلاعات سری و حساس', icon: Shield, color: '#ef4444', bg: '#fee2e2' },
] as const;

// ─── Main Component ────────────────────────────────────────────────────────

export default function UsersCreate({ organizations, departments: initialDepartments, positions: initialPositions, roles, myOrganizationId }: Props) {

    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
    const [positions, setPositions] = useState<Position[]>(initialPositions);

    const { data, setData, processing, post, errors, reset } = useForm({
        organization_id: myOrganizationId || organizations[0]?.id || 0,
        department_id: null,
        primary_position_id: null,
        email: 'example@gmail.com',
        password: '123321123',
        password_confirmation: '123321123',
        first_name: 'mahdi',
        last_name: 'rezaei',
        national_code: '1234567890',
        mobile: '0781234567',
        birth_date: '',
        emergency_phone: '',
        address: '',
        status: 'active',
        security_clearance: 'internal',
        role: 'user',
    });

    useEffect(() => {
        if (data.organization_id) {
            fetch(`/users/departments-by-organization?organization_id=${data.organization_id}`)
                .then(r => r.json())
                .then(d => {
                    setDepartments(d.departments || []);
                })
                .catch(() => { });
        }
    }, [data.organization_id]);

    useEffect(() => {
        if (data.department_id) {
            fetch(`/users/positions-by-department?department_id=${data.department_id}`)
                .then(r => r.json())
                .then(d => {
                    setPositions(d.positions || []);
                })
                .catch(() => { });
        }
    }, [data.department_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(users.store().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset(); router.get(users.index());
            },
        });
    };

    const selectedStatus = STATUS_OPTIONS.find(s => s.value === data.status)!;
    const selectedSecurity = SECURITY_LEVELS.find(s => s.value === data.security_clearance)!;

    return (
        <>
            <Head title="ایجاد کاربر جدید" />

            <div className="min-h-screen">

                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <form id="user-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            {/* 1. Personal Info */}
                            <SectionCard
                                icon={User}
                                iconColor="#0ea5e9"
                                title="اطلاعات شخصی"
                                subtitle="این اطلاعات پایه و اصلی کاربر است. نمبر تذکره باید دقیق و معتبر باشد.">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <FieldLabel required>نام</FieldLabel>
                                        <InputField
                                            value={data.first_name}
                                            onChange={v => setData('first_name', v)}
                                            error={errors.first_name}
                                            placeholder="علی" />
                                    </div>
                                    <div>
                                        <FieldLabel required>نام خانوادگی</FieldLabel>
                                        <InputField
                                            value={data.last_name}
                                            onChange={v => setData('last_name', v)}
                                            error={errors.last_name}
                                            placeholder="رضایی" />
                                    </div>
                                    <div>
                                        <FieldLabel required>نمبر تذکره</FieldLabel>
                                        <InputField
                                            icon={Hash}
                                            value={data.national_code}
                                            onChange={v => setData('national_code', v)}
                                            error={errors.national_code}
                                            placeholder="1234567890" />
                                    </div>
                                    {/* <div>
                                        <PersianDatePicker
                                            label="تاریخ تولد"
                                            value={data.birth_date}
                                            onChange={(date) => setData('birth_date', date as string)}
                                            error={errors.birth_date}
                                        />
                                        <p className="text-xs text-slate-400 mt-1.5">تاریخ تولد را به شمسی انتخاب کنید</p>
                                    </div>
                                    <div>
                                        <FieldLabel>تلفن همراه</FieldLabel>
                                        <InputField
                                            icon={Phone}
                                            value={data.mobile}
                                            onChange={v => setData('mobile', v)}
                                            error={errors.mobile}
                                            placeholder="09123456789" />
                                    </div>
                                    <div>
                                        <FieldLabel>آدرس</FieldLabel>
                                        <InputField
                                            icon={MapPin}
                                            value={data.address}
                                            onChange={v => setData('address', v)}
                                            error={errors.address}
                                            placeholder="آدرس کامل" />
                                    </div> */}
                                </div>
                            </SectionCard>

                            {/* 2. Account Info */}
                            <SectionCard
                                icon={Key}
                                iconColor="#10b981"
                                title="اطلاعات حساب کاربری"
                                subtitle="با این اطلاعات کاربر وارد سیستم می‌شود. ایمیل باید معتبر و یکتا باشد.">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <FieldLabel required>ایمیل</FieldLabel>
                                        <InputField
                                            icon={Mail}
                                            type="email"
                                            value={data.email}
                                            onChange={v => setData('email', v)}
                                            error={errors.email}
                                            placeholder="ali@example.com" />
                                        <p className="text-xs text-slate-400 mt-1.5">ایمیل به عنوان نام کاربری استفاده می‌شود</p>
                                    </div>
                                    <div>
                                        <FieldLabel required>رمز عبور</FieldLabel>
                                        <InputField
                                            icon={Lock}
                                            type={'password'}
                                            value={data.password}
                                            onChange={v => setData('password', v)}
                                            error={errors.password}
                                            placeholder="••••••••"
                                        />
                                        <p className="text-xs text-slate-400 mt-1.5">حداقل ۸ کاراکتر، شامل حروف و اعداد</p>
                                    </div>
                                    <div>
                                        <FieldLabel required>تکرار رمز عبور</FieldLabel>
                                        <InputField
                                            icon={Lock}
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={v => setData('password_confirmation', v)}
                                            placeholder="••••••••" />
                                    </div>
                                </div>
                            </SectionCard>

                            {/* 3. Organizational Info */}
                            <SectionCard
                                icon={Building2}
                                iconColor="#8b5cf6"
                                title="اطلاعات سازمانی"
                                subtitle="تعیین جایگاه کاربر در ساختار سازمانی. سمت اصلی در کارتابل و ارجاعات تأثیر دارد.">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <FieldLabel required>سازمان</FieldLabel>
                                        <SelectField
                                            value={data.organization_id}
                                            onChange={v => setData('organization_id', parseInt(v))}
                                            error={errors.organization_id}>
                                            {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                                        </SelectField>
                                    </div>
                                    <div>
                                        <FieldLabel>دپارتمان</FieldLabel>
                                        <SelectField
                                            value={data.department_id || ''}
                                            onChange={v => setData('department_id', parseInt(v) || null)}
                                            error={errors.department_id}>
                                            <option value="">انتخاب کنید...</option>
                                            {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                        </SelectField>
                                        <p className="text-xs text-slate-400 mt-1.5">دپارتمانی که کاربر در آن فعالیت می‌کند</p>
                                    </div>
                                    <div>
                                        <FieldLabel>سمت اصلی</FieldLabel>
                                        <SelectField
                                            value={data.primary_position_id || ''}
                                            onChange={v => setData('primary_position_id', parseInt(v) || null)}
                                            error={errors.primary_position_id}
                                        >
                                            <option value="">انتخاب کنید...</option>
                                            {positions.map(pos => <option key={pos.id} value={pos.id}>{pos.name}</option>)}
                                        </SelectField>
                                        {!data.department_id && (
                                            <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" /> ابتدا دپارتمان را انتخاب کنید
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <FieldLabel required>نقش کاربری</FieldLabel>
                                        <SelectField
                                            value={data.role}
                                            onChange={v => setData('role', v)}
                                            error={errors.role}>
                                            {roles.map(role => <option key={role.name} value={role.name}>{role.label}</option>)}
                                        </SelectField>
                                        <p className="text-xs text-slate-400 mt-1.5">نقش تعیین می‌کند کاربر چه مجوزهایی در سیستم دارد</p>
                                    </div>
                                </div>
                            </SectionCard>

                            {/* 4. Status, Security & Role */}
                            <SectionCard
                                icon={Shield}
                                iconColor="#f59e0b"
                                title="وضعیت و نقش"
                                subtitle="تعیین می‌کند کاربر چه دسترسی‌هایی در سیستم دارد.">
                                <div className="space-y-6">
                                    {/* Status */}
                                    {/* <div>
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
                                    </div> */}

                                    {/* Security Clearance */}
                                    {/* <div>
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
                                    </div> */}
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
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full">{roles.find(r => r.name === data.role)?.label || data.role}</span>
                                    </div>
                                    {/* Mobile Actions */}
                                    <div className="bg-white border-slate-200 p-4 z-20">
                                        <div className="flex gap-3 max-w-5xl mx-auto">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                                            >
                                                <Save className="h-4 w-4" />
                                                {processing ? 'در حال ذخیره...' : 'ذخیره کاربر'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => router.get(users.index())}
                                                className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-200 rounded-lg transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                                انصراف
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}