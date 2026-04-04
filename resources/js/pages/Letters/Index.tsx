import { Head, Link, router } from '@inertiajs/react';
import * as letters from '@/routes/letters';

interface Letter {
    id: number;
    subject: string;
    letter_number: string | null;
    letter_type: 'incoming' | 'outgoing' | 'internal';
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    final_status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
    date: string;
}

interface Props {
    letters: {
        data: Letter[];
        total: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { type?: string; status?: string };
}

const PRIORITY_LABEL: Record<Letter['priority'], string> = {
    low: 'کم', normal: 'عادی', high: 'مهم', urgent: 'فوری', very_urgent: 'خیلی فوری',
};

const PRIORITY_COLOR: Record<Letter['priority'], string> = {
    low: 'bg-gray-100 text-gray-600', normal: 'bg-blue-100 text-blue-600',
    high: 'bg-yellow-100 text-yellow-600', urgent: 'bg-orange-100 text-orange-600',
    very_urgent: 'bg-red-100 text-red-600',
};

const STATUS_LABEL: Record<Letter['final_status'], string> = {
    draft: 'پیش‌نویس', pending: 'در انتظار تأیید', approved: 'تأیید شده',
    rejected: 'رد شده', archived: 'بایگانی',
};

const TYPE_LABEL: Record<Letter['letter_type'], string> = {
    incoming: 'وارده', outgoing: 'صادره', internal: 'داخلی',
};

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
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-800">نامه‌ها ({data.total})</h2>
                    <Link href={letters.create().url} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                        + نامه جدید
                    </Link>
                </div>

                <div className="flex gap-2 mb-6">
                    {[
                        { value: '', label: 'همه' },
                        { value: 'incoming', label: 'وارده' },
                        { value: 'outgoing', label: 'صادره' },
                        { value: 'internal', label: 'داخلی' },
                    ].map(f => (
                        <button key={f.value} onClick={() => handleFilter(f.value)}
                            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${(filters.type ?? '') === f.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">شماره</th>
                                <th className="px-4 py-3 font-medium">موضوع</th>
                                <th className="px-4 py-3 font-medium">نوع</th>
                                <th className="px-4 py-3 font-medium">اولویت</th>
                                <th className="px-4 py-3 font-medium">وضعیت</th>
                                <th className="px-4 py-3 font-medium">تاریخ</th>
                                <th className="px-4 py-3 font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.data.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-10 text-gray-400">هیچ نامه‌ای وجود ندارد</td></tr>
                            ) : (
                                data.data.map(letter => (
                                    <tr key={letter.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-400">{letter.letter_number ?? '---'}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{letter.subject}</td>
                                        <td className="px-4 py-3 text-gray-600">{TYPE_LABEL[letter.letter_type]}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLOR[letter.priority]}`}>
                                                {PRIORITY_LABEL[letter.priority]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{STATUS_LABEL[letter.final_status]}</td>
                                        <td className="px-4 py-3 text-gray-400">{letter.date}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-3">
                                                <Link href={letters.show(letter.id).url} className="text-blue-600 hover:underline">مشاهده</Link>
                                                {letter.final_status === 'draft' && (
                                                    <>
                                                        <Link href={letters.edit(letter.id).url} className="text-yellow-600 hover:underline">ویرایش</Link>
                                                        <button onClick={() => handleDelete(letter.id)} className="text-red-600 hover:underline">حذف</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {data.last_page > 1 && (
                    <div className="flex gap-2 mt-4 justify-center">
                        {data.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'}
                                className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
