import { Head, router, useForm } from '@inertiajs/react';
import TempFileUploader, { type TempFile } from '@/Components/TempFileUploader';
import { useState } from 'react';
import * as letters from '@/routes/letters';

// ─── Types ───────────────────────────────

interface Category { id: number; name: string; }
interface Org { id: number; name: string; }
interface Department { id: number; name: string; parent_id: number | null; }
interface Position { id: number; name: string; department_id: number; }

interface Props {
    categories: Category[];
    organizations: Org[];
    departments: Department[];
    positions: Position[];
}

interface LetterForm {
    letter_type: 'incoming' | 'outgoing' | 'internal' | '';
    subject: string;
    content: string;
    summary: string;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    security_level: 'public' | 'internal' | 'confidential' | 'secret' | 'top_secret';
    category_id: string;
    date: string;
    due_date: string;
    // فرستنده
    sender_id: string;
    sender_department_id: string;
    // گیرنده
    recipient_id: string;
    recipient_department_id: string;
    temp_files: TempFile[];
}

// ─── Component ───────────────────────────

export default function Create({ categories, organizations, departments, positions }: Props) {

    const { data, setData, post, processing, errors } = useForm<LetterForm>({
        letter_type: '',
        subject: '',
        content: '',
        summary: '',
        priority: 'normal',
        security_level: 'internal',
        category_id: '',
        date: new Date().toISOString().split('T')[0],
        due_date: '',
        sender_id: '',
        sender_department_id: '',
        recipient_id: '',
        recipient_department_id: '',
        temp_files: [],
    });

    // فیلتر department بر اساس org انتخاب شده
    const [senderDepts, setSenderDepts] = useState<Department[]>([]);
    const [recipientDepts, setRecipientDepts] = useState<Department[]>([]);
    const [senderPos, setSenderPos] = useState<Position[]>([]);
    const [recipientPos, setRecipientPos] = useState<Position[]>([]);

    // وقتی نوع نامه عوض میشه، فیلدهای فرستنده/گیرنده reset میشن
    function handleTypeChange(type: LetterForm['letter_type']) {
        setData(prev => ({
            ...prev,
            letter_type: type,
            sender_id: '',
            sender_department_id: '',
            recipient_id: '',
            recipient_department_id: '',
        }));
        setSenderDepts([]);
        setRecipientDepts([]);
        setSenderPos([]);
        setRecipientPos([]);
    }

    // وارده: فرستنده = سازمان خارجی انتخاب شد
    function handleSenderOrgChange(orgId: string) {
        setData(prev => ({ ...prev, sender_id: orgId, sender_department_id: '' }));
        const depts = departments.filter(d => d.parent_id === null);
        setSenderDepts(depts);
    }

    // وارده: گیرنده = واحد داخلی انتخاب شد
    function handleRecipientDeptChange(deptId: string) {
        setData(prev => ({ ...prev, recipient_department_id: deptId, recipient_id: '' }));
        const pos = positions.filter(p => p.department_id === parseInt(deptId));
        setRecipientPos(pos);
    }

    // صادره: گیرنده = سازمان خارجی انتخاب شد
    function handleRecipientOrgChange(orgId: string) {
        setData(prev => ({ ...prev, recipient_id: orgId, recipient_department_id: '' }));
        setRecipientDepts([]);
    }

    // صادره: فرستنده = واحد داخلی انتخاب شد
    function handleSenderDeptChange(deptId: string) {
        setData(prev => ({ ...prev, sender_department_id: deptId, sender_id: '' }));
        const pos = positions.filter(p => p.department_id === parseInt(deptId));
        setSenderPos(pos);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(letters.store().url);
    }

    // ─── رندر فرستنده/گیرنده بر اساس نوع نامه ───

    function renderSenderRecipient() {
        if (!data.letter_type) {
            return null;
        }

        return (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-600">
                    اطلاعات فرستنده و گیرنده
                </h3>

                {/* وارده — فرستنده خارجی، گیرنده داخلی */}
                {data.letter_type === 'incoming' && (
                    <div className="grid grid-cols-2 gap-4">
                        {/* فرستنده */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500">فرستنده (خارجی)</p>
                            <select
                                value={data.sender_id}
                                onChange={e => handleSenderOrgChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">وزارتخانه / سازمان</option>
                                {organizations.map(org => (
                                    <option key={org.id} value={org.id}>{org.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* گیرنده */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500">گیرنده (داخلی)</p>
                            <select
                                value={data.recipient_department_id}
                                onChange={e => handleRecipientDeptChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">واحد سازمانی</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            {recipientPos.length > 0 && (
                                <select
                                    value={data.recipient_id}
                                    onChange={e => setData('recipient_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">سمت (اختیاری)</option>
                                    {recipientPos.map(pos => (
                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                )}

                {/* صادره — فرستنده داخلی، گیرنده خارجی */}
                {data.letter_type === 'outgoing' && (
                    <div className="grid grid-cols-2 gap-4">
                        {/* فرستنده */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500">فرستنده (داخلی)</p>
                            <select
                                value={data.sender_department_id}
                                onChange={e => handleSenderDeptChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">واحد سازمانی</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            {senderPos.length > 0 && (
                                <select
                                    value={data.sender_id}
                                    onChange={e => setData('sender_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">سمت (اختیاری)</option>
                                    {senderPos.map(pos => (
                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* گیرنده */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500">گیرنده (خارجی)</p>
                            <select
                                value={data.recipient_id}
                                onChange={e => handleRecipientOrgChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">وزارتخانه / سازمان</option>
                                {organizations.map(org => (
                                    <option key={org.id} value={org.id}>{org.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* داخلی — هر دو داخلی */}
                {data.letter_type === 'internal' && (
                    <div className="grid grid-cols-2 gap-4">
                        {/* فرستنده */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500">فرستنده</p>
                            <select
                                value={data.sender_department_id}
                                onChange={e => handleSenderDeptChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">واحد سازمانی</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            {senderPos.length > 0 && (
                                <select
                                    value={data.sender_id}
                                    onChange={e => setData('sender_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">سمت (اختیاری)</option>
                                    {senderPos.map(pos => (
                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* گیرنده */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500">گیرنده</p>
                            <select
                                value={data.recipient_department_id}
                                onChange={e => handleRecipientDeptChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">واحد سازمانی</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            {recipientPos.length > 0 && (
                                <select
                                    value={data.recipient_id}
                                    onChange={e => setData('recipient_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">سمت (اختیاری)</option>
                                    {recipientPos.map(pos => (
                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <Head title="نامه جدید" />

            <div className="p-6 max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* نوع نامه */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            نوع نامه <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3">
                            {([
                                { value: 'outgoing', label: 'صادره' },
                                { value: 'internal', label: 'داخلی' },
                            ] as const).map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => handleTypeChange(type.value)}
                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${data.letter_type === type.value
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* فرستنده / گیرنده */}
                    {renderSenderRecipient()}
                    here

                    {/* موضوع */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            موضوع <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.subject}
                            onChange={e => setData('subject', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="موضوع نامه را وارد کنید"
                        />
                        {errors.subject && (
                            <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                        )}
                    </div>

                    {/* خلاصه */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">خلاصه</label>
                        <textarea
                            value={data.summary}
                            onChange={e => setData('summary', e.target.value)}
                            rows={2}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* متن */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">متن نامه</label>
                        <textarea
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            rows={6}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* اولویت + سطح امنیت */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اولویت</label>
                            <select
                                value={data.priority}
                                onChange={e => setData('priority', e.target.value as LetterForm['priority'])}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="low">کم</option>
                                <option value="normal">عادی</option>
                                <option value="high">مهم</option>
                                <option value="urgent">فوری</option>
                                <option value="very_urgent">خیلی فوری</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">سطح امنیت</label>
                            <select
                                value={data.security_level}
                                onChange={e => setData('security_level', e.target.value as LetterForm['security_level'])}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="public">عمومی</option>
                                <option value="internal">داخلی</option>
                                <option value="confidential">محرمانه</option>
                                <option value="secret">سری</option>
                                <option value="top_secret">بسیار سری</option>
                            </select>
                        </div>
                    </div>

                    {/* دسته‌بندی + تاریخ */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
                            <select
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">انتخاب کنید</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                تاریخ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* مهلت */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">مهلت اقدام</label>
                        <input
                            type="date"
                            value={data.due_date}
                            onChange={e => setData('due_date', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            پیوست‌ها
                        </label>
                        <TempFileUploader
                            value={data.temp_files}
                            onChange={files => setData('temp_files', files)}
                        />
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
                        >
                            {processing ? 'در حال ذخیره...' : 'ذخیره پیش‌نویس'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.visit(letters.index().url)}
                            className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-200 text-sm"
                        >
                            انصراف
                        </button>
                    </div>

                </form>
            </div>
        </>
    );
}