// resources/js/pages/auth/verify-email.tsx

import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { logout } from '@/routes';
import verification from '@/routes/verification';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const [resent, setResent] = useState(false);
    const { post, processing } = useForm({});

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        post(verification.send(), {
            onSuccess: () => {
                setResent(true);
                setTimeout(() => setResent(false), 5000);
            },
        });
    };

    return (
        <>
            <Head title="تأیید ایمیل" />

            <div className="space-y-6">
                {/* Icon */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-4">
                        <Mail className="h-10 w-10 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        تأیید آدرس ایمیل
                    </h2>
                    <p className="text-sm text-gray-600">
                        لطفاً قبل از ادامه، آدرس ایمیل خود را تأیید کنید.
                    </p>
                </div>

                {/* Success Message */}
                {status === 'verification-link-sent' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-green-700 text-sm font-medium">
                                لینک تأیید جدید ارسال شد
                            </p>
                            <p className="text-green-600 text-xs mt-0.5">
                                یک لینک تأیید جدید به ایمیل شما ارسال شده است.
                            </p>
                        </div>
                    </div>
                )}

                {/* Resent Message */}
                {resent && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-green-700 text-sm font-medium">
                                ایمیل تأیید ارسال شد
                            </p>
                            <p className="text-green-600 text-xs mt-0.5">
                                لینک تأیید به ایمیل شما ارسال شد. لطفاً ایمیل خود را بررسی کنید.
                            </p>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-blue-700 text-sm font-medium">
                            ایمیل خود را بررسی کنید
                        </p>
                        <p className="text-blue-600 text-xs mt-0.5">
                            یک لینک تأیید به ایمیل شما ارسال شده است. برای فعال‌سازی حساب خود روی آن کلیک کنید.
                        </p>
                    </div>
                </div>

                {/* Resend Button */}
                <form onSubmit={handleResend} className="space-y-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`h-4 w-4 ${processing ? 'animate-spin' : ''}`} />
                        {processing ? 'در حال ارسال...' : 'ارسال مجدد لینک تأیید'}
                    </button>
                </form>

                {/* Logout Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                    <Link
                        href={logout()}
                        method="post"
                        as="button"
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        خروج از حساب
                    </Link>
                </div>
            </div>
        </>
    );
}