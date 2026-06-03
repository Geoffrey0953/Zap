import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBuildings, createBuilding, updateBuilding, deleteBuilding } from '../hooks/useBuildings';
import './ManageBuildingData.css';

const CATEGORY_OPTIONS = ['Academic', 'Dining', 'Study', 'Recreation', 'Services', 'Parking', 'Outdoor'];

export default function ManageBuildingData() {
  const { buildings, loading, error, refetch } = useBuildings();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = add mode, string = edit mode
  const [form, setForm] = useState({ name: '', abbr: '', category: '', lat: '', lng: '', hours: '', description: '', departments: '' });
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const resetForm = () => {
    setForm({ name: '', abbr: '', category: '', lat: '', lng: '', hours: '', description: '', departments: '' });
    setEditingId(null);
    setActionError('');
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (b) => {
    setForm({
      name: b.name || '',
      abbr: b.abbr || '',
      category: b.category || '',
      lat: b.lat != null ? b.lat : '',
      lng: b.lng != null ? b.lng : '',
      hours: b.hours || '',
      description: b.description || '',
      departments: Array.isArray(b.departments) ? b.departments.join(', ') : '',
    });
    setEditingId(b.id);
    setShowForm(true);
    setActionError('');
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionError('');

    const payload = {
      name: form.name.trim(),
      abbr: form.abbr.trim(),
      category: form.category,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      hours: form.hours.trim(),
      description: form.description.trim(),
      departments: form.departments
        .split(',')
        .map(d => d.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await updateBuilding(editingId, payload);
      } else {
        await createBuilding(payload);
      }
      refetch();
      closeForm();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteBuilding(id);
      refetch();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) {
    return <div className="mbd-page"><div className="mbd-container"><p>Loading buildings…</p></div></div>;
  }

  if (error) {
    return <div className="mbd-page"><div className="mbd-container"><p>Error: {error}</p></div></div>;
  }

  const filtered = buildings.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.abbr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mbd-page">
      <div className="mbd-container">

        <div className="mbd-header">
          <Link to="/admin" className="back-link">← Admin Portal</Link>
          <div className="mbd-header-row">
            <h1>Manage Building Data</h1>
            <button className="add-building-btn" onClick={() => showForm ? closeForm() : openAdd()}>
              {showForm ? '✕ Cancel' : '+ Add Building'}
            </button>
          </div>
        </div>

        {/* Add / Edit form */}
        {showForm && (
          <div className="add-building-form-card">
            <h2>{editingId ? 'Edit Building' : 'Add New Building'}</h2>
            <form onSubmit={handleSubmit} className="add-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Building Name *</label>
                  <input type="text" name="name" placeholder="e.g. Donald Bren Hall" value={form.name} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Abbreviation *</label>
                  <input type="text" name="abbr" placeholder="e.g. DBH" value={form.abbr} onChange={handleChange} required maxLength={6} />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Hours</label>
                  <input type="text" name="hours" placeholder="e.g. Mon–Fri 8am–6pm" value={form.hours} onChange={handleChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Latitude *</label>
                  <input type="number" step="any" name="lat" placeholder="e.g. 33.6430" value={form.lat} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Longitude *</label>
                  <input type="number" step="any" name="lng" placeholder="e.g. -117.8418" value={form.lng} onChange={handleChange} required />
                </div>
              </div>
              <div className="input-group">
                <label>Departments (comma-separated)</label>
                <input type="text" name="departments" placeholder="e.g. Computer Science, Informatics" value={form.departments} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea name="description" rows={3} placeholder="Brief description of the building..." value={form.description} onChange={handleChange} />
              </div>

              {actionError && <div className="auth-error" style={{ marginBottom: '1rem' }}>{actionError}</div>}

              <div className="form-btns">
                <button type="button" className="form-btn-cancel" onClick={closeForm}>Cancel</button>
                <button type="submit" className="form-btn-save" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Update Building' : 'Save Building'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mbd-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search buildings..." value={search} onChange={e => setSearch(e.target.value)} className="mbd-search" />
        </div>

        {/* Buildings table */}
        <div className="mbd-table">
          <div className="mbd-table-header">
            <span>Building</span>
            <span>Category</span>
            <span>Hours</span>
            <span>Actions</span>
          </div>
          {filtered.map(b => (
            <div key={b.id} className="mbd-row">
              <div className="mbd-row-name">
                <strong>{b.name}</strong>
                <span>{b.abbr}</span>
              </div>
              <span className="mbd-row-cat">{b.category}</span>
              <span className="mbd-row-hours">{b.hours ? b.hours.split(',')[0] : '—'}</span>
              <div className="mbd-row-actions">
                <button className="row-btn edit" onClick={() => openEdit(b)}>Edit</button>
                <button className="row-btn delete" onClick={() => handleDelete(b.id, b.name)}>Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No buildings match your search.</p>
          )}
        </div>

      </div>
    </div>
  );
}