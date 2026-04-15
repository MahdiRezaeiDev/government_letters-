// resources/js/components/DeleteConfirmationModal.tsx

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X, Trash2, User, Shield, Clock } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName: string;
    type?: 'user' | 'letter' | 'department' | 'organization' | 'archive' | 'case';
    isLoading?: boolean;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemName,
    type = 'user',
    isLoading = false
}: DeleteConfirmationModalProps) {
    
    const getTypeConfig = () => {
        switch (type) {
            case 'user':
                return {
                    icon: User,
                    color: 'red',
                    bgGradient: 'from-red-500 to-red-600',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    buttonBg: 'bg-red-600 hover:bg-red-700',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-700'
                };
            case 'letter':
                return {
                    icon: FileText,
                    color: 'amber',
                    bgGradient: 'from-amber-500 to-amber-600',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    buttonBg: 'bg-amber-600 hover:bg-amber-700',
                    borderColor: 'border-amber-200',
                    textColor: 'text-amber-700'
                };
            case 'department':
                return {
                    icon: Building2,
                    color: 'blue',
                    bgGradient: 'from-blue-500 to-blue-600',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    buttonBg: 'bg-blue-600 hover:bg-blue-700',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-700'
                };
            case 'organization':
                return {
                    icon: Building2,
                    color: 'purple',
                    bgGradient: 'from-purple-500 to-purple-600',
                    iconBg: 'bg-purple-100',
                    iconColor: 'text-purple-600',
                    buttonBg: 'bg-purple-600 hover:bg-purple-700',
                    borderColor: 'border-purple-200',
                    textColor: 'text-purple-700'
                };
            case 'archive':
                return {
                    icon: Archive,
                    color: 'slate',
                    bgGradient: 'from-slate-500 to-slate-600',
                    iconBg: 'bg-slate-100',
                    iconColor: 'text-slate-600',
                    buttonBg: 'bg-slate-600 hover:bg-slate-700',
                    borderColor: 'border-slate-200',
                    textColor: 'text-slate-700'
                };
            case 'case':
                return {
                    icon: FolderOpen,
                    color: 'emerald',
                    bgGradient: 'from-emerald-500 to-emerald-600',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600',
                    buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
                    borderColor: 'border-emerald-200',
                    textColor: 'text-emerald-700'
                };
            default:
                return {
                    icon: AlertTriangle,
                    color: 'red',
                    bgGradient: 'from-red-500 to-red-600',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    buttonBg: 'bg-red-600 hover:bg-red-700',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-700'
                };
        }
    };

    const config = getTypeConfig();
    const IconComponent = config.icon;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                                {/* هدر گرادیان */}
                                <div className={`relative overflow-hidden bg-gradient-to-r ${config.bgGradient} px-6 py-5`}>
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white rounded-full blur-3xl" />
                                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white rounded-full blur-3xl" />
                                    </div>
                                    <div className="relative flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur">
                                            <Trash2 className="h-6 w-6 text-white" />
                                        </div>
                                        <Dialog.Title as="h3" className="text-xl font-bold text-white">
                                            {title}
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 left-4 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* محتوا */}
                                <div className="p-6">
                                    {/* آیکون هشدار */}
                                    <div className="flex justify-center mb-4">
                                        <div className={`p-4 ${config.iconBg} rounded-full animate-pulse`}>
                                            <AlertTriangle className={`h-10 w-10 ${config.iconColor}`} />
                                        </div>
                                    </div>

                                    {/* پیام */}
                                    <Dialog.Description as="div" className="text-center">
                                        <p className="text-gray-700 mb-2">{message}</p>
                                        <div className={`mt-3 p-3 ${config.iconBg} rounded-xl border ${config.borderColor}`}>
                                            <div className="flex items-center justify-center gap-2">
                                                <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
                                                <span className={`font-semibold ${config.textColor}`}>{itemName}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            این عملیات غیرقابل بازگشت است
                                        </p>
                                    </Dialog.Description>

                                    {/* دکمه‌ها */}
                                    <div className="mt-6 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                            disabled={isLoading}
                                        >
                                            انصراف
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onConfirm}
                                            disabled={isLoading}
                                            className={`flex-1 px-4 py-2.5 ${config.buttonBg} rounded-xl text-sm font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    در حال حذف...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="h-4 w-4" />
                                                    حذف
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

// برای رفع خطای import
import { FileText, Building2, Archive, FolderOpen } from 'lucide-react';