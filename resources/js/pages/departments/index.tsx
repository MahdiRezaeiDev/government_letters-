import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, Building2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import type { Department, Organization } from '@/types';

interface Props {
    departments: {
        data: Department[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    organizations: Organization[];
    filters: {
        search?: string;
        status?: string;
        organization_id?: string;
    };
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
}

export default function DepartmentsIndex({ departments, organizations, filters, can }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedOrganization, setSelectedOrganization] = useState(filters.organization_id || '');

    const handleSearch = () => {
        router.get(route('departments.index'), {
            search: searchTerm,
            status: selectedStatus,
            organization_id: selectedOrganization,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedOrganization('');
        router.get(route('departments.index'), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`آیا از حذف دپارتمان "${name}" اطمینان دارید؟`)) {
            router.delete(route('departments.destroy', { department: id }));
        }
    };

    const getLevelPrefix = (level: number) => {
        return '—'.repeat(level) + (level > 0 ? ' ' : '');
    };

    const statusColors: Record<string, string> = {
        active: 'bg-green-100 text-green-700',
        inactive: 'bg-gray-100 text-gray-700',
    };

    const statusLabels: Record<string, string> = {
        active: 'فعال',
        inactive: 'غیرفعال',
    };

    return (
        <>
            <Head title="مدیریت دپارتمان‌ها" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">مدیریت دپارتمان‌ها</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            مدیریت واحدهای سازمانی و ساختار سازمانی
                        </p>
                    </div>
                    {can.create && (
                        <Link
                            href={route('departments.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition"
                        >
                            <Plus className="ml-2 h-4 w-4" />
                            دپارتمان جدید
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">همه</option>
                                <option value="active">فعال</option>
                                <option value="inactive">غیرفعال</option>
                            </select>
                        </div>
                        {organizations.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">سازمان</label>
                                <select
                                    value={selectedOrganization}
                                    onChange={(e) => setSelectedOrganization(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">همه</option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
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

                {/* Departments Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام دپارتمان</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سازمان</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دپارتمان والد</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {departments.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            دپارتمانی یافت نشد
                                        </td>
                                    </tr>
                                ) : (
                                    departments.data.map((dept) => (
                                        <tr key={dept.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Building2 className="h-5 w-5 text-gray-400 ml-3" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {getLevelPrefix(dept.level)}{dept.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {dept.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {dept.organization?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {dept.parent?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[dept.status]}`}>
                                                    {statusLabels[dept.status]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2 space-x-reverse">
                                                <Link
                                                    href={route('departments.show', { department: dept.id })}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    مشاهده
                                                </Link>
                                                {can.edit && (
                                                    <Link
                                                        href={route('departments.edit', { department: dept.id })}
                                                        className="text-yellow-600 hover:text-yellow-900 inline-flex items-center gap-1 mr-3"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        ویرایش
                                                    </Link>
                                                )}
                                                {can.delete && (
                                                    <button
                                                        onClick={() => handleDelete(dept.id, dept.name)}
                                                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 mr-3"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        حذف
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {departments.last_page > 1 && (
                        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                نمایش {departments.from} تا {departments.to} از {departments.total} نتیجه
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={departments.current_page > 1 ? route('departments.index', { page: departments.current_page - 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${departments.current_page > 1 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                    قبلی
                                </Link>
                                {(() => {
                                    const pages = [];
                                    const maxVisible = 5;
                                    let start = Math.max(1, departments.current_page - Math.floor(maxVisible / 2));
                                    let end = Math.min(departments.last_page, start + maxVisible - 1);
                                    
                                    if (end - start + 1 < maxVisible) {
                                        start = Math.max(1, end - maxVisible + 1);
                                    }
                                    
                                    for (let i = start; i <= end; i++) {
                                        pages.push(i);
                                    }
                                    
                                    return pages.map((page) => (
                                        <Link
                                            key={page}
                                            href={route('departments.index', { page, ...filters })}
                                            className={`px-3 py-1 rounded-lg text-sm ${departments.current_page === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </Link>
                                    ));
                                })()}
                                <Link
                                    href={departments.current_page < departments.last_page ? route('departments.index', { page: departments.current_page + 1, ...filters }) : '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${departments.current_page < departments.last_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
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