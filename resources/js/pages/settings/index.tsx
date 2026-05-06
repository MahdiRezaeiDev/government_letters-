import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, Shield, Globe, Database, Mail, Settings,
    CheckCircle, Server, Lock, FileType, Clock, Hash
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    settings: {
        app_name: string;
        app_locale: string;
        mail_host: string;
        mail_port: string;
        mail_username: string;
        mail_encryption: string;
        two_factor_enabled: boolean;
        session_lifetime: number;
        max_upload_size: number;
        allowed_file_types: string;
    };
}

// ─── Shared Field Components ───────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {children}
        </label>
    );
}

function FieldHint({ children }: { children: React.ReactNode }) {
    return <p className="text-xs text-slate-400 mt-1.5">{children}</p>;
}

function InputField({
    icon: Icon, type = 'text', value, onChange, placeholder
}: {
    icon?: React.ElementType; type?: string; value: string | number;
    onChange: (v: string) => void; placeholder?: string;
}) {
    return (
        <div className="relative flex items-center rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200">
            {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none flex-shrink-0" />}
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-4 py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300`}
            />
        </div>
    );
}

function SelectField({
    icon: Icon, value, onChange, children
}: {
    icon?: React.ElementType; value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
    return (
        <div className="relative flex items-center rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200">
            {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-9 py-3 text-sm bg-transparent focus:outline-none appearance-none text-slate-700`}
            >
                {children}
            </select>
            <svg className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    );
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────

function ToggleRow({
    label, desc, value, onChange, color = '#6366f1'
}: {
    label: string; desc: string; value: boolean; onChange: (v: boolean) => void; color?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
            <button
                type="button"
                onClick={() => onChange(!value)}
                style={value ? { backgroundColor: color } : {}}
                className={`relative flex-shrink-0 h-6 w-11 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${value ? 'ring-indigo-300' : 'bg-slate-200'
                    }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${value ? 'right-1' : 'left-1'
                        }`}
                />
            </button>
        </div>
    );
}

// ─── Section Card wrapper (no tabs) ───────────────────────────────────────

function SectionCard({ icon: Icon, iconColor, title, subtitle, children }: {
    icon: React.ElementType; iconColor: string; title: string; subtitle: string; children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconColor + '18' }}>
                    <Icon className="h-4 w-4" style={{ color: iconColor }} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-800">{title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function SystemSettings({ settings }: Props) {
    const [activeTab, setActiveTab] = useState<'general' | 'mail' | 'security' | 'upload'>('general');
    const [saved, setSaved] = useState(false);

    const { data, setData, patch, processing } = useForm({
        app_name: settings.app_name,
        app_locale: settings.app_locale,
        session_lifetime: settings.session_lifetime,
        two_factor_enabled: settings.two_factor_enabled,
        max_upload_size: settings.max_upload_size,
        allowed_file_types: settings.allowed_file_types,
        mail_host: settings.mail_host,
        mail_port: settings.mail_port,
        mail_username: settings.mail_username,
        mail_encryption: settings.mail_encryption,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            },
        });
    };

    const tabs = [
        { id: 'general', label: 'عمومی', icon: Globe, color: '#6366f1' },
        { id: 'mail', label: 'ایمیل', icon: Mail, color: '#0ea5e9' },
        { id: 'security', label: 'امنیت', icon: Shield, color: '#10b981' },
        { id: 'upload', label: 'آپلود فایل', icon: Database, color: '#f59e0b' },
    ];

    const activeTabCfg = tabs.find(t => t.id === activeTab)!;

    return (
        <>
            <Head title="تنظیمات سیستم" />

            <div className="min-h-screen bg-slate-50/70" dir="rtl">

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 tracking-wide">
                                    تنظیمات
                                </span>
                                <span className="text-slate-300 text-lg font-light">/</span>
                                <h1 className="text-sm font-bold text-slate-800">تنظیمات سیستم</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                {saved && (
                                    <span className="scale-in inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                                        <CheckCircle className="h-3.5 w-3.5" />
                                        ذخیره شد
                                    </span>
                                )}
                                <button
                                    type="submit"
                                    form="settings-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                    <form id="settings-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* ── Intro strip ── */}
                            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-l from-indigo-50 to-slate-50 px-6 py-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-slate-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Settings className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">تنظیمات سیستم</p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        پیکربندی عمومی، ایمیل، امنیت و آپلود فایل
                                    </p>
                                </div>
                            </div>

                            {/* ── Tab Nav ── */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 grid grid-cols-4 gap-1.5">
                                {tabs.map(tab => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id as any)}
                                            style={isActive ? { backgroundColor: tab.color } : {}}
                                            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${isActive ? 'text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            <tab.icon className="h-4 w-4 flex-shrink-0" />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ── General Tab ── */}
                            {activeTab === 'general' && (
                                <SectionCard icon={Globe} iconColor="#6366f1" title="تنظیمات عمومی" subtitle="نام، زبان و مدت نشست سیستم">
                                    <div className="space-y-5 fade-up">
                                        <div>
                                            <FieldLabel>نام سیستم</FieldLabel>
                                            <InputField
                                                icon={Settings}
                                                value={data.app_name}
                                                onChange={v => setData('app_name', v)}
                                                placeholder="سیستم مدیریت مکتوب ها"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>زبان پیش‌فرض</FieldLabel>
                                            <SelectField
                                                icon={Globe}
                                                value={data.app_locale}
                                                onChange={v => setData('app_locale', v)}
                                            >
                                                <option value="fa">فارسی</option>
                                                <option value="en">English</option>
                                            </SelectField>
                                        </div>
                                        <div>
                                            <FieldLabel>مدت زمان نشست (دقیقه)</FieldLabel>
                                            <InputField
                                                icon={Clock}
                                                type="number"
                                                value={data.session_lifetime}
                                                onChange={v => setData('session_lifetime', parseInt(v))}
                                                placeholder="120"
                                            />
                                            <FieldHint>کاربر پس از این مدت بی‌فعالیت از سیستم خارج می‌شود.</FieldHint>
                                        </div>
                                    </div>
                                </SectionCard>
                            )}

                            {/* ── Mail Tab ── */}
                            {activeTab === 'mail' && (
                                <SectionCard icon={Mail} iconColor="#0ea5e9" title="تنظیمات ایمیل" subtitle="پیکربندی سرور SMTP برای ارسال ایمیل">
                                    <div className="space-y-5 fade-up">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <FieldLabel>سرور SMTP</FieldLabel>
                                                <InputField
                                                    icon={Server}
                                                    value={data.mail_host}
                                                    onChange={v => setData('mail_host', v)}
                                                    placeholder="smtp.example.com"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>پورت</FieldLabel>
                                                <InputField
                                                    icon={Hash}
                                                    value={data.mail_port}
                                                    onChange={v => setData('mail_port', v)}
                                                    placeholder="587"
                                                />
                                            </div>
                                        </div>
                                        <div className="border-t border-slate-100" />
                                        <div>
                                            <FieldLabel>نام کاربری</FieldLabel>
                                            <InputField
                                                icon={Mail}
                                                value={data.mail_username}
                                                onChange={v => setData('mail_username', v)}
                                                placeholder="noreply@example.com"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>رمز عبور</FieldLabel>
                                            <InputField
                                                icon={Lock}
                                                type="password"
                                                value={data.mail_password ?? ''}
                                                onChange={v => setData('mail_password', v)}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>رمزنگاری</FieldLabel>
                                            <SelectField
                                                icon={Shield}
                                                value={data.mail_encryption}
                                                onChange={v => setData('mail_encryption', v)}
                                            >
                                                <option value="tls">TLS</option>
                                                <option value="ssl">SSL</option>
                                                <option value="">بدون رمزنگاری</option>
                                            </SelectField>
                                        </div>
                                    </div>
                                </SectionCard>
                            )}

                            {/* ── Security Tab ── */}
                            {activeTab === 'security' && (
                                <SectionCard icon={Shield} iconColor="#10b981" title="تنظیمات امنیتی" subtitle="کنترل دسترسی و احراز هویت">
                                    <div className="fade-up divide-y divide-slate-100">
                                        <ToggleRow
                                            label="احراز هویت دو مرحله‌ای"
                                            desc="افزایش امنیت ورود کاربران با تأیید هویت اضافی"
                                            value={data.two_factor_enabled}
                                            onChange={v => setData('two_factor_enabled', v)}
                                            color="#10b981"
                                        />
                                        {/* Expandable hint when 2FA is on */}
                                        {data.two_factor_enabled && (
                                            <div className="pt-4 fade-up">
                                                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3.5">
                                                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                    <p className="text-xs text-emerald-700 leading-relaxed">
                                                        احراز هویت دو مرحله‌ای فعال است. کاربران در هنگام ورود کد تأیید دریافت خواهند کرد.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </SectionCard>
                            )}

                            {/* ── Upload Tab ── */}
                            {activeTab === 'upload' && (
                                <SectionCard icon={Database} iconColor="#f59e0b" title="تنظیمات آپلود فایل" subtitle="محدودیت حجم و فرمت‌های مجاز">
                                    <div className="space-y-5 fade-up">
                                        <div>
                                            <FieldLabel>حداکثر حجم فایل (KB)</FieldLabel>
                                            <InputField
                                                icon={Database}
                                                type="number"
                                                value={data.max_upload_size}
                                                onChange={v => setData('max_upload_size', parseInt(v))}
                                                placeholder="10240"
                                            />
                                            <FieldHint>
                                                معادل {data.max_upload_size ? (data.max_upload_size / 1024).toFixed(1) : '0'} مگابایت
                                            </FieldHint>
                                        </div>
                                        <div>
                                            <FieldLabel>فرمت‌های مجاز</FieldLabel>
                                            <InputField
                                                icon={FileType}
                                                value={data.allowed_file_types}
                                                onChange={v => setData('allowed_file_types', v)}
                                                placeholder="pdf,doc,docx,jpg,png"
                                            />
                                            <FieldHint>فرمت‌ها را با کاما و بدون فاصله جدا کنید.</FieldHint>
                                            {/* Live tag preview */}
                                            {data.allowed_file_types && (
                                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                                    {data.allowed_file_types.split(',').filter(Boolean).map((ext, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100"
                                                        >
                                                            .{ext.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </SectionCard>
                            )}

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}