// resources/js/pages/welcome.tsx

import { Head, Link } from '@inertiajs/react';
import { FileText, Users, Building2, Clock, ArrowLeft } from 'lucide-react';
import React from 'react';
import {login, register} from '@/routes';

export default function Welcome() {
    const features = [
        {
            icon: FileText,
            title: 'مدیریت نامه‌ها',
            description: 'ثبت، پیگیری و بایگانی انواع نامه‌های اداری',
        },
        {
            icon: Users,
            title: 'گردش کار',
            description: 'ارجاع خودکار نامه‌ها و پیگیری وضعیت',
        },
        {
            icon: Building2,
            title: 'ساختار سازمانی',
            description: 'مدیریت دپارتمان‌ها و سمت‌ها',
        },
        {
            icon: Clock,
            title: 'کارتابل شخصی',
            description: 'مشاهده و پاسخ به ارجاعات',
        },
    ];

    return (
        <>
            <Head title="خوش آمدید" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                    
                    <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                سیستم مکاتبات اداری
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                                مدیریت یکپارچه نامه‌های اداری، گردش کار هوشمند و بایگانی دیجیتال
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    href={login()}
                                    className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition"
                                >
                                    ورود به سیستم
                                </Link>
                                <Link
                                    href={register()}
                                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition"
                                >
                                    ثبت‌نام <ArrowLeft className="inline h-4 w-4 mr-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                امکانات سیستم
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                تمام ابزارهای مورد نیاز برای مدیریت مکاتبات اداری
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-4">
                                {features.map((feature) => (
                                    <div key={feature.title} className="flex flex-col items-center text-center">
                                        <div className="rounded-lg bg-blue-50 p-3 ring-1 ring-blue-100">
                                            <feature.icon className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                                        <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}