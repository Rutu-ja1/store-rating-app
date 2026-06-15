// src/pages/ChangePassword.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Navbar } from '../components/Navbar';

export default function ChangePassword() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        oldPassword: '', newPassword: '', confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.newPassword !== form.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).{8,16}$/.test(form.newPassword)) {
            setError('Password: 8-16 chars, 1 uppercase, 1 special character');
            return;
        }
        setLoading(true);
        try {
            await api.patch('/users/update-password', {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            });
            setSuccess('Password updated successfully!');
            setTimeout(() => navigate(-1), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center mt-16">
                <div className="bg-white p-8 rounded-xl shadow-sm border
          border-gray-200 w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Change Password
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {['oldPassword', 'newPassword', 'confirmPassword'].map(key => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {key === 'oldPassword' ? 'Current Password'
                                        : key === 'newPassword' ? 'New Password'
                                            : 'Confirm New Password'}
                                </label>
                                <input
                                    type="password"
                                    value={form[key as keyof typeof form]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300
                    rounded-lg text-sm focus:outline-none focus:ring-2
                    focus:ring-blue-500"
                                    required
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg
                text-sm font-medium hover:bg-blue-700 transition
                disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}