// resources/js/pages/settings/index.tsx

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Save, Bell, Shield, Globe, Database, Mail, Lock, Users } from 'lucide-react';

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

export default function SystemSettings({ settings }: Props) {
    const [activeTab, setActiveTab] = useState<'general' | 'mail' | 'security' | 'upload'>('general');

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
        });
    };

    const tabs = [
        { id: 'general', label: 'عمومی', icon: Globe },
        { id: 'mail', label: 'تنظیمات ایمیل', icon: Mail },
        { id: 'security', label: 'امنیت', icon: Shield },
        { id: 'upload', label: 'آپلود فایل', icon: Database },
    ];

    return (
        <>
            <Head title="تنظیمات سیستم" />

            <div className="max-w-4xl mx-auto py-6">
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">تنظیمات سیستم</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            مدیریت تنظیمات عمومی و پیکربندی سیستم
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex gap-4 flex-wrap">
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

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نام سیستم
                                    </label>
                                    <input
                                        type="text"
                                        value={data.app_name}
                                        onChange={(e) => setData('app_name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        زبان پیش‌فرض
                                    </label>
                                    <select
                                        value={data.app_locale}
                                        onChange={(e) => setData('app_locale', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="fa">فارسی</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        مدت زمان نشست (دقیقه)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.session_lifetime}
                                        onChange={(e) => setData('session_lifetime', parseInt(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Mail Settings */}
                        {activeTab === 'mail' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        سرور SMTP
                                    </label>
                                    <input
                                        type="text"
                                        value={data.mail_host}
                                        onChange={(e) => setData('mail_host', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        پورت
                                    </label>
                                    <input
                                        type="text"
                                        value={data.mail_port}
                                        onChange={(e) => setData('mail_port', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نام کاربری
                                    </label>
                                    <input
                                        type="text"
                                        value={data.mail_username}
                                        onChange={(e) => setData('mail_username', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        رمز عبور
                                    </label>
                                    <input
                                        type="password"
                                        value={data.mail_password}
                                        onChange={(e) => setData('mail_password', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        رمزنگاری
                                    </label>
                                    <select
                                        value={data.mail_encryption}
                                        onChange={(e) => setData('mail_encryption', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                        <option value="">بدون رمزنگاری</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            احراز هویت دو مرحله‌ای
                                        </label>
                                        <p className="text-xs text-gray-500">افزایش امنیت حساب کاربری</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('two_factor_enabled', !data.two_factor_enabled)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                            data.two_factor_enabled ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                                data.two_factor_enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Upload Settings */}
                        {activeTab === 'upload' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        حداکثر حجم فایل (KB)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.max_upload_size}
                                        onChange={(e) => setData('max_upload_size', parseInt(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        فرمت‌های مجاز
                                    </label>
                                    <input
                                        type="text"
                                        value={data.allowed_file_types}
                                        onChange={(e) => setData('allowed_file_types', e.target.value)}
                                        placeholder="pdf,doc,docx,jpg,png"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">فرمت‌ها را با کاما جدا کنید</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                <Save className="ml-2 h-4 w-4" />
                                {processing ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}