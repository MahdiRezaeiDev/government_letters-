import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Briefcase, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import * as positions from '@/routes/admin/positions';

interface Department { id: number; name: string; }
interface Position {
    id: number; name: string; code: string | null; level: number;
    is_management: boolean; user_positions_count: number;
    department: { id: number; name: string };
}

interface Props { positions: Position[]; departments: Department[]; }

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative">
            <select {...props} className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-8 disabled:bg-muted disabled:text-muted-foreground">
                {children}
            </select>
            <ChevronDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
    );
}

export default function Index({ positions: data, departments }: Props) {

    const [showForm, setShowForm] = useState(false);
    const [editing,  setEditing]  = useState<Position | null>(null);

    const { data: form, setData, post, put, processing, errors, reset } = useForm({
        department_id: '', name: '', code: '',
        level: '3', is_management: false, description: '',
    });

    function handleEdit(pos: Position) {
        setEditing(pos);
        setData({
            department_id: pos.department.id.toString(),
            name: pos.name, code: pos.code ?? '',
            level: pos.level.toString(),
            is_management: pos.is_management, description: '',
        });
        setShowForm(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            put(positions.update(editing.id).url, {
                onSuccess: () => { setShowForm(false); reset(); setEditing(null); }
            });
        } else {
            post(positions.store().url, {
                onSuccess: () => { setShowForm(false); reset(); }
            });
        }
    }

    return (
        <>
            <Head title="سمت‌ها" />
            <div className="p-6 max-w-5xl mx-auto space-y-5">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-foreground">سمت‌ها</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{data.length} سمت</p>
                    </div>
                    <button onClick={() => { setEditing(null); reset(); setShowForm(!showForm); }}
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors font-medium">
                        <Plus size={14} /> سمت جدید
                    </button>
                </div>

                {/* فرم */}
                {showForm && (
                    <div className="bg-card border border-primary/30 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            <h3 className="text-sm font-semibold text-foreground">
                                {editing ? 'ویرایش سمت' : 'سمت جدید'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <Select value={form.department_id}
                                        onChange={e => setData('department_id', e.target.value)}
                                        disabled={!!editing}>
                                        <option value="">واحد سازمانی *</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </Select>
                                    {errors.department_id && <p className="text-destructive text-xs mt-1">{errors.department_id}</p>}
                                </div>
                                <div>
                                    <input placeholder="نام سمت *" value={form.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                                </div>
                                <Select value={form.level} onChange={e => setData('level', e.target.value)}>
                                    {[1,2,3,4,5].map(l => <option key={l} value={l}>سطح {l}</option>)}
                                </Select>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer w-fit">
                                <div className={`w-9 h-5 rounded-full transition-colors relative ${form.is_management ? 'bg-primary' : 'bg-muted'}`}>
                                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_management ? 'translate-x-0.5' : 'right-0.5'}`} />
                                </div>
                                <input type="checkbox" checked={form.is_management}
                                    onChange={e => setData('is_management', e.target.checked)}
                                    className="hidden" />
                                <span className="text-sm text-foreground">سمت مدیریتی</span>
                            </label>

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

                {/* جدول */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
                        <span>نام سمت</span><span>واحد</span><span>سطح</span><span>مدیریتی</span><span>کاربران</span><span>عملیات</span>
                    </div>
                    <div className="divide-y divide-border">
                        {data.length === 0 ? (
                            <div className="flex flex-col items-center py-16 text-muted-foreground/40">
                                <Briefcase size={32} className="mb-2" />
                                <p className="text-sm">سمتی وجود ندارد</p>
                            </div>
                        ) : data.map(pos => (
                            <div key={pos.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-muted/30 transition-colors group">
                                <span className="text-sm font-medium text-foreground">{pos.name}</span>
                                <span className="text-sm text-muted-foreground">{pos.department.name}</span>
                                <span className="text-sm text-muted-foreground">{pos.level}</span>
                                <span>
                                    {pos.is_management
                                        ? <span className="text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2.5 py-1 rounded-full font-medium">مدیریتی</span>
                                        : <span className="text-xs text-muted-foreground">---</span>
                                    }
                                </span>
                                <span className="text-sm text-muted-foreground">{pos.user_positions_count}</span>
                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(pos)} className="text-xs text-primary hover:underline">ویرایش</button>
                                    <button onClick={() => { if (confirm('سمت حذف شود؟')) router.delete(positions.destroy(pos.id).url); }}
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