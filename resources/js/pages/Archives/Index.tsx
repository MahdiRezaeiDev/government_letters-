import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import * as archives from '@/routes/archives';

interface Archive {
    id:          number;
    name:        string;
    code:        string | null;
    description: string | null;
    is_active:   boolean;
    files_count: number;
    parent:      { id: number; name: string } | null;
}

interface Props {
    archives: Archive[];
}

export default function Index({ archives: data }: Props) {

    const [showForm, setShowForm] = useState(false);

    const { data: form, setData, post, processing, errors, reset } = useForm({
        name:        '',
        code:        '',
        parent_id:   '',
        description: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(archives.store().url, {
            onSuccess: () => { setShowForm(false); reset(); }
        });
    }

    function handleDelete(id: number) {
        if (confirm('بایگانی حذف شود؟')) {
            router.delete(archives.destroy(id).url);
        }
    }

    return (
        <>
            <Head title="بایگانی" />

            <div className="p-6">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-800">
                        بایگانی ({data.length})
                    </h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                        + بایگانی جدید
                    </button>
                </div>

                {/* فرم */}
                {showForm && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="نام بایگانی *"
                                        value={form.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="کد (اختیاری)"
                                        value={form.code}
                                        onChange={e => setData('code', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={form.parent_id}
                                        onChange={e => setData('parent_id', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    >
                                        <option value="">بدون والد</option>
                                        {data.map(archive => (
                                            <option key={archive.id} value={archive.id}>
                                                {archive.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <textarea
                                placeholder="توضیحات (اختیاری)"
                                value={form.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={2}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                                >
                                    {processing ? 'در حال ذخیره...' : 'ذخیره'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); reset(); }}
                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded text-sm"
                                >
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* کارت‌های بایگانی */}
                <div className="grid grid-cols-3 gap-4">
                    {data.length === 0 ? (
                        <div className="col-span-3 text-center py-12 text-gray-400">
                            بایگانی‌ای وجود ندارد
                        </div>
                    ) : (
                        data.map(archive => (
                            <div
                                key={archive.id}
                                className="bg-white rounded-lg shadow p-4 border hover:border-blue-300 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-medium text-gray-800">
                                            {archive.name}
                                        </h3>
                                        {archive.parent && (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                زیر: {archive.parent.name}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        archive.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {archive.is_active ? 'فعال' : 'غیرفعال'}
                                    </span>
                                </div>

                                {archive.description && (
                                    <p className="text-xs text-gray-500 mb-3">
                                        {archive.description}
                                    </p>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">
                                        {archive.files_count} پرونده
                                    </span>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/archives/${archive.id}/files`}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            پرونده‌ها
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(archive.id)}
                                            className="text-xs text-red-500 hover:underline"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}