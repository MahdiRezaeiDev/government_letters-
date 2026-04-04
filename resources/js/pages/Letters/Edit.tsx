import { Head, router, useForm } from '@inertiajs/react';
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
    letter_type: 'incoming' | 'outgoing' | 'internal';
    subject: string; content: string; summary: string;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    security_level: 'public' | 'internal' | 'confidential' | 'secret' | 'top_secret';
    category_id: string; date: string; due_date: string; _method: 'PUT';
}

export default function Edit({ letter, categories }: Props) {

    const { data, setData, put, processing, errors } = useForm<LetterForm>({
        letter_type:    letter.letter_type,
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
        <>
            <Head title="ویرایش نامه" />
            <div className="p-6 max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نوع نامه <span className="text-red-500">*</span></label>
                        <div className="flex gap-3">
                            {([
                                { value: 'outgoing', label: 'صادره' },
                                { value: 'internal', label: 'داخلی' },
                            ] as const).map(type => (
                                <button key={type.value} type="button"
                                    onClick={() => setData('letter_type', type.value)}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${data.letter_type === type.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">موضوع <span className="text-red-500">*</span></label>
                        <input type="text" value={data.subject} onChange={e => setData('subject', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">خلاصه</label>
                        <textarea value={data.summary} onChange={e => setData('summary', e.target.value)}
                            rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">متن نامه</label>
                        <textarea value={data.content} onChange={e => setData('content', e.target.value)}
                            rows={6} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اولویت</label>
                            <select value={data.priority} onChange={e => setData('priority', e.target.value as LetterForm['priority'])}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option value="low">کم</option>
                                <option value="normal">عادی</option>
                                <option value="high">مهم</option>
                                <option value="urgent">فوری</option>
                                <option value="very_urgent">خیلی فوری</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">سطح امنیت</label>
                            <select value={data.security_level} onChange={e => setData('security_level', e.target.value as LetterForm['security_level'])}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option value="public">عمومی</option>
                                <option value="internal">داخلی</option>
                                <option value="confidential">محرمانه</option>
                                <option value="secret">سری</option>
                                <option value="top_secret">بسیار سری</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
                            <select value={data.category_id} onChange={e => setData('category_id', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option value="">انتخاب کنید</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ <span className="text-red-500">*</span></label>
                            <input type="date" value={data.date} onChange={e => setData('date', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">مهلت اقدام</label>
                        <input type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50">
                            {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                        <button type="button" onClick={() => router.visit(letters.show(letter.id).url)}
                            className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-200 text-sm">
                            انصراف
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
