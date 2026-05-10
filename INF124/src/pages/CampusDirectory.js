import React from 'react';
import { Link } from 'react-router-dom';
import './CampusDirectory.css';

const SECTIONS = [
  {
    to: '/directory/buildings',
    icon: '🏛',
    label: 'Building Directory',
    sub: 'Find classrooms, offices, and facilities',
    count: '10 buildings',
    color: '#4ecda4',
  },
  {
    to: '/directory/departments',
    icon: '📚',
    label: 'Department Search',
    sub: 'Locate academic departments and schools',
    count: '8 departments',
    color: '#5b9cf6',
  },
];

export default function CampusDirectory() {
  return (
    <div className="directory-page">
      <div className="directory-container">
        <div className="directory-hero">
          <h1>Campus Directory</h1>
          <p>Find buildings, departments, and offices across UCI.</p>
        </div>

        <div className="directory-cards">
          {SECTIONS.map(s => (
            <Link key={s.to} to={s.to} className="dir-card">
              <div className="dir-card-icon" style={{ background: s.color + '18', border: `1px solid ${s.color}33` }}>
                <span>{s.icon}</span>
              </div>
              <div className="dir-card-info">
                <h2>{s.label}</h2>
                <p>{s.sub}</p>
                <span className="dir-card-count">{s.count}</span>
              </div>
              <span className="dir-card-arrow" style={{ color: s.color }}>›</span>
            </Link>
          ))}
        </div>

        {/* Quick category grid */}
        <div className="directory-quick">
          <h3>Browse by Category</h3>
          <div className="category-grid">
            {CATEGORY_LINKS.map(c => (
              <Link key={c.label} to={`/directory/buildings`} className="cat-card">
                <span className="cat-card-icon">{c.icon}</span>
                <span className="cat-card-label">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const CATEGORY_LINKS = [
  { icon: '🍽', label: 'Dining' },
  { icon: '📖', label: 'Study' },
  { icon: '🏋', label: 'Recreation' },
  { icon: '🏛', label: 'Academic' },
  { icon: '🌳', label: 'Outdoor' },
  { icon: '🛎', label: 'Services' },
  { icon: '🅿', label: 'Parking' },
  { icon: '🗺', label: 'All' },
];
