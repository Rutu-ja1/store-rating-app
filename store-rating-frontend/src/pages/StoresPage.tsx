// src/pages/StoresPage.tsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Navbar } from '../components/Navbar';
import { StarRating } from '../components/StarRating';

interface Store {
    id: string;
    name: string;
    email: string;
    address: string;
    averageRating: number;
    totalRatings: number;
    myRating: number | null;
}

export default function StoresPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState({ name: '', address: '' });
    const [ratingLoading, setRatingLoading] = useState<string | null>(null);
    const [toast, setToast] = useState({ msg: '', type: '' });

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: '', type: '' }), 3000);
    };

    const fetchStores = async () => {
        setLoading(true);
        try {
            const res = await api.get('/stores', {
                params: {
                    name: search.name || undefined,
                    address: search.address || undefined,
                },
            });
            setStores(res.data);
        } catch {
            showToast('Failed to load stores', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStores(); }, []);

    const handleRate = async (storeId: string, rating: number) => {
        setRatingLoading(storeId);
        try {
            await api.post('/ratings', { storeId, rating });
            showToast('Rating saved successfully!', 'success');
            fetchStores();
        } catch {
            showToast('Failed to save rating', 'error');
        } finally {
            setRatingLoading(null);
        }
    };

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Toast */}
            {toast.msg && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl
          text-sm font-medium shadow-lg transition-all
          ${toast.type === 'success'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-500 text-white'}`}>
                    {toast.msg}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">All Stores</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Browse and rate stores on the platform
                    </p>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl border border-gray-100
          shadow-sm p-4 mb-6 flex gap-3 flex-wrap items-center">
                    <div className="flex-1 min-w-[200px] relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2
              w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by store name..."
                            value={search.name}
                            onChange={e => setSearch({ ...search, name: e.target.value })}
                            className="input pl-9"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px] relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2
              w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998
                0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by address..."
                            value={search.address}
                            onChange={e => setSearch({ ...search, address: e.target.value })}
                            className="input pl-9"
                        />
                    </div>
                    <button onClick={fetchStores} className="btn-primary">
                        Search
                    </button>
                    <button
                        onClick={() => {
                            setSearch({ name: '', address: '' });
                            setTimeout(fetchStores, 100);
                        }}
                        className="btn-secondary"
                    >
                        Clear
                    </button>
                </div>

                {/* Stores Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border
                border-gray-100 p-5 animate-pulse">
                                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : stores.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🏪</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No stores found
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Try adjusting your search filters
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stores.map(store => (
                            <div key={store.id}
                                className="bg-white rounded-2xl border border-gray-100
                  shadow-sm hover:shadow-md hover:border-indigo-100
                  transition-all duration-200 p-5 flex flex-col">

                                {/* Store header */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl
                    flex items-center justify-center flex-shrink-0">
                                        <span className="text-indigo-600 font-bold text-sm">
                                            {store.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm
                      leading-tight truncate">
                                            {store.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                                            {store.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-2 mb-4">
                                    <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5
                    flex-shrink-0" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998
                      1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {store.address}
                                    </p>
                                </div>

                                {/* Overall rating */}
                                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                                    <p className="text-xs text-gray-400 mb-1.5 font-medium">
                                        Overall rating
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <StarRating
                                            value={Math.round(store.averageRating)}
                                            readonly
                                            size="sm"
                                        />
                                        <span className="text-sm font-semibold text-gray-800">
                                            {store.averageRating.toFixed(1)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            ({store.totalRatings})
                                        </span>
                                    </div>
                                </div>

                                {/* User rating */}
                                <div className="mt-auto pt-3 border-t border-gray-50">
                                    <p className="text-xs text-gray-400 mb-1.5 font-medium">
                                        {store.myRating
                                            ? 'Your rating — click to update'
                                            : 'Rate this store'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <StarRating
                                            value={store.myRating || 0}
                                            onChange={v => handleRate(store.id, v)}
                                            size="md"
                                        />
                                        {ratingLoading === store.id && (
                                            <span className="text-xs text-indigo-500 animate-pulse">
                                                Saving...
                                            </span>
                                        )}
                                        {store.myRating && ratingLoading !== store.id && (
                                            <span className="text-xs bg-amber-50 text-amber-600
                        px-2 py-0.5 rounded-lg font-medium">
                                                You: {store.myRating}★
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}