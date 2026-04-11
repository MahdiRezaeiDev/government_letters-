// resources/js/types/ui.ts

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface Column<T = any> {
    key: keyof T | string;
    title: string;
    sortable?: boolean;
    render?: (value: any, record: T) => React.ReactNode;
}