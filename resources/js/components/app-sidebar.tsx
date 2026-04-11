// resources/js/components/app-sidebar.tsx

import { Link, usePage } from '@inertiajs/react';
import { 
    FolderGit2, 
    LayoutGrid, 
    Users, 
    Building2, 
    Briefcase, 
    Mail, 
    Inbox, 
    Send, 
    FileText,
    Archive,
    BarChart3,
    Settings,
    UserCog,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';

import { index as ArchiveIndex } from '@/routes/archives';
import  cartable  from '@/routes/cartable';
import { index as DepartmentIndex } from '@/routes/departments';
import { index as LettersIndex, create as LetterCreate } from '@/routes/letters';
import { index as OrganizationIndex } from '@/routes/organizations';
import { index as PositionsIndex } from '@/routes/positions';
import { index as UsersIndex } from '@/routes/users';
import type { NavItem, NavGroup } from '@/types';
// import { index as SettingsIndex } from '@/routes/s';


const mainNavItems: NavItem[] = [
    {
        title: 'داشبورد',
        href: dashboard().url,
        icon: LayoutGrid,
    },
];

const navGroups: NavGroup[] = [
    {
        title: 'مدیریت سازمان',
        icon: Building2,
        items: [
            {
                title: 'سازمان‌ها',
                href: OrganizationIndex().url,
                icon: Building2,
            },
            {
                title: 'دپارتمان‌ها',
                href: DepartmentIndex().url,
                icon: Building2,
            },
            {
                title: 'سمت‌ها',
                href: PositionsIndex().url,
                icon: Briefcase,
            },
            {
                title: 'کاربران',
                href: UsersIndex().url,
                icon: Users,
            },
        ],
    },
    {
        title: 'نامه‌ها',
        icon: Mail,
        items: [
            {
                title: 'نامه‌های وارده',
                href: LettersIndex({ query: { type: 'incoming' } }).url,
                icon: Inbox,
            },
            {
                title: 'نامه‌های صادره',
                href: LettersIndex({ query: { type: 'outgoing' } }).url,
                icon: Send,
            },
            {
                title: 'نامه‌های داخلی',
                href: LettersIndex({ query: { type: 'internal' } }).url,
                icon: FileText,
            },
            {
                title: 'نامه جدید',
                href: LetterCreate().url,
                icon: Mail,
            },
        ],
    },
    {
        title: 'پیگیری',
        icon: FileText,
        items: [
            {
                title: 'کارتابل من',
                href: cartable.index().url,
                icon: Inbox,
            },
            {
                title: 'نامه‌های من',
                href: LettersIndex().url,
                icon: FileText,
            },
        ],
    },
    {
        title: 'بایگانی',
        icon: Archive,
        items: [
            {
                title: 'بایگانی اسناد',
                href: ArchiveIndex().url,
                icon: Archive,
            },
        ],
    },
    {
        title: 'گزارشات',
        icon: BarChart3,
        items: [
            {
                title: 'گزارشات آماری',
                href: LettersIndex().url,
                icon: BarChart3,
            },
        ],
    },
    {
        title: 'تنظیمات',
        icon: Settings,
        items: [
            {
                title: 'پروفایل من',
                href: LettersIndex().url,
                icon: UserCog,
            },
            {
                title: 'تنظیمات سیستم',
                href: LettersIndex().url,
                icon: Settings,
            },
        ],
    },
];

interface AppSidebarProps {
    userRole?: string;
}

export function AppSidebar({ userRole = 'user' }: AppSidebarProps) {
    const { url: currentUrl } = usePage();

    const getFilteredNavGroups = () => {
        if (userRole === 'super-admin') {
return navGroups;
}

        if (userRole === 'org-admin') {
            return navGroups.filter(group =>
                ['مدیریت سازمان', 'نامه‌ها', 'پیگیری', 'بایگانی', 'گزارشات', 'تنظیمات'].includes(group.title)
            );
        }

        if (userRole === 'dept-manager') {
            return navGroups
                .filter(group =>
                    ['نامه‌ها', 'پیگیری', 'بایگانی', 'گزارشات', 'تنظیمات'].includes(group.title)
                )
                .map(group => {
                    if (group.title === 'نامه‌ها') {
                        return {
                            ...group,
                            items: group.items.filter(item =>
                                ['نامه‌های وارده', 'نامه‌های صادره', 'نامه‌های داخلی', 'نامه جدید'].includes(item.title)
                            ),
                        };
                    }

                    return group;
                });
        }

        return navGroups
            .filter(group => ['نامه‌ها', 'پیگیری', 'تنظیمات'].includes(group.title))
            .map(group => {
                if (group.title === 'نامه‌ها') {
                    return {
                        ...group,
                        items: group.items.filter(item =>
                            ['نامه جدید', 'نامه‌های من'].includes(item.title)
                        ),
                    };
                }

                if (group.title === 'پیگیری') {
                    return {
                        ...group,
                        items: group.items.filter(item =>
                            ['کارتابل من', 'نامه‌های من'].includes(item.title)
                        ),
                    };
                }

                return group;
            });
    };

    const filteredNavGroups = getFilteredNavGroups();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                {filteredNavGroups.map((group) => (
                    <div key={group.title} className="mt-4">
                        <div className="px-3 py-2">
                            <div className="flex items-center gap-2 px-2 text-xs font-medium text-gray-500">
                                {group.icon && <group.icon className="h-4 w-4" />}
                                <span>{group.title}</span>
                            </div>
                            <div className="mt-1 space-y-1">
                                {group.items.map((item) => {
                                    const isActive = currentUrl.startsWith(new URL(item.href, window.location.origin).pathname);

                                    return (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-gray-900 hover:bg-gray-100 ${
                                                isActive
                                                    ? 'bg-gray-100 text-gray-900 font-medium'
                                                    : 'text-gray-600'
                                            }`}
                                        >
                                            {item.icon && <item.icon className="h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}