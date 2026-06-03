import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, UserIcon, Mail, Phone, Hash, Camera,
    Lock, Eye, EyeOff, CheckCircle, AlertCircle,
    Briefcase, Building2, Calendar, Shield, LogOut,
    Smartphone, IdCard, Globe, Moon, Sun, Bell,
    Database, Key, Fingerprint, UserCheck, Clock
} from 'lucide-react';
import { Settings } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import passwordRoute from '@/routes/password';
import profile from '@/routes/profile';
import users from '@/routes/users';

// ─── Toast Notification Component ──────────────────────────────────────────
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up ${type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}>
            {type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
};

// ─── Shared Field Components ───────────────────────────────────────────────
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {children}
            {required && <span className="text-rose-400 mr-1">*</span>}
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
                ? 'opacity-60 bg-gray-50 border-gray-200'
                : error
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : 'border-gray-200 hover:border-gray-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'
                }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-gray-400 pointer-events-none" />}
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} ${suffix ? 'pl-10' : 'pl-4'} py-3 text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-300 disabled:cursor-not-allowed`}
                />
                {suffix && <div className="absolute left-3.5">{suffix}</div>}
            </div>
            {error && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{error}
                </p>
            )}
        </div>
    );
}

// ─── Stats Card Component ──────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-lg font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
export default function ProfileSettings() {
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences'>('profile');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const user = (usePage().props as any).auth.user;
    const userStats = (usePage().props as any).userStats || { lettersCount: 0, activeSessions: 1, lastLogin: new Date() };

    const {
        data: profileData, setData: setProfileData,
        patch: patchProfile, processing: profileProcessing, errors: profileErrors
    } = useForm({
        first_name: user.first_name || user.name?.split(' ')[0] || '',
        last_name: user.last_name || (user.name?.split(' ')[1] || ''),
        email: user.email,
        mobile: user?.mobile || '',
        national_code: user.national_code || '',
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

    const {
        data: preferencesData, setData: setPreferencesData,
        patch: patchPreferences, processing: preferencesProcessing
    } = useForm({
        language: user.language || 'fa',
        theme: user.theme || 'light',
        notifications: user.notifications !== false,
    });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patchProfile(users.update, {
            preserveScroll: true,
            onSuccess: () => {
                showToast('اطلاعات شخصی با موفقیت به‌روزرسانی شد', 'success');
            },
            onError: () => {
                showToast('خطا در به‌روزرسانی اطلاعات', 'error');
            }
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postPassword(passwordRoute.update(), {
            preserveScroll: true,
            onSuccess: () => {
                resetPassword();
                showToast('رمز عبور با موفقیت تغییر کرد', 'success');
            },
            onError: (errors) => {
                showToast(errors.current_password?.[0] || 'خطا در تغییر رمز عبور', 'error');
            },
        });
    };

    const handlePreferencesSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patchPreferences(profile.preferences(), {
            preserveScroll: true,
            onSuccess: () => {
                showToast('تنظیمات با موفقیت ذخیره شد', 'success');
            },
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
return;
}

        if (file.size > 2 * 1024 * 1024) {
            showToast('حجم فایل نباید بیشتر از 2 مگابایت باشد', 'error');

            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('avatar', file);
        router.post(profile.avatar(), formData, {
            preserveScroll: true,
            onSuccess: () => showToast('عکس پروفایل با موفقیت تغییر کرد', 'success'),
            onError: () => showToast('خطا در تغییر عکس پروفایل', 'error')
        });
    };

    const tabs = [
        { id: 'profile', label: 'اطلاعات شخصی', icon: UserIcon, color: 'indigo' },
        { id: 'password', label: 'تغییر رمز عبور', icon: Key, color: 'amber' },
        { id: 'preferences', label: 'تنظیمات', icon: Settings, color: 'emerald' },
    ];

    const avatarSrc = avatarPreview || user.avatar || null;
    const fullName = `${profileData.first_name} ${profileData.last_name}`.trim() || user.full_name || user.name;
    const initials = (profileData.first_name?.charAt(0) || user.name?.charAt(0) || '') +
        (profileData.last_name?.charAt(0) || (user.name?.split(' ')[1]?.charAt(0) || ''));

    return (
        <>
            <Head title="تنظیمات پروفایل" />

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50" dir="rtl">

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                                    <UserIcon className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-sm font-bold text-gray-800">تنظیمات پروفایل</h1>
                                    <p className="text-xs text-gray-400">مدیریت اطلاعات و تنظیمات حساب کاربری</p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.post('/logout')}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                خروج
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* ── Sidebar ── */}
                        <div className="lg:col-span-1 space-y-5">
                            {/* User Identity Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                                <div className="relative">
                                    <div className="h-24 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700">
                                        <div className="absolute inset-0 opacity-20">
                                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full blur-2xl" />
                                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full blur-2xl" />
                                        </div>
                                    </div>
                                    <div className="px-5 pb-5">
                                        <div className="flex items-end gap-4 -mt-10 mb-4">
                                            <div className="relative">
                                                <div className="h-20 w-20 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-black overflow-hidden">
                                                    {avatarSrc
                                                        ? <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
                                                        : <span className="text-2xl">{initials || '👤'}</span>
                                                    }
                                                </div>
                                                <label className="absolute -bottom-1.5 -left-1.5 h-7 w-7 bg-indigo-500 hover:bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer shadow-md transition-all hover:scale-105">
                                                    <Camera className="h-3.5 w-3.5 text-white" />
                                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                                </label>
                                            </div>
                                            <div className="pb-1">
                                                <h2 className="text-lg font-bold text-gray-800">{fullName || 'کاربر گرامی'}</h2>
                                                <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                                                {user.primary_position?.name && (
                                                    <span className="inline-flex items-center gap-1 mt-1.5 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                        <Briefcase className="h-3 w-3" />
                                                        {user.primary_position.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                            {user.department?.name && (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                                                    <Building2 className="h-3 w-3" />
                                                    {user.department.name}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                                                <Clock className="h-3 w-3" />
                                                عضویت: {new Date(user.created_at).toLocaleDateString('fa-IR')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-3">
                                <StatCard icon={Database} label="تعداد نامه‌ها" value={userStats.lettersCount || 0} color="bg-indigo-500" />
                                <StatCard icon={Globe} label="آخرین ورود" value={userStats.lastLogin ? new Date(userStats.lastLogin).toLocaleDateString('fa-IR') : 'امروز'} color="bg-emerald-500" />
                            </div>

                            {/* Security Status */}
                            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/30 rounded-xl p-4 border border-indigo-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-4 w-4 text-indigo-600" />
                                    <span className="text-xs font-bold text-indigo-700">وضعیت امنیتی</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">احراز هویت دو مرحله‌ای</span>
                                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" /> فعال
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs mt-2">
                                    <span className="text-gray-600">جلسات فعال</span>
                                    <span className="text-gray-700 font-medium">{userStats.activeSessions || 1} دستگاه</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Main Content ── */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* Tab Navigation */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1.5">
                                {tabs.map(tab => {
                                    const Icon = tab.icon;
                                    const colors = {
                                        indigo: { active: 'bg-indigo-600 text-white', inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50' },
                                        amber: { active: 'bg-amber-500 text-white', inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50' },
                                        emerald: { active: 'bg-emerald-500 text-white', inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50' }
                                    };
                                    const colorSet = colors[tab.color as keyof typeof colors];

                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === tab.id ? colorSet.active : colorSet.inactive
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Profile Form */}
                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                                                <UserIcon className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-gray-800">اطلاعات شخصی</h2>
                                                <p className="text-xs text-gray-400">مشخصات هویتی و اطلاعات تماس</p>
                                            </div>
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
                                                    icon={UserIcon}
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
                                                <p className="text-xs text-gray-400 mt-1.5">ایمیل به عنوان نام کاربری استفاده می‌شود</p>
                                            </div>
                                            <div>
                                                <FieldLabel>تلفن همراه</FieldLabel>
                                                <Field
                                                    icon={Smartphone}
                                                    type="tel"
                                                    value={profileData.mobile}
                                                    onChange={v => setProfileData('mobile', v)}
                                                    placeholder="09123456789"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>کد ملی</FieldLabel>
                                                <Field
                                                    icon={IdCard}
                                                    value={profileData.national_code}
                                                    disabled
                                                    placeholder="—"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-gray-100">
                                            <button
                                                type="submit"
                                                disabled={profileProcessing}
                                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm disabled:opacity-50"
                                            >
                                                <Save className="h-4 w-4" />
                                                {profileProcessing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Password Form */}
                            {activeTab === 'password' && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center">
                                                <Key className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-gray-800">تغییر رمز عبور</h2>
                                                <p className="text-xs text-gray-400">برای امنیت بیشتر از رمز قوی استفاده کنید</p>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
                                        {/* Security tip */}
                                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                            <Shield className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-amber-700 leading-relaxed">
                                                رمز عبور باید حداقل ۸ کاراکتر داشته باشد و ترکیبی از حروف بزرگ، حروف کوچک، اعداد و نمادها باشد.
                                            </p>
                                        </div>

                                        <div>
                                            <FieldLabel required>رمز عبور فعلی</FieldLabel>
                                            <Field
                                                icon={Lock}
                                                type={showCurrentPw ? 'text' : 'password'}
                                                value={passwordData.current_password}
                                                onChange={v => setPasswordData('current_password', v)}
                                                error={passwordErrors.current_password}
                                                placeholder="••••••••"
                                                suffix={
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPw(p => !p)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                }
                                            />
                                        </div>

                                        <div className="border-t border-gray-100" />

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
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                }
                                            />
                                            {passwordData.password && passwordData.password.length < 8 && (
                                                <p className="text-amber-500 text-xs mt-1.5 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> رمز عبور باید حداقل ۸ کاراکتر باشد
                                                </p>
                                            )}
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
                                            {passwordData.password && passwordData.password_confirmation &&
                                                passwordData.password !== passwordData.password_confirmation && (
                                                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" /> رمز عبور با تکرار آن مطابقت ندارد
                                                    </p>
                                                )}
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-gray-100">
                                            <button
                                                type="submit"
                                                disabled={passwordProcessing}
                                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-all shadow-sm disabled:opacity-50"
                                            >
                                                <Key className="h-4 w-4" />
                                                {passwordProcessing ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Preferences Form */}
                            {activeTab === 'preferences' && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                                <Settings className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-gray-800">تنظیمات برنامه</h2>
                                                <p className="text-xs text-gray-400">سفارشی‌سازی تجربه کاربری</p>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePreferencesSubmit} className="p-6 space-y-5">
                                        <div>
                                            <FieldLabel>زبان برنامه</FieldLabel>
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setPreferencesData('language', 'fa')}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border transition-all ${preferencesData.language === 'fa'
                                                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <Globe className="h-4 w-4" />
                                                    فارسی
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPreferencesData('language', 'en')}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border transition-all ${preferencesData.language === 'en'
                                                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <Globe className="h-4 w-4" />
                                                    English
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <FieldLabel>تم برنامه</FieldLabel>
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setPreferencesData('theme', 'light')}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border transition-all ${preferencesData.theme === 'light'
                                                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <Sun className="h-4 w-4" />
                                                    روشن
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPreferencesData('theme', 'dark')}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border transition-all ${preferencesData.theme === 'dark'
                                                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <Moon className="h-4 w-4" />
                                                    تیره
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <Bell className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">اعلان‌های سیستمی</p>
                                                        <p className="text-xs text-gray-400">دریافت اعلان‌های مربوط به نامه‌ها و وظایف</p>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={preferencesData.notifications}
                                                        onChange={(e) => setPreferencesData('notifications', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-gray-100">
                                            <button
                                                type="submit"
                                                disabled={preferencesProcessing}
                                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shadow-sm disabled:opacity-50"
                                            >
                                                <Save className="h-4 w-4" />
                                                {preferencesProcessing ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
        </>
    );
}
