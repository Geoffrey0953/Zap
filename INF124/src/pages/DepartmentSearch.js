import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DEPARTMENTS } from '../data/departments';
import './DepartmentSearch.css';

const SCHOOLS = ['All', ...Array.from(new Set(DEPARTMENTS.map(d => d.school)))];

export default function DepartmentSearch() {
  const [search, setSearch] = useState('');
  const [activeSchool, setActiveSchool] = useState('All');
  const navigate = useNavigate();

  const filtered = DEPARTMENTS.filter(d => {
    const matchSchool = activeSchool === 'All' || d.school === activeSchool;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.school.toLowerCase().includes(search.toLowerCase());
    return matchSchool && matchSearch;
  });

  return (
    <div className="dept-page">
      <div className="dept-container">

        <div className="dept-header">
          <Link to="/directory" className="back-link">← Directory</Link>
          <h1>Department Search</h1>
          <p>{DEPARTMENTS.length} departments across UCI</p>
        </div>

        {/* Search */}
        <div className="dept-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search departments or schools..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="dept-search"
          />
          {search && <button className="dept-clear" onClick={() => setSearch('')}>✕</button>}
        </div>

        {/* School filter */}
        <div className="school-filters">
          {SCHOOLS.map(s => (
            <button
              key={s}
              className={`school-chip ${activeSchool === s ? 'active' : ''}`}
              onClick={() => setActiveSchool(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="dept-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

        {/* Department list */}
        <div className="dept-list">
          {filtered.map(dept => (
            <div key={dept.id} className="dept-card">
              <div className="dept-card-main">
                <div className="dept-avatar">
                  {dept.name.charAt(0)}
                </div>
                <div className="dept-info">
                  <h3>{dept.name}</h3>
                  <span className="dept-school">{dept.school}</span>
                  <button
                    className="dept-building-link"
                    onClick={() => navigate(`/directory/buildings/${dept.building.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')}`)}
                  >
                    📍 {dept.building}
                  </button>
                </div>
              </div>
              <div className="dept-card-contacts">
                <a href={`tel:${dept.phone}`} className="contact-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  {dept.phone}
                </a>
                <a href={`mailto:${dept.email}`} className="contact-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {dept.email}
                </a>
                <a href={dept.website} target="_blank" rel="noreferrer" className="contact-item teal">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                  </svg>
                  Website ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="dept-empty">
            <span>📚</span>
            <p>No departments found</p>
            <button onClick={() => { setSearch(''); setActiveSchool('All'); }}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
