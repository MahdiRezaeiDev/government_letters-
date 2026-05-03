import { useState, useEffect } from "react";
import type { Attachment } from "@/types";

const isImage = (mime?: string, name?: string): boolean => {
    if (mime?.startsWith('image/')) {
        return true;
    }

    const ext = name?.split('.').pop()?.toLowerCase();

    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
};

const isPdf = (mime?: string, name?: string): boolean => {
    if (mime === 'application/pdf') {
        return true;
    }

    return name?.toLowerCase().endsWith('.pdf') || false;
};

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

// ─── Attachment Preview Modal (Fullscreen) ─────────────────────────────────
export default function AttachmentPreviewModal({ att, onClose }: { att: Attachment; onClose: () => void }) {
    const [zoom, setZoom] = useState(100);
    const [rotate, setRotate] = useState(0);
    const [loading2, setLoading2] = useState(true);
    const previewUrl = `/attachments/${att.id}/preview`;
    const downloadUrl = getDownloadUrl(att.id);
    const canPreview = isImage(att.mime_type, att.file_name) || isPdf(att.mime_type, att.file_name);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case '+':
                case '=':
                    if (canPreview) {
                        setZoom(z => Math.min(300, z + 25));
                    }

                    break;
                case '-':
                    if (canPreview) {
                        setZoom(z => Math.max(25, z - 25));
                    }

                    break;
                case '0':
                    if (canPreview) {
                        setZoom(100);
                        setRotate(0);
                    }

                    break;
                case 'r':
                case 'R':
                    if (isImage(att.mime_type, att.file_name)) {
                        setRotate(r => (r + 90) % 360);
                    }

                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose, canPreview, att.mime_type, att.file_name]);

    // Reset loading state when attachment changes
    useEffect(() => {
        setLoading2(true);
    }, [att.id]);

    const handleImageLoad = () => {
        setLoading2(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0f]" onClick={onClose}>
            {/* ── Top Navigation Bar ── */}
            <div
                className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0f0f15]/95 backdrop-blur-xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Left: File Info */}
                <div className="flex items-center gap-4 min-w-0">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                            {isImage(att.mime_type, att.file_name) ? (
                                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            ) : isPdf(att.mime_type, att.file_name) ? (
                                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            )}
                        </div>
                        {/* File type badge */}
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-[9px] font-bold text-white/80 uppercase border border-white/10">
                            {att.file_name?.split('.').pop() || 'FILE'}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-white truncate max-w-md">
                            {att.file_name}
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-white/40">{formatSize(att.file_size)}</span>
                            <span className="text-white/20">•</span>
                            <span className="text-xs text-white/40">
                                {att.mime_type || 'نوع نامشخص'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center: View Controls */}
                {isImage(att.mime_type, att.file_name) && (
                    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 backdrop-blur-sm">
                        <button
                            onClick={() => setZoom(z => Math.max(25, z - 25))}
                            disabled={zoom <= 25}
                            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            title="کوچک‌نمایی (-)"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>

                        <button
                            onClick={() => {
                                setZoom(100); setRotate(0);
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition min-w-[50px]"
                        >
                            {zoom}%
                        </button>

                        <button
                            onClick={() => setZoom(z => Math.min(300, z + 25))}
                            disabled={zoom >= 300}
                            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            title="بزرگ‌نمایی (+)"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>

                        <div className="w-px h-6 bg-white/10 mx-1" />

                        <button
                            onClick={() => setRotate(r => (r + 90) % 360)}
                            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
                            title="چرخش (R)"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>

                        <button
                            onClick={() => {
                                setZoom(100); setRotate(0);
                            }}
                            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
                            title="ریست (0)"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </button>
                    </div>
                )}

                {isPdf(att.mime_type, att.file_name) && (
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-xs text-white/50">PDF</span>
                    </div>
                )}

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition"
                        title="باز کردن در تب جدید"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="hidden sm:inline">تب جدید</span>
                    </a>

                    <a
                        href={downloadUrl}
                        download
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-lg shadow-blue-600/25"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        دانلود
                    </a>

                    <button
                        onClick={onClose}
                        className="flex items-center justify-center h-10 w-10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition ml-2"
                        title="بستن (Esc)"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── Main Content Area ── */}
            <div
                className="flex-1 overflow-auto flex items-center justify-center p-8"
                onClick={e => e.stopPropagation()}
            >
                {/* Image Preview */}
                {isImage(att.mime_type, att.file_name) && (
                    <div className="relative flex items-center justify-center">
                        {loading2 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <svg className="animate-spin h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <span className="text-sm text-white/40">در حال بارگذاری...</span>
                                </div>
                            </div>
                        )}

                        <img
                            src={previewUrl}
                            alt={att.file_name}
                            onLoad={handleImageLoad}
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '85vh',
                                transform: `scale(${zoom / 100}) rotate(${rotate}deg)`,
                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                opacity: loading2 ? 0 : 1,
                            }}
                            className={`
                                rounded-2xl shadow-2xl shadow-black/50
                                ${loading2 ? 'scale-95' : 'scale-100'}
                                transition-all duration-500
                            `}
                        />
                    </div>
                )}

                {/* PDF Preview */}
                {isPdf(att.mime_type, att.file_name) && (
                    <div className="w-full h-full flex flex-col" style={{ maxWidth: '1200px' }}>
                        {loading2 && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="flex flex-col items-center gap-3 bg-[#0f0f15]/90 backdrop-blur-sm rounded-2xl p-8">
                                    <svg className="animate-spin h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <span className="text-sm text-white/40">در حال بارگذاری PDF...</span>
                                </div>
                            </div>
                        )}

                        <iframe
                            src={`${previewUrl}#view=FitH&toolbar=0&navpanes=0`}
                            title={att.file_name}
                            onLoad={() => setLoading2(false)}
                            className="flex-1 w-full rounded-2xl shadow-2xl shadow-black/50 bg-white"
                            style={{
                                border: 'none',
                                minHeight: '80vh',
                                transition: 'opacity 0.5s',
                                opacity: loading2 ? 0 : 1
                            }}
                        />
                    </div>
                )}

                {/* Unsupported File */}
                {!isImage(att.mime_type, att.file_name) && !isPdf(att.mime_type, att.file_name) && (
                    <div className="flex flex-col items-center gap-6 text-center p-12">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                <svg className="h-16 w-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="absolute -top-3 -right-3 h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center backdrop-blur-sm">
                                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">پیش‌نمایش در دسترس نیست</h3>
                            <p className="text-white/40 text-sm max-w-md">
                                این نوع فایل قابل نمایش در مرورگر نیست.
                                لطفاً فایل را دانلود کنید.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href={downloadUrl}
                                download
                                className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                دانلود فایل
                            </a>

                            <button
                                onClick={onClose}
                                className="px-6 py-3 text-sm font-semibold text-white/40 hover:text-white/70 hover:bg-white/5 rounded-2xl transition"
                            >
                                بستن
                            </button>
                        </div>

                        {/* File Info */}
                        <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 max-w-xs w-full">
                            <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                                <span>نام فایل</span>
                                <span className="text-white/60">{att.file_name}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-white/40">
                                <span>حجم</span>
                                <span className="text-white/60">{formatSize(att.file_size)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Bottom Info Bar ── */}
            <div
                className="flex-shrink-0 flex items-center justify-center py-2 px-6 border-t border-white/5 bg-[#0f0f15]/95 backdrop-blur-xl"
                onClick={e => e.stopPropagation()}
            >
                <p className="text-xs text-white/20 flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/30">Esc</kbd>
                    <span>بستن</span>
                    {isImage(att.mime_type, att.file_name) && (
                        <>
                            <span className="text-white/10">|</span>
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/30">+/-</kbd>
                            <span>بزرگنمایی</span>
                            <span className="text-white/10">|</span>
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/30">R</kbd>
                            <span>چرخش</span>
                            <span className="text-white/10">|</span>
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/30">0</kbd>
                            <span>ریست</span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}