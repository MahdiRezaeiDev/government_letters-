// resources/js/components/TazkiraAttachments.tsx

import { router } from '@inertiajs/react';
import { Upload, X, Paperclip, Image, File, Download, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

interface Attachment {
    id: number;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    description: string | null;
    uploaded_by?: { full_name: string };
    created_at: string;
    file_url: string;
}

interface Props {
    tazkiraId: number;
    attachments: Attachment[];
    canUpload?: boolean;
    canDelete?: boolean;
}

export function TazkiraAttachments({ tazkiraId, attachments: initialAttachments, canUpload, canDelete }: Props) {
    const [attachments, setAttachments] = useState(initialAttachments);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [description, setDescription] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) {
            return;
        }

        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('attachments[]', files[i]);
        }

        formData.append('description', description);

        setUploading(true);
        setUploadProgress(0);

        try {
            const response = await fetch(`/tazkira/${tazkiraId}/attachments`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();

            if (result.success) {
                setAttachments([...attachments, ...result.attachments]);
                setDescription('');
                e.target.value = '';
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (attachmentId: number) => {
        if (!confirm('آیا از حذف این فایل اطمینان دارید؟')) {
            return;
        }

        try {
            const response = await fetch(`/tazkira/attachments/${attachmentId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setAttachments(attachments.filter(a => a.id !== attachmentId));
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const getFileIcon = (fileType: string) => {
        if (fileType?.startsWith('image/')) {
            return <Image className="h-5 w-5 text-blue-500" />;
        }

        return <Paperclip className="h-5 w-5 text-gray-500" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) {
            return bytes + ' B';
        }

        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        }

        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                ضمیمه‌ها
                <span className="text-xs text-gray-500">({attachments.length})</span>
            </h3>

            {/* آپلود فایل */}
            {canUpload && (
                <div className="mb-4">
                    <div className="flex gap-3">
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                            <Upload className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">انتخاب فایل</span>
                            <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="توضیحات (اختیاری)"
                        className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                    {uploading && (
                        <div className="mt-2">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">در حال آپلود...</p>
                        </div>
                    )}
                </div>
            )}

            {/* لیست ضمیمه‌ها */}
            <div className="space-y-2">
                {attachments.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">هیچ ضمیمه‌ای وجود ندارد</p>
                ) : (
                    attachments.map(att => (
                        <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {getFileIcon(att.file_type)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{att.file_name}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span>{formatFileSize(att.file_size)}</span>
                                        {att.description && <span>• {att.description}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href={att.file_url} download target="_blank" className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-lg">
                                    <Download className="h-4 w-4" />
                                </a>
                                {canDelete && (
                                    <button onClick={() => handleDelete(att.id)} className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}