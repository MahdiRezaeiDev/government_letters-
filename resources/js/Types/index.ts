export type * from './auth';
export type * from './navigation';
export type * from './ui';

// تایپ‌های اصلی سیستم
export interface User {
    id: number;
    organization_id: number | null;
    department_id: number | null;
    primary_position_id: number | null;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    national_code: string;
    mobile: string | null;
    employment_code: string | null;
    avatar: string | null;
    status: 'active' | 'inactive' | 'suspended';
    security_clearance: 'public' | 'internal' | 'confidential' | 'secret';
    roles: Role[];
    permissions: Permission[];
    organization?: Organization;
    department?: Department;
    primary_position?: Position;
    created_at: string;
    updated_at: string;
}

export interface Organization {
    id: number;
    name: string;
    code: string;
    logo: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    parent_id: number | null;
    status: 'active' | 'inactive';
    parent?: Organization;
    children?: Organization[];
    created_at: string;
    updated_at: string;
}

export interface Department {
    id: number;
    organization_id: number;
    name: string;
    code: string;
    parent_id: number | null;
    manager_position_id: number | null;
    status: 'active' | 'inactive';
    level: number;
    path: string | null;
    organization?: Organization;
    parent?: Department;
    children?: Department[];
    positions?: Position[];
    created_at: string;
    updated_at: string;
}

export interface Position {
    id: number;
    department_id: number;
    name: string;
    code: string;
    level: number;
    is_management: boolean;
    description: string | null;
    department?: Department;
    users?: User[];
    created_at: string;
    updated_at: string;
}

export interface Letter {
    id: number;
    organization_id: number;
    letter_type: 'incoming' | 'outgoing' | 'internal';
    letter_number: string;
    tracking_number: string;
    security_level: 'public' | 'internal' | 'confidential' | 'secret' | 'top_secret';
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    category_id: number | null;
    subject: string;
    summary: string | null;
    content: string | null;
    is_public: boolean;
    sender_user_id: number | null;
    sender_department_id: number | null;
    sender_name: string | null;
    sender_position_name: string | null;
    recipient_user_id: number | null;
    recipient_department_id: number | null;
    recipient_name: string | null;
    recipient_position_name: string | null;
    cc_recipients: number[] | null;
    date: string;
    due_date: string | null;
    response_deadline: string | null;
    parent_letter_id: number | null;
    thread_id: string | null;
    is_draft: boolean;
    final_status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
    created_by: number;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    category?: LetterCategory;
    creator?: User;
    sender_user?: User;
    recipient_user?: User;
    sender_department?: Department;
    recipient_department?: Department;
    attachments?: Attachment[];
    routings?: Routing[];
}

export interface LetterCategory {
    id: number;
    organization_id: number;
    name: string;
    code: string;
    parent_id: number | null;
    description: string | null;
    color: string;
    sort_order: number;
    status: boolean;
    parent?: LetterCategory;
    children?: LetterCategory[];
}

export interface Routing {
    id: number;
    letter_id: number;
    from_user_id: number;
    to_user_id: number;
    action_type: 'action' | 'information' | 'approval' | 'coordination' | 'sign';
    instruction: string | null;
    deadline: string | null;
    status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'skipped';
    completed_at: string | null;
    completed_note: string | null;
    priority: number;
    step_order: number;
    is_parallel: boolean;
    parallel_group_id: string | null;
    created_at: string;
    updated_at: string;
    letter?: Letter;
    from_user?: User;
    to_user?: User;
    actions?: Action[];
}

export interface Action {
    id: number;
    routing_id: number;
    user_id: number;
    action_type: 'view' | 'download' | 'complete' | 'reject' | 'forward' | 'comment' | 'sign';
    description: string | null;
    metadata: Record<string, any> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    user?: User;
    routing?: Routing;
}

export interface Archive {
    id: number;
    department_id: number;
    name: string;
    code: string;
    parent_id: number | null;
    description: string | null;
    location: string | null;
    is_active: boolean;
    department?: Department;
    parent?: Archive;
    children?: Archive[];
    cases?: Case[];
}

export interface Case {
    id: number;
    archive_id: number;
    title: string;
    case_number: string;
    description: string | null;
    retention_period: number | null;
    retention_unit: 'days' | 'months' | 'years' | null;
    expiry_date: string | null;
    is_active: boolean;
    created_by: number;
    created_at: string;
    updated_at: string;
    archive?: Archive;
    creator?: User;
    letters?: Letter[];
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

export interface Attachment {
    id: number;
    letter_id: number;
    user_id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    extension: string;
    download_count: number;
    created_at: string;
    user?: User;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface CartableStats {
    total: number;
    overdue: number;
    today: number;
    completed_today: number;
}

export interface DashboardStats {
    pending_actions: number;
    incoming_new: number;
    outgoing_new: number;
    internal_new: number;
    my_drafts: number;
    total_letters: number;
    total_users: number;
    total_departments: number;
    archived_count: number;
}