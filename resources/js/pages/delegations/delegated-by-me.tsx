// resources/js/pages/delegations/delegated-by-me.tsx

import { Head, Link } from '@inertiajs/react';
import { CornerUpRight, CheckCircle, Clock, UserCheck, AlertCircle } from 'lucide-react';

interface Delegation {
    id: number;
    letter: {
        id: number;
        subject: string;
        sender_user: {
            full_name: string;
        };
    };
    delegated_to: {
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

export default function DelegatedByMe({ delegations }: Props) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return { label: 'در انتظار', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-r-amber-400', icon: Clock };
            case 'accepted':
                return { label: 'پذیرفته شده', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-r-emerald-400', icon: CheckCircle };
            case 'replied':
                return { label: 'پاسخ داده شد', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-r-blue-400', icon: CheckCircle };
            case 'rejected':
                return { label: 'رد شده', color: 'text-red-600', bg: 'bg-red-50', border: 'border-r-red-400', icon: AlertCircle };
            default:
                return { label: status, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-r-gray-400', icon: Clock };
        }
    };

    return (
        <>
            <Head title="مکتوب‌هایی که من ارجاع داده‌ام" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8">

                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <CornerUpRight className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    مکتوب‌هایی که من ارجاع داده‌ام
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    مکتوب‌هایی که برای پاسخ به دیگران ارجاع داده‌اید
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* List */}
                    {delegations.length > 0 ? (
                        <div className="space-y-4">
                            {delegations.map((delegation) => {
                                const statusConfig = getStatusConfig(delegation.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <div key={delegation.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${statusConfig.border}`}>
                                        <div className="p-5">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                                                            <StatusIcon className="h-3 w-3" />
                                                            {statusConfig.label}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(delegation.delegated_at).toLocaleDateString('fa-IR')}
                                                        </span>
                                                    </div>

                                                    <Link
                                                        href={route('letters.show', { letter: delegation.letter.id })}
                                                        className="block"
                                                    >
                                                        <h3 className="font-bold text-gray-900 mb-1 hover:text-blue-600 transition">
                                                            {delegation.letter.subject}
                                                        </h3>
                                                    </Link>

                                                    <p className="text-sm text-gray-600">
                                                        از: {delegation.letter.sender_user?.full_name}
                                                    </p>

                                                    <div className="mt-3 flex items-center gap-2 text-sm">
                                                        <UserCheck className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600">
                                                            ارجاع به: <span className="font-medium">{delegation.delegated_to.full_name}</span>
                                                        </span>
                                                    </div>

                                                    {delegation.delegated_note && (
                                                        <div className="mt-3 bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-500 font-medium mb-1">دستورالعمل شما:</p>
                                                            <p className="text-sm text-gray-600">{delegation.delegated_note}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="flex flex-col items-center">
                                <div className="p-3 bg-gray-100 rounded-full mb-4">
                                    <CornerUpRight className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">شما هیچ مکتوبی ارجاع نداده‌اید</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    وقتی مکتوبی را برای پاسخ به دیگران ارجاع دهید، در اینجا نمایش داده می‌شود
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}