import { Head, Link, router } from '@inertiajs/react';
import * as users from '@/routes/admin/users';

// ─── Types ───────────────────────────────

interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    status: 'active' | 'inactive' | 'suspended';
    activePosition: {
        name: string;
        department: { name: string };
    } | null;
}

interface Props {
    users: {
        data: User[];
        total: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const STATUS_LABEL = {
    active:    'فعال',
    inactive:  'غیرفعال',
    suspended: 'معلق',
};

const STATUS_COLOR = {
    active:    'bg-green-100 text-green-700',
    inactive:  'bg-gray-100 text-gray-600',
    suspended: 'bg-red-100 text-red-700',
};

// ─── Component ───────────────────────────

export default function Index({ users: data }: Props) {

    function handleDelete(id: number) {
        if (confirm('کاربر حذف شود؟')) {
            router.delete(users.destroy(id).url);
        }
    }

    return (
        <>
            <Head title="کاربران" />

            <div className="p-6">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-800">
                        کاربران ({data.total})
                    </h2>
                    <Link
                        href={users.create().url}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                        + کاربر جدید
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">نام</th>
                                <th className="px-4 py-3 font-medium">نام کاربری</th>
                                <th className="px-4 py-3 font-medium">سمت</th>
                                <th className="px-4 py-3 font-medium">واحد</th>
                                <th className="px-4 py-3 font-medium">وضعیت</th>
                                <th className="px-4 py-3 font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-400">
                                        کاربری وجود ندارد
                                    </td>
                                </tr>
                            ) : (
                                data.data.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {user.first_name} {user.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {user.username}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {user.activePosition?.name ?? '---'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {user.activePosition?.department.name ?? '---'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLOR[user.status]}`}>
                                                {STATUS_LABEL[user.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-3">
                                                <Link
                                                    href={users.edit(user.id).url}
                                                    className="text-yellow-600 hover:underline"
                                                >
                                                    ویرایش
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* صفحه‌بندی */}
                {data.last_page > 1 && (
                    <div className="flex gap-2 mt-4 justify-center">
                        {data.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`px-3 py-1 rounded text-sm ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}