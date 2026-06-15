// src/components/ProtectedRoute.tsx
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface Props {
    children: ReactNode;
    roles: string[];
}

export function ProtectedRoute({ children, roles }: Props) {
    const user = useAuthStore(s => s.user);
    if (!user) return <Navigate to="/login" replace />;
    if (!roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
    return <>{children}</>;
}