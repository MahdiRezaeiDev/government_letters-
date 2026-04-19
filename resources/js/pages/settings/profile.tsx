import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, UserIcon, Mail, Phone, Hash, Camera,
    Lock, Eye, EyeOff, CheckCircle, AlertCircle,
    Briefcase, Building2, Calendar, Shield
} from 'lucide-react';
import React, { useState } from 'react';
import passwordRoute from '@/routes/password';
import profile from '@/routes/profile';
import users from '@/routes/users';

// ─── Shared Field Components ───────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {children}
            {required && <span className="text-teal-400 mr-1">*</span>}
        </label>
    );
}

function Field({
    icon: Icon, type = 'text', value, onChange, error, placeholder, disabled = false, suffix
}: {
    icon?: React.ElementType; type?: string; value: string; onChange?: (v: string) => void;
    error?: string | null; placeholder?: string; disabled?: boolean; suffix?: React.ReactNode;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${disabled
                ? 'opacity-60 bg-slate-50 border-slate-200'
                : error
                    ? 'border-teal-300 ring-1 ring-teal-300'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100'
                }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none flex-shrink-0" />}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} ${suffix ? 'pl-10' : 'pl-4'} py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300 ${disabled ? 'cursor-not-allowed' : ''}`}
                />
                {suffix && <div className="absolute left-3.5">{suffix}</div>}
            </div>
            {error && (
                <p className="text-teal-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />{error}
                </p>
            )}
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function ProfileSettings() {
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
    const [profileSaved, setProfileSaved] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);

    const user = (usePage().props as any).auth.user;

    const {
        data: profileData, setData: setProfileData,
        patch: patchProfile, processing: profileProcessing, errors: profileErrors
    } = useForm({
        first_name: user.name,
        last_name: user.last_name,
        email: user.email,
        mobile: user?.mobile || '',
        national_code: user.national_code,
    });

    const {
        data: passwordData, setData: setPasswordData,
        post: postPassword, processing: passwordProcessing, errors: passwordErrors,
        reset: resetPassword
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patchProfile(users.update, {
            preserveScroll: true,
            onSuccess: () => {
                setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000);
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postPassword(passwordRoute.update(), {
            preserveScroll: true,
            onSuccess: () => {
                resetPassword();
                setPasswordSaved(true);
                setTimeout(() => setPasswordSaved(false), 3000);
            },
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
        const formData = new FormData();
        formData.append('avatar', file);
        router.post(profile.avatar(), formData, { preserveScroll: true });
    };

    const tabs = [
        { id: 'profile', label: 'اطلاعات شخصی', icon: UserIcon },
        { id: 'password', label: 'تغییر رمز عبور', icon: Lock },
    ];

    const avatarSrc = avatarPreview || user.avatar;
    const initials = `${user.name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`;

    return (
        <>
            <Head title="تنظیمات پروفایل" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
                * { font-family: 'Vazirmatn', sans-serif; }
                :root { direction: rtl; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.25s ease-out both; }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to   { opacity: 1; transform: scale(1); }
                }
                .scale-in { animation: scaleIn 0.2s ease-out both; }
            `}</style>

            <div className="min-h-screen bg-slate-50/70" dir="rtl">

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center h-16">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 tracking-wide">
                                    تنظیمات
                                </span>
                                <span className="text-slate-300 text-lg font-light">/</span>
                                <h1 className="text-sm font-bold text-slate-800">پروفایل</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                    <div className="space-y-5">

                        {/* ── User Identity Card ── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            {/* Decorative gradient bar */}
                            <div className="h-20 bg-gradient-to-l from-teal-500 to-teal-600 relative">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full blur-2xl" />
                                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full blur-2xl" />
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                {/* Avatar — overlaps gradient */}
                                <div className="flex items-end gap-5 -mt-8 mb-4">
                                    <div className="relative flex-shrink-0">
                                        <div className="h-20 w-20 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-black overflow-hidden">
                                            {avatarSrc
                                                ? <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
                                                : initials
                                            }
                                        </div>
                                        <label className="absolute -bottom-1.5 -left-1.5 h-7 w-7 bg-teal-600 hover:bg-teal-700 rounded-xl flex items-center justify-center cursor-pointer shadow-md transition-colors">
                                            <Camera className="h-3.5 w-3.5 text-white" />
                                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                        </label>
                                    </div>
                                    <div className="pb-1 min-w-0">
                                        <p className="text-lg font-black text-slate-800 leading-tight">{user.full_name}</p>
                                        <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
                                    </div>
                                </div>

                                {/* Meta chips */}
                                <div className="flex flex-wrap gap-2">
                                    {user.primary_position?.name && (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                                            <Briefcase className="h-3 w-3 text-slate-400" />
                                            {user.primary_position.name}
                                        </span>
                                    )}
                                    {user.department?.name && (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                                            <Building2 className="h-3 w-3 text-slate-400" />
                                            {user.department.name}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                                        <Calendar className="h-3 w-3 text-slate-400" />
                                        عضویت از {new Date(user.created_at).toLocaleDateString('fa-IR')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── Tab Nav ── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 flex gap-1.5">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-teal-600 text-white shadow-md'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ── Profile Form ── */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden fade-up">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                                        <UserIcon className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">اطلاعات شخصی</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">مشخصات هویتی و تماس</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel required>نام</FieldLabel>
                                            <Field
                                                icon={UserIcon}
                                                value={profileData.first_name}
                                                onChange={v => setProfileData('first_name', v)}
                                                error={profileErrors.first_name}
                                                placeholder="علی"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel required>نام خانوادگی</FieldLabel>
                                            <Field
                                                value={profileData.last_name}
                                                onChange={v => setProfileData('last_name', v)}
                                                error={profileErrors.last_name}
                                                placeholder="رضایی"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel required>ایمیل</FieldLabel>
                                            <Field
                                                icon={Mail}
                                                type="email"
                                                value={profileData.email}
                                                onChange={v => setProfileData('email', v)}
                                                error={profileErrors.email}
                                                placeholder="ali@example.com"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>تلفن همراه</FieldLabel>
                                            <Field
                                                icon={Phone}
                                                type="tel"
                                                value={profileData.mobile}
                                                onChange={v => setProfileData('mobile', v)}
                                                placeholder="09123456789"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>کد ملی</FieldLabel>
                                            <Field
                                                icon={Hash}
                                                value={profileData.national_code}
                                                disabled
                                                placeholder="—"
                                            />
                                            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                کد ملی قابل ویرایش نیست
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                                        {profileSaved && (
                                            <span className="scale-in inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                تغییرات ذخیره شد
                                            </span>
                                        )}
                                        <div className="mr-auto">
                                            <button
                                                type="submit"
                                                disabled={profileProcessing}
                                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Save className="h-4 w-4" />
                                                {profileProcessing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ── Password Form ── */}
                        {activeTab === 'password' && (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden fade-up">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                        <Lock className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">تغییر رمز عبور</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">برای امنیت بیشتر از رمز قوی استفاده کنید</p>
                                    </div>
                                </div>

                                <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
                                    {/* Security tip */}
                                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3.5">
                                        <Shield className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-amber-700 leading-relaxed">
                                            رمز عبور باید حداقل ۸ کاراکتر داشته باشد و ترکیبی از حروف، اعداد و نمادها باشد.
                                        </p>
                                    </div>

                                    <div>
                                        <FieldLabel required>رمز عبور فعلی</FieldLabel>
                                        <Field
                                            icon={Lock}
                                            type="password"
                                            value={passwordData.current_password}
                                            onChange={v => setPasswordData('current_password', v)}
                                            error={passwordErrors.current_password}
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    <div>
                                        <FieldLabel required>رمز عبور جدید</FieldLabel>
                                        <Field
                                            icon={Lock}
                                            type={showNewPw ? 'text' : 'password'}
                                            value={passwordData.password}
                                            onChange={v => setPasswordData('password', v)}
                                            error={passwordErrors.password}
                                            placeholder="••••••••"
                                            suffix={
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPw(p => !p)}
                                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            }
                                        />
                                    </div>

                                    <div>
                                        <FieldLabel required>تکرار رمز عبور جدید</FieldLabel>
                                        <Field
                                            icon={Lock}
                                            type="password"
                                            value={passwordData.password_confirmation}
                                            onChange={v => setPasswordData('password_confirmation', v)}
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                                        {passwordSaved && (
                                            <span className="scale-in inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                رمز عبور تغییر کرد
                                            </span>
                                        )}
                                        <div className="mr-auto">
                                            <button
                                                type="submit"
                                                disabled={passwordProcessing}
                                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Lock className="h-4 w-4" />
                                                {passwordProcessing ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}