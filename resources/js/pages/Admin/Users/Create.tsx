import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { useState } from 'react';
import * as users from '@/routes/admin/users';

interface Role         { id: number; name: string; }
interface Organization { id: number; name: string; }
interface Department   { id: number; name: string; parent_id: number | null; }
interface Position     { id: number; name: string; level: number; }

interface Props {
    roles:         Role[];
    organizations: Organization[];
}

interface UserForm {
    first_name:      string;
    last_name:       string;
    username:        string;
    email:           string;
    password:        string;
    national_code:   string;
    mobile:          string;
    role:            string;
    organization_id: string;
    department_id:   string;
    position_id:     string;
    status:          'active' | 'inactive' | 'suspended';
}

export default function Create({ roles, organizations }: Props) {

    const { data, setData, post, processing, errors } = useForm<UserForm>({
        first_name:      '',
        last_name:       '',
        username:        '',
        email:           '',
        password:        '',
        national_code:   '',
        mobile:          '',
        role:            '',
        organization_id: '',
        department_id:   '',
        position_id:     '',
        status:          'active',
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [positions,   setPositions]   = useState<Position[]>([]);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadingPos,   setLoadingPos]   = useState(false);

    // وقتی سازمان عوض شد
    async function handleOrgChange(orgId: string) {
        setData(prev => ({
            ...prev,
            organization_id: orgId,
            department_id:   '',
            position_id:     '',
        }));
        setDepartments([]);
        setPositions([]);

        if (!orgId) return;

        setLoadingDepts(true);
        try {
            const res  = await fetch(`/api/organizations/${orgId}/departments`);
            const data = await res.json();
            setDepartments(data);
        } finally {
            setLoadingDepts(false);
        }
    }

    // وقتی واحد عوض شد
    async function handleDeptChange(deptId: string) {
        setData(prev => ({ ...prev, department_id: deptId, position_id: '' }));
        setPositions([]);

        if (!deptId) return;

        setLoadingPos(true);
        try {
            const res  = await fetch(`/api/departments/${deptId}/positions`);
            const data = await res.json();
            setPositions(data);
        } finally {
            setLoadingPos(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(users.store().url);
    }

    return (
        <AuthenticatedLayout breadcrumbs={[
            { title: 'کاربران', href: users.index().url },
            { title: 'کاربر جدید', href: users.create().url },
        ]}>
            <Head title="کاربر جدید" />

            <div className="p-6 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">

                    {/* نام و نام خانوادگی */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                            <input type="text" value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                            {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                            <input type="text" value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                        </div>
                    </div>

                    {/* نام کاربری و ایمیل */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
                            <input type="text" value={data.username}
                                onChange={e => setData('username', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                            <input type="email" value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    {/* رمز عبور و موبایل */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
                            <input type="password" value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">موبایل</label>
                            <input type="text" value={data.mobile}
                                onChange={e => setData('mobile', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>

                    {/* کد ملی */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                        <input type="text" value={data.national_code}
                            onChange={e => setData('national_code', e.target.value)}
                            maxLength={10}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        {errors.national_code && <p className="text-red-500 text-xs mt-1">{errors.national_code}</p>}
                    </div>

                    {/* بخش‌بندی ساختار سازمانی */}
                    <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-600">ساختار سازمانی</h3>

                        {/* ۱. سازمان */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                سازمان <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.organization_id}
                                onChange={e => handleOrgChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                            >
                                <option value="">انتخاب سازمان...</option>
                                {organizations.map(o => (
                                    <option key={o.id} value={o.id}>{o.name}</option>
                                ))}
                            </select>
                            {errors.organization_id && <p className="text-red-500 text-xs mt-1">{errors.organization_id}</p>}
                        </div>

                        {/* ۲. واحد — فقط بعد از انتخاب سازمان */}
                        {data.organization_id && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    واحد سازمانی <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.department_id}
                                    onChange={e => handleDeptChange(e.target.value)}
                                    disabled={loadingDepts}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white disabled:bg-gray-100"
                                >
                                    <option value="">
                                        {loadingDepts ? 'در حال بارگذاری...' : 'انتخاب واحد...'}
                                    </option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                                {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id}</p>}
                            </div>
                        )}

                        {/* ۳. سمت — فقط بعد از انتخاب واحد */}
                        {data.department_id && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    سمت <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.position_id}
                                    onChange={e => setData('position_id', e.target.value)}
                                    disabled={loadingPos}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white disabled:bg-gray-100"
                                >
                                    <option value="">
                                        {loadingPos ? 'در حال بارگذاری...' : 'انتخاب سمت...'}
                                    </option>
                                    {positions.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} (سطح {p.level})
                                        </option>
                                    ))}
                                </select>
                                {errors.position_id && <p className="text-red-500 text-xs mt-1">{errors.position_id}</p>}
                            </div>
                        )}
                    </div>

                    {/* نقش و وضعیت */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                نقش <span className="text-red-500">*</span>
                            </label>
                            <select value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option value="">انتخاب کنید</option>
                                {roles.map(r => (
                                    <option key={r.id} value={r.name}>{r.name}</option>
                                ))}
                            </select>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                            <select value={data.status}
                                onChange={e => setData('status', e.target.value as UserForm['status'])}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option value="active">فعال</option>
                                <option value="inactive">غیرفعال</option>
                                <option value="suspended">معلق</option>
                            </select>
                        </div>
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'در حال ذخیره...' : 'ذخیره'}
                        </button>
                        <button type="button"
                            onClick={() => router.visit(users.index().url)}
                            className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200">
                            انصراف
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}