import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { getToken } from '../context/AuthContext';
import './DispatchAlerts.css';

const ALERT_TYPES = ['info', 'warning', 'success'];

export default function DispatchAlerts() {
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });
  const [dispatched, setDispatched] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = getToken();

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await apiFetch('/alerts', { token });
      setAlerts(data.data || []);
    } catch (err) {
      console.error('Failed to fetch alerts:', err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleDispatch = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/alerts', {
        method: 'POST',
        body: { title: form.title, message: form.message, type: form.type, active: true },
        token,
      });
      setDispatched(true);
      setForm({ title: '', message: '', type: 'info' });
      fetchAlerts();
      setTimeout(() => setDispatched(false), 2000);
    } catch (err) {
      alert('Failed to dispatch alert: ' + err.message);
    }
  };

  const toggleAlert = async (alert) => {
    try {
      await apiFetch(`/alerts/${alert._id}`, {
        method: 'PUT',
        body: { active: !alert.active },
        token,
      });
      fetchAlerts();
    } catch (err) {
      alert('Failed to update alert: ' + err.message);
    }
  };

  const deleteAlert = async (alert) => {
    if (!window.confirm('Delete this alert?')) return;
    try {
      await apiFetch(`/alerts/${alert._id}`, { method: 'DELETE', token });
      fetchAlerts();
    } catch (err) {
      alert('Failed to delete alert: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="dispatch-page">
        <div className="dispatch-container">
          <p>Loading alerts…</p>
        </div>
      </div>
    );
  }

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
          <h2>Current Alerts ({alerts.filter(a => a.active).length} active)</h2>
          <div className="alerts-manage-list">
            {alerts.map(alert => (
              <div key={alert._id} className={`alert-manage-row ${!alert.active ? 'inactive' : ''}`}>
                <div className={`alert-manage-dot dot-${alert.type}`} />
                <div className="alert-manage-body">
                  <div className="alert-manage-top">
                    <span className="alert-manage-title">{alert.title}</span>
                    <span className="alert-manage-time">{alert.createdAt ? new Date(alert.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                  <p className="alert-manage-msg">{alert.message}</p>
                </div>
                <button
                  className={`toggle-btn ${alert.active ? 'deactivate' : 'activate'}`}
                  onClick={() => toggleAlert(alert)}
                >
                  {alert.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  className="toggle-btn delete-btn"
                  onClick={() => deleteAlert(alert)}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}