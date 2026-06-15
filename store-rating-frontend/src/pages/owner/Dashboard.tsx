// src/pages/owner/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { Navbar } from '../../components/Navbar';
import { StarRating } from '../../components/StarRating';
import { SortableTable } from '../../components/SortableTable';

interface Rater {
    id: string;
    rating: number;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface StoreStats {
    average: number;
    count: number;
}

interface StoreData {
    id: string;
    name: string;
    owner?: { id: string };
    owner_id?: string;
    averageRating?: number;
}

export default function OwnerDashboard() {
    const { user } = useAuthStore();
    const [raters, setRaters] = useState<Rater[]>([]);
    const [stats, setStats] = useState<StoreStats>({ average: 0, count: 0 });
    const [storeName, setStoreName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // get all stores and find one belonging to this owner
                const storesRes = await api.get('/stores');
                const allStores: StoreData[] = storesRes.data;

                const myStore = allStores.find(
                    (s) =>
                        s.owner?.id === user.id ||
                        s.owner_id === user.id
                );

                if (!myStore) {
                    setError(
                        'No store is assigned to your account yet. Please contact the admin.'
                    );
                    setLoading(false);
                    return;
                }

                setStoreName(myStore.name);

                // fetch raters and stats in parallel
                const [ratersRes, statsRes] = await Promise.all([
                    api.get(`/ratings/store/${myStore.id}/raters`),
                    api.get(`/ratings/store/${myStore.id}/average`),
                ]);

                setRaters(ratersRes.data);
                setStats({
                    average: statsRes.data.average || 0,
                    count: statsRes.data.count || 0,
                });
            } catch (err: any) {
                setError(
                    err.response?.data?.message || 'Failed to load dashboard data'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // flatten for sortable table
    const tableData = raters.map((r) => ({
        name: r.user?.name || '—',
        email: r.user?.email || '—',
        rating: r.rating,
        date: new Date(r.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }),
    }));

    const columns = [
        { key: 'name', label: 'User name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'rating', label: 'Rating', sortable: true },
        { key: 'date', label: 'Date', sortable: true },
    ];

    return (
        <div className="page-wrapper">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Store Dashboard
                    </h1>
                    {storeName && (
                        <p className="text-gray-500 text-sm mt-1">
                            {storeName}
                        </p>
                    )}
                </div>

                {/* Error state */}
                {error && (
                    <div className="alert-error mb-6 flex items-start gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5"
                            fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0
                000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293
                1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0
                001.414-1.414L11.414 10l1.293-1.293a1 1 0
                00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Loading state */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
                                <div className="h-8 bg-gray-100 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : !error && (
                    <>
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

                            {/* Average rating card */}
                            <div className="card">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        Average rating
                                    </p>
                                    <div className="w-9 h-9 bg-amber-50 rounded-xl flex
                    items-center justify-center">
                                        <svg className="w-5 h-5 text-amber-500" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902
                        0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371
                        1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07
                        3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1
                        1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539
                        -1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98
                        8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0
                        00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl font-bold text-gray-900">
                                        {stats.average.toFixed(1)}
                                    </span>
                                    <span className="text-gray-400 text-sm mb-1">/ 5.0</span>
                                </div>
                                <div className="mt-2">
                                    <StarRating
                                        value={Math.round(stats.average)}
                                        readonly
                                        size="md"
                                    />
                                </div>
                            </div>

                            {/* Total ratings card */}
                            <div className="card">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        Total ratings
                                    </p>
                                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex
                    items-center justify-center">
                                        <svg className="w-5 h-5 text-indigo-500" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth={2} d="M17 20h5v-2a3 3 0
                        00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283
                        -.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7
                        20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002
                        0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-4xl font-bold text-gray-900">
                                    {stats.count}
                                </span>
                                <p className="text-sm text-gray-400 mt-2">
                                    customers rated your store
                                </p>
                            </div>
                        </div>

                        {/* Raters Table */}
                        <div className="card p-0 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-base font-semibold text-gray-900">
                                    Customer ratings
                                </h2>
                                <p className="text-sm text-gray-400 mt-0.5">
                                    All users who rated your store
                                </p>
                            </div>

                            {tableData.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-4xl mb-3">⭐</div>
                                    <p className="text-gray-500 font-medium">No ratings yet</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Ratings from customers will appear here
                                    </p>
                                </div>
                            ) : (
                                <SortableTable
                                    columns={columns}
                                    data={tableData}
                                    renderRow={(row) => (
                                        <>
                                            <td className="px-5 py-3.5 font-medium text-gray-900">
                                                {row.name}
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-500">
                                                {row.email}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <StarRating
                                                        value={row.rating}
                                                        readonly
                                                        size="sm"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {row.rating}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-400 text-sm">
                                                {row.date}
                                            </td>
                                        </>
                                    )}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}