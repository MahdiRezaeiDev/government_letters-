import { Head, Link, router } from '@inertiajs/react';
import * as letters from '@/routes/letters';

// ─── Types ───────────────────────────────

interface Letter {
    id: number;
    subject: string;
    letter_number: string | null;
    letter_type: 'incoming' | 'outgoing' | 'internal';
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    final_status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
    date: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    letters: {
        data: Letter[];
        total: number;
        last_page: number;
        links: PaginationLink[];
    };
    filters: { type?: string; status?: string };
}

// ─── Constants ───────────────────────────

const PRIORITY_LABEL: Record<Letter['priority'], string> = {
    low: 'کم',
    normal: 'عادی',
    high: 'مهم',
    urgent: 'فوری',
    very_urgent: 'خیلی فوری',
};

const PRIORITY_COLOR: Record<Letter['priority'], string> = {
    low: 'bg-gray-100 text-gray-600',
    normal: 'bg-blue-100 text-blue-600',
    high: 'bg-yellow-100 text-yellow-600',
    urgent: 'bg-orange-100 text-orange-600',
    very_urgent: 'bg-red-100 text-red-600',
};

const STATUS_LABEL: Record<Letter['final_status'], string> = {
    draft: 'پیش‌نویس',
    pending: 'در انتظار تأیید',
    approved: 'تأیید شده',
    rejected: 'رد شده',
    archived: 'بایگانی',
};

const TYPE_LABEL: Record<Letter['letter_type'], string> = {
    incoming: 'وارده',
    outgoing: 'صادره',
    internal: 'داخلی',
};

// ─── Component ───────────────────────────

export default function Index({ letters: data, filters }: Props) {
    function handleDelete(id: number) {
        if (confirm('آیا مطمئن هستید؟')) {
            router.delete(letters.destroy(id).url);
        }
    }

    function handleFilter(type: string) {
        router.get(letters.index().url, { type }, { preserveState: true });
    }

    return (
        <>
            <Head title="نامه‌ها" />

            <main className="flex-1 space-y-5 overflow-auto p-6">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex overflow-hidden rounded-lg border border-gray-200 text-sm">
                            <button className="bg-blue-600 px-4 py-2 font-medium text-white">
                                همه
                            </button>
                            <button className="border-r border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50">
                                وارده
                            </button>
                            <button className="border-r border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50">
                                صادره
                            </button>
                            <button className="border-r border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50">
                                داخلی
                            </button>
                        </div>

                        <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option>همه وضعیت‌ها</option>
                            <option>پیش‌نویس</option>
                            <option>در جریان</option>
                            <option>تأیید شده</option>
                            <option>بایگانی</option>
                        </select>

                        <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option>همه اولویت‌ها</option>
                            <option>خیلی فوری</option>
                            <option>فوری</option>
                            <option>مهم</option>
                            <option>عادی</option>
                            <option>کم</option>
                        </select>

                        <div className="relative min-w-48 flex-1">
                            <svg
                                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="جستجو در موضوع، شماره..."
                                className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50">
                            <tr>
                                <th className="w-8 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        className="rounded"
                                    />
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                    شماره نامه
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                    موضوع
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                    نوع
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                    اولویت
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                    وضعیت
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                    فرستنده
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                    تاریخ
                                </th>
                                <th className="w-20 px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50" id="lettersTable">
                            {data.data.map((letter) => (
                                <tr key={letter.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            className="rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                                        {letter.letter_number || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                                        <Link href={letters.show(letter.id).url} className="font-medium text-blue-600 hover:underline">
                                            {letter.subject}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                                        {TYPE_LABEL[letter.letter_type]}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLOR[letter.priority]}`}
                                        >
                                            {PRIORITY_LABEL[letter.priority]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm">
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                            {STATUS_LABEL[letter.final_status]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                                        سازمان الف
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                                        {new Date(letter.date).toLocaleDateString('fa-IR')}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm"> 
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
                        <p className="text-xs text-gray-500">
                            نمایش ۱–۱۰ از ۵۲۸ نامه
                        </p>
                        <div className="flex items-center gap-1">
                            <button className="rounded-lg px-3 py-1.5 text-xs text-gray-400">
                                «
                            </button>
                            <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white">
                                ۱
                            </button>
                            <button className="rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100">
                                ۲
                            </button>
                            <button className="rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100">
                                ۳
                            </button>
                            <button className="rounded-lg px-3 py-1.5 text-xs text-gray-400">
                                ...
                            </button>
                            <button className="rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100">
                                ۵۳
                            </button>
                            <button className="rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100">
                                »
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
