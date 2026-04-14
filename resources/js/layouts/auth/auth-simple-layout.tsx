// resources/js/layouts/auth/auth-simple-layout.tsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
}

export default function AuthSimpleLayout({ title, description, children }: AuthLayoutProps) {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <Head title={title} />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="flex min-h-screen">
                    {/* Right Side - Form Section */}
                    <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                        <div className="w-full max-w-md">
                            {/* Logo */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg mb-4">
                                    <Building2 className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    سیستم مکاتبات اداری
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    مدیریت هوشمند نامه‌های اداری
                                </p>
                            </div>

                            {/* Title & Description */}
                            {title && (
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                                    {description && (
                                        <p className="text-sm text-gray-500 mt-1">{description}</p>
                                    )}
                                </div>
                            )}

                            {/* Form Content */}
                            {children}
                        </div>
                    </div>

                    {/* Left Side - Info Section (Hidden on Mobile) */}
                    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="h-full w-full" patternUnits="userSpaceOnUse" width="40" height="40">
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">
                                    خوش آمدید
                                </h2>
                                <p className="text-blue-100 text-lg leading-relaxed">
                                    به سیستم مدیریت یکپارچه مکاتبات اداری خوش آمدید.
                                    با استفاده از این سیستم می‌توانید نامه‌های خود را به صورت
                                    هوشمند مدیریت کنید.
                                </p>
                            </div>

                            {/* Features */}
                            <div className="space-y-6 mt-12">
                                <div className="flex items-start gap-3">
                                    <div className="bg-white/20 rounded-lg p-2">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">مدیریت نامه‌ها</h3>
                                        <p className="text-blue-100 text-sm">ثبت و پیگیری نامه‌های وارده و صادره</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-white/20 rounded-lg p-2">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">گردش کار هوشمند</h3>
                                        <p className="text-blue-100 text-sm">ارجاع خودکار و پیگیری اقدامات</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-white/20 rounded-lg p-2">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">بایگانی دیجیتال</h3>
                                        <p className="text-blue-100 text-sm">ذخیره و بازیابی آسان اسناد</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-12 pt-8 border-t border-blue-400/30">
                                <p className="text-blue-200 text-sm text-center">
                                    &copy; {currentYear} سیستم مکاتبات اداری. تمامی حقوق محفوظ است.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}