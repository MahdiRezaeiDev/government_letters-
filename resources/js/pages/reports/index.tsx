// resources/js/pages/reports/index.tsx

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    FileText, Download, Calendar, Filter, 
    TrendingUp, Users, Mail, Clock, CheckCircle, XCircle 
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Props {
    stats: {
        total_letters: number;
        incoming_count: number;
        outgoing_count: number;
        internal_count: number;
        approved_count: number;
        rejected_count: number;
        pending_count: number;
        archived_count: number;
        monthly_stats: { month: string; count: number }[];
        department_stats: { department: string; count: number }[];
        priority_stats: { priority: string; count: number }[];
    };
}

export default function ReportsIndex({ stats }: Props) {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [reportType, setReportType] = useState('all');

    const priorityColors = {
        low: '#9ca3af',
        normal: '#3b82f6',
        high: '#eab308',
        urgent: '#f97316',
        very_urgent: '#ef4444',
    };

    const priorityLabels = {
        low: 'کم',
        normal: 'عادی',
        high: 'مهم',
        urgent: 'فوری',
        very_urgent: 'خیلی فوری',
    };

    const handleExport = (format: 'excel' | 'pdf') => {
        router.get(route('reports.export'), {
            format,
            type: reportType,
            date_from: dateFrom,
            date_to: dateTo,
        });
    };

    const summaryCards = [
        { label: 'کل نامه‌ها', value: stats.total_letters, icon: FileText, color: 'bg-blue-500' },
        { label: 'نامه‌های وارده', value: stats.incoming_count, icon: Mail, color: 'bg-green-500' },
        { label: 'نامه‌های صادره', value: stats.outgoing_count, icon: Mail, color: 'bg-purple-500' },
        { label: 'نامه‌های داخلی', value: stats.internal_count, icon: FileText, color: 'bg-indigo-500' },
        { label: 'تایید شده', value: stats.approved_count, icon: CheckCircle, color: 'bg-green-600' },
        { label: 'رد شده', value: stats.rejected_count, icon: XCircle, color: 'bg-red-500' },
        { label: 'در انتظار', value: stats.pending_count, icon: Clock, color: 'bg-yellow-500' },
        { label: 'بایگانی شده', value: stats.archived_count, icon: Archive, color: 'bg-gray-500' },
    ];

    const pieData = [
        { name: 'وارده', value: stats.incoming_count, color: '#10b981' },
        { name: 'صادره', value: stats.outgoing_count, color: '#8b5cf6' },
        { name: 'داخلی', value: stats.internal_count, color: '#6366f1' },
    ];

    const priorityPieData = Object.entries(stats.priority_stats).map(([priority, count]) => ({
        name: priorityLabels[priority as keyof typeof priorityLabels],
        value: count,
        color: priorityColors[priority as keyof typeof priorityColors],
    }));

    return (
        <>
            <Head title="گزارشات" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">گزارشات و آمار</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            مشاهده آمار و خروجی گرفتن از داده‌ها
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleExport('excel')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                        >
                            <Download className="ml-2 h-4 w-4" />
                            خروجی Excel
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                        >
                            <Download className="ml-2 h-4 w-4" />
                            خروجی PDF
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                placeholder="از تاریخ"
                            />
                            <span className="text-gray-500">تا</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                placeholder="تا تاریخ"
                            />
                        </div>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">همه نامه‌ها</option>
                            <option value="incoming">نامه‌های وارده</option>
                            <option value="outgoing">نامه‌های صادره</option>
                            <option value="internal">نامه‌های داخلی</option>
                        </select>
                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                            <Filter className="ml-2 h-4 w-4" />
                            اعمال فیلتر
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {summaryCards.map((card) => (
                        <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                            <div className={`${card.color} rounded-lg p-2 w-8 h-8 flex items-center justify-center mb-2`}>
                                <card.icon className="h-4 w-4 text-white" />
                            </div>
                            <p className="text-xs text-gray-500">{card.label}</p>
                            <p className="text-lg font-bold text-gray-900">{card.value.toLocaleString('fa-IR')}</p>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            آمار ماهیانه نامه‌ها
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats.monthly_stats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#3b82f6" name="تعداد نامه‌ها" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Department Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-500" />
                            توزیع نامه‌ها بر اساس دپارتمان
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.department_stats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="department" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#10b981" name="تعداد نامه‌ها" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Type Distribution Pie */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">توزیع انواع نامه‌ها</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Priority Distribution Pie */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">توزیع اولویت نامه‌ها</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={priorityPieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {priorityPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
}