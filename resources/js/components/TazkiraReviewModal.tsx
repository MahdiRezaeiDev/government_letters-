// resources/js/components/TazkiraReviewModal.tsx

import { router } from '@inertiajs/react';
import { X, CheckCircle, XCircle, Upload, Paperclip, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    tazkiraId: number;
    tazkiraName: string;
    action: 'approve' | 'reject';
}

export function TazkiraReviewModal({ isOpen, onClose, tazkiraId, tazkiraName, action }: Props) {
    const [note, setNote] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const isApprove = action === 'approve';

    const handleSubmit = async () => {
        if (!isApprove && !note.trim()) {
            alert('لطفاً دلیل رد را وارد کنید');

            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('note', note);

        for (let i = 0; i < files.length; i++) {
            formData.append('attachments[]', files[i]);
        }

        if (isApprove) {
            router.post(`/tazkira/${tazkiraId}/approve`, formData, {
                onFinish: () => {
                    setUploading(false);
                    onClose();
                },
            });
        } else {
            router.post(`/tazkira/${tazkiraId}/reject`, formData, {
                onFinish: () => {
                    setUploading(false);
                    onClose();
                },
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        {isApprove ? (
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                        ) : (
                            <XCircle className="h-6 w-6 text-red-600" />
                        )}
                        <h3 className="text-lg font-bold text-gray-900">
                            {isApprove ? 'تأیید تذکره' : 'رد تذکره'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">{tazkiraName}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isApprove ? 'یادداشت (اختیاری)' : 'دلیل رد (الزامی)'}
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder={isApprove ? 'یادداشت خود را وارد کنید...' : 'لطفاً دلیل رد تذکره را وارد کنید...'}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ضمیمه‌ها (اختیاری)
                        </label>
                        <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors">
                            <Upload className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">آپلود فایل</span>
                            <input type="file" multiple className="hidden" onChange={handleFileChange} />
                        </label>

                        {files.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Paperclip className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600 truncate">{file.name}</span>
                                        </div>
                                        <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {!isApprove && !note.trim() && (
                        <div className="bg-red-50 border-r-4 border-r-red-500 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <p className="text-sm text-red-700">وارد کردن دلیل رد الزامی است</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 p-4 border-t bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={handleSubmit}
                        disabled={uploading || (!isApprove && !note.trim())}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all"
                    >
                        {isApprove ? 'تأیید تذکره' : 'رد تذکره'}
                    </button>
                    <button onClick={onClose} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
                        انصراف
                    </button>
                </div>
            </div>
        </div>
    );
}