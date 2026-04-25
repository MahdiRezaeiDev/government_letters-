// resources/js/pages/letters/create.tsx

import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Save, Send, Trash2, ChevronDown, FileText,
    Paperclip, Loader2
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import PersianDatePicker from '@/components/PersianDatePicker';
import { store as LetterCreate } from '@/routes/letters';
import type { LetterCategory, Organization } from '@/types';

interface Props {
    categories: LetterCategory[];
    departments: { id: number; name: string }[];
    positions: { id: number; name: string; department_id: number }[];
    externalOrganizations?: Organization[];
    securityLevels: Record<string, string>;
    priorityLevels: Record<string, string>;
}

interface FormData {
    category_id: number | null;
    subject: string;
    summary: string;
    content: string;
    security_level: string;
    priority: string;
    date: string;
    recipient_type: 'internal' | 'external';
    recipient_department_id: number | null;
    recipient_position_id: number | null;
    recipient_name: string;
    recipient_position_name: string;
    external_organization_id: number | null;
    external_department_id: number | null;
    external_position_id: number | null;
    instruction: string;
    attachments?: File[];
}

export default function LettersCreate({
    categories, departments, positions, externalOrganizations = [],
    securityLevels, priorityLevels
}: Props) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        category_id: null,
        subject: '',
        summary: '',
        content: '',
        security_level: 'internal',
        priority: 'normal',
        date: new Date().toISOString().split('T')[0],
        recipient_type: 'internal',
        recipient_department_id: null,
        recipient_position_id: null,
        recipient_name: '',
        recipient_position_name: '',
        external_organization_id: null,
        external_department_id: null,
        external_position_id: null,
        instruction: '',
        attachments: [],
    });

    const [selectedDept, setSelectedDept] = useState<number | null>(null);
    const [availablePositions, setAvailablePositions] = useState<{ id: number; name: string }[]>([]);
    const [selectedExtOrg, setSelectedExtOrg] = useState<number | null>(null);
    const [selectedExtDept, setSelectedExtDept] = useState<number | null>(null);
    const [extDepartments, setExtDepartments] = useState<{ id: number; name: string }[]>([]);
    const [extPositions, setExtPositions] = useState<{ id: number; name: string }[]>([]);

    const [loadingPositions, setLoadingPositions] = useState(false);
    const [loadingExtDepts, setLoadingExtDepts] = useState(false);
    const [loadingExtPositions, setLoadingExtPositions] = useState(false);

    useEffect(() => {
        if (selectedDept) {
            setLoadingPositions(true);
            setTimeout(() => {
                setAvailablePositions(positions.filter(p => p.department_id === selectedDept));
                setLoadingPositions(false);
            }, 200);
        } else {
            setAvailablePositions([]);
        }
    }, [selectedDept, positions]);

    useEffect(() => {
        if (selectedExtOrg) {
            setLoadingExtDepts(true);
            axios.get('/organizations/departments', { params: { organization_id: selectedExtOrg } })
                .then(res => {
                    setExtDepartments(res.data.departments || []);
                    setLoadingExtDepts(false);
                })
                .catch(() => {
                    setExtDepartments([]);
                    setLoadingExtDepts(false);
                });
        } else {
            setExtDepartments([]);
            setSelectedExtDept(null);
            setExtPositions([]);
        }
    }, [selectedExtOrg]);

    useEffect(() => {
        if (selectedExtDept) {
            setLoadingExtPositions(true);
            axios.get('/departments/positions', { params: { department_id: selectedExtDept } })
                .then(res => {
                    setExtPositions(res.data.positions || []);
                    setLoadingExtPositions(false);
                })
                .catch(() => {
                    setExtPositions([]);
                    setLoadingExtPositions(false);
                });
        } else {
            setExtPositions([]);
        }
    }, [selectedExtDept]);

    const handleSubmit = (e: React.FormEvent, isDraft: boolean = false) => {
        e.preventDefault();
        (data as any).is_draft = isDraft;
        post(LetterCreate(), {
            preserveScroll: true,
            onSuccess: () => {
                if (!isDraft) {
                    reset();
                    setSelectedDept(null);
                    setSelectedExtOrg(null);
                    setSelectedExtDept(null);
                }
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('attachments', [...(data.attachments || []), ...Array.from(e.target.files)]);
        }
    };

    const removeAttachment = (index: number) => {
        setData('attachments', (data.attachments || []).filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) {
            return '0 Bytes';
        }

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const inputStyle = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white";
    const labelStyle = "block text-xs font-medium text-gray-600 mb-1";

    return (
        <>
            <Head title="نامه جدید" />

            <div className="min-h-screen bg-gray-100" dir="rtl">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div>
                            <h1 className="text-base font-bold text-gray-900">ایجاد نامه جدید</h1>
                            <p className="text-xs text-gray-500">{currentUser.full_name} | {currentUser.department?.name}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={processing}
                                className="px-4 py-1.5 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-1 disabled:opacity-50"
                            >
                                <Save className="h-3.5 w-3.5" />
                                پیش‌نویس
                            </button>
                            <button
                                type="submit"
                                form="letter-form"
                                disabled={processing}
                                className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50"
                            >
                                <Send className="h-3.5 w-3.5" />
                                {processing ? 'ارسال...' : 'ارسال'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <form id="letter-form" onSubmit={(e) => handleSubmit(e, false)}>
                        <div className="bg-white rounded-md border border-gray-200 p-6 space-y-5">

                            {/* Row 1: Subject + Date */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className={labelStyle}>
                                        موضوع <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="موضوع نامه را وارد کنید"
                                        className={inputStyle}
                                    />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>تاریخ</label>
                                    <PersianDatePicker
                                        value={data.date}
                                        onChange={(date) => setData('date', date as string)}
                                    />
                                </div>
                            </div>

                            {/* Row 2: Priority + Security */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>اولویت</label>
                                    <div className="relative">
                                        <select
                                            value={data.priority}
                                            onChange={(e) => setData('priority', e.target.value)}
                                            className={`${inputStyle} appearance-none`}
                                        >
                                            <option value="low">عادی</option>
                                            <option value="normal">معمولی</option>
                                            <option value="high">مهم</option>
                                            <option value="urgent">فوری</option>
                                        </select>
                                        <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelStyle}>سطح امنیتی</label>
                                    <div className="relative">
                                        <select
                                            value={data.security_level}
                                            onChange={(e) => setData('security_level', e.target.value)}
                                            className={`${inputStyle} appearance-none`}
                                        >
                                            <option value="public">عمومی</option>
                                            <option value="internal">داخلی</option>
                                            <option value="confidential">محرمانه</option>
                                            <option value="secret">سری</option>
                                            <option value="top_secret">بسیار سری</option>
                                        </select>
                                        <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Recipient */}
                            <div>
                                <label className={labelStyle}>گیرنده</label>

                                {/* Recipient Type */}
                                <div className="flex gap-4 mb-3">
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="recipient_type"
                                            checked={data.recipient_type === 'internal'}
                                            onChange={() => {
                                                setData('recipient_type', 'internal');
                                                setSelectedExtOrg(null);
                                            }}
                                            className="text-blue-600"
                                        />
                                        <span className="text-sm">داخلی</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="recipient_type"
                                            checked={data.recipient_type === 'external'}
                                            onChange={() => {
                                                setData('recipient_type', 'external');
                                                setSelectedDept(null);
                                                setData('recipient_department_id', null);
                                                setData('recipient_position_id', null);
                                            }}
                                            className="text-blue-600"
                                        />
                                        <span className="text-sm">خارجی</span>
                                    </label>
                                </div>

                                {/* Recipient Fields */}
                                {data.recipient_type === 'internal' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="relative">
                                                <select
                                                    value={selectedDept || ''}
                                                    onChange={(e) => {
                                                        const id = parseInt(e.target.value) || null;
                                                        setSelectedDept(id);
                                                        setData('recipient_department_id', id);
                                                        setData('recipient_position_id', null);
                                                    }}
                                                    className={`${inputStyle} appearance-none`}
                                                >
                                                    <option value="">انتخاب واحد سازمانی</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <select
                                                    value={data.recipient_position_id || ''}
                                                    onChange={(e) => setData('recipient_position_id', parseInt(e.target.value) || null)}
                                                    className={`${inputStyle} appearance-none`}
                                                    disabled={!selectedDept}
                                                >
                                                    <option value="">انتخاب سمت</option>
                                                    {availablePositions.map(pos => (
                                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                    ))}
                                                </select>
                                                {loadingPositions ? (
                                                    <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <div className="relative">
                                                <select
                                                    value={selectedExtOrg || ''}
                                                    onChange={(e) => {
                                                        const id = parseInt(e.target.value) || null;
                                                        setSelectedExtOrg(id);
                                                        setData('external_organization_id', id);
                                                        setSelectedExtDept(null);
                                                        setData('external_department_id', null);
                                                        setData('external_position_id', null);
                                                    }}
                                                    className={`${inputStyle} appearance-none`}
                                                >
                                                    <option value="">انتخاب سازمان</option>
                                                    {externalOrganizations.map(org => (
                                                        <option key={org.id} value={org.id}>{org.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <select
                                                    value={selectedExtDept || ''}
                                                    onChange={(e) => {
                                                        const id = parseInt(e.target.value) || null;
                                                        setSelectedExtDept(id);
                                                        setData('external_department_id', id);
                                                        setData('external_position_id', null);
                                                    }}
                                                    className={`${inputStyle} appearance-none`}
                                                    disabled={!selectedExtOrg}
                                                >
                                                    <option value="">انتخاب واحد</option>
                                                    {extDepartments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </select>
                                                {loadingExtDepts ? (
                                                    <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <select
                                                    value={data.external_position_id || ''}
                                                    onChange={(e) => setData('external_position_id', parseInt(e.target.value) || null)}
                                                    className={`${inputStyle} appearance-none`}
                                                    disabled={!selectedExtDept}
                                                >
                                                    <option value="">انتخاب سمت</option>
                                                    {extPositions.map(pos => (
                                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                    ))}
                                                </select>
                                                {loadingExtPositions ? (
                                                    <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Row 4: Content */}
                            <div>
                                <label className={labelStyle}>متن نامه</label>
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows={10}
                                    placeholder="متن نامه را بنویسید..."
                                    className={inputStyle + " resize-y"}
                                />
                            </div>

                            {/* Row 5: Instruction */}
                            <div>
                                <label className={labelStyle}>دستورالعمل (اختیاری)</label>
                                <textarea
                                    value={data.instruction}
                                    onChange={(e) => setData('instruction', e.target.value)}
                                    rows={2}
                                    placeholder="دستورالعمل برای گیرنده"
                                    className={inputStyle + " resize-none"}
                                />
                            </div>

                            {/* Row 6: Attachments */}
                            <div>
                                <label className={labelStyle}>پیوست‌ها</label>
                                <label className="flex justify-center items-center py-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition">
                                    <div className="text-center">
                                        <Paperclip className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                                        <p className="text-xs text-gray-600">کلیک کنید یا فایل را بکشید</p>
                                    </div>
                                    <input type="file" multiple onChange={handleFileChange} className="hidden" />
                                </label>

                                {data.attachments && data.attachments.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {data.attachments.map((file, i) => (
                                            <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded border text-sm">
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <FileText className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                                    <span className="truncate">{file.name}</span>
                                                    <span className="text-xs text-gray-400 flex-shrink-0">({formatFileSize(file.size)})</span>
                                                </div>
                                                <button type="button" onClick={() => removeAttachment(i)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}