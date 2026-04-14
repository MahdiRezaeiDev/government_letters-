import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100" dir="rtl">
            {/* دسکتاپ: سایدبار همیشه باز */}
            {!isMobile && <Sidebar />}
            
            {/* موبایل: منوی همبرگری */}
            {isMobile && <MobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
            
            {/* محتوای اصلی */}
            <div className={`flex flex-col min-h-screen ${!isMobile ? 'mr-64' : ''}`}>
                <Header onMenuClick={() => setSidebarOpen(true)} isMobile={isMobile} />
                
                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}