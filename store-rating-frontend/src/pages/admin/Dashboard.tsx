// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Navbar } from '../../components/Navbar';
import { useAuthStore } from '../../store/authStore';

interface Stats {
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    useEffect(() => {
        api.get('/admin/dashboard')
            .then(res => setStats(res.data))
            .finally(() => setLoading(false));
    }, []);

    const statCards = [
        {
            label: 'Total users',
            value: stats?.totalUsers ?? 0,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10
            0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0
            015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0
            0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            ),
            bg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            textColor: 'text-blue-700',
        },
        {
            label: 'Total stores',
            value: stats?.totalStores ?? 0,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2
            0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5
            10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
            ),
            bg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            textColor: 'text-emerald-700',
        },
        {
            label: 'Total ratings',
            value: stats?.totalRatings ?? 0,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519
            4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588
            1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755
            1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976
            2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0
            00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1
            1 0 00.951-.69l1.519-4.674z"/>
                </svg>
            ),
            bg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            textColor: 'text-amber-700',
        },
    ];

    const quickActions = [
        {
            title: 'Manage users',
            desc: 'View, filter, and add new users to the platform',
            path: '/admin/users',
            icon: '👥',
            color: 'hover:border-blue-300 hover:bg-blue-50',
        },
        {
            title: 'Manage stores',
            desc: 'View, filter, and register new stores',
            path: '/admin/stores',
            icon: '🏪',
            color: 'hover:border-emerald-300 hover:bg-emerald-50',
        },
    ];

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user?.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Here's what's happening on your platform
                    </p>
                </div>

                {/* Stat Cards */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border
                border-gray-100 p-6 animate-pulse">
                                <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                                <div className="h-8 bg-gray-100 rounded w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {statCards.map(card => (
                            <div key={card.label}
                                className="bg-white rounded-2xl border border-gray-100
                  shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-gray-500 font-medium">
                                        {card.label}
                                    </p>
                                    <div className={`w-9 h-9 ${card.bg} rounded-xl flex
                    items-center justify-center ${card.iconColor}`}>
                                        {card.icon}
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">
                                    {card.value.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Quick actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map(action => (
                        <button
                            key={action.path}
                            onClick={() => navigate(action.path)}
                            className={`bg-white rounded-2xl border border-gray-100
                p-6 text-left transition-all duration-200 shadow-sm
                ${action.color} group`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">{action.icon}</span>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1
                    group-hover:text-indigo-700 transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{action.desc}</p>
                                </div>
                                <svg className="w-5 h-5 text-gray-300 ml-auto
                  group-hover:text-indigo-400 transition-colors"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}