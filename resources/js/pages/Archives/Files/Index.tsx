import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import * as archives from '@/routes/archives';

interface Letter {
    id:           number;
    subject:      string;
    letter_number: string | null;
    date:         string;
}

interface File {
    id:              number;
    name:            string;
    code:            string | null;
    description:     string | null;
    letters_count:   number;
    expiry_date:     string | null;
    letters:         Letter[];
}

interface Archive {
    id:   number;
    name: string;
}

interface Props {
    archive: Archive;
    files:   File[];
}

export default function Index({ archive, files }: Props) {

    const [showForm,    setShowForm]    = useState(false);
    const [activeFile,  setActiveFile]  = useState<File | null>(null);
    const [letterQuery, setLetterQuery] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name:             '',
        code:             '',
        description:      '',
        retention_period: '',
        retention_unit:   'years' as 'days' | 'months' | 'years',
    });

    const attachForm = useForm({ letter_id: '' });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/archives/${archive.id}/files`, {
            onSuccess: () => { setShowForm(false); reset(); }
        });
    }

    function handleAttach(fileId: number) {
        if (!attachForm.data.letter_id) return;
        
        attachForm.post(`/files/${fileId}/letters`, {
            onSuccess: () => { attachForm.reset(); }
        });
    }

    function handleDetach(fileId: number, letterId: number) {
        if (confirm('نامه از پرونده جدا شود؟')) {
            router.delete(`/files/${fileId}/letters/${letterId}`);
        }
    }

    return (
        <>
            <Head title={`پرونده‌های ${archive.name}`} />

            <div className="p-6">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-800">
                        پرونده‌های {archive.name}
                    </h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                        + پرونده جدید
                    </button>
                </div>

                {/* فرم پرونده جدید */}
                {showForm && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="نام پرونده *"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="کد پرونده (اختیاری)"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        type="number"
                                        placeholder="مدت نگهداری (اختیاری)"
                                        value={data.retention_period}
                                        onChange={e => setData('retention_period', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={data.retention_unit}
                                        onChange={e => setData('retention_unit', e.target.value as typeof data.retention_unit)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                    >
                                        <option value="days">روز</option>
                                        <option value="months">ماه</option>
                                        <option value="years">سال</option>
                                    </select>
                                </div>
                            </div>
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

                {/* لیست پرونده‌ها */}
                <div className="space-y-4">
                    {files.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            پرونده‌ای وجود ندارد
                        </div>
                    ) : (
                        files.map(file => (
                            <div key={file.id} className="bg-white rounded-lg shadow">

                                {/* هدر پرونده */}
                                <div
                                    className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                    onClick={() => setActiveFile(activeFile?.id === file.id ? null : file)}
                                >
                                    <div>
                                        <h3 className="font-medium text-gray-800">
                                            {file.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {file.letters_count} نامه
                                            {file.expiry_date && ` · انقضا: ${file.expiry_date}`}
                                        </p>
                                    </div>
                                    <span className="text-gray-400 text-sm">
                                        {activeFile?.id === file.id ? '▲' : '▼'}
                                    </span>
                                </div>

                                {/* محتوای پرونده */}
                                {activeFile?.id === file.id && (
                                    <div className="px-6 pb-4 border-t">

                                        {/* الصاق نامه جدید */}
                                        <div className="flex gap-2 mt-4 mb-4">
                                            <input
                                                type="number"
                                                placeholder="شماره ID نامه..."
                                                value={attachForm.data.letter_id}
                                                onChange={e => attachForm.setData('letter_id', e.target.value)}
                                                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                            />
                                            <button
                                                onClick={() => handleAttach(file.id)}
                                                disabled={attachForm.processing}
                                                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                                            >
                                                الصاق نامه
                                            </button>
                                        </div>

                                        {/* نامه‌های الصاق شده */}
                                        {file.letters?.length > 0 ? (
                                            <div className="space-y-2">
                                                {file.letters.map(letter => (
                                                    <div
                                                        key={letter.id}
                                                        className="flex justify-between items-center bg-gray-50 rounded px-3 py-2"
                                                    >
                                                        <div>
                                                            <p className="text-sm text-gray-700">
                                                                {letter.subject}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                {letter.letter_number ?? '---'} · {letter.date}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDetach(file.id, letter.id)}
                                                            className="text-xs text-red-500 hover:underline"
                                                        >
                                                            جدا کن
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 text-center py-4">
                                                نامه‌ای الصاق نشده
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}