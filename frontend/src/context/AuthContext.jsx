import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lp_token'));
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const res = await api.auth.getMe();
          if (res.success) {
            setUser(res.user);
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          // If true token expire, reset. But keep if offline mock token.
          if (!token.startsWith('mock_token_')) {
            logout();
          } else {
            // Re-auth in mock mode
            try {
              const res = await api.auth.getMe();
              setUser(res.user);
            } catch (err) {
              logout();
            }
          }
        }
      }
      setOfflineMode(api.isOfflineMode());
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res.success) {
        localStorage.setItem('lp_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setOfflineMode(api.isOfflineMode());
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.auth.register(name, email, password);
      if (res.success) {
        localStorage.setItem('lp_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setOfflineMode(api.isOfflineMode());
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('lp_token');
    setToken(null);
    setUser(null);
  };

  const updateMedicalProfile = async (profileData) => {
    try {
      const res = await api.auth.updateMedical(profileData);
      if (res.success) {
        setUser(res.user);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const upgradeSubscription = async (plan, familyMembers = []) => {
    try {
      const res = await api.auth.updateSubscription(plan, familyMembers);
      if (res.success) {
        setUser(res.user);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      return await api.auth.forgotPassword(email);
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    try {
      return await api.auth.resetPassword(email, code, newPassword);
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    offlineMode,
    login,
    register,
    logout,
    updateMedicalProfile,
    upgradeSubscription,
    forgotPassword,
    resetPassword
  };

  console.log("AuthContext.jsx: Rendering AuthProvider, loading=", loading, "user=", user);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
