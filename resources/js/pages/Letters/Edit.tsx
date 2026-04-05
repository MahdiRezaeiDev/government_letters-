import { Head, router, useForm } from '@inertiajs/react';
import { 
  Save, 
  X, 
  Calendar, 
  AlertCircle, 
  Shield, 
  FolderTree, 
  AlignLeft,
  FileText,
  Hash,
  ChevronLeft
} from 'lucide-react';
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
    low: 'bg-green-100 text-green-700 border-green-200',
    normal: 'bg-blue-100 text-blue-700 border-blue-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    urgent: 'bg-red-100 text-red-700 border-red-200',
    very_urgent: 'bg-purple-100 text-purple-700 border-purple-200',
};

const securityLabels = {
    public: 'عمومی',
    internal: 'داخلی',
    confidential: 'محرمانه',
    secret: 'سری',
    top_secret: 'بسیار سری',
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        <button 
                            onClick={() => router.visit(letters.show(letter.id).url)}
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>بازگشت به نامه</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">ویرایش نامه</h1>
                                <p className="text-white/80 mt-1">تغییرات مورد نظر را اعمال کنید</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Letter Type Selection - Modern Cards */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                                <Hash className="w-4 h-4 text-blue-500" />
                                نوع نامه <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {([
                                    { value: 'outgoing', label: 'نامه صادره', icon: '📤', desc: 'نامه‌های ارسالی به خارج' },
                                    { value: 'internal', label: 'نامه داخلی', icon: '🏢', desc: 'نامه‌های درون سازمانی' },
                                ] as const).map(type => (
                                    <button key={type.value} type="button"
                                        onClick={() => setData('letter_type', type.value)}
                                        className={`group relative p-4 rounded-xl border-2 transition-all duration-200 text-right ${
                                            data.letter_type === type.value 
                                                ? 'border-blue-500 bg-blue-50 shadow-md' 
                                                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                        }`}>
                                        <div className="text-2xl mb-2">{type.icon}</div>
                                        <div className={`font-semibold ${data.letter_type === type.value ? 'text-blue-700' : 'text-gray-700'}`}>
                                            {type.label}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject Field */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <AlignLeft className="w-4 h-4 text-blue-500" />
                                موضوع <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                value={data.subject} 
                                onChange={e => setData('subject', e.target.value)}
                                placeholder="موضوع نامه را وارد کنید..."
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                            {errors.subject && (
                                <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.subject}
                                </div>
                            )}
                        </div>

                        {/* Two Column Layout for Summary & Priority */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Summary */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    خلاصه نامه
                                </label>
                                <textarea 
                                    value={data.summary} 
                                    onChange={e => setData('summary', e.target.value)}
                                    rows={3} 
                                    placeholder="خلاصه‌ای از نامه را وارد کنید..."
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                                />
                            </div>

                            {/* Priority */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <AlertCircle className="w-4 h-4 text-blue-500" />
                                    اولویت
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['low', 'normal', 'high', 'urgent', 'very_urgent'] as const).map(priority => (
                                        <button
                                            key={priority}
                                            type="button"
                                            onClick={() => setData('priority', priority)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                                                data.priority === priority
                                                    ? priorityColors[priority] + ' ring-2 ring-offset-1 ring-blue-500'
                                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            {priority === 'low' && 'کم'}
                                            {priority === 'normal' && 'عادی'}
                                            {priority === 'high' && 'مهم'}
                                            {priority === 'urgent' && 'فوری'}
                                            {priority === 'very_urgent' && 'خیلی فوری'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <FileText className="w-4 h-4 text-blue-500" />
                                متن کامل نامه
                            </label>
                            <textarea 
                                value={data.content} 
                                onChange={e => setData('content', e.target.value)}
                                rows={8} 
                                placeholder="متن نامه را در اینجا بنویسید..."
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>

                        {/* Security & Category */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Security Level */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <Shield className="w-4 h-4 text-blue-500" />
                                    سطح امنیت
                                </label>
                                <select 
                                    value={data.security_level} 
                                    onChange={e => setData('security_level', e.target.value as LetterForm['security_level'])}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white cursor-pointer"
                                >
                                    {Object.entries(securityLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <FolderTree className="w-4 h-4 text-blue-500" />
                                    دسته‌بندی
                                </label>
                                <select 
                                    value={data.category_id} 
                                    onChange={e => setData('category_id', e.target.value)}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white cursor-pointer"
                                >
                                    <option value="">انتخاب دسته‌بندی</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Date */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    تاریخ نامه <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="date" 
                                    value={data.date} 
                                    onChange={e => setData('date', e.target.value)}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>

                            {/* Due Date */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <Calendar className="w-4 h-4 text-orange-500" />
                                    مهلت اقدام
                                </label>
                                <input 
                                    type="date" 
                                    value={data.due_date} 
                                    onChange={e => setData('due_date', e.target.value)}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <Save className="w-5 h-5" />
                                {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => router.visit(letters.show(letter.id).url)}
                                className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 font-medium flex items-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                انصراف
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}