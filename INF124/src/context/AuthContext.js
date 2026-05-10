import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock users for demo — replace with Firebase/Supabase later
const MOCK_USERS = [
  { id: '1', email: 'student@uci.edu', password: 'password', name: 'Anteater Zot', role: 'student', year: 'UCI - Class of 2026' },
  { id: '2', email: 'admin@uci.edu', password: 'admin123', name: 'Admin User', role: 'admin', year: 'UCI Staff' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const saved = localStorage.getItem('zap_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid UCInetID or password');
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('zap_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const signup = async ({ firstName, lastName, email, password }) => {
    const newUser = {
      id: Date.now().toString(),
      email,
      name: `${firstName} ${lastName}`,
      role: 'student',
      year: 'UCI Student',
    };
    setUser(newUser);
    localStorage.setItem('zap_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zap_user');
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
