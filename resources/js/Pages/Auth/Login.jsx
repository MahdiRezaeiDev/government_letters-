import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4"
            dir="rtl"
        >
            <Head title="ورود به سیستم" />

            {/* کارت ورود */}
            <div className="w-full max-w-md">
                {/* لوگو */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-2xl">
                        <Mail size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        سیستم مکاتبات اداری
                    </h1>
                    <p className="mt-1 text-sm text-blue-300">
                        برای ادامه وارد حساب کاربری خود شوید
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow-2xl">
                    {status && (
                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* ایمیل */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                ایمیل
                            </label>
                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-4 pr-10 text-right text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                    placeholder="email@example.com"
                                    dir="ltr"
                                    autoComplete="username"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* رمز عبور */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                رمز عبور
                            </label>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-10 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                    dir="ltr"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* مرا به خاطر بسپار */}
                        <div className="flex items-center justify-between">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">
                                    مرا به خاطر بسپار
                                </span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-blue-600 transition-colors hover:text-blue-800"
                                >
                                    فراموشی رمز
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'در حال ورود...' : 'ورود به سیستم'}
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        <p className="text-sm text-gray-500">
                            حساب کاربری ندارید؟{' '}
                            <Link
                                href="/register"
                                className="font-medium text-blue-600 transition-colors hover:text-blue-800"
                            >
                                ثبت‌نام کنید
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-blue-400">
                    © ۱۴۰۴ سیستم مکاتبات اداری
                </p>
            </div>
        </div>
    );
}
