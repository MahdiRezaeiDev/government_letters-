import { useRef, useState } from 'react';

export interface TempFile {
    temp_id: string; file_name: string; file_size: number; extension: string; mime_type: string;
}

interface Props { value: TempFile[]; onChange: (files: TempFile[]) => void; }

function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function fileIcon(ext: string): string {
    const icons: Record<string, string> = { pdf: '📄', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊', jpg: '🖼️', jpeg: '🖼️', png: '🖼️' };
    return icons[ext.toLowerCase()] ?? '📎';
}

function getCsrfToken(): string {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

export default function TempFileUploader({ value, onChange }: Props) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading,  setUploading]  = useState(false);
    const [error,      setError]      = useState('');

    async function uploadFile(file: File): Promise<TempFile> {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/temp-upload', {
            method: 'POST', headers: { 'X-CSRF-TOKEN': getCsrfToken() }, body: formData,
        });
        if (!res.ok) { const d = await res.json(); throw new Error(d.message ?? 'خطا در آپلود'); }
        return await res.json();
    }

    async function handleFiles(files: FileList) {
        if (!files.length) return;
        setError(''); setUploading(true);
        const newFiles: TempFile[] = [];
        for (const file of Array.from(files)) {
            try { newFiles.push(await uploadFile(file)); } catch (e: any) { setError(e.message); }
        }
        onChange([...value, ...newFiles]);
        setUploading(false);
    }

    async function handleRemove(tempId: string) {
        await fetch('/temp-upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCsrfToken() },
            body: JSON.stringify({ temp_id: tempId }),
        });
        onChange(value.filter(f => f.temp_id !== tempId));
    }

    return (
        <div className="space-y-3">
            <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}>
                <input ref={fileInputRef} type="file" multiple className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={e => e.target.files && handleFiles(e.target.files)} />
                {uploading ? (
                    <p className="text-sm text-blue-600">در حال آپلود...</p>
                ) : (
                    <>
                        <p className="text-sm text-gray-500">فایل‌ها را اینجا بکشید یا کلیک کنید</p>
                        <p className="text-xs text-gray-400 mt-1">PDF، Word، Excel، تصویر — حداکثر ۱۰ مگابایت</p>
                    </>
                )}
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            {value.length > 0 && (
                <div className="space-y-2">
                    {value.map(file => (
                        <div key={file.temp_id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{fileIcon(file.extension)}</span>
                                <div>
                                    <p className="text-sm text-gray-700">{file.file_name}</p>
                                    <p className="text-xs text-gray-400">{formatSize(file.file_size)}</p>
                                </div>
                            </div>
                            <button type="button" onClick={() => handleRemove(file.temp_id)} className="text-red-500 hover:text-red-700 text-xs">حذف</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
