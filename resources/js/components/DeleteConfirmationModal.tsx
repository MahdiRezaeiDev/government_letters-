import { Dialog, Transition } from '@headlessui/react';
import { 
    AlertTriangle, X, Trash2, User, Clock, 
    FileText, Building2, Archive, FolderOpen
} from 'lucide-react';
import { Fragment } from 'react';

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
                    iconBg: 'bg-gradient-to-br from-red-100 to-red-50',
                    iconColor: 'text-red-600',
                    buttonGradient: 'from-red-500 to-red-600',
                    buttonHover: 'from-red-600 to-red-700',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-700',
                    bgGradient: 'from-red-500 to-rose-600',
                    ringColor: 'ring-red-500/20',
                    shadowColor: 'shadow-red-500/25',
                    glowColor: 'bg-red-500',
                    titleGradient: 'from-red-500 to-rose-600'
                };
            case 'letter':
                return {
                    icon: FileText,
                    iconBg: 'bg-gradient-to-br from-amber-100 to-amber-50',
                    iconColor: 'text-amber-600',
                    buttonGradient: 'from-amber-500 to-amber-600',
                    buttonHover: 'from-amber-600 to-amber-700',
                    borderColor: 'border-amber-200',
                    textColor: 'text-amber-700',
                    bgGradient: 'from-amber-500 to-orange-600',
                    ringColor: 'ring-amber-500/20',
                    shadowColor: 'shadow-amber-500/25',
                    glowColor: 'bg-amber-500',
                    titleGradient: 'from-amber-500 to-orange-600'
                };
            case 'department':
                return {
                    icon: Building2,
                    iconBg: 'bg-gradient-to-br from-blue-100 to-blue-50',
                    iconColor: 'text-blue-600',
                    buttonGradient: 'from-blue-500 to-blue-600',
                    buttonHover: 'from-blue-600 to-blue-700',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-700',
                    bgGradient: 'from-blue-500 to-indigo-600',
                    ringColor: 'ring-blue-500/20',
                    shadowColor: 'shadow-blue-500/25',
                    glowColor: 'bg-blue-500',
                    titleGradient: 'from-blue-500 to-indigo-600'
                };
            case 'organization':
                return {
                    icon: Building2,
                    iconBg: 'bg-gradient-to-br from-purple-100 to-purple-50',
                    iconColor: 'text-purple-600',
                    buttonGradient: 'from-purple-500 to-purple-600',
                    buttonHover: 'from-purple-600 to-purple-700',
                    borderColor: 'border-purple-200',
                    textColor: 'text-purple-700',
                    bgGradient: 'from-purple-500 to-pink-600',
                    ringColor: 'ring-purple-500/20',
                    shadowColor: 'shadow-purple-500/25',
                    glowColor: 'bg-purple-500',
                    titleGradient: 'from-purple-500 to-pink-600'
                };
            case 'archive':
                return {
                    icon: Archive,
                    iconBg: 'bg-gradient-to-br from-slate-100 to-slate-50',
                    iconColor: 'text-slate-600',
                    buttonGradient: 'from-slate-500 to-slate-600',
                    buttonHover: 'from-slate-600 to-slate-700',
                    borderColor: 'border-slate-200',
                    textColor: 'text-slate-700',
                    bgGradient: 'from-slate-500 to-gray-600',
                    ringColor: 'ring-slate-500/20',
                    shadowColor: 'shadow-slate-500/25',
                    glowColor: 'bg-slate-500',
                    titleGradient: 'from-slate-500 to-gray-600'
                };
            case 'case':
                return {
                    icon: FolderOpen,
                    iconBg: 'bg-gradient-to-br from-emerald-100 to-emerald-50',
                    iconColor: 'text-emerald-600',
                    buttonGradient: 'from-emerald-500 to-emerald-600',
                    buttonHover: 'from-emerald-600 to-emerald-700',
                    borderColor: 'border-emerald-200',
                    textColor: 'text-emerald-700',
                    bgGradient: 'from-emerald-500 to-teal-600',
                    ringColor: 'ring-emerald-500/20',
                    shadowColor: 'shadow-emerald-500/25',
                    glowColor: 'bg-emerald-500',
                    titleGradient: 'from-emerald-500 to-teal-600'
                };
            default:
                return {
                    icon: AlertTriangle,
                    iconBg: 'bg-gradient-to-br from-red-100 to-red-50',
                    iconColor: 'text-red-600',
                    buttonGradient: 'from-red-500 to-red-600',
                    buttonHover: 'from-red-600 to-red-700',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-700',
                    bgGradient: 'from-red-500 to-rose-600',
                    ringColor: 'ring-red-500/20',
                    shadowColor: 'shadow-red-500/25',
                    glowColor: 'bg-red-500',
                    titleGradient: 'from-red-500 to-rose-600'
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                                {/* هدر گرادیان با افکت شیشه‌ای */}
                                <div className={`relative overflow-hidden bg-linear-to-r ${config.titleGradient} px-6 py-6`}>
                                    {/* انیمیشن پس‌زمینه */}
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse" />
                                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-300" />
                                    </div>
                                    
                                    {/* دایره‌های تزئینی */}
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                                    
                                    <div className="relative flex items-center gap-3">
                                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-lg shadow-lg">
                                            <Trash2 className="h-6 w-6 text-white" />
                                        </div>
                                        <Dialog.Title className="text-xl font-bold text-white tracking-tight">
                                            {title}
                                        </Dialog.Title>
                                    </div>
                                    
                                    <button
                                        onClick={onClose}
                                        className="absolute top-5 left-5 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* محتوا */}
                                <div className="p-6">
                                    {/* آیکون هشدار با انیمیشن */}
                                    <div className="flex justify-center mb-5">
                                        <div className={`relative p-4 ${config.iconBg} rounded-2xl shadow-lg ${config.ringColor} ring-4`}>
                                            <div className={`absolute inset-0 ${config.glowColor} rounded-2xl blur-xl opacity-30 animate-pulse`} />
                                            <AlertTriangle className={`h-12 w-12 ${config.iconColor} relative z-10`} />
                                        </div>
                                    </div>

                                    {/* پیام */}
                                    <Dialog.Description as="div" className="text-center">
                                        <p className="text-gray-700 text-base mb-3">{message}</p>
                                        
                                        {/* آیتم مورد نظر */}
                                        <div className={`mt-4 p-4 ${config.iconBg} rounded-xl border-2 ${config.borderColor} shadow-sm`}>
                                            <div className="flex items-center justify-center gap-3">
                                                <div className={`p-2 bg-white rounded-lg shadow-sm ${config.ringColor} ring-1`}>
                                                    <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
                                                </div>
                                                <span className={`font-bold text-lg ${config.textColor}`}>
                                                    {itemName}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* هشدار غیرقابل بازگشت */}
                                        <div className="mt-5 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <p className="text-xs text-gray-500 font-medium">
                                                این عملیات غیرقابل بازگشت است
                                            </p>
                                        </div>
                                    </Dialog.Description>

                                    {/* دکمه‌ها */}
                                    <div className="mt-6 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                                        >
                                            انصراف
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onConfirm}
                                            disabled={isLoading}
                                            className={`flex-1 px-4 py-2.5 bg-linear-to-r ${config.buttonGradient} hover:from-${config.buttonHover.split(' ')[0]} hover:to-${config.buttonHover.split(' ')[1]} rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer group`}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>در حال حذف...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110 duration-200" />
                                                    <span>حذف</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* فوتر با خط تزئینی */}
                                <div className="px-6 pb-4">
                                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}