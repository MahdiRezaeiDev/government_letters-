import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface User {
    id: number;
    full_name: string;
    username: string;
    email: string;
    status: string;
    roles: string[];
    organization: { id: number; name: string } | null;
    primary_position: { position: string; department: string } | null;
}

interface Props {
    users: {
        data: User[];
        meta: { current_page: number; last_page: number; total: number };
    };
    filters: { search?: string; status?: string };
}

const statusConfig = {
    active:    { label: 'فعال',      variant: 'default'     as const },
    inactive:  { label: 'غیرفعال',  variant: 'secondary'   as const },
    suspended: { label: 'تعلیق',    variant: 'destructive' as const },
};

export default function UsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const debouncedSearch = useDebounce(search, 400);

    // جستجو با debounce
    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('users.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('آیا مطمئن هستید؟')) return;
        router.delete(route('users.destroy', id));
    };

    return (
        <AppLayout>
            <Head title="مدیریت کاربران" />

            <div className="space-y-6 p-6" dir="rtl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">مدیریت کاربران</h1>
                    <Link href={route('users.create')}>
                        <Button>
                            <Plus className="ml-2 h-4 w-4" />
                            کاربر جدید
                        </Button>
                    </Link>
                </div>

                {/* فیلترها */}
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="جستجو..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pr-9"
                        />
                    </div>
                </div>

                {/* جدول */}
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">نام کاربر</TableHead>
                                <TableHead className="text-right">نام کاربری</TableHead>
                                <TableHead className="text-right">سازمان</TableHead>
                                <TableHead className="text-right">سمت</TableHead>
                                <TableHead className="text-right">نقش</TableHead>
                                <TableHead className="text-right">وضعیت</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.full_name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.username}
                                    </TableCell>
                                    <TableCell>
                                        {user.organization?.name ?? '-'}
                                    </TableCell>
                                    <TableCell>
                                        {user.primary_position ? (
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {user.primary_position.position}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {user.primary_position.department}
                                                </div>
                                            </div>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role) => (
                                                <Badge key={role} variant="outline">
                                                    {role}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusConfig[user.status as keyof typeof statusConfig]?.variant}>
                                            {statusConfig[user.status as keyof typeof statusConfig]?.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('users.show', user.id)}>
                                                        مشاهده
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('users.edit', user.id)}>
                                                        ویرایش
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    حذف
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* اطلاعات صفحه‌بندی */}
                <p className="text-sm text-muted-foreground">
                    مجموع {users.meta.total} کاربر | صفحه {users.meta.current_page} از {users.meta.last_page}
                </p>
            </div>
        </AppLayout>
    );
}