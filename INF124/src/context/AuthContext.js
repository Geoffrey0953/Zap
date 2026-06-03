import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

const AuthContext = createContext(null);

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------
const TOKEN_KEY = 'zap_token';
const USER_KEY = 'zap_user';

/** Retrieve the stored JWT token (synchronous — usable by other modules). */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const restore = async () => {
      const savedUser = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);

      if (savedUser && token) {
        try {
          // Pre-populate user from localStorage so UI is instant
          setUser(JSON.parse(savedUser));

          // Validate token with backend — will throw if invalid / expired
          const data = await apiFetch('/auth/me', { token });
          setUser(data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        } catch {
          // Token invalid or expired — clear everything
          setUser(null);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
      setLoading(false);
    };

    restore();
  }, []);

  // -----------------------------------------------------------------------
  // login
  // -----------------------------------------------------------------------
  const login = async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // -----------------------------------------------------------------------
  // signup
  // -----------------------------------------------------------------------
  const signup = async ({ firstName, lastName, email, password }) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: { firstName, lastName, email, password },
    });

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // -----------------------------------------------------------------------
  // logout
  // -----------------------------------------------------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}