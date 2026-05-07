// resources/js/components/DelegateReplyModal.tsx

import { router } from '@inertiajs/react';
import axios from 'axios';
import { X, Send, UserPlus, AlertCircle, Building2, Briefcase, Users, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import letters from '@/routes/letters';

interface User {
    id: number;
    full_name: string;
    position_id?: number;
    position?: {
        id: number;
        name: string;
    };
    department_id?: number;
    department?: {
        id: number;
        name: string;
        organization_id: number;
    };
}

interface Organization {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
    organization_id: number;
}

interface Position {
    id: number;
    name: string;
    department_id: number;
    users?: User[];
}

interface DelegateReplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    letterId: number;
    letterSubject: string;
    organizations: Organization[];
    currentUserId: number;
    currentUserOrganizationId?: number;
}

export function DelegateReplyModal({
    isOpen,
    onClose,
    letterId,
    letterSubject,
    organizations,
    currentUserId,
    currentUserOrganizationId
}: DelegateReplyModalProps) {
    // State برای انتخاب‌های سلسله‌مراتبی
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>('');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
    const [selectedPositionId, setSelectedPositionId] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [delegatedNote, setDelegatedNote] = useState('');

    // State برای داده‌های دریافتی از API
    const [departments, setDepartments] = useState<Department[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [user, setUser] = useState<User[]>([]);

    // State برای بارگذاری
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [loadingPositions, setLoadingPositions] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // سازمان پیش‌فرض (سازمان کاربر فعلی)
    useEffect(() => {
        if (isOpen && currentUserOrganizationId && !selectedOrganizationId) {
            setSelectedOrganizationId(currentUserOrganizationId.toString());
        }
    }, [isOpen, currentUserOrganizationId]);

    // بارگذاری دپارتمان‌ها هنگام انتخاب سازمان
    useEffect(() => {
        if (!selectedOrganizationId) {
            setDepartments([]);
            setSelectedDepartmentId('');

            return;
        }

        setLoadingDepartments(true);
        axios.get('/organizations/departments', { params: { organization_id: selectedOrganizationId } })
            .then(res => {
                setDepartments(res.data.departments || []);
                setLoadingDepartments(false);
            })
            .catch(() => {
                setDepartments([]);
                setLoadingDepartments(false);
            });
    }, [selectedOrganizationId]);

    // بارگذاری پوزیشن‌ها هنگام انتخاب دپارتمان
    useEffect(() => {
        if (!selectedDepartmentId) {
            setPositions([]);
            setSelectedPositionId('');

            return;
        }

        setLoadingPositions(true);
        axios.get('/departments/positions', { params: { department_id: selectedDepartmentId } })
            .then(res => {
                setPositions(res.data.positions || []);
                setLoadingPositions(false);
            })
            .catch(() => {
                setPositions([]);
                setLoadingPositions(false);
            });
    }, [selectedDepartmentId]);

    // بازنشانی مقادیر هنگام بسته شدن مودال
    const handleClose = () => {
        setSelectedOrganizationId(currentUserOrganizationId?.toString() || '');
        setSelectedDepartmentId('');
        setSelectedPositionId('');
        setSelectedUserId('');
        setDelegatedNote('');
        setError(null);
        onClose();
    };

    const handleDelegate = () => {
        if (!selectedUserId) {
            setError('لطفاً شخص مورد نظر را انتخاب کنید');

            return;
        }

        setError(null);
        setIsSubmitting(true);

        router.post(letters.delegate({ letter: letterId }), {
            delegated_to_user_id: selectedUserId,
            delegated_note: delegatedNote
        }, {
            onSuccess: () => {
                setIsSubmitting(false);
                handleClose();
            },
            onError: (errors) => {
                setIsSubmitting(false);

                if (errors.delegated_to_user_id) {
                    setError(errors.delegated_to_user_id);
                } else {
                    setError('خطایی در ارجاع مکتوب رخ داد');
                }
            }
        });
    };

    console.log(selectedUserId);


    // پیدا کردن نام‌های انتخاب شده برای نمایش
    const selectedOrganizationName = organizations.find(o => o.id.toString() === selectedOrganizationId)?.name;
    const selectedDepartmentName = departments.find(d => d.id.toString() === selectedDepartmentId)?.name;
    const selectedPositionName = positions.find(p => p.id.toString() === selectedPositionId)?.name;

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                {/* هدر */}
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-amber-600" />
                        <h3 className="text-lg font-bold text-gray-900">
                            ارجاع مکتوب برای پاسخ
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* محتوا */}
                <div className="p-5 space-y-4">
                    {/* اطلاعات مکتوب */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">مکتوب:</p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {letterSubject}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 space-y-3">

                        {/* انتخاب سازمان */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Building2 className="inline h-4 w-4 ml-1 text-gray-400" />
                                سازمان/وزارت <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedOrganizationId}
                                onChange={(e) => {
                                    setSelectedOrganizationId(e.target.value);
                                    setSelectedDepartmentId('');
                                    setSelectedPositionId('');
                                    setSelectedUserId('');
                                }}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                                <option value="">انتخاب سازمان...</option>
                                {organizations.map(org => (
                                    <option key={org.id} value={org.id}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* انتخاب ریاست/دپارتمان */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Briefcase className="inline h-4 w-4 ml-1 text-gray-400" />
                                ریاست/دپارتمان
                            </label>
                            <select
                                value={selectedDepartmentId}
                                onChange={(e) => {
                                    setSelectedDepartmentId(e.target.value);
                                    setSelectedPositionId('');
                                    setSelectedUserId('');
                                }}
                                disabled={!selectedOrganizationId || loadingDepartments}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">انتخاب ریاست...</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            {loadingDepartments && (
                                <p className="text-xs text-gray-400 mt-1">در حال بارگذاری...</p>
                            )}
                        </div>

                        {/* انتخاب پوزیشن */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="inline h-4 w-4 ml-1 text-gray-400" />
                                وظیفه/پوزیشن
                            </label>
                            <select
                                value={selectedPositionId}
                                onChange={(e) => {
                                    setSelectedPositionId(e.target.value);
                                    const id = parseInt(e.target.value) || null;
                                    const position = positions.find(p => p.id === id);

                                    setSelectedUserId(position?.user_id);
                                    setUsers(position)
                                }}
                                disabled={!selectedDepartmentId || loadingPositions}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">انتخاب وظیفه...</option>
                                {positions.map(pos => (
                                    <option key={pos.id} value={pos.id}>
                                        {pos.name}
                                    </option>
                                ))}
                            </select>
                            {loadingPositions && (
                                <p className="text-xs text-gray-400 mt-1">در حال بارگذاری...</p>
                            )}
                        </div>

                        {/* انتخاب شخص */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <UserPlus className="inline h-4 w-4 ml-1 text-gray-400" />
                                ارجاع به <span className="text-red-500">*</span>
                            </label>

                            <p className="text-xs text-gray-400 mt-1">در حال بارگذاری...</p>

                        </div>
                    </div>

                    {/* نمایش مسیر انتخاب شده */}
                    {(selectedOrganizationName || selectedDepartmentName || selectedPositionName) && (
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs text-blue-600 font-medium mb-1">مسیر انتخاب شده:</p>
                            <div className="flex flex-wrap items-center gap-1 text-xs text-blue-700">
                                {selectedOrganizationName && <span>{selectedOrganizationName}</span>}
                                {selectedOrganizationName && selectedDepartmentName && <span><ArrowLeft className='w-3 h-3' /></span>}
                                {selectedDepartmentName && <span>{selectedDepartmentName}</span>}
                                {selectedDepartmentName && selectedPositionName && <span><ArrowLeft className='w-3 h-3' /></span>}
                                {selectedPositionName && <span>{selectedPositionName}</span>}
                            </div>
                        </div>
                    )}

                    {/* دستورالعمل */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            دستورالعمل (اختیاری)
                        </label>
                        <textarea
                            value={delegatedNote}
                            onChange={(e) => setDelegatedNote(e.target.value)}
                            rows={3}
                            placeholder="لطفاً توضیح دهید چه پاسخی داده شود یا چه اقدامی انجام شود..."
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* خطا */}
                    {error && (
                        <div className="bg-red-50 border-r-4 border-r-red-500 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* هشدار */}
                    <div className="bg-amber-50 border-r-4 border-r-amber-400 rounded-lg p-3">
                        <p className="text-xs text-amber-700">
                            ⚠️ با ارجاع این مکتوب، شخص مورد نظر می‌تواند به جای شما به فرستنده پاسخ دهد.
                            شما همچنان می‌توانید مکتوب را مشاهده کنید.
                        </p>
                    </div>
                </div>

                {/* دکمه‌ها */}
                <div className="flex gap-3 p-4 border-t bg-gray-50 rounded-b-2xl sticky bottom-0">
                    <button
                        onClick={handleDelegate}
                        disabled={isSubmitting || !selectedUserId}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="h-4 w-4" />
                        {isSubmitting ? 'در حال ارجاع...' : 'ارجاع مکتوب'}
                    </button>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </div>
    );
}