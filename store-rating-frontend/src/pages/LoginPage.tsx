// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', form);
            login(res.data.user, res.data.token);
            const routes: Record<string, string> = {
                admin: '/admin/dashboard',
                normal_user: '/stores',
                store_owner: '/owner/dashboard',
            };
            navigate(routes[res.data.user.role] || '/');
        } catch {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50
      via-white to-purple-50 flex items-center justify-center p-4">

            {/* Left decorative panel (hidden on mobile) */}
            <div className="hidden lg:flex flex-col justify-center items-start
        w-96 mr-16">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex
          items-center justify-center mb-6">
                    <span className="text-white text-xl font-bold">SR</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Welcome to StoreRating
                </h1>
                <p className="text-gray-500 text-base leading-relaxed">
                    Discover, rate, and review stores on our platform.
                    Your feedback helps everyone make better choices.
                </p>
                <div className="mt-8 space-y-3">
                    {[
                        { icon: '⭐', text: 'Rate stores from 1 to 5 stars' },
                        { icon: '🏪', text: 'Browse all registered stores' },
                        { icon: '📊', text: 'View real-time ratings & reviews' },
                    ].map(item => (
                        <div key={item.text} className="flex items-center gap-3">
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-gray-600 text-sm">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl border border-gray-100
          shadow-xl p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Enter your credentials to continue
                        </p>
                    </div>

                    {error && (
                        <div className="alert-error mb-5 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0
                  000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293
                  1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0
                  001.414-1.414L11.414 10l1.293-1.293a1 1 0
                  00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email address
                            </label>
                            <input
                                type="email"
                                className="input"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    className="input pr-10"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600"
                                >
                                    {showPw ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth={2} d="M13.875 18.825A10.05 10.05 0
                        0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97
                        0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878
                        9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532
                        7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0
                        0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025
                        0 01-4.132 5.411m0 0L21 21"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0
                        016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth={2} d="M2.458 12C3.732 7.943 7.523
                        5 12 5c4.478 0 8.268 2.943 9.542 7-1.274
                        4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none"
                                        viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                            stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : 'Sign in'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/signup"
                            className="text-indigo-600 font-medium hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}