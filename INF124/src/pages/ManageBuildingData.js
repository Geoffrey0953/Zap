import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BUILDINGS } from '../data/mockData';
import './ManageBuildingData.css';

export default function ManageBuildingData() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', abbr: '', category: '', hours: '', description: '' });
  const [saved, setSaved] = useState(false);

  const filtered = BUILDINGS.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.abbr.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); setForm({ name: '', abbr: '', category: '', hours: '', description: '' }); }, 2000);
  };

  return (
    <div className="mbd-page">
      <div className="mbd-container">

        <div className="mbd-header">
          <Link to="/admin" className="back-link">← Admin Portal</Link>
          <div className="mbd-header-row">
            <h1>Manage Building Data</h1>
            <button className="add-building-btn" onClick={() => setShowForm(v => !v)}>
              {showForm ? '✕ Cancel' : '+ Add Building'}
            </button>
          </div>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="add-building-form-card">
            <h2>Add New Building</h2>
            <form onSubmit={handleSubmit} className="add-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Building Name *</label>
                  <input type="text" placeholder="e.g. Donald Bren Hall" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="input-group">
                  <label>Abbreviation *</label>
                  <input type="text" placeholder="e.g. DBH" value={form.abbr} onChange={e => setForm(f => ({ ...f, abbr: e.target.value }))} required maxLength={6} />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                    <option value="">Select category</option>
                    {['Academic', 'Dining', 'Study', 'Recreation', 'Services', 'Parking', 'Outdoor'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Hours</label>
                  <input type="text" placeholder="e.g. Mon–Fri 8am–6pm" value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} />
                </div>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea rows={3} placeholder="Brief description of the building..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="form-btns">
                <button type="button" className="form-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="form-btn-save">{saved ? '✓ Saved!' : 'Save Building'}</button>
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
              <span className="mbd-row-hours">{b.hours.split(',')[0]}</span>
              <div className="mbd-row-actions">
                <button className="row-btn edit">Edit</button>
                <button className="row-btn delete">Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
