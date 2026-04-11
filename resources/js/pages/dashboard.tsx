import { Head, Link } from '@inertiajs/react';
import { Inbox, Send, FileText, Clock, Archive, Users, Mail, ChevronLeft } from 'lucide-react';
import React from 'react';
import {index as ArchiveIndex} from '@/routes/archives';
import {index as CartableIndex, } from '@/routes/cartable';
import {index as LetterIndex, create as LetterCreate, show as LetterShow} from '@/routes/letters';
import {index as UserIndex} from '@/routes/users';
import type { DashboardStats, Letter } from '@/types';

interface Props {
    stats: DashboardStats;
    recentLetters: Letter[];
}

export default function Dashboard({ stats, recentLetters }: Props) {
    // ✅ route با Wayfinder - type-safe و autocomplete
    const statCards = [
        { label: 'نامه‌های در انتظار', value: stats.pending_actions, icon: Clock, color: 'bg-yellow-500', href: CartableIndex() },
        { label: 'نامه‌های وارده جدید', value: stats.incoming_new, icon: Inbox, color: 'bg-blue-500', href: LetterIndex({query:{ type: 'incoming', status: 'pending' }}) },
        { label: 'نامه‌های صادره جدید', value: stats.outgoing_new, icon: Send, color: 'bg-green-500', href: LetterIndex({query: { type: 'outgoing', status: 'pending' }}) },
        { label: 'پیش‌نویس‌های من', value: stats.my_drafts, icon: FileText, color: 'bg-purple-500', href: LetterIndex({query: { status: 'draft' }}) },
        { label: 'نامه‌های بایگانی شده', value: stats.archived_count, icon: Archive, color: 'bg-gray-500', href: ArchiveIndex() },
        { label: 'کاربران فعال', value: stats.total_users, icon: Users, color: 'bg-indigo-500', href: UserIndex() },
    ];

    return (
        <>
            <Head title="داشبورد" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>
                        <p className="text-sm text-gray-500 mt-1">خوش آمدید!</p>
                    </div>
                    <Link
                        href={LetterCreate()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition"
                    >
                        <Mail className="ml-2 h-4 w-4" />
                        نامه جدید
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {statCards.map((card) => (
                        <Link
                            key={card.label}
                            href={card.href}
                            className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`${card.color} rounded-lg p-2`}>
                                    <card.icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">{card.label}</p>
                                    <p className="text-xl font-bold text-gray-900">{card.value}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Recent Letters */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="px-6 py-4 border-b flex justify-between items-center">
                        <h2 className="text-lg font-semibold">نامه‌های اخیر</h2>
                        <Link href={LetterIndex()} className="text-sm text-blue-600">
                            مشاهده همه
                        </Link>
                    </div>
                    <div className="divide-y">
                        {recentLetters.map((letter) => (
                            <Link
                                key={letter.id}
                                href={LetterShow({ letter: letter.id })}
                                className="block px-6 py-4 hover:bg-gray-50 transition"
                            >
                                <p className="text-sm font-medium text-gray-900">{letter.subject}</p>
                                <p className="text-xs text-gray-500 mt-1">{letter.letter_number}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}