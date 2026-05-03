import { Head, usePage, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Send, UserCheck, Building2,
    FileText,
    ChevronLeft, Save, Users, Share2
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Props {
    letter: any; // اطلاعات نامه مبدا
    departments: { id: number; name: string }[];
    positions: { id: number; name: string; department_id: number }[];
    users?: { id: number; name: string; position: string; department: string }[];
}

interface FormData {
    letter_id: number;
    recipient_type: 'internal' | 'external' | 'user';
    recipient_department_id: number | null;
    recipient_position_id: number | null;
    recipient_user_id: number | null;
    recipient_name: string;
    instruction: string;
    due_date: string | null;
    priority: string;
}

export default function RoutingsCreate({ letter, departments, positions, users = [] }: Props) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;

    const { data, setData, post, processing, errors } = useForm<FormData>({
        letter_id: letter.id,
        recipient_type: 'internal',
        recipient_department_id: null,
        recipient_position_id: null,
        recipient_user_id: null,
        recipient_name: '',
        instruction: '',
        due_date: null,
        priority: 'normal',
    });

    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [availablePositions, setAvailablePositions] = useState<{ id: number; name: string }[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);

    // بارگذاری پوزیشن‌ها هنگام انتخاب دپارتمان
    useEffect(() => {
        if (selectedDepartment) {
            const deptPositions = positions.filter(p => p.department_id === selectedDepartment);
            setAvailablePositions(deptPositions);
        } else {
            setAvailablePositions([]);
        }
    }, [selectedDepartment, positions]);

    // تنظیم نام گیرنده داخلی
    useEffect(() => {
        if (data.recipient_type === 'internal' && selectedDepartment && data.recipient_position_id) {
            const deptName = departments.find(d => d.id === selectedDepartment)?.name;
            const positionName = availablePositions.find(p => p.id === data.recipient_position_id)?.name;
            setData('recipient_name', `${positionName || ''} - ${deptName || ''}`);
        }
    }, [data.recipient_position_id, selectedDepartment, data.recipient_type]);

    // تنظیم نام گیرنده (کاربر مشخص)
    useEffect(() => {
        if (data.recipient_type === 'user' && data.recipient_user_id) {
            const user = users.find(u => u.id === data.recipient_user_id);
            if (user) {
                setData('recipient_name', `${user.name} - ${user.position || ''} (${user.department || ''})`);
            }
        }
    }, [data.recipient_user_id, data.recipient_type]);

    const handleSubmit = (e: React.FormEvent, isDraft: boolean = false) => {
        e.preventDefault();

        post(router('routings.store'), {
            preserveScroll: true,
            onSuccess: () => {
                // نمایش پیام موفقیت
            },
            onError: (errors) => {
                console.error('Errors:', errors);
            },
        });
    };

    return (
        <>
            <Head title="ارجاع نامه" />

            <div className="min-h-screen bg-slate-50/70" dir="rtl">
                {/* Header */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => router.get(router('letters.show', letter.id))}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <div>
                                    <h1 className="text-sm font-bold text-slate-800">ارجاع نامه</h1>
                                    <p className="text-xs text-slate-400 mt-0.5">{letter.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    disabled={processing}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    <Save className="h-4 w-4" />
                                    پیش‌نویس
                                </button>
                                <button
                                    type="submit"
                                    form="routing-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                    {processing ? 'در حال ارسال...' : 'ارجاع نامه'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="routing-form" onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">

                        {/* اطلاعات نامه مبدا */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-l from-slate-50/50 to-white">
                                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-indigo-600" />
                                    اطلاعات نامه
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">موضوع</p>
                                        <p className="text-sm font-medium text-slate-700">{letter.subject}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">فرستنده</p>
                                        <p className="text-sm font-medium text-slate-700">{letter.sender?.full_name || '---'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">خلاصه</p>
                                    <p className="text-sm text-slate-600 line-clamp-2">{letter.summary || '---'}</p>
                                </div>
                            </div>
                        </div>

                        {/* فرم ارجاع */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-l from-slate-50/50 to-white">
                                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Share2 className="h-4 w-4 text-indigo-600" />
                                    اطلاعات ارجاع
                                </h2>
                            </div>
                            <div className="p-6 space-y-5">

                                {/* نوع گیرنده */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                        نوع گیرنده <span className="text-rose-400 mr-1">*</span>
                                    </label>
                                    <div className="flex gap-3">
                                        <label className="flex-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="internal"
                                                checked={data.recipient_type === 'internal'}
                                                onChange={() => {
                                                    setData('recipient_type', 'internal');
                                                    setData('recipient_user_id', null);
                                                    setSelectedUser(null);
                                                }}
                                                className="sr-only"
                                            />
                                            <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-all ${data.recipient_type === 'internal' ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                                <Building2 className="h-5 w-5 text-indigo-500" />
                                                <div>
                                                    <p className="text-sm font-semibold">داخلی (سمت)</p>
                                                    <p className="text-xs text-slate-400">ارجاع به یک سمت مشخص</p>
                                                </div>
                                            </div>
                                        </label>
                                        <label className="flex-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="user"
                                                checked={data.recipient_type === 'user'}
                                                onChange={() => {
                                                    setData('recipient_type', 'user');
                                                    setSelectedDepartment(null);
                                                    setData('recipient_department_id', null);
                                                    setData('recipient_position_id', null);
                                                }}
                                                className="sr-only"
                                            />
                                            <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-all ${data.recipient_type === 'user' ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                                <Users className="h-5 w-5 text-indigo-500" />
                                                <div>
                                                    <p className="text-sm font-semibold">داخلی (شخص)</p>
                                                    <p className="text-xs text-slate-400">ارجاع به یک شخص خاص</p>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* گیرنده سمت (internal) */}
                                {data.recipient_type === 'internal' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-2">
                                                دپارتمان / ریاست <span className="text-rose-400 mr-1">*</span>
                                            </label>
                                            <select
                                                value={selectedDepartment || ''}
                                                onChange={(e) => {
                                                    const deptId = parseInt(e.target.value) || null;
                                                    setSelectedDepartment(deptId);
                                                    setData('recipient_department_id', deptId);
                                                    setData('recipient_position_id', null);
                                                    setData('recipient_name', '');
                                                }}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                                            >
                                                <option value="">انتخاب کنید...</option>
                                                {departments.map(dept => (
                                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                ))}
                                            </select>
                                            {errors.recipient_department_id && (
                                                <p className="text-rose-500 text-xs mt-1">{errors.recipient_department_id}</p>
                                            )}
                                        </div>

                                        {selectedDepartment && (
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-2">
                                                    سمت <span className="text-rose-400 mr-1">*</span>
                                                </label>
                                                <select
                                                    value={data.recipient_position_id || ''}
                                                    onChange={(e) => {
                                                        const posId = parseInt(e.target.value) || null;
                                                        setData('recipient_position_id', posId);
                                                    }}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                                                >
                                                    <option value="">انتخاب کنید...</option>
                                                    {availablePositions.map(pos => (
                                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                                    ))}
                                                </select>
                                                {errors.recipient_position_id && (
                                                    <p className="text-rose-500 text-xs mt-1">{errors.recipient_position_id}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* گیرنده شخص (user) */}
                                {data.recipient_type === 'user' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-2">
                                            انتخاب شخص <span className="text-rose-400 mr-1">*</span>
                                        </label>
                                        <select
                                            value={data.recipient_user_id || ''}
                                            onChange={(e) => {
                                                const userId = parseInt(e.target.value) || null;
                                                setData('recipient_user_id', userId);
                                            }}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                                        >
                                            <option value="">انتخاب کنید...</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} - {user.position || 'بدون سمت'} ({user.department || 'بدون دپارتمان'})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.recipient_user_id && (
                                            <p className="text-rose-500 text-xs mt-1">{errors.recipient_user_id}</p>
                                        )}
                                    </div>
                                )}

                                {/* اولویت */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-2">
                                        اولویت ارجاع
                                    </label>
                                    <div className="flex gap-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="low"
                                                checked={data.priority === 'low'}
                                                onChange={() => setData('priority', 'low')}
                                                className="text-indigo-600"
                                            />
                                            <span className="text-sm text-slate-600">عادی</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="normal"
                                                checked={data.priority === 'normal'}
                                                onChange={() => setData('priority', 'normal')}
                                                className="text-indigo-600"
                                            />
                                            <span className="text-sm text-slate-600">متوسط</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="high"
                                                checked={data.priority === 'high'}
                                                onChange={() => setData('priority', 'high')}
                                                className="text-indigo-600"
                                            />
                                            <span className="text-sm text-slate-600">فوری</span>
                                        </label>
                                    </div>
                                </div>

                                {/* تاریخ سررسید */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-2">
                                        تاریخ سررسید
                                    </label>
                                    <input
                                        type="date"
                                        value={data.due_date || ''}
                                        onChange={(e) => setData('due_date', e.target.value || null)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                                    />
                                </div>

                                {/* دستورالعمل */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-2">
                                        دستورالعمل / توضیحات <span className="text-rose-400 mr-1">*</span>
                                    </label>
                                    <textarea
                                        value={data.instruction}
                                        onChange={(e) => setData('instruction', e.target.value)}
                                        rows={5}
                                        placeholder="دستورالعمل‌های لازم برای این ارجاع را وارد کنید..."
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-none"
                                    />
                                    {errors.instruction && (
                                        <p className="text-rose-500 text-xs mt-1">{errors.instruction}</p>
                                    )}
                                </div>

                                {/* نمایش گیرنده نهایی */}
                                {data.recipient_name && (
                                    <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                                        <p className="text-xs text-indigo-600 mb-1 flex items-center gap-1">
                                            <UserCheck className="h-3.5 w-3.5" />
                                            گیرنده نهایی
                                        </p>
                                        <p className="text-sm font-medium text-slate-700">{data.recipient_name}</p>
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