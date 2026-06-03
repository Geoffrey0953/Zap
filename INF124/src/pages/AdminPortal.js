import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import { getToken } from '../context/AuthContext';
import { useBuildings } from '../hooks/useBuildings';
import './AdminPortal.css';

export default function AdminPortal() {
  const { user } = useAuth();
  const { buildings } = useBuildings();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = getToken();
        const data = await apiFetch('/alerts', { token });
        const alerts = data.data || [];
        setAlertCount(alerts.filter(a => a.active).length);
      } catch {}
    };
    fetchAlerts();
  }, []);

  const stats = [
    { label: 'Buildings', value: buildings.length, icon: '🏛' },
    { label: 'Active Alerts', value: alertCount, icon: '📢' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <span className="admin-badge">⚙️ Admin</span>
            <h1>Admin Portal</h1>
            <p>Signed in as <strong>{user?.name}</strong></p>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {stats.map(s => (
            <div key={s.label} className="admin-stat-card">
              <span className="asc-icon">{s.icon}</span>
              <span className="asc-value">{s.value}</span>
              <span className="asc-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="admin-section">
          <h2>Quick Actions</h2>
          <div className="admin-actions">
            {ADMIN_LINKS.map(link => (
              <Link key={link.to} to={link.to} className="admin-action-card">
                <span className="aac-icon">{link.icon}</span>
                <div className="aac-info">
                  <strong>{link.label}</strong>
                  <span>{link.sub}</span>
                </div>
                <span className="aac-arrow">›</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const ADMIN_LINKS = [
  { to: '/admin/buildings', label: 'Manage Building Data', sub: 'Add, edit, or remove buildings', icon: '🏛' },
  { to: '/admin/alerts', label: 'Dispatch Alerts', sub: 'Send campus-wide notifications', icon: '📢' },
];