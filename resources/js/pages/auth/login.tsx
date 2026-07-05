// resources/js/pages/auth/login.tsx

import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { login } from '@/routes';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(login().url);
    };

    return (
        <>
            <Head title="ورود به سیستم | اداره عمومی احصائیه و معلومات" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 relative overflow-hidden" dir="rtl">
                {/* Decorative Pattern */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                    <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Login Card */}
                <div className="relative w-full max-w-md">
                    {/* Logo Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-3xl shadow-2xl shadow-indigo-900/40 mb-5 p-4 ring-1 ring-white/20">
                            <img
                                src="https://nsia.gov.af/assets/logo/amended-logo%20final%20final-01.svg"
                                alt="NSIA Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                           د افغانستان اسلامي امارت
                        </h2>
                        <p className="text-indigo-200/70 text-sm mt-1">
                           د احصایې او معلوماتو عمومي اداره
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-950/50 p-8 ring-1 ring-white/40">
                        <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                            ورود به سیستم
                        </h3>
                        <p className="text-xs text-slate-400 text-center mb-6">
                            سیستم مدیریت مکاتیب و اسناد
                        </p>

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
                                        className="block w-full pr-10 pl-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition"
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
                                        className="block w-full pr-10 pl-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition"
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
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
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
                                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-l from-indigo-600 to-indigo-500 text-white text-sm font-bold rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LogIn className="h-4 w-4" />
                                {processing ? 'در حال ورود...' : 'ورود به سیستم'}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-indigo-200/50 text-xs mt-6">
                        © {new Date().getFullYear()} NSIA - تمام حقوق محفوظ است
                    </p>
                </div>
            </div>
        </>
    );
}