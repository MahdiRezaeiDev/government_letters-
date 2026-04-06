import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { ChevronDown } from 'lucide-react';
import * as letters from '@/routes/letters';

interface LetterCategory { id: number; name: string; }
interface Letter {
    id: number; letter_type: 'incoming' | 'outgoing' | 'internal';
    subject: string; content: string | null; summary: string | null;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    security_level: 'public' | 'internal' | 'confidential' | 'secret' | 'top_secret';
    category_id: number | null; date: string; due_date: string | null;
}

interface Props { letter: Letter; categories: LetterCategory[]; }

interface LetterForm {
    letter_type: 'outgoing' | 'internal';
    subject: string; content: string; summary: string;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    security_level: 'public' | 'internal' | 'confidential' | 'secret' | 'top_secret';
    category_id: string; date: string; due_date: string; _method: 'PUT';
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
            <select {...props} className={`w-full appearance-none bg-background border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all pr-8 ${error ? 'border-destructive' : 'border-border'}`}>
                {children}
            </select>
            <ChevronDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
        </div>
    );
}

function Textarea({ error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
    return (
        <div>
            <textarea {...props} className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none ${error ? 'border-destructive' : 'border-border'}`} />
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

export default function Edit({ letter, categories }: Props) {

    const { data, setData, put, processing, errors } = useForm<LetterForm>({
        letter_type:    letter.letter_type === 'incoming' ? 'outgoing' : letter.letter_type as 'outgoing' | 'internal',
        subject:        letter.subject,
        content:        letter.content ?? '',
        summary:        letter.summary ?? '',
        priority:       letter.priority,
        security_level: letter.security_level,
        category_id:    letter.category_id?.toString() ?? '',
        date:           letter.date,
        due_date:       letter.due_date ?? '',
        _method:        'PUT',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(letters.update(letter.id).url);
    }

    return (
        <AuthenticatedLayout breadcrumbs={[
            { title: 'نامه‌ها', href: letters.index().url },
            { title: letter.subject, href: letters.show(letter.id).url },
            { title: 'ویرایش', href: letters.edit(letter.id).url },
        ]}>
            <Head title="ویرایش نامه" />

            <div className="p-6 max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* نوع نامه */}
                    <div className="bg-card border border-border rounded-xl p-5">
                        <SectionTitle>نوع نامه</SectionTitle>
                        <div className="grid grid-cols-2 gap-2">
                            {([
                                { value: 'outgoing', label: 'صادره',  desc: 'ارسال به سازمان دیگر' },
                                { value: 'internal', label: 'داخلی',  desc: 'بین واحدهای داخلی' },
                            ] as const).map(type => (
                                <button key={type.value} type="button"
                                    onClick={() => setData('letter_type', type.value)}
                                    className={`flex flex-col items-start p-3 rounded-lg border-2 transition-all text-right ${
                                        data.letter_type === type.value
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/40'
                                    }`}>
                                    <span className={`text-sm font-semibold ${data.letter_type === type.value ? 'text-primary' : 'text-foreground'}`}>
                                        {type.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-0.5">{type.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* محتوا */}
                    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                        <SectionTitle>محتوای نامه</SectionTitle>

                        <div>
                            <Label required>موضوع</Label>
                            <Input value={data.subject} onChange={e => setData('subject', e.target.value)}
                                error={errors.subject} />
                        </div>

                        <div>
                            <Label>خلاصه</Label>
                            <Textarea value={data.summary} onChange={e => setData('summary', e.target.value)}
                                rows={2} placeholder="خلاصه‌ای از نامه..." />
                        </div>

                        <div>
                            <Label>متن نامه</Label>
                            <Textarea value={data.content} onChange={e => setData('content', e.target.value)}
                                rows={8} placeholder="متن کامل نامه..." />
                        </div>
                    </div>

                    {/* تنظیمات */}
                    <div className="bg-card border border-border rounded-xl p-5">
                        <SectionTitle>تنظیمات</SectionTitle>
                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <Label>اولویت</Label>
                                <Select value={data.priority}
                                    onChange={e => setData('priority', e.target.value as LetterForm['priority'])}>
                                    <option value="low">کم</option>
                                    <option value="normal">عادی</option>
                                    <option value="high">مهم</option>
                                    <option value="urgent">فوری</option>
                                    <option value="very_urgent">خیلی فوری</option>
                                </Select>
                            </div>

                            <div>
                                <Label>سطح امنیت</Label>
                                <Select value={data.security_level}
                                    onChange={e => setData('security_level', e.target.value as LetterForm['security_level'])}>
                                    <option value="public">عمومی</option>
                                    <option value="internal">داخلی</option>
                                    <option value="confidential">محرمانه</option>
                                    <option value="secret">سری</option>
                                    <option value="top_secret">بسیار سری</option>
                                </Select>
                            </div>

                            <div>
                                <Label>دسته‌بندی</Label>
                                <Select value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}>
                                    <option value="">انتخاب کنید</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </Select>
                            </div>

                            <div>
                                <Label required>تاریخ</Label>
                                <Input type="date" value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    error={errors.date} />
                            </div>

                            <div className="col-span-2">
                                <Label>مهلت اقدام</Label>
                                <Input type="date" value={data.due_date}
                                    onChange={e => setData('due_date', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                            {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                        <button type="button"
                            onClick={() => router.visit(letters.show(letter.id).url)}
                            className="px-6 bg-muted hover:bg-muted/80 text-muted-foreground py-2.5 rounded-lg text-sm font-medium transition-colors">
                            انصراف
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}