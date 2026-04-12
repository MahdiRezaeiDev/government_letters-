// resources/js/pages/settings/profile.tsx

import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Save, UserIcon, Mail, Phone, CreditCard, Shield, Camera, Lock, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import passwordRoute from '@/routes/password';
import profile from '@/routes/profile';
import users from '@/routes/users';
import type { User } from '@/types';

interface Props {
    user: User;
}

export default function ProfileSettings({ user }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

    // فرم اطلاعات شخصی
    const { data: profileData, setData: setProfileData, patch: patchProfile, processing: profileProcessing, errors: profileErrors } = useForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile || '',
        national_code: user.national_code,
    });

    // فرم تغییر رمز عبور
    const { data: passwordData, setData: setPasswordData, post: postPassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patchProfile(users.update, {
            preserveScroll: true,
            onSuccess: () => {
                // نمایش پیام موفقیت
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postPassword(passwordRoute.update(), {
            preserveScroll: true,
            onSuccess: () => {
                resetPassword();
            },
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            
            // آپلود آواتار
            const formData = new FormData();
            formData.append('avatar', file);
            router.post(profile.avatar(), formData, {
                preserveScroll: true,
            });
        }
    };

    const tabs = [
        { id: 'profile', label: 'اطلاعات شخصی', icon: User },
        { id: 'password', label: 'تغییر رمز عبور', icon: Lock },
    ];

    return (
        <>
            <Head title="تنظیمات پروفایل" />

            <div className="max-w-4xl mx-auto py-6">
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">تنظیمات پروفایل</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            مدیریت اطلاعات شخصی و تنظیمات حساب کاربری
                        </p>
                    </div>

                    {/* Avatar Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : user.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        `${user.first_name[0]}${user.last_name[0]}`
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition">
                                    <Camera className="h-4 w-4 text-white" />
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                </label>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <p className="text-xs text-gray-400 mt-1">عضویت از {new Date(user.created_at).toLocaleDateString('fa-IR')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex gap-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                                        activeTab === tab.id
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Profile Form */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نام <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.first_name}
                                        onChange={(e) => setProfileData('first_name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {profileErrors.first_name && <p className="text-red-500 text-xs mt-1">{profileErrors.first_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نام خانوادگی <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.last_name}
                                        onChange={(e) => setProfileData('last_name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {profileErrors.last_name && <p className="text-red-500 text-xs mt-1">{profileErrors.last_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ایمیل <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData('email', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        تلفن همراه
                                    </label>
                                    <input
                                        type="tel"
                                        value={profileData.mobile}
                                        onChange={(e) => setProfileData('mobile', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        کد ملی
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.national_code}
                                        disabled
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={profileProcessing}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    <Save className="ml-2 h-4 w-4" />
                                    {profileProcessing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Password Form */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    رمز عبور فعلی <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {passwordErrors.current_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    رمز عبور جدید <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordErrors.password && <p className="text-red-500 text-xs mt-1">{passwordErrors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    تکرار رمز عبور جدید <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={passwordProcessing}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    <Lock className="ml-2 h-4 w-4" />
                                    {passwordProcessing ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}