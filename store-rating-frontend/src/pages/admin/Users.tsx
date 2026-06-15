// src/pages/admin/Users.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Navbar } from '../../components/Navbar';
import { SortableTable } from '../../components/SortableTable';

interface User {
    id: string;
    name: string;
    email: string;
    address: string;
    role: string;
}

export default function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        name: '', email: '', address: '', role: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', address: '', password: '', role: 'normal_user'
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [toast, setToast] = useState({ msg: '', type: '' });

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: '', type: '' }), 3000);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users', {
                params: {
                    name: filters.name || undefined,
                    email: filters.email || undefined,
                    address: filters.address || undefined,
                    role: filters.role || undefined,
                }
            });
            setUsers(res.data);
        } catch {
            showToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        try {
            await api.post('/users/admin/create', form);
            setFormSuccess('User created successfully!');
            setForm({
                name: '', email: '', address: '', password: '', role: 'normal_user'
            });
            fetchUsers();
            setTimeout(() => {
                setFormSuccess('');
                setShowForm(false);
            }, 2000);
        } catch (err: any) {
            setFormError(
                Array.isArray(err.response?.data?.message)
                    ? err.response.data.message[0]
                    : err.response?.data?.message || 'Failed to create user'
            );
        }
    };

    const roleBadge = (role: string) => {
        const map: Record<string, string> = {
            admin: 'badge-admin',
            normal_user: 'badge-user',
            store_owner: 'badge-owner',
        };
        const labels: Record<string, string> = {
            admin: 'Admin',
            normal_user: 'Normal User',
            store_owner: 'Store Owner',
        };
        return (
            <span className={map[role] || 'badge-user'}>
                {labels[role] || role}
            </span>
        );
    };

    const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'address', label: 'Address', sortable: true },
        { key: 'role', label: 'Role', sortable: true },
    ];

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Toast notification */}
            {toast.msg && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3
          rounded-xl text-sm font-medium shadow-lg transition-all
          ${toast.type === 'success'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-500 text-white'}`}>
                    {toast.msg}
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
                        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                        <p className="text-gray-500 text-sm mt-0.5">
                            {users.length} users registered
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center gap-2"
                    >
                        {showForm ? '✕ Cancel' : '+ Add user'}
                    </button>
                </div>

                {/* Add User Form */}
                {showForm && (
                    <div className="card mb-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Create new user
                        </h3>

                        {formError && (
                            <div className="alert-error mb-4">{formError}</div>
                        )}
                        {formSuccess && (
                            <div className="alert-success mb-4">{formSuccess}</div>
                        )}

                        <form
                            onSubmit={handleCreateUser}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium
                  text-gray-700 mb-1.5">
                                    Full name
                                    <span className="text-gray-400 font-normal ml-1">
                                        (min 20 chars)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="input"
                                    placeholder="Enter full name..."
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    {form.name.length}/60 characters
                                </p>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium
                  text-gray-700 mb-1.5">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="input"
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium
                  text-gray-700 mb-1.5">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={e =>
                                        setForm({ ...form, address: e.target.value })}
                                    className="input"
                                    placeholder="Enter address..."
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium
                  text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={e =>
                                        setForm({ ...form, password: e.target.value })}
                                    className="input"
                                    placeholder="Min 8 chars, 1 uppercase, 1 special"
                                    required
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium
                  text-gray-700 mb-1.5">
                                    Role
                                </label>
                                <select
                                    value={form.role}
                                    onChange={e => setForm({ ...form, role: e.target.value })}
                                    className="input"
                                >
                                    <option value="normal_user">Normal User</option>
                                    <option value="store_owner">Store Owner</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="md:col-span-2 flex gap-3">
                                <button type="submit" className="btn-primary">
                                    Create user
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormError('');
                                        setFormSuccess('');
                                        setForm({
                                            name: '',
                                            email: '',
                                            address: '',
                                            password: '',
                                            role: 'normal_user',
                                        });
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filters */}
                <form
                    onSubmit={handleFilter}
                    className="card mb-6 flex gap-3 flex-wrap items-center"
                >
                    {/* Name filter */}
                    <div className="relative flex-1 min-w-[140px]">
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
                            onChange={e =>
                                setFilters({ ...filters, name: e.target.value })}
                            className="input pl-9"
                        />
                    </div>

                    {/* Email filter */}
                    <div className="relative flex-1 min-w-[140px]">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2
              w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22
                0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2
                2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Filter by email..."
                            value={filters.email}
                            onChange={e =>
                                setFilters({ ...filters, email: e.target.value })}
                            className="input pl-9"
                        />
                    </div>

                    {/* Address filter */}
                    <div className="relative flex-1 min-w-[140px]">
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

                    {/* Role filter */}
                    <select
                        value={filters.role}
                        onChange={e =>
                            setFilters({ ...filters, role: e.target.value })}
                        className="input w-40"
                    >
                        <option value="">All roles</option>
                        <option value="admin">Admin</option>
                        <option value="normal_user">Normal User</option>
                        <option value="store_owner">Store Owner</option>
                    </select>

                    <button type="submit" className="btn-primary">
                        Filter
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setFilters({ name: '', email: '', address: '', role: '' });
                            setTimeout(fetchUsers, 100);
                        }}
                        className="btn-secondary"
                    >
                        Clear
                    </button>
                </form>

                {/* Users Table */}
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="card animate-pulse flex gap-4">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg
                  flex-shrink-0"/>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <div className="card text-center py-16">
                        <div className="text-4xl mb-3">👥</div>
                        <p className="text-gray-500 font-medium">No users found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Try adjusting your filters or add a new user
                        </p>
                    </div>
                ) : (
                    <SortableTable
                        columns={columns}
                        data={users}
                        renderRow={(user) => (
                            <>
                                {/* Name + initials */}
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50
                      flex items-center justify-center flex-shrink-0">
                                            <span className="text-indigo-600 text-xs
                        font-semibold">
                                                {user.name
                                                    .split(' ')
                                                    .slice(0, 2)
                                                    .map((n: string) => n[0])
                                                    .join('')
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900 text-sm">
                                            {user.name}
                                        </span>
                                    </div>
                                </td>

                                {/* Email */}
                                <td className="px-5 py-3.5 text-gray-500 text-sm">
                                    {user.email}
                                </td>

                                {/* Address */}
                                <td className="px-5 py-3.5 text-gray-500 text-sm">
                                    {user.address || '—'}
                                </td>

                                {/* Role badge */}
                                <td className="px-5 py-3.5">
                                    {roleBadge(user.role)}
                                </td>
                            </>
                        )}
                    />
                )}
            </div>
        </div>
    );
}