// src/components/Navbar.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
        : '?';

    const roleLabel: Record<string, string> = {
        admin: 'Administrator',
        normal_user: 'User',
        store_owner: 'Store Owner',
    };

    const roleColor: Record<string, string> = {
        admin: 'badge-admin',
        normal_user: 'badge-user',
        store_owner: 'badge-owner',
    };

    const navLinks: Record<string, { label: string; path: string }[]> = {
        admin: [
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Users', path: '/admin/users' },
            { label: 'Stores', path: '/admin/stores' },
        ],
        normal_user: [{ label: 'Stores', path: '/stores' }],
        store_owner: [{ label: 'Dashboard', path: '/owner/dashboard' }],
    };

    const links = user ? navLinks[user.role] || [] : [];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex
                items-center justify-center">
                                <span className="text-white text-sm font-bold">SR</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">
                                StoreRating
                            </span>
                        </Link>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {links.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="px-3 py-2 text-sm text-gray-600 hover:text-indigo-600
                    hover:bg-indigo-50 rounded-lg transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right side */}
                    {user && (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/change-password"
                                className="hidden md:flex items-center gap-1.5 text-sm
                  text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2
                    2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4
                    4 0 00-8 0v4h8z" />
                                </svg>
                                Change Password
                            </Link>

                            {/* Avatar dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="flex items-center gap-2.5 p-1.5 rounded-xl
                    hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex
                    items-center justify-center">
                                        <span className="text-indigo-700 text-xs font-semibold">
                                            {initials}
                                        </span>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-xs font-medium text-gray-900 leading-none">
                                            {user.name.split(' ')[0]}
                                        </p>
                                        <span className={`text-xs ${roleColor[user.role] || ''}`}>
                                            {roleLabel[user.role]}
                                        </span>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {open && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white
                    rounded-xl border border-gray-100 shadow-lg py-1 z-50">
                                        <div className="px-4 py-2 border-b border-gray-50">
                                            <p className="text-xs font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                        <Link
                                            to="/change-password"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm
                        text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            Change password
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2
                        text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}