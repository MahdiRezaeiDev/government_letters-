import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { useState } from 'react';
import * as positions from '@/routes/admin/positions';

interface Department { id: number; name: string; }
interface Position {
    id: number; name: string; code: string | null; level: number;
    is_management: boolean; user_positions_count: number;
    department: { id: number; name: string };
}

interface Props { positions: Position[]; departments: Department[]; }

export default function PositionsIndex({ positions: data, departments }: Props) {

    const [showForm, setShowForm] = useState(false);
    const [editing,  setEditing]  = useState<Position | null>(null);

    const { data: form, setData, post, put, processing, errors, reset } = useForm({
        department_id: '', name: '', code: '', level: '3', is_management: false, description: '',
    });

    function handleEdit(pos: Position) {
        setEditing(pos);
        setData({ department_id: pos.department.id.toString(), name: pos.name, code: pos.code ?? '', level: pos.level.toString(), is_management: pos.is_management, description: '' });
        setShowForm(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            put(positions.update(editing.id).url, { onSuccess: () => { setShowForm(false); reset(); setEditing(null); } });
        } else {
            post(positions.store().url, { onSuccess: () => { setShowForm(false); reset(); } });
        }
    }

    function handleDelete(id: number) {
        if (confirm('سمت حذف شود؟')) router.delete(positions.destroy(id).url);
    }

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'سمت‌ها', href: positions.index().url }]}>
            <Head title="سمت‌ها" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-800">سمت‌ها ({data.length})</h2>
                    <button onClick={() => { setEditing(null); reset(); setShowForm(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">+ سمت جدید</button>
                </div>

                {showForm && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-700">{editing ? 'ویرایش سمت' : 'سمت جدید'}</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <select value={form.department_id} onChange={e => setData('department_id', e.target.value)}
                                        disabled={!!editing} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                        <option value="">واحد سازمانی *</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                    {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id}</p>}
                                </div>
                                <div>
                                    <input type="text" placeholder="نام سمت *" value={form.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <select value={form.level} onChange={e => setData('level', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                        {[1,2,3,4,5].map(l => <option key={l} value={l}>سطح {l}</option>)}
                                    </select>
                                </div>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input type="checkbox" checked={form.is_management} onChange={e => setData('is_management', e.target.checked)} />
                                سمت مدیریتی
                            </label>
                            <div className="flex gap-2">
                                <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                                    {processing ? 'در حال ذخیره...' : 'ذخیره'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); reset(); }}
                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded text-sm">انصراف</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">نام سمت</th>
                                <th className="px-4 py-3 font-medium">واحد</th>
                                <th className="px-4 py-3 font-medium">سطح</th>
                                <th className="px-4 py-3 font-medium">مدیریتی</th>
                                <th className="px-4 py-3 font-medium">کاربران</th>
                                <th className="px-4 py-3 font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map(pos => (
                                <tr key={pos.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800">{pos.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{pos.department.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{pos.level}</td>
                                    <td className="px-4 py-3">
                                        {pos.is_management ? <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">مدیریتی</span> : '---'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{pos.user_positions_count}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-3">
                                            <button onClick={() => handleEdit(pos)} className="text-yellow-600 hover:underline">ویرایش</button>
                                            <button onClick={() => handleDelete(pos.id)} className="text-red-600 hover:underline">حذف</button>
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
