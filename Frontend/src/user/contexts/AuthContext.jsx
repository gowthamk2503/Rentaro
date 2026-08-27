import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('rentaro_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const saveAuthSession = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('token', authToken);
    localStorage.setItem('userEmail', authUser.email);
    localStorage.setItem('rentaro_user', JSON.stringify(authUser));
    if (authUser.role === 'admin') {
      localStorage.setItem('isAdminAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAdminAuthenticated');
    }
  };

  const clearAuthSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rentaro_user');
    localStorage.removeItem('isAdminAuthenticated');
  };

  // Sync / Verify profile on app startup if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authApi.getProfile();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('rentaro_user', JSON.stringify(res.user));
            if (res.user.role === 'admin') {
              localStorage.setItem('isAdminAuthenticated', 'true');
            }
          }
        } catch (err) {
          console.warn('Session verification failed or expired:', err.message);
          // If token is invalid or expired (401 / 403), wipe stale session
          if (err.status === 401 || err.status === 403 || err.message?.includes('401') || err.message?.includes('Unauthorized')) {
            clearAuthSession();
          }
        }
      } else {
        // No token present, ensure clean state
        clearAuthSession();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Standard User Login
  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    saveAuthSession(data.token, data.user);
    return data;
  }, []);

  // Admin Login (Requires role === 'admin')
  const adminLogin = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    if (data.user.role !== 'admin') {
      throw new Error('Access Denied: This account does not possess administrator privileges.');
    }
    saveAuthSession(data.token, data.user);
    return data;
  }, []);

  // User Registration
  const register = useCallback(async (userData) => {
    const data = await authApi.register(userData);
    saveAuthSession(data.token, data.user);
    return data;
  }, []);

  // Google OAuth Authentication
  const googleLogin = useCallback(async (googlePayload) => {
    const data = await authApi.googleLogin(googlePayload);
    saveAuthSession(data.token, data.user);
    return data;
  }, []);

  // Update Profile
  const updateProfile = useCallback(async (profileData) => {
    const data = await authApi.updateProfile(profileData);
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('rentaro_user', JSON.stringify(data.user));
    }
    return data;
  }, []);

  // Logout
  const logout = useCallback(() => {
    clearAuthSession();
  }, []);

  const value = {
    user,
    token,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!token && !!user,
    loading,
    login,
    adminLogin,
    register,
    googleLogin,
    updateProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}