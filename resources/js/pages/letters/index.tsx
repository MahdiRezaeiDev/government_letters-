import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Search, Filter, Eye, Edit, Trash2,
    ChevronLeft, ChevronRight, FileText,
    Inbox, Send, File, Clock, AlertCircle,
    TrendingUp, Calendar, X, Mail, CheckCircle,
    AlertTriangle, Archive, Clock as ClockIcon,
    Reply, CornerUpLeft, CornerUpRight, User,
    MessageCircle, ChevronDown, ChevronUp,
    CircleDot, Circle, List, GitBranch
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
    categories,
    filters,
    can,
    types,
    directions,
    statuses,
    priorities,
    currentUserId,
    currentUserFullName
}: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.letter_type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedPriority, setSelectedPriority] = useState(filters.priority || '');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedThreads, setExpandedThreads] = useState<Set<number>>(new Set());
    const [threadView, setThreadView] = useState(true);
    const [selectedDirection, setSelectedDirection] = useState(filters.direction || '');

    // تبدیل آرایه تخت به ساختار درختی برای نمایش ترد شده
    const threadedLetters = useMemo(() => {
        if (!threadView) return null;

        const letterMap = new Map<number, ThreadedLetter>();
        const rootLetters: ThreadedLetter[] = [];

        // ابتدا همه نامه‌ها را در map ذخیره می‌کنیم
        letters.data.forEach(letter => {
            letterMap.set(letter.id, { ...letter, children: [] });
        });

        // سپس ساختار درختی را می‌سازیم
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
                // اگر parent وجود ندارد، به عنوان root در نظر گرفته شود
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

    // تشخیص نقش نامه برای کاربر
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

    // تشخیص خوانده بودن نامه
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

    const priorityConfig: Record<string, { label: string; color: string; bg: string; text: string; icon: any }> = {
        low: { label: 'کم', color: 'gray', bg: 'bg-gray-50', text: 'text-gray-600', icon: AlertCircle },
        normal: { label: 'معمولی', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', icon: Mail },
        high: { label: 'بالا', color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-700', icon: TrendingUp },
        urgent: { label: 'فوری', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700', icon: AlertTriangle },
        very_urgent: { label: 'خیلی فوری', color: 'red', bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string; text: string; icon: any }> = {
        draft: { label: 'پیش‌نویس', color: 'gray', bg: 'bg-gray-50', text: 'text-gray-600', icon: FileText },
        pending: { label: 'در انتظار', color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-700', icon: ClockIcon },
        approved: { label: 'تایید شده', color: 'green', bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
        rejected: { label: 'رد شده', color: 'red', bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
        archived: { label: 'بایگانی شده', color: 'gray', bg: 'bg-gray-50', text: 'text-gray-500', icon: Archive },
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

    // تعیین متن فرستنده/گیرنده
    const getRelationText = (letter: Letter, role: string) => {
        const senderText = letter.sender_name || letter.sender_user?.full_name || 'نامشخص';
        const recipientText = letter.recipient_name || letter.recipient_user?.full_name || 'گیرنده خارجی';

        if (role === 'sent') return recipientText;
        if (role === 'received') return senderText;
        return `${senderText} → ${recipientText}`;
    };

    // Statistics
    const stats = {
        total: letters.total,
        currentPage: letters.data.length,
        unread: letters.data.filter(l => isUnread(l)).length,
        pending: letters.data.filter(l => l.final_status === 'pending').length,
        urgent: letters.data.filter(l => l.priority === 'urgent' || l.priority === 'very_urgent').length,
        received: letters.data.filter(l => getLetterRole(l) === 'received').length,
        sent: letters.data.filter(l => getLetterRole(l) === 'sent').length,
    };

    // رندر یک نامه و زیرمجموعه‌هایش
    const renderLetterRow = (letter: ThreadedLetter, depth: number = 0, isChild: boolean = false) => {
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
                    ${isChild ? 'bg-gray-50/50' : ''}
                    ${hasChildren ? 'cursor-pointer' : ''}
                `}>
                    {/* ستون وضعیت خوانده و ترد */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2" style={{ paddingRight: `${depth * 20}px` }}>
                            {/* دکمه باز/بسته کردن ترد */}
                            {hasChildren && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleThread(letter.id);
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                                    title={isExpanded ? 'بستن پاسخ‌ها' : 'نمایش پاسخ‌ها'}
                                >
                                    {isExpanded ?
                                        <ChevronDown className="h-4 w-4 text-gray-600" /> :
                                        <ChevronUp className="h-4 w-4 text-gray-600" />
                                    }
                                    <span className="text-xs text-gray-500">{letter.children.length}</span>
                                </button>
                            )}
                            {!hasChildren && depth > 0 && <span className="w-8"></span>}
                            {!hasChildren && depth === 0 && <span className="w-4"></span>}

                            {/* نشانگر خوانده/نخوانده */}
                            <span className={`flex items-center ${unread ? 'text-blue-500 animate-pulse' : 'text-gray-300'}`}>
                                {unread ?
                                    <CircleDot className="h-5 w-5" /> :
                                    <Circle className="h-5 w-5" />
                                }
                            </span>
                        </div>
                    </td>

                    {/* ستون شماره و نوع */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                            <code className={`px-2 py-0.5 rounded text-xs font-mono ${unread ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {letter.letter_number || 'بدون شماره'}
                            </code>
                            <span className={`inline-flex items-center gap-1 text-[10px] ${letter.letter_type === 'internal' ? 'text-purple-600' : 'text-blue-600'
                                }`}>
                                <TypeIcon className="h-3 w-3" />
                                {types[letter.letter_type]}
                            </span>
                        </div>
                    </td>

                    {/* ستون موضوع */}
                    <td className="px-4 py-3">
                        <div className="flex flex-col max-w-md">
                            <p className={`text-sm line-clamp-2 ${unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                                }`}>
                                {letter.subject}
                            </p>
                            {letter.summary && (
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                    {letter.summary.substring(0, 100)}
                                </p>
                            )}
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                {hasChildren && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                                        <MessageCircle className="h-2.5 w-2.5" />
                                        {letter.children.length} پاسخ
                                    </span>
                                )}
                                {unread && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full font-medium">
                                        جدید
                                    </span>
                                )}
                                {letter.priority === 'urgent' || letter.priority === 'very_urgent' ? (
                                    <span className={`inline-flex items-center gap-0.5 text-[10px] ${priority.text} ${priority.bg} px-1.5 py-0.5 rounded-full`}>
                                        <PriorityIcon className="h-2.5 w-2.5" />
                                        {priority.label}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </td>

                    {/* ستون فرستنده/گیرنده */}
                    <td className="px-4 py-3">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className={`inline-flex items-center gap-0.5 text-[10px] ${roleConfigItem.bg} ${roleConfigItem.color} px-1.5 py-0.5 rounded-full`}>
                                    <RoleIcon className="h-2.5 w-2.5" />
                                    {roleConfigItem.label}
                                </span>
                            </div>
                            <span className={`text-sm mt-1 ${unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                {relationText}
                            </span>
                            {letter.recipient_department && (
                                <span className="text-[10px] text-gray-400 mt-0.5">
                                    {letter.recipient_department.name}
                                </span>
                            )}
                        </div>
                    </td>

                    {/* ستون وضعیت */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                        </span>
                    </td>

                    {/* ستون تاریخ */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                {letter.date}
                            </div>
                            {letter.due_date && (
                                <div className={`flex items-center gap-1 text-[10px] ${new Date(letter.due_date) < new Date() ? 'text-red-500 font-medium' : 'text-orange-500'
                                    }`}>
                                    <Clock className="h-2.5 w-2.5" />
                                    مهلت: {letter.due_date}
                                </div>
                            )}
                        </div>
                    </td>

                    {/* ستون عملیات */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                                href={lettersRoute.show({ letter: letter.id })}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="مشاهده"
                            >
                                <Eye className="h-4 w-4" />
                            </Link>
                            {can.edit && letter.is_draft && letter.created_by === currentUserId && (
                                <Link
                                    href={lettersRoute.edit({ letter: letter.id })}
                                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                    title="ویرایش"
                                >
                                    <Edit className="h-4 w-4" />
                                </Link>
                            )}
                            {can.delete && letter.created_by === currentUserId && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(letter.id, letter.subject);
                                    }}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="حذف"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                            {hasChildren && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleThread(letter.id);
                                    }}
                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title={isExpanded ? 'بستن پاسخ‌ها' : 'نمایش پاسخ‌ها'}
                                >
                                    {isExpanded ?
                                        <ChevronDown className="h-4 w-4" /> :
                                        <ChevronUp className="h-4 w-4" />
                                    }
                                </button>
                            )}
                        </div>
                    </td>
                </tr>

                {/* نمایش زیرمجموعه‌ها (پاسخ‌ها) */}
                {hasChildren && isExpanded &&
                    letter.children.map((child: ThreadedLetter) => renderLetterRow(child, depth + 1, true))
                }
            </React.Fragment>
        );
    };

    return (
        <>
            <Head title="مدیریت مکتوب‌ها" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">مدیریت مکتوب‌ها</h1>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            مدیریت و پیگیری مکتوب‌های اداری
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* دکمه‌های گسترش/جمع‌کردن همه تردها */}
                                {threadView && (
                                    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                                        <button
                                            onClick={expandAll}
                                            className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                            title="باز کردن همه"
                                        >
                                            باز کردن همه
                                        </button>
                                        <button
                                            onClick={collapseAll}
                                            className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                            title="بستن همه"
                                        >
                                            بستن همه
                                        </button>
                                    </div>
                                )}
                                {can.create && (
                                    <Link
                                        href={lettersRoute.create()}
                                        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <Plus className="ml-2 h-4 w-4" />
                                        مکتوب جدید
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">کل مکتوب‌ها</p>
                                        <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">خوانده نشده</p>
                                        <p className="text-xl font-bold text-blue-600">{stats.unread}</p>
                                    </div>
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <CircleDot className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">دریافتی</p>
                                        <p className="text-xl font-bold text-cyan-600">{stats.received}</p>
                                    </div>
                                    <div className="p-2 bg-cyan-50 rounded-lg">
                                        <Inbox className="h-5 w-5 text-cyan-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">ارسال شده</p>
                                        <p className="text-xl font-bold text-green-600">{stats.sent}</p>
                                    </div>
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Send className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">در انتظار</p>
                                        <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                                    </div>
                                    <div className="p-2 bg-yellow-50 rounded-lg">
                                        <Clock className="h-5 w-5 text-yellow-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">فوری</p>
                                        <p className="text-xl font-bold text-orange-600">{stats.urgent}</p>
                                    </div>
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <AlertCircle className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* View Toggle & Quick Filters */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Toggle Thread/List View */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">نمایش:</span>
                                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                                        <button
                                            onClick={() => setThreadView(true)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${threadView
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-800'
                                                }`}
                                        >
                                            <GitBranch className="h-3.5 w-3.5" />
                                            ترد شده
                                        </button>
                                        <button
                                            onClick={() => setThreadView(false)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${!threadView
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-800'
                                                }`}
                                        >
                                            <List className="h-3.5 w-3.5" />
                                            لیست تخت
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Type Filters */}
                                <div className="flex gap-1.5 flex-wrap">
                                    <button
                                        onClick={() => {
                                            setSelectedType('');
                                            handleSearch();
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!selectedType
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        همه
                                    </button>
                                    {Object.entries(types).map(([key, label]) => {
                                        const Icon = typeConfig[key]?.icon || File;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => {
                                                    setSelectedType(key);
                                                    handleSearch();
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all inline-flex items-center gap-1.5 ${selectedType === key
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <Icon className="h-3.5 w-3.5" />
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <CircleDot className="h-4 w-4 text-blue-500" />
                                    <span>خوانده نشده</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Circle className="h-4 w-4 text-gray-300" />
                                    <span>خوانده شده</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                                    <span>دارای پاسخ</span>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters Bar */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-5">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                placeholder="جستجو بر اساس شماره، موضوع، متن یا نام فرستنده/گیرنده..."
                                                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${showFilters || hasActiveFilters
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Filter className="ml-2 h-4 w-4" />
                                            فیلترها
                                            {hasActiveFilters && (
                                                <span className="mr-2 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded-full">
                                                    {Object.values(filters).filter(v => v).length}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSearch}
                                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
                                        >
                                            جستجو
                                        </button>
                                    </div>
                                </div>

                                {/* Extended Filters */}
                                {showFilters && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">نوع نامه</label>
                                                <select
                                                    value={selectedType}
                                                    onChange={(e) => setSelectedType(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">همه</option>
                                                    {Object.entries(types).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">جهت</label>
                                                <select
                                                    value={selectedDirection}
                                                    onChange={(e) => setSelectedDirection(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">همه</option>
                                                    {Object.entries(directions).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">همه وضعیت‌ها</option>
                                                    {Object.entries(statuses).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">اولویت</label>
                                                <select
                                                    value={selectedPriority}
                                                    onChange={(e) => setSelectedPriority(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">همه اولویت‌ها</option>
                                                    {Object.entries(priorities).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={handleReset}
                                                className="inline-flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                                            >
                                                <X className="ml-1 h-4 w-4" />
                                                پاک کردن همه فیلترها
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Letters Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                وضعیت
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                شماره / نوع
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                موضوع
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                فرستنده/گیرنده
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                وضعیت
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                تاریخ
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                عملیات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {letters.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FileText className="h-12 w-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500 font-medium">هیچ مکتوبی یافت نشد</p>
                                                        <p className="text-sm text-gray-400 mt-1">
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
                                                </td>
                                            </tr>
                                        ) : threadView ? (
                                            threadedLetters?.map(letter => renderLetterRow(letter))
                                        ) : (
                                            letters.data.map(letter => renderLetterRow({ ...letter, children: [] } as ThreadedLetter))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {letters.last_page > 1 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        نمایش <span className="font-medium">{letters.from}</span> تا{' '}
                                        <span className="font-medium">{letters.to}</span> از{' '}
                                        <span className="font-medium">{letters.total}</span> نتیجه
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => {
                                                if (letters.current_page > 1) {
                                                    router.get(letters.path, {
                                                        page: letters.current_page - 1,
                                                        ...filters
                                                    }, { preserveState: true });
                                                }
                                            }}
                                            disabled={letters.current_page <= 1}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${letters.current_page > 1
                                                ? 'text-gray-700 hover:bg-white hover:text-blue-600'
                                                : 'text-gray-300 cursor-not-allowed'
                                                }`}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                        {(() => {
                                            const pages = [];
                                            const maxVisible = 5;
                                            let start = Math.max(1, letters.current_page - Math.floor(maxVisible / 2));
                                            const end = Math.min(letters.last_page, start + maxVisible - 1);

                                            if (end - start + 1 < maxVisible) {
                                                start = Math.max(1, end - maxVisible + 1);
                                            }

                                            if (start > 1) {
                                                pages.push(
                                                    <button
                                                        key={1}
                                                        onClick={() => router.get(letters.path, { page: 1, ...filters }, { preserveState: true })}
                                                        className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:text-blue-600 transition-colors"
                                                    >
                                                        1
                                                    </button>
                                                );
                                                if (start > 2) {
                                                    pages.push(<span key="dots1" className="px-2 text-gray-400">...</span>);
                                                }
                                            }

                                            for (let i = start; i <= end; i++) {
                                                pages.push(
                                                    <button
                                                        key={i}
                                                        onClick={() => router.get(letters.path, { page: i, ...filters }, { preserveState: true })}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${letters.current_page === i
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : 'text-gray-700 hover:bg-white hover:text-blue-600'
                                                            }`}
                                                    >
                                                        {i}
                                                    </button>
                                                );
                                            }

                                            if (end < letters.last_page) {
                                                if (end < letters.last_page - 1) {
                                                    pages.push(<span key="dots2" className="px-2 text-gray-400">...</span>);
                                                }
                                                pages.push(
                                                    <button
                                                        key={letters.last_page}
                                                        onClick={() => router.get(letters.path, { page: letters.last_page, ...filters }, { preserveState: true })}
                                                        className="px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:text-blue-600 transition-colors"
                                                    >
                                                        {letters.last_page}
                                                    </button>
                                                );
                                            }

                                            return pages;
                                        })()}
                                        <button
                                            onClick={() => {
                                                if (letters.current_page < letters.last_page) {
                                                    router.get(letters.path, {
                                                        page: letters.current_page + 1,
                                                        ...filters
                                                    }, { preserveState: true });
                                                }
                                            }}
                                            disabled={letters.current_page >= letters.last_page}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${letters.current_page < letters.last_page
                                                ? 'text-gray-700 hover:bg-white hover:text-blue-600'
                                                : 'text-gray-300 cursor-not-allowed'
                                                }`}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}