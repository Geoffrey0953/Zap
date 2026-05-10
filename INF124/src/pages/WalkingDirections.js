import React, { useState } from 'react';
import { BUILDINGS } from '../data/mockData';
import './WalkingDirections.css';

const MOCK_STEPS = [
  { icon: '↑', text: 'Head north on Ring Road toward Aldrich Park', dist: '0.1 mi' },
  { icon: '↰', text: 'Turn left onto the main walkway past the Student Center', dist: '0.2 mi' },
  { icon: '↑', text: 'Continue straight through Aldrich Park', dist: '0.3 mi' },
  { icon: '↱', text: 'Turn right toward Donald Bren Hall', dist: '0.1 mi' },
  { icon: '📍', text: 'Arrive at your destination', dist: '' },
];

export default function WalkingDirections() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const getSuggestions = (val) =>
    BUILDINGS.filter(b => b.name.toLowerCase().includes(val.toLowerCase()) && val.length > 1).slice(0, 4);

  const handleFromChange = (e) => {
    setFrom(e.target.value);
    setFromSuggestions(getSuggestions(e.target.value));
    setShowResults(false);
  };

  const handleToChange = (e) => {
    setTo(e.target.value);
    setToSuggestions(getSuggestions(e.target.value));
    setShowResults(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (from && to) setShowResults(true);
  };

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
        {showResults && (
          <div className="directions-results">
            <div className="directions-summary">
              <div className="summary-route">
                <span className="route-from">{from}</span>
                <span className="route-arrow">→</span>
                <span className="route-to">{to}</span>
              </div>
              <div className="summary-stats">
                <div className="dir-stat">
                  <span className="dir-stat-val">~0.7 mi</span>
                  <span className="dir-stat-label">Distance</span>
                </div>
                <div className="dir-stat">
                  <span className="dir-stat-val">~14 min</span>
                  <span className="dir-stat-label">Walking</span>
                </div>
                <div className="dir-stat">
                  <span className="dir-stat-val">~4 min</span>
                  <span className="dir-stat-label">By bike</span>
                </div>
              </div>
            </div>

            <div className="steps-list">
              <h3>Step-by-step</h3>
              {MOCK_STEPS.map((step, i) => (
                <div key={i} className="step-item">
                  <div className="step-icon-wrap">
                    <span className="step-icon">{step.icon}</span>
                    {i < MOCK_STEPS.length - 1 && <div className="step-line" />}
                  </div>
                  <div className="step-body">
                    <span className="step-text">{step.text}</span>
                    {step.dist && <span className="step-dist">{step.dist}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick popular routes */}
        {!showResults && (
          <div className="popular-routes">
            <h3>Popular routes</h3>
            <div className="popular-list">
              {POPULAR.map((r, i) => (
                <button key={i} className="popular-item"
                  onClick={() => { setFrom(r.from); setTo(r.to); setShowResults(true); }}>
                  <div className="popular-route-info">
                    <span className="popular-label">{r.from} → {r.to}</span>
                    <span className="popular-meta">{r.dist} · ~{r.time}</span>
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
  { from: 'Mesa Court Dining', to: 'Donald Bren Hall', dist: '0.5 mi', time: '10 min' },
  { from: 'Anteater Recreation Center', to: 'Langson Library', dist: '0.3 mi', time: '7 min' },
  { from: 'Student Center', to: 'Rowland Hall', dist: '0.4 mi', time: '8 min' },
  { from: 'Aldrich Park', to: 'Social Science Plaza A', dist: '0.2 mi', time: '4 min' },
];
