// resources/js/pages/tazkira/index.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Clock,
    Hash, FileText, Calendar, ChevronLeft, ChevronRight,
    AlertCircle, MapPin, User, BookOpen, X
} from 'lucide-react';
import { useState } from 'react';

interface Tazkira {
    id: number;
    first_name: string;
    last_name: string;
    father_name: string | null;
    grandfather_name: string | null;
    tazkira_number: string;
    volume: string | null;
    page: string | null;
    registration_number: string | null;
    velayat: string | null;
    volosvali: string | null;
    qaria: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    created_by?: { id: number; full_name: string } | null;
}

interface Props {
    tazkiras: {
        data: Tazkira[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        first_name?: string;
        last_name?: string;
        father_name?: string;
        grandfather_name?: string;
        tazkira_number?: string;
        volume?: string;
        page?: string;
        registration_number?: string;
        velayat?: string;
        volosvali?: string;
        qaria?: string;
        status?: string;
    };
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
        approve: boolean;
    };
}

const STATUS_CONFIG = {
    pending: { label: 'در انتظار', icon: Clock, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    approved: { label: 'تایید شده', icon: CheckCircle, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    rejected: { label: 'رد شده', icon: XCircle, color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function TazkiraIndex({ tazkiras, filters, can }: Props) {
    // فرم فیلترها
    const [filterForm, setFilterForm] = useState({
        first_name: filters.first_name || '',
        last_name: filters.last_name || '',
        father_name: filters.father_name || '',
        grandfather_name: filters.grandfather_name || '',
        tazkira_number: filters.tazkira_number || '',
        volume: filters.volume || '',
        page: filters.page || '',
        registration_number: filters.registration_number || '',
        velayat: filters.velayat || '',
        volosvali: filters.volosvali || '',
        qaria: filters.qaria || '',
        status: filters.status || '',
    });    

    const [showFilters, setShowFilters] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTazkira, setSelectedTazkira] = useState<Tazkira | null>(null);

    const handleFilterChange = (field: string, value: string) => {
        setFilterForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        const cleanFilters = Object.fromEntries(
            Object.entries(filterForm).filter(([_, value]) => value !== '')
        );
        router.get('/tazkira', cleanFilters, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setFilterForm({
            first_name: '',
            last_name: '',
            father_name: '',
            grandfather_name: '',
            tazkira_number: '',
            volume: '',
            page: '',
            registration_number: '',
            velayat: '',
            volosvali: '',
            qaria: '',
            status: '',
        });
        router.get('/tazkira', {}, { preserveState: true, replace: true });
    };

    const handleDelete = (tazkira: Tazkira) => {
        setSelectedTazkira(tazkira);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedTazkira) return;
        router.delete(`/tazkira/${selectedTazkira.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedTazkira(null);
            },
        });
    };

    const hasActiveFilters = Object.values(filterForm).some(v => v !== '');

    const stats = {
        total: tazkiras.total,
        pending: tazkiras.data.filter(t => t.status === 'pending').length,
        approved: tazkiras.data.filter(t => t.status === 'approved').length,
        rejected: tazkiras.data.filter(t => t.status === 'rejected').length,
    };

    const getStatusBadge = (status: string) => {
        const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
                <Icon className="h-3 w-3" />
                {config.label}
            </span>
        );
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    const getRandomGradient = (id: number) => {
        const gradients = [
            'from-blue-500 to-cyan-500',
            'from-emerald-500 to-teal-500',
            'from-purple-500 to-indigo-500',
            'from-rose-500 to-pink-500',
            'from-amber-500 to-orange-500',
        ];
        return gradients[id % gradients.length];
    };

    const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white";
    const labelClass = "block text-xs font-medium text-gray-600 mb-1";

    return (
        <>
            <Head title="مدیریت تذکره‌ها" />

            <div className="min-h-screen">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">

                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                                        <div className="relative p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">مدیریت تذکره‌ها</h1>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            مدیریت و پیگیری تذکره‌های الکترونیکی
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {can.create && (
                                    <Link
                                        href="/tazkira/create"
                                        className="group relative inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <Plus className="ml-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
                                        تذکره جدید
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">کل تذکره‌ها</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-3 bg-indigo-50 rounded-xl">
                                        <FileText className="h-6 w-6 text-indigo-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">در انتظار بررسی</p>
                                        <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                                    </div>
                                    <div className="p-3 bg-amber-50 rounded-xl">
                                        <Clock className="h-6 w-6 text-amber-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">تایید شده</p>
                                        <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
                                    </div>
                                    <div className="p-3 bg-emerald-50 rounded-xl">
                                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">رد شده</p>
                                        <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                                    </div>
                                    <div className="p-3 bg-red-50 rounded-xl">
                                        <XCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-gray-500" />
                                    <span className="font-medium text-gray-700">فیلترهای پیشرفته</span>
                                    {hasActiveFilters && (
                                        <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                                            فعال
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasActiveFilters && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReset();
                                            }}
                                            className="text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded"
                                        >
                                            پاک کردن همه
                                        </button>
                                    )}
                                    <ChevronLeft className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showFilters ? 'rotate-90' : ''}`} />
                                </div>
                            </button>

                            <div className={`transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="border-t border-gray-100 p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {/* معلومات شخصی */}
                                        <div className="lg:col-span-4">
                                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                <User className="h-4 w-4 text-indigo-500" />
                                                معلومات شخصی
                                            </h3>
                                        </div>
                                        <div>
                                            <label className={labelClass}>نام</label>
                                            <input
                                                type="text"
                                                value={filterForm.first_name}
                                                onChange={(e) => handleFilterChange('first_name', e.target.value)}
                                                placeholder="علی"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>تخلص</label>
                                            <input
                                                type="text"
                                                value={filterForm.last_name}
                                                onChange={(e) => handleFilterChange('last_name', e.target.value)}
                                                placeholder="رضایی"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>نام پدر</label>
                                            <input
                                                type="text"
                                                value={filterForm.father_name}
                                                onChange={(e) => handleFilterChange('father_name', e.target.value)}
                                                placeholder="محمد"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>نام پدر کلان</label>
                                            <input
                                                type="text"
                                                value={filterForm.grandfather_name}
                                                onChange={(e) => handleFilterChange('grandfather_name', e.target.value)}
                                                placeholder="احمد"
                                                className={inputClass}
                                            />
                                        </div>

                                        {/* مشخصات تذکره */}
                                        <div className="lg:col-span-4 mt-2">
                                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                <Hash className="h-4 w-4 text-purple-500" />
                                                مشخصات تذکره
                                            </h3>
                                        </div>
                                        <div>
                                            <label className={labelClass}>شماره تذکره</label>
                                            <input
                                                type="text"
                                                value={filterForm.tazkira_number}
                                                onChange={(e) => handleFilterChange('tazkira_number', e.target.value)}
                                                placeholder="123456789"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>جلد</label>
                                            <input
                                                type="text"
                                                value={filterForm.volume}
                                                onChange={(e) => handleFilterChange('volume', e.target.value)}
                                                placeholder="1"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>صفحه</label>
                                            <input
                                                type="text"
                                                value={filterForm.page}
                                                onChange={(e) => handleFilterChange('page', e.target.value)}
                                                placeholder="10"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>شماره ثبت</label>
                                            <input
                                                type="text"
                                                value={filterForm.registration_number}
                                                onChange={(e) => handleFilterChange('registration_number', e.target.value)}
                                                placeholder="12345"
                                                className={inputClass}
                                            />
                                        </div>

                                        {/* موقعیت مکانی */}
                                        <div className="lg:col-span-4 mt-2">
                                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-emerald-500" />
                                                موقعیت مکانی
                                            </h3>
                                        </div>
                                        <div>
                                            <label className={labelClass}>ولایت</label>
                                            <input
                                                type="text"
                                                value={filterForm.velayat}
                                                onChange={(e) => handleFilterChange('velayat', e.target.value)}
                                                placeholder="کابل"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>ولسوالی</label>
                                            <input
                                                type="text"
                                                value={filterForm.volosvali}
                                                onChange={(e) => handleFilterChange('volosvali', e.target.value)}
                                                placeholder="نهمارکزی"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>قریه / ناحیه</label>
                                            <input
                                                type="text"
                                                value={filterForm.qaria}
                                                onChange={(e) => handleFilterChange('qaria', e.target.value)}
                                                placeholder="سرک تذکره"
                                                className={inputClass}
                                            />
                                        </div>

                                        {/* وضعیت */}
                                        <div className="lg:col-span-4 mt-2">
                                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-amber-500" />
                                                وضعیت
                                            </h3>
                                        </div>
                                        <div>
                                            <label className={labelClass}>وضعیت تذکره</label>
                                            <select
                                                value={filterForm.status}
                                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                                className={inputClass}
                                            >
                                                <option value="">همه</option>
                                                <option value="pending">در انتظار بررسی</option>
                                                <option value="approved">تایید شده</option>
                                                <option value="rejected">رد شده</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={handleReset}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                            پاک کردن فیلترها
                                        </button>
                                        <button
                                            onClick={handleSearch}
                                            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
                                        >
                                            <Search className="h-4 w-4" />
                                            جستجو
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table View */}
                        {tazkiras.data.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                                        <FileText className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">هیچ تذکره‌ای یافت نشد</p>
                                    <p className="text-sm text-gray-400 mt-1">سعی کنید معیارهای جستجوی خود را تغییر دهید</p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={handleReset}
                                            className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                        >
                                            پاک کردن فیلترها
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-gray-50 to-white">
                                            <tr>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام و تخلص</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام پدر / کلان</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره تذکره</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">جلد / صفحه</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ولایت / ولسوالی</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ثبت</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ثبت کننده</th>
                                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {tazkiras.data.map((tazkira) => (
                                                <tr key={tazkira.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className={`shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br ${getRandomGradient(tazkira.id)} flex items-center justify-center text-white font-bold shadow-md`}>
                                                                {getInitials(tazkira.first_name, tazkira.last_name)}
                                                            </div>
                                                            <div className="mr-3">
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {tazkira.first_name} {tazkira.last_name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-sm text-gray-600">{tazkira.father_name || '—'}</p>
                                                            <p className="text-xs text-gray-400">{tazkira.grandfather_name || '—'}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <code className="text-sm font-mono text-gray-600">{tazkira.tazkira_number}</code>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-sm text-gray-600">{tazkira.volume || '—'}</span>
                                                            <span className="text-gray-300">/</span>
                                                            <span className="text-sm text-gray-600">{tazkira.page || '—'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-sm text-gray-600">{tazkira.velayat || '—'}</p>
                                                            <p className="text-xs text-gray-400">{tazkira.volosvali || '—'}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                            <span className="text-sm text-gray-600">
                                                                {new Date(tazkira.created_at).toLocaleDateString('fa-Af')}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className='text-xs '>{tazkira.created_by?.full_name}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(tazkira.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-left">
                                                        <div className="flex items-center gap-1">
                                                            <Link
                                                                href={`/tazkira/${tazkira.id}`}
                                                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                                                                title="مشاهده"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            {can.edit && (
                                                                <Link
                                                                    href={`/tazkira/${tazkira.id}/edit`}
                                                                    className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                                                    title="ویرایش"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            )}
                                                            {can.delete && (
                                                                <button
                                                                    onClick={() => handleDelete(tazkira)}
                                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                    title="حذف"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {tazkiras.last_page > 1 && (
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-gray-600">
                                            نمایش {tazkiras.from} تا {tazkiras.to} از {tazkiras.total} نتیجه
                                        </div>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => {
                                                    if (tazkiras.current_page > 1) {
                                                        const cleanFilters = Object.fromEntries(
                                                            Object.entries(filterForm).filter(([_, value]) => value !== '')
                                                        );
                                                        router.get('/tazkira', { ...cleanFilters, page: tazkiras.current_page - 1 });
                                                    }
                                                }}
                                                disabled={tazkiras.current_page === 1}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tazkiras.current_page > 1
                                                    ? 'text-gray-700 hover:bg-white hover:text-indigo-600 shadow-sm'
                                                    : 'text-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                            {(() => {
                                                const pages = [];
                                                const maxVisible = 5;
                                                let start = Math.max(1, tazkiras.current_page - Math.floor(maxVisible / 2));
                                                const end = Math.min(tazkiras.last_page, start + maxVisible - 1);

                                                if (end - start + 1 < maxVisible) {
                                                    start = Math.max(1, end - maxVisible + 1);
                                                }

                                                for (let i = start; i <= end; i++) {
                                                    pages.push(i);
                                                }

                                                return pages.map((page) => {
                                                    const cleanFilters = Object.fromEntries(
                                                        Object.entries(filterForm).filter(([_, value]) => value !== '')
                                                    );
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => router.get('/tazkira', { ...cleanFilters, page })}
                                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tazkiras.current_page === page
                                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                                                : 'text-gray-700 hover:bg-white hover:text-indigo-600'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                });
                                            })()}
                                            <button
                                                onClick={() => {
                                                    if (tazkiras.current_page < tazkiras.last_page) {
                                                        const cleanFilters = Object.fromEntries(
                                                            Object.entries(filterForm).filter(([_, value]) => value !== '')
                                                        );
                                                        router.get('/tazkira', { ...cleanFilters, page: tazkiras.current_page + 1 });
                                                    }
                                                }}
                                                disabled={tazkiras.current_page === tazkiras.last_page}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tazkiras.current_page < tazkiras.last_page
                                                    ? 'text-gray-700 hover:bg-white hover:text-indigo-600 shadow-sm'
                                                    : 'text-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && selectedTazkira && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">حذف تذکره</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            آیا از حذف تذکره <span className="font-bold">{selectedTazkira.first_name} {selectedTazkira.last_name}</span> با شماره <span className="font-mono">{selectedTazkira.tazkira_number}</span> اطمینان دارید؟
                        </p>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                            >
                                انصراف
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition"
                            >
                                <Trash2 className="h-4 w-4" />
                                حذف تذکره
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}