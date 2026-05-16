import React from 'react';
import { usePermission } from '@/hooks/usePermission';

interface CanProps {
    permission: string | string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function Can({ permission, children, fallback = null }: CanProps) {
    const { hasPermission, hasAnyPermission } = usePermission();

    let hasAccess = false;

    if (Array.isArray(permission)) {
        hasAccess = hasAnyPermission(permission);
    } else {
        hasAccess = hasPermission(permission);
    }

    return <>{hasAccess ? children : fallback}</>;
}