import { Head, Link, router } from '@inertiajs/react';
import {
    CornerUpRight,
    CheckCircle,
    XCircle,
    Clock,
    UserCheck,
    MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import delegationsRoute from '@/routes/delegations';
import letters from '@/routes/letters';

interface Delegation {
    id: number;
    letter: {
        id: number;
        subject: string;
        content: string;
        sender_user: {
            full_name: string;
        };
        created_at: string;
    };
    delegated_by: {
        id: number;
        full_name: string;
    };
    delegated_note: string | null;
    delegated_at: string;
    status: 'pending' | 'accepted' | 'replied' | 'rejected';
}

interface Props {
    delegations: Delegation[];
}

export default function DelegatedToMe({ delegations }: Props) {
    const [loading, setLoading] = useState<number | null>(null);

    const handleAccept = (delegationId: number) => {
        if (!confirm('آیا می‌خواهید این ارجاع را بپذیرید؟')) {
            return;
        }

        setLoading(delegationId);
        router.post(delegationsRoute.accept({ delegation: delegationId }), {}, {
            onFinish: () => setLoading(null),
            onSuccess: () => router.reload()
        });
    };

    const handleReject = (delegationId: number) => {
        const reason = prompt('لطفاً دلیل رد را وارد کنید:');

        if (!reason) {
            return;
        }

        setLoading(delegationId);
        router.post(delegationsRoute.reject({ delegation: delegationId }), { reason }, {
            onFinish: () => setLoading(null),
            onSuccess: () => router.reload()
        });
    };

    const pendingDelegations = delegations.filter(d => d.status === 'pending');
    const acceptedDelegations = delegations.filter(d => d.status === 'accepted');

    return (
        <>
            <Head title="مکتوب‌های ارجاع شده به من" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8">

                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-xl">
                                <CornerUpRight className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    مکتوب‌های ارجاع شده به من
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    مکتوب‌هایی که دیگران برای پاسخ به شما ارجاع داده‌اند
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* در انتظار اقدام */}
                    {pendingDelegations.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-amber-500" />
                                در انتظار اقدام شما
                            </h2>
                            <div className="space-y-4">
                                {pendingDelegations.map((delegation) => (
                                    <div key={delegation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="p-5 border-r-4 border-r-amber-400">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                                            <UserCheck className="h-3 w-3" />
                                                            ارجاع شده از {delegation.delegated_by.full_name}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(delegation.delegated_at).toLocaleDateString('fa-IR')}
                                                        </span>
                                                    </div>

                                                    <Link
                                                        href={letters.show({ letter: delegation.letter.id })}
                                                        className="block"
                                                    >
                                                        <h3 className="font-bold text-gray-900 mb-1 hover:text-amber-600 transition">
                                                            {delegation.letter.subject}
                                                        </h3>
                                                    </Link>

                                                    <p className="text-sm text-gray-600">
                                                        از: {delegation.letter.sender_user?.full_name}
                                                    </p>

                                                    {delegation.delegated_note && (
                                                        <div className="mt-3 bg-amber-50 rounded-lg p-3">
                                                            <p className="text-xs text-amber-600 font-medium mb-1">📌 دستورالعمل:</p>
                                                            <p className="text-sm text-amber-700">{delegation.delegated_note}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                                                <button
                                                    onClick={() => handleAccept(delegation.id)}
                                                    disabled={loading === delegation.id}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    {loading === delegation.id ? 'در حال پردازش...' : 'پذیرش و پاسخ'}
                                                </button>

                                                <button
                                                    onClick={() => handleReject(delegation.id)}
                                                    disabled={loading === delegation.id}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    رد ارجاع
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* پذیرفته شده - در انتظار پاسخ */}
                    {acceptedDelegations.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-emerald-500" />
                                پذیرفته شده - در انتظار پاسخ
                            </h2>
                            <div className="space-y-4">
                                {acceptedDelegations.map((delegation) => (
                                    <div key={delegation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="p-5 border-r-4 border-r-emerald-400">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                            <CheckCircle className="h-3 w-3" />
                                                            پذیرفته شده
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(delegation.delegated_at).toLocaleDateString('fa-IR')}
                                                        </span>
                                                    </div>

                                                    <Link
                                                        href={letters.show({ letter: delegation.letter.id })}
                                                        className="block"
                                                    >
                                                        <h3 className="font-bold text-gray-900 mb-1 hover:text-emerald-600 transition">
                                                            {delegation.letter.subject}
                                                        </h3>
                                                    </Link>

                                                    <p className="text-sm text-gray-600">
                                                        از: {delegation.letter.sender_user?.full_name}
                                                    </p>

                                                    <Link
                                                        href={letters.reply.form({ letter: delegation.letter.id })}
                                                        className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                                                    >
                                                        <MessageCircle className="h-4 w-4" />
                                                        ثبت پاسخ
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* هیچ داده‌ای */}
                    {pendingDelegations.length === 0 && acceptedDelegations.length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="flex flex-col items-center">
                                <div className="p-3 bg-gray-100 rounded-full mb-4">
                                    <CornerUpRight className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">هیچ مکتوبی به شما ارجاع نشده است</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    وقتی کسی مکتوبی را برای پاسخ به شما ارجاع دهد، در اینجا نمایش داده می‌شود
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}