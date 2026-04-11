// resources/js/types/navigation.ts

export interface NavItem {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    active?: boolean;
    items?: NavItem[];
    permission?: string;
}

export interface NavGroup {
    title: string;
    icon?: React.ComponentType<{ className?: string }>;
    items: NavItem[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
    current?: boolean;
}