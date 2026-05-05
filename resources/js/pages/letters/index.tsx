// resources/js/pages/letters/index.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Search, Filter, Eye, Edit, Trash2,
    ChevronLeft, ChevronRight, FileText,
    Inbox, Send, File, Clock, AlertCircle,
    TrendingUp, Calendar, X, Mail, CheckCircle,
    AlertTriangle, Archive, Clock as ClockIcon,
    Reply, CornerUpLeft, CornerUpRight, User,
    MessageCircle, ChevronDown, ChevronUp,
    CircleDot, Circle, List, GitBranch, Menu
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import lettersRoute from '@/routes/letters';
import type { Letter, PaginatedResponse, LetterCategory } from '@/types';

interface Props {
    letters: PaginatedResponse<Letter>;
    categories: LetterCategory[];
    filters: {
        search?: string;
        letter_type?: string;
        status?: string;
        priority?: string;
        date_from?: string;
        date_to?: string;
        direction?: string;
    };
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
    types: Record<string, string>;
    directions: Record<string, string>;
    statuses: Record<string, string>;
    priorities: Record<string, string>;
    currentUserId: number;
    currentUserFullName: string;
}

interface ThreadedLetter extends Letter {
    children: ThreadedLetter[];
}

export default function LettersIndex({
    letters,
    filters,
    can,
    types,
    directions,
    statuses,
    priorities,
    currentUserId }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.letter_type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedPriority, setSelectedPriority] = useState(filters.priority || '');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedThreads, setExpandedThreads] = useState<Set<number>>(new Set());
    const [threadView, setThreadView] = useState(true);
    const [selectedDirection, setSelectedDirection] = useState(filters.direction || '');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // تبدیل آرایه تخت به ساختار درختی
    const threadedLetters = useMemo(() => {
        if (!threadView) return null;

        const letterMap = new Map<number, ThreadedLetter>();
        const rootLetters: ThreadedLetter[] = [];

        letters.data.forEach(letter => {
            letterMap.set(letter.id, { ...letter, children: [] });
        });

        letters.data.forEach(letter => {
            const node = letterMap.get(letter.id);
            if (node && letter.parent_letter_id && letterMap.has(letter.parent_letter_id)) {
                const parent = letterMap.get(letter.parent_letter_id);
                if (parent) {
                    parent.children.push(node);
                }
            } else if (node && !letter.parent_letter_id) {
                rootLetters.push(node);
            } else if (node) {
                rootLetters.push(node);
            }
        });

        return rootLetters;
    }, [letters.data, threadView]);

    const toggleThread = (letterId: number) => {
        const newExpanded = new Set(expandedThreads);
        if (newExpanded.has(letterId)) {
            newExpanded.delete(letterId);
        } else {
            newExpanded.add(letterId);
        }
        setExpandedThreads(newExpanded);
    };

    const expandAll = () => {
        const allIds = new Set<number>();
        letters.data.forEach(letter => {
            if (letter.replies_count > 0) {
                allIds.add(letter.id);
            }
        });
        setExpandedThreads(allIds);
    };

    const collapseAll = () => {
        setExpandedThreads(new Set());
    };

    const getLetterRole = (letter: Letter) => {
        if (letter.letter_type === 'external') {
            if (letter.sender_user_id === currentUserId) return 'sent';
            if (letter.recipient_user_id === currentUserId) return 'received';
        }
        if (letter.sender_user_id === currentUserId) return 'sent';
        if (letter.recipient_user_id === currentUserId) return 'received';
        if (letter.created_by === currentUserId) return 'draft';
        if (letter.replied_by === currentUserId) return 'replied';
        return 'other';
    };

    const isUnread = (letter: Letter) => {
        if (!letter.views || letter.views.length === 0) return true;
        return !letter.views.some((v: any) => v.user_id === currentUserId);
    };

    const handleSearch = () => {
        router.get(lettersRoute.index(), {
            search: searchTerm,
            letter_type: selectedType,
            status: selectedStatus,
            priority: selectedPriority,
            direction: selectedDirection,
            date_from: filters.date_from,
            date_to: filters.date_to,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedType('');
        setSelectedStatus('');
        setSelectedPriority('');
        setSelectedDirection('');
        router.get(lettersRoute.index(), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, subject: string) => {
        if (confirm(`آیا از حذف مکتوب "${subject}" اطمینان دارید؟`)) {
            router.delete(lettersRoute.destroy({ letter: id }));
        }
    };

    const priorityConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
        low: { label: 'کم', bg: 'bg-gray-50', text: 'text-gray-600', icon: AlertCircle },
        normal: { label: 'معمولی', bg: 'bg-blue-50', text: 'text-blue-700', icon: Mail },
        high: { label: 'بالا', bg: 'bg-yellow-50', text: 'text-yellow-700', icon: TrendingUp },
        urgent: { label: 'فوری', bg: 'bg-orange-50', text: 'text-orange-700', icon: AlertTriangle },
        very_urgent: { label: 'خیلی فوری', bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
    };

    const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
        draft: { label: 'پیش‌نویس', bg: 'bg-gray-50', text: 'text-gray-600', icon: FileText },
        pending: { label: 'در انتظار', bg: 'bg-yellow-50', text: 'text-yellow-700', icon: ClockIcon },
        approved: { label: 'تایید شده', bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
        rejected: { label: 'رد شده', bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
        archived: { label: 'بایگانی شده', bg: 'bg-gray-50', text: 'text-gray-500', icon: Archive },
    };

    const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
        internal: { label: 'داخلی', icon: File, color: 'purple' },
        external: { label: 'خارجی', icon: Send, color: 'blue' },
    };

    const roleConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
        sent: { label: 'ارسال شده', icon: CornerUpLeft, color: 'text-green-600', bg: 'bg-green-50' },
        received: { label: 'دریافتی', icon: CornerUpRight, color: 'text-blue-600', bg: 'bg-blue-50' },
        draft: { label: 'پیش‌نویس', icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50' },
        replied: { label: 'پاسخ داده شده', icon: Reply, color: 'text-purple-600', bg: 'bg-purple-50' },
        other: { label: 'سایر', icon: User, color: 'text-gray-400', bg: 'bg-gray-50' },
    };

    const hasActiveFilters = filters.search || filters.status || filters.priority || filters.letter_type || filters.direction;

    const getRelationText = (letter: Letter, role: string) => {
        const senderText = letter.sender_name || letter.sender_user?.full_name || 'نامشخص';
        const recipientText = letter.recipient_name || letter.recipient_user?.full_name || 'گیرنده خارجی';

        if (role === 'sent') return recipientText;
        if (role === 'received') return senderText;
        return `${senderText} → ${recipientText}`;
    };

    const stats = {
        total: letters.total,
        unread: letters.data.filter(l => isUnread(l)).length,
        pending: letters.data.filter(l => l.final_status === 'pending').length,
        urgent: letters.data.filter(l => l.priority === 'urgent' || l.priority === 'very_urgent').length,
        received: letters.data.filter(l => getLetterRole(l) === 'received').length,
        sent: letters.data.filter(l => getLetterRole(l) === 'sent').length,
    };

    // رندر یک نامه در حالت موبایل (کارت)
    const renderMobileCard = (letter: Letter) => {
        const role = getLetterRole(letter);
        const roleConfigItem = roleConfig[role];
        const RoleIcon = roleConfigItem.icon;
        const priority = priorityConfig[letter.priority] || priorityConfig.normal;
        const PriorityIcon = priority.icon;
        const status = statusConfig[letter.final_status] || statusConfig.draft;
        const StatusIcon = status.icon;
        const TypeIcon = typeConfig[letter.letter_type]?.icon || File;
        const unread = isUnread(letter);
        const relationText = getRelationText(letter, role);

        return (
            <div
                key={letter.id}
                className={`bg-white rounded-xl border transition-all duration-200 ${unread
                    ? 'border-r-4 border-r-blue-400 shadow-md'
                    : 'border-gray-100 shadow-sm'
                    }`}
            >
                <div className="p-4">
                    {/* هدر کارت */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className={`p-1.5 rounded-lg ${typeConfig[letter.letter_type]?.color === 'purple' ? 'bg-purple-50' : 'bg-blue-50'}`}>
                                <TypeIcon className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <code className={`text-xs font-mono px-1.5 py-0.5 rounded ${unread ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {letter.letter_number || 'بدون شماره'}
                                    </code>
                                    <span className={`inline-flex items-center gap-0.5 text-[10px] ${roleConfigItem.bg} ${roleConfigItem.color} px-1.5 py-0.5 rounded-full`}>
                                        <RoleIcon className="h-2.5 w-2.5" />
                                        {roleConfigItem.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Link
                                href={lettersRoute.show({ letter: letter.id })}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Eye className="h-3.5 w-3.5" />
                            </Link>
                            {can.edit && letter.is_draft && letter.created_by === currentUserId && (
                                <Link
                                    href={lettersRoute.edit({ letter: letter.id })}
                                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                >
                                    <Edit className="h-3.5 w-3.5" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* موضوع */}
                    <h3 className={`text-sm mb-2 line-clamp-2 ${unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {letter.subject}
                    </h3>

                    {/* فرستنده/گیرنده */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <User className="h-3 w-3" />
                        <span className="truncate">{relationText}</span>
                    </div>

                    {/* برچسب‌ها */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                            <StatusIcon className="h-2.5 w-2.5" />
                            {status.label}
                        </span>
                        {letter.priority !== 'normal' && (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${priority.bg} ${priority.text}`}>
                                <PriorityIcon className="h-2.5 w-2.5" />
                                {priority.label}
                            </span>
                        )}
                        {unread && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-600">
                                <CircleDot className="h-2.5 w-2.5" />
                                جدید
                            </span>
                        )}
                    </div>

                    {/* تاریخ */}
                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-50">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {letter.date}
                        </div>
                        {letter.due_date && (
                            <div className={`flex items-center gap-1 ${new Date(letter.due_date) < new Date() ? 'text-red-500' : 'text-orange-500'}`}>
                                <Clock className="h-3 w-3" />
                                مهلت: {letter.due_date}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // رندر یک نامه در حالت دسکتاپ (جدول)
    const renderDesktopRow = (letter: ThreadedLetter, depth: number = 0) => {
        const role = getLetterRole(letter);
        const roleConfigItem = roleConfig[role];
        const RoleIcon = roleConfigItem.icon;
        const priority = priorityConfig[letter.priority] || priorityConfig.normal;
        const PriorityIcon = priority.icon;
        const status = statusConfig[letter.final_status] || statusConfig.draft;
        const StatusIcon = status.icon;
        const TypeIcon = typeConfig[letter.letter_type]?.icon || File;
        const hasChildren = letter.children && letter.children.length > 0;
        const isExpanded = expandedThreads.has(letter.id);
        const unread = isUnread(letter);
        const relationText = getRelationText(letter, role);

        return (
            <React.Fragment key={letter.id}>
                <tr className={`
                    transition-all duration-200 group
                    ${unread
                        ? 'bg-gradient-to-r from-blue-50 via-blue-50/50 to-white border-r-4 border-r-blue-400'
                        : 'hover:bg-gray-50 border-r-4 border-r-transparent'
                    }
                    ${depth > 0 ? 'bg-gray-50/50' : ''}
                `}>
                    {/* ستون وضعیت خوانده و ترد */}
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 sm:gap-2" style={{ paddingRight: `${depth * 16}px` }}>
                            {hasChildren && (
                                <button
                                    onClick={() => toggleThread(letter.id)}
                                    className="p-0.5 sm:p-1 hover:bg-gray-200 rounded transition-colors"
                                >
                                    {isExpanded ?
                                        <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" /> :
                                        <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
                                    }
                                </button>
                            )}
                            {!hasChildren && depth > 0 && <span className="w-4 sm:w-6"></span>}
                            <span className={`flex items-center ${unread ? 'text-blue-500' : 'text-gray-300'}`}>
                                {unread ?
                                    <CircleDot className="h-4 w-4 sm:h-5 sm:w-5" /> :
                                    <Circle className="h-4 w-4 sm:h-5 sm:w-5" />
                                }
                            </span>
                        </div>
                    </td>

                    {/* ستون شماره و نوع */}
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                            <code className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono ${unread ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {letter.letter_number || 'بدون شماره'}
                            </code>
                            <span className={`inline-flex items-center gap-0.5 text-[8px] sm:text-[10px] ${letter.letter_type === 'internal' ? 'text-purple-600' : 'text-blue-600'
                                }`}>
                                <TypeIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                {types[letter.letter_type]}
                            </span>
                        </div>
                    </td>

                    {/* ستون موضوع */}
                    <td className="px-3 sm:px-4 py-3">
                        <div className="flex flex-col max-w-[200px] lg:max-w-md">
                            <p className={`text-xs sm:text-sm line-clamp-2 ${unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                {letter.subject}
                            </p>
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                                {hasChildren && (
                                    <span className="inline-flex items-center gap-0.5 text-[8px] sm:text-[10px] text-green-600 bg-green-50 px-1 py-0.5 rounded-full">
                                        <MessageCircle className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                                        {letter.children.length}
                                    </span>
                                )}
                                {unread && (
                                    <span className="inline-flex items-center gap-0.5 text-[8px] sm:text-[10px] text-blue-600 bg-blue-100 px-1 py-0.5 rounded-full">
                                        جدید
                                    </span>
                                )}
                            </div>
                        </div>
                    </td>

                    {/* ستون فرستنده/گیرنده - مخفی در موبایل */}
                    <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
                        <div className="flex flex-col">
                            <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px] lg:max-w-[180px]">
                                {relationText}
                            </span>
                            {letter.recipient_department && (
                                <span className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 truncate">
                                    {letter.recipient_department.name}
                                </span>
                            )}
                        </div>
                    </td>

                    {/* ستون وضعیت */}
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                        <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-medium ${status.bg} ${status.text}`}>
                            <StatusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            {status.label}
                        </span>
                    </td>

                    {/* ستون تاریخ - مخفی در موبایل */}
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-gray-500">
                                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                {letter.date}
                            </div>
                            {letter.due_date && (
                                <div className={`flex items-center gap-0.5 text-[8px] sm:text-[10px] ${new Date(letter.due_date) < new Date() ? 'text-red-500' : 'text-orange-500'}`}>
                                    <Clock className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                                    {letter.due_date}
                                </div>
                            )}
                        </div>
                    </td>

                    {/* ستون عملیات */}
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            <Link
                                href={lettersRoute.show({ letter: letter.id })}
                                className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Link>
                            {can.edit && letter.is_draft && letter.created_by === currentUserId && (
                                <Link
                                    href={lettersRoute.edit({ letter: letter.id })}
                                    className="p-1 sm:p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                >
                                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Link>
                            )}
                            {can.delete && letter.created_by === currentUserId && (
                                <button
                                    onClick={() => handleDelete(letter.id, letter.subject)}
                                    className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </button>
                            )}
                        </div>
                    </td>
                </tr>

                {/* زیرمجموعه‌ها */}
                {hasChildren && isExpanded &&
                    letter.children.map(child => renderDesktopRow(child, depth + 1))
                }
            </React.Fragment>
        );
    };

    return (
        <>
            <Head title="مدیریت مکتوب‌ها" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
                            <div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">مدیریت مکتوب‌ها</h1>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden xs:block">
                                            مدیریت و پیگیری مکتوب‌های اداری
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Mobile: دکمه فیلتر */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="lg:hidden inline-flex items-center px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600"
                                >
                                    <Menu className="h-4 w-4" />
                                </button>

                                {/* Desktop: دکمه‌های ترد */}
                                {threadView && (
                                    <div className="hidden lg:flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                                        <button
                                            onClick={expandAll}
                                            className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            باز کردن همه
                                        </button>
                                        <button
                                            onClick={collapseAll}
                                            className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            بستن همه
                                        </button>
                                    </div>
                                )}
                                {can.create && (
                                    <Link
                                        href={lettersRoute.create()}
                                        className="inline-flex items-center px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-xs sm:text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                                    >
                                        <Plus className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        <span className="hidden xs:inline">مکتوب جدید</span>
                                        <span className="xs:hidden">جدید</span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Panel */}
                        {mobileMenuOpen && (
                            <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3 animate-fade-in">
                                {/* Thread/List Toggle */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">نمایش:</span>
                                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                                        <button
                                            onClick={() => { setThreadView(true); setMobileMenuOpen(false); }}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${threadView ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                                        >
                                            <GitBranch className="h-3.5 w-3.5" />
                                            ترد شده
                                        </button>
                                        <button
                                            onClick={() => { setThreadView(false); setMobileMenuOpen(false); }}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${!threadView ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                                        >
                                            <List className="h-3.5 w-3.5" />
                                            لیست
                                        </button>
                                    </div>
                                </div>

                                {/* Type Filters */}
                                <div className="flex gap-1.5 flex-wrap">
                                    <button
                                        onClick={() => { setSelectedType(''); handleSearch(); setMobileMenuOpen(false); }}
                                        className={`px-2 py-1 rounded-lg text-xs font-medium ${!selectedType ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                    >
                                        همه
                                    </button>
                                    {Object.entries(types).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => { setSelectedType(key); handleSearch(); setMobileMenuOpen(false); }}
                                            className={`px-2 py-1 rounded-lg text-xs font-medium ${selectedType === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-3 lg:p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">کل مکتوب‌ها</p>
                                        <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-3 lg:p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">خوانده نشده</p>
                                        <p className="text-base sm:text-lg lg:text-xl font-bold text-blue-600">{stats.unread}</p>
                                    </div>
                                    <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                                        <CircleDot className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-3 lg:p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">دریافتی</p>
                                        <p className="text-base sm:text-lg lg:text-xl font-bold text-cyan-600">{stats.received}</p>
                                    </div>
                                    <div className="p-1.5 sm:p-2 bg-cyan-50 rounded-lg">
                                        <Inbox className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-3 lg:p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">ارسال شده</p>
                                        <p className="text-base sm:text-lg lg:text-xl font-bold text-green-600">{stats.sent}</p>
                                    </div>
                                    <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
                                        <Send className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-3 lg:p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">در انتظار</p>
                                        <p className="text-base sm:text-lg lg:text-xl font-bold text-yellow-600">{stats.pending}</p>
                                    </div>
                                    <div className="p-1.5 sm:p-2 bg-yellow-50 rounded-lg">
                                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-3 lg:p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">فوری</p>
                                        <p className="text-base sm:text-lg lg:text-xl font-bold text-orange-600">{stats.urgent}</p>
                                    </div>
                                    <div className="p-1.5 sm:p-2 bg-orange-50 rounded-lg">
                                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* View Toggle & Quick Filters (Desktop) */}
                        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">نمایش:</span>
                                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                                        <button
                                            onClick={() => setThreadView(true)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${threadView ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                                        >
                                            <GitBranch className="h-3.5 w-3.5" />
                                            ترد شده
                                        </button>
                                        <button
                                            onClick={() => setThreadView(false)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${!threadView ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                                        >
                                            <List className="h-3.5 w-3.5" />
                                            لیست تخت
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-1.5 flex-wrap">
                                    <button
                                        onClick={() => { setSelectedType(''); handleSearch(); }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${!selectedType ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                    >
                                        همه
                                    </button>
                                    {Object.entries(types).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => { setSelectedType(key); handleSearch(); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedType === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-3 text-[10px] sm:text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <CircleDot className="h-3.5 w-3.5 text-blue-500" />
                                    <span>خوانده نشده</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Circle className="h-3.5 w-3.5 text-gray-300" />
                                    <span>خوانده شده</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3 text-green-500" />
                                    <span>دارای پاسخ</span>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters Bar */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-3 sm:p-4 lg:p-5">
                                <div className="flex flex-col lg:flex-row gap-3">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                placeholder="جستجو بر اساس شماره، موضوع، متن یا نام..."
                                                className="w-full pr-9 sm:pr-10 pl-3 sm:pl-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 sm:gap-3">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${showFilters || hasActiveFilters
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Filter className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <span className="hidden xs:inline">فیلترها</span>
                                            {hasActiveFilters && (
                                                <span className="mr-1 sm:mr-2 px-1 py-0.5 bg-blue-600 text-white text-[9px] sm:text-[10px] rounded-full">
                                                    {Object.values(filters).filter(v => v).length}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSearch}
                                            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
                                        >
                                            جستجو
                                        </button>
                                    </div>
                                </div>

                                {/* Extended Filters */}
                                {showFilters && (
                                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">نوع نامه</label>
                                                <select
                                                    value={selectedType}
                                                    onChange={(e) => setSelectedType(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">همه</option>
                                                    {Object.entries(types).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">جهت</label>
                                                <select
                                                    value={selectedDirection}
                                                    onChange={(e) => setSelectedDirection(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">همه</option>
                                                    {Object.entries(directions).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">وضعیت</label>
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">همه وضعیت‌ها</option>
                                                    {Object.entries(statuses).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">اولویت</label>
                                                <select
                                                    value={selectedPriority}
                                                    onChange={(e) => setSelectedPriority(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">همه اولویت‌ها</option>
                                                    {Object.entries(priorities).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-3 sm:mt-4">
                                            <button
                                                onClick={handleReset}
                                                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 hover:text-red-700 transition-colors"
                                            >
                                                <X className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                پاک کردن همه فیلترها
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content: Desktop Table or Mobile Cards */}
                        {letters.data.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 lg:p-16 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">هیچ مکتوبی یافت نشد</p>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                        سعی کنید معیارهای جستجوی خود را تغییر دهید
                                    </p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={handleReset}
                                            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            پاک کردن فیلترها
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View - Hidden on mobile */}
                                <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                                                    <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500">شماره / نوع</th>
                                                    <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500">موضوع</th>
                                                    <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500">فرستنده/گیرنده</th>
                                                    <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                                                    <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500">تاریخ</th>
                                                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500">عملیات</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {threadView && threadedLetters
                                                    ? threadedLetters.map(letter => renderDesktopRow(letter))
                                                    : letters.data.map(letter => renderDesktopRow({ ...letter, children: [] } as ThreadedLetter, 0))
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Desktop Pagination */}
                                    {letters.last_page > 1 && (
                                        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                                            <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                                                نمایش {letters.from} تا {letters.to} از {letters.total} نتیجه
                                            </div>
                                            <div className="flex gap-1 order-1 sm:order-2">
                                                <button
                                                    onClick={() => letters.current_page > 1 && router.get(letters.path, { page: letters.current_page - 1, ...filters }, { preserveState: true })}
                                                    disabled={letters.current_page <= 1}
                                                    className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-gray-700 ${letters.current_page > 1 ? 'hover:bg-white hover:text-blue-600' : 'text-gray-300 cursor-not-allowed'}`}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                                <div className="hidden sm:flex gap-1">
                                                    {[...Array(Math.min(5, letters.last_page))].map((_, i) => {
                                                        let pageNum;
                                                        if (letters.last_page <= 5) pageNum = i + 1;
                                                        else if (letters.current_page <= 3) pageNum = i + 1;
                                                        else if (letters.current_page >= letters.last_page - 2) pageNum = letters.last_page - 4 + i;
                                                        else pageNum = letters.current_page - 2 + i;

                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => router.get(letters.path, { page: pageNum, ...filters }, { preserveState: true })}
                                                                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium ${letters.current_page === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-white hover:text-blue-600'}`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <span className="sm:hidden text-xs text-gray-600 px-2">صفحه {letters.current_page}</span>
                                                <button
                                                    onClick={() => letters.current_page < letters.last_page && router.get(letters.path, { page: letters.current_page + 1, ...filters }, { preserveState: true })}
                                                    disabled={letters.current_page >= letters.last_page}
                                                    className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-gray-700 ${letters.current_page < letters.last_page ? 'hover:bg-white hover:text-blue-600' : 'text-gray-300 cursor-not-allowed'}`}
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile Cards View - Visible on mobile only */}
                                <div className="lg:hidden space-y-3 animate-fade-in">
                                    {letters.data.map(letter => renderMobileCard(letter))}
                                </div>

                                {/* Mobile Pagination */}
                                {letters.last_page > 1 && (
                                    <div className="lg:hidden flex justify-between items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                                        <button
                                            onClick={() => letters.current_page > 1 && router.get(letters.path, { page: letters.current_page - 1, ...filters }, { preserveState: true })}
                                            disabled={letters.current_page <= 1}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium ${letters.current_page > 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                        >
                                            قبلی
                                        </button>
                                        <span className="text-sm text-gray-600">
                                            صفحه {letters.current_page} از {letters.last_page}
                                        </span>
                                        <button
                                            onClick={() => letters.current_page < letters.last_page && router.get(letters.path, { page: letters.current_page + 1, ...filters }, { preserveState: true })}
                                            disabled={letters.current_page >= letters.last_page}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium ${letters.current_page < letters.last_page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                        >
                                            بعدی
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}