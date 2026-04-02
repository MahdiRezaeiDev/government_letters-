import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import * as letters from '@/routes/letters';

// ─── Types ───────────────────────────────

interface Category   { id: number; name: string; }
interface Org        { id: number; name: string; }
interface Department { id: number; name: string; parent_id: number | null; }
interface Position   { id: number; name: string; department_id: number; }

interface Props {
    categories:    Category[];
    organizations: Org[];
    departments:   Department[];
    positions:     Position[];
}

interface LetterForm {
    letter_type:              'incoming' | 'outgoing' | 'internal' | '';
    subject:                  string;
    content:                  string;
    summary:                  string;
    priority:                 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    security_level:           'public' | 'internal' | 'confidential' | 'secret' | 'top_secret';
    category_id:              string;
    date:                     string;
    due_date:                 string;
    // فرستنده
    sender_id:                string;
    sender_department_id:     string;
    // گیرنده
    recipient_id:             string;
    recipient_department_id:  string;
}

// ─── Component ───────────────────────────

export default function Create({ categories, organizations, departments, positions }: Props) {

    const { data, setData, post, processing, errors } = useForm<LetterForm>({
        letter_type:             '',
        subject:                 '',
        content:                 '',
        summary:                 '',
        priority:                'normal',
        security_level:          'internal',
        category_id:             '',
        date:                    new Date().toISOString().split('T')[0],
        due_date:                '',
        sender_id:               '',
        sender_department_id:    '',
        recipient_id:            '',
        recipient_department_id: '',
    });

    // فیلتر department بر اساس org انتخاب شده
    const [senderDepts,    setSenderDepts]    = useState<Department[]>([]);
    const [recipientDepts, setRecipientDepts] = useState<Department[]>([]);
    const [senderPos,      setSenderPos]      = useState<Position[]>([]);
    const [recipientPos,   setRecipientPos]   = useState<Position[]>([]);

    // وقتی نوع نامه عوض میشه، فیلدهای فرستنده/گیرنده reset میشن
    function handleTypeChange(type: LetterForm['letter_type']) {
        setData(prev => ({
            ...prev,
            letter_type:             type,
            sender_id:               '',
            sender_department_id:    '',
            recipient_id:            '',
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

            <main className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-5">

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">نوع نامه</p>
          <div className="flex gap-3">
            <button onClick="setType(this,'incoming')" className="type-btn flex-1 py-3 rounded-xl border-2 border-green-400 bg-green-50 text-green-700 text-sm font-medium transition-all">📥 وارده</button>
            <button onClick="setType(this,'outgoing')" className="type-btn flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-medium transition-all hover:border-purple-400">📤 صادره</button>
            <button onClick="setType(this,'internal')" className="type-btn flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-medium transition-all hover:border-blue-400">🔄 داخلی</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 pb-3 border-b border-gray-100">اطلاعات نامه</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">موضوع نامه <span className="text-red-500">*</span></label>
            <input type="text" placeholder="موضوع نامه را وارد کنید..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">اولویت <span className="text-red-500">*</span></label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>کم اهمیت</option>
                <option selected>عادی</option>
                <option>مهم</option>
                <option>فوری</option>
                <option>خیلی فوری</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">سطح دسترسی</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>عمومی</option>
                <option selected>داخلی</option>
                <option>محرمانه</option>
                <option>سری</option>
                <option>بسیار سری</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">دسته‌بندی</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>انتخاب کنید...</option>
                <option>اداری</option>
                <option>مالی</option>
                <option>حقوقی</option>
                <option>فنی</option>
                <option>قراردادها</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">تاریخ نامه <span className="text-red-500">*</span></label>
              <input type="date" value="2025-04-05" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">مهلت پاسخ</label>
              <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">تعداد برگ</label>
              <input type="number" value="1" min="1" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 pb-3 border-b border-gray-100">فرستنده و گیرنده</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">نام فرستنده</label>
              <input type="text" placeholder="نام و نام خانوادگی یا نام شرکت" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">سمت فرستنده</label>
              <input type="text" placeholder="مثال: مدیرعامل" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">نام گیرنده</label>
              <input type="text" placeholder="نام و نام خانوادگی یا نام شرکت" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">سمت گیرنده</label>
              <input type="text" placeholder="مثال: مدیر مالی" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 pb-3 border-b border-gray-100">متن نامه</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">خلاصه</label>
            <textarea rows={8} placeholder="خلاصه مختصر نامه..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">متن کامل نامه</label>
            <textarea rows={2} placeholder="متن کامل نامه را اینجا بنویسید..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"></textarea>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 pb-3 border-b border-gray-100 mb-4">پیوست‌ها</h2>
          <div className="drop-zone rounded-xl p-8 text-center cursor-pointer" onClick="document.getElementById('fileInput').click()">
            <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            <p className="text-sm text-gray-500">فایل را اینجا بکشید یا <span className="text-blue-600">کلیک کنید</span></p>
            <p className="text-xs text-gray-400 mt-1">PDF، Word، Excel، تصویر — حداکثر ۱۰ مگابایت</p>
            <input id="fileInput" type="file" multiple className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png" onchange="addFiles(this)"/>
          </div>
          <div id="fileList" className="mt-3 space-y-2"></div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
          <a href="letters.html" className="text-sm text-gray-500 hover:text-gray-700">انصراف</a>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
              ذخیره پیش‌نویس
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              ثبت نامه
            </button>
          </div>
        </div>

      </div>
    </main>
        </>
    );
}