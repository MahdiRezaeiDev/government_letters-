// resources/js/pages/archives/cases/show.tsx

import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowRight, FolderGit2, Calendar, FileText, 
    Plus, Trash2, Eye, Download, Pencil 
} from 'lucide-react';
import React, { useState } from 'react';
import type { Archive, Case, Letter } from '@/types';

interface Props {
    archive: Archive;
    case: Case & { letters: Letter[] };
    can: {
        edit: boolean;
        delete: boolean;
        attach_letter: boolean;
    };
}

export default function CasesShow({ archive, case: caseItem, can }: Props) {
    const [showAttachModal, setShowAttachModal] = useState(false);
    const [selectedLetterId, setSelectedLetterId] = useState<number | null>(null);
    const [availableLetters, setAvailableLetters] = useState<Letter[]>([]);

    // بارگذاری نامه‌های قابل الصاق
    const loadAvailableLetters = () => {
        router.get('/letters/available-for-case', 
            { case_id: caseItem.id, archive_id: archive.id },
            {
                preserveState: true,
                onSuccess: (page) => {
                    setAvailableLetters(page.props.letters as Letter[]);
                    setShowAttachModal(true);
                }
            }
        );
    };

    const handleAttachLetter = () => {
        if (selectedLetterId) {
            router.post(route('archives.cases.attach-letter', {
                archive: archive.id,
                case: caseItem.id
            }), { letter_id: selectedLetterId }, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAttachModal(false);
                    setSelectedLetterId(null);
                }
            });
        }
    };

    const handleDetachLetter = (letterId: number) => {
        if (confirm('آیا از جدا کردن این نامه از پرونده اطمینان دارید؟')) {
            router.delete(route('archives.cases.detach-letter', {
                archive: archive.id,
                case: caseItem.id,
                letter: letterId
            }));
        }
    };

    const handleDelete = () => {
        if (confirm(`آیا از حذف پرونده "${caseItem.title}" اطمینان دارید؟`)) {
            router.delete(route('archives.cases.destroy', {
                archive: archive.id,
                case: caseItem.id
            }));
        }
    };

    const getRetentionLabel = () => {
        if (!caseItem.retention_period) {
return 'دائمی';
}

        const units = { days: 'روز', months: 'ماه', years: 'سال' };

        return `${caseItem.retention_period} ${units[caseItem.retention_unit as keyof typeof units]}`;
    };

    const isExpired = caseItem.expiry_date && new Date(caseItem.expiry_date) < new Date();

    return (
        <>
            <Head title={caseItem.title} />

            <div className="max-w-5xl mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link
                                href={route('archives.cases.index', { archive: archive.id })}
                                className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                            >
                                <ArrowRight className="h-4 w-4" />
                                بازگشت به لیست پرونده‌ها
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                                <FolderGit2 className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{caseItem.title}</h1>
                                <p className="text-sm text-gray-500">شماره پرونده: {caseItem.case_number}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {can.edit && (
                            <Link
                                href={route('archives.cases.edit', { archive: archive.id, case: caseItem.id })}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                                <Pencil className="ml-2 h-4 w-4" />
                                ویرایش
                            </Link>
                        )}
                        {can.delete && (
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
                            >
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف
                            </button>
                        )}
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 rounded-lg p-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">تعداد نامه‌ها</p>
                                <p className="text-xl font-bold text-gray-900">{caseItem.letters?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-lg p-2">
                                <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">تاریخ ایجاد</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {new Date(caseItem.created_at).toLocaleDateString('fa-IR')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 rounded-lg p-2">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">دوره نگهداری</p>
                                <p className="text-sm font-medium text-gray-900">{getRetentionLabel()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className={`rounded-lg p-2 ${isExpired ? 'bg-red-100' : 'bg-green-100'}`}>
                                <Calendar className={`h-5 w-5 ${isExpired ? 'text-red-600' : 'text-green-600'}`} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">تاریخ انقضا</p>
                                <p className={`text-sm font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                                    {caseItem.expiry_date ? new Date(caseItem.expiry_date).toLocaleDateString('fa-IR') : '-'}
                                    {isExpired && ' (منقضی شده)'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {caseItem.description && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-900 mb-2">توضیحات</h3>
                        <p className="text-sm text-gray-600">{caseItem.description}</p>
                    </div>
                )}

                {/* Letters Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">نامه‌های موجود در پرونده</h3>
                        {can.attach_letter && (
                            <button
                                onClick={loadAvailableLetters}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                            >
                                <Plus className="ml-2 h-4 w-4" />
                                الصاق نامه
                            </button>
                        )}
                    </div>
                    
                    {caseItem.letters && caseItem.letters.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {caseItem.letters.map((letter) => (
                                <div key={letter.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                            <Link
                                                href={route('letters.show', { letter: letter.id })}
                                                className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                            >
                                                {letter.subject}
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                            <span>شماره: {letter.letter_number}</span>
                                            <span>تاریخ: {new Date(letter.date).toLocaleDateString('fa-IR')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={route('letters.show', { letter: letter.id })}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDetachLetter(letter.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center text-gray-500">
                            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p>هیچ نامه‌ای در این پرونده وجود ندارد</p>
                            {can.attach_letter && (
                                <button
                                    onClick={loadAvailableLetters}
                                    className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                >
                                    <Plus className="ml-2 h-4 w-4" />
                                    الصاق نامه
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Attach Letter Modal */}
            {showAttachModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">الصاق نامه به پرونده</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            نامه مورد نظر را انتخاب کنید
                        </p>
                        
                        <select
                            value={selectedLetterId || ''}
                            onChange={(e) => setSelectedLetterId(parseInt(e.target.value))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">انتخاب نامه...</option>
                            {availableLetters.map(letter => (
                                <option key={letter.id} value={letter.id}>
                                    {letter.letter_number} - {letter.subject}
                                </option>
                            ))}
                        </select>
                        
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAttachModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                لغوه
                            </button>
                            <button
                                onClick={handleAttachLetter}
                                disabled={!selectedLetterId}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                الصاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}