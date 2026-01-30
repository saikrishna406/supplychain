
import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Forms } from './pages/Forms';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AppState, User } from './types';

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

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!user.isConnected) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Layout user={user} onConnect={() => navigate('/login')}>
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
          <ProtectedRoute>
            <Forms type={AppState.ADD_PHONE} user={user} onBack={() => navigate('/dashboard')} />
          </ProtectedRoute>
        } />
        <Route path="/transfer" element={
          <ProtectedRoute>
            <Forms type={AppState.TRANSFER} user={user} onBack={() => navigate('/dashboard')} />
          </ProtectedRoute>
        } />
        <Route path="/track" element={
          <Forms type={AppState.TRACK} user={user} onBack={() => navigate('/')} />
        } />
        <Route path="/verify" element={
          <Forms type={AppState.VERIFY} user={user} onBack={() => navigate('/')} />
        } />
      </Routes>
    </Layout>
  );
}
