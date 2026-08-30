import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { Sidebar } from './Sidebar';
import { useLocale } from '@/hooks/use-locale';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { isRtl } = useLocale();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            if (mobile) {
                setCollapsed(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close mobile menu when switching to desktop
    useEffect(() => {
        if (!isMobile) {
            setSidebarOpen(false);
        }
    }, [isMobile]);

    const sidebarWidthClasses = collapsed
        ? (isRtl ? 'md:mr-20' : 'md:ml-20')
        : (isRtl ? 'md:mr-72' : 'md:ml-72');

    return (
        <div className="min-h-screen bg-slate-100" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Desktop Sidebar */}
            {!isMobile && (
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
            )}

            {/* Mobile Menu */}
            {isMobile && (
                <MobileMenu
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className={`flex flex-col min-h-screen bg-gradient-to-b from-slate-100 to-slate-200/70 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${!isMobile ? sidebarWidthClasses : ''}`}>
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    isMobile={isMobile}
                    collapsed={collapsed}
                />

                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
