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

const priorityColors = {
    low: { light: 'bg-gray-100 text-gray-700', dark: 'dark:bg-gray-800 dark:text-gray-300' },
    normal: { light: 'bg-blue-100 text-blue-700', dark: 'dark:bg-blue-900/30 dark:text-blue-300' },
    high: { light: 'bg-orange-100 text-orange-700', dark: 'dark:bg-orange-900/30 dark:text-orange-300' },
    urgent: { light: 'bg-red-100 text-red-700', dark: 'dark:bg-red-900/30 dark:text-red-300' },
    very_urgent: { light: 'bg-purple-100 text-purple-700', dark: 'dark:bg-purple-900/30 dark:text-purple-300' },
};

const securityLabels = {
    public: 'عمومی',
    internal: 'داخلی',
    confidential: 'محرمانه',
    secret: 'سری',
    top_secret: 'بسیار سری',
};

const securityColors = {
    public: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    internal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    confidential: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    secret: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    top_secret: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

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
            <main className="flex-1 overflow-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900/50">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ویرایش نامه</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">تغییرات مورد نظر را اعمال کنید</p>
                    </div>
                    <button 
                        onClick={() => router.visit(letters.show(letter.id).url)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        بازگشت به نامه
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* نوع نامه */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            نوع نامه <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {([
                                { value: 'outgoing', label: 'نامه صادره', icon: '📤' },
                                { value: 'internal', label: 'نامه داخلی', icon: '🏢' },
                            ] as const).map(type => (
                                <button key={type.value} type="button"
                                    onClick={() => setData('letter_type', type.value)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                        data.letter_type === type.value 
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                                    }`}>
                                    <span className="text-xl">{type.icon}</span>
                                    <span className={`text-sm font-medium ${
                                        data.letter_type === type.value 
                                            ? 'text-blue-700 dark:text-blue-400' 
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                        {type.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* موضوع */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            موضوع <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={data.subject} 
                            onChange={e => setData('subject', e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white transition-all"
                            placeholder="موضوع نامه را وارد کنید..."
                        />
                        {errors.subject && (
                            <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                        )}
                    </div>

                    {/* خلاصه */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            خلاصه نامه
                        </label>
                        <textarea 
                            value={data.summary} 
                            onChange={e => setData('summary', e.target.value)}
                            rows={3} 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white transition-all resize-none"
                            placeholder="خلاصه‌ای از نامه را وارد کنید..."
                        />
                    </div>

                    {/* متن کامل */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            متن کامل نامه
                        </label>
                        <textarea 
                            value={data.content} 
                            onChange={e => setData('content', e.target.value)}
                            rows={8} 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white transition-all font-mono"
                            placeholder="متن نامه را در اینجا بنویسید..."
                        />
                    </div>

                    {/* اولویت و سطح امنیت */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* اولویت */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                اولویت
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['low', 'normal', 'high', 'urgent', 'very_urgent'] as const).map(priority => {
                                    const priorityName = {
                                        low: 'کم',
                                        normal: 'عادی',
                                        high: 'مهم',
                                        urgent: 'فوری',
                                        very_urgent: 'خیلی فوری'
                                    }[priority];
                                    
                                    const isActive = data.priority === priority;
                                    const colors = priorityColors[priority];
                                    
                                    return (
                                        <button
                                            key={priority}
                                            type="button"
                                            onClick={() => setData('priority', priority)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                                isActive 
                                                    ? `${colors.light} ${colors.dark} ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800` 
                                                    : `bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700`
                                            }`}
                                        >
                                            {priorityName}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* سطح امنیت */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                سطح امنیت
                            </label>
                            <select 
                                value={data.security_level} 
                                onChange={e => setData('security_level', e.target.value as LetterForm['security_level'])}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white cursor-pointer"
                            >
                                {Object.entries(securityLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {data.security_level && (
                                <div className="mt-2">
                                    <span className={`inline-block px-2 py-1 rounded text-xs ${securityColors[data.security_level]}`}>
                                        سطح {securityLabels[data.security_level]}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* دسته‌بندی و تاریخ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* دسته‌بندی */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                دسته‌بندی
                            </label>
                            <select 
                                value={data.category_id} 
                                onChange={e => setData('category_id', e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white cursor-pointer"
                            >
                                <option value="">انتخاب دسته‌بندی</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        {/* تاریخ */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                تاریخ نامه <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="date" 
                                value={data.date} 
                                onChange={e => setData('date', e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white transition-all"
                            />
                        </div>
                    </div>

                    {/* مهلت اقدام */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            مهلت اقدام
                        </label>
                        <input 
                            type="date" 
                            value={data.due_date} 
                            onChange={e => setData('due_date', e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white transition-all"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            در صورت وارد نکردن مهلت، نامه بدون محدودیت زمانی در کارتابل باقی می‌ماند
                        </p>
                    </div>

                    {/* دکمه‌های اقدام */}
                    <div className="flex gap-3 pt-4">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => router.visit(letters.show(letter.id).url)}
                            className="px-6 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                            انصراف
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}