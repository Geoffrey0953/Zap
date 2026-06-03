import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CATEGORIES } from '../data/constants';
import { useBuildings } from '../hooks/useBuildings';
import './BuildingDirectory.css';

const categoryColors = {
  Dining: '#f5c842', Study: '#5b9cf6', Academic: '#4ecda4',
  Recreation: '#f06a6a', Services: '#c084fc', Parking: '#fb923c',
  Outdoor: '#86efac', default: '#8b90a7',
};

function categoryEmoji(cat) {
  const map = { Dining: '🍽', Study: '📚', Recreation: '🏋', Academic: '🏛', Outdoor: '🌳', Services: '🛎', Parking: '🅿' };
  return map[cat] || '📍';
}

export default function BuildingDirectory() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { buildings, loading, error } = useBuildings();
  const navigate = useNavigate();

  if (loading) {
    return <div className="bdir-page"><p className="bdir-count">Loading buildings…</p></div>;
  }

  if (error) {
    return <div className="bdir-page"><p className="bdir-count">Error: {error}</p></div>;
  }

  const filtered = buildings
    .filter(b => {
      const matchCat = activeCategory === 'All' || b.category === activeCategory;
      const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.abbr.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bdir-page">
      <div className="bdir-container">

        {/* Header */}
        <div className="bdir-header">
          <Link to="/directory" className="back-link">← Directory</Link>
          <h1>Building Directory</h1>
          <p>{buildings.length} locations on campus</p>
        </div>

        {/* Search */}
        <div className="bdir-search-row">
          <div className="bdir-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search buildings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bdir-search"
            />
            {search && <button className="bdir-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
        </div>

        {/* Category chips */}
        <div className="bdir-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`bdir-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              style={activeCategory === cat && cat !== 'All'
                ? { background: categoryColors[cat], borderColor: categoryColors[cat], color: '#0f1117' }
                : {}}
            >
              {cat !== 'All' && <span>{categoryEmoji(cat)}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="bdir-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

        {/* Building cards */}
        <div className="bdir-grid">
          {filtered.map(b => (
            <button
              key={b.id}
              className="bdir-card"
              onClick={() => navigate(`/directory/buildings/${b.id}`)}
            >
              <div
                className="bdir-card-icon"
                style={{ background: (categoryColors[b.category] || categoryColors.default) + '18' }}
              >
                <span>{categoryEmoji(b.category)}</span>
              </div>
              <div className="bdir-card-info">
                <div className="bdir-card-top">
                  <span className="bdir-card-name">{b.name}</span>
                  <span
                    className="bdir-card-badge"
                    style={{
                      background: (categoryColors[b.category] || categoryColors.default) + '22',
                      color: categoryColors[b.category] || categoryColors.default
                    }}
                  >
                    {b.category}
                  </span>
                </div>
                <span className="bdir-card-abbr">{b.abbr}</span>
                <span className="bdir-card-hours">🕐 {b.hours}</span>
                {b.departments.length > 0 && (
                  <div className="bdir-card-depts">
                    {b.departments.slice(0, 2).map(d => (
                      <span key={d} className="dept-tag">{d}</span>
                    ))}
                    {b.departments.length > 2 && (
                      <span className="dept-tag">+{b.departments.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
              <span className="bdir-card-arrow">›</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bdir-empty">
            <span>🔍</span>
            <p>No buildings match your search</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
