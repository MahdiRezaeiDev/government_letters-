import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="داشبورد" />
            <main className="flex-1 overflow-auto p-6 space-y-6">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-xs text-gray-400 mb-1">نامه‌های وارده</p>
                    <p className="text-3xl font-bold text-gray-800">۲۴۸</p>
                    <p className="text-xs text-green-600 mt-1">↑ ۱۲٪ این ماه</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                    </div>
                </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-xs text-gray-400 mb-1">نامه‌های صادره</p>
                    <p className="text-3xl font-bold text-gray-800">۱۸۳</p>
                    <p className="text-xs text-purple-600 mt-1">↑ ۸٪ این ماه</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                    </div>
                </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-xs text-gray-400 mb-1">نامه‌های داخلی</p>
                    <p className="text-3xl font-bold text-gray-800">۹۷</p>
                    <p className="text-xs text-blue-600 mt-1">↓ ۳٪ این ماه</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-xs text-gray-400 mb-1">در انتظار اقدام</p>
                    <p className="text-3xl font-bold text-gray-800">۳۲</p>
                    <p className="text-xs text-orange-600 mt-1">۵ تاخیر دار</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-700 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg></div>
                <div><p className="text-xs text-slate-400">کارتابل من</p><p className="text-xl font-bold text-white">۷</p></div>
                </div>
                <div className="bg-yellow-500 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                <div><p className="text-xs text-yellow-100">در انتظار</p><p className="text-xl font-bold text-white">۵</p></div>
                </div>
                <div className="bg-red-500 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-400 rounded-lg flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
                <div><p className="text-xs text-red-100">تاخیر دار</p><p className="text-xl font-bold text-white">۲</p></div>
                </div>
                <div className="bg-teal-500 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-400 rounded-lg flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                <div><p className="text-xs text-teal-100">تکمیل امروز</p><p className="text-xl font-bold text-white">۳</p></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h2 className="font-semibold text-gray-800 mb-4 text-sm">نامه‌های ۷ روز گذشته</h2>
                <canvas id="letterChart" height="100"></canvas>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h2 className="font-semibold text-gray-800 mb-4 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span> اطلاعیه‌ها
                </h2>
                <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-xs font-semibold text-orange-800 mb-1">جلسه هیئت مدیره</p>
                    <p className="text-xs text-orange-700">جلسه فوق‌العاده هیئت مدیره روز پنجشنبه ساعت ۱۰ صبح برگزار می‌شود.</p>
                    <p className="text-xs text-orange-400 mt-1">۱۴۰۴/۰۱/۱۵</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-blue-800 mb-1">به‌روزرسانی سیستم</p>
                    <p className="text-xs text-blue-700">سیستم روز چهارشنبه از ساعت ۲۲ تا ۲۳ در دسترس نخواهد بود.</p>
                    <p className="text-xs text-blue-400 mt-1">۱۴۰۴/۰۱/۱۴</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-xs font-semibold text-green-800 mb-1">روز ملی ارتباطات</p>
                    <p className="text-xs text-green-700">برنامه‌های ویژه روز ملی ارتباطات اعلام شد.</p>
                    <p className="text-xs text-green-400 mt-1">۱۴۰۴/۰۱/۱۲</p>
                    </div>
                </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-sm">آخرین نامه‌ها</h2>
                <a href="letters.html" className="text-xs text-blue-600 hover:text-blue-800">مشاهده همه ←</a>
                </div>
                <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-5 py-3 text-right text-xs text-gray-500 font-medium">شماره</th>
                    <th className="px-5 py-3 text-right text-xs text-gray-500 font-medium">موضوع</th>
                    <th className="px-5 py-3 text-right text-xs text-gray-500 font-medium">نوع</th>
                    <th className="px-5 py-3 text-right text-xs text-gray-500 font-medium">اولویت</th>
                    <th className="px-5 py-3 text-right text-xs text-gray-500 font-medium">وضعیت</th>
                    <th className="px-5 py-3 text-right text-xs text-gray-500 font-medium">تاریخ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => (window.location = 'letter-show.html')}>
                    <td className="px-5 py-3 text-xs font-mono text-gray-500">IN/1404/01/00012</td>
                    <td className="px-5 py-3"><p className="text-gray-800 font-medium">درخواست تمدید قرارداد شرکت آبان تجارت</p></td>
                    <td className="px-5 py-3"><span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">وارده</span></td>
                    <td className="px-5 py-3"><span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">فوری</span></td>
                    <td className="px-5 py-3"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">در جریان</span></td>
                    <td className="px-5 py-3 text-xs text-gray-500">۱۴۰۴/۰۱/۱۵</td>
                    </tr>
                    <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-5 py-3 text-xs font-mono text-gray-500">OUT/1404/01/00089</td>
                    <td className="px-5 py-3"><p className="text-gray-800 font-medium">پاسخ به استعلام سازمان مالیاتی</p></td>
                    <td className="px-5 py-3"><span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">صادره</span></td>
                    <td className="px-5 py-3"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">عادی</span></td>
                    <td className="px-5 py-3"><span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">تأیید شده</span></td>
                    <td className="px-5 py-3 text-xs text-gray-500">۱۴۰۴/۰۱/۱۴</td>
                    </tr>
                    <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-5 py-3 text-xs font-mono text-gray-500">INT/1404/01/00034</td>
                    <td className="px-5 py-3"><p className="text-gray-800 font-medium">دستورالعمل نحوه استفاده از سیستم حضور و غیاب</p></td>
                    <td className="px-5 py-3"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">داخلی</span></td>
                    <td className="px-5 py-3"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">کم</span></td>
                    <td className="px-5 py-3"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">در جریان</span></td>
                    <td className="px-5 py-3 text-xs text-gray-500">۱۴۰۴/۰۱/۱۳</td>
                    </tr>
                    <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-5 py-3 text-xs font-mono text-gray-500">IN/1404/01/00011</td>
                    <td className="px-5 py-3"><p className="text-gray-800 font-medium">شکایت مشتری - پرونده ۴۵۲۱</p></td>
                    <td className="px-5 py-3"><span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">وارده</span></td>
                    <td className="px-5 py-3"><span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">خیلی فوری</span></td>
                    <td className="px-5 py-3"><span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">در انتظار</span></td>
                    <td className="px-5 py-3 text-xs text-gray-500">۱۴۰۴/۰۱/۱۳</td>
                    </tr>
                    <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-5 py-3 text-xs font-mono text-gray-500">OUT/1404/01/00088</td>
                    <td className="px-5 py-3"><p className="text-gray-800 font-medium">ارسال گزارش عملکرد فصل چهارم</p></td>
                    <td className="px-5 py-3"><span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">صادره</span></td>
                    <td className="px-5 py-3"><span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">مهم</span></td>
                    <td className="px-5 py-3"><span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">تأیید شده</span></td>
                    <td className="px-5 py-3 text-xs text-gray-500">۱۴۰۴/۰۱/۱۲</td>
                    </tr>
                </tbody>
                </table>
            </div>

            </main>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'داشبورد',
            href: dashboard(),
        },
    ],
};
