import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuildings } from '../hooks/useBuildings';
import { apiFetch } from '../api/client';
import SearchBar from '../components/SearchBar';
import './Home.css';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { buildings } = useBuildings();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    apiFetch('/alerts?active=true')
      .then(data => setAlerts(data.data || []))
      .catch(() => {});
  }, []);

  const activeAlerts = alerts.filter(a => a.active);

  // Pick diverse categories for trending display
  const trending = buildings.slice(0, 6);

  return (
    <div className="home">
      {/* Hero / Search section */}
      <section className="home-hero">
        <div className="hero-content">
          <p className="hero-greeting">
            {isAuthenticated ? `Good morning, ${user.name.split(' ')[0]} 👋` : 'Find anything at UCI'}
          </p>
          <SearchBar placeholder="Search places, buildings, food..." />

          {/* Quick Filters */}
          <div className="quick-filters">
            {QUICK_FILTERS.map(f => (
              <button
                key={f}
                className="filter-chip"
                onClick={() => navigate(`/directory/buildings?category=${encodeURIComponent(f)}`)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Alerts Banner */}
      {activeAlerts.length > 0 && (
        <section className="alerts-banner">
          <div className="alert-scroll">
            {activeAlerts.map(alert => (
              <div key={alert._id || alert.id} className={`alert-chip alert-${alert.type}`}>
                <span className="alert-dot" />
                <span>{alert.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main content */}
      <div className="home-body">

        {/* Nearby Places */}
        <section className="home-section">
          <div className="section-header">
            <h2 className="section-title">Campus Places</h2>
            <Link to="/directory/buildings" className="section-link">See all →</Link>
          </div>
          <div className="trending-list">
            {trending.map(place => (
              <button
                key={place.id}
                className="trending-card"
                onClick={() => navigate(`/directory/buildings/${place.id}`)}
              >
                <div className="trending-icon" data-category={place.category}>
                  {categoryEmoji(place.category)}
                </div>
                <div className="trending-info">
                  <span className="trending-name">{place.name}</span>
                  <span className="trending-sub">{place.category} · {place.abbr}</span>
                </div>
                <div className="trending-right">
                  <span className="trending-arrow">›</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Quick Access Grid */}
        <section className="home-section">
          <h2 className="section-title">Quick access</h2>
          <div className="quick-grid">
            {QUICK_ACCESS.map(item => (
              <button
                key={item.label}
                className="quick-card"
                onClick={() => navigate(item.to)}
              >
                <span className="quick-icon">{item.icon}</span>
                <span className="quick-label">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* CTA if not logged in */}
        {!isAuthenticated && (
          <section className="home-cta">
            <div className="cta-card">
              <h3>Get the full experience</h3>
              <p>Sign in to save locations, track your class schedule, and get personalized updates.</p>
              <div className="cta-btns">
                <Link to="/signup" className="cta-btn-primary">Create Account</Link>
                <Link to="/login" className="cta-btn-ghost">Sign In</Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function categoryEmoji(cat) {
  const map = { Dining: '🍽', Study: '📚', Recreation: '🏋', Academic: '🏛', Outdoor: '🌳', Services: '🛎', Parking: '🅿' };
  return map[cat] || '📍';
}

const QUICK_FILTERS = ['Food', 'Study spots', 'Academic', 'Recreation'];

const QUICK_ACCESS = [
  { label: 'Map', icon: '◎', to: '/map' },
  { label: 'Directions', icon: '➜', to: '/directions' },
  { label: 'Buildings', icon: '🏛', to: '/directory/buildings' },
  { label: 'Departments', icon: '📚', to: '/directory/departments' },
  { label: 'Emergency', icon: '🚨', to: '/emergency' },
  { label: 'Help', icon: '💬', to: '/help' },
];