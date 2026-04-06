import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Plus, FolderOpen, ChevronDown } from 'lucide-react';
import * as archiveRoutes from '@/routes/archives';

interface Archive {
    id: number; name: string; code: string | null;
    description: string | null; is_active: boolean;
    files_count: number; parent: { id: number; name: string } | null;
}

interface Props { archives: Archive[]; }

export default function Index({ archives }: Props) {

    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', code: '', parent_id: '', description: '',
    });

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'بایگانی', href: archiveRoutes.index().url }]}>
            <Head title="بایگانی" />
            <div className="p-6 max-w-5xl mx-auto space-y-5">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-foreground">بایگانی</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{archives.length} بایگانی</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors font-medium">
                        <Plus size={14} /> بایگانی جدید
                    </button>
                </div>

                {showForm && (
                    <div className="bg-card border border-primary/30 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            <h3 className="text-sm font-semibold text-foreground">بایگانی جدید</h3>
                        </div>
                        <form onSubmit={e => { e.preventDefault(); post(archiveRoutes.store().url, { onSuccess: () => { setShowForm(false); reset(); } }); }}
                            className="space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <input placeholder="نام بایگانی *" value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                                </div>
                                <input placeholder="کد (اختیاری)" value={data.code}
                                    onChange={e => setData('code', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                                <div className="relative">
                                    <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)}
                                        className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-8">
                                        <option value="">بدون والد</option>
                                        {archives.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                    <ChevronDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                            <textarea placeholder="توضیحات (اختیاری)" value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                            <div className="flex gap-2">
                                <button type="submit" disabled={processing}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
                                    {processing ? 'در حال ذخیره...' : 'ذخیره'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); reset(); }}
                                    className="bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-lg text-sm transition-colors">
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {archives.length === 0 ? (
                    <div className="bg-card border border-border rounded-xl flex flex-col items-center py-16 text-muted-foreground/40">
                        <FolderOpen size={36} className="mb-3" />
                        <p className="text-sm">بایگانی‌ای وجود ندارد</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {archives.map(archive => (
                            <div key={archive.id}
                                className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <FolderOpen size={16} className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-foreground">{archive.name}</h3>
                                            {archive.parent && (
                                                <p className="text-xs text-muted-foreground">زیر: {archive.parent.name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${archive.is_active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                                        {archive.is_active ? 'فعال' : 'غیرفعال'}
                                    </span>
                                </div>

                                {archive.description && (
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{archive.description}</p>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">{archive.files_count} پرونده</span>
                                    <div className="flex gap-3">
                                        <Link href={`/archives/${archive.id}/files`}
                                            className="text-xs text-primary hover:underline font-medium">
                                            مشاهده پرونده‌ها
                                        </Link>
                                        <button onClick={() => { if (confirm('حذف شود؟')) router.delete(archiveRoutes.destroy(archive.id).url); }}
                                            className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}