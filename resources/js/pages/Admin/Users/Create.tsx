import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import * as users from '@/routes/admin/users';

interface Role     { id: number; name: string; }
interface Position { id: number; name: string; department: { name: string }; }

interface Props {
    roles:     Role[];
    positions: Position[];
}

interface UserForm {
    first_name:    string;
    last_name:     string;
    username:      string;
    email:         string;
    password:      string;
    national_code: string;
    mobile:        string;
    role:          string;
    position_id:   string;
    status:        'active' | 'inactive' | 'suspended';
}

export default function Create({ roles, positions }: Props) {

    const { data, setData, post, processing, errors } = useForm<UserForm>({
        first_name:    '',
        last_name:     '',
        username:      '',
        email:         '',
        password:      '',
        national_code: '',
        mobile:        '',
        role:          '',
        position_id:   '',
        status:        'active',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(users.store().url);
    }

    return (
        <AuthenticatedLayout header="کاربر جدید">
            <Head title="کاربر جدید" />

            <div className="p-6 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                            {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={e => setData('username', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">موبایل</label>
                            <input
                                type="text"
                                value={data.mobile}
                                onChange={e => setData('mobile', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نقش</label>
                            <select
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">انتخاب کنید</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                ))}
                            </select>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">سمت</label>
                            <select
                                value={data.position_id}
                                onChange={e => setData('position_id', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">انتخاب کنید</option>
                                {positions.map(pos => (
                                    <option key={pos.id} value={pos.id}>
                                        {pos.name} — {pos.department.name}
                                    </option>
                                ))}
                            </select>
                            {errors.position_id && <p className="text-red-500 text-xs mt-1">{errors.position_id}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                        <select
                            value={data.status}
                            onChange={e => setData('status', e.target.value as UserForm['status'])}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="active">فعال</option>
                            <option value="inactive">غیرفعال</option>
                            <option value="suspended">معلق</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'در حال ذخیره...' : 'ذخیره'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.visit(users.index().url)}
                            className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm"
                        >
                            انصراف
                        </button>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}