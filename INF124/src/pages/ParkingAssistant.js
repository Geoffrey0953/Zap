import React, { useState } from 'react';
import { PARKING_LOTS } from '../data/mockData';
import './ParkingAssistant.css';

function availabilityColor(available, total) {
  const pct = available / total;
  if (available === 0) return '#f06a6a';
  if (pct < 0.15) return '#f5c842';
  return '#4ecda4';
}

function availabilityLabel(available, total) {
  if (available === 0) return 'Full';
  const pct = available / total;
  if (pct < 0.15) return 'Almost Full';
  if (pct < 0.5) return 'Filling Up';
  return 'Available';
}

export default function ParkingAssistant() {
  const [filterType, setFilterType] = useState('All');
  const [permitFilter, setPermitFilter] = useState('');

  const types = ['All', 'Structure', 'Surface'];

  const filtered = PARKING_LOTS.filter(lot => {
    const matchType = filterType === 'All' || lot.type === filterType;
    const matchPermit = !permitFilter || lot.permit.includes(permitFilter.toUpperCase());
    return matchType && matchPermit;
  });

  const totalAvailable = PARKING_LOTS.reduce((sum, l) => sum + l.available, 0);
  const totalSpaces = PARKING_LOTS.reduce((sum, l) => sum + l.total, 0);

  return (
    <div className="parking-page">
      <div className="parking-container">

        <div className="parking-header">
          <h1>Parking Assistant</h1>
          <div className="live-badge">
            <span className="live-dot" />
            Live
          </div>
        </div>

        {/* Summary */}
        <div className="parking-summary">
          <div className="summary-main">
            <span className="summary-number" style={{ color: availabilityColor(totalAvailable, totalSpaces) }}>
              {totalAvailable}
            </span>
            <span className="summary-label">spaces available across campus</span>
          </div>
          <div className="summary-bar-wrap">
            <div className="summary-bar">
              <div
                className="summary-bar-fill"
                style={{
                  width: `${(totalAvailable / totalSpaces) * 100}%`,
                  background: availabilityColor(totalAvailable, totalSpaces)
                }}
              />
            </div>
            <span className="summary-bar-label">{totalSpaces} total</span>
          </div>
        </div>

        {/* Filters */}
        <div className="parking-filters">
          <div className="filter-group">
            {types.map(t => (
              <button
                key={t}
                className={`filter-btn ${filterType === t ? 'active' : ''}`}
                onClick={() => setFilterType(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            className="permit-input"
            type="text"
            placeholder="Permit (A, B, P...)"
            value={permitFilter}
            onChange={e => setPermitFilter(e.target.value)}
            maxLength={3}
          />
        </div>

        {/* Lot cards */}
        <div className="lots-list">
          {filtered.map(lot => {
            const color = availabilityColor(lot.available, lot.total);
            const pct = (lot.available / lot.total) * 100;
            const label = availabilityLabel(lot.available, lot.total);
            return (
              <div key={lot.id} className="lot-card">
                <div className="lot-card-top">
                  <div className="lot-info">
                    <h3>{lot.name}</h3>
                    <div className="lot-meta">
                      <span className="lot-type-badge">{lot.type}</span>
                      <span className="lot-permit">Permit: {lot.permit}</span>
                    </div>
                  </div>
                  <div className="lot-availability">
                    <span className="lot-count" style={{ color }}>{lot.available}</span>
                    <span className="lot-count-label">/ {lot.total}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="lot-bar-wrap">
                  <div className="lot-bar">
                    <div
                      className="lot-bar-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <span className="lot-status" style={{ color }}>{label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="parking-empty">
            <span>🅿</span>
            <p>No lots match your filters</p>
            <button onClick={() => { setFilterType('All'); setPermitFilter(''); }}>Clear filters</button>
          </div>
        )}

        {/* Tips */}
        <div className="parking-tips">
          <h3>💡 Parking Tips</h3>
          <ul>
            <li>Permit A is valid in most lots during business hours</li>
            <li>After 5pm, most lots require only a daily permit</li>
            <li>Structures typically fill up faster on Mon/Wed/Fri</li>
            <li>Mesa Court lot is least congested in the morning</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
