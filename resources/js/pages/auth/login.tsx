// resources/js/pages/auth/login.tsx

import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { login } from '@/routes';
import password from '@/routes/password';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(login());
    };

    return (
        <>
            <Head title="ورود به سیستم | اداره ملی احصائیه و معلومات" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#20c997] rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#20c997] rounded-full translate-x-1/2 translate-y-1/2" />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#20c997] rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#20c997] rounded-full opacity-50" />
                    <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[#20c997] rounded-full opacity-50" />
                </div>

                {/* Login Card */}
                <div className="relative w-full max-w-md">
                    {/* Logo Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-2xl shadow-2xl mb-5 p-4">
                            <img
                                src="https://nsia.gov.af/assets/logo/amended-logo%20final%20final-01.svg"
                                alt="NSIA Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            اداره ملی احصائیه و معلومات
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            د افغانستان اسلامی امارت
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h3 className="text-lg font-bold text-gray-800 text-center mb-6">
                            ورود به سیستم
                        </h3>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                                        className="block w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#20c997] focus:border-transparent transition"
                                        placeholder="example@nsia.gov.af"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                                        className="block w-full pr-10 pl-10 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#20c997] focus:border-transparent transition"
                                        placeholder="********"
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
                                    <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-[#20c997] focus:ring-[#20c997]"
                                    />
                                    <span className="text-sm text-gray-600">مرا به خاطر بسپار</span>
                                </label>
                                {/* <Link
                                    href={password.request()}
                                    className="text-sm text-[#20c997] hover:text-teal-600 transition"
                                >
                                    فراموشی رمز؟
                                </Link> */}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#20c997] text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LogIn className="h-4 w-4" />
                                {processing ? 'در حال ورود...' : 'ورود به سیستم'}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-400 text-xs mt-6">
                        © {new Date().getFullYear()} NSIA - تمام حقوق محفوظ است
                    </p>
                </div>
            </div>
        </>
    );
}