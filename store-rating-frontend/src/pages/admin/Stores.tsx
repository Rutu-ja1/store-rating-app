// src/pages/admin/Stores.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Navbar } from '../../components/Navbar';
import { SortableTable } from '../../components/SortableTable';
import { StarRating } from '../../components/StarRating';

interface Store {
    id: string;
    name: string;
    email: string;
    address: string;
    averageRating: number;
    totalRatings: number;
}

export default function AdminStores() {
    const navigate = useNavigate();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ name: '', address: '' });
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', address: '', owner_id: ''
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Store | null>(null);
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
                    name: filters.name || undefined,
                    address: filters.address || undefined,
                }
            });
            setStores(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStores(); }, []);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        fetchStores();
    };

    const handleCreateStore = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        try {
            const payload = {
                name: form.name,
                email: form.email,
                address: form.address,
                ...(form.owner_id && { owner_id: form.owner_id }),
            };
            await api.post('/stores', payload);
            setFormSuccess('Store created successfully!');
            setForm({ name: '', email: '', address: '', owner_id: '' });
            fetchStores();
            setTimeout(() => { setFormSuccess(''); setShowForm(false); }, 2000);
        } catch (err: any) {
            setFormError(
                Array.isArray(err.response?.data?.message)
                    ? err.response.data.message[0]
                    : err.response?.data?.message || 'Failed to create store'
            );
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setDeletingId(confirmDelete.id);
        try {
            await api.delete(`/stores/${confirmDelete.id}`);
            showToast('Store deleted successfully!', 'success');
            setConfirmDelete(null);
            fetchStores();
        } catch {
            showToast('Failed to delete store', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'address', label: 'Address', sortable: true },
        { key: 'averageRating', label: 'Rating', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false },
    ];

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Toast notification */}
            {toast.msg && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl
          text-sm font-medium shadow-lg
          ${toast.type === 'success'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-500 text-white'}`}>
                    {toast.msg}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center
          justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full
            max-w-sm">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex
              items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2} d="M19 7l-.867 12.142A2 2 0
                  0116.138 21H7.862a2 2 0 01-1.995-1.858L5
                  7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0
                  00-1 1v3M4 7h16"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900
              text-center mb-1">
                            Delete store?
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            <span className="font-medium text-gray-700">
                                {confirmDelete.name}
                            </span>
                            {' '}will be permanently deleted along with all its ratings.
                            This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deletingId === confirmDelete.id}
                                className="flex-1 px-5 py-2.5 bg-red-600 text-white
                  rounded-xl text-sm font-medium hover:bg-red-700
                  active:scale-95 transition-all disabled:opacity-50"
                            >
                                {deletingId === confirmDelete.id
                                    ? 'Deleting...'
                                    : 'Yes, delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header with back button */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center justify-center w-9 h-9
              bg-white border border-gray-200 rounded-xl
              hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
                        <p className="text-gray-500 text-sm mt-0.5">
                            {stores.length} stores registered
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-success flex items-center gap-2"
                    >
                        {showForm ? '✕ Cancel' : '+ Add store'}
                    </button>
                </div>

                {/* Add Store Form */}
                {showForm && (
                    <div className="card mb-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Create new store
                        </h3>
                        {formError && (
                            <div className="alert-error mb-4">{formError}</div>
                        )}
                        {formSuccess && (
                            <div className="alert-success mb-4">{formSuccess}</div>
                        )}
                        <form onSubmit={handleCreateStore}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium
                  text-gray-700 mb-1.5">
                                    Store name
                                    <span className="text-gray-400 font-normal ml-1">
                                        (min 20 chars)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="input"
                                    placeholder="Enter store name..."
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    {form.name.length}/60 characters
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium
                  text-gray-700 mb-1.5">
                                    Store email
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="input"
                                    placeholder="store@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium
                  text-gray-700 mb-1.5">
                                    Store address
                                </label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    className="input"
                                    placeholder="Enter full address..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium
                  text-gray-700 mb-1.5">
                                    Owner ID
                                    <span className="text-gray-400 font-normal ml-1">
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={form.owner_id}
                                    onChange={e => setForm({ ...form, owner_id: e.target.value })}
                                    className="input"
                                    placeholder="Paste store owner UUID..."
                                />
                            </div>
                            <div className="md:col-span-2 flex gap-3">
                                <button type="submit" className="btn-success">
                                    Create store
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filters */}
                <form onSubmit={handleFilter}
                    className="card mb-6 flex gap-3 flex-wrap items-center">
                    <div className="relative flex-1 min-w-[180px]">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2
              w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0
                11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Filter by name..."
                            value={filters.name}
                            onChange={e => setFilters({ ...filters, name: e.target.value })}
                            className="input pl-9"
                        />
                    </div>
                    <div className="relative flex-1 min-w-[180px]">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2
              w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998
                1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Filter by address..."
                            value={filters.address}
                            onChange={e =>
                                setFilters({ ...filters, address: e.target.value })}
                            className="input pl-9"
                        />
                    </div>
                    <button type="submit" className="btn-primary">Filter</button>
                    <button
                        type="button"
                        onClick={() => {
                            setFilters({ name: '', address: '' });
                            setTimeout(fetchStores, 100);
                        }}
                        className="btn-secondary"
                    >
                        Clear
                    </button>
                </form>

                {/* Table */}
                {loading ? (
                    <div className="card text-center py-12 text-gray-400">
                        Loading stores...
                    </div>
                ) : (
                    <SortableTable
                        columns={columns}
                        data={stores}
                        renderRow={(store) => (
                            <>
                                <td className="px-5 py-3.5 font-medium text-gray-900">
                                    <div>{store.name}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">
                                        {store.email}
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-gray-500 text-sm">
                                    {store.email}
                                </td>
                                <td className="px-5 py-3.5 text-gray-500 text-sm">
                                    {store.address}
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <StarRating
                                            value={Math.round(store.averageRating || 0)}
                                            readonly
                                            size="sm"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            {(store.averageRating || 0).toFixed(1)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            ({store.totalRatings || 0})
                                        </span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <button
                                        onClick={() => setConfirmDelete(store)}
                                        className="flex items-center gap-1.5 px-3 py-1.5
                      text-xs font-medium text-red-600 bg-red-50
                      hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth={2} d="M19 7l-.867 12.142A2 2 0
                        0116.138 21H7.862a2 2 0 01-1.995-1.858L5
                        7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0
                        00-1 1v3M4 7h16"/>
                                        </svg>
                                        Delete
                                    </button>
                                </td>
                            </>
                        )}
                    />
                )}
            </div>
        </div>
    );
}