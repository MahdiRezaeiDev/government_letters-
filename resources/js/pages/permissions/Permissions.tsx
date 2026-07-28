import { Head, router } from '@inertiajs/react';
import { Shield, UserCheck, AlertCircle, Save } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<{ id: number; name: string }>;
    permissions: {
        all: string[];
        direct: string[];
        via_roles: string[];
    };
}

interface Props {
    user: User;
    allPermissions: Array<{ name: string; label: string }>;
    groupedPermissions: Record<string, Record<string, string>>;
}

export default function UserPermissions({
    user,
    allPermissions,
    groupedPermissions,
}: Props) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        user.permissions.direct || [],
    );
    const [saving, setSaving] = useState(false);

    const handlePermissionToggle = (permissionName: string, checked: boolean) => {
        if (checked) {
            setSelectedPermissions([...selectedPermissions, permissionName]);
        } else {
            setSelectedPermissions(
                selectedPermissions.filter((p) => p !== permissionName),
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        router.put(`/admin/users/${user.id}/permissions`, {
            permissions: selectedPermissions,
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const hasViaRole = (permission: string) =>
        user.permissions.via_roles?.includes(permission);

    return (
        <>
            <Head title="مدیریت دسترسی‌ها" />

            <div className="py-6" dir="rtl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Shield className="h-6 w-6 text-indigo-600" />
                            مدیریت دسترسی‌های مستقیم
                        </h1>
                        <p className="text-gray-600 mt-1">
                            کاربر: {user.name} ({user.email})
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <UserCheck className="h-5 w-5 text-blue-500" />
                                <h3 className="text-lg font-semibold">نقش‌های کاربر</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {user.roles.length > 0 ? (
                                    user.roles.map((role) => (
                                        <span
                                            key={role.id}
                                            className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold"
                                        >
                                            {role.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">بدون نقش</span>
                                )}
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                <p className="text-xs text-blue-800">
                                    دسترسی مستقیم اولویت بالاتری نسبت به دسترسی نقش دارد.
                                </p>
                            </div>
                        </div>

                        {Object.entries(groupedPermissions).map(
                            ([groupName, permissions]) => (
                                <div
                                    key={groupName}
                                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                                >
                                    <h3 className="text-lg font-semibold mb-4">{groupName}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {Object.entries(permissions).map(
                                            ([permName, permLabel]) => {
                                                const viaRole = hasViaRole(permName);
                                                const direct =
                                                    selectedPermissions.includes(permName);

                                                return (
                                                    <label
                                                        key={permName}
                                                        className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={direct}
                                                            onChange={(e) =>
                                                                handlePermissionToggle(
                                                                    permName,
                                                                    e.target.checked,
                                                                )
                                                            }
                                                            className="mt-1"
                                                        />
                                                        <div>
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {permLabel}
                                                            </span>
                                                            {viaRole && (
                                                                <span className="block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                                                                    از طریق نقش
                                                                </span>
                                                            )}
                                                        </div>
                                                    </label>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            ),
                        )}

                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="text-lg font-semibold mb-3">
                                خلاصه دسترسی‌های مستقیم ({selectedPermissions.length})
                            </h3>
                            {selectedPermissions.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {selectedPermissions.map((perm) => {
                                        const permission = allPermissions.find(
                                            (p) => p.name === perm,
                                        );
                                        return (
                                            <span
                                                key={perm}
                                                className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold"
                                            >
                                                {permission?.label || perm}
                                            </span>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    هیچ دسترسی مستقیمی تعریف نشده است.
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                انصراف
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                {saving ? 'در حال ذخیره...' : 'ذخیره دسترسی‌ها'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
