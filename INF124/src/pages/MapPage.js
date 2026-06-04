import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import { BUILDINGS, CATEGORIES, UCI_CENTER } from '../data/mockData';
import './MapPage.css';

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

function createEndpointIcon(type) {
  const color = type === 'from' ? '#4ecda4' : '#f06a6a';
  const label = type === 'from' ? 'A' : 'B';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24S32 28 32 16C32 7.16 24.84 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="8" fill="white"/>
      <text x="16" y="20" text-anchor="middle" font-size="10" font-weight="bold" fill="${color}" font-family="sans-serif">${label}</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
}

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 17, { duration: 1 });
  }, [coords, map]);
  return null;
}

function FitBounds({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length >= 2) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [coords, map]);
  return null;
}

// Fetch walking route from OpenRouteService (free, no key needed for light use)
// Falls back to straight line if API fails
async function fetchWalkingRoute(fromCoords, toCoords) {
  try {
    const url = `https://router.project-osrm.org/route/v1/foot/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Route fetch failed');
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes[0]) throw new Error('No route found');

    const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const distanceM = data.routes[0].distance;
    const durationS = data.routes[0].duration;
    const distanceMi = (distanceM * 0.000621371).toFixed(2);
    const durationMin = Math.ceil(durationS / 60);

    return { coords, distanceMi, durationMin, error: null };
  } catch (err) {
    // Fallback: straight line
    return {
      coords: [fromCoords, toCoords],
      distanceMi: haversineDistance(fromCoords, toCoords).toFixed(2),
      durationMin: Math.ceil(haversineDistance(fromCoords, toCoords) / 0.05),
      error: 'Using straight-line estimate',
    };
  }
}

function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapPage() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [flyTo, setFlyTo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mode, setMode] = useState('explore'); // 'explore' | 'directions'

  // Directions state
  const [fromBuilding, setFromBuilding] = useState(null);
  const [toBuilding, setToBuilding] = useState(null);
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [routeCoords, setRouteCoords] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Auto-populate "to" if navigated here from a building's Directions button
  useEffect(() => {
    const toId = searchParams.get('to');
    if (toId) {
      const building = BUILDINGS.find(b => b.id === toId);
      if (building) {
        setMode('directions');
        setToBuilding(building);
        setToSearch(building.name);
      }
    }
  }, [searchParams]);

  const filtered = BUILDINGS.filter(b => {
    const matchesCat = activeCategory === 'All' || b.category === activeCategory;
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.abbr.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectBuilding = (building) => {
    if (mode === 'directions') {
      if (!fromBuilding) {
        setFromBuilding(building);
        setFromSearch(building.name);
      } else if (!toBuilding) {
        setToBuilding(building);
        setToSearch(building.name);
      }
    } else {
      setSelectedBuilding(building);
      setFlyTo([building.lat, building.lng]);
    }
  };

  const getSuggestions = (val) =>
    BUILDINGS.filter(b => b.name.toLowerCase().includes(val.toLowerCase()) && val.length > 1).slice(0, 5);

  const handleFromInput = (val) => {
    setFromSearch(val);
    setFromSuggestions(getSuggestions(val));
    if (!val) { setFromBuilding(null); setRouteCoords(null); setRouteInfo(null); }
  };

  const handleToInput = (val) => {
    setToSearch(val);
    setToSuggestions(getSuggestions(val));
    if (!val) { setToBuilding(null); setRouteCoords(null); setRouteInfo(null); }
  };

  const handleGetDirections = async () => {
    if (!fromBuilding || !toBuilding) return;
    setRouteLoading(true);
    setRouteCoords(null);
    setRouteInfo(null);
    const result = await fetchWalkingRoute(
      [fromBuilding.lat, fromBuilding.lng],
      [toBuilding.lat, toBuilding.lng]
    );
    setRouteCoords(result.coords);
    setRouteInfo(result);
    setRouteLoading(false);
  };

  const clearDirections = () => {
    setFromBuilding(null);
    setToBuilding(null);
    setFromSearch('');
    setToSearch('');
    setRouteCoords(null);
    setRouteInfo(null);
  };

  const swapDirections = () => {
    setFromBuilding(toBuilding);
    setToBuilding(fromBuilding);
    setFromSearch(toSearch);
    setToSearch(fromSearch);
    setRouteCoords(null);
    setRouteInfo(null);
  };

  return (
    <div className="map-page">
      {/* Sidebar */}
      <aside className={`map-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h2>{mode === 'directions' ? 'Directions' : 'Campus Map'}</h2>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {sidebarOpen && (
          <>
            {/* Mode toggle */}
            <div className="mode-toggle">
              <button
                className={`mode-btn ${mode === 'explore' ? 'active' : ''}`}
                onClick={() => { setMode('explore'); clearDirections(); }}
              >
                🗺 Explore
              </button>
              <button
                className={`mode-btn ${mode === 'directions' ? 'active' : ''}`}
                onClick={() => setMode('directions')}
              >
                🧭 Directions
              </button>
            </div>

            {mode === 'directions' ? (
              /* ===== DIRECTIONS PANEL ===== */
              <div className="directions-panel">
                {/* From input */}
                <div className="dir-field">
                  <span className="dir-field-dot from" />
                  <div className="dir-field-inner">
                    <input
                      className="dir-field-input"
                      type="text"
                      placeholder="From: building or location"
                      value={fromSearch}
                      onChange={e => handleFromInput(e.target.value)}
                      onBlur={() => setTimeout(() => setFromSuggestions([]), 150)}
                    />
                    {fromSuggestions.length > 0 && (
                      <div className="dir-suggestions">
                        {fromSuggestions.map(b => (
                          <button key={b.id} className="dir-suggestion"
                            onMouseDown={() => { setFromBuilding(b); setFromSearch(b.name); setFromSuggestions([]); }}>
                            📍 {b.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Swap button */}
                <div className="dir-swap-row">
                  <div className="dir-connector-line" />
                  <button className="dir-swap-btn" onClick={swapDirections} title="Swap">⇅</button>
                </div>

                {/* To input */}
                <div className="dir-field">
                  <span className="dir-field-dot to" />
                  <div className="dir-field-inner">
                    <input
                      className="dir-field-input"
                      type="text"
                      placeholder="To: destination"
                      value={toSearch}
                      onChange={e => handleToInput(e.target.value)}
                      onBlur={() => setTimeout(() => setToSuggestions([]), 150)}
                    />
                    {toSuggestions.length > 0 && (
                      <div className="dir-suggestions">
                        {toSuggestions.map(b => (
                          <button key={b.id} className="dir-suggestion"
                            onMouseDown={() => { setToBuilding(b); setToSearch(b.name); setToSuggestions([]); }}>
                            📍 {b.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Go button */}
                <button
                  className="dir-go-btn"
                  onClick={handleGetDirections}
                  disabled={!fromBuilding || !toBuilding || routeLoading}
                >
                  {routeLoading ? 'Finding route...' : 'Get Walking Directions'}
                </button>

                {/* Hint */}
                {!fromBuilding && !toBuilding && (
                  <p className="dir-hint">💡 Tap any building on the map to set it as your start or end point</p>
                )}

                {/* Route result */}
                {routeInfo && (
                  <div className="route-result">
                    <div className="route-result-stats">
                      <div className="rr-stat">
                        <span className="rr-val">{routeInfo.distanceMi} mi</span>
                        <span className="rr-label">Distance</span>
                      </div>
                      <div className="rr-stat">
                        <span className="rr-val">~{routeInfo.durationMin} min</span>
                        <span className="rr-label">Walking</span>
                      </div>
                      <div className="rr-stat">
                        <span className="rr-val">~{Math.ceil(routeInfo.durationMin * 0.3)} min</span>
                        <span className="rr-label">By bike</span>
                      </div>
                    </div>
                    <div className="route-buildings">
                      <span className="rb-from">{fromBuilding.name}</span>
                      <span className="rb-arrow">→</span>
                      <span className="rb-to">{toBuilding.name}</span>
                    </div>
                    {routeInfo.error && (
                      <p className="route-fallback-note">⚠️ {routeInfo.error}</p>
                    )}
                    <button className="clear-route-btn" onClick={clearDirections}>✕ Clear Route</button>
                  </div>
                )}
              </div>
            ) : (
              /* ===== EXPLORE PANEL ===== */
              <>
                <div className="map-search-wrapper">
                  <span className="map-search-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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

                <div className="building-list">
                  <p className="list-count">{filtered.length} location{filtered.length !== 1 ? 's' : ''}</p>
                  {filtered.map(b => (
                    <button
                      key={b.id}
                      className={`building-row ${selectedBuilding?.id === b.id ? 'selected' : ''}`}
                      onClick={() => handleSelectBuilding(b)}
                    >
                      <span className="building-dot" style={{ background: categoryColors[b.category] || categoryColors.default }} />
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
          </>
        )}
      </aside>

      {/* Map */}
      <div className="map-container-wrapper">
        <MapContainer center={UCI_CENTER} zoom={15} className="leaflet-map" zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {flyTo && mode === 'explore' && <FlyTo coords={flyTo} />}
          {routeCoords && <FitBounds coords={routeCoords} />}

          {/* Building markers */}
          {(mode === 'explore' ? filtered : BUILDINGS).map(b => (
            <Marker
              key={b.id}
              position={[b.lat, b.lng]}
              icon={createCustomIcon(
                b.category,
                mode === 'explore'
                  ? selectedBuilding?.id === b.id
                  : fromBuilding?.id === b.id || toBuilding?.id === b.id
              )}
              eventHandlers={{ click: () => handleSelectBuilding(b) }}
            >
              <Popup className="custom-popup">
                <div className="popup-content">
                  <div className="popup-header">
                    <span className="popup-cat-badge" style={{ background: categoryColors[b.category] || categoryColors.default }}>
                      {b.category}
                    </span>
                  </div>
                  <h3 className="popup-name">{b.name}</h3>
                  <p className="popup-hours">🕐 {b.hours}</p>
                  <div className="popup-btns">
                    <button className="popup-btn" onClick={() => navigate(`/directory/buildings/${b.id}`)}>
                      View Details →
                    </button>
                    <button className="popup-btn-ghost" onClick={() => {
                      setMode('directions');
                      setToBuilding(b);
                      setToSearch(b.name);
                    }}>
                      🧭 Directions
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Route line */}
          {routeCoords && (
            <Polyline
              positions={routeCoords}
              color="#4ecda4"
              weight={5}
              opacity={0.85}
              dashArray={null}
            />
          )}

          {/* From / To endpoint markers */}
          {fromBuilding && mode === 'directions' && (
            <Marker position={[fromBuilding.lat, fromBuilding.lng]} icon={createEndpointIcon('from')}>
              <Popup><strong>Start:</strong> {fromBuilding.name}</Popup>
            </Marker>
          )}
          {toBuilding && mode === 'directions' && (
            <Marker position={[toBuilding.lat, toBuilding.lng]} icon={createEndpointIcon('to')}>
              <Popup><strong>End:</strong> {toBuilding.name}</Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Selected building panel (mobile explore) */}
        {selectedBuilding && mode === 'explore' && (
          <div className="map-bottom-panel">
            <button className="panel-close" onClick={() => setSelectedBuilding(null)}>✕</button>
            <div className="panel-content">
              <span className="panel-badge" style={{ background: categoryColors[selectedBuilding.category] }}>
                {selectedBuilding.category}
              </span>
              <h3>{selectedBuilding.name}</h3>
              <p className="panel-hours">🕐 {selectedBuilding.hours}</p>
              <div className="panel-actions">
                <button className="panel-btn-primary" onClick={() => navigate(`/directory/buildings/${selectedBuilding.id}`)}>
                  View Details
                </button>
                <button className="panel-btn-ghost" onClick={() => {
                  setMode('directions');
                  setToBuilding(selectedBuilding);
                  setToSearch(selectedBuilding.name);
                  setSelectedBuilding(null);
                }}>
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
