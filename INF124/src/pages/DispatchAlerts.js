import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ALERTS } from '../data/mockData';
import './DispatchAlerts.css';

const ALERT_TYPES = ['info', 'warning', 'success'];

export default function DispatchAlerts() {
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });
  const [dispatched, setDispatched] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState(ALERTS);

  const handleDispatch = (e) => {
    e.preventDefault();
    const newAlert = {
      id: Date.now().toString(),
      type: form.type,
      title: form.title,
      message: form.message,
      time: 'Just now',
      active: true,
    };
    setActiveAlerts(prev => [newAlert, ...prev]);
    setDispatched(true);
    setTimeout(() => { setDispatched(false); setForm({ title: '', message: '', type: 'info' }); }, 2000);
  };

  const toggleAlert = (id) => {
    setActiveAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="dispatch-page">
      <div className="dispatch-container">

        <div className="dispatch-header">
          <Link to="/admin" className="back-link">← Admin Portal</Link>
          <h1>Dispatch Alerts</h1>
          <p>Send campus-wide notifications to all users</p>
        </div>

        {/* Dispatch form */}
        <div className="dispatch-form-card">
          <h2>New Alert</h2>
          <form onSubmit={handleDispatch} className="dispatch-form">
            <div className="type-selector">
              {ALERT_TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  className={`type-btn type-${t} ${form.type === t ? 'active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                >
                  {t === 'info' ? 'ℹ️ Info' : t === 'warning' ? '⚠️ Warning' : '✅ Success'}
                </button>
              ))}
            </div>
            <div className="input-group">
              <label>Alert Title *</label>
              <input type="text" placeholder="Short, descriptive title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="input-group">
              <label>Message *</label>
              <textarea rows={3} placeholder="Detailed message for users..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
            </div>

            {/* Preview */}
            {(form.title || form.message) && (
              <div className="alert-preview">
                <span className="preview-label">Preview</span>
                <div className={`preview-chip preview-${form.type}`}>
                  <span className="preview-dot" />
                  <div>
                    <strong>{form.title || 'Alert Title'}</strong>
                    <p>{form.message || 'Alert message...'}</p>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="dispatch-btn" disabled={dispatched}>
              {dispatched ? '✓ Alert Dispatched!' : '📢 Dispatch Alert'}
            </button>
          </form>
        </div>

        {/* Current alerts */}
        <div className="current-alerts-section">
          <h2>Current Alerts ({activeAlerts.filter(a => a.active).length} active)</h2>
          <div className="alerts-manage-list">
            {activeAlerts.map(alert => (
              <div key={alert.id} className={`alert-manage-row ${!alert.active ? 'inactive' : ''}`}>
                <div className={`alert-manage-dot dot-${alert.type}`} />
                <div className="alert-manage-body">
                  <div className="alert-manage-top">
                    <span className="alert-manage-title">{alert.title}</span>
                    <span className="alert-manage-time">{alert.time}</span>
                  </div>
                  <p className="alert-manage-msg">{alert.message}</p>
                </div>
                <button
                  className={`toggle-btn ${alert.active ? 'deactivate' : 'activate'}`}
                  onClick={() => toggleAlert(alert.id)}
                >
                  {alert.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
