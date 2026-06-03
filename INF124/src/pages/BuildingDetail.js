import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useBuilding } from '../hooks/useBuildings';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import { getToken } from '../context/AuthContext';
import './BuildingDetail.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const categoryColors = {
  Dining: '#f5c842', Study: '#5b9cf6', Academic: '#4ecda4',
  Recreation: '#f06a6a', Services: '#c084fc', Parking: '#fb923c',
  Outdoor: '#86efac', default: '#8b90a7',
};

export default function BuildingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const { building, loading, error } = useBuilding(id);

  // Check if this building is already saved when authenticated and building loads
  useEffect(() => {
    const checkSaved = async () => {
      if (!isAuthenticated || !building) return;
      const token = getToken();
      if (!token) return;
      try {
        const data = await apiFetch('/saved', { token });
        const existing = (data.data || []).find(
          s => s.buildingId === building.id
        );
        if (existing) {
          setSaved(true);
          setSavedId(existing._id);
        }
      } catch {
        // Silently ignore — user can still try to save
      }
    };
    checkSaved();
  }, [isAuthenticated, building]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${building.lat},${building.lng}&destination_place_id=${encodeURIComponent(building.name)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="bdetail-notfound">
        <h2>Loading building…</h2>
        <Link to="/directory/buildings">← Back to Directory</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bdetail-notfound">
        <h2>Error: {error}</h2>
        <Link to="/directory/buildings">← Back to Directory</Link>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="bdetail-notfound">
        <h2>Building not found</h2>
        <Link to="/directory/buildings">← Back to Directory</Link>
      </div>
    );
  }

  const color = categoryColors[building.category] || categoryColors.default;

  const handleSave = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const token = getToken();
    if (!token) { navigate('/login'); return; }

    setSaveLoading(true);
    try {
      if (saved && savedId) {
        await apiFetch(`/saved/${savedId}`, { method: 'DELETE', token });
        setSaved(false);
        setSavedId(null);
      } else {
        const data = await apiFetch('/saved', {
          method: 'POST',
          body: { buildingId: id, list: 'Study' },
          token,
        });
        setSaved(true);
        setSavedId(data.data._id);
      }
    } catch (err) {
      alert(`Failed to ${saved ? 'unsave' : 'save'}: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="bdetail-page">

      {/* Header bar */}
      <div className="bdetail-topbar">
        <button className="bdetail-back" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <button
          className={`bdetail-save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={saveLoading}
          title={saved ? 'Remove from saved' : 'Save this place'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'var(--teal)' : 'none'} stroke={saved ? 'var(--teal)' : 'currentColor'} strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
          {saveLoading ? '...' : saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Mini Map */}
      <div className="bdetail-map">
        <MapContainer
          center={[building.lat, building.lng]}
          zoom={17}
          className="bdetail-leaflet"
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[building.lat, building.lng]}>
            <Popup>{building.name}</Popup>
          </Marker>
        </MapContainer>
        <div className="bdetail-map-overlay" onClick={() => navigate('/map')} title="Open full map" />
        <button className="bdetail-full-map" onClick={() => navigate('/map')}>
          Open full map ↗
        </button>
      </div>

      <div className="bdetail-body">

        {/* Title section */}
        <div className="bdetail-title-section">
          <div className="bdetail-badges">
            <span className="bdetail-badge" style={{ background: color + '22', color }}>
              {building.category}
            </span>
            {building.departments.length > 0 && (
              <span className="bdetail-badge dept-badge">Academic</span>
            )}
          </div>
          <h1 className="bdetail-name">{building.name}</h1>
          <p className="bdetail-abbr">{building.abbr} · UCI Campus</p>
        </div>

        {/* Info cards */}
        <div className="bdetail-info-grid">
          <div className="info-card">
            <span className="info-card-icon">🕐</span>
            <div>
              <span className="info-card-label">Hours</span>
              <span className="info-card-value">{building.hours}</span>
            </div>
          </div>
          <div className="info-card">
            <span className="info-card-icon">📍</span>
            <div>
              <span className="info-card-label">Location</span>
              <span className="info-card-value">UCI Main Campus</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bdetail-section">
          <h2>About</h2>
          <p className="bdetail-desc">{building.description}</p>
        </div>

        {/* Departments */}
        {building.departments.length > 0 && (
          <div className="bdetail-section">
            <h2>Departments</h2>
            <div className="dept-list">
              {building.departments.map(d => (
                <Link key={d} to="/directory/departments" className="dept-item">
                  <span>📚 {d}</span>
                  <span className="dept-item-arrow">›</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="bdetail-actions">
          <button
            className="action-btn primary"
            onClick={openInGoogleMaps}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            Open in Google Maps
          </button>
          <Link to={`/directions?to=${building.id}`} className="action-btn ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 1 21 5 17 9"/>
              <path d="M3 11V9a4 4 0 014-4h14"/>
              <polyline points="7 23 3 19 7 15"/>
              <path d="M21 13v2a4 4 0 01-4 4H3"/>
            </svg>
            Plan route in app
          </Link>
        </div>

      </div>
    </div>
  );
}