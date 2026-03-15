// ===== تعریف تایپ‌های TypeScript =====

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  national_code?: string;
  mobile?: string;
  employment_code?: string;
  avatar?: string;
  avatar_url: string;
  status: 'active' | 'inactive' | 'suspended';
  organization_id?: number;
  organization?: Organization;
  created_at: string;
}

export interface Organization {
  id: number;
  name: string;
  code: string;
  logo?: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  parent_id?: number;
  status: 'active' | 'inactive';
  departments_count?: number;
  users_count?: number;
}

export interface Department {
  id: number;
  organization_id: number;
  name: string;
  code?: string;
  parent_id?: number;
  status: 'active' | 'inactive';
  level: number;
  path?: string;
  parent?: Department;
  children?: Department[];
  positions?: Position[];
}

export interface Position {
  id: number;
  department_id: number;
  name: string;
  code: string;
  level: number;
  is_management: boolean;
  description?: string;
  department?: Department;
}

export interface LetterCategory {
  id: number;
  organization_id: number;
  name: string;
  code?: string;
  parent_id?: number;
  color: string;
  status: boolean;
}

export type LetterType = 'incoming' | 'outgoing' | 'internal';
export type LetterStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
export type Priority = 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
export type SecurityLevel = 'public' | 'internal' | 'confidential' | 'secret' | 'top_secret';

export interface Letter {
  id: number;
  organization_id: number;
  letter_type: LetterType;
  letter_number?: string;
  tracking_number?: string;
  security_level: SecurityLevel;
  priority: Priority;
  category_id?: number;
  category?: LetterCategory;
  subject: string;
  summary?: string;
  content?: string;
  sender_type: 'internal' | 'external';
  sender_id?: number;
  sender_name?: string;
  sender_position?: string;
  recipient_type: 'internal' | 'external';
  recipient_id?: number;
  recipient_name?: string;
  recipient_position?: string;
  date: string;
  due_date?: string;
  response_deadline?: string;
  sheet_count: number;
  is_draft: boolean;
  final_status: LetterStatus;
  created_by?: number;
  created_by_user?: User;
  attachments?: Attachment[];
  routings?: Routing[];
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: number;
  letter_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_size_formatted: string;
  mime_type?: string;
  extension?: string;
  url: string;
  download_count: number;
  created_at: string;
}

export type RoutingActionType = 'action' | 'information' | 'approval' | 'coordination' | 'sign';
export type RoutingStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'skipped';

export interface Routing {
  id: number;
  letter_id: number;
  letter?: Letter;
  from_user_id?: number;
  from_user?: User;
  from_position_id?: number;
  from_position?: Position;
  to_user_id?: number;
  to_user?: User;
  to_position_id?: number;
  to_position?: Position;
  action_type: RoutingActionType;
  instruction?: string;
  deadline?: string;
  status: RoutingStatus;
  completed_at?: string;
  completed_note?: string;
  step_order: number;
  created_at: string;
}

export interface CartableStats {
  total: number;
  pending: number;
  overdue: number;
  completed: number;
}

export interface DashboardStats {
  letterStats: {
    incoming: number;
    outgoing: number;
    internal: number;
    pending: number;
  };
  cartableStats: CartableStats;
  recentLetters: Letter[];
  announcements: Announcement[];
  chartData: Array<{ date: string; letter_type: LetterType; count: number }>;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: Priority;
  is_published: boolean;
  publish_date?: string;
  expiry_date?: string;
  created_at: string;
}

// پاژینیشن
export interface Paginator<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

// فلش پیام
export interface FlashMessages {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
}

// پراپس مشترک Inertia
export interface PageProps {
  auth: { user: User };
  flash: FlashMessages;
  errors: Record<string, string>;
  ziggy?: unknown;
}
