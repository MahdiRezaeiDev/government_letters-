// resources/js/pages/welcome.tsx

import { Head, Link } from '@inertiajs/react';
import { 
    FileText, Users, Building2, Clock, 
    Shield, Zap, Award, LayoutDashboard, 
    ArrowRight, ChevronRight, Fingerprint, 
    Globe2, Sparkles, MousePointer2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { login } from '@/routes';

export default function Welcome() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: LayoutDashboard,
            title: 'داشبورد مدیریتی',
            description: 'نمای ۳۶۰ درجه از وضعیت مکاتبات و پایش زنده فرآیندها',
            tag: 'جدید'
        },
        {
            icon: Fingerprint,
            title: 'امنیت بیومتریک',
            description: 'سطوح دسترسی پیشرفته و رمزنگاری لایه به لایه اسناد',
            tag: 'امنیت'
        },
        {
            icon: Globe2,
            title: 'دسترسی ابری',
            description: 'مدیریت نامه‌ها در هر زمان و مکان با همگام‌سازی آنی',
            tag: 'دسترسی'
        },
        {
            icon: Sparkles,
            title: 'هوش مصنوعی',
            description: 'دسته‌بندی خودکار و خلاصه‌سازی نامه‌ها با موتور هوشمند',
            tag: 'هوشمند'
        }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] text-slate-900 font-[vazir,system-ui] selection:bg-indigo-100 selection:text-indigo-700">
            <Head title="اتوماسیون اداری نسل نو" />

            {/* Glass Navigation */}
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
                scrolled ? 'py-3 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' : 'py-6 bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                <FileText className="h-5 w-5 text-indigo-600" />
                            </div>
                        </div>
                        <div>
                            <span className="block font-black text-xl tracking-tight text-slate-800">CORE</span>
                            <span className="block text-[10px] font-bold text-indigo-500 tracking-[0.2em] -mt-1 uppercase">Automation</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href={login()} className="hidden md:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                            مستندات
                        </Link>
                        <Link
                            href={login()}
                            className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full overflow-hidden transition-all hover:pr-8"
                        >
                            <span className="relative z-10">ورود به پنل</span>
                            <ChevronRight className="absolute left-4 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section: Modern Split Layout */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 text-right lg:text-right">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 mb-6">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span className="text-xs font-bold uppercase tracking-wider">نسل سوم اتوماسیون اداری</span>
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.15] mb-8">
                                    نامه‌هایتان را <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-600 via-blue-600 to-cyan-500">
                                        هوشمند مدیریت کنید
                                    </span>
                                </h1>
                                <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl">
                                    تجربه‌ای متفاوت از گردش کار اداری. سریع، ایمن و بدون کاغذ. 
                                    طراحی شده برای سازمان‌هایی که به آینده فکر می‌کنند.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95">
                                        شروع رایگان
                                    </button>
                                    <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                                        <MousePointer2 className="h-4 w-4" />
                                        مشاهده دموی زنده
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 relative w-full">
                                <div className="relative z-10 bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl p-4 overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    {/* Mockup Placeholder */}
                                    <div className="aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden relative">
                                        <div className="absolute top-0 w-full h-8 bg-slate-800/50 flex items-center gap-1.5 px-4">
                                            <div className="h-2 w-2 rounded-full bg-red-500/50" />
                                            <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                                            <div className="h-2 w-2 rounded-full bg-green-500/50" />
                                        </div>
                                        <div className="mt-12 px-6">
                                            <div className="h-4 w-1/3 bg-slate-700 rounded-full mb-8" />
                                            <div className="grid grid-cols-3 gap-4 mb-8">
                                                <div className="h-20 rounded-xl bg-indigo-500/20 border border-indigo-500/30" />
                                                <div className="h-20 rounded-xl bg-slate-700/30" />
                                                <div className="h-20 rounded-xl bg-slate-700/30" />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-3 w-full bg-slate-700/50 rounded-full" />
                                                <div className="h-3 w-5/6 bg-slate-700/50 rounded-full" />
                                                <div className="h-3 w-4/6 bg-slate-700/50 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute -top-10 -right-10 h-64 w-64 bg-indigo-200/50 rounded-full blur-3xl -z-10" />
                                <div className="absolute -bottom-10 -left-10 h-64 w-64 bg-blue-200/50 rounded-full blur-3xl -z-10" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features: Minimalist Grid */}
                <section className="py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {features.map((f, i) => (
                                <div key={i} className="group cursor-default">
                                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-indigo-200 group-hover:shadow-xl">
                                        <f.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <h3 className="text-xl font-bold text-slate-900">{f.title}</h3>
                                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-tighter">{f.tag}</span>
                                    </div>
                                    <p className="text-slate-500 leading-relaxed text-sm">
                                        {f.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section: Bold & Clean */}
                <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
                    </div>
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                            {[
                                { val: '۱۰,۰۰۰+', label: 'نامه روزانه' },
                                { val: '۵۰۰+', label: 'سازمان فعال' },
                                { val: '۹۹.۹٪', label: 'پایداری سیستم' },
                                { val: '۲۴/۷', label: 'پشتیبانی فنی' },
                            ].map((s, i) => (
                                <div key={i}>
                                    <div className="text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent italic">
                                        {s.val}
                                    </div>
                                    <div className="text-slate-400 text-sm font-medium tracking-widest">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Simple Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                        <div className="flex items-center gap-3 opacity-50 grayscale">
                            <FileText className="h-6 w-6" />
                            <span className="font-bold text-lg">CORE Automation</span>
                        </div>
                        <div className="flex gap-8 text-sm font-bold text-slate-500">
                            <a href="#" className="hover:text-indigo-600 transition-colors">قوانین</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">حریم خصوصی</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">امنیت</a>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200/60 text-center">
                        <p className="text-xs text-slate-400 font-medium">
                            &copy; {new Date().getFullYear()} تمامی حقوق برای سیستم مکاتبات هوشمند محفوظ است. طراحی شده با عشق در ایران.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}