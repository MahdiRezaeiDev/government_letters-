import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { useState } from 'react';
import * as orgs from '@/routes/admin/organizations';

// ─── Types ───────────────────────────────

interface Organization {
    id:                number;
    name:              string;
    code:              string;
    email:             string | null;
    phone:             string | null;
    address:           string | null;
    status:            'active' | 'inactive';
    departments_count: number;
    users_count:       number;
    parent:            { id: number; name: string } | null;
}

interface Props {
    organizations: Organization[];
}

// ─── Component ───────────────────────────

export default function Index({ organizations }: Props) {

    const [showForm, setShowForm] = useState(false);
    const [editing,  setEditing]  = useState<Organization | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name:      '',
        code:      '',
        email:     '',
        phone:     '',
        address:   '',
        parent_id: '',
        status:    'active' as 'active' | 'inactive',
    });

    function handleCreate() {
        setEditing(null);
        reset();
        setShowForm(true);
    }

    function handleEdit(org: Organization) {
        setEditing(org);
        setData({
            name:      org.name,
            code:      org.code,
            email:     org.email     ?? '',
            phone:     org.phone     ?? '',
            address:   org.address   ?? '',
            parent_id: org.parent?.id.toString() ?? '',
            status:    org.status,
        });
        setShowForm(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            put(orgs.update(editing.id).url, {
                onSuccess: () => { setShowForm(false); reset(); setEditing(null); }
            });
        } else {
            post(orgs.store().url, {
                onSuccess: () => { setShowForm(false); reset(); }
            });
        }
    }

    function handleDelete(id: number) {
        if (confirm('سازمان حذف شود؟')) {
            router.delete(orgs.destroy(id).url);
        }
    }

    return (
        <>
            <Head title="سازمان‌ها" />

            <div className="p-6">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-800">
                        سازمان‌ها ({organizations.length})
                    </h2>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                        + سازمان جدید
                    </button>
                </div>

                {/* فرم */}
                {showForm && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-700">
                                {editing ? 'ویرایش سازمان' : 'سازمان جدید'}
                            </h3>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="نام سازمان *"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="کد سازمان *"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                        disabled={!!editing}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100"
                                    />
                                    {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                                </div>
                                <div>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value as 'active' | 'inactive')}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    >
                                        <option value="active">فعال</option>
                                        <option value="inactive">غیرفعال</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="ایمیل"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="تلفن"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    />
                                </div>
                                {!editing && (
                                    <div>
                                        <select
                                            value={data.parent_id}
                                            onChange={e => setData('parent_id', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                        >
                                            <option value="">بدون والد</option>
                                            {organizations.map(org => (
                                                <option key={org.id} value={org.id}>
                                                    {org.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="آدرس"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                                >
                                    {processing ? 'در حال ذخیره...' : 'ذخیره'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); reset(); setEditing(null); }}
                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded text-sm"
                                >
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* جدول */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">نام</th>
                                <th className="px-4 py-3 font-medium">کد</th>
                                <th className="px-4 py-3 font-medium">والد</th>
                                <th className="px-4 py-3 font-medium">واحدها</th>
                                <th className="px-4 py-3 font-medium">کاربران</th>
                                <th className="px-4 py-3 font-medium">وضعیت</th>
                                <th className="px-4 py-3 font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {organizations.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 text-gray-400">
                                        سازمانی وجود ندارد
                                    </td>
                                </tr>
                            ) : (
                                organizations.map(org => (
                                    <tr key={org.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {org.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                                            {org.code}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {org.parent?.name ?? '---'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {org.departments_count}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {org.users_count}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                org.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {org.status === 'active' ? 'فعال' : 'غیرفعال'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(org)}
                                                    className="text-yellow-600 hover:underline"
                                                >
                                                    ویرایش
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(org.id)}
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
            </div>
        </>
    );
}