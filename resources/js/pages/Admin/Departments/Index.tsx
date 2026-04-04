import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { useState } from 'react';
import * as depts from '@/routes/admin/departments';

interface Department {
    id: number; name: string; code: string | null; level: number;
    status: 'active' | 'inactive'; positions_count: number;
    parent: { id: number; name: string } | null;
}

interface Props { departments: Department[]; }

export default function DepartmentsIndex({ departments }: Props) {

    const [showForm, setShowForm] = useState(false);
    const [editing,  setEditing]  = useState<Department | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '', code: '', parent_id: '', status: 'active' as 'active' | 'inactive',
    });

    function handleEdit(dept: Department) {
        setEditing(dept);
        setData({ name: dept.name, code: dept.code ?? '', parent_id: dept.parent?.id.toString() ?? '', status: dept.status });
        setShowForm(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            put(depts.update(editing.id).url, { onSuccess: () => { setShowForm(false); reset(); setEditing(null); } });
        } else {
            post(depts.store().url, { onSuccess: () => { setShowForm(false); reset(); } });
        }
    }

    function handleDelete(id: number) {
        if (confirm('واحد حذف شود؟')) router.delete(depts.destroy(id).url);
    }

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'واحدها', href: depts.index().url }]}>
            <Head title="واحدها" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-800">واحدهای سازمانی ({departments.length})</h2>
                    <button onClick={() => { setEditing(null); reset(); setShowForm(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">+ واحد جدید</button>
                </div>

                {showForm && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-700">{editing ? 'ویرایش واحد' : 'واحد جدید'}</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <input type="text" placeholder="نام واحد *" value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <input type="text" placeholder="کد" value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                                </div>
                                {!editing && (
                                    <div>
                                        <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                            <option value="">بدون والد</option>
                                            {departments.map(d => <option key={d.id} value={d.id}>{'—'.repeat(d.level)} {d.name}</option>)}
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <select value={data.status} onChange={e => setData('status', e.target.value as 'active' | 'inactive')}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                        <option value="active">فعال</option>
                                        <option value="inactive">غیرفعال</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                                    {processing ? 'در حال ذخیره...' : 'ذخیره'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); reset(); setEditing(null); }}
                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded text-sm">انصراف</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">نام</th>
                                <th className="px-4 py-3 font-medium">والد</th>
                                <th className="px-4 py-3 font-medium">کد</th>
                                <th className="px-4 py-3 font-medium">سمت‌ها</th>
                                <th className="px-4 py-3 font-medium">وضعیت</th>
                                <th className="px-4 py-3 font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {departments.map(dept => (
                                <tr key={dept.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {'　'.repeat(dept.level)}{dept.level > 0 && '└ '}{dept.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{dept.parent?.name ?? '---'}</td>
                                    <td className="px-4 py-3 text-gray-400">{dept.code ?? '---'}</td>
                                    <td className="px-4 py-3 text-gray-500">{dept.positions_count}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${dept.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {dept.status === 'active' ? 'فعال' : 'غیرفعال'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-3">
                                            <button onClick={() => handleEdit(dept)} className="text-yellow-600 hover:underline">ویرایش</button>
                                            <button onClick={() => handleDelete(dept.id)} className="text-red-600 hover:underline">حذف</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
