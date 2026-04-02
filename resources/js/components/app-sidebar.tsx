import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    LetterText,
    Inbox,
    BarChart2,
    Archive,
    Users,
    Building2,
    Briefcase,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { dashboard } from '@/routes';
import cartable from '@/routes/cartable';
import letters from '@/routes/letters';
import reports from '@/routes/reports';
import adminUsers from '@/routes/admin/users';
import adminDepartments from '@/routes/admin/departments';
import adminPositions from '@/routes/admin/positions';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'داشبورد',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'کارتابل',
        href: cartable.index(),
        icon: Inbox,
    },
    {
        title: 'نامه‌ها',
        href: letters.index(),
        icon: LetterText,
    },
    {
        title: 'گزارش‌ها',
        href: reports.index(),
        icon: BarChart2,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'کاربران',
        href: adminUsers.index(),
        icon: Users,
    },
    {
        title: 'واحدها',
        href: adminDepartments.index(),
        icon: Building2,
    },
    {
        title: 'سمت‌ها',
        href: adminPositions.index(),
        icon: Briefcase,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="عمومی" />
                <NavMain items={adminNavItems} label="مدیریت" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}