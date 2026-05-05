import { router } from '@inertiajs/react';
import { X, Send, UserPlus, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import letters from '@/routes/letters';

interface User {
    id: number;
    full_name: string;
    position?: {
        name: string;
    };
    department?: {
        name: string;
    };
}

interface DelegateReplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    letterId: number;
    letterSubject: string;
    users: User[];
    currentUserId: number;
}

export function DelegateReplyModal({
    isOpen,
    onClose,
    letterId,
    letterSubject,
    users,
    currentUserId
}: DelegateReplyModalProps) {
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [delegatedNote, setDelegatedNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) {
        return null;
    }

    const availableUsers = users.filter(user => user.id !== currentUserId);

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
                onClose();
                setSelectedUserId('');
                setDelegatedNote('');
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                {/* هدر */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-amber-600" />
                        <h3 className="text-lg font-bold text-gray-900">
                            ارجاع مکتوب برای پاسخ
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
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

                    {/* انتخاب شخص */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ارجاع به <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => {
                                setSelectedUserId(e.target.value);
                                setError(null);
                            }}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="">انتخاب کنید...</option>
                            {availableUsers.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.full_name}
                                    {user.position?.name && ` - ${user.position.name}`}
                                    {user.department?.name && ` (${user.department.name})`}
                                </option>
                            ))}
                        </select>
                        {availableUsers.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">
                                کاربر دیگری برای ارجاع وجود ندارد
                            </p>
                        )}
                    </div>

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
                <div className="flex gap-3 p-4 border-t bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={handleDelegate}
                        disabled={isSubmitting || !selectedUserId || availableUsers.length === 0}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="h-4 w-4" />
                        {isSubmitting ? 'در حال ارجاع...' : 'ارجاع مکتوب'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
                    >
                        انصراف
                    </button>
                </div>
            </div>
        </div>
    );
}