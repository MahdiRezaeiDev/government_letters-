import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Plus, Save, Shield, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface Position {
    id: number;
    name: string;
}

interface ArchivePermissionRow {
    id?: number;
    position_id: number;
    permission_type: string;
    position?: Position;
}

interface Props {
    archive: {
        id: number;
        name: string;
        code?: string;
    };
    permissions: ArchivePermissionRow[];
    positions: Position[];
    permissionTypes: Record<string, string>;
}

export default function ArchivePermissionsPage({
    archive,
    permissions,
    positions,
    permissionTypes,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        permissions: permissions.map((p) => ({
            position_id: p.position_id,
            permission_type: p.permission_type,
        })),
    });

    const positionName = useMemo(() => {
        const map = new Map(positions.map((p) => [p.id, p.name]));
        return (id: number) => map.get(id) || `#${id}`;
    }, [positions]);

    const addRow = () => {
        const firstPosition = positions[0];
        if (!firstPosition) {
            return;
        }

        setData('permissions', [
            ...data.permissions,
            {
                position_id: firstPosition.id,
                permission_type: 'read',
            },
        ]);
    };

    const removeRow = (index: number) => {
        setData(
            'permissions',
            data.permissions.filter((_, i) => i !== index),
        );
    };

    const updateRow = (
        index: number,
        key: 'position_id' | 'permission_type',
        value: string | number,
    ) => {
        const next = data.permissions.map((row, i) =>
            i === index ? { ...row, [key]: value } : row,
        );
        setData('permissions', next);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/archives/${archive.id}/permissions`, { preserveScroll: true });
    };

    return (
        <>
            <Head title={`دسترسی‌های بایگانی - ${archive.name}`} />

            <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <Link
                            href="/archives"
                            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2"
                        >
                            <ArrowRight className="h-4 w-4" />
                            بازگشت به بایگانی
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Shield className="h-6 w-6 text-indigo-600" />
                            دسترسی‌های بایگانی
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {archive.name}
                            {archive.code ? ` (${archive.code})` : ''}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={addRow}
                        disabled={positions.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                        افزودن دسترسی
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-4 py-3 text-right font-semibold">بست کاری</th>
                                    <th className="px-4 py-3 text-right font-semibold">نوع دسترسی</th>
                                    <th className="px-4 py-3 text-center font-semibold w-24">حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.permissions.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-10 text-center text-slate-400"
                                        >
                                            هنوز دسترسی‌ای تعریف نشده است.
                                        </td>
                                    </tr>
                                ) : (
                                    data.permissions.map((row, index) => (
                                        <tr key={index} className="border-t border-slate-100">
                                            <td className="px-4 py-3">
                                                <select
                                                    value={row.position_id}
                                                    onChange={(e) =>
                                                        updateRow(
                                                            index,
                                                            'position_id',
                                                            Number(e.target.value),
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                                                >
                                                    {positions.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {positionName(row.position_id)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={row.permission_type}
                                                    onChange={(e) =>
                                                        updateRow(
                                                            index,
                                                            'permission_type',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                                                >
                                                    {Object.entries(permissionTypes).map(
                                                        ([value, label]) => (
                                                            <option key={value} value={value}>
                                                                {label}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(index)}
                                                    className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-rose-600 hover:bg-rose-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {errors.permissions && (
                        <p className="px-4 py-2 text-sm text-rose-600">{errors.permissions}</p>
                    )}

                    <div className="px-4 py-4 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'در حال ذخیره...' : 'ذخیره دسترسی‌ها'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
