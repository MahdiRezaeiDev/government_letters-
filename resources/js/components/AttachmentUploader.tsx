import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';

interface Attachment {
    id: number; file_name: string; file_size: number; extension: string;
    uploader_name: string; created_at: string; download_count: number;
}

interface Props { letterId: number; attachments: Attachment[]; uploadUrl: string; }

function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function fileIcon(ext: string): string {
    const icons: Record<string, string> = { pdf: '📄', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊', jpg: '🖼️', jpeg: '🖼️', png: '🖼️' };
    return icons[ext.toLowerCase()] ?? '📎';
}

export default function AttachmentUploader({ letterId, attachments, uploadUrl }: Props) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading,  setUploading]  = useState(false);

    function handleFiles(files: FileList) {
        if (!files.length) return;
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('files[]', file));
        setUploading(true);
        router.post(uploadUrl, formData, { forceFormData: true, onFinish: () => setUploading(false) });
    }

    function handleDelete(attachmentId: number) {
        if (confirm('فایل حذف شود؟')) router.delete(`/attachments/${attachmentId}`);
    }

    return (
        <div className="space-y-4">
            <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}>
                <input ref={fileInputRef} type="file" multiple className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={e => e.target.files && handleFiles(e.target.files)} />
                {uploading ? (
                    <p className="text-sm text-blue-600">در حال آپلود...</p>
                ) : (
                    <>
                        <p className="text-sm text-gray-500">فایل‌ها را اینجا بکشید یا کلیک کنید</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, تصویر — حداکثر ۱۰ مگابایت</p>
                    </>
                )}
            </div>
            {attachments.length > 0 && (
                <div className="space-y-2">
                    {attachments.map(att => (
                        <div key={att.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{fileIcon(att.extension)}</span>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{att.file_name}</p>
                                    <p className="text-xs text-gray-400">{formatSize(att.file_size)} · {att.uploader_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <a href={`/attachments/${att.id}/download`} className="text-xs text-blue-600 hover:underline">
                                    دانلود ({att.download_count})
                                </a>
                                <button onClick={() => handleDelete(att.id)} className="text-xs text-red-500 hover:underline">حذف</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
