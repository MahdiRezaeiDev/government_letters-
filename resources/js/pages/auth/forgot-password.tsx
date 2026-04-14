// resources/js/pages/auth/forgot-password.tsx

import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Send, ArrowLeft } from 'lucide-react';
import type { FormEventHandler } from 'react';
import login from '@/routes/login';
import password from '@/routes/password';
import { dashboard } from '@/routes';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(password.email());
    };

    return (
        <>
            <Head title="فراموشی رمز عبور" />

            <form onSubmit={submit} className="space-y-5">
                {/* Description */}
                <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">
                        ایمیل خود را وارد کنید. لینک بازیابی رمز عبور برای شما ارسال می‌شود.
                    </p>
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ایمیل
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            className="block w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="example@company.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Success Status */}
                {status && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-600 text-sm">{status}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="h-4 w-4" />
                    {processing ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
                </button>

                {/* Back to Login */}
                <div className="text-center">
                    <Link
                        href={dashboard()}
                        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        بازگشت به صفحه ورود
                    </Link>
                </div>
            </form>
        </>
    );
}