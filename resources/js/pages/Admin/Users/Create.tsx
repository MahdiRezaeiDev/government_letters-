import { Head, router, useForm } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import * as users from '@/routes/admin/users';

interface Role         { id: number; name: string; }
interface Organization { id: number; name: string; }
interface Department   { id: number; name: string; }
interface Position     { id: number; name: string; level: number; }

interface Props { roles: Role[]; organizations: Organization[]; }

interface UserForm {
    first_name: string; last_name: string; username: string; email: string;
    password: string; national_code: string; mobile: string;
    role: string; organization_id: string; department_id: string;
    position_id: string; status: 'active' | 'inactive' | 'suspended';
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            {children}{required && <span className="text-destructive mr-0.5">*</span>}
        </label>
    );
}

function Input({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
    return (
        <div>
            <input {...props} className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all ${error ? 'border-destructive' : 'border-border'}`} />
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
        </div>
    );
}

function Select({ error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
    return (
        <div className="relative">
            <select {...props} className={`w-full appearance-none bg-background border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all pr-8 disabled:bg-muted disabled:text-muted-foreground ${error ? 'border-destructive' : 'border-border'}`}>
                {children}
            </select>
            <ChevronDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-sm font-semibold text-foreground">{children}</h3>
        </div>
    );
}

export default function Create({ roles, organizations }: Props) {

    const { data, setData, post, processing, errors } = useForm<UserForm>({
        first_name: '', last_name: '', username: '', email: '',
        password: '', national_code: '', mobile: '',
        role: '', organization_id: '', department_id: '', position_id: '',
        status: 'active',
    });

    const [departments,  setDepartments]  = useState<Department[]>([]);
    const [positions,    setPositions]    = useState<Position[]>([]);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadingPos,   setLoadingPos]   = useState(false);

    async function handleOrgChange(orgId: string) {
        setData(prev => ({ ...prev, organization_id: orgId, department_id: '', position_id: '' }));
        setDepartments([]); setPositions([]);
        if (!orgId) return;
        setLoadingDepts(true);
        try {
            const res = await fetch(`/api/organizations/${orgId}/departments`);
            setDepartments(await res.json());
        } finally { setLoadingDepts(false); }
    }

    async function handleDeptChange(deptId: string) {
        setData(prev => ({ ...prev, department_id: deptId, position_id: '' }));
        setPositions([]);
        if (!deptId) return;
        setLoadingPos(true);
        try {
            const res = await fetch(`/api/departments/${deptId}/positions`);
            setPositions(await res.json());
        } finally { setLoadingPos(false); }
    }

    return (
        <>
            <Head title="کاربر جدید" />
            <div className="p-6 max-w-2xl mx-auto space-y-5">
                <form onSubmit={e => { e.preventDefault(); post(users.store().url); }} className="space-y-5">

                    {/* اطلاعات شخصی */}
                    <div className="bg-card border border-border rounded-xl p-5">
                        <SectionTitle>اطلاعات شخصی</SectionTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label required>نام</Label><Input value={data.first_name} onChange={e => setData('first_name', e.target.value)} error={errors.first_name} /></div>
                            <div><Label required>نام خانوادگی</Label><Input value={data.last_name} onChange={e => setData('last_name', e.target.value)} error={errors.last_name} /></div>
                            <div><Label required>نام کاربری</Label><Input value={data.username} onChange={e => setData('username', e.target.value)} error={errors.username} /></div>
                            <div><Label required>ایمیل</Label><Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} /></div>
                            <div><Label required>رمز عبور</Label><Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} error={errors.password} /></div>
                            <div><Label>موبایل</Label><Input value={data.mobile} onChange={e => setData('mobile', e.target.value)} /></div>
                            <div className="col-span-2"><Label>کد ملی</Label><Input value={data.national_code} onChange={e => setData('national_code', e.target.value)} maxLength={10} error={errors.national_code} /></div>
                        </div>
                    </div>

                    {/* ساختار سازمانی */}
                    <div className="bg-card border border-border rounded-xl p-5">
                        <SectionTitle>ساختار سازمانی</SectionTitle>
                        <div className="space-y-3">
                            <div>
                                <Label required>سازمان</Label>
                                <Select value={data.organization_id} onChange={e => handleOrgChange(e.target.value)} error={errors.organization_id}>
                                    <option value="">انتخاب سازمان...</option>
                                    {organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                </Select>
                            </div>
                            {data.organization_id && (
                                <div>
                                    <Label required>واحد سازمانی</Label>
                                    <Select value={data.department_id} onChange={e => handleDeptChange(e.target.value)} disabled={loadingDepts} error={errors.department_id}>
                                        <option value="">{loadingDepts ? 'در حال بارگذاری...' : 'انتخاب واحد...'}</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </Select>
                                </div>
                            )}
                            {data.department_id && (
                                <div>
                                    <Label required>سمت</Label>
                                    <Select value={data.position_id} onChange={e => setData('position_id', e.target.value)} disabled={loadingPos} error={errors.position_id}>
                                        <option value="">{loadingPos ? 'در حال بارگذاری...' : 'انتخاب سمت...'}</option>
                                        {positions.map(p => <option key={p.id} value={p.id}>{p.name} (سطح {p.level})</option>)}
                                    </Select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* نقش و وضعیت */}
                    <div className="bg-card border border-border rounded-xl p-5">
                        <SectionTitle>نقش و وضعیت</SectionTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label required>نقش</Label>
                                <Select value={data.role} onChange={e => setData('role', e.target.value)} error={errors.role}>
                                    <option value="">انتخاب کنید</option>
                                    {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                                </Select>
                            </div>
                            <div>
                                <Label>وضعیت</Label>
                                <Select value={data.status} onChange={e => setData('status', e.target.value as UserForm['status'])}>
                                    <option value="active">فعال</option>
                                    <option value="inactive">غیرفعال</option>
                                    <option value="suspended">معلق</option>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                            {processing ? 'در حال ذخیره...' : 'ذخیره'}
                        </button>
                        <button type="button" onClick={() => router.visit(users.index().url)}
                            className="px-6 bg-muted hover:bg-muted/80 text-muted-foreground py-2.5 rounded-lg text-sm font-medium transition-colors">
                            انصراف
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}