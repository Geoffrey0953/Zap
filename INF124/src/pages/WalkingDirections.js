import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useBuildings } from '../hooks/useBuildings';
import './WalkingDirections.css';

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, map]);
  return null;
}

export default function WalkingDirections() {
  const { buildings } = useBuildings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [route, setRoute] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toBuilding = useMemo(
    () => buildings.find(b => b.id === to || b.name.toLowerCase() === to.toLowerCase()),
    [buildings, to]
  );
  const fromBuilding = useMemo(
    () => buildings.find(b => b.id === from || b.name.toLowerCase() === from.toLowerCase()),
    [buildings, from]
  );

  useEffect(() => {
    const toParam = searchParams.get('to');
    const fromParam = searchParams.get('from');
    if (toParam) {
      const b = buildings.find(b => b.id === toParam);
      setTo(b ? b.name : toParam);
    }
    if (fromParam) {
      const b = buildings.find(b => b.id === fromParam);
      setFrom(b ? b.name : fromParam);
    }
  }, [searchParams, buildings]);

  const getSuggestions = (val) => {
    if (!val || val.length < 2) return [];
    return buildings
      .filter(b => b.name.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 4);
  };

  const handleFromChange = (e) => {
    setFrom(e.target.value);
    setFromSuggestions(getSuggestions(e.target.value));
  };

  const handleToChange = (e) => {
    setTo(e.target.value);
    setToSuggestions(getSuggestions(e.target.value));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!fromBuilding || !toBuilding) {
      setError('Please select both a starting building and a destination.');
      return;
    }

    setLoading(true);
    setError(null);
    setRoute(null);
    setSummary(null);

    try {
      const url = `https://router.project-osrm.org/route/v1/foot/${fromBuilding.lng},${fromBuilding.lat};${toBuilding.lng},${toBuilding.lat}?overview=full&geometries=geojson&steps=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Routing service returned ${res.status}`);
      const data = await res.json();
      if (data.code !== 'Ok' || !data.routes || !data.routes[0]) {
        throw new Error('No walking route found between those locations.');
      }
      const r = data.routes[0];
      const coords = r.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const steps = (r.legs[0]?.steps || []).map((s) => {
        const type = s.maneuver?.type || 'continue';
        const name = s.name || 'unnamed path';
        const meters = Math.round(s.distance || 0);
        return `${type.charAt(0).toUpperCase() + type.slice(1)} on ${name} (${meters} m)`;
      });
      setRoute(coords);
      setSummary({ distanceMeters: r.distance, durationSeconds: r.duration, steps });
    } catch (err) {
      setError(err.message || 'Failed to fetch directions.');
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    if (!toBuilding) return;
    let url = `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${toBuilding.lat},${toBuilding.lng}&destination_place_id=${encodeURIComponent(toBuilding.name)}`;
    if (fromBuilding) {
      url += `&origin=${fromBuilding.lat},${fromBuilding.lng}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const showResult = to;
  const distanceMi = summary ? (summary.distanceMeters * 0.000621371).toFixed(2) : null;
  const durationMin = summary ? Math.max(1, Math.round(summary.durationSeconds / 60)) : null;

  return (
    <div className="directions-page">
      <div className="directions-container">

        <div className="directions-header">
          <h1>Walking Directions</h1>
          <p>Navigate across UCI campus on foot</p>
        </div>

        {/* Input form */}
        <form className="directions-form" onSubmit={handleSearch}>
          <div className="direction-inputs">
            <div className="dir-input-wrap">
              <span className="dir-input-dot origin" />
              <div className="dir-input-inner">
                <input
                  type="text"
                  placeholder="From: Starting building"
                  value={from}
                  onChange={handleFromChange}
                  onBlur={() => setTimeout(() => setFromSuggestions([]), 150)}
                  className="dir-input"
                />
                {fromSuggestions.length > 0 && (
                  <div className="dir-suggestions">
                    {fromSuggestions.map(b => (
                      <button key={b.id} type="button" className="dir-suggestion"
                        onMouseDown={() => { setFrom(b.name); setFromSuggestions([]); }}>
                        📍 {b.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="dir-connector">
              <div className="connector-line" />
              <button type="button" className="swap-btn" onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }}>
                ⇅
              </button>
            </div>

            <div className="dir-input-wrap">
              <span className="dir-input-dot dest" />
              <div className="dir-input-inner">
                <input
                  type="text"
                  placeholder="To: Destination building"
                  value={to}
                  onChange={handleToChange}
                  onBlur={() => setTimeout(() => setToSuggestions([]), 150)}
                  className="dir-input"
                />
                {toSuggestions.length > 0 && (
                  <div className="dir-suggestions">
                    {toSuggestions.map(b => (
                      <button key={b.id} type="button" className="dir-suggestion"
                        onMouseDown={() => { setTo(b.name); setToSuggestions([]); }}>
                        📍 {b.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="directions-go-btn" disabled={!fromBuilding || !toBuilding || loading}>
            {loading ? 'Finding route…' : 'Get Directions'}
          </button>
        </form>

        {error && (
          <div className="directions-error">{error}</div>
        )}

        {showResult && route && summary && (
          <div className="directions-results">
            <div className="directions-summary">
              <div className="summary-route">
                <span className="route-from">{fromBuilding?.name || from}</span>
                <span className="route-arrow">→</span>
                <span className="route-to">{toBuilding?.name || to}</span>
              </div>

              <div className="summary-stats">
                <div className="stat-pill">
                  <span className="stat-label">Distance</span>
                  <span className="stat-value">{distanceMi} mi</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Walking</span>
                  <span className="stat-value">{durationMin} min</span>
                </div>
              </div>

              <div className="directions-map">
                <MapContainer
                  center={[fromBuilding.lat, fromBuilding.lng]}
                  zoom={16}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[fromBuilding.lat, fromBuilding.lng]} />
                  <Marker position={[toBuilding.lat, toBuilding.lng]} />
                  <Polyline positions={route} pathOptions={{ color: '#4ecda4', weight: 5 }} />
                  <FitBounds bounds={route} />
                </MapContainer>
              </div>

              <div className="result-actions">
                <button className="action-btn primary" onClick={openInGoogleMaps}>
                  Open in Google Maps
                </button>
                <button className="action-btn ghost" onClick={() => navigate(`/map`)}>
                  View on campus map
                </button>
              </div>

              {summary.steps.length > 0 && (
                <details className="steps-details">
                  <summary>Step-by-step ({summary.steps.length})</summary>
                  <ol className="steps-list">
                    {summary.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </details>
              )}
            </div>
          </div>
        )}

        {!showResult && (
          <div className="popular-routes">
            <h3>Popular routes</h3>
            <div className="popular-list">
              {POPULAR.map((r, i) => (
                <button key={i} className="popular-item"
                  onClick={() => { setFrom(r.from); setTo(r.to); }}>
                  <div className="popular-route-info">
                    <span className="popular-label">{r.from} → {r.to}</span>
                    <span className="popular-meta">Tap to plan route</span>
                  </div>
                  <span className="popular-arrow">›</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const POPULAR = [
  { from: 'Mesa Court Housing', to: 'Donald Bren Hall' },
  { from: 'Anteater Recreation Center', to: 'Langson Library' },
  { from: 'Student Center', to: 'Rowland Hall' },
  { from: 'Aldrich Park', to: 'Social Science Plaza A' },
];
