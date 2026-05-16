// resources/js/Hooks/usePermission.ts
import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage().props as any;
    
    const hasPermission = (permission: string): boolean => {
        if (!auth.user) return false;
        
        // اگر کاربر ادمین کل است
        if (auth.user.is_super_admin) return true;
        
        // بررسی دسترسی‌های کاربر (نقش + مستقیم)
        return auth.user.permissions?.all?.includes(permission) || false;
    };
    
    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some(permission => hasPermission(permission));
    };
    
    const hasAllPermissions = (permissions: string[]): boolean => {
        return permissions.every(permission => hasPermission(permission));
    };
    
    return { hasPermission, hasAnyPermission, hasAllPermissions };
}