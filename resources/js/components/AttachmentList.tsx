import { Download, FileText, Paperclip } from "lucide-react";
import type { Attachment } from "@/types";


const formatSize = (bytes: number): string => {
    if (bytes === 0) {
        return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getDownloadUrl = (id: number) => `/attachments/${id}/download`;

export default function AttachmentList({ attachments, onPreview }: {
    attachments: Attachment[];
    onPreview: (att: Attachment) => void;
}) {
    if (!attachments?.length) {
        return null;
    }

    return (
        <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
                <Paperclip className="h-4 w-4 text-gray-400" />
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">پیوست‌ها</h4>
                <span className="text-xs text-gray-400">({attachments.length})</span>
            </div>

            <div className="space-y-2">
                {attachments.map((att) => (
                    <div
                        key={att.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group cursor-pointer"
                        onClick={() => onPreview(att)}
                    >
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate">{att.file_name}</p>
                            <p className="text-[10px] text-gray-400">{formatSize(att.file_size)}</p>
                        </div>
                        <a
                            href={getDownloadUrl(att.id)}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-gray-300 group-hover:text-blue-600 group-hover:bg-blue-100 transition opacity-0 group-hover:opacity-100"
                        >
                            <Download className="h-3.5 w-3.5" />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}