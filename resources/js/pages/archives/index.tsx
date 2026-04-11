import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, FolderOpen, ChevronLeft, ChevronRight, Eye, Building2 } from 'lucide-react';
import type { Archive, Department } from '@/types';

interface Props {
    archives: {
        data: Archive[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    departments: Department[];
    filters: {
        search?: string;
        department_id?: string;
    };
    can: {
        create: boolean;
    };
}

export default function ArchivesIndex({ archives, departments, filters, can }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedDepartment, setSelectedDepartment] = useState(filters.department_id || '');

    const handleSearch = () => {
        router.get(route('archives.index'), {
            search: searchTerm,
            department_id: selectedDepartment,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedDepartment('');
        router.get(route('archives.index'), {}, { preserveState: true, replace: true });
    };

    const getLevelPrefix = (level?: number) => {
        if (!level) return '';
        return '—'.repeat(level) + (level > 0 ? ' ' : '');
    };

    return (
        <>
            <Head title="مدیریت بایگانی" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">مدیریت بایگانی</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            مدیریت بایگانی اسناد و پرونده‌ها
                        </p>
                    </div>
                    {can.create && (
                        <Link
                            href={route('archives.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition"
                        >
                            <Plus className="ml-2 h-4 w-4" />
                            بایگانی جدید
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">جستجو</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="نام، کد..."
                                    className="w-full pr-10 pl-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">دپارتمان</label>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">همه</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                            پاک کردن فیلترها
                        </button>
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                            اعمال فیلتر
                        </button>
                    </div>
                </div>

                {/* Archives Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام بایگانی</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دپارتمان</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">موقعیت</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {archives.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            بایگانی‌ای یافت نشد
                                        </td>
                                    </tr>
                                ) : (
                                    archives.data.map((archive) => (
                                        <tr key={archive.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FolderOpen className="h-5 w-5 text-gray-400 ml-3" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {getLevelPrefix(archive.parent ? 1 : 0)}{archive.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {archive.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {archive.department?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {archive.location || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {archive.is_active ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        فعال
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                        غیرفعال
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                <Link
                                                    href={route('archives.show', { archive: archive.id })}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    مشاهده
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {archives.last_page > 1 && (
                        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                نمایش {archives.from} تا {archives.to} از {archives.total} نتیجه
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={archives.current_page > 1 ? route('archives.index', { page: archives.current_page - 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${archives.current_page > 1 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                    قبلی
                                </Link>
                                {(() => {
                                    const pages = [];
                                    const maxVisible = 5;
                                    let start = Math.max(1, archives.current_page - Math.floor(maxVisible / 2));
                                    let end = Math.min(archives.last_page, start + maxVisible - 1);
                                    
                                    if (end - start + 1 < maxVisible) {
                                        start = Math.max(1, end - maxVisible + 1);
                                    }
                                    
                                    for (let i = start; i <= end; i++) {
                                        pages.push(i);
                                    }
                                    
                                    return pages.map((page) => (
                                        <Link
                                            key={page}
                                            href={route('archives.index', { page, ...filters })}
                                            className={`px-3 py-1 rounded-lg text-sm ${archives.current_page === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </Link>
                                    ));
                                })()}
                                <Link
                                    href={archives.current_page < archives.last_page ? route('archives.index', { page: archives.current_page + 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${archives.current_page < archives.last_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                    بعدی
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}