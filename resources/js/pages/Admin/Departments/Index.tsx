import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Building2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import * as depts from '@/routes/admin/departments';

interface Department {
    id: number; name: string; code: string | null; level: number;
    status: 'active' | 'inactive'; positions_count: number;
    parent: { id: number; name: string } | null;
}

interface Props { departments: Department[]; }

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative">
            <select {...props} className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-8">
                {children}
            </select>
            <ChevronDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
    );
}

export default function Index({ departments }: Props) {

    const [showForm, setShowForm] = useState(false);
    const [editing,  setEditing]  = useState<Department | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '', code: '', parent_id: '', status: 'active' as 'active' | 'inactive',
    });

    function handleEdit(dept: Department) {
        setEditing(dept);
        setData({ name: dept.name, code: dept.code ?? '', parent_id: dept.parent?.id.toString() ?? '', status: dept.status });
        setShowForm(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        if (editing) {
            put(depts.update(editing.id).url, { onSuccess: () => { setShowForm(false); reset(); setEditing(null); } });
        } else {
            post(depts.store().url, { onSuccess: () => { setShowForm(false); reset(); } });
        }
    }

    return (
        <>
            <Head title="واحدها" />
            <div className="p-6 max-w-5xl mx-auto space-y-5">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-foreground">واحدهای سازمانی</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{departments.length} واحد</p>
                    </div>
                    <button onClick={() => { setEditing(null); reset(); setShowForm(!showForm); }}
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors font-medium">
                        <Plus size={14} /> واحد جدید
                    </button>
                </div>

                {showForm && (
                    <div className="bg-card border border-primary/30 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            <h3 className="text-sm font-semibold text-foreground">{editing ? 'ویرایش واحد' : 'واحد جدید'}</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <input placeholder="نام واحد *" value={data.name} onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                                </div>
                                <input placeholder="کد (اختیاری)" value={data.code} onChange={e => setData('code', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                                {!editing && (
                                    <Select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)}>
                                        <option value="">بدون والد</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{'—'.repeat(d.level)} {d.name}</option>)}
                                    </Select>
                                )}
                                <Select value={data.status} onChange={e => setData('status', e.target.value as 'active' | 'inactive')}>
                                    <option value="active">فعال</option>
                                    <option value="inactive">غیرفعال</option>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" disabled={processing}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                                    {processing ? 'در حال ذخیره...' : 'ذخیره'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); reset(); setEditing(null); }}
                                    className="bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-lg text-sm transition-colors">
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
                        <span>نام</span><span>والد</span><span>سمت‌ها</span><span>وضعیت</span><span>عملیات</span>
                    </div>
                    <div className="divide-y divide-border">
                        {departments.length === 0 ? (
                            <div className="flex flex-col items-center py-16 text-muted-foreground/40">
                                <Building2 size={32} className="mb-2" />
                                <p className="text-sm">واحدی وجود ندارد</p>
                            </div>
                        ) : departments.map(dept => (
                            <div key={dept.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-muted/30 transition-colors group">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground/40 text-xs">{'│  '.repeat(dept.level)}</span>
                                    <span className="text-sm font-medium text-foreground">{dept.name}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{dept.parent?.name ?? '---'}</span>
                                <span className="text-sm text-muted-foreground">{dept.positions_count}</span>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium w-fit ${dept.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                                    {dept.status === 'active' ? 'فعال' : 'غیرفعال'}
                                </span>
                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(dept)} className="text-xs text-primary hover:underline">ویرایش</button>
                                    <button onClick={() => { if (confirm('حذف شود؟')) router.delete(depts.destroy(dept.id).url); }}
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