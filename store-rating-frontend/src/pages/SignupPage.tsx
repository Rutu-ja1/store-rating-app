// src/pages/SignupPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', email: '', address: '', password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const validate = () => {
        const e: Record<string, string> = {};
        if (form.name.length < 20)
            e.name = 'Name must be at least 20 characters';
        if (form.name.length > 60)
            e.name = 'Name must be at most 60 characters';
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            e.email = 'Enter a valid email address';
        if (form.address.length > 400)
            e.address = 'Address must be at most 400 characters';
        if (!form.address)
            e.address = 'Address is required';
        if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).{8,16}$/.test(form.password))
            e.password = '8–16 chars, 1 uppercase letter, 1 special character';
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        try {
            await api.post('/users/signup', form);
            navigate('/login');
        } catch (err: any) {
            setErrors({
                general: err.response?.data?.message || 'Signup failed. Try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50
      via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex
            items-center justify-center mx-auto mb-4">
                        <span className="text-white text-xl font-bold">SR</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Join StoreRating today
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100
          shadow-xl p-8">
                    {errors.general && (
                        <div className="alert-error mb-5">{errors.general}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Full name
                                <span className="text-gray-400 font-normal ml-1">
                                    (min 20 characters)
                                </span>
                            </label>
                            <input
                                type="text"
                                className={`input ${errors.name ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                                placeholder="Your full name here..."
                                value={form.name}
                                onChange={e => {
                                    setForm({ ...form, name: e.target.value });
                                    setErrors({ ...errors, name: '' });
                                }}
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                                {form.name.length}/60 characters
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email address
                            </label>
                            <input
                                type="email"
                                className={`input ${errors.email ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => {
                                    setForm({ ...form, email: e.target.value });
                                    setErrors({ ...errors, email: '' });
                                }}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Address
                            </label>
                            <textarea
                                className={`input resize-none h-20 ${errors.address ? 'border-red-300' : ''}`}
                                placeholder="Your full address..."
                                value={form.address}
                                onChange={e => {
                                    setForm({ ...form, address: e.target.value });
                                    setErrors({ ...errors, address: '' });
                                }}
                            />
                            {errors.address && (
                                <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    className={`input pr-10 ${errors.password ? 'border-red-300' : ''}`}
                                    placeholder="Min 8 chars, 1 uppercase, 1 special"
                                    value={form.password}
                                    onChange={e => {
                                        setForm({ ...form, password: e.target.value });
                                        setErrors({ ...errors, password: '' });
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016
                      0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268
                      2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477
                      0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-2 flex items-center
                justify-center gap-2"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login"
                            className="text-indigo-600 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}