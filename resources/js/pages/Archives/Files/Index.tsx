import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Plus, FileText, ChevronDown, Link2, X } from 'lucide-react';
import * as archiveRoutes from '@/routes/archives';

interface Letter {
    id: number; subject: string;
    letter_number: string | null; date: string;
}

interface File {
    id: number; name: string; code: string | null;
    description: string | null; letters_count: number;
    expiry_date: string | null; letters: Letter[];
}

interface Archive { id: number; name: string; }
interface Props { archive: Archive; files: File[]; }

export default function FilesIndex({ archive, files }: Props) {

    const [showForm,   setShowForm]   = useState(false);
    const [activeFile, setActiveFile] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', code: '', description: '',
        retention_period: '', retention_unit: 'years' as 'days' | 'months' | 'years',
    });

    const attachForm = useForm({ letter_id: '' });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/archives/${archive.id}/files`, {
            onSuccess: () => { setShowForm(false); reset(); }
        });
    }

    function handleAttach(fileId: number) {
        if (!attachForm.data.letter_id) return;
        attachForm.post(`/files/${fileId}/letters`, {
            onSuccess: () => attachForm.reset()
        });
    }

    function handleDetach(fileId: number, letterId: number) {
        if (confirm('نامه از پرونده جدا شود؟')) {
            router.delete(`/files/${fileId}/letters/${letterId}`);
        }
    }

    return (
        <AuthenticatedLayout breadcrumbs={[
            { title: 'بایگانی', href: archiveRoutes.index().url },
            { title: archive.name, href: `/archives/${archive.id}/files` },
        ]}>
            <Head title={`پرونده‌های ${archive.name}`} />

            <div className="p-6 max-w-4xl mx-auto space-y-5">

                {/* هدر */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-foreground">
                            پرونده‌های {archive.name}
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{files.length} پرونده</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors font-medium">
                        <Plus size={14} /> پرونده جدید
                    </button>
                </div>

                {/* فرم پرونده جدید */}
                {showForm && (
                    <div className="bg-card border border-primary/30 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            <h3 className="text-sm font-semibold text-foreground">پرونده جدید</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input placeholder="نام پرونده *" value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                                </div>
                                <input placeholder="کد پرونده (اختیاری)" value={data.code}
                                    onChange={e => setData('code', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" placeholder="مدت نگهداری (اختیاری)"
                                    value={data.retention_period}
                                    onChange={e => setData('retention_period', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                                <div className="relative">
                                    <select value={data.retention_unit}
                                        onChange={e => setData('retention_unit', e.target.value as typeof data.retention_unit)}
                                        className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-8">
                                        <option value="days">روز</option>
                                        <option value="months">ماه</option>
                                        <option value="years">سال</option>
                                    </select>
                                    <ChevronDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button type="submit" disabled={processing}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                                    {processing ? 'در حال ذخیره...' : 'ذخیره'}
                                </button>
                                <button type="button"
                                    onClick={() => { setShowForm(false); reset(); }}
                                    className="bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-lg text-sm transition-colors">
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* لیست پرونده‌ها */}
                {files.length === 0 ? (
                    <div className="bg-card border border-border rounded-xl flex flex-col items-center py-16 text-muted-foreground/40">
                        <FileText size={36} className="mb-3" />
                        <p className="text-sm">پرونده‌ای وجود ندارد</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {files.map(file => (
                            <div key={file.id} className="bg-card border border-border rounded-xl overflow-hidden">

                                {/* هدر پرونده */}
                                <button
                                    onClick={() => setActiveFile(activeFile === file.id ? null : file.id)}
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-right">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <FileText size={15} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{file.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {file.letters_count} نامه
                                                {file.expiry_date && <span className="mr-2">· انقضا: {file.expiry_date}</span>}
                                                {file.code && <span className="mr-2">· {file.code}</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown size={14} className={`text-muted-foreground transition-transform ${activeFile === file.id ? 'rotate-180' : ''}`} />
                                </button>

                                {/* محتوای پرونده */}
                                {activeFile === file.id && (
                                    <div className="border-t border-border px-5 py-4 space-y-4">

                                        {/* الصاق نامه */}
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-2">الصاق نامه جدید</p>
                                            <div className="flex gap-2">
                                                <input type="number" placeholder="شماره ID نامه..."
                                                    value={attachForm.data.letter_id}
                                                    onChange={e => attachForm.setData('letter_id', e.target.value)}
                                                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                                                <button
                                                    onClick={() => handleAttach(file.id)}
                                                    disabled={attachForm.processing}
                                                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                                                    <Link2 size={13} />
                                                    الصاق
                                                </button>
                                            </div>
                                        </div>

                                        {/* نامه‌های الصاق شده */}
                                        {file.letters?.length > 0 ? (
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium text-muted-foreground">نامه‌های الصاق شده</p>
                                                {file.letters.map(letter => (
                                                    <div key={letter.id}
                                                        className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-2.5">
                                                        <div>
                                                            <p className="text-sm text-foreground font-medium">{letter.subject}</p>
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                {letter.letter_number ?? '---'} · {letter.date}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDetach(file.id, letter.id)}
                                                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                                                            <X size={13} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center py-6 text-muted-foreground/40">
                                                <p className="text-xs">نامه‌ای الصاق نشده</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}