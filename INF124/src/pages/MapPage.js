import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { BUILDINGS, CATEGORIES, UCI_CENTER } from '../data/mockData';
import './MapPage.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const categoryColors = {
  Dining: '#f5c842',
  Study: '#5b9cf6',
  Academic: '#4ecda4',
  Recreation: '#f06a6a',
  Services: '#c084fc',
  Parking: '#fb923c',
  Outdoor: '#86efac',
  default: '#8b90a7',
};

function createCustomIcon(category, selected) {
  const color = categoryColors[category] || categoryColors.default;
  const size = selected ? 36 : 28;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="12" fill="${color}" opacity="${selected ? 1 : 0.85}" stroke="white" stroke-width="2.5"/>
      ${selected ? `<circle cx="18" cy="18" r="16" fill="${color}" opacity="0.2"/>` : ''}
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
}

function FlyTo({ coords }) {
  const map = useMap();
  if (coords) map.flyTo(coords, 17, { duration: 1 });
  return null;
}

export default function MapPage() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [flyTo, setFlyTo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const filtered = BUILDINGS.filter(b => {
    const matchesCat = activeCategory === 'All' || b.category === activeCategory;
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.abbr.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectBuilding = (building) => {
    setSelectedBuilding(building);
    setFlyTo([building.lat, building.lng]);
  };

  return (
    <div className="map-page">
      {/* Sidebar */}
      <aside className={`map-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h2>Campus Map</h2>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {sidebarOpen && (
          <>
            {/* Search */}
            <div className="map-search-wrapper">
              <span className="map-search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                className="map-search"
                type="text"
                placeholder="Search buildings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="map-search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>

            {/* Category Filter */}
            <div className="map-categories">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  style={activeCategory === cat ? { background: categoryColors[cat] || 'var(--teal)', color: '#0f1117' } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Building List */}
            <div className="building-list">
              <p className="list-count">{filtered.length} location{filtered.length !== 1 ? 's' : ''}</p>
              {filtered.map(b => (
                <button
                  key={b.id}
                  className={`building-row ${selectedBuilding?.id === b.id ? 'selected' : ''}`}
                  onClick={() => handleSelectBuilding(b)}
                >
                  <span
                    className="building-dot"
                    style={{ background: categoryColors[b.category] || categoryColors.default }}
                  />
                  <div className="building-row-info">
                    <span className="building-row-name">{b.name}</span>
                    <span className="building-row-sub">{b.category} · {b.abbr}</span>
                  </div>
                  <span className="building-row-arrow">›</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="empty-state">
                  <p>No locations found</p>
                  <button onClick={() => { setSearch(''); setActiveCategory('All'); }}>Clear filters</button>
                </div>
              )}
            </div>
          </>
        )}
      </aside>

      {/* Map */}
      <div className="map-container-wrapper">
        <MapContainer
          center={UCI_CENTER}
          zoom={15}
          className="leaflet-map"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyTo coords={flyTo} />

          {filtered.map(b => (
            <Marker
              key={b.id}
              position={[b.lat, b.lng]}
              icon={createCustomIcon(b.category, selectedBuilding?.id === b.id)}
              eventHandlers={{ click: () => handleSelectBuilding(b) }}
            >
              <Popup className="custom-popup">
                <div className="popup-content">
                  <div className="popup-header">
                    <span
                      className="popup-cat-badge"
                      style={{ background: categoryColors[b.category] || categoryColors.default }}
                    >
                      {b.category}
                    </span>
                  </div>
                  <h3 className="popup-name">{b.name}</h3>
                  <p className="popup-hours">🕐 {b.hours}</p>
                  <button
                    className="popup-btn"
                    onClick={() => navigate(`/directory/buildings/${b.id}`)}
                  >
                    View Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Selected building panel (mobile) */}
        {selectedBuilding && (
          <div className="map-bottom-panel">
            <button className="panel-close" onClick={() => setSelectedBuilding(null)}>✕</button>
            <div className="panel-content">
              <span
                className="panel-badge"
                style={{ background: categoryColors[selectedBuilding.category] }}
              >
                {selectedBuilding.category}
              </span>
              <h3>{selectedBuilding.name}</h3>
              <p className="panel-hours">🕐 {selectedBuilding.hours}</p>
              <div className="panel-actions">
                <button
                  className="panel-btn-primary"
                  onClick={() => navigate(`/directory/buildings/${selectedBuilding.id}`)}
                >
                  View Details
                </button>
                <button
                  className="panel-btn-ghost"
                  onClick={() => navigate(`/directions?to=${selectedBuilding.id}`)}
                >
                  Directions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="map-legend">
          {Object.entries(categoryColors).filter(([k]) => k !== 'default').map(([cat, color]) => (
            <div key={cat} className="legend-item">
              <span className="legend-dot" style={{ background: color }} />
              <span>{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
