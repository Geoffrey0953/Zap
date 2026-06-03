import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBuildings } from '../hooks/useBuildings';
import './WalkingDirections.css';

export default function WalkingDirections() {
  const { buildings } = useBuildings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const toBuilding = useMemo(
    () => buildings.find(b => b.id === to || b.name.toLowerCase() === to.toLowerCase()),
    [buildings, to]
  );
  const fromBuilding = useMemo(
    () => buildings.find(b => b.id === from || b.name.toLowerCase() === from.toLowerCase()),
    [buildings, from]
  );

  // Pre-fill from URL query params
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

  const handleSearch = (e) => {
    e.preventDefault();
    // Nothing to show until real routing data available
  };

  const openInGoogleMaps = () => {
    if (!toBuilding) return;
    let url = `https://www.google.com/maps/dir/?api=1&destination=${toBuilding.lat},${toBuilding.lng}&destination_place_id=${encodeURIComponent(toBuilding.name)}`;
    if (fromBuilding) {
      url += `&origin=${fromBuilding.lat},${fromBuilding.lng}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const showResult = to;

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
                  placeholder="From: Your location or building"
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

          <button type="submit" className="directions-go-btn" disabled={!from || !to}>
            Get Directions
          </button>
        </form>

        {/* Results */}
        {showResult && (
          <div className="directions-results">
            <div className="directions-summary">
              <div className="summary-route">
                <span className="route-from">{from || 'Current location'}</span>
                <span className="route-arrow">→</span>
                <span className="route-to">{to}</span>
              </div>

              {toBuilding ? (
                <div className="result-card">
                  <div className="result-row">
                    <span className="result-label">From</span>
                    <span className="result-value">
                      {fromBuilding ? fromBuilding.name : 'Your location'}
                    </span>
                  </div>
                  <div className="result-row">
                    <span className="result-label">To</span>
                    <span className="result-value">{toBuilding.name}</span>
                  </div>
                  <div className="result-actions">
                    <button
                      className="action-btn primary"
                      onClick={openInGoogleMaps}
                    >
                      Open in Google Maps
                    </button>
                    <button
                      className="action-btn ghost"
                      onClick={() => navigate(`/map`)}
                    >
                      View on map
                    </button>
                  </div>
                </div>
              ) : (
                <div className="result-card">
                  <p className="result-hint">
                    Select a building from suggestions to get directions.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick popular routes */}
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
  { from: 'Mesa Court Dining', to: 'Donald Bren Hall' },
  { from: 'Anteater Recreation Center', to: 'Langson Library' },
  { from: 'Student Center', to: 'Rowland Hall' },
  { from: 'Aldrich Park', to: 'Social Science Plaza A' },
];