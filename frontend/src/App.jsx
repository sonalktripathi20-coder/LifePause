import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppStateProvider } from './context/AppStateContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Vault from './pages/Vault';
import Documents from './pages/Documents';
import Contacts from './pages/Contacts';
import Medical from './pages/Medical';
import Emergency from './pages/Emergency';
import Reminders from './pages/Reminders';
import Analytics from './pages/Analytics';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-brand-dark min-h-screen flex items-center justify-center">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-t-brand-accent animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const App = () => {
  console.log("App.jsx: Rendering App component");
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppStateProvider>
          <Routes>
            {/* Public Marketing */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Authentications */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Wizard Setup */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />

            {/* Dashboard Protected Panels */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vault" 
              element={
                <ProtectedRoute>
                  <Vault />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/documents" 
              element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contacts" 
              element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/medical" 
              element={
                <ProtectedRoute>
                  <Medical />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/emergency" 
              element={
                <ProtectedRoute>
                  <Emergency />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reminders" 
              element={
                <ProtectedRoute>
                  <Reminders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pricing" 
              element={
                <ProtectedRoute>
                  <Pricing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppStateProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
