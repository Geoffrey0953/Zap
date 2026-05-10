import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/map', label: 'Map', icon: '◎' },
  { to: '/directory', label: 'Directory', icon: '⊞' },
  { to: '/shuttle', label: 'Shuttle', icon: '⬡' },
  { to: '/help', label: 'Help', icon: '?' },
];

const BOTTOM_NAV = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/map', label: 'Map', icon: MapIcon },
  { to: '/saved', label: 'Saved', icon: SavedIcon },
  { to: '/dashboard', label: 'Profile', icon: ProfileIcon },
];

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <div className="layout">
      {/* Top Navigation */}
      <header className="top-nav">
        <NavLink to="/" className="nav-logo">
          <span className="logo-icon">◎</span>
          <span className="logo-text">ZAP</span>
        </NavLink>

        <nav className="nav-links desktop-only">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-avatar" onClick={() => setMenuOpen(o => !o)}>
                {user.name?.charAt(0) || 'U'}
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className="dropdown-item">Dashboard</NavLink>
                  <NavLink to="/saved" onClick={() => setMenuOpen(false)} className="dropdown-item">Saved Places</NavLink>
                  <NavLink to="/schedule" onClick={() => setMenuOpen(false)} className="dropdown-item">Class Schedule</NavLink>
                  {user.role === 'admin' && (
                    <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="dropdown-item admin-item">Admin Portal</NavLink>
                  )}
                  <button onClick={handleLogout} className="dropdown-item logout">Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <NavLink to="/login" className="btn-ghost">Sign In</NavLink>
              <NavLink to="/signup" className="btn-teal">Get Started</NavLink>
            </div>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Bottom Nav (mobile) */}
      <nav className="bottom-nav mobile-only">
        {BOTTOM_NAV.map(item => {
          const Icon = item.icon;
          const isActive = item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon active={isActive} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--teal)' : 'none'} stroke={active ? 'var(--teal)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function MapIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--teal)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function SavedIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--teal)' : 'none'} stroke={active ? 'var(--teal)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  );
}
function ProfileIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--teal)' : 'var(--text-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
