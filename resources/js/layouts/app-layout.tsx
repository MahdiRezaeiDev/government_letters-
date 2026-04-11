// resources/js/layouts/app-layout.tsx

import { usePage } from '@inertiajs/react';
import React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { auth } = usePage().props as any;
    const userRole = auth.user?.roles?.[0]?.name || 'user';

    return (
        <SidebarProvider>
            <AppSidebar userRole={userRole} />
            <SidebarInset>
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </SidebarInset>
            <Toaster position="top-right" richColors closeButton />
        </SidebarProvider>
    );
}