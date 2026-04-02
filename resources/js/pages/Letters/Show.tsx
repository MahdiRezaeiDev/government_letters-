import { Head, Link, router } from '@inertiajs/react';
import AttachmentUploader from '@/Components/AttachmentUploader';
import * as letters from '@/routes/letters';
import RoutingPanel from '@/Components/RoutingPanel';


// ─── Types ───────────────────────────────

interface Attachment {
    id: number;
    file_name: string;
    file_size: number;
    mime_type: string;
    created_at: string;
}

interface Routing {
    id: number;
    action_type: string;
    status: string;
    instruction: string | null;
    deadline: string | null;
    toUser: { first_name: string; last_name: string } | null;
    toPosition: { name: string } | null;
}

interface Letter {
    id: number;
    letter_number: string | null;
    tracking_number: string | null;
    letter_type: 'incoming' | 'outgoing' | 'internal';
    subject: string;
    summary: string | null;
    content: string | null;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    security_level: string;
    final_status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
    date: string;
    due_date: string | null;
    sender_name: string | null;
    sender_position: string | null;
    recipient_name: string | null;
    recipient_position: string | null;
    category: { name: string } | null;
    creator: { first_name: string; last_name: string } | null;
    attachments: Attachment[];
    routings: Routing[];
}

interface Props {
    letter: Letter;
    uploadUrl: string;
    storeRoutingUrl: string;
    positions: { id: number; name: string; department: { name: string } }[];
    users:     { id: number; first_name: string; last_name: string; activePosition: { name: string } | null }[];
}

// ─── Constants ───────────────────────────

const PRIORITY_COLOR: Record<Letter['priority'], string> = {
    low:         'bg-gray-100 text-gray-600',
    normal:      'bg-blue-100 text-blue-600',
    high:        'bg-yellow-100 text-yellow-600',
    urgent:      'bg-orange-100 text-orange-600',
    very_urgent: 'bg-red-100 text-red-600',
};

const PRIORITY_LABEL: Record<Letter['priority'], string> = {
    low:         'کم',
    normal:      'عادی',
    high:        'مهم',
    urgent:      'فوری',
    very_urgent: 'خیلی فوری',
};

const STATUS_COLOR: Record<Letter['final_status'], string> = {
    draft:    'bg-gray-100 text-gray-600',
    pending:  'bg-yellow-100 text-yellow-600',
    approved: 'bg-green-100 text-green-600',
    rejected: 'bg-red-100 text-red-600',
    archived: 'bg-purple-100 text-purple-600',
};

const STATUS_LABEL: Record<Letter['final_status'], string> = {
    draft:    'پیش‌نویس',
    pending:  'در انتظار تأیید',
    approved: 'تأیید شده',
    rejected: 'رد شده',
    archived: 'بایگانی',
};

const TYPE_LABEL: Record<Letter['letter_type'], string> = {
    incoming: 'وارده',
    outgoing: 'صادره',
    internal: 'داخلی',
};

// ─── Helper ──────────────────────────────

function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
        return bytes + ' B';
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + ' KB';
    }

    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}



// ─── Component ───────────────────────────

export default function Show({ letter, uploadUrl, storeRoutingUrl, positions, users }: Props) {

    function handleDelete() {
        if (confirm('آیا مطمئن هستید؟')) {
            router.delete(letters.destroy(letter.id).url);
        }
    }

    return (
        <>
            <Head title={letter.subject} />

            <main className="flex-1 overflow-auto p-6">
                <div className="max-w-5xl mx-auto space-y-5">

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">وارده</span>
                        <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full font-medium">فوری</span>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">در جریان</span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-mono">IN/1404/01/00012</span>
                        <span className="text-xs text-gray-400">رهگیری: TRK-A3F2B1</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                        چاپ
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        ویرایش
                        </button>
                        <button onclick="document.getElementById('routingModal').classList.remove('hidden')" className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                        ارجاع نامه
                        </button>
                    </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    <div className="lg:col-span-2 space-y-5">

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100 text-sm">اطلاعات نامه</h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div><p className="text-xs text-gray-400 mb-0.5">موضوع</p><p className="text-gray-800 font-medium">درخواست تمدید قرارداد شرکت آبان تجارت</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">تاریخ نامه</p><p className="text-gray-800">۱۴۰۴/۰۱/۱۵</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">فرستنده</p><p className="text-gray-800">مدیرعامل شرکت آبان تجارت</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">سمت فرستنده</p><p className="text-gray-800">مدیرعامل</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">گیرنده</p><p className="text-gray-800">شرکت پیشتاز ارتباطات</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">دسته‌بندی</p><p className="text-gray-800">قراردادها و حقوقی</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">مهلت پاسخ</p><p className="text-red-600 font-medium">۱۴۰۴/۰۱/۲۲</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">تعداد برگ</p><p className="text-gray-800">۳ برگ</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">سطح امنیت</p><p className="text-gray-800">محرمانه</p></div>
                            <div><p className="text-xs text-gray-400 mb-0.5">کلمات کلیدی</p>
                            <div className="flex gap-1 flex-wrap">
                                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">قرارداد</span>
                                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">تمدید</span>
                                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">آبان تجارت</span>
                            </div>
                            </div>
                        </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                        <h2 className="font-semibold text-blue-900 mb-2 text-sm">خلاصه نامه</h2>
                        <p className="text-sm text-blue-800 leading-7">این شرکت درخواست تمدید قرارداد همکاری مشترک به مدت یک سال دیگر را دارد. ارزش قرارداد ۲۵۰ میلیون تومان بوده و شامل خدمات پشتیبانی فنی و نگهداری سیستم‌های نرم‌افزاری می‌شود.</p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100 text-sm">متن نامه</h2>
                        <div className="text-sm text-gray-700 leading-8">
                            <p>بسمه تعالی</p>
                            <p className="mt-3">مدیریت محترم شرکت پیشتاز ارتباطات</p>
                            <p className="mt-3">با سلام و احترام،</p>
                            <p className="mt-3">پیرو قرارداد شماره ۱۴۰۳/۱۲۵ مورخ ۱۴۰۳/۰۱/۱۵ و به منظور تداوم همکاری‌های مثمر ثمر فیمابین، به استحضار می‌رساند این شرکت مایل به تمدید قرارداد همکاری برای یک سال دیگر می‌باشد.</p>
                            <p className="mt-3">لذا خواهشمند است دستورات لازم جهت بررسی و صدور مجوز تمدید قرارداد صادر فرمایید. جهت هرگونه هماهنگی بیشتر می‌توانید با اینجانب تماس حاصل فرمایید.</p>
                            <p className="mt-3">با تقدیم احترام</p>
                            <p className="mt-2 font-medium">محمد رضایی - مدیرعامل شرکت آبان تجارت</p>
                        </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                            پیوست‌ها (۲ فایل)
                        </h2>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center text-xs font-bold text-red-600">PDF</div>
                                <div>
                                <p className="text-sm text-gray-800 font-medium">قرارداد-۱۴۰۳-۱۲۵.pdf</p>
                                <p className="text-xs text-gray-400">۲.۴ MB · دانلود ۳ بار</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                دانلود
                            </button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">DOC</div>
                                <div>
                                <p className="text-sm text-gray-800 font-medium">پیش-نویس-تمدید.docx</p>
                                <p className="text-xs text-gray-400">۱۸۵ KB · دانلود ۱ بار</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                دانلود
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="space-y-5">

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100 text-sm">تاریخچه گردش کار</h2>
                        <div className="space-y-1">

                            <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <div className="w-0.5 h-12 bg-gray-100 mt-1"></div>
                            </div>
                            <div className="pb-4 flex-1">
                                <div className="bg-gray-50 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs font-semibold text-gray-800">دفتر مدیرعامل</p>
                                    <span className="text-xs text-gray-400">۱۴۰۴/۰۱/۱۵</span>
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded">جهت اطلاع</span>
                                    <span className="text-xs text-green-600 font-medium">تکمیل شد</span>
                                </div>
                                <p className="text-xs text-gray-500">نامه بررسی شد و جهت اقدام ارجاع داده شد.</p>
                                </div>
                            </div>
                            </div>

                            <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <div className="w-0.5 h-12 bg-gray-100 mt-1"></div>
                            </div>
                            <div className="pb-4 flex-1">
                                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs font-semibold text-gray-800">واحد حقوقی</p>
                                    <span className="text-xs text-gray-400">۱۴۰۴/۰۱/۱۶</span>
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded">بررسی حقوقی</span>
                                    <span className="text-xs text-yellow-600 font-medium animate-pulse">در جریان</span>
                                </div>
                                <p className="text-xs text-gray-500">مهلت: ۱۴۰۴/۰۱/۲۰</p>
                                </div>
                            </div>
                            </div>

                            <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-gray-400">۳</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-3">
                                <p className="text-xs font-semibold text-gray-500">امضاء مدیرعامل</p>
                                <p className="text-xs text-gray-400 mt-1">در انتظار تکمیل مرحله قبل</p>
                                </div>
                            </div>
                            </div>

                        </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="font-semibold text-gray-800 mb-3 text-sm">اطلاعات ثبت</h2>
                        <div className="space-y-2 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            <span>ثبت توسط: سارا محمودی</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span>تاریخ ثبت: ۱۴۰۴/۰۱/۱۵ ساعت ۰۹:۳۲</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>آخرین ویرایش: ۱۴۰۴/۰۱/۱۶</span>
                            </div>
                        </div>
                        </div>

                    </div>
                    </div>
                </div>
            </main>
        </>
    );
}