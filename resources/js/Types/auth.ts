// resources/js/types/auth.ts

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    roles?: { id: number; name: string }[];
    permissions?: { id: number; name: string }[];
}

export interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}