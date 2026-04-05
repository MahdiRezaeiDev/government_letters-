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
import { Building } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
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
import adminDepartments from '@/routes/admin/departments';
import * as adminOrgs from '@/routes/admin/organizations';
import adminPositions from '@/routes/admin/positions';
import adminUsers from '@/routes/admin/users';
import * as archivesRoute from '@/routes/archives';
import cartable from '@/routes/cartable';
import letters from '@/routes/letters';
import reports from '@/routes/reports';
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
        title: 'مکاتیب',
        href: letters.index(),
        icon: LetterText,
    },
    {
        title: 'گزارش‌ها',
        href: reports.index(),
        icon: BarChart2,
    },
    {
        title: 'آرشیف',
        href:  archivesRoute.index(),
        icon:  Archive,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'وزارتخانه‌ها',
        href:  adminOrgs.index(),
        icon:  Building,
    },
    {
        title: 'مدیریت کارمندان',
        href: adminUsers.index(),
        icon: Users,
    },
    {
        title: 'ریاست ها',
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