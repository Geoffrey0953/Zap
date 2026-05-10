import React, { useState, useEffect } from 'react';
import { SHUTTLE_ROUTES } from '../data/mockData';
import './ShuttleTracker.css';

export default function ShuttleTracker() {
  const [activeRoute, setActiveRoute] = useState(SHUTTLE_ROUTES[0].id);
  const [tick, setTick] = useState(0);

  // Simulate live countdown
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const route = SHUTTLE_ROUTES.find(r => r.id === activeRoute);

  return (
    <div className="shuttle-page">
      <div className="shuttle-container">

        <div className="shuttle-header">
          <h1>Shuttle Tracker</h1>
          <div className="live-badge">
            <span className="live-dot" />
            Live
          </div>
        </div>

        <p className="shuttle-sub">Real-time UCI campus shuttle routes</p>

        {/* Route selector */}
        <div className="route-tabs">
          {SHUTTLE_ROUTES.map(r => (
            <button
              key={r.id}
              className={`route-tab ${activeRoute === r.id ? 'active' : ''}`}
              onClick={() => setActiveRoute(r.id)}
              style={activeRoute === r.id ? { borderColor: r.color, color: r.color } : {}}
            >
              <span className="route-tab-dot" style={{ background: r.color }} />
              {r.name}
            </button>
          ))}
        </div>

        {/* Active route card */}
        <div className="route-card">
          <div className="route-card-header" style={{ borderLeftColor: route.color }}>
            <div className="route-card-info">
              <h2>{route.name}</h2>
              <span
                className={`route-status ${route.status === 'On Time' ? 'on-time' : 'delayed'}`}
              >
                {route.status}
              </span>
            </div>
            <div className="route-arrival">
              <span className="arrival-label">Next arrival</span>
              <span className="arrival-time" style={{ color: route.color }}>{route.nextArrival}</span>
            </div>
          </div>

          <div className="route-meta">
            <div className="meta-item">
              <span className="meta-label">Frequency</span>
              <span className="meta-value">Every {route.frequency}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Stops</span>
              <span className="meta-value">{route.stops.length}</span>
            </div>
          </div>

          {/* Stops timeline */}
          <div className="stops-section">
            <h3>Route Stops</h3>
            <div className="stops-timeline">
              {route.stops.map((stop, i) => (
                <div key={i} className="stop-item">
                  <div className="stop-indicator">
                    <div
                      className={`stop-dot ${i === 0 ? 'first' : i === route.stops.length - 1 ? 'last' : ''}`}
                      style={{ borderColor: route.color, background: i === 0 ? route.color : 'var(--bg-secondary)' }}
                    />
                    {i < route.stops.length - 1 && (
                      <div className="stop-line" style={{ background: route.color + '40' }} />
                    )}
                  </div>
                  <div className="stop-info">
                    <span className="stop-name">{stop}</span>
                    {i === 0 && <span className="stop-badge" style={{ background: route.color + '22', color: route.color }}>Origin</span>}
                    {i === route.stops.length - 1 && <span className="stop-badge" style={{ background: route.color + '22', color: route.color }}>Terminus</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All routes summary */}
        <div className="all-routes">
          <h3>All Routes</h3>
          <div className="route-summary-list">
            {SHUTTLE_ROUTES.map(r => (
              <button
                key={r.id}
                className={`route-summary-item ${activeRoute === r.id ? 'active' : ''}`}
                onClick={() => setActiveRoute(r.id)}
              >
                <div className="rs-left">
                  <span className="rs-dot" style={{ background: r.color }} />
                  <div>
                    <span className="rs-name">{r.name}</span>
                    <span className="rs-freq">Every {r.frequency}</span>
                  </div>
                </div>
                <div className="rs-right">
                  <span className={`rs-status ${r.status === 'On Time' ? 'on-time' : 'delayed'}`}>
                    {r.status}
                  </span>
                  <span className="rs-next" style={{ color: r.color }}>{r.nextArrival}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
