// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChangePassword from './pages/ChangePassword';
import StoresPage from './pages/StoresPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminStores from './pages/admin/Stores';
import OwnerDashboard from './pages/owner/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/stores" element={
          <ProtectedRoute roles={['normal_user']}>
            <StoresPage />
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute roles={['admin']}>
            <AdminStores />
          </ProtectedRoute>
        } />

        <Route path="/owner/dashboard" element={
          <ProtectedRoute roles={['store_owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/change-password" element={
          <ProtectedRoute roles={['admin', 'normal_user', 'store_owner']}>
            <ChangePassword />
          </ProtectedRoute>
        } />

        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-red-500">403</h1>
              <p className="text-gray-600 mt-2">You are not authorized</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}