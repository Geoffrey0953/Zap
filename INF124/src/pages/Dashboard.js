import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    apiFetch('/alerts')
      .then(data => setAlerts(data.data || []))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* Profile Header */}
        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-info">
              <h1 className="profile-name">{user?.name}</h1>
              <p className="profile-email">{user?.email}</p>
              <p className="profile-year">{user?.year}</p>
            </div>
            <Link to="/login" className="settings-btn" onClick={handleLogout} title="Sign Out">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">—</span>
              <span className="stat-label">Saved</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">—</span>
              <span className="stat-label">Visited</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="dash-section">
          <h2 className="dash-section-title">My Pages</h2>
          <div className="quick-links">
            {QUICK_LINKS.map(link => (
              <Link key={link.to} to={link.to} className="quick-link-card">
                <span className="ql-icon">{link.icon}</span>
                <div className="ql-info">
                  <span className="ql-label">{link.label}</span>
                  <span className="ql-sub">{link.sub}</span>
                </div>
                <span className="ql-arrow">›</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="dash-section">
            <h2 className="dash-section-title">Campus Alerts</h2>
            <div className="alerts-list">
              {alerts.map(alert => (
                <div key={alert._id} className={`alert-row alert-${alert.type}`}>
                  <div className="alert-indicator" />
                  <div className="alert-body">
                    <span className="alert-title">{alert.title}</span>
                    <span className="alert-msg">{alert.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin shortcut */}
        {user?.role === 'admin' && (
          <Link to="/admin" className="admin-banner">
            <span>⚙️</span>
            <div>
              <strong>Admin Portal</strong>
              <p>Manage buildings, dispatch alerts</p>
            </div>
            <span className="ql-arrow">›</span>
          </Link>
        )}

      </div>
    </div>
  );
}

const QUICK_LINKS = [
  { to: '/saved', label: 'Saved Places', sub: 'Your bookmarked locations', icon: '🔖' },
  { to: '/schedule', label: 'Class Schedule', sub: 'View your weekly classes', icon: '📅' },
  { to: '/directions', label: 'Get Directions', sub: 'Navigate around campus', icon: '🧭' },
  { to: '/map', label: 'Campus Map', sub: 'Interactive UCI map', icon: '🗺' },
];