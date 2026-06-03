import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Building2, Shield, Mail, Phone, User, Key, AlertCircle, CheckCircle, Hash, Globe, Lock, MapPin,
    Save, X, FileText, Eye, Trash2, PenSquare, CheckSquare
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
    nidPermissions: Record<string, string>;
}

const STATUS_OPTIONS = [
    { value: 'active', label: 'فعال', desc: 'کاربر فعال و قابل استفاده است', icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
    { value: 'inactive', label: 'غیرفعال', desc: 'کاربر غیرفعال شده و دسترسی ندارد', icon: AlertCircle, color: '#94a3b8', bg: '#f1f5f9' },
    { value: 'suspended', label: 'تعلیق', desc: 'دسترسی کاربر به طور موقت قطع شده است', icon: AlertCircle, color: '#ef4444', bg: '#fee2e2' },
] as const;

const SECURITY_LEVELS = [
    { value: 'public', label: 'عمومی', desc: 'دسترسی به معلومات عمومی', icon: Globe, color: '#64748b', bg: '#f8fafc' },
    { value: 'internal', label: 'داخلی', desc: 'دسترسی به معلومات داخلی وزارت', icon: Shield, color: '#3b82f6', bg: '#eff6ff' },
    { value: 'confidential', label: 'محرمانه', desc: 'دسترسی به معلومات محرمانه', icon: Lock, color: '#f59e0b', bg: '#fffbeb' },
    { value: 'secret', label: 'سری', desc: 'دسترسی به معلومات سری و حساس', icon: Shield, color: '#ef4444', bg: '#fee2e2' },
] as const;

// NID Permission Labels
const NID_PERMISSION_LABELS: Record<string, { label: string; desc: string; icon: any }> = {
    'nid-register': { label: 'ثبت تذکره', desc: 'امکان ثبت تذکره جدید', icon: PenSquare },
    'nid-approve': { label: 'تأیید تذکره', desc: 'امکان تأیید تذکره‌ها', icon: CheckSquare },
    'nid-view': { label: 'مشاهده تذکره', desc: 'امکان مشاهده تمام تذکره‌ها', icon: Eye },
    'nid-destroy': { label: 'حذف/ابطال تذکره', desc: 'امکان حذف یا ابطال تذکره', icon: Trash2 },
};

export default function UsersCreate({
    organizations,
    departments: initialDepartments,
    positions: initialPositions,
    roles,
    myOrganizationId,
    nidPermissions
}: Props) {

    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
    const [positions, setPositions] = useState<Position[]>(initialPositions);

    const { data, setData, processing, post, errors, reset } = useForm({
        organization_id: myOrganizationId || organizations[0]?.id || 0,
        department_id: null,
        primary_position_id: null,
        email: '',
        password: 'NSIA@123',
        password_confirmation: 'NSIA@123',
        first_name: '',
        last_name: '',
        national_code: '',
        mobile: '',
        birth_date: '',
        emergency_phone: '',
        address: '',
        status: 'active',
        security_clearance: 'internal',
        role: 'user',
        nid_permissions: [] as string[], // مجوزهای تذکره
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
                reset();
                router.get(users.index());
            },
        });
    };

    const handleNidPermissionChange = (permission: string) => {
        setData('nid_permissions',
            data.nid_permissions.includes(permission)
                ? data.nid_permissions.filter(p => p !== permission)
                : [...data.nid_permissions, permission]
        );
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
                                title="معلومات شخصی"
                                subtitle="مشخصات هویتی کاربر"
                                description="این معلومات پایه و اصلی کاربر است. نمبر تذکره باید دقیق و معتبر باشد.">
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
                                        <FieldLabel required>تخلص</FieldLabel>
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
                                </div>
                            </SectionCard>

                            {/* 2. Account Info */}
                            <SectionCard
                                icon={Key}
                                iconColor="#10b981"
                                title="معلومات حساب کاربری"
                                subtitle="معلومات ورود به سیستم"
                                description="با این معلومات کاربر وارد سیستم می‌شود. ایمیل باید معتبر و یکتا باشد.">
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
                                title="معلومات وزارت"
                                subtitle="ساختار وزارت کاربر"
                                description="تعیین جایگاه کاربر در ساختار وزارت. سمت اصلی در کارتابل و ارجاعات تأثیر دارد.">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <FieldLabel required>وزارت</FieldLabel>
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
                                        <p className="text-xs text-slate-400 mt-1.5">دیپارتمنت که کاربر در آن فعالیت می‌کند</p>
                                    </div>
                                    <div>
                                        <FieldLabel>بست اصلی</FieldLabel>
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
                                                <AlertCircle className="h-3 w-3" /> ابتدا دیپارتمنت را انتخاب کنید
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

                            {/* 4. NID Permissions (Side Permissions) */}
                            <SectionCard
                                icon={FileText}
                                iconColor="#8b5cf6"
                                title="مجوزهای تذکره"
                                subtitle="دسترسی‌های جانبی"
                                description="این مجوزها به صورت جانبی و جدا از نقش اصلی به کاربر اعطا می‌شوند.">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(NID_PERMISSION_LABELS).map(([value, { label, desc, icon: Icon }]) => (
                                        <label
                                            key={value}
                                            className={`flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all ${data.nid_permissions.includes(value)
                                                ? 'border-indigo-400 bg-indigo-50'
                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.nid_permissions.includes(value)}
                                                onChange={() => handleNidPermissionChange(value)}
                                                className="mt-1 ml-3 h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Icon className={`h-4 w-4 ${data.nid_permissions.includes(value) ? 'text-indigo-600' : 'text-slate-400'}`} />
                                                    <span className={`font-medium ${data.nid_permissions.includes(value) ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                        {label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">{desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 flex items-center gap-2">
                                        <Shield className="h-3 w-3" />
                                        این مجوزها به کاربر اجازه می‌دهد بدون توجه به نقش اصلی، به عملیات مربوط به تذکره دسترسی داشته باشد.
                                    </p>
                                </div>
                            </SectionCard>

                            {/* 5. Status, Security & Actions */}
                            <SectionCard
                                icon={Shield}
                                iconColor="#f59e0b"
                                title="وضعیت و نقش"
                                subtitle="تعیین می‌کند کاربر چه دسترسی‌هایی در سیستم دارد.">
                                <div className="space-y-6">
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
                                        {data.nid_permissions.length > 0 && (
                                            <>
                                                <span className="text-slate-300">•</span>
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                                                    <FileText className="h-3 w-3" />
                                                    {data.nid_permissions.length} مجوز تذکره
                                                </span>
                                            </>
                                        )}
                                    </div>

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
                                                لغوه
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