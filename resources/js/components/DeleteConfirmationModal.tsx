import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { Fragment } from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName: string;
    isLoading?: boolean;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemName,
    isLoading = false
}: DeleteConfirmationModalProps) {

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">

                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                    <Dialog.Title className="text-base font-semibold text-slate-900">
                                        {title}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 cursor-pointer rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="px-6 py-5">
                                    {/* Warning Icon */}
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-red-50 rounded-full">
                                            <AlertTriangle className="h-6 w-6 text-red-500" />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="text-center">
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {message}
                                        </p>

                                        {/* Item Name */}
                                        <div className="mt-3 px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                            <p className="text-sm font-medium text-slate-800">
                                                {itemName}
                                            </p>
                                        </div>

                                        {/* Warning Note */}
                                        <p className="mt-3 text-xs text-slate-400">
                                            این عملیات قابل بازگشت نیست
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-5 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onConfirm}
                                            disabled={isLoading}
                                            className="flex-1 cursor-pointer px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>در حال حذف...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="h-4 w-4" />
                                                    <span>حذف</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={isLoading}
                                            className="flex-1 cursor-pointer px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                                        >
                                            انصراف
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