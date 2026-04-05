import { Head, Link, router } from '@inertiajs/react';
import { Plus, UserCircle } from 'lucide-react';
import * as users from '@/routes/admin/users';

interface User {
    id: number; first_name: string; last_name: string;
    username: string; email: string;
    status: 'active' | 'inactive' | 'suspended';
    activePosition: { name: string; department: { name: string } } | null;
}

interface Props {
    users: {
        data: User[]; total: number; last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const STATUS_LABEL = { active: 'فعال', inactive: 'غیرفعال', suspended: 'معلق' };
const STATUS_STYLE = {
    active:    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    inactive:  'bg-muted text-muted-foreground',
    suspended: 'bg-destructive/10 text-destructive',
};

export default function Index({ users: data }: Props) {
    return (
        <>
            <Head title="کاربران" />
            <div className="p-6 max-w-6xl mx-auto space-y-5">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-foreground">کاربران</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{data.total} کاربر</p>
                    </div>
                    <Link href={users.create().url}
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors font-medium">
                        <Plus size={14} /> کاربر جدید
                    </Link>
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
                        <span>کاربر</span><span>سمت</span><span>واحد</span><span>وضعیت</span><span>عملیات</span>
                    </div>
                    <div className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <div className="flex flex-col items-center py-16 text-muted-foreground/40">
                                <UserCircle size={32} className="mb-2" />
                                <p className="text-sm">کاربری وجود ندارد</p>
                            </div>
                        ) : data.data.map(user => (
                            <div key={user.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-muted/30 transition-colors group">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{user.first_name} {user.last_name}</p>
                                    <p className="text-xs text-muted-foreground">{user.username}</p>
                                </div>
                                <p className="text-sm text-foreground">{user.activePosition?.name ?? '---'}</p>
                                <p className="text-sm text-muted-foreground">{user.activePosition?.department.name ?? '---'}</p>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium w-fit ${STATUS_STYLE[user.status]}`}>
                                    {STATUS_LABEL[user.status]}
                                </span>
                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={users.edit(user.id).url} className="text-xs text-primary hover:underline">ویرایش</Link>
                                    <button onClick={() => { if (confirm('حذف شود؟')) router.delete(users.destroy(user.id).url); }}
                                        className="text-xs text-destructive/70 hover:text-destructive transition-colors">حذف</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {data.last_page > 1 && (
                    <div className="flex gap-1 justify-center">
                        {data.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'}
                                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${link.active ? 'bg-primary text-primary-foreground font-medium' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}