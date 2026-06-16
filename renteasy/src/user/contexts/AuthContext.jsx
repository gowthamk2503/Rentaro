// src/contexts/AuthContext.js
import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext();

// Custom provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = useCallback(async (email, password) => {
    // Your authentication logic here
    if (email === 'admin@example.com' && password === 'admin123') {
      setUser({ email, role: 'admin' });
      return;
    }
    
    if (email && password) {
      setUser({ email, role: 'user' });
      return;
    }
    
    throw new Error('Invalid credentials');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}