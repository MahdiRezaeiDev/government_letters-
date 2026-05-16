// resources/js/Pages/Admin/Users/Permissions.tsx
import { router } from '@inertiajs/react';
import { Shield, UserCheck, AlertCircle, Save } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardHeader, CardContent } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';

interface Permission {
    name: string;
    label: string;
}

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

export default function UserPermissions({ user, allPermissions, groupedPermissions }: Props) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        user.permissions.direct
    );
    const [saving, setSaving] = useState(false);

    const handlePermissionToggle = (permissionName: string, checked: boolean) => {
        if (checked) {
            setSelectedPermissions([...selectedPermissions, permissionName]);
        } else {
            setSelectedPermissions(selectedPermissions.filter(p => p !== permissionName));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        router.put(route('admin.users.permissions.update', user.id), {
            permissions: selectedPermissions
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    // بررسی آیا کاربر از طریق نقش این دسترسی را دارد
    const hasViaRole = (permission: string) => {
        return user.permissions.via_roles.includes(permission);
    };

    // بررسی آیا دسترسی مستقیم دارد
    const hasDirect = (permission: string) => {
        return selectedPermissions.includes(permission);
    };

    return (
        <>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Shield className="h-6 w-6" />
                            مدیریت دسترسی‌های مستقیم
                        </h1>
                        <p className="text-gray-600 mt-1">
                            کاربر: {user.name} ({user.email})
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* User Roles Info */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="h-5 w-5 text-blue-500" />
                                        <h3 className="text-lg font-semibold">نقش‌های کاربر</h3>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles.length > 0 ? (
                                            user.roles.map(role => (
                                                <Badge key={role.id} variant="secondary" className="text-sm">
                                                    {role.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 text-sm">بدون نقش</span>
                                        )}
                                    </div>
                                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                            <div className="text-xs text-blue-800">
                                                <p className="font-medium">توجه:</p>
                                                <p>
                                                    دسترسی‌های مستقیم اولویت بالاتری نسبت به دسترسی‌های نقش دارند.
                                                    اگر یک دسترسی را در این بخش فعال کنید، حتی اگر نقش آن را نداشته باشد، کاربر به آن دسترسی خواهد داشت.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Permissions Groups */}
                            {Object.entries(groupedPermissions).map(([groupName, permissions]) => (
                                <Card key={groupName}>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold">{groupName}</h3>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {Object.entries(permissions).map(([permName, permLabel]) => {
                                                const viaRole = hasViaRole(permName);
                                                const direct = hasDirect(permName);

                                                return (
                                                    <div key={permName} className="flex items-start space-x-3 space-x-reverse">
                                                        <Checkbox
                                                            id={permName}
                                                            checked={direct}
                                                            onCheckedChange={(checked) =>
                                                                handlePermissionToggle(permName, checked as boolean)
                                                            }
                                                            className="mt-1"
                                                        />
                                                        <div className="flex-1">
                                                            <label
                                                                htmlFor={permName}
                                                                className="text-sm font-medium text-gray-700 cursor-pointer"
                                                            >
                                                                {permLabel}
                                                            </label>
                                                            {viaRole && (
                                                                <div className="mt-1">
                                                                    <Badge variant="outline" className="text-xs bg-green-50">
                                                                        از طریق نقش
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                            {direct && viaRole && (
                                                                <p className="text-xs text-orange-600 mt-1">
                                                                    ⚡ دسترسی مستقیم (اولویت بالاتر)
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Summary Card */}
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">خلاصه دسترسی‌های مستقیم</h3>
                                </CardHeader>
                                <CardContent>
                                    {selectedPermissions.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPermissions.map(perm => {
                                                const permission = allPermissions.find(p => p.name === perm);

                                                return (
                                                    <Badge key={perm} variant="default" className="bg-blue-500">
                                                        {permission?.label || perm}
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">
                                            هیچ دسترسی مستقیمی برای این کاربر تعریف نشده است.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    انصراف
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    <Save className="h-4 w-4 ml-2" />
                                    {saving ? 'در حال ذخیره...' : 'ذخیره دسترسی‌ها'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}