import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Building, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import * as orgs from '@/routes/admin/organizations';

interface Organization {
    id: number; name: string; code: string; email: string | null;
    phone: string | null; address: string | null;
    status: 'active' | 'inactive';
    departments_count: number; users_count: number;
    parent: { id: number; name: string } | null;
}

interface Props { organizations: Organization[]; }

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative">
            <select {...props} className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-8 disabled:bg-muted">
                {children}
            </select>
            <ChevronDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
    );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input {...props} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted" />
    );
}

export default function Index({ organizations }: Props) {

    const [showForm, setShowForm] = useState(false);
    const [editing,  setEditing]  = useState<Organization | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '', code: '', email: '', phone: '', address: '', parent_id: '',
        status: 'active' as 'active' | 'inactive',
    });

    function handleEdit(org: Organization) {
        setEditing(org);
        setData({
            name: org.name, code: org.code, email: org.email ?? '',
            phone: org.phone ?? '', address: org.address ?? '',
            parent_id: org.parent?.id.toString() ?? '', status: org.status,
        });
        setShowForm(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            put(orgs.update(editing.id).url, {
                onSuccess: () => { setShowForm(false); reset(); setEditing(null); }
            });
        } else {
            post(orgs.store().url, {
                onSuccess: () => { setShowForm(false); reset(); }
            });
        }
    }

    return (
        <>
            <Head title="وزارت خانه ها" />
            <div className="p-6 max-w-6xl mx-auto space-y-5">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-foreground">وزارت خانه ها</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{organizations.length} وزارت خانه</p>
                    </div>
                    <button onClick={() => { setEditing(null); reset(); setShowForm(!showForm); }}
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors font-medium">
                        <Plus size={14} />  وازرت خانه جدید
                    </button>
                </div>

                {/* فرم */}
                {showForm && (
                    <div className="bg-card border border-primary/30 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            <h3 className="text-sm font-semibold text-foreground">
                                {editing ? 'ویرایش سازمان' : 'سازمان جدید'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <Input placeholder="نام سازمان *" value={data.name}
                                        onChange={e => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <Input placeholder="کد سازمان *" value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                        disabled={!!editing} />
                                    {errors.code && <p className="text-destructive text-xs mt-1">{errors.code}</p>}
                                </div>
                                <Select value={data.status}
                                    onChange={e => setData('status', e.target.value as 'active' | 'inactive')}>
                                    <option value="active">فعال</option>
                                    <option value="inactive">غیرفعال</option>
                                </Select>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <Input type="email" placeholder="ایمیل" value={data.email}
                                    onChange={e => setData('email', e.target.value)} />
                                <Input placeholder="تلفن" value={data.phone}
                                    onChange={e => setData('phone', e.target.value)} />
                                {!editing && (
                                    <Select value={data.parent_id}
                                        onChange={e => setData('parent_id', e.target.value)}>
                                        <option value="">بدون والد</option>
                                        {organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                    </Select>
                                )}
                            </div>

                            <Input placeholder="آدرس" value={data.address}
                                onChange={e => setData('address', e.target.value)} />

                            <div className="flex gap-2">
                                <button type="submit" disabled={processing}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                                    {processing ? 'در حال ذخیره...' : 'ذخیره'}
                                </button>
                                <button type="button"
                                    onClick={() => { setShowForm(false); reset(); setEditing(null); }}
                                    className="bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-lg text-sm transition-colors">
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* جدول */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
                        <span>نام</span><span>کد</span><span>والد</span>
                        <span>واحدها</span><span>کاربران</span><span>وضعیت</span><span>عملیات</span>
                    </div>
                    <div className="divide-y divide-border">
                        {organizations.length === 0 ? (
                            <div className="flex flex-col items-center py-16 text-muted-foreground/40">
                                <Building size={32} className="mb-2" />
                                <p className="text-sm">سازمانی وجود ندارد</p>
                            </div>
                        ) : organizations.map(org => (
                            <div key={org.id}
                                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-muted/30 transition-colors group">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{org.name}</p>
                                    {org.email && <p className="text-xs text-muted-foreground">{org.email}</p>}
                                </div>
                                <span className="text-xs font-mono text-muted-foreground">{org.code}</span>
                                <span className="text-sm text-muted-foreground">{org.parent?.name ?? '---'}</span>
                                <span className="text-sm text-muted-foreground">{org.departments_count}</span>
                                <span className="text-sm text-muted-foreground">{org.users_count}</span>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium w-fit ${
                                    org.status === 'active'
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-muted text-muted-foreground'
                                }`}>
                                    {org.status === 'active' ? 'فعال' : 'غیرفعال'}
                                </span>
                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(org)}
                                        className="text-xs text-primary hover:underline">ویرایش</button>
                                    <button onClick={() => { if (confirm('سازمان حذف شود؟')) router.delete(orgs.destroy(org.id).url); }}
                                        className="text-xs text-destructive/70 hover:text-destructive transition-colors">حذف</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}