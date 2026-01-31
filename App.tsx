
import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AddPhone } from './pages/AddPhone';
import { Verify } from './pages/Verify';
import { Transfer } from './pages/Transfer';
import { Forms } from './pages/Forms';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AppState, User } from './types';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [user, setUser] = useState<User>({
    address: null,
    isConnected: false,
    role: 'Guest'
  });

  const navigate = useNavigate();

  // Called after successful Supabase Login/Register
  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    if (authenticatedUser.role === 'Manufacturer') {
      navigate('/dashboard');
    } else {
      navigate('/verify');
    }
  };

  const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) => {
    if (!user.isConnected) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  return (
    <Layout user={user} onConnect={() => navigate('/login')}>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={
          <LandingPage
            onStart={() => navigate('/login')}
            onVerify={() => navigate('/verify')}
            onNavigate={(state) => { /* Legacy prop, ideally remove */ }}
          />
        } />

        <Route path="/login" element={
          <Login
            onLoginSuccess={handleAuthSuccess}
            onNavigate={(state) => { /* Legacy */ }}
          />
        } />

        <Route path="/register" element={
          <Register
            onLoginSuccess={handleAuthSuccess}
            onNavigate={(state) => { /* Legacy */ }}
          />
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard user={user} onNavigate={(state) => { /* Legacy */ }} />
          </ProtectedRoute>
        } />

        {/* Forms Routes */}
        <Route path="/add-phone" element={
          <ProtectedRoute allowedRoles={['Manufacturer']}>
            <AddPhone user={user} />
          </ProtectedRoute>
        } />
        <Route path="/transfer" element={
          <ProtectedRoute>
            <Transfer user={user} />
          </ProtectedRoute>
        } />
        <Route path="/track" element={
          <Verify user={user} />
        } />
        <Route path="/verify" element={
          <Verify user={user} />
        } />
      </Routes>
    </Layout>
  );
}
