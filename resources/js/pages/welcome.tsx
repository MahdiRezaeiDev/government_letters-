// resources/js/pages/welcome.tsx

import { Head, Link } from '@inertiajs/react';
import { 
    FileText, Users, Building2, Clock, ArrowLeft, 
    Mail, Send, Archive, CheckCircle, Shield, Zap,
    ChevronLeft, Award} from 'lucide-react';
import { useState, useEffect } from 'react';
import { login } from '@/routes';

export default function Welcome() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: FileText,
            title: 'مدیریت نامه‌ها',
            description: 'ثبت، پیگیری و بایگانی انواع نامه‌های اداری',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: Send,
            title: 'گردش کار',
            description: 'ارجاع خودکار نامه‌ها و پیگیری وضعیت',
            color: 'from-green-500 to-green-600',
        },
        {
            icon: Building2,
            title: 'ساختار سازمانی',
            description: 'مدیریت دپارتمان‌ها و سمت‌ها',
            color: 'from-purple-500 to-purple-600',
        },
        {
            icon: Clock,
            title: 'کارتابل شخصی',
            description: 'مشاهده و پاسخ به ارجاعات',
            color: 'from-orange-500 to-orange-600',
        },
        {
            icon: Archive,
            title: 'بایگانی دیجیتال',
            description: 'ذخیره و بازیابی آسان اسناد',
            color: 'from-gray-500 to-gray-600',
        },
        {
            icon: Shield,
            title: 'امنیت بالا',
            description: 'محافظت از اطلاعات با رمزنگاری پیشرفته',
            color: 'from-red-500 to-red-600',
        },
        {
            icon: Zap,
            title: 'سرعت بالا',
            description: 'پاسخگویی سریع و بهینه',
            color: 'from-yellow-500 to-yellow-600',
        },
        {
            icon: Award,
            title: 'گزارشات حرفه‌ای',
            description: 'تحلیل داده‌ها و گزارشات پیشرفته',
            color: 'from-indigo-500 to-indigo-600',
        },
    ];

    const stats = [
        { label: 'نامه‌های ثبت شده', value: '۱۰,۰۰۰+', icon: Mail },
        { label: 'کاربران فعال', value: '۵۰۰+', icon: Users },
        { label: 'دپارتمان‌ها', value: '۵۰+', icon: Building2 },
        { label: 'رضایت کاربران', value: '۹۸٪', icon: CheckCircle },
    ];

    return (
        <>
            <Head title="سیستم مکاتبات اداری" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                
                {/* Navbar */}
                <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-bold text-gray-800">سیستم مکاتبات</span>
                            </div>
                            <div className="flex gap-4">
                                <Link
                                    href={login()}
                                    className="text-sm font-medium px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                                >
                                  ورود
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative overflow-hidden pt-20">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-grid-slate-100 mask-[radial-gradient(ellipse_at_center,white,transparent)] opacity-50" />
                    
                    <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                        <div className="text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-3 py-1 mb-6">
                                <span className="text-blue-600 text-xs font-medium">نسخه ۲.۰</span>
                            </div>
                            
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                مدیریت هوشمند
                                <span className="text-blue-600"> مکاتبات اداری</span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                                سیستمی کامل برای ثبت، پیگیری و بایگانی نامه‌های اداری با گردش کار هوشمند و امنیت بالا
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    href={login()}
                                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition flex items-center gap-1"
                                >
                                    ورود به سیستم
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                                {stats.map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <stat.icon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                        <div className="text-sm text-gray-500">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                امکانات حرفه‌ای
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                                تمام ابزارهای مورد نیاز برای مدیریت مکاتبات اداری در یک پلتفرم
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => (
                                <div 
                                    key={feature.title} 
                                    className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                                    <div className="relative">
                                        <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${feature.color} shadow-lg mb-4`}>
                                            <feature.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-linear-to-r from-blue-600 to-indigo-700 py-16">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            آماده شروع هستید؟
                        </h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                            امروز شروع کنید و مدیریت مکاتبات خود را متحول کنید
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-100 py-12">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex justify-center gap-6 mb-6">
                                <Link href={login()} className="text-sm text-gray-500 hover:text-gray-700">
                                    ورود
                                </Link>
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                                    تماس با ما
                                </a>
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                                    درباره ما
                                </a>
                            </div>
                            <p className="text-sm text-gray-400">
                                &copy; {new Date().getFullYear()} سیستم مکاتبات اداری. تمامی حقوق محفوظ است.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}