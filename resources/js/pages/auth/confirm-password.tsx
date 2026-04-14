// resources/js/pages/auth/confirm-password.tsx

import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import type { FormEventHandler} from 'react';
import { dashboard } from '@/routes';
import password from '@/routes/password';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(password.confirm(), {
            onFinish: () => setData('password', ''),
        });
    };

    return (
        <>
            <Head title="تأیید رمز عبور" />

            <div className="space-y-6">
                {/* Icon */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-amber-100 mb-4">
                        <ShieldCheck className="h-10 w-10 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        تأیید رمز عبور
                    </h2>
                    <p className="text-sm text-gray-600">
                        برای دسترسی به این بخش، لطفاً رمز عبور خود را وارد کنید.
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <div className="bg-amber-500 rounded-full p-1 shrink-0">
                        <Lock className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-amber-700 text-sm">
                        این بخش از سیستم نیاز به تأیید امنیتی دارد. لطفاً رمز عبور خود را وارد کنید.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-5">
                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            رمز عبور
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                autoFocus
                                className="block w-full pr-10 pl-10 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="رمز عبور خود را وارد کنید"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 left-0 pl-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        {processing ? 'در حال بررسی...' : 'تأیید و ادامه'}
                    </button>
                </form>

                {/* Back Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                    <Link
                        href={dashboard()}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        بازگشت به داشبورد
                    </Link>
                </div>
            </div>
        </>
    );
}