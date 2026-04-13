// resources/js/components/UserSelector.tsx

import React, { useState, useEffect } from 'react';
import { ChevronDown, Building2, Briefcase, Users, UserIcon } from 'lucide-react';

interface Department {
    id: number;
    name: string;
    positions?: Position[];
}

interface Position {
    id: number;
    name: string;
    users?: User[];
}

interface User {
    id: number;
    name: string;
    position_name?: string;
}

interface UserSelectorProps {
    label?: string;
    value?: {
        department_id: number | null;
        position_id: number | null;
        user_id: number | null;
        user_name?: string;
        position_name?: string;
        department_name?: string;
    };
    onChange: (data: {
        department_id: number | null;
        position_id: number | null;
        user_id: number | null;
        user_name?: string;
        position_name?: string;
        department_name?: string;
    }) => void;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

export default function UserSelector({ 
    label, 
    value, 
    onChange, 
    required = false,
    disabled = false,
    className = '',
    placeholder = 'انتخاب کاربر'
}: UserSelectorProps) {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    
    const [selectedDeptId, setSelectedDeptId] = useState<number | null>(value?.department_id || null);
    const [selectedPositionId, setSelectedPositionId] = useState<number | null>(value?.position_id || null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(value?.user_id || null);
    
    const [loading, setLoading] = useState({
        departments: false,
        positions: false,
        users: false
    });

    // بارگذاری دپارتمان‌ها
    useEffect(() => {
        setLoading(prev => ({ ...prev, departments: true }));
        axios.get('/api/departments/list')
            .then(response => {
                setDepartments(response.data);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, departments: false }));
            });
    }, []);

    // بارگذاری پست‌های دپارتمان انتخاب شده
    useEffect(() => {
        if (selectedDeptId) {
            setLoading(prev => ({ ...prev, positions: true }));
            axios.get(`/api/departments/${selectedDeptId}/positions`)
                .then(response => {
                    setPositions(response.data);
                    setSelectedPositionId(null);
                    setSelectedUserId(null);
                })
                .finally(() => {
                    setLoading(prev => ({ ...prev, positions: false }));
                });
        } else {
            setPositions([]);
            setSelectedPositionId(null);
        }
    }, [selectedDeptId]);

    // بارگذاری کاربران پست انتخاب شده
    useEffect(() => {
        if (selectedPositionId) {
            setLoading(prev => ({ ...prev, users: true }));
            axios.get(`/api/positions/${selectedPositionId}/users`)
                .then(response => {
                    setUsers(response.data);
                    setSelectedUserId(null);
                })
                .finally(() => {
                    setLoading(prev => ({ ...prev, users: false }));
                });
        } else {
            setUsers([]);
            setSelectedUserId(null);
        }
    }, [selectedPositionId]);

    // وقتی کاربر انتخاب می‌شود
    const handleUserChange = (userId: number | null) => {
        setSelectedUserId(userId);
        const selectedUser = users.find(u => u.id === userId);
        const selectedPosition = positions.find(p => p.id === selectedPositionId);
        const selectedDept = departments.find(d => d.id === selectedDeptId);
        
        onChange({
            department_id: selectedDeptId,
            position_id: selectedPositionId,
            user_id: userId,
            user_name: selectedUser?.name,
            position_name: selectedPosition?.name,
            department_name: selectedDept?.name,
        });
    };

    // وقتی پست انتخاب می‌شود
    const handlePositionChange = (positionId: number | null) => {
        setSelectedPositionId(positionId);
        if (!positionId) {
            handleUserChange(null);
        }
    };

    // وقتی دپارتمان انتخاب می‌شود
    const handleDepartmentChange = (deptId: number | null) => {
        setSelectedDeptId(deptId);
        if (!deptId) {
            handlePositionChange(null);
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 mr-1">*</span>}
                </label>
            )}

            {/* انتخاب دپارتمان */}
            <div className="relative">
                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                    value={selectedDeptId || ''}
                    onChange={(e) => handleDepartmentChange(parseInt(e.target.value) || null)}
                    disabled={disabled || loading.departments}
                    className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <option value="">انتخاب دپارتمان...</option>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* انتخاب سمت */}
            {selectedDeptId && (
                <div className="relative">
                    <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                        value={selectedPositionId || ''}
                        onChange={(e) => handlePositionChange(parseInt(e.target.value) || null)}
                        disabled={disabled || loading.positions || positions.length === 0}
                        className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">انتخاب سمت...</option>
                        {positions.map(pos => (
                            <option key={pos.id} value={pos.id}>{pos.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            )}

            {/* انتخاب کاربر */}
            {selectedPositionId && (
                <div className="relative">
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                        value={selectedUserId || ''}
                        onChange={(e) => handleUserChange(parseInt(e.target.value) || null)}
                        disabled={disabled || loading.users || users.length === 0}
                        className="w-full pr-9 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">انتخاب کاربر...</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            )}

            {/* نمایش کاربر انتخاب شده */}
            {selectedUserId && value?.user_name && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">
                            کاربر انتخاب شده: {value.user_name}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}