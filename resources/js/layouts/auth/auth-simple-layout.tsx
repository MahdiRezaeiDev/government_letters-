// resources/js/layouts/auth/auth-simple-layout.tsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
}

export default function AuthSimpleLayout({ title, description, children }: AuthLayoutProps) {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <Head title={title} />

            {children}
        </>
    );
}