import { Head, router, useForm } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import PersianDatePicker from '@/components/PersianDatePicker';
import TempFileUploader, { type TempFile } from '@/Components/TempFileUploader';
import * as letters from '@/routes/letters';

// ─── Types ───────────────────────────────

interface Category   { id: number; name: string; }
interface Org        { id: number; name: string; }
interface Department { id: number; name: string; parent_id: number | null; }
interface Position   { id: number; name: string; department_id: number; }

interface Props {
    categories: Category[]; organizations: Org[];
    departments: Department[]; positions: Position[];
}

interface LetterForm {
    letter_type:             'outgoing' | 'internal' | '';
    subject:                 string;
    content:                 string;
    summary:                 string;
    priority:                'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    security_level:          'public' | 'internal' | 'confidential' | 'secret' | 'top_secret';
    category_id:             string;
    date:                    string;
    due_date:                string;
    sender_id:               string;
    sender_department_id:    string;
    recipient_id:            string;
    recipient_department_id: string;
    temp_files:              TempFile[];
}

// ─── helpers ─────────────────────────────

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
            <input {...props}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all ${error ? 'border-destructive focus:ring-destructive' : 'border-border'} ${props.className ?? ''}`}
            />
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
        </div>
    );
}

function Select({ error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
    return (
        <div className="relative">
            <select {...props}
                className={`w-full appearance-none bg-background border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all pr-8 ${error ? 'border-destructive' : 'border-border'} ${props.className ?? ''}`}>
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
            <textarea {...props}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none ${error ? 'border-destructive' : 'border-border'}`}
            />
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-sm font-semibold text-foreground">{children}</h3>
        </div>
    );
}

// ─── Component ───────────────────────────

export default function Create({ categories, organizations, departments, positions }: Props) {

    const { data, setData, post, processing, errors } = useForm<LetterForm>({
        letter_type: '', subject: '', content: '', summary: '',
        priority: 'normal', security_level: 'internal', category_id: '',
        date: '', due_date: '',
        sender_id: '', sender_department_id: '',
        recipient_id: '', recipient_department_id: '',
        temp_files: [],
    });

    console.log(data.date);
    

    const [senderPos,    setSenderPos]    = useState<Position[]>([]);
    const [recipientPos, setRecipientPos] = useState<Position[]>([]);

    function handleTypeChange(type: LetterForm['letter_type']) {
        setData(prev => ({ ...prev, letter_type: type, sender_id: '', sender_department_id: '', recipient_id: '', recipient_department_id: '' }));
        setSenderPos([]); setRecipientPos([]);
    }

    function handleSenderDeptChange(deptId: string) {
        setData(prev => ({ ...prev, sender_department_id: deptId, sender_id: '' }));
        setSenderPos(positions.filter(p => p.department_id === parseInt(deptId)));
    }

    function handleRecipientDeptChange(deptId: string) {
        setData(prev => ({ ...prev, recipient_department_id: deptId, recipient_id: '' }));
        setRecipientPos(positions.filter(p => p.department_id === parseInt(deptId)));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(letters.store().url);
    }

    return (
        <>
            <Head title="نامه جدید" />

            <div className="p-6 max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ─── نوع نامه ─── */}
                    <div className="bg-card border border-border rounded-xl p-5">
                        <SectionTitle>نوع نامه</SectionTitle>
                        <div className="grid grid-cols-2 gap-2">
                            {([
                                { value: 'outgoing', label: 'صادره',  desc: 'ارسال به سازمان دیگر' },
                                { value: 'internal', label: 'داخلی',  desc: 'بین واحدهای داخلی' },
                            ] as const).map(type => (
                                <button key={type.value} type="button"
                                    onClick={() => handleTypeChange(type.value)}
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
                        {errors.letter_type && <p className="text-destructive text-xs mt-2">{errors.letter_type}</p>}
                    </div>

                    {/* ─── فرستنده / گیرنده ─── */}
                    {data.letter_type && (
                        <div className="bg-card border border-border rounded-xl p-5">
                            <SectionTitle>فرستنده و گیرنده</SectionTitle>
                            <div className="grid grid-cols-2 gap-4">

                                {/* فرستنده */}
                                <div className="space-y-2">
                                    <Label>فرستنده {data.letter_type === 'outgoing' ? '(داخلی)' : ''}</Label>
                                    <Select value={data.sender_department_id}
                                        onChange={e => handleSenderDeptChange(e.target.value)}>
                                        <option value="">واحد سازمانی...</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </Select>
                                    {senderPos.length > 0 && (
                                        <Select value={data.sender_id}
                                            onChange={e => setData('sender_id', e.target.value)}>
                                            <option value="">سمت (اختیاری)</option>
                                            {senderPos.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </Select>
                                    )}
                                </div>

                                {/* گیرنده */}
                                <div className="space-y-2">
                                    <Label>گیرنده {data.letter_type === 'outgoing' ? '(خارجی)' : ''}</Label>
                                    {data.letter_type === 'outgoing' ? (
                                        <Select value={data.recipient_id}
                                            onChange={e => setData('recipient_id', e.target.value)}>
                                            <option value="">وزارتخانه / سازمان...</option>
                                            {organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                        </Select>
                                    ) : (
                                        <>
                                            <Select value={data.recipient_department_id}
                                                onChange={e => handleRecipientDeptChange(e.target.value)}>
                                                <option value="">واحد سازمانی...</option>
                                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                            </Select>
                                            {recipientPos.length > 0 && (
                                                <Select value={data.recipient_id}
                                                    onChange={e => setData('recipient_id', e.target.value)}>
                                                    <option value="">سمت (اختیاری)</option>
                                                    {recipientPos.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                </Select>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── محتوا ─── */}
                    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                        <SectionTitle>محتوای نامه</SectionTitle>

                        <div>
                            <Label required>موضوع</Label>
                            <Input value={data.subject} onChange={e => setData('subject', e.target.value)}
                                placeholder="موضوع نامه را وارد کنید" error={errors.subject} />
                        </div>

                        <div>
                            <Label>خلاصه</Label>
                            <Textarea value={data.summary} onChange={e => setData('summary', e.target.value)}
                                rows={2} placeholder="خلاصه‌ای از نامه..." />
                        </div>

                        <div>
                            <Label>متن نامه</Label>
                            <Textarea value={data.content} onChange={e => setData('content', e.target.value)}
                                rows={6} placeholder="متن کامل نامه را اینجا بنویسید..." />
                        </div>
                    </div>

                    {/* ─── تنظیمات ─── */}
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

                                    <PersianDatePicker
                                        // label="تاریخ تولد"
                                        value={data.date}
                                        error={errors.date}
                                        placeholder="انتخاب کنید..."
                                        onChange={(date) => setData('date', date)}/>
                            </div>

                            <div className="col-span-2">
                                <Label>مهلت اقدام</Label>
                                <PersianDatePicker
                                        // label="تاریخ تولد"
                                        value={data.due_date}
                                        error={errors.due_date}
                                        placeholder="انتخاب کنید..."
                                        onChange={(date) => setData('due_date', date)} />
                            </div>
                        </div>
                    </div>

                    {/* ─── پیوست ─── */}
                    <div className="bg-card border border-border rounded-xl p-5">
                        <SectionTitle>پیوست‌ها</SectionTitle>
                        <TempFileUploader
                            value={data.temp_files}
                            onChange={files => setData('temp_files', files)} />
                    </div>

                    {/* ─── دکمه‌ها ─── */}
                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                            {processing ? 'در حال ذخیره...' : 'ذخیره پیش‌نویس'}
                        </button>
                        <button type="button"
                            onClick={() => router.visit(letters.index().url)}
                            className="px-6 bg-muted hover:bg-muted/80 text-muted-foreground py-2.5 rounded-lg text-sm font-medium transition-colors">
                            انصراف
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}