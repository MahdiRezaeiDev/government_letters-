import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false); // مخصوص موبایل
    const [collapsed, setCollapsed] = useState(false);    // مخصوص دسکتاپ
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            if (mobile) {
                setCollapsed(false);
            } // در موبایل حالت جمع شده نداریم
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // محاسبه عرض سایدبار برای ایجاد فاصله در محتوا و هدر
    const sidebarWidthClasses = collapsed ? 'mr-20' : 'mr-72';

    return (
        <div className="min-h-screen bg-gray-100" dir="rtl">
            {/* سایدبار دسکتاپ */}
            {!isMobile && (
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
            )}

            {/* منوی موبایل */}
            {isMobile && (
                <MobileMenu
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            )}

            {/* بخش محتوا و هدر: عرض این بخش با انیمیشن تغییر می‌کند */}
            <div className={`flex flex-col min-h-screen transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${!isMobile ? sidebarWidthClasses : ''}`}>
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    isMobile={isMobile}
                    collapsed={collapsed}
                />

                <main className="flex-1 p-4 md:p-6 mt-2">
                    {children}
                </main>
            </div>
        </div>
    );
}