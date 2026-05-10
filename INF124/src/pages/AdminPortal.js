import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BUILDINGS, ALERTS } from '../data/mockData';
import './AdminPortal.css';

export default function AdminPortal() {
  const { user } = useAuth();

  const stats = [
    { label: 'Buildings', value: BUILDINGS.length, icon: '🏛' },
    { label: 'Active Alerts', value: ALERTS.filter(a => a.active).length, icon: '📢' },
    { label: 'Users (mock)', value: 142, icon: '👥' },
    { label: 'Reports', value: 7, icon: '📋' },
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

        {/* Recent activity */}
        <div className="admin-section">
          <h2>Recent Reports</h2>
          <div className="admin-reports">
            {MOCK_REPORTS.map(r => (
              <div key={r.id} className="report-row">
                <div className="report-row-info">
                  <span className="report-row-subject">{r.subject}</span>
                  <span className="report-row-cat">{r.category}</span>
                </div>
                <span className={`report-row-status status-${r.status}`}>{r.status}</span>
              </div>
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

const MOCK_REPORTS = [
  { id: 1, subject: 'Incorrect hours for Mesa Court', category: 'Incorrect Information', status: 'open' },
  { id: 2, subject: 'Missing building: Engineering Hall 2', category: 'Missing Location', status: 'reviewing' },
  { id: 3, subject: 'Shuttle tracker not updating', category: 'Technical Issue', status: 'resolved' },
  { id: 4, subject: 'ARC closes at 10pm on Sundays', category: 'Incorrect Information', status: 'resolved' },
];
